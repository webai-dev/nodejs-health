import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {UserTwilioChatChannel, UserTwilioChatChannelRelations, User, TwilioChatChannel} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';
import {TwilioChatChannelRepository} from './twilio-chat-channel.repository';

export class UserTwilioChatChannelRepository extends DefaultCrudRepository<
  UserTwilioChatChannel,
  typeof UserTwilioChatChannel.prototype.id,
  UserTwilioChatChannelRelations
> {

  public readonly user: BelongsToAccessor<User, typeof UserTwilioChatChannel.prototype.id>;

  public readonly twilioChatChannel: BelongsToAccessor<TwilioChatChannel, typeof UserTwilioChatChannel.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('TwilioChatChannelRepository') protected twilioChatChannelRepositoryGetter: Getter<TwilioChatChannelRepository>,
  ) {
    super(UserTwilioChatChannel, dataSource);
    this.twilioChatChannel = this.createBelongsToAccessorFor('twilioChatChannel', twilioChatChannelRepositoryGetter,);
    this.registerInclusionResolver('twilioChatChannel', this.twilioChatChannel.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
