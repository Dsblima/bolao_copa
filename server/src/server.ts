import Fastify from "fastify"
import jwt from "@fastify/jwt"
import cors from '@fastify/cors'

import { poolRoutes } from "./routes/pool"
import { guessRoutes } from "./routes/guess"
import { gameRoutes } from "./routes/game"
import { authRoutes } from "./routes/auth"
import { userRoutes } from "./routes/user"

async function boostrap() {
  const fastify = Fastify({
    logger: true,
  })

  await fastify.register(cors, {
    origin: true,
  })

  await fastify.register(jwt, {
    secret: 'testnlwcopa123*',
  })

  await fastify.register(authRoutes);
  await fastify.register(gameRoutes);
  await fastify.register(guessRoutes);
  await fastify.register(poolRoutes);
  await fastify.register(userRoutes);

  await fastify.listen({ port:3333, host: '0.0.0.0' })
}

boostrap()