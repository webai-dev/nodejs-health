import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  RecipeTaxonomy,
  RecipeCategory,
} from '../models';
import {RecipeTaxonomyRepository} from '../repositories';

export class RecipeTaxonomyRecipeCategoryController {
  constructor(
    @repository(RecipeTaxonomyRepository)
    public recipeTaxonomyRepository: RecipeTaxonomyRepository,
  ) { }

  @get('/recipe-taxonomies/{id}/recipe-category', {
    responses: {
      '200': {
        description: 'RecipeCategory belonging to RecipeTaxonomy',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(RecipeCategory)},
          },
        },
      },
    },
  })
  async getRecipeCategory(
    @param.path.number('id') id: typeof RecipeTaxonomy.prototype.id,
  ): Promise<RecipeCategory> {
    return this.recipeTaxonomyRepository.recipeCategory(id);
  }
}
