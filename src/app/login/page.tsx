// app/login.tsx
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const auth = getAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/") // Redirigir al dashboard
    } catch (err) {
      setError("Error de autenticación. Verifica tus credenciales.")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="flex flex-col space-y-4 p-6 bg-white rounded-md shadow-lg w-80">
        <h2 className="text-2xl font-bold text-center mb-4">Iniciar sesión</h2>
        
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <Button type="submit" className="mt-4">Iniciar sesión</Button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  )
}