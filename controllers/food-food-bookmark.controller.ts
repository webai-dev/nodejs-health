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
  Food,
  FoodBookmark,
} from '../models';
import {FoodRepository} from '../repositories';

export class FoodFoodBookmarkController {
  constructor(
    @repository(FoodRepository) protected foodRepository: FoodRepository,
  ) { }

  @get('/foods/{id}/food-bookmarks', {
    responses: {
      '200': {
        description: 'Array of Food has many FoodBookmarked',
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
    return this.foodRepository.foodBookmarks(id).find(filter);
  }

  @post('/foods/{id}/food-bookmarks', {
    responses: {
      '200': {
        description: 'Food model instance',
        content: {'application/json': {schema: getModelSchemaRef(FoodBookmark)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Food.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodBookmark, {
            title: 'NewFoodBookmarkInFood',
            exclude: ['id'],
            optional: ['foodId']
          }),
        },
      },
    }) foodBookmark: Omit<FoodBookmark, 'id'>,
  ): Promise<FoodBookmark> {
    return this.foodRepository.foodBookmarks(id).create(foodBookmark);
  }

  @patch('/foods/{id}/food-bookmarks', {
    responses: {
      '200': {
        description: 'Food.FoodBookmark PATCH success count',
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
    return this.foodRepository.foodBookmarks(id).patch(foodBookmark, where);
  }

  @del('/foods/{id}/food-bookmarks', {
    responses: {
      '200': {
        description: 'Food.FoodBookmark DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(FoodBookmark)) where?: Where<FoodBookmark>,
  ): Promise<Count> {
    return this.foodRepository.foodBookmarks(id).delete(where);
  }
}
