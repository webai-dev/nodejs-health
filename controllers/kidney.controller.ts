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

import {Kidney} from '../models';
import {KidneyRepository, UserRoleRepository} from '../repositories';

import { USER_ROLES } from '../constants';

export class KidneyController {
  constructor(
    @repository(KidneyRepository)
    public kidneyRepository : KidneyRepository,
    @repository(UserRoleRepository)
    public userRoleRepository : UserRoleRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true })
    private user: UserProfile,
  ) {}

  @post('/kidneys', {
    operationId: 'createKidney',
    responses: {
      '200': {
        description: 'Kidney model instance',
        content: {'application/json': {schema: getModelSchemaRef(Kidney)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Kidney, {
            title: 'NewKidney',
            exclude: ['id'],
          }),
        },
      },
    })
    kidney: Omit<Kidney, 'id'>,
  ): Promise<Kidney> {
    return this.kidneyRepository.create({...kidney, userId: kidney.userId || this.user.id});
  }

  @get('/kidneys/count', {
    operationId: 'kidneysCount',
    responses: {
      '200': {
        description: 'Kidney model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Kidney) where?: Where<Kidney>,
  ): Promise<Count> {
    return this.kidneyRepository.count(where);
  }

  @get('/kidneys', {
    operationId: 'kidneys',
    responses: {
      '200': {
        description: 'Array of Kidney model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Kidney, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(Kidney, {name: 'KidneysFilter'}) filter?: Filter<Kidney>,
  ): Promise<Kidney[]> {
    const userRoles = await this.userRoleRepository.find({ where: { userId: this.user.id }});
    const userRoleIds = userRoles.map(userRole => userRole.roleId);

    if (userRoleIds.includes(USER_ROLES.ADMINISTRATOR) || userRoleIds.includes(USER_ROLES.PROVIDER)) {
      return this.kidneyRepository.find(filter);
    }

    return this.kidneyRepository.find({...filter, where: {...filter?.where, userId: this.user.id}});
  }

  @patch('/kidneys', {
    responses: {
      '200': {
        description: 'Kidney PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Kidney, {partial: true}),
        },
      },
    })
    kidney: Kidney,
    @param.where(Kidney) where?: Where<Kidney>,
  ): Promise<Count> {
    return this.kidneyRepository.updateAll(kidney, where);
  }

  @get('/kidneys/{id}', {
    responses: {
      '200': {
        description: 'Kidney model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Kidney, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Kidney, {exclude: 'where'}) filter?: FilterExcludingWhere<Kidney>
  ): Promise<Kidney> {
    return this.kidneyRepository.findById(id, filter);
  }

  @patch('/kidneys/{id}', {
    operationId: 'updateKidney',
    responses: {
      '204': {
        description: 'Kidney PATCH success',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Kidney, {includeRelations: true}),
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
          schema: getModelSchemaRef(Kidney, {partial: true}),
        },
      },
    })
    kidney: Kidney,
  ): Promise<void> {
    await this.kidneyRepository.updateById(id, kidney);
  }

  @put('/kidneys/{id}', {
    responses: {
      '204': {
        description: 'Kidney PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() kidney: Kidney,
  ): Promise<void> {
    await this.kidneyRepository.replaceById(id, kidney);
  }

  @del('/kidneys/{id}', {
    operationId: 'deleteKidney',
    responses: {
      '204': {
        description: 'Kidney DELETE success',
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
    await this.kidneyRepository.deleteById(id);
  }
}
