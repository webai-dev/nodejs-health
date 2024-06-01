import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {HealthMarkerMonitorInterval, HealthMarkerMonitorIntervalRelations, HealthMarkerMonitor, User} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {HealthMarkerMonitorRepository} from './health-marker-monitor.repository';
import {UserRepository} from './user.repository';

export class HealthMarkerMonitorIntervalRepository extends DefaultCrudRepository<
  HealthMarkerMonitorInterval,
  typeof HealthMarkerMonitorInterval.prototype.id,
  HealthMarkerMonitorIntervalRelations
> {

  public readonly healthMarkerMonitor: BelongsToAccessor<HealthMarkerMonitor, typeof HealthMarkerMonitorInterval.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof HealthMarkerMonitorInterval.prototype.id>;

  public readonly provider: BelongsToAccessor<User, typeof HealthMarkerMonitorInterval.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('HealthMarkerMonitorRepository') protected healthMarkerMonitorRepositoryGetter: Getter<HealthMarkerMonitorRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(HealthMarkerMonitorInterval, dataSource);
    this.provider = this.createBelongsToAccessorFor('provider', userRepositoryGetter,);
    this.registerInclusionResolver('provider', this.provider.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.healthMarkerMonitor = this.createBelongsToAccessorFor('healthMarkerMonitor', healthMarkerMonitorRepositoryGetter,);
    this.registerInclusionResolver('healthMarkerMonitor', this.healthMarkerMonitor.inclusionResolver);
  }
}
