import { ONBOARDING_SESSION_KEY } from '@/config/api.config'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { OtpForm } from './components/otp-form'
import { useResendOtp } from './server/use-send-otp'

export function Otp() {
  const { mutate: resendOtp, isPending } = useResendOtp()
  const userEmail = sessionStorage.getItem(ONBOARDING_SESSION_KEY) ?? ''

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-base tracking-tight'>
            Verify your email
          </CardTitle>
          <CardDescription>
            Please enter the authentication code. <br /> We have sent the
            authentication code to your email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OtpForm userEmail={userEmail} />
        </CardContent>
        <CardFooter>
          <p className='text-muted-foreground px-8 text-center text-sm'>
            Haven't received it?{' '}
            <span
              role='button'
              className={`hover:text-primary underline underline-offset-4 ${isPending ? 'opacity-50' : ''}`}
              onClick={() => resendOtp({ email: userEmail })}
            >
              Resend a new code.
            </span>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
