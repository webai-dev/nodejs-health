import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Activity, ActivityRelations, ActivityEntry} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ActivityEntryRepository} from './activity-entry.repository';

export class ActivityRepository extends DefaultCrudRepository<
  Activity,
  typeof Activity.prototype.id,
  ActivityRelations
> {

  public readonly activityEntries: HasManyRepositoryFactory<ActivityEntry, typeof Activity.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ActivityEntryRepository') protected activityEntryRepositoryGetter: Getter<ActivityEntryRepository>,
  ) {
    super(Activity, dataSource);
    this.activityEntries = this.createHasManyRepositoryFactoryFor('activityEntries', activityEntryRepositoryGetter,);
    this.registerInclusionResolver('activityEntries', this.activityEntries.inclusionResolver);
  }
}
