import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient({});

if (process.env.node_env !== "production") globalForPrisma.prisma = prisma;

export default prisma;
