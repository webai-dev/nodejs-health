import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  UserBaseline,
  User,
} from '../models';
import {UserBaselineRepository} from '../repositories';

export class UserBaselineUserController {
  constructor(
    @repository(UserBaselineRepository)
    public userBaselineRepository: UserBaselineRepository,
  ) { }

  @get('/user-baselines/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to UserBaseline',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof UserBaseline.prototype.id,
  ): Promise<User> {
    return this.userBaselineRepository.user(id);
  }
}
