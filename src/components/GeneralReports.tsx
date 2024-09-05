import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const googleAdsData = [
  { name: 'Jan', clicks: 4000, impressions: 2400, conversions: 240 },
  { name: 'Feb', clicks: 3000, impressions: 1398, conversions: 221 },
  { name: 'Mar', clicks: 2000, impressions: 9800, conversions: 229 },
  { name: 'Apr', clicks: 2780, impressions: 3908, conversions: 200 },
  { name: 'May', clicks: 1890, impressions: 4800, conversions: 218 },
  { name: 'Jun', clicks: 2390, impressions: 3800, conversions: 250 },
]

const metaAdsData = [
  { name: 'Jan', reach: 100000, engagement: 5000, conversions: 500 },
  { name: 'Feb', reach: 120000, engagement: 6000, conversions: 550 },
  { name: 'Mar', reach: 90000, engagement: 4500, conversions: 480 },
  { name: 'Apr', reach: 110000, engagement: 5500, conversions: 520 },
  { name: 'May', reach: 130000, engagement: 6500, conversions: 600 },
  { name: 'Jun', reach: 115000, engagement: 5750, conversions: 540 },
]

const analyticsData = [
  { name: 'Jan', sessions: 50000, pageviews: 150000, bounceRate: 45 },
  { name: 'Feb', sessions: 55000, pageviews: 165000, bounceRate: 43 },
  { name: 'Mar', sessions: 48000, pageviews: 144000, bounceRate: 47 },
  { name: 'Apr', sessions: 52000, pageviews: 156000, bounceRate: 44 },
  { name: 'May', sessions: 58000, pageviews: 174000, bounceRate: 42 },
  { name: 'Jun', sessions: 54000, pageviews: 162000, bounceRate: 45 },
]

export function GeneralReports() {
  const [activeTab, setActiveTab] = useState("google-ads")

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">General Reports</h2>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="google-ads">Google Ads</TabsTrigger>
          <TabsTrigger value="meta-ads">Meta Ads</TabsTrigger>
          <TabsTrigger value="analytics">Google Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="google-ads">
          <Card>
            <CardHeader>
              <CardTitle>Google Ads Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={googleAdsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line yAxisId="left" type="monotone" dataKey="impressions" stroke="#82ca9d" />
                    <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="meta-ads">
          <Card>
            <CardHeader>
              <CardTitle>Meta Ads Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metaAdsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="reach" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line yAxisId="left" type="monotone" dataKey="engagement" stroke="#82ca9d" />
                    <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Google Analytics Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="sessions" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line yAxisId="left" type="monotone" dataKey="pageviews" stroke="#82ca9d" />
                    <Line yAxisId="right" type="monotone" dataKey="bounceRate" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}