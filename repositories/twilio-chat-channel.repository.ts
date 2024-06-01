import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory, HasOneRepositoryFactory} from '@loopback/repository';
import {TwilioChatChannel, TwilioChatChannelRelations, Sharing, UserTwilioChatChannel} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {SharingRepository} from './sharing.repository';
import {UserTwilioChatChannelRepository} from './user-twilio-chat-channel.repository';

export class TwilioChatChannelRepository extends DefaultCrudRepository<
  TwilioChatChannel,
  typeof TwilioChatChannel.prototype.id,
  TwilioChatChannelRelations
> {

  public readonly userTwilioChatChannels: HasManyRepositoryFactory<UserTwilioChatChannel, typeof TwilioChatChannel.prototype.id>;

  public readonly sharing: HasOneRepositoryFactory<Sharing, typeof TwilioChatChannel.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('SharingRepository') protected sharingRepositoryGetter: Getter<SharingRepository>, @repository.getter('UserTwilioChatChannelRepository') protected userTwilioChatChannelRepositoryGetter: Getter<UserTwilioChatChannelRepository>,
  ) {
    super(TwilioChatChannel, dataSource);
    this.sharing = this.createHasOneRepositoryFactoryFor('sharing', sharingRepositoryGetter);
    this.registerInclusionResolver('sharing', this.sharing.inclusionResolver);
    this.userTwilioChatChannels = this.createHasManyRepositoryFactoryFor('userTwilioChatChannels', userTwilioChatChannelRepositoryGetter,);
    this.registerInclusionResolver('userTwilioChatChannels', this.userTwilioChatChannels.inclusionResolver);
  }
}
