import { PrismaClient } from '@prisma/client';

export let prisma = new PrismaClient();

export function connectDb(): void {
  console.log("connected on db");
}

export async function disconnectDB(): Promise<void> {
  await prisma.$disconnect();
}

