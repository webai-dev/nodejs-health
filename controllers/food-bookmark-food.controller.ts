import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  FoodBookmark,
  Food,
} from '../models';
import {FoodBookmarkRepository} from '../repositories';

export class FoodBookmarkFoodController {
  constructor(
    @repository(FoodBookmarkRepository)
    public foodBookmarkRepository: FoodBookmarkRepository,
  ) { }

  @get('/food-bookmarks/{id}/food', {
    responses: {
      '200': {
        description: 'Food belonging to FoodBookmark',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Food)},
          },
        },
      },
    },
  })
  async getFood(
    @param.path.number('id') id: typeof FoodBookmark.prototype.id,
  ): Promise<Food> {
    return this.foodBookmarkRepository.food(id);
  }
}
