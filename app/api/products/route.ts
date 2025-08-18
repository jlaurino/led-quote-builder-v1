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
    const { name, category, manufacturer, modelNumber, unitCost, unitPrice, specs, ...specialSpecs } = body

    const product = await prisma.product.create({
      data: {
        name,
        category,
        manufacturer,
        modelNumber,
        unitCost: parseFloat(unitCost),
        unitPrice: unitPrice ? parseFloat(unitPrice) : null,
        specs: specs || {},
        ...specialSpecs,
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


