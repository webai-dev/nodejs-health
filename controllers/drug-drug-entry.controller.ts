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
  Drug,
  DrugEntry,
} from '../models';
import {DrugRepository} from '../repositories';

export class DrugDrugEntryController {
  constructor(
    @repository(DrugRepository) protected drugRepository: DrugRepository,
  ) { }

  @get('/drugs/{id}/drug-entries', {
    responses: {
      '200': {
        description: 'Array of Drug has many DrugEntry',
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
    return this.drugRepository.drugEntries(id).find(filter);
  }

  @post('/drugs/{id}/drug-entries', {
    responses: {
      '200': {
        description: 'Drug model instance',
        content: {'application/json': {schema: getModelSchemaRef(DrugEntry)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Drug.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DrugEntry, {
            title: 'NewDrugEntryInDrug',
            exclude: ['id'],
            optional: ['drugId']
          }),
        },
      },
    }) drugEntry: Omit<DrugEntry, 'id'>,
  ): Promise<DrugEntry> {
    return this.drugRepository.drugEntries(id).create(drugEntry);
  }

  @patch('/drugs/{id}/drug-entries', {
    responses: {
      '200': {
        description: 'Drug.DrugEntry PATCH success count',
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
    return this.drugRepository.drugEntries(id).patch(drugEntry, where);
  }

  @del('/drugs/{id}/drug-entries', {
    responses: {
      '200': {
        description: 'Drug.DrugEntry DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(DrugEntry)) where?: Where<DrugEntry>,
  ): Promise<Count> {
    return this.drugRepository.drugEntries(id).delete(where);
  }
}
