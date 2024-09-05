import { addFeez, deleteFeeZ, toggleStateZ, updateFeeZ } from "~/zod/feeZ";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from '@trpc/server';


const feeRouter = createTRPCRouter({
    addFee: protectedProcedure.input(addFeez).mutation(async ({ ctx, input }) => {
        await ctx.db.fee.create({
            data: {
                type: input.type,
                amount: input.amount ?? 0,
                description: input.description,
                url: input.url,
                isPublished: input.isPublished
            }
        })
    }),
    updateFee: protectedProcedure.input(updateFeeZ).mutation(async ({ ctx, input }) => {
        const inLive = await ctx.db.fee.findFirst({
            where: {
                id: input.id
            }
        })
        if (inLive?.isPublished == true) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "This Message is Live! Bring It to Draft  and update"
            })
        } else {
            await ctx.db.fee.update({
                where: {
                    id: input.id
                },
                data: {
                    type: input.type,
                    amount: input.amount ?? 0,
                    description: input.description,
                    url: input.url,
                    isPublished: input.isPublished
                }
            })
        }
    }),
    delete: protectedProcedure.input(deleteFeeZ).mutation(async ({ ctx, input }) => {
        const inLive = await ctx.db.fee.findFirst({
            where: {
                id: input.id
            }
        })
        if (inLive?.isPublished == true) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "This Message is Live! It should Be Draft to delete"
            })
        } else {
            await ctx.db.fee.delete({
                where: {
                    id: input.id
                },

            })
        }
    }),
    toogleFeeState: protectedProcedure.input(toggleStateZ).mutation(async ({ ctx, input }) => {
        const state = await ctx.db.fee.findUnique({
            where: {
                id: input.id,
            }
        })
        await ctx.db.fee.update({
            where: {
                id: input.id
            },
            data: {
                isPublished: !state?.isPublished
            }
        })
    }),
    getPublishedFee: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.fee.findMany({
            where: {
                isPublished: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })
    }),
    getFee: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.fee.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })
    })
})

export default feeRouter