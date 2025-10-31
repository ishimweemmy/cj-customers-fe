import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
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
import { SavingsAccountCard } from './components/savings-account-card'
import { DepositDialog } from './components/deposit-dialog'
import { WithdrawDialog } from './components/withdraw-dialog'
import { CreateAccountDialog } from './components/create-account-dialog'
import { useGetSavingsAccounts } from './server/use-savings'
import { PlusCircle, Wallet } from 'lucide-react'
import type { SavingsAccount } from '@/types/financial.type'

export function Savings() {
  const navigate = useNavigate()
  const { data: accounts, isLoading } = useGetSavingsAccounts()
  const [selectedAccountForDeposit, setSelectedAccountForDeposit] = useState<SavingsAccount | null>(null)
  const [selectedAccountForWithdraw, setSelectedAccountForWithdraw] = useState<SavingsAccount | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

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
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Savings Accounts</h1>
            <p className='text-muted-foreground text-sm'>
              Manage your savings accounts and transactions
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <PlusCircle className='mr-2 h-4 w-4' />
            Create Account
          </Button>
        </div>

        {isLoading ? (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='space-y-3'>
                <Skeleton className='h-[300px] w-full rounded-lg' />
              </div>
            ))}
          </div>
        ) : accounts && accounts.length > 0 ? (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {accounts.map((account) => (
              <SavingsAccountCard
                key={account.id}
                account={account}
                onDeposit={setSelectedAccountForDeposit}
                onWithdraw={setSelectedAccountForWithdraw}
                onViewDetails={(account) => {
                  navigate({ to: '/savings/$accountId', params: { accountId: account.id } })
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Wallet}
            title='No savings accounts'
            description='Create your first savings account to start saving and earning interest'
            action={{
              label: 'Create Account',
              onClick: () => setCreateDialogOpen(true),
            }}
          />
        )}
      </Main>

      <DepositDialog
        account={selectedAccountForDeposit}
        open={!!selectedAccountForDeposit}
        onOpenChange={(open) => !open && setSelectedAccountForDeposit(null)}
      />

      <WithdrawDialog
        account={selectedAccountForWithdraw}
        open={!!selectedAccountForWithdraw}
        onOpenChange={(open) => !open && setSelectedAccountForWithdraw(null)}
      />

      <CreateAccountDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  )
}
