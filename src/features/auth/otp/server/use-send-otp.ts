import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import type { ApiHandlerErrorResponseDto } from '@/types/auth.type'
import { toast } from 'sonner'
import { resendVerificationCode, sendVerificationCode } from '.'
import type { VerifyDto, VerifyResponseDto } from './index.dto'

export const useSendEmailCode = () => {
  const navigate = useNavigate()

  return useMutation<VerifyResponseDto, ApiHandlerErrorResponseDto, VerifyDto>({
    mutationFn: (payload) => sendVerificationCode({ ...payload }),
    onSuccess: () => {
      toast.success('Verification successful. You can now login!')
      navigate({ to: '/sign-in', replace: true })
    },
  })
}

export const useResendOtp = () => {
  return useMutation<
    VerifyResponseDto,
    ApiHandlerErrorResponseDto,
    Pick<VerifyDto, 'email'>
  >({
    mutationFn: (payload) => resendVerificationCode({ ...payload }),
    onSuccess: () => {
      toast.success('Verification code sent. Check your email!')
    },
  })
}
