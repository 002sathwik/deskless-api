import { z } from "zod";


const addCertificateZ = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
})
const deleteCertificateZ = z.object({
    id: z.string()
})
const updateCertificateZ = z.object({
    id: z.string(),
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
})

export {
    addCertificateZ,
    deleteCertificateZ,
    updateCertificateZ
}