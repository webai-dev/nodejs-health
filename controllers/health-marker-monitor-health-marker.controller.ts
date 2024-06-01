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
  HealthMarker,
} from '../models';
import {HealthMarkerMonitorRepository} from '../repositories';

export class HealthMarkerMonitorHealthMarkerController {
  constructor(
    @repository(HealthMarkerMonitorRepository)
    public healthMarkerMonitorRepository: HealthMarkerMonitorRepository,
  ) { }

  @get('/health-marker-monitors/{id}/health-marker', {
    responses: {
      '200': {
        description: 'HealthMarker belonging to HealthMarkerMonitor',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(HealthMarker)},
          },
        },
      },
    },
  })
  async getHealthMarker(
    @param.path.number('id') id: typeof HealthMarkerMonitor.prototype.id,
  ): Promise<HealthMarker> {
    return this.healthMarkerMonitorRepository.healthMarker(id);
  }
}
