import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Exercise,
  User,
} from '../models';
import {ExerciseRepository} from '../repositories';

export class ExerciseUserController {
  constructor(
    @repository(ExerciseRepository)
    public exerciseRepository: ExerciseRepository,
  ) { }

  @get('/exercises/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Exercise',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Exercise.prototype.id,
  ): Promise<User> {
    return this.exerciseRepository.user(id);
  }
}
