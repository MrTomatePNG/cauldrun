# 9. Guia de Estilização com SCSS (Sass)

Este documento é o guia de referência para a estilização do projeto "Cauldron" usando SCSS. Ele serve como uma introdução às suas principais funcionalidades e como um guia de boas práticas, com foco na sintaxe moderna e na integração com o Svelte.

*   **[Documentação Oficial do Sass](https://sass-lang.com/documentation/)** (a fonte definitiva para consulta)

---

### 1. O que é SCSS e por que usá-lo?

SCSS (Sassy CSS) é um pré-processador de CSS. Isso significa que escrevemos em uma linguagem com "superpoderes" (SCSS) e ela é compilada para CSS normal, que o browser entende.

Optamos por SCSS porque ele atinge um equilíbrio ideal:
*   **Organização:** Permite quebrar nosso estilo em múltiplos arquivos gerenciáveis.
*   **Poder:** Adiciona funcionalidades como variáveis, aninhamento e lógica, que não existem no CSS puro.
*   **Liberdade:** Não nos prende a um framework de estilo (como Bootstrap ou Tailwind), nos dando total controle sobre o design.

### 2. Integração com SvelteKit

A integração é praticamente automática:
1.  **Instalação:** `npm install -D sass`
2.  **Uso:** Em qualquer componente Svelte, basta adicionar o atributo `lang="scss"` à tag de estilo.

```svelte
<style lang="scss">
  // Seu código SCSS aqui...
  // Ele será automaticamente escopado para este componente!
</style>
```

---

### 3. Funcionalidades Essenciais (A Maneira Moderna)

O ecossistema Sass evoluiu. As práticas abaixo são as recomendadas atualmente.

#### **O Sistema de Módulos: `@use` (A Prática Correta)**

> **AVISO DE DEPRECIAÇÃO IMPORTANTE**
> A diretiva `@import` está sendo oficialmente descontinuada. Embora ainda funcione por razões de retrocompatibilidade, ela polui o escopo global e torna difícil rastrear de onde os estilos vêm. **Nós devemos usar exclusivamente `@use` neste projeto.**

`@use` carrega um arquivo Sass como um "módulo", e todas as suas variáveis, mixins e funções são acessadas através de um **namespace**.

**Exemplo:**

Temos um arquivo com nossas variáveis de design:
```scss
// src/styles/_variables.scss
$cor-primaria: #3b82f6;
$tamanho-fonte-base: 16px;
```

Para usá-lo em um componente:
```scss
// MeuComponente.svelte
<style lang="scss">
  @use '../styles/variables'; // O namespace padrão é o nome do arquivo

  .meu-titulo {
    color: variables.$cor-primaria; // Acessando via namespace
    font-size: variables.$tamanho-fonte-base * 1.5;
  }
</style>
```
*   **Benefício:** Fica explícito de onde `$cor-primaria` está vindo. Chega de "variáveis mágicas" globais.
*   **[Leia mais sobre o Sistema de Módulos do Sass](https://sass-lang.com/documentation/at-rules/use)**

#### **Variáveis**

São usadas para armazenar valores que você reutiliza, como cores, fontes ou espaçamentos. Sempre defina-as em um arquivo parcial (ex: `_variables.scss`) e carregue-o com `@use`.

#### **Nesting (Aninhamento)**

Permite escrever seletores CSS de uma forma que espelha a hierarquia do seu HTML, tornando o código mais legível e evitando repetição.

```scss
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: inline-block;
  }

  a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;

    // O '&' se refere ao seletor pai ('a', neste caso)
    &:hover {
      background-color: #f5f5f5;
    }
  }
}
```

#### **Mixins (`@mixin` e `@include`)**

São blocos de código reutilizáveis, como funções para estilos.

**Exemplo:** Um mixin para centralizar conteúdo com flexbox.
```scss
// src/styles/_mixins.scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```
**Uso:**
```scss
@use '../styles/mixins';

.meu-container {
  @include mixins.flex-center;
  height: 100vh;
}
```

#### **Módulos Nativos (Built-in Modules)**

Sass vem com módulos poderosos para manipulação de dados. Você sempre deve usá-los com `@use`. Os mais importantes são `sass:math` e `sass:color`.

> **AVISO DE DEPRECIAÇÃO IMPORTANTE**
> O uso do operador `/` para divisão está obsoleto. Ele causa ambiguidade com a nova sintaxe do CSS. **Sempre use a função `math.div()` do módulo `sass:math`**.

**Exemplo com `sass:math`:**
```scss
@use 'sass:math';

.meu-elemento {
  // CORRETO:
  font-size: math.div(20px, 16px) * 1rem; // resultado: 1.25rem

  // ERRADO (obsoleto):
  // font-size: (20px / 16px) * 1rem;
}
```

**Exemplo com `sass:color`:**
```scss
@use 'sass:color';
@use '../styles/variables';

.meu-botao-transparente {
  // Pega a cor primária e a deixa com 50% de opacidade
  background-color: color.adjust(variables.$cor-primaria, $alpha: -0.5);
}
```
*   **[Leia mais sobre os Módulos Nativos](https://sass-lang.com/documentation/modules)**

---

### 4. Estrutura Proposta para o "Cauldron"

Para manter a organização, podemos seguir esta estrutura de pastas:

```
src/
└── styles/
    ├── _variables.scss   // Cores, fontes, z-index, breakpoints
    ├── _mixins.scss      // Mixins reutilizáveis (flexbox, media queries, etc.)
    └── global.scss       // Arquivo principal que importa os outros e define estilos globais
```
O arquivo `global.scss` seria assim:
```scss
// src/styles/global.scss
@use 'variables';
@use 'mixins';

// Reset básico ou estilos globais para body, html, etc.
body {
  font-family: sans-serif;
  color: variables.$cor-texto;
}
```
Para aplicar esses estilos globais, importe o `global.scss` uma única vez no seu componente de layout principal (`src/routes/+layout.svelte`):
```svelte
// src/routes/+layout.svelte
<script>
  import '../styles/global.scss';
</script>

<slot />
```

Para todos os outros componentes, escreva os estilos diretamente dentro da tag `<style lang="scss">`, usando `@use` para acessar as variáveis e mixins globais conforme necessário. Isso nos dá o equilíbrio perfeito entre um sistema de design consistente e estilos de componentes seguros e com escopo definido.
