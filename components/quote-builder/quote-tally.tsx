'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Package, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'

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

interface QuoteTallyProps {
  items: QuoteItem[]
  onRemoveItem: (id: number) => void
  onUpdateQuantity: (id: number, quantity: number) => void
}

const QuoteTally: React.FC<QuoteTallyProps> = ({ items, onRemoveItem, onUpdateQuantity }) => {
  // Calculate totals using different price types
  const buyPriceTotal = items.reduce((sum, item) => {
    const buyPrice = item.buyPrice || item.unitCost || item.unitPrice
    return sum + (buyPrice * item.quantity)
  }, 0)

  const sellPriceTotal = items.reduce((sum, item) => {
    const sellPrice = item.sellPrice || item.unitPrice
    return sum + (sellPrice * item.quantity)
  }, 0)

  const profitMargin = sellPriceTotal - buyPriceTotal
  const profitPercentage = buyPriceTotal > 0 ? ((profitMargin / buyPriceTotal) * 100) : 0

  const handleQuantityChange = (id: number, newQuantity: string) => {
    const quantity = parseInt(newQuantity) || 0
    if (quantity >= 0) {
      onUpdateQuantity(id, quantity)
    }
  }

  if (items.length === 0) {
    return (
      <Card className="bg-gray-800 border-gray-700 h-fit">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-100">
            <Package className="w-5 h-5" />
            <span>Quote Tally</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No items in quote yet</p>
            <p className="text-sm text-gray-500">Add products to see running totals</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700 h-fit">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-100">
          <Package className="w-5 h-5" />
          <span>Quote Tally</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="bg-gray-700 rounded-lg p-3 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-200 truncate">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-400">
                    {item.manufacturer && `${item.manufacturer} • `}{item.category}
                  </p>
                </div>
                <Button
                  onClick={() => onRemoveItem(item.id)}
                  size="sm"
                  variant="ghost"
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <label className="text-xs text-gray-400">Qty:</label>
                  <input
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    className="w-16 px-2 py-1 text-xs bg-gray-600 border border-gray-500 rounded text-gray-100"
                  />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-200">
                    ${((item.sellPrice || item.unitPrice) * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">
                    ${(item.sellPrice || item.unitPrice).toFixed(2)} each
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Totals Section */}
        <div className="border-t border-gray-600 pt-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Items:</span>
            <span className="text-sm text-gray-200">{items.length}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Total Quantity:</span>
            <span className="text-sm text-gray-200">
              {items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>

          {/* Buy Price Total */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">Buy Price Total:</span>
            </div>
            <span className="text-sm font-medium text-green-400">
              ${buyPriceTotal.toFixed(2)}
            </span>
          </div>

          {/* Sell Price Total */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">Sell Price Total:</span>
            </div>
            <span className="text-sm font-medium text-blue-400">
              ${sellPriceTotal.toFixed(2)}
            </span>
          </div>

          {/* Profit Margin */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-600">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-gray-300">Profit Margin:</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-yellow-400">
                ${profitMargin.toFixed(2)}
              </span>
              <p className="text-xs text-gray-400">
                {profitPercentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default QuoteTally
