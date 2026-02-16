# 10. Guia de Autenticação com Lucia Auth

Este documento é a referência central para o sistema de autenticação do "Cauldron", implementado com a biblioteca [Lucia Auth](https://lucia-auth.com/). Ele detalha o funcionamento, a implementação prática e as boas práticas que seguimos.

### 1. O que é a Lucia Auth?

Lucia Auth não é um serviço de "clique e configure". É uma biblioteca poderosa e de baixo nível que nos dá as ferramentas para construir nosso próprio sistema de autenticação baseado em **sessões e cookies**.

**Por que a escolhemos?**
*   **Controle Total:** Nós gerenciamos nossos próprios dados de usuário no nosso banco de dados.
*   **Segurança:** É projetada com segurança em primeiro lugar, evitando armadilhas comuns e usando padrões da indústria.
*   **Nativa para o SvelteKit:** A integração com a arquitetura do SvelteKit (Hooks, Actions, `event.locals`) é perfeita e elegante.

### 2. O Modelo Mental: Sessões e Cookies

O fluxo é um padrão web clássico, robusto e seguro.

**Ao Fazer Login:**
1.  O usuário envia um formulário (`/login`) com suas credenciais.
2.  Uma `Action` do SvelteKit no servidor recebe os dados.
3.  Nós validamos as credenciais contra o banco de dados.
4.  Se válidas, instruímos a Lucia a **criar uma sessão** para aquele usuário.
5.  A Lucia armazena essa sessão no banco e nos devolve um **cookie de sessão**.
6.  Nós enviamos esse cookie para o browser do usuário e o redirecionamos.

**Em Requisições Futuras:**
1.  O browser automaticamente anexa o cookie de sessão a cada requisição para o nosso site.
2.  Nosso `hooks.server.ts` (o "porteiro" do nosso app) intercepta a requisição.
3.  Ele pega o cookie e pede à Lucia para **validar a sessão**.
4.  A Lucia verifica no banco de dados se a sessão é válida e a qual usuário ela pertence.
5.  Se for válida, o `user` e a `session` são anexados ao `event.locals`, ficando disponíveis em toda a aplicação no lado do servidor.

### 3. Implementação Prática no "Cauldron"

Esta é a estrutura concreta da nossa implementação.

#### Passo 1: O Schema do Prisma (A Estrutura Correta)

Para uma integração padrão e segura, a Lucia requer modelos específicos que usam **IDs de string**. Este é o schema que devemos adotar:

```prisma
// datasource e generator ...

model User {
  id            String    @id @default(cuid()) // <-- ID como String (CUID)
  username      String    @unique
  email         String    @unique
  avatarUrl     String?
  bio           String?
  
  // Relações com Lucia
  sessions      Session[]
  keys          Key[]
  
  // Seus outros campos e relações
  posts         Post[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Session {
  id        String   @id
  expiresAt DateTime
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Key {
  id              String  @id
  hashedPassword  String?
  userId          String
  user            User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([id, userId])
}

// Seus outros modelos (Post, Tag, etc.) continuam aqui...
// Apenas ajuste Post.userId para ser do tipo String.
model Post {
  // ...
  userId String // <-- Ajustar para String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  // ...
}
```
> **Nota Importante:** Usar `String` para IDs (`cuid()` ou `uuid()`) é uma prática de segurança fundamental em aplicações web. IDs numéricos sequenciais podem ser previsíveis e expor dados sobre a sua base de usuários.

#### Passo 2: Configurando o "Singleton" da Auth

Criamos um arquivo central para inicializar a Lucia, que só pode ser importado no servidor.

`src/lib/server/auth.ts`:
```typescript
import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { dev } from "$app/environment";
import { prisma } from "$lib/server/prisma"; // Supondo que seu cliente Prisma está aqui

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// Usar cookies seguros em produção
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		// Define quais dados do usuário estarão disponíveis no objeto 'user'
		return {
			username: attributes.username,
			email: attributes.email,
			avatarUrl: attributes.avatarUrl
		};
	}
});

// Tipagem para o SvelteKit e Lucia
declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: {
			username: string;
			email: string;
			avatarUrl: string | null;
		};
	}
}
```

#### Passo 3: O "Porteiro" - `hooks.server.ts`

Este hook é o coração do sistema, validando a sessão em cada requisição.

`src/hooks.server.ts`:
```typescript
import { lucia } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);

	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}

	event.locals.user = user;
	event.locals.session = session;
	
	return resolve(event);
};
```

#### Passo 4: Protegendo Páginas

Para proteger uma página, basta verificar a existência de `event.locals.user` na função `load` e redirecionar se ele for nulo.

`src/routes/feed/+page.server.ts`:
```typescript
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		// Redireciona para a página de login se não houver usuário logado
		throw redirect(302, '/login');
	}

	// Carrega os dados do feed para o usuário logado
	// ...
};
```
Isso garante que apenas usuários autenticados possam acessar a página `/feed`.
