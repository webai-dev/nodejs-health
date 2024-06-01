import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {PasswordResetRequest, PasswordResetRequestRelations, User} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class PasswordResetRequestRepository extends DefaultCrudRepository<
  PasswordResetRequest,
  typeof PasswordResetRequest.prototype.id,
  PasswordResetRequestRelations
> {

  public readonly user: BelongsToAccessor<User, typeof PasswordResetRequest.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(PasswordResetRequest, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
