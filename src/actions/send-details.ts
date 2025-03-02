"use server";

import * as z from "zod"
import { DetailSchema } from "@/src/schemas"
import { db } from "@/src/lib/db";
import { Status } from "@prisma/client";
import { getMemberbyCodeForcesId } from "@/src/data/member";
import { getSecretTokenByToken } from "@/src/data/secret_token";



export const sendDetails = async (values: z.infer<typeof DetailSchema>, token: string | null) => {

    if (!token) {
        return { error: "Token not present regenerate the link using bot" }

    }


    const existingToken = await getSecretTokenByToken(token);

    if (!existingToken) {
        return { error: "Token doest not exist" }
    }

    const hasExpired = new Date(existingToken.expires) < new Date()

    if (hasExpired) {
        return { error: "Token has expired" }
    }


    const validatedFields = DetailSchema.safeParse(values)

    if (!validatedFields.success) {
        return {
            error: "Invalid Fields"
        }
    }

    const { email, name, codeForces, leetcode, resume, message, organization, phoneNumber, cgpa, yoe, yog, jobId } = validatedFields.data;

    if (existingToken.cfUserName != codeForces) {
        return { error: "Codeforces username must be same as in discord bot" }
    }

    const existingMember = await getMemberbyCodeForcesId(codeForces)

    if (existingMember) {

        const formsCount = await db.form.count({
            where: {
                formId: existingMember.id,
                status: Status.PENDING,
                formCreatedAt: {
                    gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                },
            },
        });

        if (formsCount >= 7) {
            return { error: "You have exceeded the form submission limit for the past one month." };
        }

        await db.form.create({
            data: {
                formId: existingMember.id,
                resume,
                message,
                organization,
                phoneNumber,
                cgpa,
                yoe,
                jobId,
                yog,
                status: Status.PENDING,
            },
        });
    } else {

        await db.member.create({
            data: {
                email, name, codeForces, leetcode,
                forms: {
                    create: {
                        resume, message, organization, phoneNumber, cgpa, yoe, jobId, yog, status: Status.PENDING
                    }
                }
            },
        });
    }

    await db.secretToken.delete({
        where: { id: existingToken.id }
    })

    return { success: "Details Submitted Successfully" }
}
