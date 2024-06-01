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
import {SharingToken} from '../models';
import {SharingTokenRepository} from '../repositories';

export class SharingTokenController {
  constructor(
    @repository(SharingTokenRepository)
    public sharingTokenRepository : SharingTokenRepository,
  ) {}

  @post('/sharing-tokens', {
    responses: {
      '200': {
        description: 'SharingToken model instance',
        content: {'application/json': {schema: getModelSchemaRef(SharingToken)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SharingToken, {
            title: 'NewSharingToken',
            exclude: ['id'],
          }),
        },
      },
    })
    sharingToken: Omit<SharingToken, 'id'>,
  ): Promise<SharingToken> {
    return this.sharingTokenRepository.create(sharingToken);
  }

  @get('/sharing-tokens/count', {
    responses: {
      '200': {
        description: 'SharingToken model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(SharingToken) where?: Where<SharingToken>,
  ): Promise<Count> {
    return this.sharingTokenRepository.count(where);
  }

  @get('/sharing-tokens', {
    responses: {
      '200': {
        description: 'Array of SharingToken model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(SharingToken, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(SharingToken) filter?: Filter<SharingToken>,
  ): Promise<SharingToken[]> {
    return this.sharingTokenRepository.find(filter);
  }

  @patch('/sharing-tokens', {
    responses: {
      '200': {
        description: 'SharingToken PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SharingToken, {partial: true}),
        },
      },
    })
    sharingToken: SharingToken,
    @param.where(SharingToken) where?: Where<SharingToken>,
  ): Promise<Count> {
    return this.sharingTokenRepository.updateAll(sharingToken, where);
  }

  @get('/sharing-tokens/{id}', {
    responses: {
      '200': {
        description: 'SharingToken model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(SharingToken, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(SharingToken, {exclude: 'where'}) filter?: FilterExcludingWhere<SharingToken>
  ): Promise<SharingToken> {
    return this.sharingTokenRepository.findById(id, filter);
  }

  @patch('/sharing-tokens/{id}', {
    responses: {
      '204': {
        description: 'SharingToken PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SharingToken, {partial: true}),
        },
      },
    })
    sharingToken: SharingToken,
  ): Promise<void> {
    await this.sharingTokenRepository.updateById(id, sharingToken);
  }

  @put('/sharing-tokens/{id}', {
    responses: {
      '204': {
        description: 'SharingToken PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() sharingToken: SharingToken,
  ): Promise<void> {
    await this.sharingTokenRepository.replaceById(id, sharingToken);
  }

  @del('/sharing-tokens/{id}', {
    responses: {
      '204': {
        description: 'SharingToken DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.sharingTokenRepository.deleteById(id);
  }
}
