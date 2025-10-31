import { useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/shared/empty-state'
import { AccountInfo } from './account-info'
import { TierLimits } from './tier-limits'
import { AccountTransactions } from './account-transactions'
import { DepositDialog } from '../components/deposit-dialog'
import { WithdrawDialog } from '../components/withdraw-dialog'
import { useGetSavingsAccount } from '../server/use-savings'
import { ArrowLeft, Wallet, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react'
import type { SavingsAccount } from '@/types/financial.type'
import { EAccountStatus } from '@/enums/financial.enum'

export function SavingsAccountDetails() {
  const { accountId } = useParams({ from: '/_authenticated/savings/$accountId' })
  const navigate = useNavigate()
  const { data: account, isLoading } = useGetSavingsAccount(accountId)

  const [depositDialogOpen, setDepositDialogOpen] = useState(false)
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false)

  if (isLoading) {
    return (
      <>
        <Header>
          <TopNav links={[]} />
          <div className='ms-auto flex items-center space-x-4'>
            <Search />
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <div className='space-y-6'>
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-48 w-full' />
            <Skeleton className='h-64 w-full' />
          </div>
        </Main>
      </>
    )
  }

  if (!account) {
    return (
      <>
        <Header>
          <TopNav links={[]} />
          <div className='ms-auto flex items-center space-x-4'>
            <Search />
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <EmptyState
            icon={Wallet}
            title='Account not found'
            description='The savings account you are looking for does not exist'
            action={{
              label: 'Back to Savings',
              onClick: () => navigate({ to: '/savings' }),
            }}
          />
        </Main>
      </>
    )
  }

  return (
    <>
      <Header>
        <TopNav links={[]} />
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => navigate({ to: '/savings' })}
            >
              <ArrowLeft className='h-5 w-5' />
            </Button>
            <div>
              <h1 className='text-2xl font-bold tracking-tight'>Account Details</h1>
              <p className='text-sm text-muted-foreground'>
                Manage your savings account
              </p>
            </div>
          </div>

          <div className='flex gap-2'>
            <Button
              variant='default'
              size='sm'
              onClick={() => setDepositDialogOpen(true)}
              disabled={account.status !== EAccountStatus.ACTIVE}
            >
              <ArrowDownToLine className='mr-2 h-4 w-4' />
              Deposit
            </Button>
            <Button
              variant='secondary'
              size='sm'
              onClick={() => setWithdrawDialogOpen(true)}
              disabled={account.status !== EAccountStatus.ACTIVE || account.balance === 0}
            >
              <ArrowUpFromLine className='mr-2 h-4 w-4' />
              Withdraw
            </Button>
          </div>
        </div>

        <div className='space-y-6'>
          <AccountInfo account={account} />
          <TierLimits tier={account.tier} />
          <AccountTransactions accountId={account.id} />
        </div>
      </Main>

      <DepositDialog
        account={account}
        open={depositDialogOpen}
        onOpenChange={setDepositDialogOpen}
      />

      <WithdrawDialog
        account={account}
        open={withdrawDialogOpen}
        onOpenChange={setWithdrawDialogOpen}
      />
    </>
  )
}
