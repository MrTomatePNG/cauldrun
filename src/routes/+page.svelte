<script lang="ts">
    import Post from "@/components/Post.svelte";
    import type { PageData } from "./$types";

    // No Svelte 5, recebemos os dados do servidor (SSR) via $props()
    let {
        data,
    }: { data: PageData & { posts: { id: number; text: string }[] } } =
        $props();
    /**
     * Inicializamos o estado reativo com os posts vindos do servidor.
     * Usamos uma runa $state para que a lista possa crescer no cliente.
     */
    let posts = $state([...data.posts]);
    let isLoading = $state(false);

    /**
     * Função para carregar mais posts no lado do cliente.
     */
    async function loadMore() {
        if (isLoading) return;
        isLoading = true;

        // Simula uma chamada de API (no futuro seria um fetch para um endpoint de API)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const lastId = posts[posts.length - 1]?.id || 0;
        const newPosts = Array.from({ length: 20 }, (_, i) => ({
            id: lastId + i + 1,
            text: `Post carregado via scroll número ${lastId + i + 1}`,
        }));

        // Atualiza o estado de forma reativa
        posts = [...posts, ...newPosts];
        isLoading = false;
    }

    /**
     * Action para scroll infinito usando IntersectionObserver.
     */
    function infiniteScroll(node: HTMLElement) {
        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting) {
                    loadMore();
                }
            },
            {
                rootMargin: "200px",
            },
        );

        observer.observe(node);

        return {
            destroy() {
                observer.unobserve(node);
            },
        };
    }
</script>

<article class="area-main">
    <nav class="tabs">novidades / aleatorios / seguindo</nav>

    <div class="scroll-content">
        {#each posts as post (post.id)}
            <Post id={post.id} text={post.text} />
        {/each}

        <!-- Sentinela para disparar o carregamento de mais itens -->
        <div use:infiniteScroll class="sentinel">
            {#if isLoading}
                <div class="loading">Carregando mais posts...</div>
            {/if}
        </div>
    </div>
</article>

<style lang="scss">
    $section-bg: #2a2a2a;
    $text-color: #e0e0e0;
    $border-gray: #3a3a3a;
    $breakpoint-desktop: 768px;

    .area-main {
        grid-area: main;
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
        position: relative;
        background: $section-bg;

        @media (max-width: 767px) {
            height: 100vh;
        }
    }

    .tabs {
        padding: 16px 20px;
        color: $text-color;
        font-size: 14px;
        border-bottom: 1px solid $border-gray;
        background: $section-bg;
        z-index: 10;
    }

    .scroll-content {
        flex: 1;
        overflow-y: auto;
        padding: 0;
        display: flex;
        flex-direction: column;
    }

    .sentinel {
        padding: 20px;
        min-height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .loading {
        color: #888;
        font-size: 12px;
        font-style: italic;
        animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
        0% {
            opacity: 0.5;
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0.5;
        }
    }
</style>
