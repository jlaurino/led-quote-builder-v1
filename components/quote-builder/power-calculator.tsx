import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Zap, Calculator, Settings } from 'lucide-react'

interface PowerCalculatorProps {
  onCalculate: (results: PowerCalculationResults) => void
}

export interface PowerCalculationResults {
  totalPower: number
  recommendedCapacity: number
  recommendedPhase: string
  redundancy: boolean
  estimatedCost: number
}

const PowerCalculator: React.FC<PowerCalculatorProps> = ({ onCalculate }) => {
  const [displayPower, setDisplayPower] = useState('')
  const [processorPower, setProcessorPower] = useState('')
  const [computingPower, setComputingPower] = useState('')
  const [lightingPower, setLightingPower] = useState('')
  const [audioPower, setAudioPower] = useState('')
  const [safetyFactor, setSafetyFactor] = useState('1.2')

  const handleCalculate = () => {
    const displayPowerNum = parseFloat(displayPower) || 0
    const processorPowerNum = parseFloat(processorPower) || 0
    const computingPowerNum = parseFloat(computingPower) || 0
    const lightingPowerNum = parseFloat(lightingPower) || 0
    const audioPowerNum = parseFloat(audioPower) || 0
    const safetyFactorNum = parseFloat(safetyFactor) || 1.2

    const totalPower = (displayPowerNum + processorPowerNum + computingPowerNum + lightingPowerNum + audioPowerNum) * safetyFactorNum

    // Determine recommended capacity and phase
    let recommendedCapacity = totalPower
    let recommendedPhase = 'Single Phase'
    let redundancy = false

    if (totalPower > 10000) {
      recommendedCapacity = Math.ceil(totalPower / 1000) * 1000
      recommendedPhase = 'Three Phase'
      redundancy = true
    } else if (totalPower > 5000) {
      recommendedCapacity = Math.ceil(totalPower / 500) * 500
      recommendedPhase = 'Single Phase'
      redundancy = true
    } else {
      recommendedCapacity = Math.ceil(totalPower / 100) * 100
    }

    // Add 20% buffer for redundancy if needed
    if (redundancy) {
      recommendedCapacity = Math.ceil(recommendedCapacity * 1.2)
    }

    // Estimate cost based on capacity
    const estimatedCost = recommendedCapacity * 2.5 // $2.5 per watt

    const results: PowerCalculationResults = {
      totalPower,
      recommendedCapacity,
      recommendedPhase,
      redundancy,
      estimatedCost,
    }

    onCalculate(results)
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-100">
          <Zap className="w-5 h-5" />
          <span>Power Calculator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Display Power (W)
            </label>
            <Input
              type="number"
              value={displayPower}
              onChange={(e) => setDisplayPower(e.target.value)}
              placeholder="e.g., 5000"
              className="bg-gray-700 border-gray-600 text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Processor Power (W)
            </label>
            <Input
              type="number"
              value={processorPower}
              onChange={(e) => setProcessorPower(e.target.value)}
              placeholder="e.g., 200"
              className="bg-gray-700 border-gray-600 text-gray-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Computing Power (W)
            </label>
            <Input
              type="number"
              value={computingPower}
              onChange={(e) => setComputingPower(e.target.value)}
              placeholder="e.g., 800"
              className="bg-gray-700 border-gray-600 text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Lighting Power (W)
            </label>
            <Input
              type="number"
              value={lightingPower}
              onChange={(e) => setLightingPower(e.target.value)}
              placeholder="e.g., 1000"
              className="bg-gray-700 border-gray-600 text-gray-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Audio Power (W)
            </label>
            <Input
              type="number"
              value={audioPower}
              onChange={(e) => setAudioPower(e.target.value)}
              placeholder="e.g., 500"
              className="bg-gray-700 border-gray-600 text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Safety Factor
            </label>
            <Select
              value={safetyFactor}
              onChange={(e) => setSafetyFactor(e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-100"
            >
              <option value="1.1">1.1x (10% buffer)</option>
              <option value="1.2">1.2x (20% buffer)</option>
              <option value="1.3">1.3x (30% buffer)</option>
              <option value="1.5">1.5x (50% buffer)</option>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleCalculate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Calculator className="w-4 h-4 mr-2" />
          Calculate Power Requirements
        </Button>
      </CardContent>
    </Card>
  )
}

export default PowerCalculator


