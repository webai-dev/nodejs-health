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
  FoodBookmark,
} from '../models';
import {UserRepository} from '../repositories';

export class UserFoodBookmarkController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/food-bookmarks', {
    responses: {
      '200': {
        description: 'Array of User has many FoodBookmark',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(FoodBookmark)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<FoodBookmark>,
  ): Promise<FoodBookmark[]> {
    return this.userRepository.foodBookmarks(id).find(filter);
  }

  @post('/users/{id}/food-bookmarks', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(FoodBookmark)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodBookmark, {
            title: 'NewFoodBookmarkInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) foodBookmark: Omit<FoodBookmark, 'id'>,
  ): Promise<FoodBookmark> {
    return this.userRepository.foodBookmarks(id).create(foodBookmark);
  }

  @patch('/users/{id}/food-bookmarks', {
    responses: {
      '200': {
        description: 'User.FoodBookmark PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodBookmark, {partial: true}),
        },
      },
    })
    foodBookmark: Partial<FoodBookmark>,
    @param.query.object('where', getWhereSchemaFor(FoodBookmark)) where?: Where<FoodBookmark>,
  ): Promise<Count> {
    return this.userRepository.foodBookmarks(id).patch(foodBookmark, where);
  }

  @del('/users/{id}/food-bookmarks', {
    responses: {
      '200': {
        description: 'User.FoodBookmark DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(FoodBookmark)) where?: Where<FoodBookmark>,
  ): Promise<Count> {
    return this.userRepository.foodBookmarks(id).delete(where);
  }
}
