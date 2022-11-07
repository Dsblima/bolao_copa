import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

import { authenticate } from '../plugins/authenticate';
export async function guessRoutes(fastify: FastifyInstance) {
  fastify.get('/guesses/count', async() => {
    const count = await prisma.guess.count()

    return {count: count}
  })

  fastify.post('/pools/:poolId/games/:gameId/guesses', {
    onRequest: [authenticate],
  }, async (request, reply) => {
    const createGuessParams = z.object({
      poolId: z.string(),
      gameId: z.string(),
    })
    
    const createGuessBody = z.object({
      firstTeamPoint: z.number(),
      secondTeamPoint: z.number(),
    })
    
    const { firstTeamPoint, secondTeamPoint } = createGuessBody.parse(request.body)
    const { poolId, gameId } = createGuessParams.parse(request.params)
    
    const participant = await prisma.participant.findUnique({
      where: {
        userId_poolId: {
          poolId,
          userId: request.user.sub
        }
      }
    })

    if (!participant) {
      return reply.status(400).send({
        message: "You're not allowed to create a guess inside this pool."
      })
    }

    const guess = await prisma.guess.findUnique({
      where: {
        participantId_gameId: {
          participantId: participant.id,
          gameId: gameId
        }
      }
    })

    if (guess) {
      return reply.status(400).send({
        message: "You already sent a guess to this game"
      })
    }

    const game = await prisma.game.findUnique({
      where: {
        id: gameId,
      }
    })

    if (!game) {
      return reply.status(400).send({
        message: "Game not found"
      })
    }

    if (game.date < new Date()) {
      return reply.status(400).send({
        message: "You cannot send a guess the game date"
      })
    }

    await prisma.guess.create({
      data: {
        gameId,
        participantId: participant.id,
        firstTeamPoint,
        secondTeamPoint
      }
    })

    return reply.status(201).send()
  })
}