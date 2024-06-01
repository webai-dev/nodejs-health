import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Calories,
  User,
} from '../models';
import {CaloriesRepository} from '../repositories';

export class CaloriesUserController {
  constructor(
    @repository(CaloriesRepository)
    public caloriesRepository: CaloriesRepository,
  ) { }

  @get('/calories/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Calories',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Calories.prototype.id,
  ): Promise<User> {
    return this.caloriesRepository.user(id);
  }
}
