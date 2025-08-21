'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Calculator, Monitor, Database, CheckCircle, Package, ArrowRight } from 'lucide-react'

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
  inputMethod: 'feet' | 'meters' | 'tiles'
  inputValues: {
    width: string
    height: string
  }
  nickname?: string
  isContinue?: boolean
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
  const [inputMethod, setInputMethod] = useState<'feet' | 'meters' | 'tiles'>('meters')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [selectedTile, setSelectedTile] = useState<LEDTile | null>(null)
  const [ledTiles, setLedTiles] = useState<LEDTile[]>([])
  const [loading, setLoading] = useState(true)
  const [calculationResults, setCalculationResults] = useState<DisplayCalculationResults | null>(null)
  const [hasCalculated, setHasCalculated] = useState(false)
  const [displayNickname, setDisplayNickname] = useState('')

  useEffect(() => {
    fetchLEDTiles()
  }, [])

  const fetchLEDTiles = async () => {
    try {
      const response = await fetch('/api/products?category=LED_TILE')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      // Ensure data is always an array
      const tiles = Array.isArray(data) ? data : []
      setLedTiles(tiles)
      if (tiles.length > 0) {
        setSelectedTile(tiles[0])
      }
    } catch (error) {
      console.error('Error fetching LED tiles:', error)
      setLedTiles([])
    } finally {
      setLoading(false)
    }
  }

  const handleCalculate = () => {
    if (!width || !height) {
      alert('Please fill in display dimensions')
      return
    }

    if (!selectedTile) {
      alert('Please select an LED tile from the database')
      return
    }

    // Convert input values to meters for calculation
    let widthInMeters: number, heightInMeters: number

    switch (inputMethod) {
      case 'feet':
        widthInMeters = parseFloat(width) * 0.3048
        heightInMeters = parseFloat(height) * 0.3048
        break
      case 'meters':
        widthInMeters = parseFloat(width)
        heightInMeters = parseFloat(height)
        break
      case 'tiles':
        const tileWidthInMeters = selectedTile.ledTile.physicalWidthMm / 1000
        const tileHeightInMeters = selectedTile.ledTile.physicalHeightMm / 1000
        widthInMeters = parseFloat(width) * tileWidthInMeters
        heightInMeters = parseFloat(height) * tileHeightInMeters
        break
      default:
        widthInMeters = parseFloat(width)
        heightInMeters = parseFloat(height)
    }

    // Calculate using database tile data
    const tileWidth = selectedTile.ledTile.physicalWidthMm / 1000 // Convert to meters
    const tileHeight = selectedTile.ledTile.physicalHeightMm / 1000
    const tilePower = selectedTile.ledTile.avgPowerW
    const tileCost = selectedTile.unitPrice || selectedTile.ledTile.sellPrice

    // Calculate tiles needed (less than or equal to requested size)
    const tilesX = Math.floor(widthInMeters / tileWidth)
    const tilesY = Math.floor(heightInMeters / tileHeight)
    const totalTiles = tilesX * tilesY

    // Calculate actual display dimensions based on tiles used
    const actualWidth = tilesX * tileWidth
    const actualHeight = tilesY * tileHeight
    const totalArea = actualWidth * actualHeight
    const totalPower = totalTiles * selectedTile.ledTile.maxPowerW // Use max power for total power
    const estimatedCost = totalTiles * tileCost

    // Enhanced processor recommendation based on actual tile specs
    const totalPixels = (tilesX * selectedTile.ledTile.pixelWidth) * 
                       (tilesY * selectedTile.ledTile.pixelHeight)
    
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
      totalWidth: actualWidth,
      totalHeight: actualHeight,
      totalArea,
      totalPower,
      recommendedProcessor,
      estimatedCost,
      selectedTile,
      inputMethod,
      inputValues: {
        width,
        height
      }
    }

    setCalculationResults(results)
    setHasCalculated(true)
  }

  const handleAddToQuote = () => {
    if (calculationResults) {
      const resultsWithNickname = {
        ...calculationResults,
        nickname: displayNickname || `Display ${Date.now()}`
      }
      onCalculate(resultsWithNickname)
      
      // Reset the form for adding another display
      setWidth('')
      setHeight('')
      setDisplayNickname('')
      setHasCalculated(false)
      setCalculationResults(null)
    }
  }

  const handleContinue = () => {
    // This will be handled by the parent component to move to next step
    // We'll use a special flag to indicate this is a "continue" action
    onCalculate({ ...calculationResults!, isContinue: true })
  }

  const handleTileChange = (tileId: string) => {
    const tile = ledTiles.find(t => t.id.toString() === tileId)
    setSelectedTile(tile || null)
    // Reset calculation when tile changes
    setHasCalculated(false)
    setCalculationResults(null)
  }

  const handleInputChange = () => {
    // Reset calculation when inputs change
    setHasCalculated(false)
    setCalculationResults(null)
  }

  const getInputLabels = () => {
    switch (inputMethod) {
      case 'feet':
        return { widthLabel: 'Display Width (ft)', heightLabel: 'Display Height (ft)' }
      case 'meters':
        return { widthLabel: 'Display Width (m)', heightLabel: 'Display Height (m)' }
      case 'tiles':
        return { widthLabel: 'Number of Tiles (Width)', heightLabel: 'Number of Tiles (Height)' }
      default:
        return { widthLabel: 'Display Width', heightLabel: 'Display Height' }
    }
  }

  const getInputPlaceholders = () => {
    switch (inputMethod) {
      case 'feet':
        return { widthPlaceholder: 'e.g., 16.4', heightPlaceholder: 'e.g., 9.8' }
      case 'meters':
        return { widthPlaceholder: 'e.g., 5.0', heightPlaceholder: 'e.g., 3.0' }
      case 'tiles':
        return { widthPlaceholder: 'e.g., 10', heightPlaceholder: 'e.g., 6' }
      default:
        return { widthPlaceholder: 'Enter width', heightPlaceholder: 'Enter height' }
    }
  }

  const metersToFeetInches = (meters: number): string => {
    const totalInches = meters * 39.3701 // Convert meters to inches
    const feet = Math.floor(totalInches / 12)
    const inches = totalInches % 12
    
    // Round to nearest 1/2 inch
    const roundedInches = Math.round(inches * 2) / 2
    
    if (roundedInches === 0) {
      return `${feet}'`
    } else if (roundedInches === 12) {
      return `${feet + 1}'`
    } else {
      return `${feet}' ${roundedInches}"`
    }
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

  const { widthLabel, heightLabel } = getInputLabels()
  const { widthPlaceholder, heightPlaceholder } = getInputPlaceholders()

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-100">
          <Monitor className="w-5 h-5" />
          <span>Display Calculator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Method Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Input Method
          </label>
          <div className="flex space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="feet"
                checked={inputMethod === 'feet'}
                onChange={(e) => {
                  setInputMethod(e.target.value as 'feet' | 'meters' | 'tiles')
                  handleInputChange()
                }}
                className="text-blue-600"
              />
              <span className="text-gray-300">Feet</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="meters"
                checked={inputMethod === 'meters'}
                onChange={(e) => {
                  setInputMethod(e.target.value as 'feet' | 'meters' | 'tiles')
                  handleInputChange()
                }}
                className="text-blue-600"
              />
              <span className="text-gray-300">Meters</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="tiles"
                checked={inputMethod === 'tiles'}
                onChange={(e) => {
                  setInputMethod(e.target.value as 'feet' | 'meters' | 'tiles')
                  handleInputChange()
                }}
                className="text-blue-600"
              />
              <span className="text-gray-300">Number of Tiles</span>
            </label>
          </div>
        </div>

        {/* Display Dimensions */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {widthLabel}
            </label>
            <Input
              type="number"
              value={width}
              onChange={(e) => {
                setWidth(e.target.value)
                handleInputChange()
              }}
              placeholder={widthPlaceholder}
              className="bg-gray-700 border-gray-600 text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {heightLabel}
            </label>
            <Input
              type="number"
              value={height}
              onChange={(e) => {
                setHeight(e.target.value)
                handleInputChange()
              }}
              placeholder={heightPlaceholder}
              className="bg-gray-700 border-gray-600 text-gray-100"
            />
          </div>
        </div>

        {/* LED Tile Selection */}
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

        {/* Calculate Button */}
        <Button
          onClick={handleCalculate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={!width || !height || !selectedTile}
        >
          <Calculator className="w-4 h-4 mr-2" />
          Calculate
        </Button>

        {/* Display Results */}
        {hasCalculated && calculationResults && selectedTile && (
          <div className="p-4 bg-gray-700 rounded-lg space-y-3">
            <h4 className="font-semibold text-gray-200">Display Results:</h4>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-300">
              <div><strong>Total Tiles:</strong> {calculationResults.totalTiles}</div>
              <div><strong>Array Size:</strong> {Math.floor(calculationResults.totalWidth / (selectedTile.ledTile.physicalWidthMm / 1000))} × {Math.floor(calculationResults.totalHeight / (selectedTile.ledTile.physicalHeightMm / 1000))} tiles</div>
              <div><strong>Display Size (Metric):</strong> {calculationResults.totalWidth.toFixed(2)}m × {calculationResults.totalHeight.toFixed(2)}m</div>
              <div><strong>Display Size (Imperial):</strong> {metersToFeetInches(calculationResults.totalWidth)} × {metersToFeetInches(calculationResults.totalHeight)}</div>
              <div><strong>Total Wall Resolution:</strong> {Math.floor(calculationResults.totalWidth / (selectedTile.ledTile.physicalWidthMm / 1000)) * selectedTile.ledTile.pixelWidth} × {Math.floor(calculationResults.totalHeight / (selectedTile.ledTile.physicalHeightMm / 1000)) * selectedTile.ledTile.pixelHeight} pixels</div>
              <div><strong>Total Area:</strong> {calculationResults.totalArea.toFixed(2)} m²</div>
              <div><strong>Total Power:</strong> {calculationResults.totalPower.toFixed(0)}W</div>
              <div><strong>Average Power (Total):</strong> {(calculationResults.totalTiles * selectedTile.ledTile.avgPowerW).toFixed(0)}W</div>
               <div><strong>Maximum BTU/hr:</strong> {(calculationResults.totalTiles * selectedTile.ledTile.maxPowerW * 3.412141).toFixed(0)} BTU/hr</div>
               <div><strong>Average BTU/hr:</strong> {(calculationResults.totalTiles * selectedTile.ledTile.avgPowerW * 3.412141).toFixed(0)} BTU/hr</div>
              <div><strong>Processor:</strong> {calculationResults.recommendedProcessor}</div>
              <div><strong>Estimated Cost:</strong> ${calculationResults.estimatedCost.toFixed(2)}</div>
            </div>
          </div>
        )}

                 {/* Display Nickname Field */}
         {hasCalculated && (
           <div className="space-y-2">
             <label className="block text-sm font-medium text-gray-300">
               Display Nickname (Optional)
             </label>
             <Input
               type="text"
               value={displayNickname}
               onChange={(e) => setDisplayNickname(e.target.value)}
               placeholder="e.g., Main Stage Display, Side Wall, etc."
               className="bg-gray-700 border-gray-600 text-gray-100"
             />
           </div>
         )}

         {/* Add to Quote Button */}
         {hasCalculated && (
           <Button
             onClick={handleAddToQuote}
             className="w-full bg-blue-600 hover:bg-blue-700 text-white"
           >
             <Package className="w-4 h-4 mr-2" />
             Add to Quote
           </Button>
         )}

         {/* Continue Button */}
         {hasCalculated && (
           <Button
             onClick={handleContinue}
             className="w-full bg-green-600 hover:bg-green-700 text-white"
           >
             <ArrowRight className="w-4 h-4 mr-2" />
             Continue to Next Step
           </Button>
         )}

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



