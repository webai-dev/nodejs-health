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

import {
  AuthenticationBindings,
  authenticate
} from '@loopback/authentication';
import {UserProfile} from '@loopback/security';
import { inject } from '@loopback/core';

import {TwilioChatChannel} from '../models';
import {TwilioChatChannelRepository} from '../repositories';

export class TwilioChatChannelController {
  constructor(
    @repository(TwilioChatChannelRepository)
    public twilioChatChannelRepository : TwilioChatChannelRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true })
    private user: UserProfile,
  ) {}

  @post('/twilio-chat-channels', {
    responses: {
      '200': {
        description: 'TwilioChatChannel model instance',
        content: {'application/json': {schema: getModelSchemaRef(TwilioChatChannel)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TwilioChatChannel, {
            title: 'NewTwilioChatChannel',
            exclude: ['id'],
          }),
        },
      },
    })
    twilioChatChannel: Omit<TwilioChatChannel, 'id'>,
  ): Promise<TwilioChatChannel> {
    return this.twilioChatChannelRepository.create(twilioChatChannel);
  }

  @get('/twilio-chat-channels/count', {
    responses: {
      '200': {
        description: 'TwilioChatChannel model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(TwilioChatChannel) where?: Where<TwilioChatChannel>,
  ): Promise<Count> {
    return this.twilioChatChannelRepository.count(where);
  }

  @get('/twilio-chat-channels', {
    operationId: 'twilioChatChannels',
    responses: {
      '200': {
        description: 'Array of TwilioChatChannel model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TwilioChatChannel, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(TwilioChatChannel) filter?: Filter<TwilioChatChannel>,
  ): Promise<TwilioChatChannel[]> {
    return this.twilioChatChannelRepository.find(filter);
  }

  @patch('/twilio-chat-channels', {
    responses: {
      '200': {
        description: 'TwilioChatChannel PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TwilioChatChannel, {partial: true}),
        },
      },
    })
    twilioChatChannel: TwilioChatChannel,
    @param.where(TwilioChatChannel) where?: Where<TwilioChatChannel>,
  ): Promise<Count> {
    return this.twilioChatChannelRepository.updateAll(twilioChatChannel, where);
  }

  @get('/twilio-chat-channels/{id}', {
    operationId: 'twilioChatChannel',
    responses: {
      '200': {
        description: 'TwilioChatChannel model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TwilioChatChannel, {includeRelations: true}),
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TwilioChatChannel, {exclude: 'where', name: 'TwilioChatChannelFilter'}) filter?: FilterExcludingWhere<TwilioChatChannel>
  ): Promise<TwilioChatChannel> {
    return this.twilioChatChannelRepository.findById(id, filter);
  }

  @patch('/twilio-chat-channels/{id}', {
    responses: {
      '204': {
        description: 'TwilioChatChannel PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TwilioChatChannel, {partial: true}),
        },
      },
    })
    twilioChatChannel: TwilioChatChannel,
  ): Promise<void> {
    await this.twilioChatChannelRepository.updateById(id, twilioChatChannel);
  }

  @put('/twilio-chat-channels/{id}', {
    responses: {
      '204': {
        description: 'TwilioChatChannel PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() twilioChatChannel: TwilioChatChannel,
  ): Promise<void> {
    await this.twilioChatChannelRepository.replaceById(id, twilioChatChannel);
  }

  @del('/twilio-chat-channels/{id}', {
    responses: {
      '204': {
        description: 'TwilioChatChannel DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.twilioChatChannelRepository.deleteById(id);
  }
}
