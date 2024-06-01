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

import {FoodVariant} from '../models';
import {FoodVariantRepository, UserRoleRepository} from '../repositories';

export class FoodVariantsController {
  constructor(
    @repository(FoodVariantRepository)
    public foodVariantRepository : FoodVariantRepository,
    @repository(UserRoleRepository)
    public userRoleRepository : UserRoleRepository,
  ) {}

  @post('/food-variants', {
    operationId: 'createFoodVariant',
    responses: {
      '200': {
        description: 'FoodVariant model instance',
        content: {'application/json': {schema: getModelSchemaRef(FoodVariant)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodVariant, {
            title: 'NewFoodVariant',
            exclude: ['id'],
          }),
        },
      },
    })
    foodVariant: Omit<FoodVariant, 'id'>,
  ): Promise<FoodVariant> {
    return this.foodVariantRepository.create(foodVariant);
  }

  @get('/food-variants/count', {
    operationId: 'foodVariantsCount',
    responses: {
      '200': {
        description: 'FoodVariant model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(FoodVariant) where?: Where<FoodVariant>,
  ): Promise<Count> {
    return this.foodVariantRepository.count(where);
  }

  @get('/food-variants', {
    operationId: 'foodVariants',
    responses: {
      '200': {
        description: 'Array of FoodVariant model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(FoodVariant, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(FoodVariant, {name: 'FoodVariantsFilter'}) filter?: Filter<FoodVariant>,
  ): Promise<FoodVariant[]> {
    return this.foodVariantRepository.find(filter);
  }

  @patch('/food-variants', {
    responses: {
      '200': {
        description: 'FoodVariant PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodVariant, {partial: true}),
        },
      },
    })
    foodVariant: FoodVariant,
    @param.where(FoodVariant) where?: Where<FoodVariant>,
  ): Promise<Count> {
    return this.foodVariantRepository.updateAll(foodVariant, where);
  }

  @get('/food-variants/{id}', {
    operationId: 'foodVariant',
    responses: {
      '200': {
        description: 'FoodVariant model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(FoodVariant, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(FoodVariant, {exclude: 'where'}) filter?: FilterExcludingWhere<FoodVariant>
  ): Promise<FoodVariant> {
    return this.foodVariantRepository.findById(id, filter);
  }

  @patch('/food-variants/{id}', {
    operationId: 'updateFoodVariant',
    responses: {
      '204': {
        description: 'FoodVariant PATCH success',
        content: {'application/json': {schema: getModelSchemaRef(FoodVariant, { includeRelations: true })}},
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodVariant, {partial: true}),
        },
      },
    })
    foodVariant: FoodVariant,
  ): Promise<void> {
    await this.foodVariantRepository.updateById(id, foodVariant);
  }

  @put('/food-variants/{id}', {
    responses: {
      '204': {
        description: 'FoodVariant PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() foodVariant: FoodVariant,
  ): Promise<void> {
    await this.foodVariantRepository.replaceById(id, foodVariant);
  }

  @del('/food-variants/{id}', {
    operationId: 'deleteFoodVariant',
    responses: {
      '204': {
        description: 'Food Variant DELETE success',
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
    await this.foodVariantRepository.deleteById(id);
  }
}
