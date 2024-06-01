import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {UserLogin, UserLoginRelations, User} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class UserLoginRepository extends DefaultCrudRepository<
  UserLogin,
  typeof UserLogin.prototype.id,
  UserLoginRelations
> {

  public readonly user: BelongsToAccessor<User, typeof UserLogin.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(UserLogin, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
