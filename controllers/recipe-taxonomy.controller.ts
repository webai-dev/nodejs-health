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
import {RecipeTaxonomy} from '../models';
import {RecipeTaxonomyRepository} from '../repositories';

export class RecipeTaxonomyController {
  constructor(
    @repository(RecipeTaxonomyRepository)
    public recipeTaxonomyRepository : RecipeTaxonomyRepository,
  ) {}

  @post('/recipe-taxonomies', {
    responses: {
      '200': {
        description: 'RecipeTaxonomy model instance',
        content: {'application/json': {schema: getModelSchemaRef(RecipeTaxonomy)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RecipeTaxonomy, {
            title: 'NewRecipeTaxonomy',
            exclude: ['id'],
          }),
        },
      },
    })
    recipeTaxonomy: Omit<RecipeTaxonomy, 'id'>,
  ): Promise<RecipeTaxonomy> {
    return this.recipeTaxonomyRepository.create(recipeTaxonomy);
  }

  @get('/recipe-taxonomies/count', {
    responses: {
      '200': {
        description: 'RecipeTaxonomy model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(RecipeTaxonomy) where?: Where<RecipeTaxonomy>,
  ): Promise<Count> {
    return this.recipeTaxonomyRepository.count(where);
  }

  @get('/recipe-taxonomies', {
    responses: {
      '200': {
        description: 'Array of RecipeTaxonomy model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(RecipeTaxonomy, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(RecipeTaxonomy) filter?: Filter<RecipeTaxonomy>,
  ): Promise<RecipeTaxonomy[]> {
    return this.recipeTaxonomyRepository.find(filter);
  }

  @patch('/recipe-taxonomies', {
    responses: {
      '200': {
        description: 'RecipeTaxonomy PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RecipeTaxonomy, {partial: true}),
        },
      },
    })
    recipeTaxonomy: RecipeTaxonomy,
    @param.where(RecipeTaxonomy) where?: Where<RecipeTaxonomy>,
  ): Promise<Count> {
    return this.recipeTaxonomyRepository.updateAll(recipeTaxonomy, where);
  }

  @get('/recipe-taxonomies/{id}', {
    responses: {
      '200': {
        description: 'RecipeTaxonomy model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(RecipeTaxonomy, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(RecipeTaxonomy, {exclude: 'where'}) filter?: FilterExcludingWhere<RecipeTaxonomy>
  ): Promise<RecipeTaxonomy> {
    return this.recipeTaxonomyRepository.findById(id, filter);
  }

  @patch('/recipe-taxonomies/{id}', {
    responses: {
      '204': {
        description: 'RecipeTaxonomy PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RecipeTaxonomy, {partial: true}),
        },
      },
    })
    recipeTaxonomy: RecipeTaxonomy,
  ): Promise<void> {
    await this.recipeTaxonomyRepository.updateById(id, recipeTaxonomy);
  }

  @put('/recipe-taxonomies/{id}', {
    responses: {
      '204': {
        description: 'RecipeTaxonomy PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() recipeTaxonomy: RecipeTaxonomy,
  ): Promise<void> {
    await this.recipeTaxonomyRepository.replaceById(id, recipeTaxonomy);
  }

  @del('/recipe-taxonomies/{id}', {
    responses: {
      '204': {
        description: 'RecipeTaxonomy DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.recipeTaxonomyRepository.deleteById(id);
  }
}
