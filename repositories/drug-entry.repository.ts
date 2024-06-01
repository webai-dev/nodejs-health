import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {DrugEntry, DrugEntryRelations, Drug, User, Dose} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {DrugRepository} from './drug.repository';
import {UserRepository} from './user.repository';
import {DoseRepository} from './dose.repository';

export class DrugEntryRepository extends DefaultCrudRepository<
  DrugEntry,
  typeof DrugEntry.prototype.id,
  DrugEntryRelations
> {

  public readonly drug: BelongsToAccessor<Drug, typeof DrugEntry.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof DrugEntry.prototype.id>;

  public readonly doses: HasManyRepositoryFactory<Dose, typeof DrugEntry.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('DrugRepository') protected drugRepositoryGetter: Getter<DrugRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('DoseRepository') protected doseRepositoryGetter: Getter<DoseRepository>,
  ) {
    super(DrugEntry, dataSource);
    this.doses = this.createHasManyRepositoryFactoryFor('doses', doseRepositoryGetter,);
    this.registerInclusionResolver('doses', this.doses.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.drug = this.createBelongsToAccessorFor('drug', drugRepositoryGetter,);
    this.registerInclusionResolver('drug', this.drug.inclusionResolver);
  }
}
