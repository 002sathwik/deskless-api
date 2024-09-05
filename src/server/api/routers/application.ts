import { addApplicationZ,  setApplicationState, updateApplicationZ } from "~/zod/applicationZ";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from '@trpc/server';

const applicationRouter = createTRPCRouter({
    addcertificate: protectedProcedure.input(addApplicationZ).mutation(async ({ ctx, input }) => {
        await ctx.db.application.create({
            data: {
                name: ctx.session.user.name,
                usn: ctx.session.user.usn,
                branch: input.branch,
                sem: input.sem,
                purpose: input.purpose,
                status: "SENT",
                Certificate: {
                    connect: {
                        id: input.certificateId
                    }
                },
                User: {
                    connect: {
                        id: ctx.session.user.id
                    }
                }
            }
        })
    }),
    updatecertificate: protectedProcedure.input(updateApplicationZ).mutation(async ({ ctx, input }) => {
        const ifPending = await ctx.db.application.findUnique({
            where: {
                id: input.id
            }
        })
        if (ifPending) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Application On the way! cant be updated"
            })
        } else {
            await ctx.db.application.update({
                where: {
                    id: input.id
                },
                data: {
                    name: ctx.session.user.name,
                    usn: ctx.session.user.usn,
                    branch: input.branch,
                    sem: input.sem,
                    purpose: input.purpose,
                    status: "SENT",
                    Certificate: {
                        connect: {
                            id: input.certificateId
                        }
                    },
                    User: {
                        connect: {
                            id: ctx.session.user.id
                        }
                    }
                }
            })
        }
    }),
    getcertificateForAdmin: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.application.findMany({
            include: {
                Certificate: true,
                User: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })
    }),
    getcertificateForUser: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.application.findMany({
            where: {
                userId: ctx.session.user.id
            },
            include: {
                Certificate: true,
                User: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })
    }),
    setApplicationStates: protectedProcedure.input(setApplicationState).mutation(async ({ ctx, input }) => {
        await ctx.db.application.update({
            where: {
                id: input.id,
            },
            data: {
                status: input.status
            }
        })
    })
})

export default applicationRouter