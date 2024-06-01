import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  User,
  ActivityEntry,
} from '../models';
import {UserRepository} from '../repositories';

export class UserActivityEntryController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/activity-entries', {
    responses: {
      '200': {
        description: 'Array of User has many ActivityEntry',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ActivityEntry)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<ActivityEntry>,
  ): Promise<ActivityEntry[]> {
    return this.userRepository.activityEntries(id).find(filter);
  }

  @post('/users/{id}/activity-entries', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(ActivityEntry)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ActivityEntry, {
            title: 'NewActivityEntryInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) activityEntry: Omit<ActivityEntry, 'id'>,
  ): Promise<ActivityEntry> {
    return this.userRepository.activityEntries(id).create(activityEntry);
  }

  @patch('/users/{id}/activity-entries', {
    responses: {
      '200': {
        description: 'User.ActivityEntry PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ActivityEntry, {partial: true}),
        },
      },
    })
    activityEntry: Partial<ActivityEntry>,
    @param.query.object('where', getWhereSchemaFor(ActivityEntry)) where?: Where<ActivityEntry>,
  ): Promise<Count> {
    return this.userRepository.activityEntries(id).patch(activityEntry, where);
  }

  @del('/users/{id}/activity-entries', {
    responses: {
      '200': {
        description: 'User.ActivityEntry DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(ActivityEntry)) where?: Where<ActivityEntry>,
  ): Promise<Count> {
    return this.userRepository.activityEntries(id).delete(where);
  }
}
