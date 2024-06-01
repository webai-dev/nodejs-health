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
  GlucoseDevices,
} from '../models';
import {UserRepository} from '../repositories';

export class UserGlucoseDevicesController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/glucose-devices', {
    responses: {
      '200': {
        description: 'Array of User has many GlucoseDevices',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(GlucoseDevices)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<GlucoseDevices>,
  ): Promise<GlucoseDevices[]> {
    return this.userRepository.glucoseDevices(id).find(filter);
  }

  @post('/users/{id}/glucose-devices', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(GlucoseDevices)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GlucoseDevices, {
            title: 'NewGlucoseDevicesInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) glucoseDevices: Omit<GlucoseDevices, 'id'>,
  ): Promise<GlucoseDevices> {
    return this.userRepository.glucoseDevices(id).create(glucoseDevices);
  }

  @patch('/users/{id}/glucose-devices', {
    responses: {
      '200': {
        description: 'User.GlucoseDevices PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GlucoseDevices, {partial: true}),
        },
      },
    })
    glucoseDevices: Partial<GlucoseDevices>,
    @param.query.object('where', getWhereSchemaFor(GlucoseDevices)) where?: Where<GlucoseDevices>,
  ): Promise<Count> {
    return this.userRepository.glucoseDevices(id).patch(glucoseDevices, where);
  }

  @del('/users/{id}/glucose-devices', {
    responses: {
      '200': {
        description: 'User.GlucoseDevices DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(GlucoseDevices)) where?: Where<GlucoseDevices>,
  ): Promise<Count> {
    return this.userRepository.glucoseDevices(id).delete(where);
  }
}
