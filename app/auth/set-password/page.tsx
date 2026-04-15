import { SetPasswordForm } from '@/components/auth/set-password-form'

export default function SetPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">
              Cannabis Ops
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Set your password</h1>
          <p className="text-sm text-muted-foreground">
            Choose a password to complete your account setup.
          </p>
        </div>

        <SetPasswordForm />
      </div>
    </div>
  )
}
