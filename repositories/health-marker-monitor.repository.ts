import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {HealthMarkerMonitor, HealthMarkerMonitorRelations, User, HealthMarker} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';
import {HealthMarkerRepository} from './health-marker.repository';

export class HealthMarkerMonitorRepository extends DefaultCrudRepository<
  HealthMarkerMonitor,
  typeof HealthMarkerMonitor.prototype.id,
  HealthMarkerMonitorRelations
> {

  public readonly user: BelongsToAccessor<User, typeof HealthMarkerMonitor.prototype.id>;

  public readonly provider: BelongsToAccessor<User, typeof HealthMarkerMonitor.prototype.id>;

  public readonly healthMarker: BelongsToAccessor<HealthMarker, typeof HealthMarkerMonitor.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('HealthMarkerRepository') protected healthMarkerRepositoryGetter: Getter<HealthMarkerRepository>,
  ) {
    super(HealthMarkerMonitor, dataSource);
    this.healthMarker = this.createBelongsToAccessorFor('healthMarker', healthMarkerRepositoryGetter,);
    this.registerInclusionResolver('healthMarker', this.healthMarker.inclusionResolver);
    this.provider = this.createBelongsToAccessorFor('provider', userRepositoryGetter,);
    this.registerInclusionResolver('provider', this.provider.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
