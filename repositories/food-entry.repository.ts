import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {FoodEntry, FoodEntryRelations, Food, FoodVariant, User} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {FoodRepository} from './food.repository';
import {FoodVariantRepository} from './food-variant.repository';
import {UserRepository} from './user.repository';

export class FoodEntryRepository extends DefaultCrudRepository<
  FoodEntry,
  typeof FoodEntry.prototype.id,
  FoodEntryRelations
> {

  public readonly food: BelongsToAccessor<Food, typeof FoodEntry.prototype.id>;

  public readonly foodVariant: BelongsToAccessor<FoodVariant, typeof FoodEntry.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof FoodEntry.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('FoodRepository') protected foodRepositoryGetter: Getter<FoodRepository>, @repository.getter('FoodVariantRepository') protected foodVariantRepositoryGetter: Getter<FoodVariantRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(FoodEntry, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.foodVariant = this.createBelongsToAccessorFor('foodVariant', foodVariantRepositoryGetter,);
    this.registerInclusionResolver('foodVariant', this.foodVariant.inclusionResolver);
    this.food = this.createBelongsToAccessorFor('food', foodRepositoryGetter,);
    this.registerInclusionResolver('food', this.food.inclusionResolver);
  }
}
