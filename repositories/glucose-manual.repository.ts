import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {GlucoseManual, GlucoseManualRelations, User} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class GlucoseManualRepository extends DefaultCrudRepository<
  GlucoseManual,
  typeof GlucoseManual.prototype.id,
  GlucoseManualRelations
> {

  public readonly user: BelongsToAccessor<User, typeof GlucoseManual.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(GlucoseManual, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
