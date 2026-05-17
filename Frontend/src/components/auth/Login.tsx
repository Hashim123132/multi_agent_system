import AuthCard from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, EyeOff } from "lucide-react";
import { GoogleLogo } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) alert(error.message);
    else alert("Logged in successfully");
  }

  async function handleGoogleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  }

  return (
    <AuthCard>
      <form onSubmit={handleLogin} className="mt-12 space-y-5">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Log in</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password to securely access your account.
          </p>
        </div>

        <div className="relative">
          <Mail className="absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
          <Input
            className="h-12 rounded-full pl-11"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
          <Input
            className="h-12 rounded-full px-11"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <EyeOff className="absolute right-4 top-4 h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
          <label className="flex items-center gap-2">
            <Checkbox />
            Remember me
          </label>

          <Link to="/forgot-password" className="hover:underline">Forgot Password</Link>
        </div>

        <Button className="h-12 w-full rounded-full bg-emerald-500 hover:bg-emerald-600 cursor-pointer">
          Login
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="h-12 w-full rounded-full cursor-pointer"
          onClick={handleGoogleSignIn}
        >
          <GoogleLogo weight="bold" />
          Continue with Google
        </Button>

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link className="font-semibold text-emerald-600 dark:text-emerald-500 hover:underline" to="/signup">
            Sign Up here
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}