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
  FoodEntry,
} from '../models';
import {FoodRepository} from '../repositories';

export class FoodFoodEntryController {
  constructor(
    @repository(FoodRepository) protected foodRepository: FoodRepository,
  ) { }

  @get('/foods/{id}/food-entries', {
    responses: {
      '200': {
        description: 'Array of Food has many FoodEntry',
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
    return this.foodRepository.foodEntries(id).find(filter);
  }

  @post('/foods/{id}/food-entries', {
    responses: {
      '200': {
        description: 'Food model instance',
        content: {'application/json': {schema: getModelSchemaRef(FoodEntry)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Food.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodEntry, {
            title: 'NewFoodEntryInFood',
            exclude: ['id'],
            optional: ['foodId']
          }),
        },
      },
    }) foodEntry: Omit<FoodEntry, 'id'>,
  ): Promise<FoodEntry> {
    return this.foodRepository.foodEntries(id).create(foodEntry);
  }

  @patch('/foods/{id}/food-entries', {
    responses: {
      '200': {
        description: 'Food.FoodEntry PATCH success count',
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
    return this.foodRepository.foodEntries(id).patch(foodEntry, where);
  }

  @del('/foods/{id}/food-entries', {
    responses: {
      '200': {
        description: 'Food.FoodEntry DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(FoodEntry)) where?: Where<FoodEntry>,
  ): Promise<Count> {
    return this.foodRepository.foodEntries(id).delete(where);
  }
}
