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

import {ActivityEntry} from '../models';
import {ActivityEntryRepository, UserRoleRepository} from '../repositories';
import { inject } from '@loopback/core';

import { USER_ROLES } from '../constants';

export class ActivityEntryController {
  constructor(
    @repository(ActivityEntryRepository)
    public activityEntryRepository : ActivityEntryRepository,
    @repository(UserRoleRepository)
    public userRoleRepository : UserRoleRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true })
    private user: UserProfile,
  ) {}

  @post('/activity-entries', {
    operationId: 'createActivityEntry',
    responses: {
      '200': {
        description: 'ActivityEntry model instance',
        content: {'application/json': {schema: getModelSchemaRef(ActivityEntry, { includeRelations: true })}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ActivityEntry, {
            title: 'NewActivityEntry',
            exclude: ['id'],
          }),
        },
      },
    })
    activityEntry: Omit<ActivityEntry, 'id'>,
  ): Promise<ActivityEntry> {
    return this.activityEntryRepository.create({...activityEntry, userId: activityEntry.userId || this.user.id});
  }

  @get('/activity-entries/count', {
    operationId: 'activityEntriesCount',
    responses: {
      '200': {
        description: 'ActivityEntry model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(ActivityEntry) where?: Where<ActivityEntry>,
  ): Promise<Count> {
    return this.activityEntryRepository.count(where);
  }

  @get('/activity-entries', {
    operationId: 'activityEntries',
    responses: {
      '200': {
        description: 'Array of ActivityEntry model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(ActivityEntry, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(ActivityEntry, {name: 'ActivityEntriesFilter'}) filter?: Filter<ActivityEntry>,
  ): Promise<ActivityEntry[]> {
    const userRoles = await this.userRoleRepository.find({ where: { userId: this.user.id }});
    const userRoleIds = userRoles.map(userRole => userRole.roleId);

    if (userRoleIds.includes(USER_ROLES.ADMINISTRATOR) || userRoleIds.includes(USER_ROLES.PROVIDER)) {
      return this.activityEntryRepository.find(filter);
    }
    
    return this.activityEntryRepository.find({...filter, where: {...filter?.where, userId: this.user.id}});
  }

  @patch('/activity-entries', {
    responses: {
      '200': {
        description: 'ActivityEntry PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ActivityEntry, {partial: true}),
        },
      },
    })
    activityEntry: ActivityEntry,
    @param.where(ActivityEntry) where?: Where<ActivityEntry>,
  ): Promise<Count> {
    return this.activityEntryRepository.updateAll(activityEntry, where);
  }

  @get('/activity-entries/{id}', {
    responses: {
      '200': {
        description: 'ActivityEntry model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(ActivityEntry, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ActivityEntry, {exclude: 'where'}) filter?: FilterExcludingWhere<ActivityEntry>
  ): Promise<ActivityEntry> {
    return this.activityEntryRepository.findById(id, filter);
  }

  @patch('/activity-entries/{id}', {
    operationId: 'updateActivityEntry',
    responses: {
      '204': {
        description: 'ActivityEntry PATCH success',
        content: {'application/json': {schema: getModelSchemaRef(ActivityEntry, { includeRelations: true })}},
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ActivityEntry, {partial: true}),
        },
      },
    })
    activityEntry: ActivityEntry,
  ): Promise<void> {
    await this.activityEntryRepository.updateById(id, activityEntry);
  }

  @put('/activity-entries/{id}', {
    responses: {
      '204': {
        description: 'ActivityEntry PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() activityEntry: ActivityEntry,
  ): Promise<void> {
    await this.activityEntryRepository.replaceById(id, activityEntry);
  }

  @del('/activity-entries/{id}', {
    operationId: 'deleteActivityEntry',
    responses: {
      '204': {
        description: 'ActivityEntry DELETE success',
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
  async deleteById(@param.path.number('id') id: number): Promise<any> {
    await this.activityEntryRepository.deleteById(id);
    return { id };
  }
}
