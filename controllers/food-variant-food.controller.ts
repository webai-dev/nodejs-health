import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  FoodVariant,
  Food,
} from '../models';
import {FoodVariantRepository} from '../repositories';

export class FoodVariantFoodController {
  constructor(
    @repository(FoodVariantRepository)
    public foodVariantRepository: FoodVariantRepository,
  ) { }

  @get('/food-variants/{id}/food', {
    responses: {
      '200': {
        description: 'Food belonging to FoodVariant',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Food)},
          },
        },
      },
    },
  })
  async getFood(
    @param.path.number('id') id: typeof FoodVariant.prototype.id,
  ): Promise<Food> {
    return this.foodVariantRepository.food(id);
  }
}
