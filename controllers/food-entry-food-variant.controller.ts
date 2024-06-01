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
  FoodVariant,
} from '../models';
import {FoodEntryRepository} from '../repositories';

export class FoodEntryFoodVariantController {
  constructor(
    @repository(FoodEntryRepository)
    public foodEntryRepository: FoodEntryRepository,
  ) { }

  @get('/food-entries/{id}/food-variant', {
    responses: {
      '200': {
        description: 'FoodVariant belonging to FoodEntry',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(FoodVariant)},
          },
        },
      },
    },
  })
  async getFoodVariant(
    @param.path.number('id') id: typeof FoodEntry.prototype.id,
  ): Promise<FoodVariant> {
    return this.foodEntryRepository.foodVariant(id);
  }
}
