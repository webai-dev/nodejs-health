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
  UserLogin,
} from '../models';
import {UserRepository} from '../repositories';

export class UserUserLoginController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/user-logins', {
    responses: {
      '200': {
        description: 'Array of User has many UserLogin',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(UserLogin)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<UserLogin>,
  ): Promise<UserLogin[]> {
    return this.userRepository.userLogins(id).find(filter);
  }

  @post('/users/{id}/user-logins', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserLogin)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserLogin, {
            title: 'NewUserLoginInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) userLogin: Omit<UserLogin, 'id'>,
  ): Promise<UserLogin> {
    return this.userRepository.userLogins(id).create(userLogin);
  }

  @patch('/users/{id}/user-logins', {
    responses: {
      '200': {
        description: 'User.UserLogin PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserLogin, {partial: true}),
        },
      },
    })
    userLogin: Partial<UserLogin>,
    @param.query.object('where', getWhereSchemaFor(UserLogin)) where?: Where<UserLogin>,
  ): Promise<Count> {
    return this.userRepository.userLogins(id).patch(userLogin, where);
  }

  @del('/users/{id}/user-logins', {
    responses: {
      '200': {
        description: 'User.UserLogin DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(UserLogin)) where?: Where<UserLogin>,
  ): Promise<Count> {
    return this.userRepository.userLogins(id).delete(where);
  }
}
