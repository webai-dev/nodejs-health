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
  FoodVariant,
  FoodEntry,
} from '../models';
import {FoodVariantRepository} from '../repositories';

export class FoodVariantFoodEntryController {
  constructor(
    @repository(FoodVariantRepository) protected foodVariantRepository: FoodVariantRepository,
  ) { }

  @get('/food-variants/{id}/food-entries', {
    responses: {
      '200': {
        description: 'Array of FoodVariant has many FoodEntry',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(FoodEntry)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<FoodEntry>,
  ): Promise<FoodEntry[]> {
    return this.foodVariantRepository.foodEntries(id).find(filter);
  }

  @post('/food-variants/{id}/food-entries', {
    responses: {
      '200': {
        description: 'FoodVariant model instance',
        content: {'application/json': {schema: getModelSchemaRef(FoodEntry)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof FoodVariant.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodEntry, {
            title: 'NewFoodEntryInFoodVariant',
            exclude: ['id'],
            optional: ['foodVariantId']
          }),
        },
      },
    }) foodEntry: Omit<FoodEntry, 'id'>,
  ): Promise<FoodEntry> {
    return this.foodVariantRepository.foodEntries(id).create(foodEntry);
  }

  @patch('/food-variants/{id}/food-entries', {
    responses: {
      '200': {
        description: 'FoodVariant.FoodEntry PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodEntry, {partial: true}),
        },
      },
    })
    foodEntry: Partial<FoodEntry>,
    @param.query.object('where', getWhereSchemaFor(FoodEntry)) where?: Where<FoodEntry>,
  ): Promise<Count> {
    return this.foodVariantRepository.foodEntries(id).patch(foodEntry, where);
  }

  @del('/food-variants/{id}/food-entries', {
    responses: {
      '200': {
        description: 'FoodVariant.FoodEntry DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(FoodEntry)) where?: Where<FoodEntry>,
  ): Promise<Count> {
    return this.foodVariantRepository.foodEntries(id).delete(where);
  }
}
