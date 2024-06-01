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
  RecipeTaxonomy,
} from '../models';
import {RecipeCategoryRepository} from '../repositories';

export class RecipeCategoryRecipeTaxonomyController {
  constructor(
    @repository(RecipeCategoryRepository) protected recipeCategoryRepository: RecipeCategoryRepository,
  ) { }

  @get('/recipe-categories/{id}/recipe-taxonomies', {
    responses: {
      '200': {
        description: 'Array of RecipeCategory has many RecipeTaxonomy',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(RecipeTaxonomy)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<RecipeTaxonomy>,
  ): Promise<RecipeTaxonomy[]> {
    return this.recipeCategoryRepository.recipeTaxonomies(id).find(filter);
  }

  @post('/recipe-categories/{id}/recipe-taxonomies', {
    responses: {
      '200': {
        description: 'RecipeCategory model instance',
        content: {'application/json': {schema: getModelSchemaRef(RecipeTaxonomy)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof RecipeCategory.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RecipeTaxonomy, {
            title: 'NewRecipeTaxonomyInRecipeCategory',
            exclude: ['id'],
            optional: ['recipeCategoryId']
          }),
        },
      },
    }) recipeTaxonomy: Omit<RecipeTaxonomy, 'id'>,
  ): Promise<RecipeTaxonomy> {
    return this.recipeCategoryRepository.recipeTaxonomies(id).create(recipeTaxonomy);
  }

  @patch('/recipe-categories/{id}/recipe-taxonomies', {
    responses: {
      '200': {
        description: 'RecipeCategory.RecipeTaxonomy PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RecipeTaxonomy, {partial: true}),
        },
      },
    })
    recipeTaxonomy: Partial<RecipeTaxonomy>,
    @param.query.object('where', getWhereSchemaFor(RecipeTaxonomy)) where?: Where<RecipeTaxonomy>,
  ): Promise<Count> {
    return this.recipeCategoryRepository.recipeTaxonomies(id).patch(recipeTaxonomy, where);
  }

  @del('/recipe-categories/{id}/recipe-taxonomies', {
    responses: {
      '200': {
        description: 'RecipeCategory.RecipeTaxonomy DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(RecipeTaxonomy)) where?: Where<RecipeTaxonomy>,
  ): Promise<Count> {
    return this.recipeCategoryRepository.recipeTaxonomies(id).delete(where);
  }
}
