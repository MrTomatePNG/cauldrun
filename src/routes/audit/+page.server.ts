import { error, redirect } from "@sveltejs/kit";
import prisma from "@/lib/prisma";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	// 1. Segurança: Apenas admins/auditores
	if (!locals.user || locals.user.role !== "admin") {
		throw redirect(302, "/");
	}

	// 2. Carregar posts pendentes (o mais antigo primeiro para a fila andar)
	const queue = await prisma.post.findMany({
		where: { status: "pending" },
		include: { user: true },
		orderBy: { createdAt: "asc" },
		take: 10,
	});

	return { queue };
};

export const actions: Actions = {
	moderate: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== "admin") throw error(403);

		const data = await request.formData();
		const postId = data.get("postId")?.toString();
		const action = data.get("action")?.toString(); // 'approve', 'reject', 'ban'

		if (!postId || !action) return { success: false };

		let newStatus: any = "pending";
		if (action === "approve") newStatus = "completed";
		if (action === "reject") newStatus = "rejected";
		if (action === "ban") newStatus = "banned";

		await prisma.post.update({
			where: { id: BigInt(postId) },
			data: { status: newStatus },
		});

		return { success: true };
	},
};
