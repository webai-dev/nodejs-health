import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Exercise, ExerciseRelations, User} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class ExerciseRepository extends DefaultCrudRepository<
  Exercise,
  typeof Exercise.prototype.id,
  ExerciseRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Exercise.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Exercise, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
