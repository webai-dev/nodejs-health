import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Step,
  User,
} from '../models';
import {StepRepository} from '../repositories';

export class StepUserController {
  constructor(
    @repository(StepRepository)
    public stepRepository: StepRepository,
  ) { }

  @get('/steps/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Step',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Step.prototype.id,
  ): Promise<User> {
    return this.stepRepository.user(id);
  }
}
