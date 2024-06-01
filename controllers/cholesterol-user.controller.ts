import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Cholesterol,
  User,
} from '../models';
import {CholesterolRepository} from '../repositories';

export class CholesterolUserController {
  constructor(
    @repository(CholesterolRepository)
    public cholesterolRepository: CholesterolRepository,
  ) { }

  @get('/cholesterols/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Cholesterol',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Cholesterol.prototype.id,
  ): Promise<User> {
    return this.cholesterolRepository.user(id);
  }
}
