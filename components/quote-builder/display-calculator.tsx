import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Calculator, Monitor, Ruler } from 'lucide-react'

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
}

const DisplayCalculator: React.FC<DisplayCalculatorProps> = ({ onCalculate }) => {
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [pixelPitch, setPixelPitch] = useState('')
  const [tileWidth, setTileWidth] = useState('')
  const [tileHeight, setTileHeight] = useState('')
  const [tilePower, setTilePower] = useState('')
  const [tileCost, setTileCost] = useState('')

  const handleCalculate = () => {
    const widthNum = parseFloat(width)
    const heightNum = parseFloat(height)
    const pixelPitchNum = parseFloat(pixelPitch)
    const tileWidthNum = parseFloat(tileWidth)
    const tileHeightNum = parseFloat(tileHeight)
    const tilePowerNum = parseFloat(tilePower)
    const tileCostNum = parseFloat(tileCost)

    if (!widthNum || !heightNum || !pixelPitchNum || !tileWidthNum || !tileHeightNum || !tilePowerNum || !tileCostNum) {
      alert('Please fill in all fields')
      return
    }

    const tilesX = Math.ceil(widthNum / tileWidthNum)
    const tilesY = Math.ceil(heightNum / tileHeightNum)
    const totalTiles = tilesX * tilesY
    const totalArea = widthNum * heightNum
    const totalPower = totalTiles * tilePowerNum
    const estimatedCost = totalTiles * tileCostNum

    // Simple processor recommendation based on resolution
    const totalPixels = (widthNum * 1000 / pixelPitchNum) * (heightNum * 1000 / pixelPitchNum)
    let recommendedProcessor = 'Basic LED Processor'
    if (totalPixels > 1000000) {
      recommendedProcessor = 'Professional LED Processor'
    } else if (totalPixels > 500000) {
      recommendedProcessor = 'Standard LED Processor'
    }

    const results: DisplayCalculationResults = {
      totalTiles,
      totalWidth: widthNum,
      totalHeight: heightNum,
      totalArea,
      totalPower,
      recommendedProcessor,
      estimatedCost,
    }

    onCalculate(results)
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

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Pixel Pitch (mm)
          </label>
          <Input
            type="number"
            value={pixelPitch}
            onChange={(e) => setPixelPitch(e.target.value)}
            placeholder="e.g., 2.5"
            className="bg-gray-700 border-gray-600 text-gray-100"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tile Width (mm)
            </label>
            <Input
              type="number"
              value={tileWidth}
              onChange={(e) => setTileWidth(e.target.value)}
              placeholder="e.g., 500"
              className="bg-gray-700 border-gray-600 text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tile Height (mm)
            </label>
            <Input
              type="number"
              value={tileHeight}
              onChange={(e) => setTileHeight(e.target.value)}
              placeholder="e.g., 500"
              className="bg-gray-700 border-gray-600 text-gray-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tile Power (W)
            </label>
            <Input
              type="number"
              value={tilePower}
              onChange={(e) => setTilePower(e.target.value)}
              placeholder="e.g., 45"
              className="bg-gray-700 border-gray-600 text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tile Cost ($)
            </label>
            <Input
              type="number"
              value={tileCost}
              onChange={(e) => setTileCost(e.target.value)}
              placeholder="e.g., 150"
              className="bg-gray-700 border-gray-600 text-gray-100"
            />
          </div>
        </div>

        <Button
          onClick={handleCalculate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Calculator className="w-4 h-4 mr-2" />
          Calculate Display Requirements
        </Button>
      </CardContent>
    </Card>
  )
}

export default DisplayCalculator



