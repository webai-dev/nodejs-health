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
import {HealthMarker} from '../models';
import {HealthMarkerRepository, UserRoleRepository} from '../repositories';

export class HealthMarkerController {
  constructor(
    @repository(HealthMarkerRepository)
    public healthMarkerRepository : HealthMarkerRepository,
    @repository(UserRoleRepository)
    public userRoleRepository : UserRoleRepository,
  ) {}

  @post('/health-markers', {
    responses: {
      '200': {
        description: 'HealthMarker model instance',
        content: {'application/json': {schema: getModelSchemaRef(HealthMarker)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HealthMarker, {
            title: 'NewHealthMarker',
            exclude: ['id'],
          }),
        },
      },
    })
    healthMarker: Omit<HealthMarker, 'id'>,
  ): Promise<HealthMarker> {
    return this.healthMarkerRepository.create(healthMarker);
  }

  @get('/health-markers/count', {
    operationId: 'healthMarkersCount',
    responses: {
      '200': {
        description: 'HealthMarker model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(HealthMarker) where?: Where<HealthMarker>,
  ): Promise<Count> {
    return this.healthMarkerRepository.count(where);
  }

  @get('/health-markers', {
    operationId: 'healthMarkers',
    responses: {
      '200': {
        description: 'Array of HealthMarker model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(HealthMarker, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(HealthMarker, { name: 'HealthMarkerFilter'}) filter?: Filter<HealthMarker>,
  ): Promise<HealthMarker[]> {
    return this.healthMarkerRepository.find(filter);
  }

  @patch('/health-markers', {
    responses: {
      '200': {
        description: 'HealthMarker PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HealthMarker, {partial: true}),
        },
      },
    })
    healthMarker: HealthMarker,
    @param.where(HealthMarker) where?: Where<HealthMarker>,
  ): Promise<Count> {
    return this.healthMarkerRepository.updateAll(healthMarker, where);
  }

  @get('/health-markers/{id}', {
    responses: {
      '200': {
        description: 'HealthMarker model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(HealthMarker, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(HealthMarker, {exclude: 'where'}) filter?: FilterExcludingWhere<HealthMarker>
  ): Promise<HealthMarker> {
    return this.healthMarkerRepository.findById(id, filter);
  }

  @patch('/health-markers/{id}', {
    responses: {
      '204': {
        description: 'HealthMarker PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HealthMarker, {partial: true}),
        },
      },
    })
    healthMarker: HealthMarker,
  ): Promise<void> {
    await this.healthMarkerRepository.updateById(id, healthMarker);
  }

  @put('/health-markers/{id}', {
    responses: {
      '204': {
        description: 'HealthMarker PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() healthMarker: HealthMarker,
  ): Promise<void> {
    await this.healthMarkerRepository.replaceById(id, healthMarker);
  }

  @del('/health-markers/{id}', {
    responses: {
      '204': {
        description: 'HealthMarker DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.healthMarkerRepository.deleteById(id);
  }
}
