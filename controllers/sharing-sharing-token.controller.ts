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
  Sharing,
  SharingToken,
} from '../models';
import {SharingRepository} from '../repositories';

export class SharingSharingTokenController {
  constructor(
    @repository(SharingRepository) protected sharingRepository: SharingRepository,
  ) { }

  @get('/sharings/{id}/sharing-token', {
    responses: {
      '200': {
        description: 'Sharing has one SharingToken',
        content: {
          'application/json': {
            schema: getModelSchemaRef(SharingToken),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<SharingToken>,
  ): Promise<SharingToken> {
    return this.sharingRepository.sharingToken(id).get(filter);
  }

  @post('/sharings/{id}/sharing-token', {
    responses: {
      '200': {
        description: 'Sharing model instance',
        content: {'application/json': {schema: getModelSchemaRef(SharingToken)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Sharing.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SharingToken, {
            title: 'NewSharingTokenInSharing',
            exclude: ['id'],
            optional: ['sharingId']
          }),
        },
      },
    }) sharingToken: Omit<SharingToken, 'id'>,
  ): Promise<SharingToken> {
    return this.sharingRepository.sharingToken(id).create(sharingToken);
  }

  @patch('/sharings/{id}/sharing-token', {
    responses: {
      '200': {
        description: 'Sharing.SharingToken PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SharingToken, {partial: true}),
        },
      },
    })
    sharingToken: Partial<SharingToken>,
    @param.query.object('where', getWhereSchemaFor(SharingToken)) where?: Where<SharingToken>,
  ): Promise<Count> {
    return this.sharingRepository.sharingToken(id).patch(sharingToken, where);
  }

  @del('/sharings/{id}/sharing-token', {
    responses: {
      '200': {
        description: 'Sharing.SharingToken DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(SharingToken)) where?: Where<SharingToken>,
  ): Promise<Count> {
    return this.sharingRepository.sharingToken(id).delete(where);
  }
}
