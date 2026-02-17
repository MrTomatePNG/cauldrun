import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    // No mundo real, aqui você faria uma chamada ao banco de dados ou API
    // Exemplo: const posts = await db.post.findMany({ take: 20 });

    const initialPosts = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        text: `Post inicial vindo do Servidor (SSR) número ${i + 1}`,
    }));

    return {
        posts: initialPosts
    };
};
