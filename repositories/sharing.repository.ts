import {DefaultCrudRepository, repository, BelongsToAccessor, HasOneRepositoryFactory} from '@loopback/repository';
import {Sharing, SharingRelations, User, SharingToken, TwilioChatChannel} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';
import {SharingTokenRepository} from './sharing-token.repository';
import {TwilioChatChannelRepository} from './twilio-chat-channel.repository';

export class SharingRepository extends DefaultCrudRepository<
  Sharing,
  typeof Sharing.prototype.id,
  SharingRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Sharing.prototype.id>;

  public readonly provider: BelongsToAccessor<User, typeof Sharing.prototype.id>;

  public readonly sharingToken: HasOneRepositoryFactory<SharingToken, typeof Sharing.prototype.id>;

  public readonly twilioChatChannel: BelongsToAccessor<TwilioChatChannel, typeof Sharing.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('SharingTokenRepository') protected sharingTokenRepositoryGetter: Getter<SharingTokenRepository>, @repository.getter('TwilioChatChannelRepository') protected twilioChatChannelRepositoryGetter: Getter<TwilioChatChannelRepository>,
  ) {
    super(Sharing, dataSource);
    this.twilioChatChannel = this.createBelongsToAccessorFor('twilioChatChannel', twilioChatChannelRepositoryGetter,);
    this.registerInclusionResolver('twilioChatChannel', this.twilioChatChannel.inclusionResolver);
    this.sharingToken = this.createHasOneRepositoryFactoryFor('sharingToken', sharingTokenRepositoryGetter);
    this.registerInclusionResolver('sharingToken', this.sharingToken.inclusionResolver);
    this.provider = this.createBelongsToAccessorFor('provider', userRepositoryGetter,);
    this.registerInclusionResolver('provider', this.provider.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
