'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Calculator, Monitor, Ruler, Database } from 'lucide-react'
import { ProductCategory } from '@prisma/client'

interface DisplayCalculatorProps {
  onCalculate: (results: DisplayCalculationResults) => void
}

export interface DisplayCalculationResults {
  totalTiles: number
  totalWidth: number
  totalHeight: number
  totalArea: number
  totalPower: number
  recommendedProcessor: string
  estimatedCost: number
  selectedTile: any
}

interface LEDTile {
  id: number
  name: string
  manufacturer: string
  modelNumber: string
  ledTile: {
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
  unitCost: number
  unitPrice: number
}

const DisplayCalculator: React.FC<DisplayCalculatorProps> = ({ onCalculate }) => {
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [selectedTile, setSelectedTile] = useState<LEDTile | null>(null)
  const [ledTiles, setLedTiles] = useState<LEDTile[]>([])
  const [loading, setLoading] = useState(true)
  const [calculationMode, setCalculationMode] = useState<'manual' | 'database'>('database')

  useEffect(() => {
    fetchLEDTiles()
  }, [])

  const fetchLEDTiles = async () => {
    try {
      const response = await fetch('/api/products?category=LED_TILE')
      const data = await response.json()
      setLedTiles(data)
      if (data.length > 0) {
        setSelectedTile(data[0])
      }
    } catch (error) {
      console.error('Error fetching LED tiles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCalculate = () => {
    const widthNum = parseFloat(width)
    const heightNum = parseFloat(height)

    if (!widthNum || !heightNum) {
      alert('Please fill in display dimensions')
      return
    }

    if (calculationMode === 'database' && !selectedTile) {
      alert('Please select an LED tile from the database')
      return
    }

    let tileWidth: number, tileHeight: number, tilePower: number, tileCost: number

    if (calculationMode === 'database' && selectedTile) {
      // Use database tile data
      tileWidth = selectedTile.ledTile.physicalWidthMm / 1000 // Convert to meters
      tileHeight = selectedTile.ledTile.physicalHeightMm / 1000
      tilePower = selectedTile.ledTile.avgPowerW
      tileCost = selectedTile.unitPrice || selectedTile.ledTile.sellPrice
    } else {
      // Manual mode (fallback)
      alert('Please select database mode and choose an LED tile')
      return
    }

    const tilesX = Math.ceil(widthNum / tileWidth)
    const tilesY = Math.ceil(heightNum / tileHeight)
    const totalTiles = tilesX * tilesY
    const totalArea = widthNum * heightNum
    const totalPower = totalTiles * tilePower
    const estimatedCost = totalTiles * tileCost

    // Enhanced processor recommendation based on actual tile specs
    const totalPixels = (widthNum * 1000 / selectedTile.ledTile.pixelPitchMm) * 
                       (heightNum * 1000 / selectedTile.ledTile.pixelPitchMm)
    
    let recommendedProcessor = 'Basic LED Processor'
    if (totalPixels > 2000000) {
      recommendedProcessor = 'Professional LED Processor (4K+)'
    } else if (totalPixels > 1000000) {
      recommendedProcessor = 'Standard LED Processor (2K)'
    } else if (totalPixels > 500000) {
      recommendedProcessor = 'Entry LED Processor (1K)'
    }

    const results: DisplayCalculationResults = {
      totalTiles,
      totalWidth: widthNum,
      totalHeight: heightNum,
      totalArea,
      totalPower,
      recommendedProcessor,
      estimatedCost,
      selectedTile,
    }

    onCalculate(results)
  }

  const handleTileChange = (tileId: string) => {
    const tile = ledTiles.find(t => t.id.toString() === tileId)
    setSelectedTile(tile || null)
  }

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="flex justify-center items-center h-32">
          <div className="text-gray-400">Loading LED tiles...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-100">
          <Monitor className="w-5 h-5" />
          <span>Display Calculator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Calculation Mode Selection */}
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="database"
              checked={calculationMode === 'database'}
              onChange={(e) => setCalculationMode(e.target.value as 'manual' | 'database')}
              className="text-blue-600"
            />
            <span className="text-gray-300">Use Database Tiles</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="manual"
              checked={calculationMode === 'manual'}
              onChange={(e) => setCalculationMode(e.target.value as 'manual' | 'database')}
              className="text-blue-600"
            />
            <span className="text-gray-300">Manual Entry</span>
          </label>
        </div>

        {/* Display Dimensions */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Display Width (m)
            </label>
            <Input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="e.g., 5.0"
              className="bg-gray-700 border-gray-600 text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Display Height (m)
            </label>
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="e.g., 3.0"
              className="bg-gray-700 border-gray-600 text-gray-100"
            />
          </div>
        </div>

        {/* LED Tile Selection */}
        {calculationMode === 'database' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select LED Tile
              </label>
              <Select
                value={selectedTile?.id.toString() || ''}
                onChange={(e) => handleTileChange(e.target.value)}
              >
                <option value="">Choose an LED tile...</option>
                {ledTiles.map((tile) => (
                  <option key={tile.id} value={tile.id.toString()}>
                    {tile.manufacturer} {tile.name} - P{tile.ledTile.pixelPitchMm}mm
                  </option>
                ))}
              </Select>
            </div>

            {/* Selected Tile Details */}
            {selectedTile && (
              <div className="p-4 bg-gray-700 rounded-lg space-y-2">
                <h4 className="font-semibold text-gray-200">Selected Tile Details:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                  <div><strong>Manufacturer:</strong> {selectedTile.manufacturer}</div>
                  <div><strong>Model:</strong> {selectedTile.modelNumber}</div>
                  <div><strong>Pixel Pitch:</strong> {selectedTile.ledTile.pixelPitchMm}mm</div>
                  <div><strong>Physical Size:</strong> {selectedTile.ledTile.physicalWidthMm}×{selectedTile.ledTile.physicalHeightMm}mm</div>
                  <div><strong>Resolution:</strong> {selectedTile.ledTile.pixelWidth}×{selectedTile.ledTile.pixelHeight}</div>
                  <div><strong>Brightness:</strong> {selectedTile.ledTile.brightnessNits} nits</div>
                  <div><strong>Power:</strong> {selectedTile.ledTile.avgPowerW}W avg</div>
                  <div><strong>Price:</strong> ${selectedTile.unitPrice || selectedTile.ledTile.sellPrice}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Manual Entry Fields (hidden when using database) */}
        {calculationMode === 'manual' && (
          <div className="space-y-4 p-4 bg-gray-700 rounded-lg">
            <p className="text-gray-300 text-sm">
              Manual entry mode is disabled. Please use database tiles for accurate calculations.
            </p>
          </div>
        )}

        <Button
          onClick={handleCalculate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={!width || !height || (calculationMode === 'database' && !selectedTile)}
        >
          <Calculator className="w-4 h-4 mr-2" />
          Calculate Display Requirements
        </Button>

        {/* Database Status */}
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Database className="w-4 h-4" />
          <span>
            {ledTiles.length} LED tiles available in database
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export default DisplayCalculator



