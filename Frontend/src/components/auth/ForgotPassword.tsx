import AuthCard from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/reset-password",
    });

    if (error) alert(error.message);
    else alert("Password reset email sent.");
  }

  return (
    <AuthCard>
      <form onSubmit={handleReset} className="mt-20 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Forgot Password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email address to receive a reset link.
          </p>
        </div>

        <div className="relative">
          <Mail className="absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
          <Input
            className="h-12 rounded-full pl-11"
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <Button className="h-12 w-full rounded-full bg-emerald-500 hover:bg-emerald-600">
          Continue
        </Button>
      </form>
    </AuthCard>
  );
}