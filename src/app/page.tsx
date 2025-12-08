import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

import { Button } from "@/components/ui/button"

import { Wallet, BarChart3, ShieldCheck, Users, ArrowRight } from "lucide-react"

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If logged, send directly to Dashboard
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* HEADER */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-xl tracking-tighter">
            <Wallet className="h-6 w-6" />
            FinTrack
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link href="/login?tab=register">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6">
                Criar Conta
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] -z-10" />
          
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Controle financeiro inteligente para você e sua família.
            </h1>
            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              Gerencie múltiplas carteiras, acompanhe gastos em tempo real e compartilhe o acesso com quem importa. Simples, rápido e seguro.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login?tab=register">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-8 text-lg rounded-full w-full sm:w-auto">
                  Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#recursos">
                <Button variant="outline" size="lg" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white h-12 px-8 text-lg rounded-full w-full sm:w-auto bg-transparent">
                  Saiba Mais
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="recursos" className="py-24 bg-zinc-900/50 border-y border-zinc-800">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 transition-colors">
                <div className="h-12 w-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Dashboards Claros</h3>
                <p className="text-zinc-400">Visualize para onde seu dinheiro está indo com gráficos intuitivos e relatórios mensais.</p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 transition-colors">
                <div className="h-12 w-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Carteiras Compartilhadas</h3>
                <p className="text-zinc-400">Crie carteiras para a casa, viagens ou projetos e convide membros para gerenciar juntos.</p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 transition-colors">
                <div className="h-12 w-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Segurança Total</h3>
                <p className="text-zinc-400">Seus dados são protegidos com as melhores práticas de segurança e privacidade.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-24 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">Pronto para assumir o controle?</h2>
            <Link href="/login?tab=register">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-10 text-lg rounded-full">
                Criar Conta Gratuita
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-8 border-t border-zinc-800 text-center text-zinc-500 text-sm">
        <p>&copy; 2025 FinTrack. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}