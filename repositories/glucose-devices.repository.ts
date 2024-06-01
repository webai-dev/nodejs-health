import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {GlucoseDevices, GlucoseDevicesRelations, User} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class GlucoseDevicesRepository extends DefaultCrudRepository<
  GlucoseDevices,
  typeof GlucoseDevices.prototype.id,
  GlucoseDevicesRelations
> {

  public readonly user: BelongsToAccessor<User, typeof GlucoseDevices.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(GlucoseDevices, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
