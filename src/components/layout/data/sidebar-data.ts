import {
  LayoutDashboard,
  Command,
  Wallet,
  Banknote,
  Receipt,
  CreditCard,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Credit Jambo',
      logo: Command,
      plan: '',
    }
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Savings',
          url: '/savings',
          icon: Wallet,
        },
        {
          title: 'Loans',
          url: '/loans',
          icon: Banknote,
        },
        {
          title: 'Transactions',
          url: '/transactions',
          icon: Receipt,
        },
        {
          title: 'Credit',
          url: '/credit',
          icon: CreditCard,
        },
      ],
    }
  ],
}
