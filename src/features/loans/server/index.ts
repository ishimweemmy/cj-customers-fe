import { api } from '@/plugins/axios'
import { handleApiCall } from '@/lib/utils'
import type {
  LoanResponseDto,
  LoanRequestDto,
  RepayLoanDto,
  RepaymentResponseDto,
  RepaymentScheduleResponseDto,
} from './index.dto'

export const getLoans = async () => {
  return handleApiCall(async () => {
    const response = await api.get<LoanResponseDto[]>('/loan/my-loans')
    return response.data
  })
}

export const getLoan = async (loanId: string) => {
  return handleApiCall(async () => {
    const response = await api.get<LoanResponseDto>(`/loan/${loanId}`)
    return response.data
  })
}

export const requestLoan = async (payload: LoanRequestDto) => {
  return handleApiCall(async () => {
    const response = await api.post<LoanResponseDto>('/loan/request', payload)
    return response.data
  })
}

export const getRepaymentSchedule = async (loanId: string) => {
  return handleApiCall(async () => {
    const response = await api.get<RepaymentScheduleResponseDto>(`/loan/${loanId}/schedule`)
    return response.data
  })
}

export const repayLoan = async (payload: RepayLoanDto) => {
  return handleApiCall(async () => {
    const response = await api.post<RepaymentResponseDto>('/loan/repay', payload)
    return response.data
  })
}
