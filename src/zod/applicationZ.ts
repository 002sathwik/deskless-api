import { ApplicationStatus } from "@prisma/client";
import { z } from "zod";

const addApplicationZ = z.object({
    branch: z.string(),
    sem: z.string(),
    purpose: z.string(),
    certificateId: z.string()
})
const updateApplicationZ = z.object({
    id: z.string(),
    branch: z.string().optional(),
    sem: z.string().optional(),
    purpose: z.string().optional(),
    certificateId: z.string().optional(),
})

const setApplicationState = z.object({
    id: z.string(),
    status: z.nativeEnum(ApplicationStatus)
})
const deleteApplication = z.object({
    id: z.string(),

})
export {
    addApplicationZ,
    setApplicationState,
    updateApplicationZ,
    deleteApplication
}