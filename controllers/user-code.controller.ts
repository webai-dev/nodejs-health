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
  param,
  patch,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import {isEmpty} from 'lodash';
import {MailerServiceBindings, PasswordHasherBindings} from '../keys';
import {UserCode} from '../models';
import {
  UserCodeRepository,
  UserCredentialRepository,
  UserRepository,
} from '../repositories';
import {PasswordHasher} from '../services/hash.password.bcryptjs';
import {MailerService} from '../services/mailer';
import {validateCredentials} from '../services/validator';

export class UserCodeController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialRepository)
    public userCredRepository: UserCredentialRepository,
    @repository(UserCodeRepository)
    public userCodeRepository: UserCodeRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(MailerServiceBindings.MAIL_SERVICE)
    public mailerService: MailerService,
  ) {}

  async sendVerificationEmail(email: string, code: number) {
    try {
      const result = await this.mailerService.sendMail({
        to: email,
        from: 'michael@weapp.se',
        subject: 'Verification',
        html: `<p>Your verification code is ${code}</p>`,
      });
    } catch (e) {
      console.log(e);
    }
  }

  createUserCode(email: string) {
    const code = Math.floor(1000 + Math.random() * 9000);
    this.sendVerificationEmail(email, code);
    return code;
  }

  @post('/user-codes', {
    responses: {
      '200': {
        description: 'UserCode model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserCode)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCode, {
            title: 'NewUserCode',
            exclude: ['id', 'createdAt', 'code', 'userId'],
          }),
        },
      },
    })
    userCode: Omit<UserCode, 'id'>,
  ): Promise<any> {
    const user = (
      await this.userRepository.find({where: {email: userCode.email}})
    )[0];
    if (!isEmpty(user)) {
      userCode['userId'] = user.id;
      userCode['code'] = this.createUserCode(user.email);
      userCode['createdAt'] = new Date();
      return this.userCodeRepository.create(userCode);
    }
    return {success: false, message: 'Email not found!'};
  }

  @get('/user-codes/count', {
    responses: {
      '200': {
        description: 'UserCode model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(UserCode) where?: Where<UserCode>): Promise<Count> {
    return this.userCodeRepository.count(where);
  }

  @get('/user-codes', {
    responses: {
      '200': {
        description: 'Array of UserCode model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(UserCode, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(UserCode) filter?: Filter<UserCode>,
  ): Promise<UserCode[]> {
    return this.userCodeRepository.find(filter);
  }

  @patch('/user-codes', {
    responses: {
      '200': {
        description: 'UserCode PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCode, {partial: true}),
        },
      },
    })
    userCode: UserCode,
    @param.where(UserCode) where?: Where<UserCode>,
  ): Promise<Count> {
    return this.userCodeRepository.updateAll(userCode, where);
  }

  @post('/user-codes/{id}', {
    responses: {
      '200': {
        description: 'UserCode model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserCode, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCode, {
            title: 'FindCode',
            exclude: ['createdAt', 'id', 'email'],
          }),
        },
      },
    })
    codeParams: UserCode,
    @param.path.number('id') id: number,
    @param.filter(UserCode, {exclude: 'where'})
    filter?: FilterExcludingWhere<UserCode>,
  ): Promise<any> {
    const userCode = (await this.userCodeRepository.find({where: {id}}))[0];
    if (userCode.code === codeParams.code) {
      const userCredential = (
        await this.userCredRepository.find({where: {userId: userCode.userId}})
      )[0];
      validateCredentials({
        email: '',
        password: codeParams.password,
      });
      const password = await this.passwordHasher.hashPassword(
        codeParams.password,
      );
      const data = {
        id: userCredential.id,
        password,
        userId: codeParams.userId,
      };
      await this.userCredRepository.updateById(userCredential.id, data);
      return {success: true, message: 'Password Updated Successfully !'};
    }
    return {success: false, message: 'Invalid OTP !'};
  }

  @patch('/user-codes/{id}', {
    responses: {
      '204': {
        description: 'UserCode PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCode, {partial: true}),
        },
      },
    })
    userCode: UserCode,
  ): Promise<void> {
    await this.userCodeRepository.updateById(id, userCode);
  }

  @put('/user-codes/{id}', {
    responses: {
      '204': {
        description: 'UserCode PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() userCode: UserCode,
  ): Promise<void> {
    await this.userCodeRepository.replaceById(id, userCode);
  }

  @del('/user-codes/{id}', {
    responses: {
      '204': {
        description: 'UserCode DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userCodeRepository.deleteById(id);
  }
}
