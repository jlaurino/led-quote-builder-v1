import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { User, Building, FileText, Calendar } from 'lucide-react'

interface CustomerInfo {
  customerName: string
  customerEmail: string
  projectName: string
  description: string
  markupPercentage: number
  fees: number
}

interface CustomerInfoProps {
  onSave: (info: CustomerInfo) => void
  initialData?: Partial<CustomerInfo>
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ onSave, initialData }) => {
  const [customerName, setCustomerName] = useState(initialData?.customerName || '')
  const [customerEmail, setCustomerEmail] = useState(initialData?.customerEmail || '')
  const [projectName, setProjectName] = useState(initialData?.projectName || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [markupPercentage, setMarkupPercentage] = useState(initialData?.markupPercentage?.toString() || '25')
  const [fees, setFees] = useState(initialData?.fees?.toString() || '0')

  const handleSave = () => {
    if (!customerName || !projectName) {
      alert('Please fill in customer name and project name')
      return
    }

    const info: CustomerInfo = {
      customerName,
      customerEmail,
      projectName,
      description,
      markupPercentage: parseFloat(markupPercentage) || 0,
      fees: parseFloat(fees) || 0,
    }

    onSave(info)
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-100">
          <User className="w-5 h-5" />
          <span>Customer & Project Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Customer Name *
            </label>
            <Input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
              className="bg-gray-700 border-gray-600 text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Customer Email
            </label>
            <Input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="customer@example.com"
              className="bg-gray-700 border-gray-600 text-gray-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project Name *
          </label>
          <Input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
            className="bg-gray-700 border-gray-600 text-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the project requirements..."
            rows={3}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Markup Percentage (%)
            </label>
            <Input
              type="number"
              value={markupPercentage}
              onChange={(e) => setMarkupPercentage(e.target.value)}
              placeholder="25"
              className="bg-gray-700 border-gray-600 text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Additional Fees ($)
            </label>
            <Input
              type="number"
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              placeholder="0"
              className="bg-gray-700 border-gray-600 text-gray-100"
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <FileText className="w-4 h-4 mr-2" />
          Save Project Information
        </Button>
      </CardContent>
    </Card>
  )
}

export default CustomerInfo


