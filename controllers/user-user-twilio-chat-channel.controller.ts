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
  User,
  UserTwilioChatChannel,
} from '../models';
import {UserRepository} from '../repositories';

export class UserUserTwilioChatChannelController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/user-twilio-chat-channels', {
    responses: {
      '200': {
        description: 'Array of User has many UserTwilioChatChannel',
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
    return this.userRepository.userTwilioChatChannels(id).find(filter);
  }

  @post('/users/{id}/user-twilio-chat-channels', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserTwilioChatChannel)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTwilioChatChannel, {
            title: 'NewUserTwilioChatChannelInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) userTwilioChatChannel: Omit<UserTwilioChatChannel, 'id'>,
  ): Promise<UserTwilioChatChannel> {
    return this.userRepository.userTwilioChatChannels(id).create(userTwilioChatChannel);
  }

  @patch('/users/{id}/user-twilio-chat-channels', {
    responses: {
      '200': {
        description: 'User.UserTwilioChatChannel PATCH success count',
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
    return this.userRepository.userTwilioChatChannels(id).patch(userTwilioChatChannel, where);
  }

  @del('/users/{id}/user-twilio-chat-channels', {
    responses: {
      '200': {
        description: 'User.UserTwilioChatChannel DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(UserTwilioChatChannel)) where?: Where<UserTwilioChatChannel>,
  ): Promise<Count> {
    return this.userRepository.userTwilioChatChannels(id).delete(where);
  }
}
