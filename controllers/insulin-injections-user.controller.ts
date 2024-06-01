import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  InsulinInjections,
  User,
} from '../models';
import {InsulinInjectionsRepository} from '../repositories';

export class InsulinInjectionsUserController {
  constructor(
    @repository(InsulinInjectionsRepository)
    public insulinInjectionsRepository: InsulinInjectionsRepository,
  ) { }

  @get('/insulin-injections/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to InsulinInjections',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof InsulinInjections.prototype.id,
  ): Promise<User> {
    return this.insulinInjectionsRepository.user(id);
  }
}
