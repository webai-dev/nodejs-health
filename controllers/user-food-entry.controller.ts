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
  FoodEntry,
} from '../models';
import {UserRepository} from '../repositories';

export class UserFoodEntryController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/food-entries', {
    responses: {
      '200': {
        description: 'Array of User has many FoodEntry',
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
    return this.userRepository.foodEntries(id).find(filter);
  }

  @post('/users/{id}/food-entries', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(FoodEntry)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodEntry, {
            title: 'NewFoodEntryInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) foodEntry: Omit<FoodEntry, 'id'>,
  ): Promise<FoodEntry> {
    return this.userRepository.foodEntries(id).create(foodEntry);
  }

  @patch('/users/{id}/food-entries', {
    responses: {
      '200': {
        description: 'User.FoodEntry PATCH success count',
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
    return this.userRepository.foodEntries(id).patch(foodEntry, where);
  }

  @del('/users/{id}/food-entries', {
    responses: {
      '200': {
        description: 'User.FoodEntry DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(FoodEntry)) where?: Where<FoodEntry>,
  ): Promise<Count> {
    return this.userRepository.foodEntries(id).delete(where);
  }
}
