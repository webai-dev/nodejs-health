import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Diabetes,
  User,
} from '../models';
import {DiabetesRepository} from '../repositories';

export class DiabetesUserController {
  constructor(
    @repository(DiabetesRepository)
    public diabetesRepository: DiabetesRepository,
  ) { }

  @get('/diabetes/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Diabetes',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Diabetes.prototype.id,
  ): Promise<User> {
    return this.diabetesRepository.user(id);
  }
}
