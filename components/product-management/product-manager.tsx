'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Edit, Trash2, Search, Filter, Database, Package } from 'lucide-react'
import { ProductCategory, ReceivingCardType } from '@prisma/client'

interface Product {
  id: number
  name: string
  category: ProductCategory
  subcategory?: string
  manufacturer?: string
  modelNumber?: string
  unitCost: number
  unitPrice?: number
  ledTile?: {
    pixelPitchMm: number
    physicalWidthMm: number
    physicalHeightMm: number
    pixelWidth: number
    pixelHeight: number
    weightKg: number
    maxPowerW: number
    avgPowerW: number
    receivingCardType: ReceivingCardType
    brightnessNits: number
    refreshRateHz: number
    scanRate?: number
    buyPrice: number
    sellPrice: number
  }
}

interface ProductFormData {
  name: string
  manufacturer: string
  modelNumber: string
  description: string
  category: ProductCategory
  subcategory: string
  unitCost: string
  unitPrice: string
  // Pricing options
  pricingMethod: 'global' | 'bespoke' | 'manual'
  bespokeMarkup: string
  // LED Tile specific fields
  pixelPitchMm: string
  physicalWidthMm: string
  physicalHeightMm: string
  pixelWidth: string
  pixelHeight: string
  weightKg: string
  maxPowerW: string
  avgPowerW: string
  receivingCardType: ReceivingCardType
  brightnessNits: string
  refreshRateHz: string
  scanRate: string
  buyPrice: string
  sellPrice: string
}

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | ''>('')
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    manufacturer: '',
    modelNumber: '',
    description: '',
    category: ProductCategory.LED_TILE,
    subcategory: '',
    unitCost: '',
    unitPrice: '',
    pricingMethod: 'global',
    bespokeMarkup: '20',
    pixelPitchMm: '',
    physicalWidthMm: '',
    physicalHeightMm: '',
    pixelWidth: '',
    pixelHeight: '',
    weightKg: '',
    maxPowerW: '',
    avgPowerW: '',
    receivingCardType: ReceivingCardType.NOVASTAR,
    brightnessNits: '',
    refreshRateHz: '',
    scanRate: '',
    buyPrice: '',
    sellPrice: '',
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      // Ensure data is always an array
      setProducts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Form data before submission:', formData) // Debug log
    
    const productData = {
      name: formData.name,
      manufacturer: formData.manufacturer,
      modelNumber: formData.modelNumber,
      category: formData.category,
      subcategory: formData.subcategory,
      unitCost: formData.unitCost, // Send as string, let API handle parsing
      unitPrice: formData.unitPrice, // Send as string, let API handle parsing
      pricingMethod: formData.pricingMethod,
      bespokeMarkup: formData.bespokeMarkup,
      specs: { description: formData.description },
      ...(formData.category === ProductCategory.LED_TILE && {
        ledTile: {
          pixelPitchMm: formData.pixelPitchMm,
          physicalWidthMm: formData.physicalWidthMm,
          physicalHeightMm: formData.physicalHeightMm,
          pixelWidth: formData.pixelWidth,
          pixelHeight: formData.pixelHeight,
          weightKg: formData.weightKg,
          maxPowerW: formData.maxPowerW,
          avgPowerW: formData.avgPowerW,
          receivingCardType: formData.receivingCardType,
          brightnessNits: formData.brightnessNits,
          refreshRateHz: formData.refreshRateHz,
          scanRate: formData.scanRate,
          buyPrice: formData.buyPrice,
          sellPrice: formData.sellPrice,
        }
      })
    }

    console.log('Product data being sent:', productData) // Debug log

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products'
      const method = editingProduct ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        console.log('Product saved successfully') // Debug log
        setShowForm(false)
        setEditingProduct(null)
        resetForm()
        fetchProducts()
      } else {
        const errorText = await response.text()
        console.error('Failed to save product:', response.status, errorText)
        
        // Try to parse the error response
        try {
          const errorData = JSON.parse(errorText)
          alert(`Error: ${errorData.error || 'Unknown error occurred'}`)
        } catch {
          alert(`Error: Server returned ${response.status}`)
        }
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Network error occurred. Please try again.')
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      manufacturer: product.manufacturer || '',
      modelNumber: product.modelNumber || '',
      description: '',
      category: product.category,
      subcategory: product.subcategory || '',
      unitCost: product.unitCost.toString(),
      unitPrice: (product.unitPrice || 0).toString(),
      pricingMethod: 'manual', // Default to manual for existing products
      bespokeMarkup: '20',
      pixelPitchMm: product.ledTile?.pixelPitchMm.toString() || '',
      physicalWidthMm: product.ledTile?.physicalWidthMm.toString() || '',
      physicalHeightMm: product.ledTile?.physicalHeightMm.toString() || '',
      pixelWidth: product.ledTile?.pixelWidth.toString() || '',
      pixelHeight: product.ledTile?.pixelHeight.toString() || '',
      weightKg: product.ledTile?.weightKg.toString() || '',
      maxPowerW: product.ledTile?.maxPowerW.toString() || '',
      avgPowerW: product.ledTile?.avgPowerW.toString() || '',
      receivingCardType: product.ledTile?.receivingCardType || ReceivingCardType.NOVASTAR,
      brightnessNits: product.ledTile?.brightnessNits.toString() || '',
      refreshRateHz: product.ledTile?.refreshRateHz.toString() || '',
      scanRate: product.ledTile?.scanRate?.toString() || '',
      buyPrice: product.ledTile?.buyPrice.toString() || '',
      sellPrice: product.ledTile?.sellPrice.toString() || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (productId: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          fetchProducts()
        } else {
          console.error('Failed to delete product')
        }
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      manufacturer: '',
      modelNumber: '',
      description: '',
      category: ProductCategory.LED_TILE,
      subcategory: '',
      unitCost: '',
      unitPrice: '',
      pricingMethod: 'global',
      bespokeMarkup: '20',
      pixelPitchMm: '',
      physicalWidthMm: '',
      physicalHeightMm: '',
      pixelWidth: '',
      pixelHeight: '',
      weightKg: '',
      maxPowerW: '',
      avgPowerW: '',
      receivingCardType: ReceivingCardType.NOVASTAR,
      brightnessNits: '',
      refreshRateHz: '',
      scanRate: '',
      buyPrice: '',
      sellPrice: '',
    })
  }

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const filteredProducts = (Array.isArray(products) ? products : []).filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.modelNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (category: ProductCategory) => {
    switch (category) {
      case ProductCategory.LED_TILE: return <Package className="w-4 h-4" />
      case ProductCategory.LED_PROCESSOR: return <Package className="w-4 h-4" />
      case ProductCategory.POWER_EQUIPMENT: return <Package className="w-4 h-4" />
      default: return <Package className="w-4 h-4" />
    }
  }

  const getCategorySubcategorySuggestions = (category: ProductCategory): string[] => {
    switch (category) {
      case ProductCategory.LED_TILE:
        return ['Indoor', 'Outdoor', 'Rental', 'Fixed Installation', 'Mobile', 'Curved', 'Flexible']
      case ProductCategory.LED_PROCESSOR:
        return ['Video Processor', 'Scaler', 'Controller', 'Media Server', 'Sync Box']
      case ProductCategory.POWER_EQUIPMENT:
        return ['Power Supply', 'Distribution', 'UPS', 'Generator', 'Transformer']
      case ProductCategory.COMPUTING:
        return ['Workstation', 'Server', 'Media PC', 'Laptop', 'Mini PC']
      case ProductCategory.LIGHTING:
        return ['LED Fixture', 'Moving Light', 'Conventional', 'Effect Light', 'Control']
      case ProductCategory.AUDIO:
        return ['Speaker', 'Amplifier', 'Mixer', 'Microphone', 'Processor']
      case ProductCategory.CAMERA:
        return ['PTZ Camera', 'Fixed Camera', 'Action Camera', 'Broadcast Camera']
      case ProductCategory.NETWORKING:
        return ['Switch', 'Router', 'Access Point', 'Cable', 'Adapter']
      case ProductCategory.CABLE:
        return ['Power Cable', 'Data Cable', 'Video Cable', 'Audio Cable', 'Network Cable']
      case ProductCategory.HARDWARE:
        return ['Mounting', 'Bracket', 'Hardware Kit', 'Tool', 'Accessory']
      default:
        return []
    }
  }

  const getCategoryDescription = (category: ProductCategory): string => {
    switch (category) {
      case ProductCategory.LED_TILE:
        return 'LED display tiles with pixel pitch, resolution, and technical specifications'
      case ProductCategory.LED_PROCESSOR:
        return 'Video processors and controllers for LED displays'
      case ProductCategory.POWER_EQUIPMENT:
        return 'Power supplies, distribution, and electrical equipment'
      case ProductCategory.COMPUTING:
        return 'Computers, workstations, and computing hardware'
      case ProductCategory.LIGHTING:
        return 'Stage lighting, effects, and control systems'
      case ProductCategory.AUDIO:
        return 'Audio equipment, speakers, and sound systems'
      case ProductCategory.CAMERA:
        return 'Cameras and video equipment'
      case ProductCategory.NETWORKING:
        return 'Network equipment and connectivity solutions'
      case ProductCategory.CABLE:
        return 'Cables and connectivity solutions'
      case ProductCategory.HARDWARE:
        return 'Mounting hardware, brackets, and accessories'
      default:
        return 'General product category'
    }
  }

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="flex justify-center items-center h-32">
          <div className="text-gray-400">Loading products...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Product Database</h2>
          <p className="text-gray-400">Manage your product catalog</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 border-gray-600 text-gray-100"
              />
            </div>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as ProductCategory | '')}
            >
              <option value="">All Categories</option>
              {Object.values(ProductCategory).map(category => (
                <option key={category} value={category}>
                  {category.replace(/_/g, ' ')}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Product Form */}
      {showForm && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="e.g., P2.5 LED Tile"
                    required
                    className="bg-gray-700 border-gray-600 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Master Category</label>
                  <Select
                    value={formData.category}
                    onChange={(e) => updateFormData('category', e.target.value)}
                    required
                  >
                    <option value="">Select a category...</option>
                    {Object.values(ProductCategory).map(category => (
                      <option key={category} value={category}>
                        {category.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </Select>
                  {formData.category && (
                    <p className="text-xs text-gray-500 mt-1">
                      {getCategoryDescription(formData.category)}
                    </p>
                  )}
                </div>
              </div>

              {/* Subcategory */}
              {formData.category && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subcategory</label>
                  <div className="flex space-x-2">
                    <Input
                      value={formData.subcategory}
                      onChange={(e) => updateFormData('subcategory', e.target.value)}
                      placeholder="Enter subcategory or select from suggestions..."
                      className="bg-gray-700 border-gray-600 text-gray-100"
                    />
                    <Select
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          updateFormData('subcategory', e.target.value)
                        }
                      }}
                    >
                      <option value="">Suggestions</option>
                      {getCategorySubcategorySuggestions(formData.category).map(suggestion => (
                        <option key={suggestion} value={suggestion}>
                          {suggestion}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Choose a subcategory to help organize your products
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Manufacturer</label>
                  <Input
                    value={formData.manufacturer}
                    onChange={(e) => updateFormData('manufacturer', e.target.value)}
                    placeholder="e.g., NovaStar"
                    required
                    className="bg-gray-700 border-gray-600 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Model Number</label>
                  <Input
                    value={formData.modelNumber}
                    onChange={(e) => updateFormData('modelNumber', e.target.value)}
                    placeholder="e.g., NS-P2.5-500x500"
                    required
                    className="bg-gray-700 border-gray-600 text-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Product description..."
                  className="bg-gray-700 border-gray-600 text-gray-100"
                />
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Buy Price ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.buyPrice}
                    onChange={(e) => updateFormData('buyPrice', e.target.value)}
                    placeholder="0.00"
                    required
                    className="bg-gray-700 border-gray-600 text-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sell Price Method</label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="global"
                        checked={formData.pricingMethod === 'global'}
                        onChange={(e) => updateFormData('pricingMethod', e.target.value)}
                        className="text-blue-600"
                      />
                      <span className="text-gray-300">Use Global Hardware Markup (20%)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="bespoke"
                        checked={formData.pricingMethod === 'bespoke'}
                        onChange={(e) => updateFormData('pricingMethod', e.target.value)}
                        className="text-blue-600"
                      />
                      <span className="text-gray-300">Use Bespoke Percentage</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="manual"
                        checked={formData.pricingMethod === 'manual'}
                        onChange={(e) => updateFormData('pricingMethod', e.target.value)}
                        className="text-blue-600"
                      />
                      <span className="text-gray-300">Manual Entry</span>
                    </label>
                  </div>
                </div>

                {formData.pricingMethod === 'bespoke' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bespoke Markup Percentage (%)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.bespokeMarkup}
                      onChange={(e) => updateFormData('bespokeMarkup', e.target.value)}
                      placeholder="20"
                      className="bg-gray-700 border-gray-600 text-gray-100"
                    />
                  </div>
                )}

                {formData.pricingMethod === 'manual' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Sell Price ($)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.sellPrice}
                      onChange={(e) => updateFormData('sellPrice', e.target.value)}
                      placeholder="0.00"
                      required
                      className="bg-gray-700 border-gray-600 text-gray-100"
                    />
                  </div>
                )}
              </div>

              {/* LED Tile Specific Fields */}
              {formData.category === ProductCategory.LED_TILE && (
                <div className="space-y-6 border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-200">LED Tile Specifications</h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Pixel Pitch (mm)</label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.pixelPitchMm}
                        onChange={(e) => updateFormData('pixelPitchMm', e.target.value)}
                        placeholder="2.5"
                        required
                        className="bg-gray-700 border-gray-600 text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Physical Width (mm)</label>
                      <Input
                        type="number"
                        step="1"
                        value={formData.physicalWidthMm}
                        onChange={(e) => updateFormData('physicalWidthMm', e.target.value)}
                        placeholder="500"
                        required
                        className="bg-gray-700 border-gray-600 text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Physical Height (mm)</label>
                      <Input
                        type="number"
                        step="1"
                        value={formData.physicalHeightMm}
                        onChange={(e) => updateFormData('physicalHeightMm', e.target.value)}
                        placeholder="500"
                        required
                        className="bg-gray-700 border-gray-600 text-gray-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Pixel Width</label>
                      <Input
                        type="number"
                        value={formData.pixelWidth}
                        onChange={(e) => updateFormData('pixelWidth', e.target.value)}
                        placeholder="192"
                        required
                        className="bg-gray-700 border-gray-600 text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Pixel Height</label>
                      <Input
                        type="number"
                        value={formData.pixelHeight}
                        onChange={(e) => updateFormData('pixelHeight', e.target.value)}
                        placeholder="192"
                        required
                        className="bg-gray-700 border-gray-600 text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Weight (kg)</label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.weightKg}
                        onChange={(e) => updateFormData('weightKg', e.target.value)}
                        placeholder="8.5"
                        required
                        className="bg-gray-700 border-gray-600 text-gray-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Max Power (W)</label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.maxPowerW}
                        onChange={(e) => updateFormData('maxPowerW', e.target.value)}
                        placeholder="120"
                        required
                        className="bg-gray-700 border-gray-600 text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Avg Power (W)</label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.avgPowerW}
                        onChange={(e) => updateFormData('avgPowerW', e.target.value)}
                        placeholder="100"
                        required
                        className="bg-gray-700 border-gray-600 text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Receiving Card Type</label>
                      <Select
                        value={formData.receivingCardType}
                        onChange={(e) => updateFormData('receivingCardType', e.target.value)}
                        required
                      >
                        {Object.values(ReceivingCardType).map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Brightness (nits)</label>
                      <Input
                        type="number"
                        value={formData.brightnessNits}
                        onChange={(e) => updateFormData('brightnessNits', e.target.value)}
                        placeholder="5000"
                        required
                        className="bg-gray-700 border-gray-600 text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Refresh Rate (Hz)</label>
                      <Input
                        type="number"
                        value={formData.refreshRateHz}
                        onChange={(e) => updateFormData('refreshRateHz', e.target.value)}
                        placeholder="3840"
                        required
                        className="bg-gray-700 border-gray-600 text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Scan Rate</label>
                      <Input
                        type="number"
                        value={formData.scanRate}
                        onChange={(e) => updateFormData('scanRate', e.target.value)}
                        placeholder="1/16"
                        className="bg-gray-700 border-gray-600 text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Unit Cost ($)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.unitCost}
                        onChange={(e) => updateFormData('unitCost', e.target.value)}
                        placeholder="450.00"
                        required
                        className="bg-gray-700 border-gray-600 text-gray-100"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false)
                    setEditingProduct(null)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Products List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(product.category)}
                  <span className="text-lg text-gray-100">{product.name}</span>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong className="text-gray-300">Manufacturer:</strong> <span className="text-gray-400">{product.manufacturer}</span></p>
                <p><strong className="text-gray-300">Model:</strong> <span className="text-gray-400">{product.modelNumber}</span></p>
                <p><strong className="text-gray-300">Category:</strong> <span className="text-gray-400">{product.category.replace(/_/g, ' ')}</span></p>
                {product.subcategory && (
                  <p><strong className="text-gray-300">Subcategory:</strong> <span className="text-gray-400">{product.subcategory}</span></p>
                )}
                <p><strong className="text-gray-300">Cost:</strong> <span className="text-gray-400">${product.unitCost}</span></p>
                <p><strong className="text-gray-300">Price:</strong> <span className="text-gray-400">${product.unitPrice || product.unitCost}</span></p>
                
                {product.ledTile && (
                  <div className="mt-4 p-3 bg-gray-700 rounded">
                    <p className="font-semibold text-gray-200">LED Tile Specs:</p>
                    <p className="text-gray-400">P{product.ledTile.pixelPitchMm}mm • {product.ledTile.pixelWidth}×{product.ledTile.pixelHeight}</p>
                    <p className="text-gray-400">{product.ledTile.physicalWidthMm}×{product.ledTile.physicalHeightMm}mm • {product.ledTile.avgPowerW}W</p>
                    <p className="text-gray-400">{product.ledTile.brightnessNits} nits • {product.ledTile.receivingCardType}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Database className="w-12 h-12 text-gray-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Products Found</h3>
            <p className="text-gray-400 text-center">
              {searchTerm || selectedCategory 
                ? 'No products match your search criteria' 
                : 'Get started by adding your first product to the database'
              }
            </p>
            {!searchTerm && !selectedCategory && (
              <Button 
                onClick={() => setShowForm(true)} 
                className="mt-4 bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Product
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ProductManager
