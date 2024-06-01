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
  UserTwilioChatChannel,
} from '../models';
import {TwilioChatChannelRepository} from '../repositories';

export class TwilioChatChannelUserTwilioChatChannelController {
  constructor(
    @repository(TwilioChatChannelRepository) protected twilioChatChannelRepository: TwilioChatChannelRepository,
  ) { }

  @get('/twilio-chat-channels/{id}/user-twilio-chat-channels', {
    responses: {
      '200': {
        description: 'Array of TwilioChatChannel has many UserTwilioChatChannel',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(UserTwilioChatChannel)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<UserTwilioChatChannel>,
  ): Promise<UserTwilioChatChannel[]> {
    return this.twilioChatChannelRepository.userTwilioChatChannels(id).find(filter);
  }

  @post('/twilio-chat-channels/{id}/user-twilio-chat-channels', {
    responses: {
      '200': {
        description: 'TwilioChatChannel model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserTwilioChatChannel)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof TwilioChatChannel.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTwilioChatChannel, {
            title: 'NewUserTwilioChatChannelInTwilioChatChannel',
            exclude: ['id'],
            optional: ['twilioChatChannelId']
          }),
        },
      },
    }) userTwilioChatChannel: Omit<UserTwilioChatChannel, 'id'>,
  ): Promise<UserTwilioChatChannel> {
    return this.twilioChatChannelRepository.userTwilioChatChannels(id).create(userTwilioChatChannel);
  }

  @patch('/twilio-chat-channels/{id}/user-twilio-chat-channels', {
    responses: {
      '200': {
        description: 'TwilioChatChannel.UserTwilioChatChannel PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTwilioChatChannel, {partial: true}),
        },
      },
    })
    userTwilioChatChannel: Partial<UserTwilioChatChannel>,
    @param.query.object('where', getWhereSchemaFor(UserTwilioChatChannel)) where?: Where<UserTwilioChatChannel>,
  ): Promise<Count> {
    return this.twilioChatChannelRepository.userTwilioChatChannels(id).patch(userTwilioChatChannel, where);
  }

  @del('/twilio-chat-channels/{id}/user-twilio-chat-channels', {
    responses: {
      '200': {
        description: 'TwilioChatChannel.UserTwilioChatChannel DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(UserTwilioChatChannel)) where?: Where<UserTwilioChatChannel>,
  ): Promise<Count> {
    return this.twilioChatChannelRepository.userTwilioChatChannels(id).delete(where);
  }
}
