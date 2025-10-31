import type { AxiosError, AxiosResponse } from 'axios'
import type { EKYCStatus, EUserRole, EUserStatus } from '@/enums/auth.enum'

export type ApiHandlerCallBack<T> = () => Promise<T> | T

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiHandlerErrorResponseDto<T = any, D = any> {
  is400: boolean
  is401: boolean
  is403: boolean
  is404: boolean
  is500: boolean
  isError: boolean
  response?: AxiosResponse<T, D>
  /** axios error object */
  meta: AxiosError<T, D> // axios error is passed, just in case you need it
}

export type TUser = {
  id: string
  updatedAt: string
  createdAt: string
  deletedAt: string
  lastLogin: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  status: EUserStatus
  role: EUserRole
  customerId: string
  kycStatus: EKYCStatus
  kycVerifiedAt: string
  creditScore: number
}
