import { Suspense } from "react";
import LoginForm from "@/components/admin/auth/LoginForm";
import { Loader2 } from "lucide-react";

function LoginFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue from-[#f0f0ff] via-[#e8e8ff] to-[#f5f0ff]">
      <Loader2 size={32} className="animate-spin text-primary" />
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}