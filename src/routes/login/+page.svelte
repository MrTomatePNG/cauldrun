<script lang="ts">
    import { authClient } from "$lib/auth-client";

    let email = $state("");
    let password = $state("");
    let name = $state("");
    let username = $state("");
    let isLogin = $state(true);
    let isLoading = $state(false);
    let error = $state("");

    const handleSignup = async (event: Event) => {
        event.preventDefault(); // Previne o submit do formulário HTML
        isLoading = true;
        error = "";

        const { data, error: signupError } = await authClient.signUp.email({
            email,
            password,
            name,
            callbackURL: "/",
        });

        if (signupError) {
            error = signupError.message
                ? signupError.message
                : "signup error but no message :?";
        }
        isLoading = false;
    };

    const handleLogin = async (event: Event) => {
        event.preventDefault(); // Previne o submit do formulário HTML
        isLoading = true;
        error = "";

        const { data, error: loginError } = await authClient.signIn.email({
            email,
            password,
            callbackURL: "/",
        });

        if (loginError) {
            error = loginError.message
                ? loginError.message
                : "error but no message :?";
        }
        isLoading = false;
    };
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
                    required
                />
            </div>
            <div class="form-group">
                <label for="password">Senha</label>
                <input
                    type="password"
                    name="password"
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
                <input type="text" name="name" bind:value={name} required />
            </div>
            <div class="form-group">
                <label for="username">Usuário</label>
                <input
                    type="text"
                    name="username"
                    bind:value={username}
                    required
                />
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    bind:value={email}
                    required
                />
            </div>
            <div class="form-group">
                <label for="password">Senha</label>
                <input
                    type="password"
                    name="password"
                    bind:value={password}
                    required
                />
            </div>
            <button type="submit" disabled={isLoading} class="submit-button">
                {isLoading ? "Criando..." : "Criar conta"}
            </button>
        </form>
    {/if}

    <button
        onclick={() => {
            isLogin = !isLogin;
            error = ""; // Clear error when switching forms
            email = ""; // Clear fields when switching
            password = "";
            name = "";
            username = "";
        }}
        class="toggle-button"
    >
        {isLogin
            ? "Não tem uma conta? Crie agora!"
            : "Já tem uma conta? Faça login!"}
    </button>
</div>

<style>
    :global(body) {
        font-family: "Inter", sans-serif; /* You might need to import a font */
        background-color: #f0f2f5;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        margin: 0;
        color: #333;
    }

    .auth-container {
        background-color: #ffffff;
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
        text-align: center;
        box-sizing: border-box;
    }

    .auth-title {
        font-size: 2.2em;
        margin-bottom: 30px;
        color: #1a1a2e;
        font-weight: 700;
    }

    .error-message {
        background-color: #ffebee;
        color: #d32f2f;
        border: 1px solid #ef9a9a;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 25px;
        font-size: 0.95em;
        font-weight: 500;
    }

    .auth-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-bottom: 25px;
    }

    .form-group {
        text-align: left;
    }

    .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: #4a4a68;
        font-size: 0.95em;
    }

    .form-group input[type="email"],
    .form-group input[type="password"],
    .form-group input[type="text"] {
        width: 100%;
        padding: 14px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        font-size: 1em;
        color: #333;
        box-sizing: border-box;
        transition:
            border-color 0.3s ease,
            box-shadow 0.3s ease;
    }

    .form-group input[type="email"]:focus,
    .form-group input[type="password"]:focus,
    .form-group input[type="text"]:focus {
        border-color: #007bff;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
        outline: none;
    }

    .submit-button {
        background-color: #007bff;
        color: white;
        padding: 15px 25px;
        border: none;
        border-radius: 8px;
        font-size: 1.1em;
        font-weight: 600;
        cursor: pointer;
        transition:
            background-color 0.3s ease,
            transform 0.2s ease;
        margin-top: 10px;
    }

    .submit-button:hover:not(:disabled) {
        background-color: #0056b3;
        transform: translateY(-2px);
    }

    .submit-button:disabled {
        background-color: #a0c4ff;
        cursor: not-allowed;
        opacity: 0.8;
    }

    .toggle-button {
        background: none;
        color: #007bff;
        border: none;
        padding: 10px;
        font-size: 1em;
        cursor: pointer;
        transition:
            color 0.3s ease,
            text-decoration 0.3s ease;
        margin-top: 15px;
    }

    .toggle-button:hover {
        color: #0056b3;
        text-decoration: underline;
    }
</style>
