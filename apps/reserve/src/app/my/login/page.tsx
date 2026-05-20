import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-2xl font-semibold text-foreground">
          로그인
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
