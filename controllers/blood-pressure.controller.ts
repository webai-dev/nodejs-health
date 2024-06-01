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

import {BloodPressure} from '../models';
import {BloodPressureRepository, UserRoleRepository} from '../repositories';

import { USER_ROLES } from '../constants';

export class BloodPressureController {
  constructor(
    @repository(BloodPressureRepository)
    public bloodPressureRepository : BloodPressureRepository,
    @repository(UserRoleRepository)
    public userRoleRepository : UserRoleRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true })
    private user: UserProfile,
  ) {}

  @post('/blood-pressures', {
    operationId: 'createBloodPressure',
    responses: {
      '200': {
        description: 'BloodPressure model instance',
        content: {'application/json': {schema: getModelSchemaRef(BloodPressure)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BloodPressure, {
            title: 'NewBloodPressure',
            exclude: ['id'],
          }),
        },
      },
    })
    bloodPressure: Omit<BloodPressure, 'id'>,
  ): Promise<BloodPressure> {
    return this.bloodPressureRepository.create({...bloodPressure, userId: bloodPressure.userId || this.user.id});
  }

  @get('/blood-pressures/count', {
    operationId: 'bloodPressuresCount',
    responses: {
      '200': {
        description: 'BloodPressure model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(BloodPressure) where?: Where<BloodPressure>,
  ): Promise<Count> {
    return this.bloodPressureRepository.count(where);
  }

  @get('/blood-pressures', {
    operationId: 'bloodPressures',
    responses: {
      '200': {
        description: 'Array of BloodPressure model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(BloodPressure, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(BloodPressure, {name: 'BloodPressuresFilter'}) filter?: Filter<BloodPressure>,
  ): Promise<BloodPressure[]> {
    const userRoles = await this.userRoleRepository.find({ where: { userId: this.user.id }});
    const userRoleIds = userRoles.map(userRole => userRole.roleId);

    if (userRoleIds.includes(USER_ROLES.ADMINISTRATOR) || userRoleIds.includes(USER_ROLES.PROVIDER)) {
      return this.bloodPressureRepository.find(filter);
    }

    return this.bloodPressureRepository.find({...filter, where: {...filter?.where, userId: this.user.id}});
  }

  @patch('/blood-pressures', {
    responses: {
      '200': {
        description: 'BloodPressure PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BloodPressure, {partial: true}),
        },
      },
    })
    bloodPressure: BloodPressure,
    @param.where(BloodPressure) where?: Where<BloodPressure>,
  ): Promise<Count> {
    return this.bloodPressureRepository.updateAll(bloodPressure, where);
  }

  @get('/blood-pressures/{id}', {
    responses: {
      '200': {
        description: 'BloodPressure model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(BloodPressure, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(BloodPressure, {exclude: 'where'}) filter?: FilterExcludingWhere<BloodPressure>
  ): Promise<BloodPressure> {
    return this.bloodPressureRepository.findById(id, filter);
  }

  @patch('/blood-pressures/{id}', {
    operationId: 'updateBloodPressure',
    responses: {
      '204': {
        description: 'BloodPressure PATCH success',
        content: {
          'application/json': {
            schema: getModelSchemaRef(BloodPressure, {includeRelations: true}),
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
          schema: getModelSchemaRef(BloodPressure, {partial: true}),
        },
      },
    })
    bloodPressure: BloodPressure,
  ): Promise<void> {
    await this.bloodPressureRepository.updateById(id, bloodPressure);
  }

  @put('/blood-pressures/{id}', {
    responses: {
      '204': {
        description: 'BloodPressure PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() bloodPressure: BloodPressure,
  ): Promise<void> {
    await this.bloodPressureRepository.replaceById(id, bloodPressure);
  }

  @del('/blood-pressures/{id}', {
    operationId: 'deleteBloodPressure',
    responses: {
      '204': {
        description: 'BloodPressure DELETE success',
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
    await this.bloodPressureRepository.deleteById(id);
  }
}
