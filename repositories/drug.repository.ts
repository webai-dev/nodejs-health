import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Drug, DrugRelations, DrugEntry} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {DrugEntryRepository} from './drug-entry.repository';

export class DrugRepository extends DefaultCrudRepository<
  Drug,
  typeof Drug.prototype.id,
  DrugRelations
> {

  public readonly drugEntries: HasManyRepositoryFactory<DrugEntry, typeof Drug.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('DrugEntryRepository') protected drugEntryRepositoryGetter: Getter<DrugEntryRepository>,
  ) {
    super(Drug, dataSource);
    this.drugEntries = this.createHasManyRepositoryFactoryFor('drugEntries', drugEntryRepositoryGetter,);
    this.registerInclusionResolver('drugEntries', this.drugEntries.inclusionResolver);
  }
}
