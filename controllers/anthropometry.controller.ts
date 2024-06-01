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

import {Anthropometry} from '../models';
import {AnthropometryRepository, UserRoleRepository} from '../repositories';

import { USER_ROLES } from '../constants';

export class AnthropometryController {
  constructor(
    @repository(AnthropometryRepository)
    public anthropometryRepository : AnthropometryRepository,
    @repository(UserRoleRepository)
    public userRoleRepository : UserRoleRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true })
    private user: UserProfile,
  ) {}

  @post('/anthropometries', {
    operationId: 'createAnthropometry',
    responses: {
      '200': {
        description: 'Anthropometry model instance',
        content: {'application/json': {schema: getModelSchemaRef(Anthropometry, { includeRelations: true })}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Anthropometry, {
            title: 'NewAnthropometry',
            exclude: ['id'],
          }),
        },
      },
    })
    anthropometry: Omit<Anthropometry, 'id'>,
  ): Promise<Anthropometry> {
    return this.anthropometryRepository.create({...anthropometry, userId: anthropometry.userId || this.user.id});
  }

  @get('/anthropometries/count', {
    operationId: 'anthropometriesCount',
    responses: {
      '200': {
        description: 'Anthropometry model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Anthropometry) where?: Where<Anthropometry>,
  ): Promise<Count> {
    return this.anthropometryRepository.count(where);
  }

  @get('/anthropometries', {
    operationId: 'anthropometries',
    responses: {
      '200': {
        description: 'Array of Anthropometry model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Anthropometry, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(Anthropometry, {name: 'AnthropometriesFilter'}) filter?: Filter<Anthropometry>,
  ): Promise<Anthropometry[]> {
    const userRoles = await this.userRoleRepository.find({ where: { userId: this.user.id }});
    const userRoleIds = userRoles.map(userRole => userRole.roleId);

    if (userRoleIds.includes(USER_ROLES.ADMINISTRATOR) || userRoleIds.includes(USER_ROLES.PROVIDER)) {
      return this.anthropometryRepository.find(filter);
    }

    return this.anthropometryRepository.find({...filter, where: {...filter?.where, userId: this.user.id}});
  }

  @patch('/anthropometries', {
    responses: {
      '200': {
        description: 'Anthropometry PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Anthropometry, {partial: true}),
        },
      },
    })
    anthropometry: Anthropometry,
    @param.where(Anthropometry) where?: Where<Anthropometry>,
  ): Promise<Count> {
    return this.anthropometryRepository.updateAll(anthropometry, where);
  }

  @get('/anthropometries/{id}', {
    responses: {
      '200': {
        description: 'Anthropometry model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Anthropometry, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Anthropometry, {exclude: 'where'}) filter?: FilterExcludingWhere<Anthropometry>
  ): Promise<Anthropometry> {
    return this.anthropometryRepository.findById(id, filter);
  }

  @patch('/anthropometries/{id}', {
    operationId: 'updateAnthropometry',
    responses: {
      '204': {
        description: 'Anthropometry PATCH success',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Anthropometry, {partial: true}),
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
          schema: getModelSchemaRef(Anthropometry, {partial: true}),
        },
      },
    })
    anthropometry: Anthropometry,
  ): Promise<void> {
    await this.anthropometryRepository.updateById(id, anthropometry);
  }

  @put('/anthropometries/{id}', {
    responses: {
      '204': {
        description: 'Anthropometry PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() anthropometry: Anthropometry,
  ): Promise<void> {
    await this.anthropometryRepository.replaceById(id, anthropometry);
  }

  @del('/anthropometries/{id}', {
    operationId: 'deleteAnthropometry',
    responses: {
      '204': {
        description: 'Anthropometry DELETE success',
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
    await this.anthropometryRepository.deleteById(id);
  }
}
