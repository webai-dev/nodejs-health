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
  User,
} from '../models';
import {UserTwilioChatChannelRepository} from '../repositories';

export class UserTwilioChatChannelUserController {
  constructor(
    @repository(UserTwilioChatChannelRepository)
    public userTwilioChatChannelRepository: UserTwilioChatChannelRepository,
  ) { }

  @get('/user-twilio-chat-channels/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to UserTwilioChatChannel',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof UserTwilioChatChannel.prototype.id,
  ): Promise<User> {
    return this.userTwilioChatChannelRepository.user(id);
  }
}
