import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { badRequest, formatHttpResponse, internalServerError, notFound } from '../helper/response';
import { CreateCountryDTO, UpdateCountryDTO } from '../interfaces/country.interface';
import { CountryService } from '../services/country';

export class CountriesHandler {
  static async getAllCountries(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const service = new CountryService();
      const countries = await service.findAll();
      return formatHttpResponse(200, countries, event);
    } catch (error) {
      console.error(error);
      return internalServerError(event);
    }
  }

  static async getCountryById(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const service = new CountryService();

      const id = parseInt(event.pathParameters?.id || '');
      if (isNaN(id)) return badRequest(event, 'Invalid ID');

      const country = await service.findById(id);
      return country
        ? formatHttpResponse(200, country, event)
        : notFound(event, 'Country not found');
    } catch (error) {
      return internalServerError(event);
    }
  }

  static async createCountry(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const service = new CountryService();

      const body: CreateCountryDTO = JSON.parse(event.body || '{}');
      if (!body.name) return badRequest(event, 'Name is required');

      const newCountry = await service.create({ name: body.name });
      return formatHttpResponse(201, newCountry, event);
    } catch (error) {
      return internalServerError(event);
    }
  }

  static async updateCountry(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const service = new CountryService();

      const id = parseInt(event.pathParameters?.id || '');
      const body: UpdateCountryDTO = JSON.parse(event.body || '{}');

      if (isNaN(id) || !body.name) return badRequest(event, 'Invalid data');

      const updatedCountry = await service.update(id, { name: body.name });
      return formatHttpResponse(200, updatedCountry, event);
    } catch (error) {
      return internalServerError(event);
    }
  }

  static async deleteCountry(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const service = new CountryService();

      const id = parseInt(event.pathParameters?.id || '');
      if (isNaN(id)) return badRequest(event, 'Invalid ID');

      await service.delete(id);
      return formatHttpResponse(204, {}, event);
    } catch (error) {
      return internalServerError(event);
    }
  }
}
