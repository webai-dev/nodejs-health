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

import {HealthMarkerExtra} from '../models';
import {HealthMarkerExtraRepository, UserRoleRepository} from '../repositories';

import { USER_ROLES } from '../constants';

export class HealthMarkerExtraController {
  constructor(
    @repository(HealthMarkerExtraRepository)
    public healthMarkerExtraRepository : HealthMarkerExtraRepository,
    @repository(UserRoleRepository)
    public userRoleRepository : UserRoleRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true })
    private user: UserProfile,
  ) {}

  @post('/health-marker-extras', {
    operationId: 'createHealthMarkerExtra',
    responses: {
      '200': {
        description: 'HealthMarkerExtra model instance',
        content: {'application/json': {schema: getModelSchemaRef(HealthMarkerExtra)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HealthMarkerExtra, {
            title: 'NewHealthMarkerExtra',
            exclude: ['id'],
          }),
        },
      },
    })
    healthMarkerExtra: Omit<HealthMarkerExtra, 'id'>,
  ): Promise<HealthMarkerExtra> {
    return this.healthMarkerExtraRepository.create({...healthMarkerExtra, userId: healthMarkerExtra.userId || this.user.id});
  }

  @get('/health-marker-extras/count', {
    operationId: 'healthMarkerExtrasCount',
    responses: {
      '200': {
        description: 'HealthMarkerExtra model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async count(
    @param.where(HealthMarkerExtra) where?: Where<HealthMarkerExtra>,
  ): Promise<Count> {
    return this.healthMarkerExtraRepository.count(where);
  }

  @get('/health-marker-extras', {
    operationId: 'healthMarkerExtras',
    responses: {
      '200': {
        description: 'Array of HealthMarkerExtra model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(HealthMarkerExtra, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(HealthMarkerExtra, {name: 'HealthMarkerExtrasFilter'}) filter?: Filter<HealthMarkerExtra>,
  ): Promise<HealthMarkerExtra[]> {
    const userRoles = await this.userRoleRepository.find({ where: { userId: this.user.id }});
    const userRoleIds = userRoles.map(userRole => userRole.roleId);

    if (userRoleIds.includes(USER_ROLES.ADMINISTRATOR) || userRoleIds.includes(USER_ROLES.PROVIDER)) {
      return this.healthMarkerExtraRepository.find(filter);
    }

    return this.healthMarkerExtraRepository.find({...filter, where: {...filter?.where, userId: this.user.id}});
  }

  @patch('/health-marker-extras', {
    responses: {
      '200': {
        description: 'HealthMarkerExtra PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HealthMarkerExtra, {partial: true}),
        },
      },
    })
    healthMarkerExtra: HealthMarkerExtra,
    @param.where(HealthMarkerExtra) where?: Where<HealthMarkerExtra>,
  ): Promise<Count> {
    return this.healthMarkerExtraRepository.updateAll(healthMarkerExtra, where);
  }

  @get('/health-marker-extras/{id}', {
    responses: {
      '200': {
        description: 'HealthMarkerExtra model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(HealthMarkerExtra, {includeRelations: true}),
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async findById(
    @param.path.number('id') id: number,
    @param.filter(HealthMarkerExtra, {exclude: 'where'}) filter?: FilterExcludingWhere<HealthMarkerExtra>
  ): Promise<HealthMarkerExtra> {
    return this.healthMarkerExtraRepository.findById(id, filter);
  }

  @patch('/health-marker-extras/{id}', {
    operationId: 'updateHealthMarkerExtra',
    responses: {
      '204': {
        description: 'HealthMarkerExtra PATCH success',
        content: {
          'application/json': {
            schema: getModelSchemaRef(HealthMarkerExtra, {includeRelations: true}),
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(HealthMarkerExtra, {partial: true}),
        },
      },
    })
    healthMarkerExtra: HealthMarkerExtra,
  ): Promise<void> {
    await this.healthMarkerExtraRepository.updateById(id, healthMarkerExtra);
  }

  @put('/health-marker-extras/{id}', {
    responses: {
      '204': {
        description: 'HealthMarkerExtra PUT success',
      },
    },
  })
  @authenticate('jwt')
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() healthMarkerExtra: HealthMarkerExtra,
  ): Promise<void> {
    await this.healthMarkerExtraRepository.replaceById(id, healthMarkerExtra);
  }

  @del('/health-marker-extras/{id}', {
    responses: {
      '204': {
        description: 'HealthMarkerExtra DELETE success',
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
    await this.healthMarkerExtraRepository.deleteById(id);
  }
}
