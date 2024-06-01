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

import {UserBaseline} from '../models';
import {UserBaselineRepository} from '../repositories';

export class UserBaselineController {
  constructor(
    @repository(UserBaselineRepository)
    public userBaselineRepository : UserBaselineRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true })
    private user: UserProfile,
  ) {}

  @post('/user-baselines', {
    operationId: 'createUserBaseline',
    responses: {
      '200': {
        description: 'UserBaseline model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserBaseline, {includeRelations: true})}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserBaseline, {
            title: 'NewUserBaseline',
            exclude: ['id'],
          }),
        },
      },
    })
    userBaseline: Omit<UserBaseline, 'id'>,
  ): Promise<UserBaseline> {
    return this.userBaselineRepository.create({...userBaseline, userId: this.user.id});
  }

  @get('/user-baselines/count', {
    responses: {
      '200': {
        description: 'UserBaseline model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(UserBaseline) where?: Where<UserBaseline>,
  ): Promise<Count> {
    return this.userBaselineRepository.count(where);
  }

  @get('/user-baselines', {
    operationId: 'userBaselines',
    responses: {
      '200': {
        description: 'Array of UserBaseline model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(UserBaseline, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(UserBaseline, {name: 'UserBaselinesFilter'}) filter?: Filter<UserBaseline>,
  ): Promise<UserBaseline[]> {
    return this.userBaselineRepository.find(filter);
  }

  @patch('/user-baselines', {
    responses: {
      '200': {
        description: 'UserBaseline PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserBaseline, {partial: true}),
        },
      },
    })
    userBaseline: UserBaseline,
    @param.where(UserBaseline) where?: Where<UserBaseline>,
  ): Promise<Count> {
    return this.userBaselineRepository.updateAll(userBaseline, where);
  }

  @get('/user-baselines/{id}', {
    operationId: 'userBaseline',
    responses: {
      '200': {
        description: 'UserBaseline model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserBaseline, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(UserBaseline, {exclude: 'where'}) filter?: FilterExcludingWhere<UserBaseline>
  ): Promise<UserBaseline> {
    return this.userBaselineRepository.findById(id, filter);
  }

  @patch('/user-baselines/{id}', {
    operationId: 'updateUserBaseline',
    responses: {
      '204': {
        description: 'UserBaseline PATCH success',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserBaseline, {includeRelations: true}),
          }
        }
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserBaseline, {partial: true}),
        },
      },
    })
    userBaseline: UserBaseline,
  ): Promise<void> {
    await this.userBaselineRepository.updateById(id, userBaseline);
  }

  @put('/user-baselines/{id}', {
    responses: {
      '204': {
        description: 'UserBaseline PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() userBaseline: UserBaseline,
  ): Promise<void> {
    await this.userBaselineRepository.replaceById(id, userBaseline);
  }

  @del('/user-baselines/{id}', {
    operationId: 'deleteUserBaseline',
    responses: {
      '204': {
        description: 'UserBaseline DELETE success',
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
    await this.userBaselineRepository.deleteById(id);
  }
}
