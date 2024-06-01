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

import {GlucoseManual} from '../models';
import {GlucoseManualRepository, UserRoleRepository} from '../repositories';

import { USER_ROLES } from '../constants';

export class GlucoseManualController {
  constructor(
    @repository(GlucoseManualRepository)
    public glucoseManualRepository : GlucoseManualRepository,
    @repository(UserRoleRepository)
    public userRoleRepository : UserRoleRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true })
    private user: UserProfile,
  ) {}

  @post('/glucose-manuals', {
    operationId: 'createGlucoseManual',
    responses: {
      '200': {
        description: 'GlucoseManual model instance',
        content: {'application/json': {schema: getModelSchemaRef(GlucoseManual)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GlucoseManual, {
            title: 'NewGlucoseManual',
            exclude: ['id'],
          }),
        },
      },
    })
    glucoseManual: Omit<GlucoseManual, 'id'>,
  ): Promise<GlucoseManual> {
    return this.glucoseManualRepository.create({...glucoseManual, userId: glucoseManual.userId || this.user.id});
  }

  @get('/glucose-manuals/count', {
    operationId: 'glucoseManualsCount',
    responses: {
      '200': {
        description: 'GlucoseManual model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(GlucoseManual) where?: Where<GlucoseManual>,
  ): Promise<Count> {
    return this.glucoseManualRepository.count(where);
  }

  @get('/glucose-manuals', {
    operationId: 'glucoseManuals',
    responses: {
      '200': {
        description: 'Array of GlucoseManual model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(GlucoseManual, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(GlucoseManual, {name: 'GlucoseManualsFilter'}) filter?: Filter<GlucoseManual>,
  ): Promise<GlucoseManual[]> {
    const userRoles = await this.userRoleRepository.find({ where: { userId: this.user.id }});
    const userRoleIds = userRoles.map(userRole => userRole.roleId);

    if (userRoleIds.includes(USER_ROLES.ADMINISTRATOR) || userRoleIds.includes(USER_ROLES.PROVIDER)) {
      return this.glucoseManualRepository.find(filter);
    }

    return this.glucoseManualRepository.find({...filter, where: {...filter?.where, userId: this.user.id}});
  }

  @patch('/glucose-manuals', {
    responses: {
      '200': {
        description: 'GlucoseManual PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GlucoseManual, {partial: true}),
        },
      },
    })
    glucoseManual: GlucoseManual,
    @param.where(GlucoseManual) where?: Where<GlucoseManual>,
  ): Promise<Count> {
    return this.glucoseManualRepository.updateAll(glucoseManual, where);
  }

  @get('/glucose-manuals/{id}', {
    responses: {
      '200': {
        description: 'GlucoseManual model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(GlucoseManual, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(GlucoseManual, {exclude: 'where'}) filter?: FilterExcludingWhere<GlucoseManual>
  ): Promise<GlucoseManual> {
    return this.glucoseManualRepository.findById(id, filter);
  }

  @patch('/glucose-manuals/{id}', {
    operationId: 'updateGlucoseManual',
    responses: {
      '204': {
        description: 'GlucoseManual PATCH success',
        content: {
          'application/json': {
            schema: getModelSchemaRef(GlucoseManual, {includeRelations: true}),
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
          schema: getModelSchemaRef(GlucoseManual, {partial: true}),
        },
      },
    })
    glucoseManual: GlucoseManual,
  ): Promise<void> {
    await this.glucoseManualRepository.updateById(id, glucoseManual);
  }

  @put('/glucose-manuals/{id}', {
    responses: {
      '204': {
        description: 'GlucoseManual PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() glucoseManual: GlucoseManual,
  ): Promise<void> {
    await this.glucoseManualRepository.replaceById(id, glucoseManual);
  }

  @del('/glucose-manuals/{id}', {
    operationId: 'deleteGlucoseManual',
    responses: {
      '204': {
        description: 'GlucoseManual DELETE success',
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
    await this.glucoseManualRepository.deleteById(id);
  }
}
