'use client'

import React, { useState } from 'react'
import { Sidebar, SidebarStep } from '@/components/ui/sidebar'
import DisplayCalculator, { DisplayCalculationResults } from '@/components/quote-builder/display-calculator'
import PowerCalculator, { PowerCalculationResults } from '@/components/quote-builder/power-calculator'
import ProductSelector from '@/components/quote-builder/product-selector'
import QuoteSummary from '@/components/quote-builder/quote-summary'
import CustomerInfo from '@/components/quote-builder/customer-info'
import ProductManager from '@/components/product-management/product-manager'
import QuoteTally from '@/components/quote-builder/quote-tally'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Monitor, Zap, Package, FileText, User, CheckCircle, ArrowRight, ArrowLeft, Database } from 'lucide-react'

interface QuoteItem {
  id: number
  name: string
  category: string
  manufacturer?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  unitCost?: number
  buyPrice?: number
  sellPrice?: number
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
  const [globalMarkup, setGlobalMarkup] = useState(20)

  // Quote Builder Steps
  const quoteBuilderSteps: SidebarStep[] = [
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
      id: 'selection',
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

  // Product Database Steps
  const productDatabaseSteps: SidebarStep[] = [
    {
      id: 'products',
      title: 'Product Management',
      description: 'Add, edit, and manage products',
      completed: false,
      active: currentStep === 5,
    },
  ]

  // Combined steps with sections
  const steps: SidebarStep[] = [
    // Quote Builder Section
    {
      id: 'quote-builder-section',
      title: 'Quote Builder',
      description: 'Build and manage quotes',
      completed: false,
      active: currentStep < 5,
      isSection: true,
    },
    ...quoteBuilderSteps,
    
    // Product Database Section
    {
      id: 'product-database-section',
      title: 'Product Database',
      description: 'Manage product catalog',
      completed: false,
      active: currentStep >= 5,
      isSection: true,
    },
    ...productDatabaseSteps,
  ]

  const handleStepClick = (stepId: string) => {
    // Handle section clicks - don't navigate to sections
    if (stepId.includes('-section')) {
      return
    }
    
    // Map step IDs to actual step indices
    const stepIdToIndex: { [key: string]: number } = {
      'display': 0,
      'power': 1,
      'selection': 2,
      'customer': 3,
      'summary': 4,
      'products': 5,
    }
    
    const stepIndex = stepIdToIndex[stepId]
    if (stepIndex !== undefined) {
      setCurrentStep(stepIndex)
    }
  }

  const handleNext = () => {
    // Define the maximum step index (5 for products)
    const maxStep = 5
    if (currentStep < maxStep) {
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
    // Check if this is a "continue" action
    if (results.isContinue) {
      handleNext()
      return
    }

    setDisplayResults(results)
    
    // If a tile was selected, automatically add it to the quote
    if (results.selectedTile) {
      const product = {
        id: results.selectedTile.id,
        name: results.selectedTile.name + (results.nickname ? ` (${results.nickname})` : ''),
        category: results.selectedTile.category,
        manufacturer: results.selectedTile.manufacturer,
        modelNumber: results.selectedTile.modelNumber,
        unitCost: results.selectedTile.unitCost,
        unitPrice: results.selectedTile.unitPrice || results.selectedTile.ledTile.sellPrice,
        ledTile: results.selectedTile.ledTile,
      }
      
      // Add the calculated number of tiles to the quote
      handleAddProduct(product, results.totalTiles)
    }
    
    // Don't automatically advance to next step - user can add more displays
  }

  const handlePowerCalculate = (results: PowerCalculationResults) => {
    setPowerResults(results)
    handleNext()
  }

  const handleAddProduct = (product: any, quantity: number) => {
    // Calculate sell price based on pricing method
    let calculatedSellPrice = product.unitPrice || product.unitCost
    
    if (product.pricingMethod === 'global') {
      // Use global markup percentage
      calculatedSellPrice = product.unitCost * (1 + globalMarkup / 100)
    } else if (product.pricingMethod === 'bespoke') {
      // Use bespoke markup percentage
      const bespokeMarkup = product.bespokeMarkup || 20
      calculatedSellPrice = product.unitCost * (1 + bespokeMarkup / 100)
    }
    // For 'manual' method, use the existing unitPrice

    const newItem: QuoteItem = {
      id: nextItemId,
      name: product.name,
      category: product.category,
      manufacturer: product.manufacturer,
      quantity,
      unitPrice: calculatedSellPrice,
      totalPrice: calculatedSellPrice * quantity,
      unitCost: product.unitCost,
      buyPrice: product.unitCost || product.ledTile?.buyPrice,
      sellPrice: calculatedSellPrice,
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
               globalMarkup={globalMarkup}
               onRemoveItem={handleRemoveItem}
               onUpdateQuantity={handleUpdateQuantity}
               onUpdateGlobalMarkup={setGlobalMarkup}
               onExportQuote={handleExportQuote}
               onExportBOM={handleExportBOM}
             />
           )
      case 5:
        return <ProductManager />
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
                <p className="text-lg font-semibold text-gray-100">
                  {currentStep < 5 ? `${currentStep + 1} of 5` : 'Product Database'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="flex gap-6">
                         {/* Main Content */}
             <div className="flex-1 min-w-0">
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
                    {currentStep < 5 ? quoteBuilderSteps[currentStep].title : productDatabaseSteps[0].title}
                  </h2>
                  <p className="text-gray-400">
                    {currentStep < 5 ? quoteBuilderSteps[currentStep].description : productDatabaseSteps[0].description}
                  </p>
                </div>

                <Button
                  onClick={handleNext}
                  disabled={currentStep === 5}
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

              
            </div>

                         {/* Quote Tally Sidebar */}
             {currentStep < 5 && (
               <div className="w-[448px] flex-shrink-0">
                 <QuoteTally
                   items={quoteItems}
                   onRemoveItem={handleRemoveItem}
                   onUpdateQuantity={handleUpdateQuantity}
                 />
               </div>
             )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default QuoteBuilder


