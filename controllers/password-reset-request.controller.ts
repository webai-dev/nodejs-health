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
  HttpErrors,
} from '@loopback/rest';
import { inject } from '@loopback/core';

import {PasswordResetRequest, User} from '../models';
import {PasswordResetRequestRepository, UserRepository} from '../repositories';

import {
  MailerServiceBindings,
} from '../keys';
import {MailerService} from '../services/mailer';

import { App as AppConfig } from '../config';

export class PasswordResetRequestController {
  constructor(
    @repository(PasswordResetRequestRepository)
    public passwordResetRequestRepository : PasswordResetRequestRepository,
    @repository(UserRepository)
    public userRepository : UserRepository,
    @inject(MailerServiceBindings.MAIL_SERVICE)
    public mailerService: MailerService,
  ) {}

  @post('/password-reset-requests', {
    responses: {
      '200': {
        description: 'PasswordResetRequest model instance',
        content: {'application/json': {schema: getModelSchemaRef(PasswordResetRequest)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
              }
            }
          }
        }
      },
    })
    passwordResetRequest: Omit<PasswordResetRequest, 'id'>,
    @param.header.string('Referer') referer: string,
  ): Promise<any> {
    const { email } = passwordResetRequest;
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      const [__, ___, ____, role, ______] = referer.split('/');
      const token = Buffer.from(email).toString('base64');
      const mailData = {
        to: passwordResetRequest.email,
        from: 'Weapp AB<michael@weapp.se>',
        subject: 'Reset Password',
        html: `Please click <a href="${AppConfig.DASHBOARD_URL}/${role}/reset-password?token=${token}">here</a> to reset password`,
      };
      
      this.mailerService.sendMail(mailData);
  
      return this.passwordResetRequestRepository.create({
        userId: user.id,
        token,
        date: (new Date()).toString(),
      });
    } else {
      throw new HttpErrors.NotFound(`Email ${email} does not exist`);
    }
  }

  @get('/password-reset-requests/count', {
    responses: {
      '200': {
        description: 'PasswordResetRequest model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(PasswordResetRequest) where?: Where<PasswordResetRequest>,
  ): Promise<Count> {
    return this.passwordResetRequestRepository.count(where);
  }

  @get('/password-reset-requests', {
    responses: {
      '200': {
        description: 'Array of PasswordResetRequest model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(PasswordResetRequest, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(PasswordResetRequest) filter?: Filter<PasswordResetRequest>,
  ): Promise<PasswordResetRequest[]> {
    return this.passwordResetRequestRepository.find(filter);
  }

  @patch('/password-reset-requests', {
    responses: {
      '200': {
        description: 'PasswordResetRequest PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PasswordResetRequest, {partial: true}),
        },
      },
    })
    passwordResetRequest: PasswordResetRequest,
    @param.where(PasswordResetRequest) where?: Where<PasswordResetRequest>,
  ): Promise<Count> {
    return this.passwordResetRequestRepository.updateAll(passwordResetRequest, where);
  }

  @get('/password-reset-requests/{id}', {
    responses: {
      '200': {
        description: 'PasswordResetRequest model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(PasswordResetRequest, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(PasswordResetRequest, {exclude: 'where'}) filter?: FilterExcludingWhere<PasswordResetRequest>
  ): Promise<PasswordResetRequest> {
    return this.passwordResetRequestRepository.findById(id, filter);
  }

  @patch('/password-reset-requests/{id}', {
    responses: {
      '204': {
        description: 'PasswordResetRequest PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PasswordResetRequest, {partial: true}),
        },
      },
    })
    passwordResetRequest: PasswordResetRequest,
  ): Promise<void> {
    await this.passwordResetRequestRepository.updateById(id, passwordResetRequest);
  }

  @put('/password-reset-requests/{id}', {
    responses: {
      '204': {
        description: 'PasswordResetRequest PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() passwordResetRequest: PasswordResetRequest,
  ): Promise<void> {
    await this.passwordResetRequestRepository.replaceById(id, passwordResetRequest);
  }

  @del('/password-reset-requests/{id}', {
    responses: {
      '204': {
        description: 'PasswordResetRequest DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.passwordResetRequestRepository.deleteById(id);
  }
}
