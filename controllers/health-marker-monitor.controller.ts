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
import {HealthMarkerMonitor} from '../models';
import {HealthMarkerMonitorRepository} from '../repositories';

export class HealthMarkerMonitorController {
  constructor(
    @repository(HealthMarkerMonitorRepository)
    public healthMarkerMonitorRepository : HealthMarkerMonitorRepository,
  ) {}

  @post('/health-marker-monitors', {
    operationId: 'createHealthMarkerMonitor',
    responses: {
      '200': {
        description: 'HealthMarkerMonitor model instance',
        content: {'application/json': {schema: getModelSchemaRef(HealthMarkerMonitor)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HealthMarkerMonitor, {
            title: 'NewHealthMarkerMonitor',
            exclude: ['id'],
          }),
        },
      },
    })
    healthMarkerMonitor: Omit<HealthMarkerMonitor, 'id'>,
  ): Promise<HealthMarkerMonitor> {
    return this.healthMarkerMonitorRepository.create(healthMarkerMonitor);
  }

  @get('/health-marker-monitors/count', {
    operationId: 'healthMarkerMonitorsCount',
    responses: {
      '200': {
        description: 'HealthMarkerMonitor model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(HealthMarkerMonitor) where?: Where<HealthMarkerMonitor>,
  ): Promise<Count> {
    return this.healthMarkerMonitorRepository.count(where);
  }

  @get('/health-marker-monitors', {
    operationId: 'healthMarkerMonitors',
    responses: {
      '200': {
        description: 'Array of HealthMarkerMonitor model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(HealthMarkerMonitor, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(HealthMarkerMonitor, { name: 'HealthMarkerMonitorsFilter' }) filter?: Filter<HealthMarkerMonitor>,
  ): Promise<HealthMarkerMonitor[]> {
    return this.healthMarkerMonitorRepository.find(filter);
  }

  @patch('/health-marker-monitors', {
    responses: {
      '200': {
        description: 'HealthMarkerMonitor PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HealthMarkerMonitor, {partial: true}),
        },
      },
    })
    healthMarkerMonitor: HealthMarkerMonitor,
    @param.where(HealthMarkerMonitor) where?: Where<HealthMarkerMonitor>,
  ): Promise<Count> {
    return this.healthMarkerMonitorRepository.updateAll(healthMarkerMonitor, where);
  }

  @get('/health-marker-monitors/{id}', {
    operationId: 'healthMarkerMonitor',
    responses: {
      '200': {
        description: 'HealthMarkerMonitor model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(HealthMarkerMonitor, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(HealthMarkerMonitor, {exclude: 'where'}) filter?: FilterExcludingWhere<HealthMarkerMonitor>
  ): Promise<HealthMarkerMonitor> {
    return this.healthMarkerMonitorRepository.findById(id, filter);
  }

  @patch('/health-marker-monitors/{id}', {
    operationId: 'updateHealthMarkerMonitor',
    responses: {
      '204': {
        description: 'InsulinInjections PATCH success',
        content: {
          'application/json': {
            schema: getModelSchemaRef(HealthMarkerMonitor, {includeRelations: true}),
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
          schema: getModelSchemaRef(HealthMarkerMonitor, {partial: true}),
        },
      },
    })
    healthMarkerMonitor: HealthMarkerMonitor,
  ): Promise<void> {
    await this.healthMarkerMonitorRepository.updateById(id, healthMarkerMonitor);
  }

  @put('/health-marker-monitors/{id}', {
    responses: {
      '204': {
        description: 'HealthMarkerMonitor PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() healthMarkerMonitor: HealthMarkerMonitor,
  ): Promise<void> {
    await this.healthMarkerMonitorRepository.replaceById(id, healthMarkerMonitor);
  }

  @del('/health-marker-monitors/{id}', {
    operationId: 'deleteHealthMarkerMonitor',
    responses: {
      '204': {
        description: 'HealthMarkerMonitor DELETE success',
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
    await this.healthMarkerMonitorRepository.deleteById(id);
  }
}
