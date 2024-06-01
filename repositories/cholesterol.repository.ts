import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Cholesterol, CholesterolRelations, User} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class CholesterolRepository extends DefaultCrudRepository<
  Cholesterol,
  typeof Cholesterol.prototype.id,
  CholesterolRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Cholesterol.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Cholesterol, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
