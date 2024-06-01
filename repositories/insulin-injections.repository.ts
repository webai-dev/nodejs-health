import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {InsulinInjections, InsulinInjectionsRelations, User} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class InsulinInjectionsRepository extends DefaultCrudRepository<
  InsulinInjections,
  typeof InsulinInjections.prototype.id,
  InsulinInjectionsRelations
> {

  public readonly user: BelongsToAccessor<User, typeof InsulinInjections.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(InsulinInjections, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
