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

import {Food} from '../models';
import {FoodRepository, UserRoleRepository} from '../repositories';

export class FoodController {
  constructor(
    @repository(FoodRepository)
    public foodRepository : FoodRepository,
    @repository(UserRoleRepository)
    public userRoleRepository : UserRoleRepository,
  ) {}

  @post('/foods', {
    operationId: 'createFood',
    responses: {
      '200': {
        description: 'Food model instance',
        content: {'application/json': {schema: getModelSchemaRef(Food)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Food, {
            title: 'NewFood',
            exclude: ['id'],
          }),
        },
      },
    })
    food: Omit<Food, 'id'>,
  ): Promise<Food> {
    return this.foodRepository.create(food);
  }

  @get('/foods/count', {
    operationId: 'foodsCount',
    responses: {
      '200': {
        description: 'Food model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Food) where?: Where<Food>,
  ): Promise<Count> {
    return this.foodRepository.count(where);
  }

  @get('/foods', {
    operationId: 'foods',
    responses: {
      '200': {
        description: 'Array of Food model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Food, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(Food, {name: 'FoodsFilter'}) filter?: Filter<Food>,
  ): Promise<Food[]> {
    return this.foodRepository.find(filter);
  }

  @patch('/foods', {
    responses: {
      '200': {
        description: 'Food PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Food, {partial: true}),
        },
      },
    })
    food: Food,
    @param.where(Food) where?: Where<Food>,
  ): Promise<Count> {
    return this.foodRepository.updateAll(food, where);
  }

  @get('/foods/{id}', {
    operationId: 'food',
    responses: {
      '200': {
        description: 'Food model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Food, {includeRelations: true}),
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Food, {exclude: 'where', name: 'FoodFilter'}) filter?: FilterExcludingWhere<Food>
  ): Promise<Food> {
    return this.foodRepository.findById(id, filter);
  }

  @patch('/foods/{id}', {
    operationId: 'updateFood',
    responses: {
      '204': {
        description: 'Food PATCH success',
        content: {'application/json': {schema: getModelSchemaRef(Food, { includeRelations: true })}},
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Food, {partial: true}),
        },
      },
    })
    food: Food,
  ): Promise<void> {
    await this.foodRepository.updateById(id, food);
  }

  @put('/foods/{id}', {
    responses: {
      '204': {
        description: 'Food PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() food: Food,
  ): Promise<void> {
    await this.foodRepository.replaceById(id, food);
  }

  @del('/foods/{id}', {
    operationId: 'deleteFood',
    responses: {
      '204': {
        description: 'Food DELETE success',
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
    await this.foodRepository.deleteById(id);
  }
}
