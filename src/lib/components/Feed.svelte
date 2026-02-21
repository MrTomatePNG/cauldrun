<script lang="ts">
    import { Spring } from "svelte/motion";
    import { fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import type { Snippet } from "svelte";

    let { items, children }: { items: any[]; children: Snippet<[any]> } = $props();

    let currentIndex = $state(0);
    let dragging = $state(false);
    let direction = $state(1); // 1 para baixo, -1 para cima
    
    // Mola para o efeito de "esticar" ao arrastar
    const offset = new Spring(0, { stiffness: 0.15, damping: 0.8 });

    let startY = 0;
    let wheelTimeout = false;

    const changePost = (dir: number) => {
        const nextIndex = currentIndex + dir;
        if (nextIndex >= 0 && nextIndex < items.length) {
            direction = dir;
            currentIndex = nextIndex;
        }
    };

    // --- EVENTOS ---
    
    // Teclado (Setas)
    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowDown") changePost(1);
        if (e.key === "ArrowUp") changePost(-1);
    };

    // Scroll do Mouse (Roda)
    const onWheel = (e: WheelEvent) => {
        if (wheelTimeout) return;
        if (Math.abs(e.deltaY) > 30) {
            changePost(e.deltaY > 0 ? 1 : -1);
            wheelTimeout = true;
            setTimeout(() => (wheelTimeout = false), 600); // Debounce para não pular posts
        }
    };

    // Toque e Arraste
    const onStart = (y: number) => {
        startY = y;
        dragging = true;
    };

    const onMove = (y: number) => {
        if (!dragging) return;
        offset.target = y - startY;
    };

    const onEnd = (y: number) => {
        if (!dragging) return;
        dragging = false;
        const delta = y - startY;
        if (Math.abs(delta) > 100) changePost(delta < 0 ? 1 : -1);
        offset.target = 0;
    };
</script>

<svelte:window onkeydown={onKeyDown} />

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
    class="feed-container"
    role="region"
    aria-label="Feed de mídia"
    onwheel={onWheel}
    ontouchstart={(e) => onStart(e.touches[0].clientY)}
    ontouchmove={(e) => onMove(e.touches[0].clientY)}
    ontouchend={(e) => onEnd(e.changedTouches[0].clientY)}
    onmousedown={(e) => onStart(e.clientY)}
    onmousemove={(e) => onMove(e.clientY)}
    onmouseup={(e) => onEnd(e.clientY)}
    onmouseleave={() => dragging && onEnd(startY)}
>
    {#if items.length > 0}
        {#key currentIndex}
            <div
                class="post-wrapper"
                style="transform: translateY({offset.current}px)"
                in:fly={{ y: direction * 500, duration: 400, easing: cubicOut }}
                out:fly={{ y: direction * -500, duration: 400, easing: cubicOut }}
            >
                {@render children(items[currentIndex])}
            </div>
        {/key}

        <div class="indicators">
            {#each items as _, i}
                <div class="dot" class:active={i === currentIndex}></div>
            {/each}
        </div>
    {/if}
</div>

<style lang="scss">
    .feed-container {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        background: #000;
        cursor: grab;
        touch-action: none;
        outline: none; // Remove a borda de foco do tabindex

        &:active { cursor: grabbing; }
    }

    .post-wrapper {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        will-change: transform;
    }

    .indicators {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 20;
        pointer-events: none;

        .dot {
            width: 3px;
            height: 3px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

            &.active {
                background: var(--accent);
                transform: scale(2.5);
                height: 12px;
                border-radius: 2px;
            }
        }
    }
</style>
