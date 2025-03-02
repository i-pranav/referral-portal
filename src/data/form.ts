import { currentUser } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { Status, UserRole } from "@prisma/client";

export const getFormbyId = async (id: string) => {
    try {
        const form = await db.form.findUnique({
            where: { id }
        });

        return form;
    } catch {
        return null;
    }
};

export const getFormsByMemberIdWithOrganization = async (formId: string) => {
    const user = await currentUser();

    try {
        if (!formId) return null;

        if (user?.role === UserRole.ADMIN || user?.role === UserRole.MOD) {

            const forms = await db.form.findMany({
                where: { formId },

            });
            return forms;
        }

        else if (user?.role === UserRole.REFERRER) {
            const forms = await db.form.findMany({
                where: {
                    formId: formId,
                    organization: user.organization,
                    status: Status.PENDING
                },

            });
            return forms;
        }

    } catch {
        return null;
    }
};
