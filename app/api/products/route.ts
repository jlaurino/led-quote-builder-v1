import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        ledTile: true,
        ledProcessor: true,
        powerEquipment: true,
        computing: true,
        lighting: true,
        audio: true,
        camera: true,
        gripEquipment: true,
        structuralItem: true,
        gripItem: true,
        networking: true,
        cable: true,
        hardware: true,
      },
    })
    
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      category, 
      manufacturer, 
      modelNumber, 
      unitCost, 
      unitPrice, 
      specs,
      ledTile,
      ledProcessor,
      powerEquipment,
      computing,
      lighting,
      audio,
      camera,
      gripEquipment,
      structuralItem,
      gripItem,
      networking,
      cable,
      hardware,
      ...otherFields 
    } = body

    const product = await prisma.product.create({
      data: {
        name,
        category,
        manufacturer,
        modelNumber,
        unitCost: parseFloat(unitCost),
        unitPrice: unitPrice ? parseFloat(unitPrice) : null,
        specs: specs || {},
        widthMm: otherFields.widthMm ? parseFloat(otherFields.widthMm) : null,
        heightMm: otherFields.heightMm ? parseFloat(otherFields.heightMm) : null,
        depthMm: otherFields.depthMm ? parseFloat(otherFields.depthMm) : null,
        weightKg: otherFields.weightKg ? parseFloat(otherFields.weightKg) : null,
        powerW: otherFields.powerW ? parseFloat(otherFields.powerW) : null,
        voltageMin: otherFields.voltageMin ? parseFloat(otherFields.voltageMin) : null,
        voltageMax: otherFields.voltageMax ? parseFloat(otherFields.voltageMax) : null,
        ledTile: ledTile ? { create: ledTile } : undefined,
        ledProcessor: ledProcessor ? { create: ledProcessor } : undefined,
        powerEquipment: powerEquipment ? { create: powerEquipment } : undefined,
        computing: computing ? { create: computing } : undefined,
        lighting: lighting ? { create: lighting } : undefined,
        audio: audio ? { create: audio } : undefined,
        camera: camera ? { create: camera } : undefined,
        gripEquipment: gripEquipment ? { create: gripEquipment } : undefined,
        structuralItem: structuralItem ? { create: structuralItem } : undefined,
        gripItem: gripItem ? { create: gripItem } : undefined,
        networking: networking ? { create: networking } : undefined,
        cable: cable ? { create: cable } : undefined,
        hardware: hardware ? { create: hardware } : undefined,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}



