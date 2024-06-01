import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Diabetes, DiabetesRelations, User} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class DiabetesRepository extends DefaultCrudRepository<
  Diabetes,
  typeof Diabetes.prototype.id,
  DiabetesRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Diabetes.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Diabetes, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
