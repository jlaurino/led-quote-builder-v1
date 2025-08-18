import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, Trash2, Edit, DollarSign, Package, Calculator } from 'lucide-react'

interface QuoteItem {
  id: number
  name: string
  category: string
  manufacturer?: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

interface QuoteSummaryProps {
  items: QuoteItem[]
  subtotal: number
  markup: number
  fees: number
  total: number
  onRemoveItem: (id: number) => void
  onUpdateQuantity: (id: number, quantity: number) => void
  onExportQuote: () => void
  onExportBOM: () => void
}

const QuoteSummary: React.FC<QuoteSummaryProps> = ({
  items,
  subtotal,
  markup,
  fees,
  total,
  onRemoveItem,
  onUpdateQuantity,
  onExportQuote,
  onExportBOM,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'LED_TILE': return <Package className="w-4 h-4" />
      case 'LED_PROCESSOR': return <Calculator className="w-4 h-4" />
      case 'POWER_EQUIPMENT': return <DollarSign className="w-4 h-4" />
      default: return <Package className="w-4 h-4" />
    }
  }

  const handleQuantityChange = (id: number, newQuantity: string) => {
    const quantity = parseInt(newQuantity) || 1
    onUpdateQuantity(id, quantity)
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-gray-100">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Quote Summary</span>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={onExportQuote}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Quote
            </Button>
            <Button
              onClick={onExportBOM}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export BOM
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No items added to quote</p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg border border-gray-600"
              >
                <div className="flex items-center space-x-3 flex-1">
                  {getCategoryIcon(item.category)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-100">{item.name}</p>
                    <p className="text-xs text-gray-400">
                      {item.manufacturer} • Qty: {item.quantity} × ${item.unitPrice}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    min="1"
                    className="w-16 px-2 py-1 text-sm bg-gray-600 border border-gray-500 rounded text-gray-100"
                  />
                  <p className="text-sm font-medium text-gray-100 w-20 text-right">
                    ${item.totalPrice.toFixed(2)}
                  </p>
                  <Button
                    onClick={() => onRemoveItem(item.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals */}
        <div className="border-t border-gray-600 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Subtotal:</span>
            <span className="text-gray-100">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Markup ({((markup / subtotal) * 100).toFixed(1)}%):</span>
            <span className="text-gray-100">${markup.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Fees:</span>
            <span className="text-gray-100">${fees.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold border-t border-gray-600 pt-2">
            <span className="text-gray-100">Total:</span>
            <span className="text-blue-400">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-600">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">{items.length}</p>
            <p className="text-xs text-gray-400">Items</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">{items.reduce((sum, item) => sum + item.quantity, 0)}</p>
            <p className="text-xs text-gray-400">Units</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">{((markup / subtotal) * 100).toFixed(1)}%</p>
            <p className="text-xs text-gray-400">Markup</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default QuoteSummary



