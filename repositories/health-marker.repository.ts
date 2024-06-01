import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {HealthMarker, HealthMarkerRelations, HealthMarkerInterval, User} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {HealthMarkerIntervalRepository} from './health-marker-interval.repository';
import {UserRepository} from './user.repository';

export class HealthMarkerRepository extends DefaultCrudRepository<
  HealthMarker,
  typeof HealthMarker.prototype.id,
  HealthMarkerRelations
> {

  public readonly healthMarkerIntervals: HasManyRepositoryFactory<HealthMarkerInterval, typeof HealthMarker.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof HealthMarker.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('HealthMarkerIntervalRepository') protected healthMarkerIntervalRepositoryGetter: Getter<HealthMarkerIntervalRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(HealthMarker, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.healthMarkerIntervals = this.createHasManyRepositoryFactoryFor('healthMarkerIntervals', healthMarkerIntervalRepositoryGetter,);
    this.registerInclusionResolver('healthMarkerIntervals', this.healthMarkerIntervals.inclusionResolver);
  }
}
