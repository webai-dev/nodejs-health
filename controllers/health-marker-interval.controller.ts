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

import {
  AuthenticationBindings,
  authenticate
} from '@loopback/authentication';
import {UserProfile} from '@loopback/security';
import { inject } from '@loopback/core';

import {HealthMarkerInterval} from '../models';
import {HealthMarkerIntervalRepository} from '../repositories';

export class HealthMarkerIntervalController {
  constructor(
    @repository(HealthMarkerIntervalRepository)
    public healthMarkerIntervalRepository : HealthMarkerIntervalRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true })
    private user: UserProfile,
  ) {}

  @post('/health-marker-intervals', {
    operationId: 'createHealthMarkerInterval',
    responses: {
      '200': {
        description: 'HealthMarkerInterval model instance',
        content: {'application/json': {schema: getModelSchemaRef(HealthMarkerInterval)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HealthMarkerInterval, {
            title: 'NewHealthMarkerInterval',
            exclude: ['id'],
          }),
        },
      },
    })
    healthMarkerInterval: Omit<HealthMarkerInterval, 'id'>,
  ): Promise<HealthMarkerInterval> {
    return this.healthMarkerIntervalRepository.create({...healthMarkerInterval, userId: this.user.id});
  }

  @get('/health-marker-intervals/count', {
    operationId: 'healthMarkerIntervalsCount',
    responses: {
      '200': {
        description: 'HealthMarkerInterval model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(HealthMarkerInterval) where?: Where<HealthMarkerInterval>,
  ): Promise<Count> {
    return this.healthMarkerIntervalRepository.count(where);
  }

  @get('/health-marker-intervals', {
    operationId: 'healthMarkerIntervals',
    responses: {
      '200': {
        description: 'Array of HealthMarkerInterval model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(HealthMarkerInterval, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(HealthMarkerInterval, {name: 'HealthMarkerIntervalsFilter'}) filter?: Filter<HealthMarkerInterval>,
  ): Promise<HealthMarkerInterval[]> {
    return this.healthMarkerIntervalRepository.find({...filter, where: {...filter?.where, userId: this.user.id}});
  }

  @patch('/health-marker-intervals', {
    responses: {
      '200': {
        description: 'HealthMarkerInterval PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HealthMarkerInterval, {partial: true}),
        },
      },
    })
    healthMarkerInterval: HealthMarkerInterval,
    @param.where(HealthMarkerInterval) where?: Where<HealthMarkerInterval>,
  ): Promise<Count> {
    return this.healthMarkerIntervalRepository.updateAll(healthMarkerInterval, where);
  }

  @get('/health-marker-intervals/{id}', {
    responses: {
      '200': {
        description: 'HealthMarkerInterval model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(HealthMarkerInterval, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(HealthMarkerInterval, {exclude: 'where'}) filter?: FilterExcludingWhere<HealthMarkerInterval>
  ): Promise<HealthMarkerInterval> {
    return this.healthMarkerIntervalRepository.findById(id, filter);
  }

  @patch('/health-marker-intervals/{id}', {
    operationId: 'updateHealthMarkerInterval',
    responses: {
      '204': {
        description: 'HealthMarkerInterval PATCH success',
        content: {'application/json': {schema: getModelSchemaRef(HealthMarkerInterval, { includeRelations: true })}},
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HealthMarkerInterval, {partial: true}),
        },
      },
    })
    healthMarkerInterval: HealthMarkerInterval,
  ): Promise<void> {
    await this.healthMarkerIntervalRepository.updateById(id, healthMarkerInterval);
  }

  @put('/health-marker-intervals/{id}', {
    responses: {
      '204': {
        description: 'HealthMarkerInterval PUT success',
      },
    },
  })
  @authenticate('jwt')
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() healthMarkerInterval: HealthMarkerInterval,
  ): Promise<void> {
    await this.healthMarkerIntervalRepository.replaceById(id, healthMarkerInterval);
  }

  @del('/health-marker-intervals/{id}', {
    operationId: 'deleteHealthMarkerInterval',
    responses: {
      '204': {
        description: 'HealthMarkerInterval DELETE success',
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
    await this.healthMarkerIntervalRepository.deleteById(id);
  }
}
