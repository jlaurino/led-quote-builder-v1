'use client'

import React, { useState } from 'react'
import { Sidebar, SidebarStep } from '@/components/ui/sidebar'
import DisplayCalculator, { DisplayCalculationResults } from '@/components/quote-builder/display-calculator'
import PowerCalculator, { PowerCalculationResults } from '@/components/quote-builder/power-calculator'
import ProductSelector from '@/components/quote-builder/product-selector'
import QuoteSummary from '@/components/quote-builder/quote-summary'
import CustomerInfo from '@/components/quote-builder/customer-info'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Monitor, Zap, Package, FileText, User, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'

interface QuoteItem {
  id: number
  name: string
  category: string
  manufacturer?: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

interface CustomerInfoData {
  customerName: string
  customerEmail: string
  projectName: string
  description: string
  markupPercentage: number
  fees: number
}

const QuoteBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfoData | null>(null)
  const [displayResults, setDisplayResults] = useState<DisplayCalculationResults | null>(null)
  const [powerResults, setPowerResults] = useState<PowerCalculationResults | null>(null)
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([])
  const [nextItemId, setNextItemId] = useState(1)

  const steps: SidebarStep[] = [
    {
      id: 'display',
      title: 'Display Calculator',
      description: 'Calculate LED display requirements',
      completed: !!displayResults,
      active: currentStep === 0,
    },
    {
      id: 'power',
      title: 'Power Calculator',
      description: 'Calculate power requirements',
      completed: !!powerResults,
      active: currentStep === 1,
    },
    {
      id: 'products',
      title: 'Product Selection',
      description: 'Add products to quote',
      completed: quoteItems.length > 0,
      active: currentStep === 2,
    },
    {
      id: 'customer',
      title: 'Customer Information',
      description: 'Enter customer and project details',
      completed: !!customerInfo,
      active: currentStep === 3,
    },
    {
      id: 'summary',
      title: 'Quote Summary',
      description: 'Review and export quote',
      completed: false,
      active: currentStep === 4,
    },
  ]

  const handleStepClick = (stepId: string) => {
    const stepIndex = steps.findIndex(step => step.id === stepId)
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex)
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCustomerInfoSave = (info: CustomerInfoData) => {
    setCustomerInfo(info)
    handleNext()
  }

  const handleDisplayCalculate = (results: DisplayCalculationResults) => {
    setDisplayResults(results)
    handleNext()
  }

  const handlePowerCalculate = (results: PowerCalculationResults) => {
    setPowerResults(results)
    handleNext()
  }

  const handleAddProduct = (product: any, quantity: number) => {
    const newItem: QuoteItem = {
      id: nextItemId,
      name: product.name,
      category: product.category,
      manufacturer: product.manufacturer,
      quantity,
      unitPrice: product.unitPrice || product.unitCost,
      totalPrice: (product.unitPrice || product.unitCost) * quantity,
    }
    setQuoteItems([...quoteItems, newItem])
    setNextItemId(nextItemId + 1)
  }

  const handleRemoveItem = (id: number) => {
    setQuoteItems(quoteItems.filter(item => item.id !== id))
  }

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setQuoteItems(quoteItems.map(item => 
      item.id === id 
        ? { ...item, quantity, totalPrice: item.unitPrice * quantity }
        : item
    ))
  }

  const handleExportQuote = () => {
    // Mock export functionality
    alert('Quote export functionality would be implemented here')
  }

  const handleExportBOM = () => {
    // Mock export functionality
    alert('BOM export functionality would be implemented here')
  }

  const subtotal = quoteItems.reduce((sum, item) => sum + item.totalPrice, 0)
  const markup = customerInfo ? (subtotal * customerInfo.markupPercentage / 100) : 0
  const fees = customerInfo ? customerInfo.fees : 0
  const total = subtotal + markup + fees

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <DisplayCalculator
            onCalculate={handleDisplayCalculate}
          />
        )
      case 1:
        return (
          <PowerCalculator
            onCalculate={handlePowerCalculate}
          />
        )
      case 2:
        return (
          <ProductSelector
            onAddProduct={handleAddProduct}
          />
        )
      case 3:
        return (
          <CustomerInfo
            onSave={handleCustomerInfoSave}
            initialData={customerInfo || undefined}
          />
        )
      case 4:
        return (
          <QuoteSummary
            items={quoteItems}
            subtotal={subtotal}
            markup={markup}
            fees={fees}
            total={total}
            onRemoveItem={handleRemoveItem}
            onUpdateQuantity={handleUpdateQuantity}
            onExportQuote={handleExportQuote}
            onExportBOM={handleExportBOM}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar
        steps={steps}
        onStepClick={handleStepClick}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-100">LED Quote Builder</h1>
              <p className="text-gray-400">Professional LED display quoting tool</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Current Step</p>
                <p className="text-lg font-semibold text-gray-100">{currentStep + 1} of {steps.length}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {/* Step Navigation */}
            <div className="flex items-center justify-between mb-6">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-100">
                  {steps[currentStep].title}
                </h2>
                <p className="text-gray-400">{steps[currentStep].description}</p>
              </div>

              <Button
                onClick={handleNext}
                disabled={currentStep === steps.length - 1}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Step Content */}
            <div className="space-y-6">
              {renderCurrentStep()}
            </div>

            {/* Results Display */}
            {(displayResults || powerResults) && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayResults && (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-gray-100">
                        <Monitor className="w-5 h-5" />
                        <span>Display Results</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Tiles:</span>
                        <span className="text-gray-100">{displayResults.totalTiles}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Power:</span>
                        <span className="text-gray-100">{displayResults.totalPower}W</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Recommended Processor:</span>
                        <span className="text-gray-100">{displayResults.recommendedProcessor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Estimated Cost:</span>
                        <span className="text-gray-100">${displayResults.estimatedCost.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {powerResults && (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-gray-100">
                        <Zap className="w-5 h-5" />
                        <span>Power Results</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Power:</span>
                        <span className="text-gray-100">{powerResults.totalPower}W</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Recommended Capacity:</span>
                        <span className="text-gray-100">{powerResults.recommendedCapacity}W</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Phase:</span>
                        <span className="text-gray-100">{powerResults.recommendedPhase}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Redundancy:</span>
                        <span className="text-gray-100">{powerResults.redundancy ? 'Yes' : 'No'}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default QuoteBuilder


