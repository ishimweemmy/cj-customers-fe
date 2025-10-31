import type { z } from 'zod'
import type { TUser } from '@/types/auth.type'
import type { formSchema } from './schema'

export type VerifyDto = z.infer<typeof formSchema> & { email: string }

export type VerifyResponseDto = TUser
