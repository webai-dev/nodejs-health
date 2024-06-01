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
  RestBindings,
  Request,
  Response,
} from '@loopback/rest';

import {
  AuthenticationBindings,
  authenticate
} from '@loopback/authentication';
import {UserProfile} from '@loopback/security';
import { inject } from '@loopback/core';

import fs from 'fs';
import path from 'path';

import {Recipe} from '../models';
import {RecipeRepository, UserRoleRepository} from '../repositories';
import {FILE_UPLOAD_SERVICE} from '../keys';
import {FileUploadHandler} from '../types';

export class RecipeController {
  constructor(
    @repository(RecipeRepository)
    public recipeRepository : RecipeRepository,
    @repository(UserRoleRepository)
    public userRoleRepository : UserRoleRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true })
    private user: UserProfile,
    @inject(FILE_UPLOAD_SERVICE) private handler: FileUploadHandler,
  ) {}

  @post('/recipes', {
    operationId: 'createRecipe',
    responses: {
      '200': {
        description: 'Recipe model instance',
        content: {'application/json': {schema: getModelSchemaRef(Recipe)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Recipe, {
            title: 'NewRecipe',
            exclude: ['id'],
          }),
        },
      },
    })
    recipe: Omit<Recipe, 'id'>,
  ): Promise<Recipe> {
    return this.recipeRepository.create(recipe);
  }

  @get('/recipes/count', {
    operationId: 'recipesCount',
    responses: {
      '200': {
        description: 'Recipe model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Recipe) where?: Where<Recipe>,
  ): Promise<Count> {
    return this.recipeRepository.count(where);
  }

  @get('/recipes', {
    operationId: 'recipes',
    responses: {
      '200': {
        description: 'Array of Recipe model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Recipe, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.filter(Recipe, {name: 'RecipesFilter'}) filter?: Filter<Recipe>,
  ): Promise<Recipe[]> {
    return this.recipeRepository.find(filter);
  }

  @patch('/recipes', {
    responses: {
      '200': {
        description: 'Recipe PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Recipe, {partial: true}),
        },
      },
    })
    recipe: Recipe,
    @param.where(Recipe) where?: Where<Recipe>,
  ): Promise<Count> {
    return this.recipeRepository.updateAll(recipe, where);
  }

  @get('/recipes/{id}', {
    operationId: 'recipe',
    responses: {
      '200': {
        description: 'Recipe model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Recipe, {includeRelations: true}),
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Recipe, {exclude: 'where'}) filter?: FilterExcludingWhere<Recipe>
  ): Promise<Recipe> {
    return this.recipeRepository.findById(id, filter);
  }

  @patch('/recipes/{id}', {
    operationId: 'updateRecipe',
    responses: {
      '204': {
        description: 'Recipe PATCH success',
        content: {'application/json': {schema: getModelSchemaRef(Recipe, { includeRelations: true })}},
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Recipe, {partial: true}),
        },
      },
    })
    recipe: Recipe,
  ): Promise<void> {
    await this.recipeRepository.updateById(id, recipe);
  }

  @put('/recipes/{id}', {
    responses: {
      '204': {
        description: 'Recipe PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() recipe: Recipe,
  ): Promise<void> {
    await this.recipeRepository.replaceById(id, recipe);
  }

  @del('/recipes/{id}', {
    operationId: 'deleteRecipe',
    responses: {
      '204': {
        description: 'Recipe DELETE success',
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
  @authenticate('jwt')
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.recipeRepository.deleteById(id);
  }

  @post('/recipes/upload', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Files and fields',
      },
    },
  })
  async fileUpload(
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      this.handler(request, response, (err: any) => {
        if (err) reject(err);
        else {
          resolve(RecipeController.getFilesAndFields(request, response));
        }
      });
    });
  }

  /**
   * Get files and fields for the request
   * @param request - Http request
   */
  private static async getFilesAndFields(request: any, response: any /*Request*/) {
    const file = request.files[0];
    const mapper = (f: any/* globalThis.Express.Multer.File*/) => ({
      fieldname: f.fieldname,
      originalname: f.originalname,
      encoding: f.encoding,
      mimetype: f.mimetype,
      size: f.size,
    });

    const oldPath = file.path;
    const ext = file.originalname.substring(file.originalname.lastIndexOf("."));
    const name = file.originalname.substring(0, file.originalname.lastIndexOf("."));
    const fileName = name + '-' + Date.now() + ext;
    
    await new Promise((resolve, reject) => {
      fs.readFile(oldPath , (err, data) => {
        fs.writeFile(path.resolve(__dirname, `../../public/recipe_images/${fileName}`) , data, function(err) {
            fs.unlink(oldPath, () => resolve());
        }); 
      }); 
    })

    return {
      fileName: `/recipe_images/${fileName}`,
      originalName: file.originalname,
    };
  }
}
