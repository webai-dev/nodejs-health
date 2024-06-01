import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Dose} from '../models';
import {DoseRepository, UserRoleRepository} from '../repositories';

export class DoseController {
  constructor(
    @repository(DoseRepository)
    public doseRepository : DoseRepository,
    @repository(UserRoleRepository)
    public userRoleRepository : UserRoleRepository,
  ) {}

  @post('/doses', {
    operationId: 'createDose',
    responses: {
      '200': {
        description: 'Dose model instance',
        content: {'application/json': {schema: getModelSchemaRef(Dose, { includeRelations: true })}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Dose, {
            title: 'NewDose',
            exclude: ['id'],
          }),
        },
      },
    })
    dose: Omit<Dose, 'id'>,
  ): Promise<Dose> {
    return this.doseRepository.create(dose);
  }

  @get('/doses/count', {
    operationId: 'dosesCount',
    responses: {
      '200': {
        description: 'Dose model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Dose) where?: Where<Dose>,
  ): Promise<Count> {
    return this.doseRepository.count(where);
  }

  @get('/doses', {
    operationId: 'doses',
    responses: {
      '200': {
        description: 'Array of Dose model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Dose, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Dose, {name: 'DosesFilter'}) filter?: Filter<Dose>,
  ): Promise<Dose[]> {
    return this.doseRepository.find(filter);
  }

  @patch('/doses', {
    responses: {
      '200': {
        description: 'Dose PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Dose, {partial: true}),
        },
      },
    })
    dose: Dose,
    @param.where(Dose) where?: Where<Dose>,
  ): Promise<Count> {
    return this.doseRepository.updateAll(dose, where);
  }

  @get('/doses/{id}', {
    responses: {
      '200': {
        description: 'Dose model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Dose, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Dose, {exclude: 'where'}) filter?: FilterExcludingWhere<Dose>
  ): Promise<Dose> {
    return this.doseRepository.findById(id, filter);
  }

  @patch('/doses/{id}', {
    operationId: 'updateDose',
    responses: {
      '204': {
        description: 'Diabetes PATCH success',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Dose, {includeRelations: true}),
          },
        },
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Dose, {partial: true}),
        },
      },
    })
    dose: Dose,
  ): Promise<void> {
    await this.doseRepository.updateById(id, dose);
  }

  @put('/doses/{id}', {
    responses: {
      '204': {
        description: 'Dose PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() dose: Dose,
  ): Promise<void> {
    await this.doseRepository.replaceById(id, dose);
  }

  @del('/doses/{id}', {
    operationId: 'deleteDose',
    responses: {
      '204': {
        description: 'Dose DELETE success',
        content: {'application/json': {
          schema: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
              }
            }
          }
        }},
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.doseRepository.deleteById(id);
  }
}
