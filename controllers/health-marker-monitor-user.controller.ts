import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  HealthMarkerMonitor,
  User,
} from '../models';
import {HealthMarkerMonitorRepository} from '../repositories';

export class HealthMarkerMonitorUserController {
  constructor(
    @repository(HealthMarkerMonitorRepository)
    public healthMarkerMonitorRepository: HealthMarkerMonitorRepository,
  ) { }

  @get('/health-marker-monitors/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to HealthMarkerMonitor',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof HealthMarkerMonitor.prototype.id,
  ): Promise<User> {
    return this.healthMarkerMonitorRepository.user(id);
  }
}
