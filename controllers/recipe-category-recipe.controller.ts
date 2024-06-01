import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  RecipeCategory,
  Recipe,
} from '../models';
import {RecipeCategoryRepository} from '../repositories';

export class RecipeCategoryRecipeController {
  constructor(
    @repository(RecipeCategoryRepository) protected recipeCategoryRepository: RecipeCategoryRepository,
  ) { }

  @get('/recipe-categories/{id}/recipes', {
    responses: {
      '200': {
        description: 'Array of RecipeCategory has many Recipe',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Recipe)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Recipe>,
  ): Promise<Recipe[]> {
    return this.recipeCategoryRepository.recipes(id).find(filter);
  }

  @post('/recipe-categories/{id}/recipes', {
    responses: {
      '200': {
        description: 'RecipeCategory model instance',
        content: {'application/json': {schema: getModelSchemaRef(Recipe)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof RecipeCategory.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Recipe, {
            title: 'NewRecipeInRecipeCategory',
            exclude: ['id'],
            optional: ['recipeCategoryId']
          }),
        },
      },
    }) recipe: Omit<Recipe, 'id'>,
  ): Promise<Recipe> {
    return this.recipeCategoryRepository.recipes(id).create(recipe);
  }

  @patch('/recipe-categories/{id}/recipes', {
    responses: {
      '200': {
        description: 'RecipeCategory.Recipe PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Recipe, {partial: true}),
        },
      },
    })
    recipe: Partial<Recipe>,
    @param.query.object('where', getWhereSchemaFor(Recipe)) where?: Where<Recipe>,
  ): Promise<Count> {
    return this.recipeCategoryRepository.recipes(id).patch(recipe, where);
  }

  @del('/recipe-categories/{id}/recipes', {
    responses: {
      '200': {
        description: 'RecipeCategory.Recipe DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Recipe)) where?: Where<Recipe>,
  ): Promise<Count> {
    return this.recipeCategoryRepository.recipes(id).delete(where);
  }
}
