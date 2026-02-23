"use client";

import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("./login-form"), { ssr: false });

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[28rem] flex-col items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
