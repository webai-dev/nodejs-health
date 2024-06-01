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
import {UserRole} from '../models';
import {UserRoleRepository} from '../repositories';

export class UserRoleController {
  constructor(
    @repository(UserRoleRepository)
    public userRoleRepository : UserRoleRepository,
  ) {}

  @post('/user-roles', {
    responses: {
      '200': {
        description: 'UserRole model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserRole)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserRole, {
            title: 'NewUserRole',
            exclude: ['id'],
          }),
        },
      },
    })
    userRole: Omit<UserRole, 'id'>,
  ): Promise<UserRole> {
    return this.userRoleRepository.create(userRole);
  }

  @get('/user-roles/count', {
    responses: {
      '200': {
        description: 'UserRole model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(UserRole) where?: Where<UserRole>,
  ): Promise<Count> {
    return this.userRoleRepository.count(where);
  }

  @get('/user-roles', {
    responses: {
      '200': {
        description: 'Array of UserRole model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(UserRole, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(UserRole) filter?: Filter<UserRole>,
  ): Promise<UserRole[]> {
    return this.userRoleRepository.find(filter);
  }

  @patch('/user-roles', {
    responses: {
      '200': {
        description: 'UserRole PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserRole, {partial: true}),
        },
      },
    })
    userRole: UserRole,
    @param.where(UserRole) where?: Where<UserRole>,
  ): Promise<Count> {
    return this.userRoleRepository.updateAll(userRole, where);
  }

  @get('/user-roles/{id}', {
    responses: {
      '200': {
        description: 'UserRole model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserRole, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(UserRole, {exclude: 'where'}) filter?: FilterExcludingWhere<UserRole>
  ): Promise<UserRole> {
    return this.userRoleRepository.findById(id, filter);
  }

  @patch('/user-roles/{id}', {
    responses: {
      '204': {
        description: 'UserRole PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserRole, {partial: true}),
        },
      },
    })
    userRole: UserRole,
  ): Promise<void> {
    await this.userRoleRepository.updateById(id, userRole);
  }

  @put('/user-roles/{id}', {
    responses: {
      '204': {
        description: 'UserRole PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() userRole: UserRole,
  ): Promise<void> {
    await this.userRoleRepository.replaceById(id, userRole);
  }

  @del('/user-roles/{id}', {
    responses: {
      '204': {
        description: 'UserRole DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userRoleRepository.deleteById(id);
  }
}
