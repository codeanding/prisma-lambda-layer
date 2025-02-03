import { getPrismaClient } from './prisma';

export class CountryService {
  async findAll() {
    return getPrismaClient().country.findMany();
  }

  async findById(id: number) {
    return getPrismaClient().country.findUnique({ where: { id } });
  }

  async create(data: { name: string }) {
    return getPrismaClient().country.create({ data });
  }

  async update(id: number, data: { name: string }) {
    return getPrismaClient().country.update({ where: { id }, data });
  }

  async delete(id: number) {
    return getPrismaClient().country.delete({ where: { id } });
  }
}
