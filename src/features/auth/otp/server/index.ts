import { api } from '@/plugins/axios'
import { handleApiCall } from '@/lib/utils'
import type { VerifyDto, VerifyResponseDto } from './index.dto'

export const sendVerificationCode = async (payload: VerifyDto) => {
  const apiResponse = handleApiCall(async () => {
    const response = await api.post<VerifyResponseDto>(
      '/customer/verify-email',
      { ...payload, otp: Number(payload.otp) }
    )
    return response.data
  })
  return apiResponse
}

export const resendVerificationCode = async (
  payload: Pick<VerifyDto, 'email'>
) => {
  const apiResponse = handleApiCall(async () => {
    const response = await api.post<VerifyResponseDto>(
      '/customer/resend-otp',
      payload
    )
    return response.data
  })
  return apiResponse
}
