import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | undefined;

export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    try {
      prisma = new PrismaClient({
        log: ['query', 'error', 'warn'],
        errorFormat: 'minimal',
      });
    } catch (error) {
      console.error('Error initializing Prisma:', error);
      throw error;
    }
  }
  return prisma;
}
