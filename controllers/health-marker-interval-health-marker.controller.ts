import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  HealthMarkerInterval,
  HealthMarker,
} from '../models';
import {HealthMarkerIntervalRepository} from '../repositories';

export class HealthMarkerIntervalHealthMarkerController {
  constructor(
    @repository(HealthMarkerIntervalRepository)
    public healthMarkerIntervalRepository: HealthMarkerIntervalRepository,
  ) { }

  @get('/health-marker-intervals/{id}/health-marker', {
    responses: {
      '200': {
        description: 'HealthMarker belonging to HealthMarkerInterval',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(HealthMarker)},
          },
        },
      },
    },
  })
  async getHealthMarker(
    @param.path.number('id') id: typeof HealthMarkerInterval.prototype.id,
  ): Promise<HealthMarker> {
    return this.healthMarkerIntervalRepository.healthMarker(id);
  }
}
