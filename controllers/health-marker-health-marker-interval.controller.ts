import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  HealthMarker,
  HealthMarkerInterval,
} from '../models';
import {HealthMarkerRepository} from '../repositories';

export class HealthMarkerHealthMarkerIntervalController {
  constructor(
    @repository(HealthMarkerRepository) protected healthMarkerRepository: HealthMarkerRepository,
  ) { }

  @get('/health-markers/{id}/health-marker-intervals', {
    responses: {
      '200': {
        description: 'Array of HealthMarker has many HealthMarkerInterval',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(HealthMarkerInterval)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<HealthMarkerInterval>,
  ): Promise<HealthMarkerInterval[]> {
    return this.healthMarkerRepository.healthMarkerIntervals(id).find(filter);
  }

  @post('/health-markers/{id}/health-marker-intervals', {
    responses: {
      '200': {
        description: 'HealthMarker model instance',
        content: {'application/json': {schema: getModelSchemaRef(HealthMarkerInterval)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof HealthMarker.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HealthMarkerInterval, {
            title: 'NewHealthMarkerIntervalInHealthMarker',
            exclude: ['id'],
            optional: ['healthMarkerId']
          }),
        },
      },
    }) healthMarkerInterval: Omit<HealthMarkerInterval, 'id'>,
  ): Promise<HealthMarkerInterval> {
    return this.healthMarkerRepository.healthMarkerIntervals(id).create(healthMarkerInterval);
  }

  @patch('/health-markers/{id}/health-marker-intervals', {
    responses: {
      '200': {
        description: 'HealthMarker.HealthMarkerInterval PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HealthMarkerInterval, {partial: true}),
        },
      },
    })
    healthMarkerInterval: Partial<HealthMarkerInterval>,
    @param.query.object('where', getWhereSchemaFor(HealthMarkerInterval)) where?: Where<HealthMarkerInterval>,
  ): Promise<Count> {
    return this.healthMarkerRepository.healthMarkerIntervals(id).patch(healthMarkerInterval, where);
  }

  @del('/health-markers/{id}/health-marker-intervals', {
    responses: {
      '200': {
        description: 'HealthMarker.HealthMarkerInterval DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(HealthMarkerInterval)) where?: Where<HealthMarkerInterval>,
  ): Promise<Count> {
    return this.healthMarkerRepository.healthMarkerIntervals(id).delete(where);
  }
}
