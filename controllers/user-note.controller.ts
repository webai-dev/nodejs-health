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
  Note,
} from '../models';
import {UserRepository} from '../repositories';

export class UserNoteController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/notes', {
    responses: {
      '200': {
        description: 'Array of User has many Note',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Note)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Note>,
  ): Promise<Note[]> {
    return this.userRepository.notes(id).find(filter);
  }

  @post('/users/{id}/notes', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Note)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Note, {
            title: 'NewNoteInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) note: Omit<Note, 'id'>,
  ): Promise<Note> {
    return this.userRepository.notes(id).create(note);
  }

  @patch('/users/{id}/notes', {
    responses: {
      '200': {
        description: 'User.Note PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Note, {partial: true}),
        },
      },
    })
    note: Partial<Note>,
    @param.query.object('where', getWhereSchemaFor(Note)) where?: Where<Note>,
  ): Promise<Count> {
    return this.userRepository.notes(id).patch(note, where);
  }

  @del('/users/{id}/notes', {
    responses: {
      '200': {
        description: 'User.Note DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Note)) where?: Where<Note>,
  ): Promise<Count> {
    return this.userRepository.notes(id).delete(where);
  }
}
