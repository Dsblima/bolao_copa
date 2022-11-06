import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prsima";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/users/count', async() => {
    const count = await prisma.user.count()

    return {count: count}
  })
}