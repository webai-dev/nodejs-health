import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  ActivityEntry,
  Activity,
} from '../models';
import {ActivityEntryRepository} from '../repositories';

export class ActivityEntryActivityController {
  constructor(
    @repository(ActivityEntryRepository)
    public activityEntryRepository: ActivityEntryRepository,
  ) { }

  @get('/activity-entries/{id}/activity', {
    responses: {
      '200': {
        description: 'Activity belonging to ActivityEntry',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Activity)},
          },
        },
      },
    },
  })
  async getActivity(
    @param.path.number('id') id: typeof ActivityEntry.prototype.id,
  ): Promise<Activity> {
    return this.activityEntryRepository.activity(id);
  }
}
