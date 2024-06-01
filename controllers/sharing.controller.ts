import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';

import {
  AuthenticationBindings,
  authenticate
} from '@loopback/authentication';
import {UserProfile} from '@loopback/security';
import { inject } from '@loopback/core';

import {
  MailerServiceBindings,
} from '../keys';
import {MailerService} from '../services/mailer';

import {Sharing} from '../models';
import {SharingRepository, SharingTokenRepository, UserRepository, UserRoleRepository, TwilioChatChannelRepository} from '../repositories';
import { USER_ROLES } from '../constants';

import { App as AppConfig } from '../config';

export class SharingController {
  constructor(
    @repository(SharingRepository)
    public sharingRepository : SharingRepository,
    @repository(SharingTokenRepository)
    public sharingTokenRepository : SharingTokenRepository,
    @repository(UserRepository)
    public userRepository : UserRepository,
    @repository(UserRoleRepository)
    public userRoleRepository : UserRoleRepository,
    @repository(TwilioChatChannelRepository)
    public twilioChatChannelRepository : TwilioChatChannelRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true })
    private user: UserProfile,
    @inject(MailerServiceBindings.MAIL_SERVICE)
    public mailerService: MailerService,
  ) {}

  @post('/sharings', {
    operationId: 'createSharing',
    responses: {
      '200': {
        description: 'Sharing model instance',
        content: {'application/json': {schema: getModelSchemaRef(Sharing)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Sharing, {
            title: 'NewSharing',
            exclude: ['id'],
          }),
        },
      },
    })
    sharing: Omit<Sharing, 'id'>,
  ): Promise<Sharing> {
    const user = await this.userRepository.findById(this.user.id);
    const providers = await this.userRepository.find({ where: { email: sharing.email } });
    let twilioChatChannel;

    if (providers.length) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      twilioChatChannel = await this.twilioChatChannelRepository.create({
        channelId: `${this.user.id}-${providers[0].id}-${code}`,
      });
    }
    
    const newSharing = await this.sharingRepository.create({
      ...sharing, 
      userId: this.user.id, 
      providerId: providers.length ? providers[0].id : undefined,
      twilioChatChannelId: twilioChatChannel ? twilioChatChannel.id : undefined,
    });

    const mailData = {
      to: sharing.email,
      from: 'Weapp AB<michael@weapp.se>',
      subject: 'Invitation',
      html: `${user.firstName} ${user.lastName} has invited you to collaborate.`,
    };

    if (providers.length) {
      await this.userRoleRepository.create({
        userId: providers[0].id,
        roleId: USER_ROLES.PROVIDER,
      });

      this.mailerService.sendMail({
        to: sharing.email,
        from: 'Weapp AB<michael@weapp.se>',
        subject: 'Invitation',
        html: `${user.firstName} ${user.lastName} has invited you to collaborate.`,
      });
    } else {
      const token = Buffer.from(`${sharing.email}&${sharing.name}&${newSharing.id}`).toString('base64');

      mailData.html = `${mailData.html} <a href="${AppConfig.DASHBOARD_URL}/provider/register?token=${token}">Click here to create an account</a>`;
      
      await this.sharingTokenRepository.create({
        sharingId: newSharing.id,
        token,
      });
    }

    this.mailerService.sendMail(mailData);
    
    return Promise.resolve(newSharing);
  }

  @get('/sharings/count', {
    responses: {
      '200': {
        description: 'Sharing model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Sharing) where?: Where<Sharing>,
  ): Promise<Count> {
    return this.sharingRepository.count(where);
  }

  @get('/sharings', {
    operationId: 'sharings',
    responses: {
      '200': {
        description: 'Array of Sharing model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Sharing, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(Sharing, { name: 'SharingsFilter' }) filter?: Filter<Sharing>,
  ): Promise<Sharing[]> {
    return this.sharingRepository.find(filter);
  }

  @patch('/sharings', {
    responses: {
      '200': {
        description: 'Sharing PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Sharing, {partial: true}),
        },
      },
    })
    sharing: Sharing,
    @param.where(Sharing) where?: Where<Sharing>,
  ): Promise<Count> {
    return this.sharingRepository.updateAll(sharing, where);
  }

  @get('/sharings/{id}', {
    operationId: 'sharing',
    responses: {
      '200': {
        description: 'Sharing model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Sharing, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Sharing, {exclude: 'where', name: 'SharingFilter'}) filter?: FilterExcludingWhere<Sharing>
  ): Promise<Sharing> {
    return this.sharingRepository.findById(id, filter);
  }

  @patch('/sharings/{id}', {
    operationId: 'updateSharing',
    responses: {
      '204': {
        description: 'Note PATCH success',
        content: {'application/json': {schema: getModelSchemaRef(Sharing, { includeRelations: true })}},
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Sharing, {partial: true}),
        },
      },
    })
    sharing: Sharing,
  ): Promise<void> {
    await this.sharingRepository.updateById(id, sharing);
  }

  @put('/sharings/{id}', {
    responses: {
      '204': {
        description: 'Sharing PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() sharing: Sharing,
  ): Promise<void> {
    await this.sharingRepository.replaceById(id, sharing);
  }

  @del('/sharings/{id}', {
    operationId: 'deleteSharing',
    responses: {
      '204': {
        description: 'Note DELETE success',
        content: {'application/json': {
          schema: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
              }
            }
          }
        }},
      },
    },
  })
  @authenticate('jwt')
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.sharingRepository.deleteById(id);
  }
}
