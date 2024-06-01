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
  Step,
} from '../models';
import {UserRepository} from '../repositories';

export class UserStepController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/steps', {
    responses: {
      '200': {
        description: 'Array of User has many Step',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Step)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Step>,
  ): Promise<Step[]> {
    return this.userRepository.steps(id).find(filter);
  }

  @post('/users/{id}/steps', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Step)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Step, {
            title: 'NewStepInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) step: Omit<Step, 'id'>,
  ): Promise<Step> {
    return this.userRepository.steps(id).create(step);
  }

  @patch('/users/{id}/steps', {
    responses: {
      '200': {
        description: 'User.Step PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Step, {partial: true}),
        },
      },
    })
    step: Partial<Step>,
    @param.query.object('where', getWhereSchemaFor(Step)) where?: Where<Step>,
  ): Promise<Count> {
    return this.userRepository.steps(id).patch(step, where);
  }

  @del('/users/{id}/steps', {
    responses: {
      '200': {
        description: 'User.Step DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Step)) where?: Where<Step>,
  ): Promise<Count> {
    return this.userRepository.steps(id).delete(where);
  }
}
