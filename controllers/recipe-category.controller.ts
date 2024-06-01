import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {RecipeCategory} from '../models';
import {RecipeCategoryRepository} from '../repositories';

export class RecipeCategoryController {
  constructor(
    @repository(RecipeCategoryRepository)
    public recipeCategoryRepository : RecipeCategoryRepository,
  ) {}

  @post('/recipe-categories', {
    responses: {
      '200': {
        description: 'RecipeCategory model instance',
        content: {'application/json': {schema: getModelSchemaRef(RecipeCategory)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RecipeCategory, {
            title: 'NewRecipeCategory',
            exclude: ['id'],
          }),
        },
      },
    })
    recipeCategory: Omit<RecipeCategory, 'id'>,
  ): Promise<RecipeCategory> {
    return this.recipeCategoryRepository.create(recipeCategory);
  }

  @get('/recipe-categories/count', {
    operationId: 'recipeCategoriesCount',
    responses: {
      '200': {
        description: 'RecipeCategory model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(RecipeCategory) where?: Where<RecipeCategory>,
  ): Promise<Count> {
    return this.recipeCategoryRepository.count(where);
  }

  @get('/recipe-categories', {
    operationId: 'recipeCategories',
    responses: {
      '200': {
        description: 'Array of RecipeCategory model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(RecipeCategory, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(RecipeCategory, { name: 'RecipeCategoriesFilter' }) filter?: Filter<RecipeCategory>,
  ): Promise<RecipeCategory[]> {
    return this.recipeCategoryRepository.find(filter);
  }

  @patch('/recipe-categories', {
    responses: {
      '200': {
        description: 'RecipeCategory PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RecipeCategory, {partial: true}),
        },
      },
    })
    recipeCategory: RecipeCategory,
    @param.where(RecipeCategory) where?: Where<RecipeCategory>,
  ): Promise<Count> {
    return this.recipeCategoryRepository.updateAll(recipeCategory, where);
  }

  @get('/recipe-categories/{id}', {
    responses: {
      '200': {
        description: 'RecipeCategory model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(RecipeCategory, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(RecipeCategory, {exclude: 'where'}) filter?: FilterExcludingWhere<RecipeCategory>
  ): Promise<RecipeCategory> {
    return this.recipeCategoryRepository.findById(id, filter);
  }

  @patch('/recipe-categories/{id}', {
    responses: {
      '204': {
        description: 'RecipeCategory PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RecipeCategory, {partial: true}),
        },
      },
    })
    recipeCategory: RecipeCategory,
  ): Promise<void> {
    await this.recipeCategoryRepository.updateById(id, recipeCategory);
  }

  @put('/recipe-categories/{id}', {
    responses: {
      '204': {
        description: 'RecipeCategory PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() recipeCategory: RecipeCategory,
  ): Promise<void> {
    await this.recipeCategoryRepository.replaceById(id, recipeCategory);
  }

  @del('/recipe-categories/{id}', {
    responses: {
      '204': {
        description: 'RecipeCategory DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.recipeCategoryRepository.deleteById(id);
  }
}
