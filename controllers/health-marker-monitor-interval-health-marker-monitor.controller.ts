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
  HealthMarkerMonitor,
} from '../models';
import {HealthMarkerMonitorIntervalRepository} from '../repositories';

export class HealthMarkerMonitorIntervalHealthMarkerMonitorController {
  constructor(
    @repository(HealthMarkerMonitorIntervalRepository)
    public healthMarkerMonitorIntervalRepository: HealthMarkerMonitorIntervalRepository,
  ) { }

  @get('/health-marker-monitor-intervals/{id}/health-marker-monitor', {
    responses: {
      '200': {
        description: 'HealthMarkerMonitor belonging to HealthMarkerMonitorInterval',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(HealthMarkerMonitor)},
          },
        },
      },
    },
  })
  async getHealthMarkerMonitor(
    @param.path.number('id') id: typeof HealthMarkerMonitorInterval.prototype.id,
  ): Promise<HealthMarkerMonitor> {
    return this.healthMarkerMonitorIntervalRepository.healthMarkerMonitor(id);
  }
}
