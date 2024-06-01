import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Dose, DoseRelations, DrugEntry} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {DrugEntryRepository} from './drug-entry.repository';

export class DoseRepository extends DefaultCrudRepository<
  Dose,
  typeof Dose.prototype.id,
  DoseRelations
> {

  public readonly drugEntry: BelongsToAccessor<DrugEntry, typeof Dose.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('DrugEntryRepository') protected drugEntryRepositoryGetter: Getter<DrugEntryRepository>,
  ) {
    super(Dose, dataSource);
    this.drugEntry = this.createBelongsToAccessorFor('drugEntry', drugEntryRepositoryGetter,);
    this.registerInclusionResolver('drugEntry', this.drugEntry.inclusionResolver);
  }
}
