import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { badRequest, formatHttpResponse, internalServerError, notFound } from '../helper/response';
import { IngredientService } from '../services/ingredient';

export class IngredientsHandler {
  static async getAllIngredients(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const service = new IngredientService();

      const ingredients = await service.findAll();
      return formatHttpResponse(200, ingredients, event);
    } catch (error) {
      return internalServerError(event);
    }
  }

  static async getIngredientById(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const id = parseInt(event.pathParameters?.id || '');
      if (isNaN(id)) return badRequest(event, 'Invalid ID');

      const service = new IngredientService();
      const ingredient = await service.findById(id);
      return ingredient
        ? formatHttpResponse(200, ingredient, event)
        : notFound(event, 'Ingredient not found');
    } catch (error) {
      return internalServerError(event);
    }
  }

  static async createIngredient(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const body = JSON.parse(event.body || '{}');
      if (!body.name) return badRequest(event, 'Name is required');
      const service = new IngredientService();

      const newIngredient = await service.create(body.name);
      return formatHttpResponse(201, newIngredient, event);
    } catch (error) {
      return internalServerError(event);
    }
  }

  static async updateIngredient(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const id = parseInt(event.pathParameters?.id || '');
      const body = JSON.parse(event.body || '{}');

      if (isNaN(id) || !body.name) return badRequest(event, 'Invalid data');

      const service = new IngredientService();
      const updatedIngredient = await service.update(id, body.name);
      return formatHttpResponse(200, updatedIngredient, event);
    } catch (error) {
      return internalServerError(event);
    }
  }

  static async deleteIngredient(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const id = parseInt(event.pathParameters?.id || '');
      if (isNaN(id)) return badRequest(event, 'Invalid ID');

      const service = new IngredientService();
      await service.delete(id);
      return formatHttpResponse(204, {}, event);
    } catch (error) {
      return internalServerError(event);
    }
  }
}
