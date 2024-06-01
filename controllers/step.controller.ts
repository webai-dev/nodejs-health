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

import {Step} from '../models';
import {StepRepository, UserRoleRepository} from '../repositories';

import { USER_ROLES } from '../constants';

export class StepController {
  constructor(
    @repository(StepRepository)
    public stepRepository : StepRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true })
    private user: UserProfile,
    @repository(UserRoleRepository)
    public userRoleRepository : UserRoleRepository,
  ) {}

  @post('/steps', {
    operationId: 'createStep',
    responses: {
      '200': {
        description: 'Step model instance',
        content: {'application/json': {schema: getModelSchemaRef(Step)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Step, {
            title: 'NewStep',
            exclude: ['id'],
          }),
        },
      },
    })
    step: Omit<Step, 'id'>,
  ): Promise<Step> {
    return this.stepRepository.create({...step, userId: step.userId || this.user.id});
  }

  @get('/steps/count', {
    operationId: 'stepsCount',
    responses: {
      '200': {
        description: 'Step model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Step) where?: Where<Step>,
  ): Promise<Count> {
    return this.stepRepository.count(where);
  }

  @get('/steps', {
    operationId: 'steps',
    responses: {
      '200': {
        description: 'Array of Step model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Step, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(Step, { name: 'StepsFilter' }) filter?: Filter<Step>,
  ): Promise<Step[]> {
    const userRoles = await this.userRoleRepository.find({ where: { userId: this.user.id }});
    const userRoleIds = userRoles.map(userRole => userRole.roleId);

    if (userRoleIds.includes(USER_ROLES.ADMINISTRATOR) || userRoleIds.includes(USER_ROLES.PROVIDER)) {
      return this.stepRepository.find(filter);
    }

    return this.stepRepository.find({...filter, where: {...filter?.where, userId: this.user.id}});
  }

  @patch('/steps', {
    responses: {
      '200': {
        description: 'Step PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Step, {partial: true}),
        },
      },
    })
    step: Step,
    @param.where(Step) where?: Where<Step>,
  ): Promise<Count> {
    return this.stepRepository.updateAll(step, where);
  }

  @get('/steps/{id}', {
    responses: {
      '200': {
        description: 'Step model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Step, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Step, {exclude: 'where'}) filter?: FilterExcludingWhere<Step>
  ): Promise<Step> {
    return this.stepRepository.findById(id, filter);
  }

  @patch('/steps/{id}', {
    operationId: 'updateStep',
    responses: {
      '204': {
        description: 'Step PATCH success',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Step, {includeRelations: true}),
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
          schema: getModelSchemaRef(Step, {partial: true}),
        },
      },
    })
    step: Step,
  ): Promise<void> {
    await this.stepRepository.updateById(id, step);
  }

  @put('/steps/{id}', {
    responses: {
      '204': {
        description: 'Step PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() step: Step,
  ): Promise<void> {
    await this.stepRepository.replaceById(id, step);
  }

  @del('/steps/{id}', {
    operationId: 'deleteStep',
    responses: {
      '204': {
        description: 'Step DELETE success',
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
    await this.stepRepository.deleteById(id);
  }
}
