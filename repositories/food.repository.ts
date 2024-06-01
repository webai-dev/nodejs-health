import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Food, FoodRelations, FoodEntry, FoodBookmark, FoodVariant} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {FoodEntryRepository} from './food-entry.repository';
import {FoodBookmarkRepository} from './food-bookmark.repository';
import {FoodVariantRepository} from './food-variant.repository';

export class FoodRepository extends DefaultCrudRepository<
  Food,
  typeof Food.prototype.id,
  FoodRelations
> {

  public readonly foodEntries: HasManyRepositoryFactory<FoodEntry, typeof Food.prototype.id>;

  public readonly foodBookmarks: HasManyRepositoryFactory<FoodBookmark, typeof Food.prototype.id>;

  public readonly foodVariants: HasManyRepositoryFactory<FoodVariant, typeof Food.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('FoodEntryRepository') protected foodEntryRepositoryGetter: Getter<FoodEntryRepository>, @repository.getter('FoodBookmarkRepository') protected foodBookmarkRepositoryGetter: Getter<FoodBookmarkRepository>, @repository.getter('FoodVariantRepository') protected foodVariantRepositoryGetter: Getter<FoodVariantRepository>,
  ) {
    super(Food, dataSource);
    this.foodVariants = this.createHasManyRepositoryFactoryFor('foodVariants', foodVariantRepositoryGetter,);
    this.registerInclusionResolver('foodVariants', this.foodVariants.inclusionResolver);
    this.foodBookmarks = this.createHasManyRepositoryFactoryFor('foodBookmarks', foodBookmarkRepositoryGetter,);
    this.registerInclusionResolver('foodBookmarkeds', this.foodBookmarks.inclusionResolver);
    this.foodEntries = this.createHasManyRepositoryFactoryFor('foodEntries', foodEntryRepositoryGetter,);
    this.registerInclusionResolver('foodEntries', this.foodEntries.inclusionResolver);
  }
}
