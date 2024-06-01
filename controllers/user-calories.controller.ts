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
  User,
  Calories,
} from '../models';
import {UserRepository} from '../repositories';

export class UserCaloriesController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/calories', {
    responses: {
      '200': {
        description: 'Array of User has many Calories',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Calories)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Calories>,
  ): Promise<Calories[]> {
    return this.userRepository.calories(id).find(filter);
  }

  @post('/users/{id}/calories', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Calories)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Calories, {
            title: 'NewCaloriesInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) calories: Omit<Calories, 'id'>,
  ): Promise<Calories> {
    return this.userRepository.calories(id).create(calories);
  }

  @patch('/users/{id}/calories', {
    responses: {
      '200': {
        description: 'User.Calories PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Calories, {partial: true}),
        },
      },
    })
    calories: Partial<Calories>,
    @param.query.object('where', getWhereSchemaFor(Calories)) where?: Where<Calories>,
  ): Promise<Count> {
    return this.userRepository.calories(id).patch(calories, where);
  }

  @del('/users/{id}/calories', {
    responses: {
      '200': {
        description: 'User.Calories DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Calories)) where?: Where<Calories>,
  ): Promise<Count> {
    return this.userRepository.calories(id).delete(where);
  }
}
