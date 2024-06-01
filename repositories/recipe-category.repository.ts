import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {RecipeCategory, RecipeCategoryRelations, RecipeTaxonomy, Recipe} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {RecipeTaxonomyRepository} from './recipe-taxonomy.repository';
import {RecipeRepository} from './recipe.repository';

export class RecipeCategoryRepository extends DefaultCrudRepository<
  RecipeCategory,
  typeof RecipeCategory.prototype.id,
  RecipeCategoryRelations
> {

  public readonly recipeTaxonomies: HasManyRepositoryFactory<RecipeTaxonomy, typeof RecipeCategory.prototype.id>;

  public readonly recipes: HasManyRepositoryFactory<Recipe, typeof RecipeCategory.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('RecipeTaxonomyRepository') protected recipeTaxonomyRepositoryGetter: Getter<RecipeTaxonomyRepository>, @repository.getter('RecipeRepository') protected recipeRepositoryGetter: Getter<RecipeRepository>,
  ) {
    super(RecipeCategory, dataSource);
    this.recipes = this.createHasManyRepositoryFactoryFor('recipes', recipeRepositoryGetter,);
    this.registerInclusionResolver('recipes', this.recipes.inclusionResolver);
    this.recipeTaxonomies = this.createHasManyRepositoryFactoryFor('recipeTaxonomies', recipeTaxonomyRepositoryGetter,);
    this.registerInclusionResolver('recipeTaxonomies', this.recipeTaxonomies.inclusionResolver);
  }
}
