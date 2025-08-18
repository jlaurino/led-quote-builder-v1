'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Search, Plus, Package, Monitor, Zap, Cpu, Lightbulb, Volume2, Camera, Wrench, Network, Cable, Settings, Database } from 'lucide-react'
import { ProductCategory } from '@prisma/client'

interface Product {
  id: number
  name: string
  category: ProductCategory
  manufacturer?: string
  modelNumber?: string
  unitCost: number
  unitPrice?: number
  // LED Tile specific fields
  ledTile?: {
    pixelPitchMm: number
    physicalWidthMm: number
    physicalHeightMm: number
    pixelWidth: number
    pixelHeight: number
    weightKg: number
    maxPowerW: number
    avgPowerW: number
    receivingCardType: string
    brightnessNits: number
    refreshRateHz: number
    scanRate?: number
    buyPrice: number
    sellPrice: number
  }
  // Other spec types can be added here
  ledProcessor?: any
  powerEquipment?: any
  computing?: any
  lighting?: any
  audio?: any
  camera?: any
  networking?: any
  cable?: any
  hardware?: any
}

interface ProductSelectorProps {
  onAddProduct: (product: Product, quantity: number) => void
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ onAddProduct }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | ''>('')
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState('1')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.modelNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (category: ProductCategory) => {
    switch (category) {
      case ProductCategory.LED_TILE: return <Monitor className="w-4 h-4" />
      case ProductCategory.LED_PROCESSOR: return <Cpu className="w-4 h-4" />
      case ProductCategory.POWER_EQUIPMENT: return <Zap className="w-4 h-4" />
      case ProductCategory.COMPUTING: return <Cpu className="w-4 h-4" />
      case ProductCategory.LIGHTING: return <Lightbulb className="w-4 h-4" />
      case ProductCategory.AUDIO: return <Volume2 className="w-4 h-4" />
      case ProductCategory.CAMERA: return <Camera className="w-4 h-4" />
      case ProductCategory.NETWORKING: return <Network className="w-4 h-4" />
      case ProductCategory.CABLE: return <Cable className="w-4 h-4" />
      case ProductCategory.HARDWARE: return <Settings className="w-4 h-4" />
      default: return <Package className="w-4 h-4" />
    }
  }

  const getCategoryName = (category: ProductCategory) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const getProductDetails = (product: Product) => {
    if (product.ledTile) {
      return (
        <div className="text-xs text-gray-400 space-y-1">
          <div>P{product.ledTile.pixelPitchMm}mm • {product.ledTile.pixelWidth}×{product.ledTile.pixelHeight}</div>
          <div>{product.ledTile.physicalWidthMm}×{product.ledTile.physicalHeightMm}mm • {product.ledTile.avgPowerW}W</div>
        </div>
      )
    }
    if (product.ledProcessor) {
      return (
        <div className="text-xs text-gray-400">
          {product.ledProcessor.inputs} inputs • {product.ledProcessor.outputs} outputs
        </div>
      )
    }
    if (product.powerEquipment) {
      return (
        <div className="text-xs text-gray-400">
          {product.powerEquipment.capacityW}W • {product.powerEquipment.phase}
        </div>
      )
    }
    return null
  }

  const handleAddProduct = () => {
    if (selectedProduct && quantity) {
      onAddProduct(selectedProduct, parseInt(quantity))
      setSelectedProduct(null)
      setQuantity('1')
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
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-100">
          <Package className="w-5 h-5" />
          <span>Product Selector</span>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Database className="w-4 h-4" />
            <span>{products.length} products</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
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
                {getCategoryName(category)}
              </option>
            ))}
          </Select>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-2">
          {filteredProducts.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              {searchTerm || selectedCategory ? 'No products found' : 'No products available'}
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedProduct?.id === product.id
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'
                }`}
                onClick={() => setSelectedProduct(product)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(product.category)}
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {product.manufacturer} {product.modelNumber && `• ${product.modelNumber}`}
                    </div>
                    {getProductDetails(product)}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${product.unitPrice || product.unitCost}</div>
                    <div className="text-xs text-gray-400">
                      {getCategoryName(product.category)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedProduct && (
          <div className="p-4 bg-gray-700 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-200">Selected: {selectedProduct.name}</span>
              <span className="text-lg font-bold text-gray-100">
                ${selectedProduct.unitPrice || selectedProduct.unitCost}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-300">Quantity:</label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-20 bg-gray-600 border-gray-500 text-gray-100"
              />
              <Button
                onClick={handleAddProduct}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add to Quote
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ProductSelector



