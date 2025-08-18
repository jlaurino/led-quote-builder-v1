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

    // Create the product first
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
      },
    })

    // Create related specifications if provided
    if (ledTile) {
      await prisma.lEDTileSpec.create({
        data: {
          productId: product.id,
          ...ledTile,
        },
      })
    }

    if (ledProcessor) {
      await prisma.lEDProcessorSpec.create({
        data: {
          productId: product.id,
          ...ledProcessor,
        },
      })
    }

    if (powerEquipment) {
      await prisma.powerEquipmentSpec.create({
        data: {
          productId: product.id,
          ...powerEquipment,
        },
      })
    }

    if (computing) {
      await prisma.computingSpec.create({
        data: {
          productId: product.id,
          ...computing,
        },
      })
    }

    if (lighting) {
      await prisma.lightingSpec.create({
        data: {
          productId: product.id,
          ...lighting,
        },
      })
    }

    if (audio) {
      await prisma.audioSpec.create({
        data: {
          productId: product.id,
          ...audio,
        },
      })
    }

    if (camera) {
      await prisma.cameraSpec.create({
        data: {
          productId: product.id,
          ...camera,
        },
      })
    }

    if (gripEquipment) {
      await prisma.gripEquipmentSpec.create({
        data: {
          productId: product.id,
          ...gripEquipment,
        },
      })
    }

    if (structuralItem) {
      await prisma.structuralItemSpec.create({
        data: {
          productId: product.id,
          ...structuralItem,
        },
      })
    }

    if (gripItem) {
      await prisma.gripItemSpec.create({
        data: {
          productId: product.id,
          ...gripItem,
        },
      })
    }

    if (networking) {
      await prisma.networkingSpec.create({
        data: {
          productId: product.id,
          ...networking,
        },
      })
    }

    if (cable) {
      await prisma.cableSpec.create({
        data: {
          productId: product.id,
          ...cable,
        },
      })
    }

    if (hardware) {
      await prisma.hardwareSpec.create({
        data: {
          productId: product.id,
          ...hardware,
        },
      })
    }

    // Return the created product with its specifications
    const productWithSpecs = await prisma.product.findUnique({
      where: { id: product.id },
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

    return NextResponse.json(productWithSpecs)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}



