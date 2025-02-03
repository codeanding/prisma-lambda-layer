import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { badRequest, formatHttpResponse, internalServerError, notFound } from '../helper/response';
import { CreateDishDTO, UpdateDishDTO } from '../interfaces/dish.interface';
import { DishService } from '../services/dish';

export class DishesHandler {
  static async getAllDishes(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const service = new DishService();

      const dishes = await service.findAll();
      return formatHttpResponse(200, dishes, event);
    } catch (error) {
      return internalServerError(event);
    }
  }

  static async getDishById(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const service = new DishService();

      const id = parseInt(event.pathParameters?.id || '');
      if (isNaN(id)) return badRequest(event, 'Invalid ID');

      const dish = await service.findById(id);
      return dish ? formatHttpResponse(200, dish, event) : notFound(event, 'Dish not found');
    } catch (error) {
      return internalServerError(event);
    }
  }

  static async createDish(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const service = new DishService();

      const body: CreateDishDTO = JSON.parse(event.body || '{}');

      if (
        !body.name ||
        !body.description ||
        !body.countryId ||
        !Array.isArray(body.ingredientIds)
      ) {
        return badRequest(event, 'Invalid request data');
      }

      const newDish = await service.create(
        body.name,
        body.description,
        body.countryId,
        body.ingredientIds
      );
      return formatHttpResponse(201, newDish, event);
    } catch (error) {
      return internalServerError(event);
    }
  }

  static async updateDish(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const service = new DishService();

      const id = parseInt(event.pathParameters?.id || '');
      const body: UpdateDishDTO = JSON.parse(event.body || '{}');

      if (isNaN(id) || !body.name || !body.description) return badRequest(event, 'Invalid data');

      const updatedDish = await service.update(id, body.name, body.description);
      return formatHttpResponse(200, updatedDish, event);
    } catch (error) {
      return internalServerError(event);
    }
  }

  static async deleteDish(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const service = new DishService();

      const id = parseInt(event.pathParameters?.id || '');
      if (isNaN(id)) return badRequest(event, 'Invalid ID');

      await service.delete(id);
      return formatHttpResponse(204, {}, event);
    } catch (error) {
      return internalServerError(event);
    }
  }
}
