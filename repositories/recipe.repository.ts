import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Recipe, RecipeRelations, RecipeCategory, RecipeTaxonomy} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {RecipeCategoryRepository} from './recipe-category.repository';

export class RecipeRepository extends DefaultCrudRepository<
  Recipe,
  typeof Recipe.prototype.id,
  RecipeRelations
> {

  public readonly recipeTaxonomy: BelongsToAccessor<RecipeTaxonomy, typeof Recipe.prototype.id>;

  public readonly recipeCategory: BelongsToAccessor<RecipeCategory, typeof Recipe.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('RecipeCategoryRepository') protected recipeCategoryRepositoryGetter: Getter<RecipeCategoryRepository>,
  ) {
    super(Recipe, dataSource);
    this.recipeCategory = this.createBelongsToAccessorFor('recipeCategory', recipeCategoryRepositoryGetter,);
    this.registerInclusionResolver('recipeCategory', this.recipeCategory.inclusionResolver);
  }
}
