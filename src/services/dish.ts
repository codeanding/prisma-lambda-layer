import { getPrismaClient } from './prisma';

export class DishService {
  async findAll() {
    return getPrismaClient().dish.findMany({ include: { country: true, ingredients: true } });
  }

  async findById(id: number) {
    return getPrismaClient().dish.findUnique({
      where: { id },
      include: { country: true, ingredients: true },
    });
  }

  async create(name: string, description: string, countryId: number, ingredientIds: number[]) {
    return getPrismaClient().dish.create({
      data: {
        name,
        description,
        country: { connect: { id: countryId } },
        ingredients: {
          connect: ingredientIds.map((id) => ({ id })),
        },
      },
      include: { country: true, ingredients: true },
    });
  }

  async update(id: number, name: string, description: string) {
    return getPrismaClient().dish.update({
      where: { id },
      data: { name, description },
      include: { country: true, ingredients: true },
    });
  }

  async delete(id: number) {
    return getPrismaClient().dish.delete({ where: { id } });
  }
}
