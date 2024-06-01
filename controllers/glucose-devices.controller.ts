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

import {GlucoseDevices} from '../models';
import {GlucoseDevicesRepository, UserRoleRepository} from '../repositories';

import { USER_ROLES } from '../constants';

export class GlucoseDevicesController {
  constructor(
    @repository(GlucoseDevicesRepository)
    public glucoseDevicesRepository : GlucoseDevicesRepository,
    @repository(UserRoleRepository)
    public userRoleRepository : UserRoleRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true })
    private user: UserProfile,
  ) {}

  @post('/glucose-devices', {
    operationId: 'createGlucoseDevice',
    responses: {
      '200': {
        description: 'GlucoseDevices model instance',
        content: {'application/json': {schema: getModelSchemaRef(GlucoseDevices)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GlucoseDevices, {
            title: 'NewGlucoseDevice',
            exclude: ['id'],
          }),
        },
      },
    })
    glucoseDevices: Omit<GlucoseDevices, 'id'>,
  ): Promise<GlucoseDevices> {
    return this.glucoseDevicesRepository.create({...glucoseDevices, userId: glucoseDevices.userId || this.user.id});
  }

  @get('/glucose-devices/count', {
    operationId: 'glucoseDevicesCount',
    responses: {
      '200': {
        description: 'GlucoseDevices model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(GlucoseDevices) where?: Where<GlucoseDevices>,
  ): Promise<Count> {
    return this.glucoseDevicesRepository.count(where);
  }

  @get('/glucose-devices', {
    operationId: 'glucoseDevices',
    responses: {
      '200': {
        description: 'Array of GlucoseDevices model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(GlucoseDevices, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(GlucoseDevices, {name: 'GlucoseDevicesFilter'}) filter?: Filter<GlucoseDevices>,
  ): Promise<GlucoseDevices[]> {
    const userRoles = await this.userRoleRepository.find({ where: { userId: this.user.id }});
    const userRoleIds = userRoles.map(userRole => userRole.roleId);

    if (userRoleIds.includes(USER_ROLES.ADMINISTRATOR) || userRoleIds.includes(USER_ROLES.PROVIDER)) {
      return this.glucoseDevicesRepository.find(filter);
    }

    return this.glucoseDevicesRepository.find({...filter, where: {...filter?.where, userId: this.user.id}});
  }

  @patch('/glucose-devices', {
    responses: {
      '200': {
        description: 'GlucoseDevices PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GlucoseDevices, {partial: true}),
        },
      },
    })
    glucoseDevices: GlucoseDevices,
    @param.where(GlucoseDevices) where?: Where<GlucoseDevices>,
  ): Promise<Count> {
    return this.glucoseDevicesRepository.updateAll(glucoseDevices, where);
  }

  @get('/glucose-devices/{id}', {
    responses: {
      '200': {
        description: 'GlucoseDevices model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(GlucoseDevices, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(GlucoseDevices, {exclude: 'where'}) filter?: FilterExcludingWhere<GlucoseDevices>
  ): Promise<GlucoseDevices> {
    return this.glucoseDevicesRepository.findById(id, filter);
  }

  @patch('/glucose-devices/{id}', {
    operationId: 'updateGlucoseDevice',
    responses: {
      '204': {
        description: 'GlucoseDevices PATCH success',
        content: {
          'application/json': {
            schema: getModelSchemaRef(GlucoseDevices, {includeRelations: true}),
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
          schema: getModelSchemaRef(GlucoseDevices, {partial: true}),
        },
      },
    })
    glucoseDevices: GlucoseDevices,
  ): Promise<void> {
    await this.glucoseDevicesRepository.updateById(id, glucoseDevices);
  }

  @put('/glucose-devices/{id}', {
    responses: {
      '204': {
        description: 'GlucoseDevices PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() glucoseDevices: GlucoseDevices,
  ): Promise<void> {
    await this.glucoseDevicesRepository.replaceById(id, glucoseDevices);
  }

  @del('/glucose-devices/{id}', {
    operationId: 'deleteGlucoseDevice',
    responses: {
      '204': {
        description: 'GlucoseDevices DELETE success',
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
    await this.glucoseDevicesRepository.deleteById(id);
  }
}
