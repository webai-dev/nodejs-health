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

import {Cholesterol} from '../models';
import {CholesterolRepository, UserRoleRepository} from '../repositories';

import { USER_ROLES } from '../constants';

export class CholesterolController {
  constructor(
    @repository(CholesterolRepository)
    public cholesterolRepository : CholesterolRepository,
    @repository(UserRoleRepository)
    public userRoleRepository : UserRoleRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true })
    private user: UserProfile,
  ) {}

  @post('/cholesterols', {
    operationId: 'createCholesterol',
    responses: {
      '200': {
        description: 'Cholesterol model instance',
        content: {'application/json': {schema: getModelSchemaRef(Cholesterol)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cholesterol, {
            title: 'NewCholesterol',
            exclude: ['id'],
          }),
        },
      },
    })
    cholesterol: Omit<Cholesterol, 'id'>,
  ): Promise<Cholesterol> {
    return this.cholesterolRepository.create({...cholesterol, userId: cholesterol.userId || this.user.id});
  }

  @get('/cholesterols/count', {
    operationId: 'cholesterolsCount',
    responses: {
      '200': {
        description: 'Cholesterol model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Cholesterol) where?: Where<Cholesterol>,
  ): Promise<Count> {
    return this.cholesterolRepository.count(where);
  }

  @get('/cholesterols', {
    operationId: 'cholesterols',
    responses: {
      '200': {
        description: 'Array of Cholesterol model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Cholesterol, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(Cholesterol, {name: 'CholesterolsFilter'}) filter?: Filter<Cholesterol>,
  ): Promise<Cholesterol[]> {
    const userRoles = await this.userRoleRepository.find({ where: { userId: this.user.id }});
    const userRoleIds = userRoles.map(userRole => userRole.roleId);

    if (userRoleIds.includes(USER_ROLES.ADMINISTRATOR) || userRoleIds.includes(USER_ROLES.PROVIDER)) {
      return this.cholesterolRepository.find(filter);
    }

    return this.cholesterolRepository.find({...filter, where: {...filter?.where, userId: this.user.id}});
  }

  @patch('/cholesterols', {
    responses: {
      '200': {
        description: 'Cholesterol PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cholesterol, {partial: true}),
        },
      },
    })
    cholesterol: Cholesterol,
    @param.where(Cholesterol) where?: Where<Cholesterol>,
  ): Promise<Count> {
    return this.cholesterolRepository.updateAll(cholesterol, where);
  }

  @get('/cholesterols/{id}', {
    responses: {
      '200': {
        description: 'Cholesterol model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Cholesterol, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Cholesterol, {exclude: 'where'}) filter?: FilterExcludingWhere<Cholesterol>
  ): Promise<Cholesterol> {
    return this.cholesterolRepository.findById(id, filter);
  }

  @patch('/cholesterols/{id}', {
    operationId: 'updateCholesterol',
    responses: {
      '204': {
        description: 'Cholesterol PATCH success',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Cholesterol, {includeRelations: true}),
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
          schema: getModelSchemaRef(Cholesterol, {partial: true}),
        },
      },
    })
    cholesterol: Cholesterol,
  ): Promise<void> {
    await this.cholesterolRepository.updateById(id, cholesterol);
  }

  @put('/cholesterols/{id}', {
    responses: {
      '204': {
        description: 'Cholesterol PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() cholesterol: Cholesterol,
  ): Promise<void> {
    await this.cholesterolRepository.replaceById(id, cholesterol);
  }

  @del('/cholesterols/{id}', {
    operationId: 'deleteCholesterol',
    responses: {
      '204': {
        description: 'Cholesterol DELETE success',
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
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.cholesterolRepository.deleteById(id);
  }
}
