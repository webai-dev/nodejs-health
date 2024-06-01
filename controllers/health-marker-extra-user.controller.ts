import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  HealthMarkerExtra,
  User,
} from '../models';
import {HealthMarkerExtraRepository} from '../repositories';

export class HealthMarkerExtraUserController {
  constructor(
    @repository(HealthMarkerExtraRepository)
    public healthMarkerExtraRepository: HealthMarkerExtraRepository,
  ) { }

  @get('/health-marker-extras/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to HealthMarkerExtra',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof HealthMarkerExtra.prototype.id,
  ): Promise<User> {
    return this.healthMarkerExtraRepository.user(id);
  }
}
