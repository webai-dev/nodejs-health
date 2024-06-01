import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {UserBaseline, UserBaselineRelations, User} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class UserBaselineRepository extends DefaultCrudRepository<
  UserBaseline,
  typeof UserBaseline.prototype.id,
  UserBaselineRelations
> {

  public readonly user: BelongsToAccessor<User, typeof UserBaseline.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(UserBaseline, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
