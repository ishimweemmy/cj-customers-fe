import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import type { ApiHandlerErrorResponseDto } from '@/types/auth.type'
import { register } from '.'
import type { RegisterDto, RegisterResponseDto } from './index.dto'
import { ONBOARDING_SESSION_KEY } from '@/config/api.config'

export const useRegister = () => {
  const navigate = useNavigate()
  return useMutation<
    RegisterResponseDto,
    ApiHandlerErrorResponseDto,
    RegisterDto
  >({
    mutationFn: (payload) => register(payload),
    onSuccess: (data, _variables) => {
      sessionStorage.setItem(ONBOARDING_SESSION_KEY, data.email)
      navigate({ to: '/otp', replace: true })
    },
  })
}
