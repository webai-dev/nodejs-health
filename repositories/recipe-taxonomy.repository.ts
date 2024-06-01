import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {RecipeTaxonomy, RecipeTaxonomyRelations, Recipe, RecipeCategory} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {RecipeCategoryRepository} from './recipe-category.repository';

export class RecipeTaxonomyRepository extends DefaultCrudRepository<
  RecipeTaxonomy,
  typeof RecipeTaxonomy.prototype.id,
  RecipeTaxonomyRelations
> {

  public readonly recipeCategory: BelongsToAccessor<RecipeCategory, typeof RecipeTaxonomy.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('RecipeCategoryRepository') protected recipeCategoryRepositoryGetter: Getter<RecipeCategoryRepository>,
  ) {
    super(RecipeTaxonomy, dataSource);
    this.recipeCategory = this.createBelongsToAccessorFor('recipeCategory', recipeCategoryRepositoryGetter,);
    this.registerInclusionResolver('recipeCategory', this.recipeCategory.inclusionResolver);
  }
}
