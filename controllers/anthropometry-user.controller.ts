import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Anthropometry,
  User,
} from '../models';
import {AnthropometryRepository} from '../repositories';

export class AnthropometryUserController {
  constructor(
    @repository(AnthropometryRepository)
    public anthropometryRepository: AnthropometryRepository,
  ) { }

  @get('/anthropometries/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Anthropometry',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Anthropometry.prototype.id,
  ): Promise<User> {
    return this.anthropometryRepository.user(id);
  }
}
