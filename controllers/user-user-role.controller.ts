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
  UserRole,
} from '../models';
import {UserRepository} from '../repositories';

export class UserUserRoleController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/user-roles', {
    responses: {
      '200': {
        description: 'Array of User has many UserRole',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(UserRole)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<UserRole>,
  ): Promise<UserRole[]> {
    return this.userRepository.userRoles(id).find(filter);
  }

  @post('/users/{id}/user-roles', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserRole)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserRole, {
            title: 'NewUserRoleInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) userRole: Omit<UserRole, 'id'>,
  ): Promise<UserRole> {
    return this.userRepository.userRoles(id).create(userRole);
  }

  @patch('/users/{id}/user-roles', {
    responses: {
      '200': {
        description: 'User.UserRole PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserRole, {partial: true}),
        },
      },
    })
    userRole: Partial<UserRole>,
    @param.query.object('where', getWhereSchemaFor(UserRole)) where?: Where<UserRole>,
  ): Promise<Count> {
    return this.userRepository.userRoles(id).patch(userRole, where);
  }

  @del('/users/{id}/user-roles', {
    responses: {
      '200': {
        description: 'User.UserRole DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(UserRole)) where?: Where<UserRole>,
  ): Promise<Count> {
    return this.userRepository.userRoles(id).delete(where);
  }
}
