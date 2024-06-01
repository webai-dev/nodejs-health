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

import {Activity} from '../models';
import {ActivityRepository} from '../repositories';

import { JWTAuthenticationStrategy } from '../strategies/jwt-strategy';
import {OPERATION_SECURITY_SPEC} from "../utils/security-spec";

export class ActivityController {
  constructor(
    @repository(ActivityRepository)
    public activityRepository : ActivityRepository,
    // public jwtAuthenticationStragtegy: JWTAuthenticationStrategy,
  ) {}

  @post('/activities', {
    operationId: 'createActivity',
    responses: {
      '200': {
        description: 'Activity model instance',
        content: {'application/json': {schema: getModelSchemaRef(Activity)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Activity, {
            title: 'NewActivity',
            exclude: ['id'],
          }),
        },
      },
    })
    activity: Omit<Activity, 'id'>,
  ): Promise<Activity> {
    return this.activityRepository.create(activity);
  }

  @get('/activities/count', {
    operationId: 'activitiesCount',
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Activity model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async count(
    @param.where(Activity) where?: Where<Activity>,
  ): Promise<Count> {
    return this.activityRepository.count(where);
  }

  @get('/activities', {
    operationId: 'activities',
    responses: {
      '200': {
        description: 'Array of Activity model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Activity, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(Activity, {name: 'ActivitiesFilter'}) filter?: Filter<Activity>,
  ): Promise<Activity[]> {
    return this.activityRepository.find(filter);
  }

  @patch('/activities', {
    responses: {
      '200': {
        description: 'Activity PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Activity, {partial: true}),
        },
      },
    })
    activity: Activity,
    @param.where(Activity) where?: Where<Activity>,
  ): Promise<Count> {
    return this.activityRepository.updateAll(activity, where);
  }

  @get('/activities/{id}', {
    operationId: 'activity',
    responses: {
      '200': {
        description: 'Activity model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Activity, {includeRelations: true}),
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Activity, {exclude: 'where'}) filter?: FilterExcludingWhere<Activity>
  ): Promise<Activity> {
    return this.activityRepository.findById(id, filter);
  }

  @patch('/activities/{id}', {
    operationId: 'updateActivity',
    responses: {
      '204': {
        description: 'Activity PATCH success',
        content: {'application/json': {schema: getModelSchemaRef(Activity, { includeRelations: true, partial: true })}},
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Activity, {partial: true}),
        },
      },
    })
    activity: Activity,
  ): Promise<void> {
    await this.activityRepository.updateById(id, activity);
  }

  @put('/activities/{id}', {
    responses: {
      '204': {
        description: 'Activity PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() activity: Activity,
  ): Promise<void> {
    await this.activityRepository.replaceById(id, activity);
  }

  @del('/activities/{id}', {
    operationId: 'deleteActivity',
    responses: {
      '204': {
        description: 'Activity DELETE success',
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
  @authenticate('jwt')
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.activityRepository.deleteById(id);
  }
}
