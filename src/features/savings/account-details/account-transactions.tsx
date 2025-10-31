import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TransactionsTable } from '@/features/transactions/components/transactions-table'
import { useGetTransactions } from '@/features/transactions/server/use-transactions'
import { ETransactionType } from '@/enums/financial.enum'

type AccountTransactionsProps = {
  accountId: string
}

export function AccountTransactions({ accountId }: AccountTransactionsProps) {
  const { data: paginatedData, isLoading } = useGetTransactions({
    savingsAccountId: accountId,
    limit: 50,
  })

  const accountTransactions = paginatedData?.data || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <p className='text-sm text-muted-foreground'>Transaction history for this account</p>
      </CardHeader>
      <CardContent>
        <TransactionsTable
          data={accountTransactions}
          isLoading={isLoading}
          showToolbar={false}
          showPagination={false}
          limit={10}
        />
      </CardContent>
    </Card>
  )
}
