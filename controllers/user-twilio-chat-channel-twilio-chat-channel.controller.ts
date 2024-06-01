import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  UserTwilioChatChannel,
  TwilioChatChannel,
} from '../models';
import {UserTwilioChatChannelRepository} from '../repositories';

export class UserTwilioChatChannelTwilioChatChannelController {
  constructor(
    @repository(UserTwilioChatChannelRepository)
    public userTwilioChatChannelRepository: UserTwilioChatChannelRepository,
  ) { }

  @get('/user-twilio-chat-channels/{id}/twilio-chat-channel', {
    responses: {
      '200': {
        description: 'TwilioChatChannel belonging to UserTwilioChatChannel',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TwilioChatChannel)},
          },
        },
      },
    },
  })
  async getTwilioChatChannel(
    @param.path.number('id') id: typeof UserTwilioChatChannel.prototype.id,
  ): Promise<TwilioChatChannel> {
    return this.userTwilioChatChannelRepository.twilioChatChannel(id);
  }
}
