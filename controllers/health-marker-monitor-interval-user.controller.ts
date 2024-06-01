import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  HealthMarkerMonitorInterval,
  User,
} from '../models';
import {HealthMarkerMonitorIntervalRepository} from '../repositories';

export class HealthMarkerMonitorIntervalUserController {
  constructor(
    @repository(HealthMarkerMonitorIntervalRepository)
    public healthMarkerMonitorIntervalRepository: HealthMarkerMonitorIntervalRepository,
  ) { }

  @get('/health-marker-monitor-intervals/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to HealthMarkerMonitorInterval',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof HealthMarkerMonitorInterval.prototype.id,
  ): Promise<User> {
    return this.healthMarkerMonitorIntervalRepository.user(id);
  }
}
