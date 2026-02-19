<script lang="ts">
    // Importações necessárias
    import { goto } from "$app/navigation";
    import { page } from "$app/stores"; // Embora não usado diretamente aqui, é comum em páginas de auth
    import { authClient } from "@/lib/auth-client"; // Assumindo que este é o seu cliente de autenticação

    // Variáveis de estado para os campos do formulário e controle de UI
    let email = $state("");
    let password = $state("");
    let name = $state("");
    // let username = $state(""); // Descomente se for usar username no cadastro
    let isLogin = $state(true); // Controla se está no modo Login ou Signup
    let isLoading = $state(false); // Indica se uma operação de autenticação está em andamento
    let error = $state(""); // Mensagem de erro a ser exibida

    // Função para lidar com o cadastro de usuário
    const handleSignup = async (event: Event) => {
        event.preventDefault(); // Previne o submit padrão do formulário HTML
        isLoading = true;
        error = ""; // Limpa erros anteriores

        // Chama a função de signup do authClient
        const { error: signupError } = await authClient.signUp.email({
            email,
            password,
            name, // Usa o nome coletado
            // username, // Use se descomentar a variável username
            callbackURL: "/", // URL para onde redirecionar após o sucesso
        });

        // Verifica se ocorreu um erro no signup
        if (signupError) {
            error = signupError.message
                ? signupError.message
                : "Ocorreu um erro ao criar a conta.";
        }
        isLoading = false; // Finaliza o estado de loading
    };

    // Função para lidar com o login de usuário
    const handleLogin = async (event: Event) => {
        event.preventDefault(); // Previne o submit padrão do formulário HTML
        isLoading = true;
        error = ""; // Limpa erros anteriores

        // Chama a função de login do authClient
        const { error: loginError } = await authClient.signIn.email({
            email,
            password,
            callbackURL: "/", // URL para onde redirecionar após o sucesso
        });

        // Verifica se ocorreu um erro no login
        if (loginError) {
            error = loginError.message
                ? loginError.message
                : "Ocorreu um erro ao fazer login.";
        }
        isLoading = false; // Finaliza o estado de loading
    };

    // Função para alternar entre Login e Signup
    function toggleForm() {
        isLogin = !isLogin; // Inverte o estado
        error = ""; // Limpa o erro ao trocar de formulário
        // Limpa os campos para evitar confusão (opcional, mas boa prática)
        email = "";
        password = "";
        name = "";
        // username = "";
    }
</script>

<div class="auth-container">
    <h1 class="auth-title">
        {isLogin ? "Bem-vindo de volta!" : "Crie sua conta"}
    </h1>

    {#if error}
        <div class="error-message">
            {error}
        </div>
    {/if}

    {#if isLogin}
        <form onsubmit={(e) => handleLogin(e)} class="auth-form">
            <div class="form-group">
                <label for="email">Email</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    bind:value={email}
                    placeholder="seu@email.com"
                    required
                />
            </div>
            <div class="form-group">
                <label for="password">Senha</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    bind:value={password}
                    required
                />
            </div>
            <button type="submit" disabled={isLoading} class="submit-button">
                {isLoading ? "Entrando..." : "Entrar"}
            </button>
        </form>
    {:else}
        <form onsubmit={(e) => handleSignup(e)} class="auth-form">
            <div class="form-group">
                <label for="name">Nome</label>
                <input
                    type="text"
                    name="name"
                    bind:value={name}
                    required
                    placeholder="Seu Nome Completo"
                />
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    bind:value={email}
                    placeholder="seu@email.com"
                    required
                />
            </div>
            <div class="form-group">
                <label for="password">Senha</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    bind:value={password}
                    required
                />
            </div>
            <button type="submit" disabled={isLoading} class="submit-button">
                {isLoading ? "Criando..." : "Criar conta"}
            </button>
        </form>
    {/if}

    <button onclick={toggleForm} class="toggle-button">
        {isLogin
            ? "Não tem uma conta? Crie agora!"
            : "Já tem uma conta? Faça login!"}
    </button>
</div>

<style lang="scss">
    /* --- Variáveis da nova paleta verde --- */
    /* Usaremos as variáveis CSS customizadas definidas em app.scss */
    /* Ex: --bg, --surface, --text, --text-muted, --accent */

    .auth-container {
        background-color: var(
            --surface
        ); /* Usa a cor de superfície para o card */
        padding: 40px;
        border-radius: 16px; /* Bordas mais arredondadas */
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); /* Sombra mais pronunciada */
        width: 100%;
        max-width: 450px;
        text-align: center;
        box-sizing: border-box;
        animation: slideInFromBottom 0.7s ease-out forwards; /* Animação de entrada */
    }

    .auth-title {
        font-size: 2.5em; /* Título maior */
        margin-bottom: 30px;
        color: var(--accent); /* Título com a cor de destaque verde */
        font-weight: 700;
        text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1); /* Sombra sutil no título */
    }

    .error-message {
        background-color: var(
            --accent-soft
        ); /* Usa uma cor suave de destaque para o fundo do erro */
        color: var(
            --accent
        ); /* O texto do erro também pode ser a cor de destaque */
        border: 1px solid var(--accent); /* Borda com a cor de destaque */
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 25px;
        font-size: 0.95em;
        font-weight: 500;
    }

    .auth-form {
        display: flex;
        flex-direction: column;
        gap: 25px; /* Espaçamento maior entre os campos */
        margin-bottom: 25px;
    }

    .form-group {
        text-align: left;
    }

    .form-group label {
        display: block;
        margin-bottom: 8px;
        font-size: 1.1em;
        color: var(--text-muted); /* Usa a cor de texto secundária */
        font-weight: 500;
    }

    .form-group input[type="email"],
    .form-group input[type="password"],
    .form-group input[type="text"] {
        width: 100%;
        padding: 15px; /* Padding maior */
        border: 1px solid var(--text-muted); /* Borda com cor de texto secundária */
        border-radius: 8px;
        background-color: var(
            --bg
        ); /* Fundo do input usa o fundo principal da página */
        color: var(--text); /* Texto do input usa a cor principal */
        font-size: 1em;
        box-sizing: border-box; /* Garante que padding não afete a largura total */
        transition:
            border-color 0.3s ease,
            box-shadow 0.3s ease;
    }

    .form-group input[type="email"]:focus,
    .form-group input[type="password"]:focus,
    .form-group input[type="text"]:focus {
        outline: none;
        border-color: var(--accent); /* Borda de foco com a cor de destaque */
        box-shadow: 0 0 0 3px rgba(var(--accent), 0.3); /* Sombra de foco com cor de destaque */
    }

    .submit-button {
        width: 100%;
        padding: 16px; /* Padding maior para o botão */
        background-color: var(--accent); /* Botão com a cor de destaque */
        color: var(--bg); /* Texto do botão contrastante com o fundo */
        border: none;
        border-radius: 8px;
        font-size: 1.2em;
        font-weight: 700;
        cursor: pointer;
        transition:
            background-color 0.3s ease,
            transform 0.2s ease;
        box-shadow: 0 5px 15px rgba(var(--accent), 0.3); /* Sombra mais pronunciada no botão */
    }

    .submit-button:hover:not(:disabled) {
        background-color: var(--accent-soft); /* Cor suave no hover */
        transform: translateY(-3px); /* Pequeno efeito de elevação no hover */
    }

    .submit-button:active {
        transform: translateY(0); /* Efeito de pressionar */
    }

    .submit-button:disabled {
        background-color: var(
            --accent-soft
        ); /* Cor suave quando desabilitado */
        cursor: not-allowed;
        opacity: 0.7;
        box-shadow: none; /* Remove a sombra quando desabilitado */
    }

    .toggle-button {
        background: none;
        color: var(
            --text-muted
        ); /* Texto do botão de alternância com cor secundária */
        border: none;
        padding: 12px; /* Padding maior */
        font-size: 1em;
        cursor: pointer;
        transition:
            color 0.3s ease,
            text-decoration 0.3s ease;
        margin-top: 15px;
    }

    .toggle-button:hover {
        color: var(--accent); /* Cor de destaque no hover */
        text-decoration: underline;
    }

    /* Animação de entrada para o container principal */
    @keyframes slideInFromBottom {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
