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

import {DrugEntry} from '../models';
import {DrugEntryRepository, UserRoleRepository} from '../repositories';

import { USER_ROLES } from '../constants';

export class DrugEntryController {
  constructor(
    @repository(DrugEntryRepository)
    public drugEntryRepository : DrugEntryRepository,
    @repository(UserRoleRepository)
    public userRoleRepository : UserRoleRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true })
    private user: UserProfile,
  ) {}

  @post('/drug-entries', {
    operationId: 'createDrugEntry',
    responses: {
      '200': {
        description: 'DrugEntry model instance',
        content: {'application/json': {schema: getModelSchemaRef(DrugEntry)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DrugEntry, {
            title: 'NewDrugEntry',
            exclude: ['id'],
          }),
        },
      },
    })
    drugEntry: Omit<DrugEntry, 'id'>,
  ): Promise<DrugEntry> {
    return this.drugEntryRepository.create({ ...drugEntry, userId: drugEntry.userId || this.user.id });
  }

  @get('/drug-entries/count', {
    operationId: 'drugEntriesCount',
    responses: {
      '200': {
        description: 'DrugEntry model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(DrugEntry) where?: Where<DrugEntry>,
  ): Promise<Count> {
    return this.drugEntryRepository.count(where);
  }

  @get('/drug-entries', {
    operationId: 'drugEntries',
    responses: {
      '200': {
        description: 'Array of DrugEntry model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(DrugEntry, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(DrugEntry, { name: 'DrugEntriesFilter' }) filter?: Filter<DrugEntry>,
  ): Promise<DrugEntry[]> {
    const userRoles = await this.userRoleRepository.find({ where: { userId: this.user.id }});
    const userRoleIds = userRoles.map(userRole => userRole.roleId);

    if (userRoleIds.includes(USER_ROLES.ADMINISTRATOR) || userRoleIds.includes(USER_ROLES.PROVIDER)) {
      return this.drugEntryRepository.find(filter);
    }

    return this.drugEntryRepository.find({...filter, where: {...filter?.where, userId: this.user.id}});
  }

  @patch('/drug-entries', {
    responses: {
      '200': {
        description: 'DrugEntry PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DrugEntry, {partial: true}),
        },
      },
    })
    drugEntry: DrugEntry,
    @param.where(DrugEntry) where?: Where<DrugEntry>,
  ): Promise<Count> {
    return this.drugEntryRepository.updateAll(drugEntry, where);
  }

  @get('/drug-entries/{id}', {
    responses: {
      '200': {
        description: 'DrugEntry model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(DrugEntry, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(DrugEntry, {exclude: 'where'}) filter?: FilterExcludingWhere<DrugEntry>
  ): Promise<DrugEntry> {
    return this.drugEntryRepository.findById(id, filter);
  }

  @patch('/drug-entries/{id}', {
    operationId: 'updateDrugEntry',
    responses: {
      '204': {
        description: 'DrugEntry PATCH success',
        content: {
          'application/json': {
            schema: getModelSchemaRef(DrugEntry, {includeRelations: true}),
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
          schema: getModelSchemaRef(DrugEntry, {partial: true}),
        },
      },
    })
    drugEntry: DrugEntry,
  ): Promise<void> {
    await this.drugEntryRepository.updateById(id, drugEntry);
  }

  @put('/drug-entries/{id}', {
    responses: {
      '204': {
        description: 'DrugEntry PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() drugEntry: DrugEntry,
  ): Promise<void> {
    await this.drugEntryRepository.replaceById(id, drugEntry);
  }

  @del('/drug-entries/{id}', {
    operationId: 'deleteDrugEntry',
    responses: {
      '204': {
        description: 'DrugEntry DELETE success',
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
    await this.drugEntryRepository.deleteById(id);
  }
}
