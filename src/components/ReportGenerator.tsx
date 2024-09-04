import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"

export function ReportGenerator() {
  const [reportType, setReportType] = useState('')

  async function generateReport() {
    // Implementirajte logiku za generiranje izvještaja
    const { data, error } = await supabase
      .from(reportType)
      .select('*')
    if (error) console.error('Error generating report:', error)
    else {
      // Ovdje biste obradili podatke i generirali izvještaj
      console.log(data)
    }
  }

  return (
    <div>
      <Select
        value={reportType}
        onValueChange={setReportType}
        options={[
          { value: 'contacts', label: 'Contacts' },
          { value: 'campaigns', label: 'Campaigns' },
          { value: 'orders', label: 'Orders' },
          { value: 'donors', label: 'Donors' },
        ]}
      />
      <Button onClick={generateReport}>Generate Report</Button>
    </div>
  )
}