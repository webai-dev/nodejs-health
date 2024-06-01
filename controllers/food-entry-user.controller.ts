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
  User,
} from '../models';
import {FoodEntryRepository} from '../repositories';

export class FoodEntryUserController {
  constructor(
    @repository(FoodEntryRepository)
    public foodEntryRepository: FoodEntryRepository,
  ) { }

  @get('/food-entries/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to FoodEntry',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof FoodEntry.prototype.id,
  ): Promise<User> {
    return this.foodEntryRepository.user(id);
  }
}
