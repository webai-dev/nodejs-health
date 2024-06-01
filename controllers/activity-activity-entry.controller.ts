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
  Activity,
  ActivityEntry,
} from '../models';
import {ActivityRepository} from '../repositories';

export class ActivityActivityEntryController {
  constructor(
    @repository(ActivityRepository) protected activityRepository: ActivityRepository,
  ) { }

  @get('/activities/{id}/activity-entries', {
    responses: {
      '200': {
        description: 'Array of Activity has many ActivityEntry',
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
    return this.activityRepository.activityEntries(id).find(filter);
  }

  @post('/activities/{id}/activity-entries', {
    responses: {
      '200': {
        description: 'Activity model instance',
        content: {'application/json': {schema: getModelSchemaRef(ActivityEntry)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Activity.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ActivityEntry, {
            title: 'NewActivityEntryInActivity',
            exclude: ['id'],
            optional: ['activityId']
          }),
        },
      },
    }) activityEntry: Omit<ActivityEntry, 'id'>,
  ): Promise<ActivityEntry> {
    return this.activityRepository.activityEntries(id).create(activityEntry);
  }

  @patch('/activities/{id}/activity-entries', {
    responses: {
      '200': {
        description: 'Activity.ActivityEntry PATCH success count',
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
    return this.activityRepository.activityEntries(id).patch(activityEntry, where);
  }

  @del('/activities/{id}/activity-entries', {
    responses: {
      '200': {
        description: 'Activity.ActivityEntry DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(ActivityEntry)) where?: Where<ActivityEntry>,
  ): Promise<Count> {
    return this.activityRepository.activityEntries(id).delete(where);
  }
}
