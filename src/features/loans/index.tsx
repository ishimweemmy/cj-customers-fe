import { useState } from 'react'
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
import { LoanCard } from './components/loan-card'
import { RequestLoanDialog } from './components/request-loan-dialog'
import { RepayLoanDialog } from './components/repay-loan-dialog'
import { useGetLoans } from './server/use-loans'
import { PlusCircle, Banknote } from 'lucide-react'
import type { Loan } from '@/types/financial.type'

export function Loans() {
  const { data: loans, isLoading } = useGetLoans()
  const [selectedLoanForRepay, setSelectedLoanForRepay] = useState<Loan | null>(null)
  const [requestDialogOpen, setRequestDialogOpen] = useState(false)

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
            <h1 className='text-2xl font-bold tracking-tight'>Loans</h1>
            <p className='text-muted-foreground text-sm'>
              Manage your loan requests and repayments
            </p>
          </div>
          <Button onClick={() => setRequestDialogOpen(true)}>
            <PlusCircle className='mr-2 h-4 w-4' />
            Request Loan
          </Button>
        </div>

        {isLoading ? (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className='h-[400px] w-full rounded-lg' />
            ))}
          </div>
        ) : loans && loans.length > 0 ? (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {loans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                onViewDetails={(loan) => {
                  // Navigate to loan details
                  console.log('View details:', loan.id)
                }}
                onRepay={setSelectedLoanForRepay}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Banknote}
            title='No loans'
            description='Request your first loan to get started with borrowing'
            action={{
              label: 'Request Loan',
              onClick: () => setRequestDialogOpen(true),
            }}
          />
        )}
      </Main>

      <RequestLoanDialog
        open={requestDialogOpen}
        onOpenChange={setRequestDialogOpen}
      />

      <RepayLoanDialog
        loan={selectedLoanForRepay}
        open={!!selectedLoanForRepay}
        onOpenChange={(open) => !open && setSelectedLoanForRepay(null)}
      />
    </>
  )
}
