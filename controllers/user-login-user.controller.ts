import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  UserLogin,
  User,
} from '../models';
import {UserLoginRepository} from '../repositories';

export class UserLoginUserController {
  constructor(
    @repository(UserLoginRepository)
    public userLoginRepository: UserLoginRepository,
  ) { }

  @get('/user-logins/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to UserLogin',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof UserLogin.prototype.id,
  ): Promise<User> {
    return this.userLoginRepository.user(id);
  }
}
