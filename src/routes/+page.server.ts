import prisma from "@/lib/prisma";
import { redirect, fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) redirect(302, "/login");

  // Carregar todos os posts que foram aprovados pela auditoria
  const posts = await prisma.post.findMany({
    where: { 
        status: "completed" 
    },
    include: {
        user: {
            select: {
                username: true,
                image: true
            }
        },
        _count: {
            select: { likes: true }
        },
        likes: {
            where: {
                userId: locals.user.id
            }
        }
    },
    orderBy: {
        createdAt: 'desc'
    }
  });

  // Mapear para facilitar o uso no frontend
  const postsWithLikeStatus = posts.map(post => ({
      ...post,
      likesCount: post._count.likes,
      isLiked: post.likes.length > 0
  }));

  return {
    posts: postsWithLikeStatus,
  };
};

export const actions: Actions = {
    like: async ({ locals, request }) => {
        if (!locals.user) redirect(302, "/login");

        const data = await request.formData();
        const postId = data.get("postId")?.toString();

        if (!postId) return fail(400, { message: "Post ID missing" });

        const userId = locals.user.id;
        const id = BigInt(postId);

        // Tentar encontrar o like
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId: id
                }
            }
        });

        if (existingLike) {
            // Se já existe, remove (Unlike)
            await prisma.like.delete({
                where: {
                    userId_postId: {
                        userId,
                        postId: id
                    }
                }
            });
        } else {
            // Se não existe, cria (Like)
            await prisma.like.create({
                data: {
                    userId,
                    postId: id
                }
            });
        }

        return { success: true };
    }
};
