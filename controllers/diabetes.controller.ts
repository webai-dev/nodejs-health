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

import {Diabetes} from '../models';
import {DiabetesRepository, UserRoleRepository} from '../repositories';

import { USER_ROLES } from '../constants';

export class DiabetesController {
  constructor(
    @repository(DiabetesRepository)
    public diabetesRepository : DiabetesRepository,
    @repository(UserRoleRepository)
    public userRoleRepository : UserRoleRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true })
    private user: UserProfile,
  ) {}

  @post('/diabetes', {
    operationId: 'createDiabetes',
    responses: {
      '200': {
        description: 'Diabetes model instance',
        content: {'application/json': {schema: getModelSchemaRef(Diabetes, { includeRelations: true })}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Diabetes, {
            title: 'NewDiabetes',
            exclude: ['id'],
          }),
        },
      },
    })
    diabetes: Omit<Diabetes, 'id'>,
  ): Promise<Diabetes> {
    return this.diabetesRepository.create({...diabetes, userId: diabetes.userId || this.user.id});
  }

  @get('/diabetes/count', {
    operationId: 'diabetesCount',
    responses: {
      '200': {
        description: 'Diabetes model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Diabetes) where?: Where<Diabetes>,
  ): Promise<Count> {
    return this.diabetesRepository.count(where);
  }

  @get('/diabetes', {
    operationId: 'diabetes',
    responses: {
      '200': {
        description: 'Array of Diabetes model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Diabetes, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(Diabetes, {name: 'DiabetesFilter'}) filter?: Filter<Diabetes>,
  ): Promise<Diabetes[]> {
    const userRoles = await this.userRoleRepository.find({ where: { userId: this.user.id }});
    const userRoleIds = userRoles.map(userRole => userRole.roleId);

    if (userRoleIds.includes(USER_ROLES.ADMINISTRATOR) || userRoleIds.includes(USER_ROLES.PROVIDER)) {
      return this.diabetesRepository.find(filter);
    }

    return this.diabetesRepository.find({...filter, where: {...filter?.where, userId: this.user.id}});
  }

  @patch('/diabetes', {
    responses: {
      '200': {
        description: 'Diabetes PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Diabetes, {partial: true}),
        },
      },
    })
    diabetes: Diabetes,
    @param.where(Diabetes) where?: Where<Diabetes>,
  ): Promise<Count> {
    return this.diabetesRepository.updateAll(diabetes, where);
  }

  @get('/diabetes/{id}', {
    responses: {
      '200': {
        description: 'Diabetes model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Diabetes, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Diabetes, {exclude: 'where'}) filter?: FilterExcludingWhere<Diabetes>
  ): Promise<Diabetes> {
    return this.diabetesRepository.findById(id, filter);
  }

  @patch('/diabetes/{id}', {
    operationId: 'updateDiabetes',
    responses: {
      '204': {
        description: 'Diabetes PATCH success',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Diabetes, {includeRelations: true}),
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
          schema: getModelSchemaRef(Diabetes, {partial: true}),
        },
      },
    })
    diabetes: Diabetes,
  ): Promise<void> {
    await this.diabetesRepository.updateById(id, diabetes);
  }

  @put('/diabetes/{id}', {
    responses: {
      '204': {
        description: 'Diabetes PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() diabetes: Diabetes,
  ): Promise<void> {
    await this.diabetesRepository.replaceById(id, diabetes);
  }

  @del('/diabetes/{id}', {
    operationId: 'deleteDiabetes',
    responses: {
      '204': {
        description: 'Diabetes DELETE success',
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
    await this.diabetesRepository.deleteById(id);
  }
}
