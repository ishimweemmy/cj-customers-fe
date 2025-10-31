import { api } from '@/plugins/axios'
import { handleApiCall } from '@/lib/utils'
import type { CreditAccountResponseDto } from './index.dto'

export const getCreditAccount = async () => {
  return handleApiCall(async () => {
    const response = await api.get<CreditAccountResponseDto>('/credit/account')
    return response.data
  })
}
