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
  GlucoseManual,
} from '../models';
import {UserRepository} from '../repositories';

export class UserGlucoseManualController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/glucose-manuals', {
    responses: {
      '200': {
        description: 'Array of User has many GlucoseManual',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(GlucoseManual)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<GlucoseManual>,
  ): Promise<GlucoseManual[]> {
    return this.userRepository.glucoseManuals(id).find(filter);
  }

  @post('/users/{id}/glucose-manuals', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(GlucoseManual)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GlucoseManual, {
            title: 'NewGlucoseManualInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) glucoseManual: Omit<GlucoseManual, 'id'>,
  ): Promise<GlucoseManual> {
    return this.userRepository.glucoseManuals(id).create(glucoseManual);
  }

  @patch('/users/{id}/glucose-manuals', {
    responses: {
      '200': {
        description: 'User.GlucoseManual PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GlucoseManual, {partial: true}),
        },
      },
    })
    glucoseManual: Partial<GlucoseManual>,
    @param.query.object('where', getWhereSchemaFor(GlucoseManual)) where?: Where<GlucoseManual>,
  ): Promise<Count> {
    return this.userRepository.glucoseManuals(id).patch(glucoseManual, where);
  }

  @del('/users/{id}/glucose-manuals', {
    responses: {
      '200': {
        description: 'User.GlucoseManual DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(GlucoseManual)) where?: Where<GlucoseManual>,
  ): Promise<Count> {
    return this.userRepository.glucoseManuals(id).delete(where);
  }
}
