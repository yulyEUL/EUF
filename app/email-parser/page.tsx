"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import {
  Mail,
  Settings,
  Activity,
  Copy,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Database,
  Zap,
} from "lucide-react"

interface EmailRule {
  id: string
  name: string
  fromPattern: string
  subjectPattern: string
  bodyPatterns: string[]
  targetTable: string
  isActive: boolean
  lastTriggered?: string
  successCount: number
  errorCount: number
}

interface ParsedEmail {
  id: string
  from: string
  subject: string
  receivedAt: string
  status: "success" | "failed" | "pending"
  extractedData: any
  targetTable: string
  errorMessage?: string
}

export default function EmailParserPage() {
  const { toast } = useToast()
  const [emailRules, setEmailRules] = useState<EmailRule[]>([])
  const [recentEmails, setRecentEmails] = useState<ParsedEmail[]>([])
  const [webhookUrl, setWebhookUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Mock data - replace with real API calls
  useEffect(() => {
    setEmailRules([
      {
        id: "1",
        name: "Turo Booking Confirmations",
        fromPattern: "*@turo.com",
        subjectPattern: "Trip confirmed*",
        bodyPatterns: ["Trip ID:", "Guest:", "Vehicle:", "Start:", "End:", "Total:"],
        targetTable: "trips",
        isActive: true,
        lastTriggered: "2024-01-15T10:30:00Z",
        successCount: 45,
        errorCount: 2,
      },
      {
        id: "2",
        name: "Payment Notifications",
        fromPattern: "*@stripe.com",
        subjectPattern: "Payment received*",
        bodyPatterns: ["Amount:", "Customer:", "Payment ID:"],
        targetTable: "earnings",
        isActive: true,
        lastTriggered: "2024-01-15T09:15:00Z",
        successCount: 128,
        errorCount: 0,
      },
      {
        id: "3",
        name: "Maintenance Reminders",
        fromPattern: "*@maintenancecompany.com",
        subjectPattern: "Service completed*",
        bodyPatterns: ["Vehicle:", "Service type:", "Cost:", "Next service:"],
        targetTable: "maintenance_records",
        isActive: false,
        successCount: 12,
        errorCount: 1,
      },
    ])

    setRecentEmails([
      {
        id: "1",
        from: "noreply@turo.com",
        subject: "Trip confirmed - BMW 3 Series",
        receivedAt: "2024-01-15T10:30:00Z",
        status: "success",
        targetTable: "trips",
        extractedData: {
          tripId: "TR-2024-001",
          guest: "John Smith",
          vehicle: "BMW 3 Series",
          startDate: "2024-01-20",
          endDate: "2024-01-25",
          total: 450.0,
        },
      },
      {
        id: "2",
        from: "payments@stripe.com",
        subject: "Payment received for $450.00",
        receivedAt: "2024-01-15T09:15:00Z",
        status: "success",
        targetTable: "earnings",
        extractedData: {
          amount: 450.0,
          customer: "John Smith",
          paymentId: "pi_1234567890",
        },
      },
      {
        id: "3",
        from: "unknown@example.com",
        subject: "Random email",
        receivedAt: "2024-01-15T08:00:00Z",
        status: "failed",
        targetTable: "unknown",
        errorMessage: "No matching parsing rules found",
      },
    ])

    // Generate webhook URL
    setWebhookUrl(`${window.location.origin}/api/email/webhook`)
  }, [])

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl)
    toast({
      title: "Copied!",
      description: "Webhook URL copied to clipboard",
    })
  }

  const testEmailParsing = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    toast({
      title: "Test completed",
      description: "Email parsing test completed successfully",
    })
  }

  const toggleRule = (ruleId: string) => {
    setEmailRules((rules) => rules.map((rule) => (rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule)))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Email Parser</h1>
        <p className="text-muted-foreground">Automatically parse and import data from forwarded emails</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rules">Parsing Rules</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="setup">Setup</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{emailRules.filter((rule) => rule.isActive).length}</div>
                <p className="text-xs text-muted-foreground">of {emailRules.length} total rules</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Emails Processed</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{emailRules.reduce((sum, rule) => sum + rule.successCount, 0)}</div>
                <p className="text-xs text-muted-foreground">+12 from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.3%</div>
                <p className="text-xs text-muted-foreground">
                  {emailRules.reduce((sum, rule) => sum + rule.errorCount, 0)} errors total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2m ago</div>
                <p className="text-xs text-muted-foreground">Turo booking processed</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common email parsing tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button onClick={testEmailParsing} disabled={isLoading}>
                  {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                  Test Email Parsing
                </Button>
                <Button variant="outline">
                  <Database className="mr-2 h-4 w-4" />
                  View Parsed Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Parsing Rules</h2>
            <Button>Add New Rule</Button>
          </div>

          <div className="space-y-4">
            {emailRules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{rule.name}</CardTitle>
                      <CardDescription>
                        From: {rule.fromPattern} | Subject: {rule.subjectPattern}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={rule.isActive ? "default" : "secondary"}>
                        {rule.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Switch checked={rule.isActive} onCheckedChange={() => toggleRule(rule.id)} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Label className="text-sm font-medium">Target Table</Label>
                      <p className="text-sm text-muted-foreground">{rule.targetTable}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Success Count</Label>
                      <p className="text-sm text-green-600">{rule.successCount}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Error Count</Label>
                      <p className="text-sm text-red-600">{rule.errorCount}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label className="text-sm font-medium">Body Patterns</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {rule.bodyPatterns.map((pattern, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {pattern}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Email Activity</h2>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="space-y-4">
            {recentEmails.map((email) => (
              <Card key={email.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{email.subject}</CardTitle>
                      <CardDescription>
                        From: {email.from} | {new Date(email.receivedAt).toLocaleString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {email.status === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {email.status === "failed" && <XCircle className="h-5 w-5 text-red-500" />}
                      {email.status === "pending" && <Clock className="h-5 w-5 text-yellow-500" />}
                      <Badge
                        variant={
                          email.status === "success"
                            ? "default"
                            : email.status === "failed"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {email.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-sm font-medium">Target Table</Label>
                      <p className="text-sm text-muted-foreground">{email.targetTable}</p>
                    </div>
                    {email.errorMessage && (
                      <div>
                        <Label className="text-sm font-medium text-red-600">Error</Label>
                        <p className="text-sm text-red-600">{email.errorMessage}</p>
                      </div>
                    )}
                  </div>
                  {email.extractedData && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium">Extracted Data</Label>
                      <pre className="mt-1 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                        {JSON.stringify(email.extractedData, null, 2)}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Forwarding Setup</CardTitle>
              <CardDescription>Configure your email provider to forward emails to our webhook</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <div className="flex space-x-2">
                  <Input id="webhook-url" value={webhookUrl} readOnly className="font-mono text-sm" />
                  <Button variant="outline" size="sm" onClick={copyWebhookUrl}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Use this URL in your email provider's webhook settings
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Setup Instructions:</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Copy the webhook URL above</li>
                  <li>Go to your email provider (Gmail, Outlook, etc.)</li>
                  <li>Set up email forwarding to forward specific emails to a service like Zapier or Make.com</li>
                  <li>Configure the service to send HTTP POST requests to our webhook URL</li>
                  <li>Test the setup by sending a test email</li>
                </ol>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Security Note</h4>
                    <p className="text-sm text-yellow-800 mt-1">
                      Make sure to configure authentication tokens or IP whitelisting to secure your webhook endpoint.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Supported Email Providers</CardTitle>
              <CardDescription>Integration guides for popular email services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Gmail</h4>
                  <p className="text-sm text-muted-foreground">
                    Use Gmail filters + Zapier to forward emails to webhook
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Outlook</h4>
                  <p className="text-sm text-muted-foreground">
                    Use Outlook rules + Power Automate for email forwarding
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">SendGrid</h4>
                  <p className="text-sm text-muted-foreground">Direct webhook integration for inbound email parsing</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Mailgun</h4>
                  <p className="text-sm text-muted-foreground">Built-in email parsing with webhook delivery</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
