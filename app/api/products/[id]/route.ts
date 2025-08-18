import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ProductCategory } from '@prisma/client'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
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

    const productId = parseInt(params.id)

    // Update the product first
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        category: category as ProductCategory,
        subcategory,
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

    // Update related specifications if provided
    if (ledTile) {
      await prisma.lEDTileSpec.upsert({
        where: { productId },
        update: ledTile,
        create: { productId, ...ledTile },
      })
    }

    // Add similar upsert logic for other spec types as needed...

    // Return the updated product with its specifications
    const productWithSpecs = await prisma.product.findUnique({
      where: { id: productId },
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
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id)
    
    // Delete related specifications first
    await prisma.lEDTileSpec.deleteMany({ where: { productId } })
    await prisma.lEDProcessorSpec.deleteMany({ where: { productId } })
    await prisma.powerEquipmentSpec.deleteMany({ where: { productId } })
    await prisma.computingSpec.deleteMany({ where: { productId } })
    await prisma.lightingSpec.deleteMany({ where: { productId } })
    await prisma.audioSpec.deleteMany({ where: { productId } })
    await prisma.cameraSpec.deleteMany({ where: { productId } })
    await prisma.gripEquipmentSpec.deleteMany({ where: { productId } })
    await prisma.structuralItemSpec.deleteMany({ where: { productId } })
    await prisma.gripItemSpec.deleteMany({ where: { productId } })
    await prisma.networkingSpec.deleteMany({ where: { productId } })
    await prisma.cableSpec.deleteMany({ where: { productId } })
    await prisma.hardwareSpec.deleteMany({ where: { productId } })
    
    // Delete the product
    await prisma.product.delete({ where: { id: productId } })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
