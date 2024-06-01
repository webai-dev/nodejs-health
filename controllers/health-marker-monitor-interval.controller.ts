import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {HealthMarkerMonitorInterval} from '../models';
import {HealthMarkerMonitorIntervalRepository} from '../repositories';

export class HealthMarkerMonitorIntervalController {
  constructor(
    @repository(HealthMarkerMonitorIntervalRepository)
    public healthMarkerMonitorIntervalRepository : HealthMarkerMonitorIntervalRepository,
  ) {}

  @post('/health-marker-monitor-intervals', {
    operationId: 'createHealthMarkerMonitorInterval',
    responses: {
      '200': {
        description: 'HealthMarkerMonitorInterval model instance',
        content: {'application/json': {schema: getModelSchemaRef(HealthMarkerMonitorInterval)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HealthMarkerMonitorInterval, {
            title: 'NewHealthMarkerMonitorInterval',
            exclude: ['id'],
          }),
        },
      },
    })
    healthMarkerMonitorInterval: Omit<HealthMarkerMonitorInterval, 'id'>,
  ): Promise<HealthMarkerMonitorInterval> {
    return this.healthMarkerMonitorIntervalRepository.create(healthMarkerMonitorInterval);
  }

  @get('/health-marker-monitor-intervals/count', {
    responses: {
      '200': {
        description: 'HealthMarkerMonitorInterval model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(HealthMarkerMonitorInterval) where?: Where<HealthMarkerMonitorInterval>,
  ): Promise<Count> {
    return this.healthMarkerMonitorIntervalRepository.count(where);
  }

  @get('/health-marker-monitor-intervals', {
    operationId: 'healthMarkerMonitorIntervals',
    responses: {
      '200': {
        description: 'Array of HealthMarkerMonitorInterval model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(HealthMarkerMonitorInterval, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(HealthMarkerMonitorInterval, { name: 'HealthMarkerMonitorIntervalsFilter' }) filter?: Filter<HealthMarkerMonitorInterval>,
  ): Promise<HealthMarkerMonitorInterval[]> {
    return this.healthMarkerMonitorIntervalRepository.find(filter);
  }

  @patch('/health-marker-monitor-intervals', {
    responses: {
      '200': {
        description: 'HealthMarkerMonitorInterval PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HealthMarkerMonitorInterval, {partial: true}),
        },
      },
    })
    healthMarkerMonitorInterval: HealthMarkerMonitorInterval,
    @param.where(HealthMarkerMonitorInterval) where?: Where<HealthMarkerMonitorInterval>,
  ): Promise<Count> {
    return this.healthMarkerMonitorIntervalRepository.updateAll(healthMarkerMonitorInterval, where);
  }

  @get('/health-marker-monitor-intervals/{id}', {
    operationId: 'healthMarkerMonitorInterval',
    responses: {
      '200': {
        description: 'HealthMarkerMonitorInterval model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(HealthMarkerMonitorInterval, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(HealthMarkerMonitorInterval, {exclude: 'where'}) filter?: FilterExcludingWhere<HealthMarkerMonitorInterval>
  ): Promise<HealthMarkerMonitorInterval> {
    return this.healthMarkerMonitorIntervalRepository.findById(id, filter);
  }

  @patch('/health-marker-monitor-intervals/{id}', {
    operationId: 'updateHealthMarkerMonitorInterval',
    responses: {
      '200': {
        description: 'HealthMarkerMonitorInterval model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(HealthMarkerMonitorInterval, {includeRelations: true}),
          },
        },
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HealthMarkerMonitorInterval, {partial: true}),
        },
      },
    })
    healthMarkerMonitorInterval: HealthMarkerMonitorInterval,
  ): Promise<void> {
    await this.healthMarkerMonitorIntervalRepository.updateById(id, healthMarkerMonitorInterval);
  }

  @put('/health-marker-monitor-intervals/{id}', {
    responses: {
      '204': {
        description: 'HealthMarkerMonitorInterval PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() healthMarkerMonitorInterval: HealthMarkerMonitorInterval,
  ): Promise<void> {
    await this.healthMarkerMonitorIntervalRepository.replaceById(id, healthMarkerMonitorInterval);
  }

  @del('/health-marker-monitor-intervals/{id}', {
    operationId: 'deleteHealthMarkerMonitorInterval',
    responses: {
      '204': {
        description: 'HealthMarkerMonitorInterval DELETE success',
        content: {'application/json': {
          schema: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
              }
            }
          }
        }},
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.healthMarkerMonitorIntervalRepository.deleteById(id);
  }
}
