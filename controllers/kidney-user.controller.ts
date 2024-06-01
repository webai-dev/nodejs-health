import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Kidney,
  User,
} from '../models';
import {KidneyRepository} from '../repositories';

export class KidneyUserController {
  constructor(
    @repository(KidneyRepository)
    public kidneyRepository: KidneyRepository,
  ) { }

  @get('/kidneys/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Kidney',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Kidney.prototype.id,
  ): Promise<User> {
    return this.kidneyRepository.user(id);
  }
}
