import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Lifestyle,
  User,
} from '../models';
import {LifestyleRepository} from '../repositories';

export class LifestyleUserController {
  constructor(
    @repository(LifestyleRepository)
    public lifestyleRepository: LifestyleRepository,
  ) { }

  @get('/lifestyles/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Lifestyle',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Lifestyle.prototype.id,
  ): Promise<User> {
    return this.lifestyleRepository.user(id);
  }
}
