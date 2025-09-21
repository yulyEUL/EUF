import type { Metadata } from "next"
import { AccountsPayableOverview } from "@/components/accounts-payable/accounts-payable-overview"
import { AccountsPayableTabs } from "@/components/accounts-payable/accounts-payable-tabs"

export const metadata: Metadata = {
  title: "Accounts Payable | Car Rental SaaS",
  description: "Manage your accounts payable, invoices, and vendor payments",
}

export default function AccountsPayablePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Accounts Payable</h1>
      </div>

      <AccountsPayableOverview />
      <AccountsPayableTabs />
    </div>
  )
}
