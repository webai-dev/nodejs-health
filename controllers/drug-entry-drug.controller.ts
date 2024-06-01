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
  Drug,
} from '../models';
import {DrugEntryRepository} from '../repositories';

export class DrugEntryDrugController {
  constructor(
    @repository(DrugEntryRepository)
    public drugEntryRepository: DrugEntryRepository,
  ) { }

  @get('/drug-entries/{id}/drug', {
    responses: {
      '200': {
        description: 'Drug belonging to DrugEntry',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Drug)},
          },
        },
      },
    },
  })
  async getDrug(
    @param.path.number('id') id: typeof DrugEntry.prototype.id,
  ): Promise<Drug> {
    return this.drugEntryRepository.drug(id);
  }
}
