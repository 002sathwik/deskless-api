import { addFeeVerficationZ, updateVerficationState } from "~/zod/feeVerficationZ";
import { createTRPCRouter, protectedProcedure } from "../trpc";


const feeVerificationRouter = createTRPCRouter({
    addVerfication: protectedProcedure.input(addFeeVerficationZ).mutation(async ({ ctx, input }) => {
        await ctx.db.feeVerification.create({
            data: {
                utrNumber: input.utrNumber,
                bankName: input.bankName,
                branch: input.branch,
                holderName: input.holderName,
                amount: input.amount,
                dateOfPayment: input.dateOfPayment,
                status: input.status,
                User: {
                    connect: {
                        id: ctx.session.user.id,
                    },
                },
                Fee: {
                    connect: {
                        id: input.feeId,
                    }
                },
            },
        });
    }),

    getVerfications: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.feeVerification.findMany({
            where: {
                userId: ctx.session.user.id
            },
            include: {
                Fee: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })
    }),
    getVerficationsForAccountant: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.feeVerification.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })
    }),
    updateFeeverficationState: protectedProcedure.input(updateVerficationState).mutation(async ({ ctx, input }) => {
        await ctx.db.feeVerification.update({
            where:{
                id:input.id
            },
            
        })
    })



})
export default feeVerificationRouter