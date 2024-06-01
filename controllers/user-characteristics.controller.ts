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

import {UserCharacteristics} from '../models';
import {UserCharacteristicsRepository} from '../repositories';

export class UserCharacteristicsController {
  constructor(
    @repository(UserCharacteristicsRepository)
    public userCharacteristicsRepository : UserCharacteristicsRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true })
    private user: UserProfile,
  ) {}

  @post('/user-characteristics', {
    responses: {
      '200': {
        description: 'UserCharacteristics model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserCharacteristics)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCharacteristics, {
            title: 'NewUserCharacteristics',
            exclude: ['id'],
          }),
        },
      },
    })
    userCharacteristics: Omit<UserCharacteristics, 'id'>,
  ): Promise<UserCharacteristics> {
    return this.userCharacteristicsRepository.create({...userCharacteristics, userId: this.user.id});
  }

  @get('/user-characteristics/count', {
    responses: {
      '200': {
        description: 'UserCharacteristics model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(UserCharacteristics) where?: Where<UserCharacteristics>,
  ): Promise<Count> {
    return this.userCharacteristicsRepository.count(where);
  }

  @get('/user-characteristics', {
    responses: {
      '200': {
        description: 'Array of UserCharacteristics model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(UserCharacteristics, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(UserCharacteristics) filter?: Filter<UserCharacteristics>,
  ): Promise<UserCharacteristics[]> {
    return this.userCharacteristicsRepository.find(filter);
  }

  @patch('/user-characteristics', {
    responses: {
      '200': {
        description: 'UserCharacteristics PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCharacteristics, {partial: true}),
        },
      },
    })
    userCharacteristics: UserCharacteristics,
    @param.where(UserCharacteristics) where?: Where<UserCharacteristics>,
  ): Promise<Count> {
    return this.userCharacteristicsRepository.updateAll(userCharacteristics, where);
  }

  @get('/user-characteristics/{id}', {
    responses: {
      '200': {
        description: 'UserCharacteristics model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserCharacteristics, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(UserCharacteristics, {exclude: 'where'}) filter?: FilterExcludingWhere<UserCharacteristics>
  ): Promise<UserCharacteristics> {
    return this.userCharacteristicsRepository.findById(id, filter);
  }

  @patch('/user-characteristics/{id}', {
    responses: {
      '204': {
        description: 'UserCharacteristics PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCharacteristics, {partial: true}),
        },
      },
    })
    userCharacteristics: UserCharacteristics,
  ): Promise<void> {
    await this.userCharacteristicsRepository.updateById(id, userCharacteristics);
  }

  @put('/user-characteristics/{id}', {
    responses: {
      '204': {
        description: 'UserCharacteristics PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() userCharacteristics: UserCharacteristics,
  ): Promise<void> {
    await this.userCharacteristicsRepository.replaceById(id, userCharacteristics);
  }

  @del('/user-characteristics/{id}', {
    responses: {
      '204': {
        description: 'UserCharacteristics DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userCharacteristicsRepository.deleteById(id);
  }
}
