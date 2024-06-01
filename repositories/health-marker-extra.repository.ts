import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {HealthMarkerExtra, HealthMarkerExtraRelations, User} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class HealthMarkerExtraRepository extends DefaultCrudRepository<
  HealthMarkerExtra,
  typeof HealthMarkerExtra.prototype.id,
  HealthMarkerExtraRelations
> {

  public readonly user: BelongsToAccessor<User, typeof HealthMarkerExtra.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(HealthMarkerExtra, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
