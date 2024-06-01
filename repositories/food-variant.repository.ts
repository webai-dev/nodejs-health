import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {FoodVariant, FoodVariantRelations, Food, FoodEntry} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {FoodRepository} from './food.repository';
import {FoodEntryRepository} from './food-entry.repository';

export class FoodVariantRepository extends DefaultCrudRepository<
  FoodVariant,
  typeof FoodVariant.prototype.id,
  FoodVariantRelations
> {

  public readonly food: BelongsToAccessor<Food, typeof FoodVariant.prototype.id>;

  public readonly foodEntries: HasManyRepositoryFactory<FoodEntry, typeof FoodVariant.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('FoodRepository') protected foodRepositoryGetter: Getter<FoodRepository>, @repository.getter('FoodEntryRepository') protected foodEntryRepositoryGetter: Getter<FoodEntryRepository>,
  ) {
    super(FoodVariant, dataSource);
    this.foodEntries = this.createHasManyRepositoryFactoryFor('foodEntries', foodEntryRepositoryGetter,);
    this.registerInclusionResolver('foodEntries', this.foodEntries.inclusionResolver);
    this.food = this.createBelongsToAccessorFor('food', foodRepositoryGetter,);
    this.registerInclusionResolver('food', this.food.inclusionResolver);
  }
}
