import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/shared/empty-state'
import { CreditStats } from './components/credit-stats'
import { useGetCreditAccount } from './server/use-credit'
import { CreditCard } from 'lucide-react'

export function Credit() {
  const { data: creditAccount, isLoading } = useGetCreditAccount()

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
        <div className='mb-6'>
          <h1 className='text-2xl font-bold tracking-tight'>Credit Account</h1>
          <p className='text-muted-foreground text-sm'>
            Manage your credit limit and borrowing capacity
          </p>
        </div>

        {isLoading ? (
          <div className='space-y-6'>
            <Skeleton className='h-[100px] w-full' />
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className='h-[120px] w-full' />
              ))}
            </div>
            <Skeleton className='h-[200px] w-full' />
          </div>
        ) : creditAccount ? (
          <CreditStats creditAccount={creditAccount} />
        ) : (
          <EmptyState
            icon={CreditCard}
            title='No credit account found'
            description='Your credit account information will appear here'
          />
        )}
      </Main>
    </>
  )
}
