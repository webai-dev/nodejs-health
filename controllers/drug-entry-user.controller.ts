import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  DrugEntry,
  User,
} from '../models';
import {DrugEntryRepository} from '../repositories';

export class DrugEntryUserController {
  constructor(
    @repository(DrugEntryRepository)
    public drugEntryRepository: DrugEntryRepository,
  ) { }

  @get('/drug-entries/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to DrugEntry',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof DrugEntry.prototype.id,
  ): Promise<User> {
    return this.drugEntryRepository.user(id);
  }
}
