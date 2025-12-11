import type { Metadata } from "next"
import Image from "next/image"

import { LoginForm } from "@/features/auth/login-form"

export const metadata: Metadata = {
  title: "Sign in · Tonik Parking",
}

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="flex w-full max-w-sm flex-col gap-12">
        <div className="flex flex-col gap-8">
          <p className="text-sm text-content">Tonik Parking</p>
          <Image src="/tonik-logo.svg" alt="Tonik" width={48} height={48} />
          <h1 className="text-5xl tracking-[-0.04em]">Sign in</h1>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
