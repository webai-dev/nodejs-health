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
  DrugEntry,
  Dose,
} from '../models';
import {DrugEntryRepository} from '../repositories';

export class DrugEntryDoseController {
  constructor(
    @repository(DrugEntryRepository) protected drugEntryRepository: DrugEntryRepository,
  ) { }

  @get('/drug-entries/{id}/doses', {
    responses: {
      '200': {
        description: 'Array of DrugEntry has many Dose',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Dose)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Dose>,
  ): Promise<Dose[]> {
    return this.drugEntryRepository.doses(id).find(filter);
  }

  @post('/drug-entries/{id}/doses', {
    responses: {
      '200': {
        description: 'DrugEntry model instance',
        content: {'application/json': {schema: getModelSchemaRef(Dose)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof DrugEntry.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Dose, {
            title: 'NewDoseInDrugEntry',
            exclude: ['id'],
            optional: ['drugEntryId']
          }),
        },
      },
    }) dose: Omit<Dose, 'id'>,
  ): Promise<Dose> {
    return this.drugEntryRepository.doses(id).create(dose);
  }

  @patch('/drug-entries/{id}/doses', {
    responses: {
      '200': {
        description: 'DrugEntry.Dose PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Dose, {partial: true}),
        },
      },
    })
    dose: Partial<Dose>,
    @param.query.object('where', getWhereSchemaFor(Dose)) where?: Where<Dose>,
  ): Promise<Count> {
    return this.drugEntryRepository.doses(id).patch(dose, where);
  }

  @del('/drug-entries/{id}/doses', {
    responses: {
      '200': {
        description: 'DrugEntry.Dose DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Dose)) where?: Where<Dose>,
  ): Promise<Count> {
    return this.drugEntryRepository.doses(id).delete(where);
  }
}
