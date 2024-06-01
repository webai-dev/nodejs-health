import {
  AuthenticationBindings,
  TokenService,
  UserService,
} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  Request,
  requestBody,
  RequestContext,
  RestBindings,
} from '@loopback/rest';
import {Credential, UserProfile} from '@loopback/security';
import _ from 'lodash';
import {
  MailerServiceBindings,
  PasswordHasherBindings,
  TokenServiceBindings,
  UserServiceBindings,
} from '../keys';
import {User} from '../models';
import {
  PasswordResetRequestRepository,
  SharingRepository,
  SharingTokenRepository,
  TwilioChatChannelRepository,
  UserBaselineRepository,
  UserCharacteristicsRepository,
  UserCodeRepository,
  UserRepository,
  UserRoleRepository,
} from '../repositories';
import {PasswordHasher} from '../services/hash.password.bcryptjs';
import {MailerService} from '../services/mailer';
import {validateCredentials} from '../services/validator';

import { USER_ROLES } from '../constants';

const CredentialsSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class UserController {
  constructor(
    @repository(PasswordResetRequestRepository)
    public passwordResetRequestRepository: PasswordResetRequestRepository,
    @repository(SharingRepository)
    public sharingRepository: SharingRepository,
    @repository(SharingTokenRepository)
    public sharingTokenRepository: SharingTokenRepository,
    @repository(TwilioChatChannelRepository)
    public twilioChatChannelRepository: TwilioChatChannelRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserRoleRepository)
    public userRoleRepository: UserRoleRepository,
    @repository(UserCharacteristicsRepository)
    public userCharacteristicsRepository: UserCharacteristicsRepository,
    @repository(UserBaselineRepository)
    public userBaselineRepository: UserBaselineRepository,
    @repository(UserCodeRepository)
    public userCodeRepository: UserCodeRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credential>,
    @inject(AuthenticationBindings.CURRENT_USER, {optional: true})
    private user: UserProfile,
    @inject(RestBindings.Http.REQUEST)
    public request: Request,
    @inject.context()
    public context: RequestContext,
    @inject(MailerServiceBindings.MAIL_SERVICE)
    public mailerService: MailerService,
  ) {}

  async sendVerificationEmail(email: string, code: string) {
    try {
      const result = await this.mailerService.sendMail({
        to: email,
        from: 'Weapp AB<michael@weapp.se>',
        subject: 'Verification',
        html: `<p>Your verification code is ${code}</p>`,
      });
    } catch (e) {
      console.log(e);
    }
  }
  createUserCode(email: string) {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    this.sendVerificationEmail(email, code);
    return code;
  }

  @post('/users', {
    operationId: 'createUser',
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @requestBody({
      // content: {
      //   'application/json': {
      //     schema: getModelSchemaRef(User, {
      //       title: 'NewUser',
      //       exclude: ['id'],
      //     }),
      //   },
      // },
    })
    user: Omit<User, 'id'>,
    @param.header.string('Referer') referer: string,
    @param.header.string('SharingToken') sharingToken: string,
  ): Promise<any> {
    validateCredentials(_.pick(user, ['email', 'password']));
    
    const date = `${new Date()}`;
    const [__, ___, ____, role, ______] = referer.split('/');
    const password = await this.passwordHasher.hashPassword(user.password);
    const roleId = USER_ROLES[role.toUpperCase()];


    if (!user.code) {
      if (roleId !== USER_ROLES.PROVIDER) {
        const verificationCode = this.userCodeRepository.create({
          email: user.email,
          userId: -1,
          createdAt: date,
          code: this.createUserCode(user.email),
        });
        return verificationCode;
      }
    }

    if (roleId !== USER_ROLES.PROVIDER) {
      const userCode = (
        await this.userCodeRepository.find({where: {id: user.codeId}})
      )[0];
      if (userCode.code !== user.code || userCode.email !== user.email) {
        return {
          success: false,
          message: 'Verification Code is Incorrect, Please try again!',
        };
      }
    }

    try {
      const newUser = new User();
      newUser['email'] = user.email;
      newUser['firstName'] = user.firstName;
      newUser['lastName'] = user.lastName;
      newUser['dateRegistered'] = date;
      newUser['emailVerifiedAt'] = date;
      newUser['versionOfTermsAccepted'] = date;

      const savedUser = await this.userRepository.create(newUser);
      // set the password
      await this.userRepository.userCredential(savedUser.id).create({password});

      if (roleId) {
        await this.userRoleRepository.create({
          userId: savedUser.id,
          roleId,
        });

        if (roleId === USER_ROLES.PROVIDER) {
          const token = await this.sharingTokenRepository.find({ where: {token: sharingToken}});

          if (token.length) {
            const sharing = await this.sharingRepository.findById(token[0].sharingId);
            const code = Math.floor(100000 + Math.random() * 900000).toString();

            const twilioChatChannel = await this.twilioChatChannelRepository.create({
              channelId: `${sharing.userId}-${savedUser.id}-${code}`,
            })
            await this.sharingRepository.updateById(sharing.id, {
              providerId: savedUser.id,
              twilioChatChannelId: twilioChatChannel.id
            });
          }
        }

        await this.userRoleRepository.create({
          userId: savedUser.id,
          roleId: USER_ROLES.PATIENT,
        });
      }

      return savedUser;
    } catch (error) {
      if (error.code === 11000 && error.errmsg.includes('index: uniqueEmail')) {
        throw new HttpErrors.Conflict('Email value is already taken');
      } else if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpErrors.Conflict('Email is already registered');
      } else {
        throw error;
      }
    }
  }

  @get('/users/count', {
    operationId: 'usersCount',
    responses: {
      '200': {
        description: 'User model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(User) where?: Where<User>): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users', {
    operationId: 'users',
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(User, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(User, {name: 'UsersFilter'}) filter?: Filter<User>): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/users', {
    responses: {
      '200': {
        description: 'User PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}', {
    operationId: 'user',
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(User, {exclude: 'where', name: 'UserFilter'}) filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}', {
    operationId: 'updateUser',
    responses: {
      '204': {
        description: 'User PATCH success',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {includeRelations: true}),
          },
        },
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}', {
    responses: {
      '204': {
        description: 'User PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}', {
    operationId: 'deleteUser',
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userRepository.deleteById(id);
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credential,
    @param.header.string('Referer') referer: string,
  ): Promise<any> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    const [_, __, ___, role, _____] = referer.split('/');
    const roleId = USER_ROLES[role.toUpperCase()];

    const roleIds = (await this.userRoleRepository.find({
      where: { userId: user.id }
    })).map(userRole => userRole.roleId);

    if (roleId && !roleIds.includes(roleId)) {
      throw new HttpErrors.Forbidden(`You are not allowed to login with ${role} role`);
    }

    // if (!user.emailVerifiedAt) {
    //   this.sendVerificationEmail(user);
    //   return { success: false, user, error: 'email_not_verified' };
    // }

    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    const userBaseline = (
      await this.userBaselineRepository.find({where: {userId: user.id}})
    )[0];

    return {
      success: true,
      token,
      userId: user.id,
      onboardingCompleted: userBaseline?.onboardingCompleted ?? false,
    };
  }

  @post('/users/verify-code', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                },
              },
            },
          },
        },
      },
    },
  })
  async verifyCode(
    @requestBody({
      description: 'The input of login function',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['userId', 'code'],
            properties: {
              userId: {
                type: 'number',
              },
              code: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    request: any,
  ): Promise<{success: boolean}> {
    const userCode = await this.userCodeRepository.findOne({
      where: {userId: request.userId},
      order: ['id DESC'],
    });

    if (userCode && userCode.code === request.code) {
      await this.userRepository.updateById(request.userId, {
        emailVerifiedAt: new Date().toString(),
      });
      return {success: true};
    } else {
      throw new HttpErrors.Forbidden('code_mismatch');
    }
  }

  @post('/users/reset-password', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                },
              },
            },
          },
        },
      },
    },
  })
  async resetPassword(
    @requestBody({
      description: 'The input of login function',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: {
                type: 'string',
              },
              password: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    request: any,
    @param.header.string('Referer') referer: string,
  ): Promise<{success: boolean}> {
    const { email, password } = request;
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      const newPassword = await this.passwordHasher.hashPassword(password);
      await this.userRepository.userCredential(user.id).delete();
      await this.userRepository.userCredential(user.id).create({ password: newPassword });

      return Promise.resolve({ success: true });
    }

    throw new HttpErrors.NotFound('User not found'); 
  }

  @get('/viewer', {
    operationId: 'viewer',
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {includeRelations: true}),
          },
        },
      },
    },
  })
  async getViewer(
    @param.header.string('Authorization') token: string,
    @param.filter(User, {name: 'viewerFilter'}) filter?: Filter<User>,
  ): Promise<User> {
    let userProfile;

    try {
      userProfile = await this.jwtService.verifyToken(
        token.replace('Bearer ', ''),
      );
    } catch (e) {
      throw new HttpErrors.Unauthorized(`Error verifying token : ${e.message}`);
    }

    return this.userRepository.findById(userProfile.id, filter);
  }
}
