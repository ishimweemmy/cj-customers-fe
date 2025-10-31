import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ApiHandlerErrorResponseDto } from '@/types/auth.type'
import type {
  LoanResponseDto,
  LoanRequestDto,
  RepayLoanDto,
  RepaymentResponseDto,
  RepaymentScheduleResponseDto,
} from './index.dto'
import {
  getLoans,
  getLoan,
  requestLoan,
  getRepaymentSchedule,
  repayLoan,
} from '.'

export const useGetLoans = () => {
  return useQuery<LoanResponseDto[], ApiHandlerErrorResponseDto>({
    queryKey: ['loans'],
    queryFn: getLoans,
  })
}

export const useGetLoan = (loanId: string) => {
  return useQuery<LoanResponseDto, ApiHandlerErrorResponseDto>({
    queryKey: ['loan', loanId],
    queryFn: () => getLoan(loanId),
    enabled: !!loanId,
  })
}

export const useGetRepaymentSchedule = (loanId: string) => {
  return useQuery<RepaymentScheduleResponseDto, ApiHandlerErrorResponseDto>({
    queryKey: ['repayment-schedule', loanId],
    queryFn: () => getRepaymentSchedule(loanId),
    enabled: !!loanId,
  })
}

export const useRequestLoan = () => {
  const queryClient = useQueryClient()

  return useMutation<
    LoanResponseDto,
    ApiHandlerErrorResponseDto,
    LoanRequestDto
  >({
    mutationFn: requestLoan,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['loans'] })
      queryClient.invalidateQueries({ queryKey: ['credit-account'] })

      if (data.approvalStatus === 'AUTO_APPROVED') {
        toast.success('Loan approved and disbursed successfully!')
      } else if (data.approvalStatus === 'REJECTED') {
        toast.error('Loan request was rejected')
      } else {
        toast.success('Loan request submitted for review')
      }
    },
    onError: (error) => {
      toast.error(error.meta?.message || 'Failed to request loan')
    },
  })
}

export const useRepayLoan = () => {
  const queryClient = useQueryClient()

  return useMutation<
    RepaymentResponseDto,
    ApiHandlerErrorResponseDto,
    RepayLoanDto
  >({
    mutationFn: repayLoan,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['loans'] })
      queryClient.invalidateQueries({ queryKey: ['loan', variables.loanId] })
      queryClient.invalidateQueries({ queryKey: ['repayment-schedule', variables.loanId] })
      queryClient.invalidateQueries({ queryKey: ['savings-accounts'] })
      queryClient.invalidateQueries({ queryKey: ['credit-account'] })
      queryClient.invalidateQueries({ queryKey: ['recent-transactions'] })
      toast.success('Repayment processed successfully')
    },
    onError: (error) => {
      toast.error(error.meta?.message || 'Repayment failed')
    },
  })
}
