import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Search, Plus, Package, Monitor, Zap, Cpu, Lightbulb, Volume2, Camera, Wrench, Network, Cable, Settings } from 'lucide-react'

interface Product {
  id: number
  name: string
  category: string
  manufacturer?: string
  modelNumber?: string
  unitCost: number
  unitPrice?: number
}

interface ProductSelectorProps {
  onAddProduct: (product: Product, quantity: number) => void
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ onAddProduct }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState('1')

  // Mock products data - in real app this would come from API
  const mockProducts: Product[] = [
    { id: 1, name: 'P2.5 LED Tile', category: 'LED_TILE', manufacturer: 'NovaStar', unitCost: 150, unitPrice: 200 },
    { id: 2, name: 'P3 LED Tile', category: 'LED_TILE', manufacturer: 'NovaStar', unitCost: 120, unitPrice: 160 },
    { id: 3, name: 'Professional LED Processor', category: 'LED_PROCESSOR', manufacturer: 'NovaStar', unitCost: 2500, unitPrice: 3200 },
    { id: 4, name: 'Standard LED Processor', category: 'LED_PROCESSOR', manufacturer: 'NovaStar', unitCost: 1200, unitPrice: 1500 },
    { id: 5, name: '5kW Power Supply', category: 'POWER_EQUIPMENT', manufacturer: 'Mean Well', unitCost: 800, unitPrice: 1000 },
    { id: 6, name: '10kW Power Supply', category: 'POWER_EQUIPMENT', manufacturer: 'Mean Well', unitCost: 1500, unitPrice: 1900 },
    { id: 7, name: 'Media Server', category: 'COMPUTING', manufacturer: 'Disguise', unitCost: 8000, unitPrice: 10000 },
    { id: 8, name: 'LED Par Light', category: 'LIGHTING', manufacturer: 'Chauvet', unitCost: 200, unitPrice: 280 },
    { id: 9, name: 'Line Array Speaker', category: 'AUDIO', manufacturer: 'JBL', unitCost: 1200, unitPrice: 1600 },
    { id: 10, name: 'PTZ Camera', category: 'CAMERA', manufacturer: 'Sony', unitCost: 2500, unitPrice: 3200 },
  ]

  useEffect(() => {
    setProducts(mockProducts)
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.modelNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'LED_TILE': return <Monitor className="w-4 h-4" />
      case 'LED_PROCESSOR': return <Cpu className="w-4 h-4" />
      case 'POWER_EQUIPMENT': return <Zap className="w-4 h-4" />
      case 'COMPUTING': return <Cpu className="w-4 h-4" />
      case 'LIGHTING': return <Lightbulb className="w-4 h-4" />
      case 'AUDIO': return <Volume2 className="w-4 h-4" />
      case 'CAMERA': return <Camera className="w-4 h-4" />
      case 'NETWORKING': return <Network className="w-4 h-4" />
      case 'CABLE': return <Cable className="w-4 h-4" />
      default: return <Package className="w-4 h-4" />
    }
  }

  const getCategoryName = (category: string) => {
    return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const handleAddProduct = () => {
    if (selectedProduct && quantity) {
      onAddProduct(selectedProduct, parseInt(quantity))
      setSelectedProduct(null)
      setQuantity('1')
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-100">
          <Package className="w-5 h-5" />
          <span>Product Selector</span>
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
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-700 border-gray-600 text-gray-100 w-48"
          >
            <option value="">All Categories</option>
            <option value="LED_TILE">LED Tile</option>
            <option value="LED_PROCESSOR">LED Processor</option>
            <option value="POWER_EQUIPMENT">Power Equipment</option>
            <option value="COMPUTING">Computing</option>
            <option value="LIGHTING">Lighting</option>
            <option value="AUDIO">Audio</option>
            <option value="CAMERA">Camera</option>
            <option value="NETWORKING">Networking</option>
            <option value="CABLE">Cable</option>
          </Select>
        </div>

        <div className="max-h-64 overflow-y-auto space-y-2">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedProduct?.id === product.id
                  ? 'bg-blue-600/20 border-blue-500/30'
                  : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
              }`}
              onClick={() => setSelectedProduct(product)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getCategoryIcon(product.category)}
                  <div>
                    <p className="text-sm font-medium text-gray-100">{product.name}</p>
                    <p className="text-xs text-gray-400">
                      {product.manufacturer} {product.modelNumber && `• ${product.modelNumber}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-100">${product.unitPrice || product.unitCost}</p>
                  <p className="text-xs text-gray-400">{getCategoryName(product.category)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedProduct && (
          <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-100">{selectedProduct.name}</p>
                <p className="text-xs text-gray-400">
                  {selectedProduct.manufacturer} {selectedProduct.modelNumber && `• ${selectedProduct.modelNumber}`}
                </p>
              </div>
              <p className="text-sm font-medium text-gray-100">${selectedProduct.unitPrice || selectedProduct.unitCost}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                className="bg-gray-600 border-gray-500 text-gray-100 w-20"
              />
              <Button
                onClick={handleAddProduct}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
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



