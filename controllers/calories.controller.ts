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

import {Calories} from '../models';
import {CaloriesRepository, UserRoleRepository} from '../repositories';

import { USER_ROLES } from '../constants';

export class CaloriesController {
  constructor(
    @repository(CaloriesRepository)
    public caloriesRepository : CaloriesRepository,
    @repository(UserRoleRepository)
    public userRoleRepository : UserRoleRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true })
    private user: UserProfile,
  ) {}

  @post('/calories', {
    operationId: 'createCalorie',
    responses: {
      '200': {
        description: 'Calories model instance',
        content: {'application/json': {schema: getModelSchemaRef(Calories)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Calories, {
            title: 'NewCalorie',
            exclude: ['id'],
          }),
        },
      },
    })
    calories: Omit<Calories, 'id'>,
  ): Promise<Calories> {
    return this.caloriesRepository.create({...calories, userId: calories.userId || this.user.id});
  }

  @get('/calories/count', {
    operationId: 'caloriesCount',
    responses: {
      '200': {
        description: 'Calories model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Calories) where?: Where<Calories>,
  ): Promise<Count> {
    return this.caloriesRepository.count(where);
  }

  @get('/calories', {
    operationId: 'calories',
    responses: {
      '200': {
        description: 'Array of Calories model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Calories, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(Calories, {name: 'CaloriesFilter'}) filter?: Filter<Calories>,
  ): Promise<Calories[]> {
    const userRoles = await this.userRoleRepository.find({ where: { userId: this.user.id }});
    const userRoleIds = userRoles.map(userRole => userRole.roleId);

    if (userRoleIds.includes(USER_ROLES.ADMINISTRATOR) || userRoleIds.includes(USER_ROLES.PROVIDER)) {
      return this.caloriesRepository.find(filter);
    }

    return this.caloriesRepository.find({...filter, where: {...filter?.where, userId: this.user.id}});
  }

  @patch('/calories', {
    responses: {
      '200': {
        description: 'Calories PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Calories, {partial: true}),
        },
      },
    })
    calories: Calories,
    @param.where(Calories) where?: Where<Calories>,
  ): Promise<Count> {
    return this.caloriesRepository.updateAll(calories, where);
  }

  @get('/calories/{id}', {
    responses: {
      '200': {
        description: 'Calories model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Calories, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Calories, {exclude: 'where'}) filter?: FilterExcludingWhere<Calories>
  ): Promise<Calories> {
    return this.caloriesRepository.findById(id, filter);
  }

  @patch('/calories/{id}', {
    operationId: 'updateCalorie',
    responses: {
      '204': {
        description: 'Calories PATCH success',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Calories, {includeRelations: true}),
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
          schema: getModelSchemaRef(Calories, {partial: true}),
        },
      },
    })
    calories: Calories,
  ): Promise<void> {
    await this.caloriesRepository.updateById(id, calories);
  }

  @put('/calories/{id}', {
    responses: {
      '204': {
        description: 'Calories PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() calories: Calories,
  ): Promise<void> {
    await this.caloriesRepository.replaceById(id, calories);
  }

  @del('/calories/{id}', {
    operationId: 'deleteCalorie',
    responses: {
      '204': {
        description: 'Calories DELETE success',
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
    await this.caloriesRepository.deleteById(id);
  }
}
