import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === "ADMINISTRATIVO"
    const isAtendente = token?.role === "ATENDENTE"

    // Rotas que apenas administradores podem acessar
    if (req.nextUrl.pathname.startsWith("/relatorios")) {
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }

    // Rotas que apenas administradores podem acessar
    if (req.nextUrl.pathname.startsWith("/funcionarios")) {
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }

    // Rotas que apenas administradores podem acessar
    if (req.nextUrl.pathname.startsWith("/veiculos")) {
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    "/vendas/:path*",
    "/despesas/:path*",
    "/fiados/:path*",
    "/lucros/:path*",
    "/estoque/:path*",
    "/funcionarios/:path*",
    "/veiculos/:path*",
    "/relatorios/:path*",
  ]
}
