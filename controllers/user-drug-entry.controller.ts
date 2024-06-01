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
  DrugEntry,
} from '../models';
import {UserRepository} from '../repositories';

export class UserDrugEntryController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/drug-entries', {
    responses: {
      '200': {
        description: 'Array of User has many DrugEntry',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(DrugEntry)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<DrugEntry>,
  ): Promise<DrugEntry[]> {
    return this.userRepository.drugEntries(id).find(filter);
  }

  @post('/users/{id}/drug-entries', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(DrugEntry)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DrugEntry, {
            title: 'NewDrugEntryInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) drugEntry: Omit<DrugEntry, 'id'>,
  ): Promise<DrugEntry> {
    return this.userRepository.drugEntries(id).create(drugEntry);
  }

  @patch('/users/{id}/drug-entries', {
    responses: {
      '200': {
        description: 'User.DrugEntry PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DrugEntry, {partial: true}),
        },
      },
    })
    drugEntry: Partial<DrugEntry>,
    @param.query.object('where', getWhereSchemaFor(DrugEntry)) where?: Where<DrugEntry>,
  ): Promise<Count> {
    return this.userRepository.drugEntries(id).patch(drugEntry, where);
  }

  @del('/users/{id}/drug-entries', {
    responses: {
      '200': {
        description: 'User.DrugEntry DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(DrugEntry)) where?: Where<DrugEntry>,
  ): Promise<Count> {
    return this.userRepository.drugEntries(id).delete(where);
  }
}
