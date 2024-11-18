import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Campaign, Prisma } from '@prisma/client'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type CreateCampaignFormProps = {
  onSubmit: (campaign: Omit<Campaign, 'id' | 'createdAt'>) => void
}

type FormData = Omit<Campaign, 'id' | 'createdAt' | 'budget' | 'roi' | 'costs'> & {
  budget: string;
  roi: string;
  costs: string;
}

export function CreateCampaignForm({ onSubmit }: CreateCampaignFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    status: 'Draft',
    startDate: new Date(),
    endDate: new Date(),
    budget: '0',
    platform: 'Google Ads',
    roi: '0',
    costs: '0',
    channel: '',
    assignee: '',
    property: '',
    workflow: '',
    owner: '',
    comments: 0,
    notes: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const campaignData: Omit<Campaign, 'id' | 'createdAt'> = {
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      budget: new Prisma.Decimal(formData.budget),
      roi: new Prisma.Decimal(formData.roi),
      costs: new Prisma.Decimal(formData.costs),
      comments: Number(formData.comments)
    }
    onSubmit(campaignData)
  }

  const nextStep = () => setStep(s => Math.min(s + 1, 3))
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {step === 1 && (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate instanceof Date ? formData.startDate.toISOString().split('T')[0] : ''}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate instanceof Date ? formData.endDate.toISOString().split('T')[0] : ''}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
              required
              className="w-full"
            />
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="space-y-2">
            <Label htmlFor="budget">Budget</Label>
            <Input
              id="budget"
              name="budget"
              type="text"
              inputMode="decimal"
              value={formData.budget}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roi">ROI</Label>
            <Input
              id="roi"
              name="roi"
              type="text"
              inputMode="decimal"
              value={formData.roi}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="costs">Costs</Label>
            <Input
              id="costs"
              name="costs"
              type="text"
              inputMode="decimal"
              value={formData.costs}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="channel">Channel</Label>
            <Input
              id="channel"
              name="channel"
              value={formData.channel}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignee">Assignee</Label>
            <Input
              id="assignee"
              name="assignee"
              value={formData.assignee}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="space-y-2">
            <Label htmlFor="property">Property</Label>
            <Input
              id="property"
              name="property"
              value={formData.property}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="workflow">Workflow</Label>
            <Input
              id="workflow"
              name="workflow"
              value={formData.workflow}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="owner">Owner</Label>
            <Input
              id="owner"
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Input
              id="comments"
              name="comments"
              type="number"
              value={formData.comments}
              onChange={(e) => setFormData(prev => ({ ...prev, comments: parseInt(e.target.value) || 0 }))}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full"
            />
          </div>
        </>
      )}

      <div className="flex justify-between mt-6">
        {step > 1 && (
          <Button type="button" onClick={prevStep} variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
        )}
        {step < 3 ? (
          <Button type="button" onClick={nextStep} className="ml-auto">
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" className="ml-auto">Create Campaign</Button>
        )}
      </div>
    </form>
  )
}