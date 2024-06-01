import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  User,
  PasswordResetRequest,
} from '../models';
import {UserRepository} from '../repositories';

export class UserPasswordResetRequestController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/password-reset-requests', {
    responses: {
      '200': {
        description: 'Array of User has many PasswordResetRequest',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(PasswordResetRequest)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<PasswordResetRequest>,
  ): Promise<PasswordResetRequest[]> {
    return this.userRepository.passwordResetRequests(id).find(filter);
  }

  @post('/users/{id}/password-reset-requests', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(PasswordResetRequest)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PasswordResetRequest, {
            title: 'NewPasswordResetRequestInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) passwordResetRequest: Omit<PasswordResetRequest, 'id'>,
  ): Promise<PasswordResetRequest> {
    return this.userRepository.passwordResetRequests(id).create(passwordResetRequest);
  }

  @patch('/users/{id}/password-reset-requests', {
    responses: {
      '200': {
        description: 'User.PasswordResetRequest PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PasswordResetRequest, {partial: true}),
        },
      },
    })
    passwordResetRequest: Partial<PasswordResetRequest>,
    @param.query.object('where', getWhereSchemaFor(PasswordResetRequest)) where?: Where<PasswordResetRequest>,
  ): Promise<Count> {
    return this.userRepository.passwordResetRequests(id).patch(passwordResetRequest, where);
  }

  @del('/users/{id}/password-reset-requests', {
    responses: {
      '200': {
        description: 'User.PasswordResetRequest DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(PasswordResetRequest)) where?: Where<PasswordResetRequest>,
  ): Promise<Count> {
    return this.userRepository.passwordResetRequests(id).delete(where);
  }
}
