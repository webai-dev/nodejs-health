import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  HealthMarker,
  User,
} from '../models';
import {HealthMarkerRepository} from '../repositories';

export class HealthMarkerUserController {
  constructor(
    @repository(HealthMarkerRepository)
    public healthMarkerRepository: HealthMarkerRepository,
  ) { }

  @get('/health-markers/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to HealthMarker',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof HealthMarker.prototype.id,
  ): Promise<User> {
    return this.healthMarkerRepository.user(id);
  }
}
