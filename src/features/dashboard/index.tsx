import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardStats } from './components/dashboard-stats'
import { TransactionsTable } from '@/features/transactions/components/transactions-table'
import { useDashboardData } from './server/use-dashboard'

export function Dashboard() {
  const {
    user,
    creditAccount,
    transactions,
    totalSavings,
    activeLoansCount,
    isLoading,
  } = useDashboardData()

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={[]} />
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-6'>
          <h1 className='text-2xl font-bold tracking-tight'>
            Welcome back, {user?.firstName || 'Customer'}!
          </h1>
          <p className='text-muted-foreground text-sm'>
            Here's an overview of your financial dashboard
          </p>
        </div>

        <div className='space-y-6'>
          {/* Stats Grid */}
          <DashboardStats
            user={user}
            creditAccount={creditAccount}
            totalSavings={totalSavings}
            activeLoansCount={activeLoansCount}
            isLoading={isLoading}
          />

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionsTable
                data={transactions}
                isLoading={isLoading}
                showToolbar={false}
                showPagination={false}
                hideColumns={['transactionReference', 'balanceAfter']}
              />
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
