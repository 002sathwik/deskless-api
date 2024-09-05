import { addCertificateZ, deleteCertificateZ, updateCertificateZ } from "~/zod/certificateZ";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";



const certificateRouter = createTRPCRouter({

    addCertificate: protectedProcedure.input(addCertificateZ).mutation(async ({ ctx, input }) => {
        const name = input.name

        const nameExists = await ctx.db.certificate.findFirst({
            where: {
                name
            }
        })
        if (nameExists) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Certificate Already Exists"
            })
        } else {
            await ctx.db.certificate.create({
                data: {
                    ...input
                }
            })
        }
    }),

    deleteCertificate: protectedProcedure.input(deleteCertificateZ).mutation(async ({ ctx, input }) => {
        await ctx.db.certificate.delete({
            where: {
                id: input.id
            }
        })
    }),

    updateCertificate: protectedProcedure.input(updateCertificateZ).mutation(async ({ ctx, input }) => {
        await ctx.db.certificate.update({
            where: {
                id: input.id
            },
            data: {
                ...input
            }
        })
    }),

    getCertificates: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.certificate.findMany()
    })
})

export default certificateRouter