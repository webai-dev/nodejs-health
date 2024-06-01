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
  FoodVariant,
} from '../models';
import {FoodRepository} from '../repositories';

export class FoodFoodVariantController {
  constructor(
    @repository(FoodRepository) protected foodRepository: FoodRepository,
  ) { }

  @get('/foods/{id}/food-variants', {
    responses: {
      '200': {
        description: 'Array of Food has many FoodVariant',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(FoodVariant)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<FoodVariant>,
  ): Promise<FoodVariant[]> {
    return this.foodRepository.foodVariants(id).find(filter);
  }

  @post('/foods/{id}/food-variants', {
    responses: {
      '200': {
        description: 'Food model instance',
        content: {'application/json': {schema: getModelSchemaRef(FoodVariant)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Food.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodVariant, {
            title: 'NewFoodVariantInFood',
            exclude: ['id'],
            optional: ['foodId']
          }),
        },
      },
    }) foodVariant: Omit<FoodVariant, 'id'>,
  ): Promise<FoodVariant> {
    return this.foodRepository.foodVariants(id).create(foodVariant);
  }

  @patch('/foods/{id}/food-variants', {
    responses: {
      '200': {
        description: 'Food.FoodVariant PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodVariant, {partial: true}),
        },
      },
    })
    foodVariant: Partial<FoodVariant>,
    @param.query.object('where', getWhereSchemaFor(FoodVariant)) where?: Where<FoodVariant>,
  ): Promise<Count> {
    return this.foodRepository.foodVariants(id).patch(foodVariant, where);
  }

  @del('/foods/{id}/food-variants', {
    responses: {
      '200': {
        description: 'Food.FoodVariant DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(FoodVariant)) where?: Where<FoodVariant>,
  ): Promise<Count> {
    return this.foodRepository.foodVariants(id).delete(where);
  }
}
