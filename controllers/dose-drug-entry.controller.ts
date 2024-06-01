import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Dose,
  DrugEntry,
} from '../models';
import {DoseRepository} from '../repositories';

export class DoseDrugEntryController {
  constructor(
    @repository(DoseRepository)
    public doseRepository: DoseRepository,
  ) { }

  @get('/doses/{id}/drug-entry', {
    responses: {
      '200': {
        description: 'DrugEntry belonging to Dose',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(DrugEntry)},
          },
        },
      },
    },
  })
  async getDrugEntry(
    @param.path.number('id') id: typeof Dose.prototype.id,
  ): Promise<DrugEntry> {
    return this.doseRepository.drugEntry(id);
  }
}
