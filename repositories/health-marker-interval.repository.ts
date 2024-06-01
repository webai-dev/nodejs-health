import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {HealthMarkerInterval, HealthMarkerIntervalRelations, HealthMarker} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {HealthMarkerRepository} from './health-marker.repository';

export class HealthMarkerIntervalRepository extends DefaultCrudRepository<
  HealthMarkerInterval,
  typeof HealthMarkerInterval.prototype.id,
  HealthMarkerIntervalRelations
> {

  public readonly healthMarker: BelongsToAccessor<HealthMarker, typeof HealthMarkerInterval.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('HealthMarkerRepository') protected healthMarkerRepositoryGetter: Getter<HealthMarkerRepository>,
  ) {
    super(HealthMarkerInterval, dataSource);
    this.healthMarker = this.createBelongsToAccessorFor('healthMarker', healthMarkerRepositoryGetter,);
    this.registerInclusionResolver('healthMarker', this.healthMarker.inclusionResolver);
  }
}
