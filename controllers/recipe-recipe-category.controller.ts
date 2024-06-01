import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Recipe,
  RecipeCategory,
} from '../models';
import {RecipeRepository} from '../repositories';

export class RecipeRecipeCategoryController {
  constructor(
    @repository(RecipeRepository)
    public recipeRepository: RecipeRepository,
  ) { }

  @get('/recipes/{id}/recipe-category', {
    responses: {
      '200': {
        description: 'RecipeCategory belonging to Recipe',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(RecipeCategory)},
          },
        },
      },
    },
  })
  async getRecipeCategory(
    @param.path.number('id') id: typeof Recipe.prototype.id,
  ): Promise<RecipeCategory> {
    return this.recipeRepository.recipeCategory(id);
  }
}
