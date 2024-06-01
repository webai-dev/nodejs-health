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
import {
  AuthenticationBindings,
  authenticate
} from '@loopback/authentication';
import {UserProfile} from '@loopback/security';
import { inject } from '@loopback/core';

import {Note} from '../models';
import {NoteRepository, UserRoleRepository} from '../repositories';

import { USER_ROLES } from '../constants';

export class NoteController {
  constructor(
    @repository(NoteRepository)
    public noteRepository : NoteRepository,
    @repository(UserRoleRepository)
    public userRoleRepository : UserRoleRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true })
    private user: UserProfile,
  ) {}

  @post('/notes', {
    operationId: 'createNote',
    responses: {
      '200': {
        description: 'Note model instance',
        content: {'application/json': {schema: getModelSchemaRef(Note, {includeRelations: true})}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Note, {
            title: 'NewNote',
            exclude: ['id'],
          }),
        },
      },
    })
    note: Omit<Note, 'id'>,
  ): Promise<Note> {
    return this.noteRepository.create({...note, userId: note.userId || this.user.id});
  }

  @get('/notes', {
    operationId: 'notes',
    responses: {
      '200': {
        description: 'Array of Note model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Note, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(Note, {name: 'NotesFilter'}) filter?: Filter<Note>,
  ): Promise<Note[]> {
    const userRoles = await this.userRoleRepository.find({ where: { userId: this.user.id }});
    const userRoleIds = userRoles.map(userRole => userRole.roleId);

    if (userRoleIds.includes(USER_ROLES.ADMINISTRATOR) || userRoleIds.includes(USER_ROLES.PROVIDER)) {
      return this.noteRepository.find(filter);
    }

    return this.noteRepository.find({...filter, where: {...filter?.where, userId: this.user.id}});
  }

  @get('/notes/{id}', {
    operationId: 'note',
    responses: {
      '200': {
        description: 'Note model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Note, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number
  ): Promise<Note> {
    return this.noteRepository.findById(id);
  }

  @patch('/notes', {
    operationId: 'updateNotes',
    responses: {
      '200': {
        description: 'Note PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Note, {partial: true, exclude: ['id']}),
        },
      },
    })
    note: Note,
    @param.where(Note) where?: Where<Note>,
  ): Promise<Count> {
    return this.noteRepository.updateAll(note, where);
  }

  @patch('/notes/{id}', {
    operationId: 'updateNote',
    responses: {
      '204': {
        description: 'Note PATCH success',
        content: {'application/json': {schema: getModelSchemaRef(Note, { includeRelations: true })}},
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Note, {partial: true}),
        },
      },
    })
    note: Note,
  ): Promise<void> {
    await this.noteRepository.updateById(note.id, note);
  }

  @del('/notes/{id}', {
    operationId: 'deleteNote',
    responses: {
      '204': {
        description: 'Note DELETE success',
        content: {'application/json': {
          schema: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
              }
            }
          }
        }},
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<object> {
    try {
      await this.noteRepository.deleteById(id);
    } catch(e) {
      throw Error('Note DELETE failure');
    }

    return { id };
  }

  @get('/notes/count', {
    operationId: 'notesCount',
    responses: {
      '200': {
        description: 'Note model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Note) where?: Where<Note>,
  ): Promise<Count> {
    return this.noteRepository.count(where);
  }

  @put('/notes/{id}', {
    responses: {
      '204': {
        description: 'Note PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Note, {
            title: 'NewNote',
          }),
        },
      },
    }) note: Note,
  ): Promise<void> {
    await this.noteRepository.replaceById(id, note);
  }
}
