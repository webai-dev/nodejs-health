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

import {Exercise} from '../models';
import {ExerciseRepository, UserRoleRepository} from '../repositories';

import { USER_ROLES } from '../constants';

export class ExerciseController {
  constructor(
    @repository(ExerciseRepository)
    public exerciseRepository : ExerciseRepository,
    @repository(UserRoleRepository)
    public userRoleRepository : UserRoleRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true })
    private user: UserProfile,
  ) {}

  @post('/exercises', {
    operationId: 'createExercise',
    responses: {
      '200': {
        description: 'Exercise model instance',
        content: {'application/json': {schema: getModelSchemaRef(Exercise)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Exercise, {
            title: 'NewExercise',
            exclude: ['id'],
          }),
        },
      },
    })
    exercise: Omit<Exercise, 'id'>,
  ): Promise<Exercise> {
    return this.exerciseRepository.create({...exercise, userId: exercise.userId || this.user.id});
  }

  @get('/exercises/count', {
    operationId: 'exercisesCount',
    responses: {
      '200': {
        description: 'Exercise model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Exercise) where?: Where<Exercise>,
  ): Promise<Count> {
    return this.exerciseRepository.count(where);
  }

  @get('/exercises', {
    operationId: 'exercises',
    responses: {
      '200': {
        description: 'Array of Exercise model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Exercise, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(Exercise, {name: 'ExercisesFilter'}) filter?: Filter<Exercise>,
  ): Promise<Exercise[]> {
    const userRoles = await this.userRoleRepository.find({ where: { userId: this.user.id }});
    const userRoleIds = userRoles.map(userRole => userRole.roleId);

    if (userRoleIds.includes(USER_ROLES.ADMINISTRATOR) || userRoleIds.includes(USER_ROLES.PROVIDER)) {
      return this.exerciseRepository.find(filter);
    }

    return this.exerciseRepository.find({...filter, where: {...filter?.where, userId: this.user.id}});
  }

  @patch('/exercises', {
    responses: {
      '200': {
        description: 'Exercise PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Exercise, {partial: true}),
        },
      },
    })
    exercise: Exercise,
    @param.where(Exercise) where?: Where<Exercise>,
  ): Promise<Count> {
    return this.exerciseRepository.updateAll(exercise, where);
  }

  @get('/exercises/{id}', {
    responses: {
      '200': {
        description: 'Exercise model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Exercise, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Exercise, {exclude: 'where'}) filter?: FilterExcludingWhere<Exercise>
  ): Promise<Exercise> {
    return this.exerciseRepository.findById(id, filter);
  }

  @patch('/exercises/{id}', {
    operationId: 'updateExercise',
    responses: {
      '204': {
        description: 'Exercise PATCH success',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Exercise, {includeRelations: true}),
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
          schema: getModelSchemaRef(Exercise, {partial: true}),
        },
      },
    })
    exercise: Exercise,
  ): Promise<void> {
    await this.exerciseRepository.updateById(id, exercise);
  }

  @put('/exercises/{id}', {
    responses: {
      '204': {
        description: 'Exercise PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() exercise: Exercise,
  ): Promise<void> {
    await this.exerciseRepository.replaceById(id, exercise);
  }

  @del('/exercises/{id}', {
    operationId: 'deleteExercise',
    responses: {
      '204': {
        description: 'Exercise DELETE success',
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
    await this.exerciseRepository.deleteById(id);
  }
}
