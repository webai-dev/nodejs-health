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

import {Lifestyle} from '../models';
import {LifestyleRepository, UserRoleRepository} from '../repositories';

import { USER_ROLES } from '../constants';

export class LifestyleController {
  constructor(
    @repository(LifestyleRepository)
    public lifestyleRepository : LifestyleRepository,
    @repository(UserRoleRepository)
    public userRoleRepository : UserRoleRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true })
    private user: UserProfile,
  ) {}

  @post('/lifestyles', {
    operationId: 'createLifestyle',
    responses: {
      '200': {
        description: 'Lifestyle model instance',
        content: {'application/json': {schema: getModelSchemaRef(Lifestyle)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Lifestyle, {
            title: 'NewLifestyle',
            exclude: ['id'],
          }),
        },
      },
    })
    lifestyle: Omit<Lifestyle, 'id'>,
  ): Promise<Lifestyle> {
    return this.lifestyleRepository.create({...lifestyle, userId: lifestyle.userId || this.user.id});
  }

  @get('/lifestyles/count', {
    operationId: 'lifestylesCount',
    responses: {
      '200': {
        description: 'Lifestyle model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Lifestyle) where?: Where<Lifestyle>,
  ): Promise<Count> {
    return this.lifestyleRepository.count(where);
  }

  @get('/lifestyles', {
    operationId: 'lifestyles',
    responses: {
      '200': {
        description: 'Array of Lifestyle model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Lifestyle, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(Lifestyle, {name: 'LifestylesFilter'}) filter?: Filter<Lifestyle>,
  ): Promise<Lifestyle[]> {
    const userRoles = await this.userRoleRepository.find({ where: { userId: this.user.id }});
    const userRoleIds = userRoles.map(userRole => userRole.roleId);

    if (userRoleIds.includes(USER_ROLES.ADMINISTRATOR) || userRoleIds.includes(USER_ROLES.PROVIDER)) {
      return this.lifestyleRepository.find(filter);
    }

    return this.lifestyleRepository.find({...filter, where: {...filter?.where, userId: this.user.id}});
  }

  @patch('/lifestyles', {
    responses: {
      '200': {
        description: 'Lifestyle PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Lifestyle, {partial: true}),
        },
      },
    })
    lifestyle: Lifestyle,
    @param.where(Lifestyle) where?: Where<Lifestyle>,
  ): Promise<Count> {
    return this.lifestyleRepository.updateAll(lifestyle, where);
  }

  @get('/lifestyles/{id}', {
    responses: {
      '200': {
        description: 'Lifestyle model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Lifestyle, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Lifestyle, {exclude: 'where'}) filter?: FilterExcludingWhere<Lifestyle>
  ): Promise<Lifestyle> {
    return this.lifestyleRepository.findById(id, filter);
  }

  @patch('/lifestyles/{id}', {
    operationId: 'updateLifestyle',
    responses: {
      '204': {
        description: 'Lifestyle PATCH success',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Lifestyle, {includeRelations: true}),
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
          schema: getModelSchemaRef(Lifestyle, {partial: true}),
        },
      },
    })
    lifestyle: Lifestyle,
  ): Promise<void> {
    await this.lifestyleRepository.updateById(id, lifestyle);
  }

  @put('/lifestyles/{id}', {
    responses: {
      '204': {
        description: 'Lifestyle PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() lifestyle: Lifestyle,
  ): Promise<void> {
    await this.lifestyleRepository.replaceById(id, lifestyle);
  }

  @del('/lifestyles/{id}', {
    operationId: 'deleteLifestyle',
    responses: {
      '204': {
        description: 'Lifestyle DELETE success',
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
    await this.lifestyleRepository.deleteById(id);
  }
}
