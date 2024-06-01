import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  FoodEntry,
  Food,
} from '../models';
import {FoodEntryRepository} from '../repositories';

export class FoodEntryFoodController {
  constructor(
    @repository(FoodEntryRepository)
    public foodEntryRepository: FoodEntryRepository,
  ) { }

  @get('/food-entries/{id}/food', {
    responses: {
      '200': {
        description: 'Food belonging to FoodEntry',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Food)},
          },
        },
      },
    },
  })
  async getFood(
    @param.path.number('id') id: typeof FoodEntry.prototype.id,
  ): Promise<Food> {
    return this.foodEntryRepository.food(id);
  }
}
