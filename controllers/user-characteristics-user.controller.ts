import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  UserCharacteristics,
  User,
} from '../models';
import {UserCharacteristicsRepository} from '../repositories';

export class UserCharacteristicsUserController {
  constructor(
    @repository(UserCharacteristicsRepository)
    public userCharacteristicsRepository: UserCharacteristicsRepository,
  ) { }

  @get('/user-characteristics/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to UserCharacteristics',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof UserCharacteristics.prototype.id,
  ): Promise<User> {
    return this.userCharacteristicsRepository.user(id);
  }
}
