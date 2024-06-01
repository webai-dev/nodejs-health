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

import {Drug} from '../models';
import {DrugRepository, UserRoleRepository} from '../repositories';

export class DrugController {
  constructor(
    @repository(DrugRepository)
    public drugRepository : DrugRepository,
    @repository(UserRoleRepository)
    public userRoleRepository : UserRoleRepository,
  ) {}

  @post('/drugs', {
    operationId: 'createDrug',
    responses: {
      '200': {
        description: 'Drug model instance',
        content: {'application/json': {schema: getModelSchemaRef(Drug)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Drug, {
            title: 'NewDrug',
            exclude: ['id'],
          }),
        },
      },
    })
    drug: Omit<Drug, 'id'>,
  ): Promise<Drug> {
    return this.drugRepository.create(drug);
  }

  @get('/drugs/count', {
    operationId: 'drugsCount',
    responses: {
      '200': {
        description: 'Drug model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Drug) where?: Where<Drug>,
  ): Promise<Count> {
    return this.drugRepository.count(where);
  }

  @get('/drugs', {
    operationId: 'drugs',
    responses: {
      '200': {
        description: 'Array of Drug model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Drug, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(Drug, { name: 'DrugsFilter' }) filter?: Filter<Drug>,
  ): Promise<Drug[]> {
    return this.drugRepository.find(filter);
  }

  @patch('/drugs', {
    responses: {
      '200': {
        description: 'Drug PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Drug, {partial: true}),
        },
      },
    })
    drug: Drug,
    @param.where(Drug) where?: Where<Drug>,
  ): Promise<Count> {
    return this.drugRepository.updateAll(drug, where);
  }

  @get('/drugs/{id}', {
    operationId: 'drug',
    responses: {
      '200': {
        description: 'Drug model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Drug, {includeRelations: true}),
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Drug, {exclude: 'where'}) filter?: FilterExcludingWhere<Drug>
  ): Promise<Drug> {
    return this.drugRepository.findById(id, filter);
  }

  @patch('/drugs/{id}', {
    operationId: 'updateDrug',
    responses: {
      '204': {
        description: 'Drug PATCH success',
        content: {'application/json': {schema: getModelSchemaRef(Drug, { includeRelations: true })}},
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Drug, {partial: true}),
        },
      },
    })
    drug: Drug,
  ): Promise<void> {
    await this.drugRepository.updateById(id, drug);
  }

  @put('/drugs/{id}', {
    responses: {
      '204': {
        description: 'Drug PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() drug: Drug,
  ): Promise<void> {
    await this.drugRepository.replaceById(id, drug);
  }

  @del('/drugs/{id}', {
    operationId: 'deleteDrug',
    responses: {
      '204': {
        description: 'Drug DELETE success',
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
  @authenticate('jwt')
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.drugRepository.deleteById(id);
  }
}
