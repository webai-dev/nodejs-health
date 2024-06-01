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

import {FoodBookmark} from '../models';
import {FoodBookmarkRepository, UserRoleRepository} from '../repositories';

import { USER_ROLES } from '../constants';

export class FoodBookmarkController {
  constructor(
    @repository(FoodBookmarkRepository)
    public foodBookmarkRepository : FoodBookmarkRepository,
    @repository(UserRoleRepository)
    public userRoleRepository : UserRoleRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true })
    private user: UserProfile,
  ) {}

  @post('/food-bookmarks', {
    operationId: 'createFoodBookmark',
    responses: {
      '200': {
        description: 'FoodBookmark model instance',
        content: {'application/json': {schema: getModelSchemaRef(FoodBookmark)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodBookmark, {
            title: 'NewFoodBookmark',
            exclude: ['id'],
          }),
        },
      },
    })
    foodBookmark: Omit<FoodBookmark, 'id'>,
  ): Promise<FoodBookmark> {
    const foodBookmarkCount = await this.foodBookmarkRepository.count({
      and: [
        { foodId: foodBookmark.foodId },
        { userId: this.user.id }
      ]
    });

    if (foodBookmarkCount.count > 0) {
      return Promise.resolve(new FoodBookmark());
    } else {
      return this.foodBookmarkRepository.create({...foodBookmark, userId: foodBookmark.userId || this.user.id});
    }
  }

  @get('/food-bookmarks/count', {
    operationId: 'foodBookmarksCount',
    responses: {
      '200': {
        description: 'FoodBookmark model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(FoodBookmark) where?: Where<FoodBookmark>,
  ): Promise<Count> {
    return this.foodBookmarkRepository.count(where);
  }

  @get('/food-bookmarks', {
    operationId: 'foodBookmarks',
    responses: {
      '200': {
        description: 'Array of FoodBookmark model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(FoodBookmark, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(FoodBookmark, {name: 'FoodBookmarksFilter'}) filter?: Filter<FoodBookmark>,
  ): Promise<FoodBookmark[]> {
    const userRoles = await this.userRoleRepository.find({ where: { userId: this.user.id }});
    const userRoleIds = userRoles.map(userRole => userRole.roleId);

    if (userRoleIds.includes(USER_ROLES.ADMINISTRATOR) || userRoleIds.includes(USER_ROLES.PROVIDER)) {
      return this.foodBookmarkRepository.find(filter);
    }

    return this.foodBookmarkRepository.find({...filter, where: {...filter?.where, userId: this.user.id}});
  }

  @patch('/food-bookmarks', {
    responses: {
      '200': {
        description: 'FoodBookmark PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodBookmark, {partial: true}),
        },
      },
    })
    foodBookmark: FoodBookmark,
    @param.where(FoodBookmark) where?: Where<FoodBookmark>,
  ): Promise<Count> {
    return this.foodBookmarkRepository.updateAll(foodBookmark, where);
  }

  @get('/food-bookmarks/{id}', {
    responses: {
      '200': {
        description: 'FoodBookmark model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(FoodBookmark, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(FoodBookmark, {exclude: 'where'}) filter?: FilterExcludingWhere<FoodBookmark>
  ): Promise<FoodBookmark> {
    return this.foodBookmarkRepository.findById(id, filter);
  }

  @patch('/food-bookmarks/{id}', {
    responses: {
      '204': {
        description: 'FoodBookmark PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodBookmark, {partial: true}),
        },
      },
    })
    foodBookmark: FoodBookmark,
  ): Promise<void> {
    await this.foodBookmarkRepository.updateById(id, foodBookmark);
  }

  @put('/food-bookmarks/{id}', {
    responses: {
      '204': {
        description: 'FoodBookmark PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() foodBookmark: FoodBookmark,
  ): Promise<void> {
    await this.foodBookmarkRepository.replaceById(id, foodBookmark);
  }

  @del('/food-bookmarks/{id}', {
    operationId: 'deleteFoodBookmark',
    responses: {
      '204': {
        description: 'FoodBookmark DELETE success',
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
    await this.foodBookmarkRepository.deleteById(id);
  }
}
