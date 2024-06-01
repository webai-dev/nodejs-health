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
  Role,
  UserRole,
} from '../models';
import {RoleRepository} from '../repositories';

export class RoleUserRoleController {
  constructor(
    @repository(RoleRepository) protected roleRepository: RoleRepository,
  ) { }

  @get('/roles/{id}/user-roles', {
    responses: {
      '200': {
        description: 'Array of Role has many UserRole',
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
    return this.roleRepository.userRoles(id).find(filter);
  }

  @post('/roles/{id}/user-roles', {
    responses: {
      '200': {
        description: 'Role model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserRole)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Role.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserRole, {
            title: 'NewUserRoleInRole',
            exclude: ['id'],
            optional: ['roleId']
          }),
        },
      },
    }) userRole: Omit<UserRole, 'id'>,
  ): Promise<UserRole> {
    return this.roleRepository.userRoles(id).create(userRole);
  }

  @patch('/roles/{id}/user-roles', {
    responses: {
      '200': {
        description: 'Role.UserRole PATCH success count',
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
    return this.roleRepository.userRoles(id).patch(userRole, where);
  }

  @del('/roles/{id}/user-roles', {
    responses: {
      '200': {
        description: 'Role.UserRole DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(UserRole)) where?: Where<UserRole>,
  ): Promise<Count> {
    return this.roleRepository.userRoles(id).delete(where);
  }
}
