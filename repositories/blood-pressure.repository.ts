import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {BloodPressure, BloodPressureRelations, User} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class BloodPressureRepository extends DefaultCrudRepository<
  BloodPressure,
  typeof BloodPressure.prototype.id,
  BloodPressureRelations
> {

  public readonly user: BelongsToAccessor<User, typeof BloodPressure.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(BloodPressure, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
