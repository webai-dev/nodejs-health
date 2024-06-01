import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Kidney, KidneyRelations, User} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class KidneyRepository extends DefaultCrudRepository<
  Kidney,
  typeof Kidney.prototype.id,
  KidneyRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Kidney.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Kidney, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
