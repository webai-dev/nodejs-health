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

import {InsulinInjections} from '../models';
import {InsulinInjectionsRepository, UserRoleRepository} from '../repositories';

import { USER_ROLES } from '../constants';

export class InsulinInjectionsController {
  constructor(
    @repository(InsulinInjectionsRepository)
    public insulinInjectionsRepository : InsulinInjectionsRepository,
    @repository(UserRoleRepository)
    public userRoleRepository : UserRoleRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true })
    private user: UserProfile,
  ) {}

  @post('/insulin-injections', {
    operationId: 'createInsulinInjection',
    responses: {
      '200': {
        description: 'InsulinInjections model instance',
        content: {'application/json': {schema: getModelSchemaRef(InsulinInjections)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InsulinInjections, {
            title: 'NewInsulinInjection',
            exclude: ['id'],
          }),
        },
      },
    })
    insulinInjections: Omit<InsulinInjections, 'id'>,
  ): Promise<InsulinInjections> {
    return this.insulinInjectionsRepository.create({...insulinInjections, userId: insulinInjections.userId || this.user.id});
  }

  @get('/insulin-injections/count', {
    operationId: 'insulinInjectionsCount',
    responses: {
      '200': {
        description: 'InsulinInjections model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(InsulinInjections) where?: Where<InsulinInjections>,
  ): Promise<Count> {
    return this.insulinInjectionsRepository.count(where);
  }

  @get('/insulin-injections', {
    operationId: 'insulinInjections',
    responses: {
      '200': {
        description: 'Array of InsulinInjections model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(InsulinInjections, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(InsulinInjections, {name: 'InsulinInjectionsFilter'}) filter?: Filter<InsulinInjections>,
  ): Promise<InsulinInjections[]> {
    const userRoles = await this.userRoleRepository.find({ where: { userId: this.user.id }});
    const userRoleIds = userRoles.map(userRole => userRole.roleId);

    if (userRoleIds.includes(USER_ROLES.ADMINISTRATOR) || userRoleIds.includes(USER_ROLES.PROVIDER)) {
      return this.insulinInjectionsRepository.find(filter);
    }

    return this.insulinInjectionsRepository.find({...filter, where: {...filter?.where, userId: this.user.id}});
  }

  @patch('/insulin-injections', {
    responses: {
      '200': {
        description: 'InsulinInjections PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InsulinInjections, {partial: true}),
        },
      },
    })
    insulinInjections: InsulinInjections,
    @param.where(InsulinInjections) where?: Where<InsulinInjections>,
  ): Promise<Count> {
    return this.insulinInjectionsRepository.updateAll(insulinInjections, where);
  }

  @get('/insulin-injections/{id}', {
    responses: {
      '200': {
        description: 'InsulinInjections model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(InsulinInjections, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(InsulinInjections, {exclude: 'where'}) filter?: FilterExcludingWhere<InsulinInjections>
  ): Promise<InsulinInjections> {
    return this.insulinInjectionsRepository.findById(id, filter);
  }

  @patch('/insulin-injections/{id}', {
    operationId: 'updateInsulinInjection',
    responses: {
      '204': {
        description: 'InsulinInjections PATCH success',
        content: {
          'application/json': {
            schema: getModelSchemaRef(InsulinInjections, {includeRelations: true}),
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
          schema: getModelSchemaRef(InsulinInjections, {partial: true}),
        },
      },
    })
    insulinInjections: InsulinInjections,
  ): Promise<void> {
    await this.insulinInjectionsRepository.updateById(id, insulinInjections);
  }

  @put('/insulin-injections/{id}', {
    responses: {
      '204': {
        description: 'InsulinInjections PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() insulinInjections: InsulinInjections,
  ): Promise<void> {
    await this.insulinInjectionsRepository.replaceById(id, insulinInjections);
  }

  @del('/insulin-injections/{id}', {
    operationId: 'deleteInsulinInjection',
    responses: {
      '204': {
        description: 'InsulinInjections DELETE success',
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
    await this.insulinInjectionsRepository.deleteById(id);
  }
}
