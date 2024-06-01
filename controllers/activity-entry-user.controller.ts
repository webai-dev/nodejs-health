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
  User,
} from '../models';
import {ActivityEntryRepository} from '../repositories';

export class ActivityEntryUserController {
  constructor(
    @repository(ActivityEntryRepository)
    public activityEntryRepository: ActivityEntryRepository,
  ) { }

  @get('/activity-entries/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to ActivityEntry',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof ActivityEntry.prototype.id,
  ): Promise<User> {
    return this.activityEntryRepository.user(id);
  }
}
