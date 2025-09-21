"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvoiceTable } from "@/components/accounts-payable/invoice-table"
import { VendorTable } from "@/components/accounts-payable/vendor-table"
import { PaymentHistory } from "@/components/accounts-payable/payment-history"

export function AccountsPayableTabs() {
  const [activeTab, setActiveTab] = useState("invoices")

  return (
    <Tabs defaultValue="invoices" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="invoices">Invoices</TabsTrigger>
        <TabsTrigger value="vendors">Vendors</TabsTrigger>
        <TabsTrigger value="payments">Payment History</TabsTrigger>
      </TabsList>
      <TabsContent value="invoices" className="space-y-4">
        <InvoiceTable />
      </TabsContent>
      <TabsContent value="vendors" className="space-y-4">
        <VendorTable />
      </TabsContent>
      <TabsContent value="payments" className="space-y-4">
        <PaymentHistory />
      </TabsContent>
    </Tabs>
  )
}
