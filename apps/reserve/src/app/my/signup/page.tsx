import { SignupForm } from "./_components/signup-form";

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-2xl font-semibold text-foreground">
          회원가입
        </h1>
        <SignupForm />
      </div>
    </div>
  );
}
