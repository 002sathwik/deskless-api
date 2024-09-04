import { FeeType } from "@prisma/client";
import { z } from "zod";

const addFeez = z.object({
    amount: z.number().multipleOf(0.01).optional(),
    description: z.string().optional(),
    url: z.string().optional(),
    type: z.nativeEnum(FeeType),
    isPublished: z.boolean().optional(),
})

const updateFeeZ = z.object({
    id: z.string(),
    amount: z.number().optional(),
    description: z.string().optional(),
    url: z.string().optional(),
    type: z.nativeEnum(FeeType).optional(),
    isPublished: z.boolean().optional(),
})

const deleteFeeZ = z.object({
    id: z.string(),
})

const toggleStateZ = z.object({
    id: z.string(),
    isPublished: z.boolean().optional(),
})

export {
    addFeez,
    updateFeeZ,
    deleteFeeZ,
    toggleStateZ
}