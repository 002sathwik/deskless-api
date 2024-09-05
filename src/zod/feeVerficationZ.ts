import { FeeVerificationStatus } from "@prisma/client";
import { z } from "zod";

const addFeeVerficationZ = z.object({
    utrNumber: z.string(),
    bankName: z.string(),
    branch: z.string(),
    holderName: z.string(),
    amount: z.number().multipleOf(0.01),
    dateOfPayment: z.date(),
    status: z.nativeEnum(FeeVerificationStatus),
    feeId: z.string()
})
const updateVerficationState = z.object({
    id: z.number(),
    status: z.nativeEnum(FeeVerificationStatus)
})
const getVerficationsForAccountantByState = z.object({
    status: z.nativeEnum(FeeVerificationStatus)
})
export {
    addFeeVerficationZ,
    updateVerficationState,
    getVerficationsForAccountantByState
}