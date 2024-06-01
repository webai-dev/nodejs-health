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
  TwilioChatChannel,
  Sharing,
} from '../models';
import {TwilioChatChannelRepository} from '../repositories';

export class TwilioChatChannelSharingController {
  constructor(
    @repository(TwilioChatChannelRepository) protected twilioChatChannelRepository: TwilioChatChannelRepository,
  ) { }

  @get('/twilio-chat-channels/{id}/sharing', {
    responses: {
      '200': {
        description: 'TwilioChatChannel has one Sharing',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Sharing),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Sharing>,
  ): Promise<Sharing> {
    return this.twilioChatChannelRepository.sharing(id).get(filter);
  }

  @post('/twilio-chat-channels/{id}/sharing', {
    responses: {
      '200': {
        description: 'TwilioChatChannel model instance',
        content: {'application/json': {schema: getModelSchemaRef(Sharing)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof TwilioChatChannel.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Sharing, {
            title: 'NewSharingInTwilioChatChannel',
            exclude: ['id'],
            optional: ['twilioChatChannelId']
          }),
        },
      },
    }) sharing: Omit<Sharing, 'id'>,
  ): Promise<Sharing> {
    return this.twilioChatChannelRepository.sharing(id).create(sharing);
  }

  @patch('/twilio-chat-channels/{id}/sharing', {
    responses: {
      '200': {
        description: 'TwilioChatChannel.Sharing PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Sharing, {partial: true}),
        },
      },
    })
    sharing: Partial<Sharing>,
    @param.query.object('where', getWhereSchemaFor(Sharing)) where?: Where<Sharing>,
  ): Promise<Count> {
    return this.twilioChatChannelRepository.sharing(id).patch(sharing, where);
  }

  @del('/twilio-chat-channels/{id}/sharing', {
    responses: {
      '200': {
        description: 'TwilioChatChannel.Sharing DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Sharing)) where?: Where<Sharing>,
  ): Promise<Count> {
    return this.twilioChatChannelRepository.sharing(id).delete(where);
  }
}
