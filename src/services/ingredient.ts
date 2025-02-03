import { getPrismaClient } from './prisma';

export class IngredientService {
  async findAll() {
    return getPrismaClient().ingredient.findMany();
  }

  async findById(id: number) {
    return getPrismaClient().ingredient.findUnique({ where: { id } });
  }

  async create(name: string) {
    return getPrismaClient().ingredient.create({ data: { name } });
  }

  async update(id: number, name: string) {
    return getPrismaClient().ingredient.update({
      where: { id },
      data: { name },
    });
  }

  async delete(id: number) {
    return getPrismaClient().ingredient.delete({ where: { id } });
  }
}
