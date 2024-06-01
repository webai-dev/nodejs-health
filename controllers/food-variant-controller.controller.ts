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
import {FoodVariant} from '../models';
import {FoodVariantRepository} from '../repositories';

export class FoodVariantControllerController {
  constructor(
    @repository(FoodVariantRepository)
    public foodVariantRepository : FoodVariantRepository,
  ) {}

  @post('/food-variants', {
    responses: {
      '200': {
        description: 'FoodVariant model instance',
        content: {'application/json': {schema: getModelSchemaRef(FoodVariant)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodVariant, {
            title: 'NewFoodVariant',
            exclude: ['id'],
          }),
        },
      },
    })
    foodVariant: Omit<FoodVariant, 'id'>,
  ): Promise<FoodVariant> {
    return this.foodVariantRepository.create(foodVariant);
  }

  @get('/food-variants/count', {
    responses: {
      '200': {
        description: 'FoodVariant model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(FoodVariant) where?: Where<FoodVariant>,
  ): Promise<Count> {
    return this.foodVariantRepository.count(where);
  }

  @get('/food-variants', {
    responses: {
      '200': {
        description: 'Array of FoodVariant model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(FoodVariant, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(FoodVariant) filter?: Filter<FoodVariant>,
  ): Promise<FoodVariant[]> {
    return this.foodVariantRepository.find(filter);
  }

  @patch('/food-variants', {
    responses: {
      '200': {
        description: 'FoodVariant PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodVariant, {partial: true}),
        },
      },
    })
    foodVariant: FoodVariant,
    @param.where(FoodVariant) where?: Where<FoodVariant>,
  ): Promise<Count> {
    return this.foodVariantRepository.updateAll(foodVariant, where);
  }

  @get('/food-variants/{id}', {
    responses: {
      '200': {
        description: 'FoodVariant model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(FoodVariant, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(FoodVariant, {exclude: 'where'}) filter?: FilterExcludingWhere<FoodVariant>
  ): Promise<FoodVariant> {
    return this.foodVariantRepository.findById(id, filter);
  }

  @patch('/food-variants/{id}', {
    responses: {
      '204': {
        description: 'FoodVariant PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodVariant, {partial: true}),
        },
      },
    })
    foodVariant: FoodVariant,
  ): Promise<void> {
    await this.foodVariantRepository.updateById(id, foodVariant);
  }

  @put('/food-variants/{id}', {
    responses: {
      '204': {
        description: 'FoodVariant PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() foodVariant: FoodVariant,
  ): Promise<void> {
    await this.foodVariantRepository.replaceById(id, foodVariant);
  }

  @del('/food-variants/{id}', {
    responses: {
      '204': {
        description: 'FoodVariant DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.foodVariantRepository.deleteById(id);
  }
}
