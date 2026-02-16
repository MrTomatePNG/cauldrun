<script>
    let menuEsquerdoAberto = false;
    let menuDireitoAberto = false;

    const fecharModais = () => {
        menuEsquerdoAberto = false;
        menuDireitoAberto = false;
    };
</script>

<main class="app-container">
    <aside class="area-ranking">
        <div class="section">Ranking / Mais Comentados</div>
        <div class="section">Options / Support</div>
    </aside>

    <article class="area-main">
        <nav class="tabs">novidades / aleatorios / seguindo</nav>
        <div class="scroll-content">
            {#each Array(20) as _, i}
                <div class="item">Item {i + 1}</div>
            {/each}
        </div>
    </article>

    <aside class="area-notifications">
        <div class="section">Pesquisa/Notificaçoes</div>
    </aside>

    <aside class="area-chats">
        <div class="section">Chats / Grupos</div>
    </aside>
</main>

<style lang="scss">
    $gap: 8px;
    $bg-color: #1a1a1a;
    $section-bg: #2a2a2a;
    $text-color: #e0e0e0;
    $border-gray: #3a3a3a;

    .app-container {
        display: grid;
        height: 100vh;
        width: 100vw;
        padding: $gap;
        gap: $gap;
        overflow: hidden;
        background-color: $bg-color;
        box-sizing: border-box;

        grid-template-columns: 1fr 1.5fr 1fr;
        grid-template-rows: 1fr 13fr;
        grid-template-areas:
            "ranking   main   notif"
            "ranking   main   chats";
    }

    aside,
    article {
        background: $section-bg;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .area-ranking {
        grid-area: ranking;
    }

    .area-main {
        grid-area: main;
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
        position: relative;
    }

    .area-notifications {
        grid-area: notif;
    }

    .area-chats {
        grid-area: chats;
    }

    .section {
        padding: 20px;
        color: $text-color;
        font-size: 14px;
        border-bottom: 1px solid $border-gray;
        flex: 1;
        min-height: 0;
        overflow-y: auto;

        &:last-child {
            border-bottom: none;
        }
    }

    .tabs {
        padding: 16px 20px;
        color: $text-color;
        font-size: 14px;
        border-bottom: 1px solid $border-gray;
        background: $section-bg;
    }

    .scroll-content {
        flex: 1;
        overflow-y: auto;
        padding: 0;
    }

    .item {
        padding: 16px 20px;
        color: $text-color;
        font-size: 13px;
        border-bottom: 1px solid $border-gray;

        &:last-child {
            border-bottom: none;
        }
    }
</style>
