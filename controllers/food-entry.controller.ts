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

import {FoodEntry} from '../models';
import {FoodEntryRepository, UserRoleRepository} from '../repositories';

import { USER_ROLES } from '../constants';

export class FoodEntryController {
  constructor(
    @repository(FoodEntryRepository)
    public foodEntryRepository : FoodEntryRepository,
    @repository(UserRoleRepository)
    public userRoleRepository : UserRoleRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true })
    private user: UserProfile,
  ) {}

  @post('/food-entries', {
    operationId: 'createFoodEntry',
    responses: {
      '200': {
        description: 'FoodEntry model instance',
        content: {'application/json': {schema: getModelSchemaRef(FoodEntry, {includeRelations: true})}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodEntry, {
            title: 'NewFoodEntry',
            exclude: ['id'],
          }),
        },
      },
    })
    foodEntry: Omit<FoodEntry, 'id'>,
  ): Promise<FoodEntry> {
    return this.foodEntryRepository.create({...foodEntry, userId: foodEntry.userId || this.user.id});
  }

  @get('/food-entries/count', {
    operationId: 'foodEntriesCount',
    responses: {
      '200': {
        description: 'FoodEntry model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(FoodEntry) where?: Where<FoodEntry>,
  ): Promise<Count> {
    return this.foodEntryRepository.count(where);
  }

  @get('/food-entries', {
    operationId: 'foodEntries',
    responses: {
      '200': {
        description: 'Array of FoodEntry model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(FoodEntry, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(FoodEntry, {name: 'FoodEntriesFilter'}) filter?: Filter<FoodEntry>,
  ): Promise<FoodEntry[]> {
    const userRoles = await this.userRoleRepository.find({ where: { userId: this.user.id }});
    const userRoleIds = userRoles.map(userRole => userRole.roleId);

    if (userRoleIds.includes(USER_ROLES.ADMINISTRATOR) || userRoleIds.includes(USER_ROLES.PROVIDER)) {
      return this.foodEntryRepository.find(filter);
    }

    return this.foodEntryRepository.find({...filter, where: {...filter?.where, userId: this.user.id}});
  }

  @patch('/food-entries', {
    operationId: 'updateFoodEntries',
    responses: {
      '200': {
        description: 'FoodEntry PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodEntry, {partial: true}),
        },
      },
    })
    foodEntry: FoodEntry,
    @param.where(FoodEntry) where?: Where<FoodEntry>,
  ): Promise<Count> {
    return this.foodEntryRepository.updateAll(foodEntry, where);
  }

  @get('/food-entries/{id}', {
    responses: {
      '200': {
        description: 'FoodEntry model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(FoodEntry, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(FoodEntry, {exclude: 'where'}) filter?: FilterExcludingWhere<FoodEntry>
  ): Promise<FoodEntry> {
    return this.foodEntryRepository.findById(id, filter);
  }

  @patch('/food-entries/{id}', {
    operationId: 'updateFoodEntry',
    responses: {
      '204': {
        description: 'FoodEntry PATCH success',
        content: {'application/json': {schema: getModelSchemaRef(FoodEntry, { includeRelations: true })}},
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodEntry, {partial: true}),
        },
      },
    })
    foodEntry: FoodEntry,
  ): Promise<void> {
    await this.foodEntryRepository.updateById(id, foodEntry);
  }

  @put('/food-entries/{id}', {
    responses: {
      '204': {
        description: 'FoodEntry PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() foodEntry: FoodEntry,
  ): Promise<void> {
    await this.foodEntryRepository.replaceById(id, foodEntry);
  }

  @del('/food-entries/{id}', {
    operationId: 'deleteFoodEntry',
    responses: {
      '204': {
        description: 'FoodEntry DELETE success',
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
  async deleteById(@param.path.number('id') id: number): Promise<any> {
    await this.foodEntryRepository.deleteById(id);
    return { id };
  }
}
