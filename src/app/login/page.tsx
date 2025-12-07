import { login, signup } from './actions'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { WalletCards, ArrowRight } from "lucide-react"

interface LoginPageProps {
  searchParams: Promise<{ message: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { message } = await searchParams

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 p-4 selection:bg-emerald-500/30 overflow-hidden relative">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[130px] opacity-40 pointer-events-none" />
      
      <div className="fixed top-1/3 left-1/3 w-[300px] h-[300px] bg-emerald-400/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8 space-y-3 text-center">
          <div className="p-3 bg-zinc-900/80 rounded-2xl border border-zinc-800 shadow-xl shadow-emerald-900/10 backdrop-blur-sm">
            <WalletCards className="w-8 h-8 text-emerald-500" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Bem-vindo ao FinTrack
            </h1>
            <p className="text-zinc-400 text-sm max-w-xs mx-auto">
              Controle suas finanças pessoais e familiares em um único lugar.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-zinc-900/60 border border-zinc-800/60 h-12 p-1 rounded-xl backdrop-blur-md">
            
            <TabsTrigger 
              value="login" 
              className="rounded-lg text-zinc-400 data-[state=active]:bg-zinc-800 data-[state=active]:text-white data-[state=active]:shadow-sm hover:text-zinc-200 transition-all duration-200"
            >
              Entrar
            </TabsTrigger>
            <TabsTrigger 
              value="register" 
              className="rounded-lg text-zinc-400 data-[state=active]:bg-zinc-800 data-[state=active]:text-white data-[state=active]:shadow-sm hover:text-zinc-200 transition-all duration-200"
            >
              Nova Conta
            </TabsTrigger>
          </TabsList>

          {/* TAB: LOGIN */}
          <TabsContent value="login">
            <Card className="border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl shadow-2xl ring-1 ring-white/5">
              <CardHeader>
                <CardTitle className="text-white">Acessar Conta</CardTitle>
                <CardDescription className="text-zinc-400">
                  Digite suas credenciais para continuar.
                </CardDescription>
              </CardHeader>
              <form>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-zinc-300">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="exemplo@fintrack.com" 
                      required 
                      className="bg-zinc-950/50 border-zinc-800 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 text-white placeholder:text-zinc-600 h-11 transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-zinc-300">Senha</Label>
                      <span className="text-xs text-emerald-500 hover:text-emerald-400 cursor-pointer hover:underline transition-colors">Esqueceu?</span>
                    </div>
                    <Input 
                      id="password" 
                      name="password" 
                      type="password" 
                      required 
                      className="bg-zinc-950/50 border-zinc-800 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 text-white h-11 transition-all" 
                    />
                  </div>
                  
                  {message && (
                    <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                      ⚠️ {message}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-2">
                  <Button 
                    formAction={login} 
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium h-11 shadow-lg shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Entrar <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* TAB: REGISTER */}
          <TabsContent value="register">
            <Card className="border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl shadow-2xl ring-1 ring-white/5">
              <CardHeader>
                <CardTitle className="text-white">Criar Conta</CardTitle>
                <CardDescription className="text-zinc-400">
                  Comece a organizar sua vida financeira hoje.
                </CardDescription>
              </CardHeader>
              <form>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-zinc-300">Nome Completo</Label>
                    <Input 
                      id="fullName" 
                      name="fullName" 
                      placeholder="Ex: Andre Bauzil" 
                      required 
                      className="bg-zinc-950/50 border-zinc-800 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 text-white placeholder:text-zinc-600 h-11 transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-register" className="text-zinc-300">Email</Label>
                    <Input 
                      id="email-register" 
                      name="email" 
                      type="email" 
                      placeholder="seu@melhoremail.com"
                      required 
                      className="bg-zinc-950/50 border-zinc-800 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 text-white placeholder:text-zinc-600 h-11 transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-register" className="text-zinc-300">Senha</Label>
                    <Input 
                      id="password-register" 
                      name="password" 
                      type="password" 
                      required 
                      className="bg-zinc-950/50 border-zinc-800 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 text-white h-11 transition-all" 
                    />
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button 
                    formAction={signup} 
                    className="w-full bg-zinc-100 hover:bg-white text-zinc-900 font-medium h-11 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Criar Conta Grátis
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="mt-8 text-center text-zinc-600 text-xs hover:text-zinc-500 transition-colors cursor-default">
          Protegido por criptografia de ponta a ponta. <br/>
          © {new Date().getFullYear()} FinTrack Inc.
        </p>
      </div>
    </div>
  )
}