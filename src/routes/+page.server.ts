import prisma from "@/lib/prisma";
import { redirect, fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	// Carregar todos os posts aprovados
	const posts = await prisma.post.findMany({
		where: {
			status: "completed",
		},
		include: {
			user: {
				select: {
					username: true,
					image: true,
				},
			},
			_count: {
				select: { likes: true },
			},
			// Carregar likes apenas se o usuário estiver logado
			...(locals.user ? {
				likes: {
					where: {
						userId: locals.user.id,
					},
				}
			} : {})
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	// Mapear posts com status de like (seguro para anônimos)
	const sanitizedPosts = posts.map((post) => ({
		...post,
		id: post.id.toString(),
		likesCount: post._count.likes,
		isLiked: locals.user ? post.likes.length > 0 : false,
	}));

	return {
		posts: sanitizedPosts,
		user: locals.user // Passamos o user (pode ser null)
	};
};

export const actions: Actions = {
	like: async ({ locals, request }) => {
		// Se não estiver logado, redireciona para o login ao tentar curtir
		if (!locals.user) {
			throw redirect(302, "/login");
		}

		const data = await request.formData();
		const postId = data.get("postId")?.toString();

		if (!postId) return fail(400, { message: "ID do post não fornecido." });

		try {
			const id = BigInt(postId);
			const userId = locals.user.id;

			const post = await prisma.post.findUnique({
				where: { id },
				select: { id: true },
			});

			if (!post) return fail(404, { message: "Post não encontrado." });

			const existingLike = await prisma.like.findUnique({
				where: {
					userId_postId: { userId, postId: id },
				},
			});

			if (existingLike) {
				await prisma.like.delete({
					where: { userId_postId: { userId, postId: id } },
				});
			} else {
				await prisma.like.create({
					data: { userId, postId: id },
				});
			}

			return { success: true };
		} catch (err) {
			locals.logger.error({ err, postId }, "Erro na action de Like");
			return fail(500, { message: "Falha ao processar interação." });
		}
	},
};
