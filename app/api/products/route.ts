import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ProductCategory } from '@prisma/client'

// Helper function to safely parse numbers
function safeParseFloat(value: any): number | null {
  if (!value || value === '' || value === undefined || value === null) {
    return null
  }
  const parsed = parseFloat(value)
  return isNaN(parsed) ? null : parsed
}

function safeParseInt(value: any): number | null {
  if (!value || value === '' || value === undefined || value === null) {
    return null
  }
  const parsed = parseInt(value)
  return isNaN(parsed) ? null : parsed
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    const whereClause = category ? { category: category as ProductCategory } : {}
    
    const products = await prisma.product.findMany({
      where: whereClause,
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
    
    return NextResponse.json(products || [])
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received request body:', JSON.stringify(body, null, 2)) // Debug log
    
    const { 
      name, 
      category, 
      subcategory,
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

    // Validate required fields
    if (!name || !category) {
      console.log('Missing required fields:', { name, category }) // Debug log
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      )
    }

    // Create the product first
    const productData = {
      name,
      category: category as ProductCategory,
      subcategory: subcategory || null,
      manufacturer: manufacturer || null,
      modelNumber: modelNumber || null,
      unitCost: safeParseFloat(unitCost) || 0, // Default to 0 if not provided
      unitPrice: safeParseFloat(unitPrice),
      specs: specs || {},
      widthMm: safeParseFloat(otherFields.widthMm),
      heightMm: safeParseFloat(otherFields.heightMm),
      depthMm: safeParseFloat(otherFields.depthMm),
      weightKg: safeParseFloat(otherFields.weightKg),
      powerW: safeParseFloat(otherFields.powerW),
      voltageMin: safeParseFloat(otherFields.voltageMin),
      voltageMax: safeParseFloat(otherFields.voltageMax),
    }

    console.log('Creating product with data:', JSON.stringify(productData, null, 2)) // Debug log

    const product = await prisma.product.create({
      data: productData,
    })

    // Create related specifications if provided
    if (ledTile && Object.keys(ledTile).length > 0) {
      console.log('Creating LED tile spec:', JSON.stringify(ledTile, null, 2)) // Debug log
      
      // Required fields for LED tile (with defaults if not provided)
      const requiredFields = {
        pixelPitchMm: safeParseFloat(ledTile.pixelPitchMm) || 2.5,
        physicalWidthMm: safeParseFloat(ledTile.physicalWidthMm) || 500,
        physicalHeightMm: safeParseFloat(ledTile.physicalHeightMm) || 500,
        pixelWidth: safeParseInt(ledTile.pixelWidth) || 200,
        pixelHeight: safeParseInt(ledTile.pixelHeight) || 200,
        weightKg: safeParseFloat(ledTile.weightKg) || 6.0,
        maxPowerW: safeParseFloat(ledTile.maxPowerW) || 400,
        avgPowerW: safeParseFloat(ledTile.avgPowerW) || 160,
        receivingCardType: ledTile.receivingCardType || 'NOVASTAR',
        brightnessNits: safeParseInt(ledTile.brightnessNits) || 5000,
        refreshRateHz: safeParseInt(ledTile.refreshRateHz) || 60,
        buyPrice: safeParseFloat(ledTile.buyPrice) || 0,
        sellPrice: safeParseFloat(ledTile.sellPrice) || 0,
      }

      const ledTileData = {
        productId: product.id,
        ...requiredFields,
        scanRate: safeParseInt(ledTile.scanRate), // Optional field
      }

      // Check if any non-default values were provided (indicating user wants LED tile spec)
      const hasUserData = Object.keys(ledTile).some(key => 
        ledTile[key] && ledTile[key] !== '' && ledTile[key] !== '0'
      )

      if (hasUserData) {
        await prisma.lEDTileSpec.create({
          data: ledTileData,
        })
      }
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
    
    // Provide more specific error messages
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'A product with this name already exists' },
          { status: 400 }
        )
      }
      if (error.message.includes('Invalid value') || error.message.includes('Expected')) {
        return NextResponse.json(
          { error: 'Invalid data provided. Please check your input values.' },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: `Failed to create product: ${error.message}` },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create product. Please try again.' },
      { status: 500 }
    )
  }
}



