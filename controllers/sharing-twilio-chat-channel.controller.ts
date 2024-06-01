import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Sharing,
  TwilioChatChannel,
} from '../models';
import {SharingRepository} from '../repositories';

export class SharingTwilioChatChannelController {
  constructor(
    @repository(SharingRepository)
    public sharingRepository: SharingRepository,
  ) { }

  @get('/sharings/{id}/twilio-chat-channel', {
    responses: {
      '200': {
        description: 'TwilioChatChannel belonging to Sharing',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TwilioChatChannel)},
          },
        },
      },
    },
  })
  async getTwilioChatChannel(
    @param.path.number('id') id: typeof Sharing.prototype.id,
  ): Promise<TwilioChatChannel> {
    return this.sharingRepository.twilioChatChannel(id);
  }
}
