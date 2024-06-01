import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {ActivityEntry, ActivityEntryRelations, Activity, User} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ActivityRepository} from './activity.repository';
import {UserRepository} from './user.repository';

export class ActivityEntryRepository extends DefaultCrudRepository<
  ActivityEntry,
  typeof ActivityEntry.prototype.id,
  ActivityEntryRelations
> {

  public readonly activity: BelongsToAccessor<Activity, typeof ActivityEntry.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof ActivityEntry.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ActivityRepository') protected activityRepositoryGetter: Getter<ActivityRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(ActivityEntry, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.activity = this.createBelongsToAccessorFor('activity', activityRepositoryGetter,);
    this.registerInclusionResolver('activity', this.activity.inclusionResolver);
  }
}
