import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // 1. Cria a resposta inicial
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. Configura o cliente Supabase para o Middleware
  // Isso é essencial para ler/gravar cookies de sessão no Edge
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 3. Verifica o usuário (refresh token acontece aqui se necessário)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- REGRAS DE ROTEAMENTO ---

  const path = request.nextUrl.pathname;

  // A. Proteção do Dashboard e outras rotas privadas
  // Se tentar acessar /dashboard, /workspaces, /transactions, /settings SEM estar logado -> Login
  if (
    !user &&
    (path.startsWith("/dashboard") ||
     path.startsWith("/workspaces") ||
     path.startsWith("/transactions") ||
     path.startsWith("/settings"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // B. Redirecionamento de Usuário Logado
  // Se já estiver logado e tentar acessar /login ou cadastro -> Dashboard
  if (user && (path === "/login" || path === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // C. A Raiz (/) é pública (Landing Page), então não fazemos nada.
  // Se o usuário estiver logado e for para /, ele verá a Landing Page.
  // Se quiser que ele vá direto pro Dashboard ao entrar na raiz, descomente abaixo:
  /*
  if (user && path === '/') {
     return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  */

  return response;
}

export const config = {
  matcher: [
    /*
     * Corresponde a todos os caminhos de solicitação, exceto:
     * - _next/static (arquivos estáticos)
     * - _next/image (arquivos de otimização de imagem)
     * - favicon.ico (ícone de favoritos)
     * - imagens (svg, png, jpg, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};