import { PrismaClient, ProductCategory, ReceivingCardType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create default admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@ledquotes.com' },
    update: {},
    create: {
      email: 'admin@ledquotes.com',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.gSJp1O', // "password123"
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  console.log('✅ Created admin user:', adminUser.email)

  // Clear existing products
  await prisma.product.deleteMany({})
  console.log('🧹 Cleared existing products')

  // Create LED Tile products
  const ledTile1 = await prisma.product.create({
    data: {
      name: 'P2.5 LED Tile',
      category: ProductCategory.LED_TILE,
      manufacturer: 'NovaStar',
      modelNumber: 'NS-P2.5-500x500',
      widthMm: 500,
      heightMm: 500,
      depthMm: 80,
      weightKg: 8.5,
      powerW: 120,
      voltageMin: 110,
      voltageMax: 240,
      unitCost: 450.00,
      unitPrice: 650.00,
    },
  })

  await prisma.lEDTileSpec.create({
    data: {
      productId: ledTile1.id,
      pixelPitchMm: 2.5,
      physicalWidthMm: 500,
      physicalHeightMm: 500,
      pixelWidth: 192,
      pixelHeight: 192,
      weightKg: 8.5,
      maxPowerW: 120,
      avgPowerW: 100,
      receivingCardType: ReceivingCardType.NOVASTAR,
      brightnessNits: 5000,
      refreshRateHz: 3840,
      scanRate: 16,
      buyPrice: 450.00,
      sellPrice: 650.00,
    },
  })

  const ledTile2 = await prisma.product.create({
    data: {
      name: 'P3 LED Tile',
      category: ProductCategory.LED_TILE,
      manufacturer: 'NovaStar',
      modelNumber: 'NS-P3-500x500',
      widthMm: 500,
      heightMm: 500,
      depthMm: 80,
      weightKg: 8.0,
      powerW: 100,
      voltageMin: 110,
      voltageMax: 240,
      unitCost: 380.00,
      unitPrice: 550.00,
    },
  })

  await prisma.lEDTileSpec.create({
    data: {
      productId: ledTile2.id,
      pixelPitchMm: 3.0,
      physicalWidthMm: 500,
      physicalHeightMm: 500,
      pixelWidth: 160,
      pixelHeight: 160,
      weightKg: 8.0,
      maxPowerW: 100,
      avgPowerW: 85,
      receivingCardType: ReceivingCardType.NOVASTAR,
      brightnessNits: 4500,
      refreshRateHz: 3840,
      scanRate: 16,
      buyPrice: 380.00,
      sellPrice: 550.00,
    },
  })

  const ledTile3 = await prisma.product.create({
    data: {
      name: 'P4 LED Tile',
      category: ProductCategory.LED_TILE,
      manufacturer: 'Brompton',
      modelNumber: 'BR-P4-500x500',
      widthMm: 500,
      heightMm: 500,
      depthMm: 85,
      weightKg: 9.0,
      powerW: 110,
      voltageMin: 110,
      voltageMax: 240,
      unitCost: 320.00,
      unitPrice: 480.00,
    },
  })

  await prisma.lEDTileSpec.create({
    data: {
      productId: ledTile3.id,
      pixelPitchMm: 4.0,
      physicalWidthMm: 500,
      physicalHeightMm: 500,
      pixelWidth: 120,
      pixelHeight: 120,
      weightKg: 9.0,
      maxPowerW: 110,
      avgPowerW: 90,
      receivingCardType: ReceivingCardType.BROMPTON,
      brightnessNits: 4000,
      refreshRateHz: 3840,
      scanRate: 16,
      buyPrice: 320.00,
      sellPrice: 480.00,
    },
  })

  // Create LED Processor
  const ledProcessor = await prisma.product.create({
    data: {
      name: 'VX1000 LED Processor',
      category: ProductCategory.LED_PROCESSOR,
      manufacturer: 'NovaStar',
      modelNumber: 'NS-VX1000',
      widthMm: 440,
      heightMm: 220,
      depthMm: 44,
      weightKg: 2.5,
      powerW: 25,
      voltageMin: 100,
      voltageMax: 240,
      unitCost: 1200.00,
      unitPrice: 1800.00,
    },
  })

  await prisma.lEDProcessorSpec.create({
    data: {
      productId: ledProcessor.id,
      inputs: 4,
      outputs: 4,
      maxResW: 1920,
      maxResH: 1080,
      scaling: true,
    },
  })

  // Create Power Equipment
  const powerSupply = await prisma.product.create({
    data: {
      name: '5kW Power Supply',
      category: ProductCategory.POWER_EQUIPMENT,
      manufacturer: 'Mean Well',
      modelNumber: 'MW-5KW-48V',
      widthMm: 400,
      heightMm: 200,
      depthMm: 100,
      weightKg: 15,
      powerW: 5000,
      voltageMin: 100,
      voltageMax: 240,
      unitCost: 800.00,
      unitPrice: 1200.00,
    },
  })

  await prisma.powerEquipmentSpec.create({
    data: {
      productId: powerSupply.id,
      capacityW: 5000,
      phase: 'Single',
      redundancy: false,
    },
  })

  // Create Computing Equipment
  const mediaServer = await prisma.product.create({
    data: {
      name: 'Media Server Pro',
      category: ProductCategory.COMPUTING,
      manufacturer: 'Disguise',
      modelNumber: 'DS-VX4',
      widthMm: 440,
      heightMm: 88,
      depthMm: 650,
      weightKg: 8,
      powerW: 300,
      voltageMin: 100,
      voltageMax: 240,
      unitCost: 8000.00,
      unitPrice: 12000.00,
    },
  })

  await prisma.computingSpec.create({
    data: {
      productId: mediaServer.id,
      cpu: 'Intel Xeon E5-2680',
      ramGb: 32,
      storageGb: 1000,
      gpu: 'NVIDIA GTX 1080',
    },
  })

  // Create Lighting Equipment
  const ledPar = await prisma.product.create({
    data: {
      name: 'LED Par Light',
      category: ProductCategory.LIGHTING,
      manufacturer: 'Chauvet',
      modelNumber: 'CH-PAR-200',
      widthMm: 300,
      heightMm: 300,
      depthMm: 200,
      weightKg: 3,
      powerW: 200,
      voltageMin: 100,
      voltageMax: 240,
      unitCost: 200.00,
      unitPrice: 350.00,
    },
  })

  await prisma.lightingSpec.create({
    data: {
      productId: ledPar.id,
      lumens: 20000,
      colorTemp: 5600,
      dmx: true,
    },
  })

  // Create Audio Equipment
  const speaker = await prisma.product.create({
    data: {
      name: 'Line Array Speaker',
      category: ProductCategory.AUDIO,
      manufacturer: 'JBL',
      modelNumber: 'JBL-VRX932',
      widthMm: 450,
      heightMm: 700,
      depthMm: 400,
      weightKg: 25,
      powerW: 1200,
      voltageMin: 100,
      voltageMax: 240,
      unitCost: 1200.00,
      unitPrice: 2000.00,
    },
  })

  await prisma.audioSpec.create({
    data: {
      productId: speaker.id,
      type: 'Active',
      powerW: 1200,
      channels: 2,
    },
  })

  // Create Camera Equipment
  const camera = await prisma.product.create({
    data: {
      name: 'PTZ Camera',
      category: ProductCategory.CAMERA,
      manufacturer: 'Sony',
      modelNumber: 'SNY-SRGA',
      widthMm: 200,
      heightMm: 200,
      depthMm: 300,
      weightKg: 2,
      powerW: 50,
      voltageMin: 12,
      voltageMax: 24,
      unitCost: 2500.00,
      unitPrice: 4000.00,
    },
  })

  await prisma.cameraSpec.create({
    data: {
      productId: camera.id,
      sensor: '1/2.8" CMOS',
      resolutionW: 1920,
      resolutionH: 1080,
      fps: 60,
    },
  })

  // Create Networking Equipment
  const switch1 = await prisma.product.create({
    data: {
      name: 'Network Switch',
      category: ProductCategory.NETWORKING,
      manufacturer: 'Cisco',
      modelNumber: 'CS-SG350-28',
      widthMm: 440,
      heightMm: 44,
      depthMm: 300,
      weightKg: 3,
      powerW: 50,
      voltageMin: 100,
      voltageMax: 240,
      unitCost: 500.00,
      unitPrice: 800.00,
    },
  })

  await prisma.networkingSpec.create({
    data: {
      productId: switch1.id,
      ports: 28,
      speedGbps: 1,
      poe: true,
    },
  })

  // Create Cable
  const cable = await prisma.product.create({
    data: {
      name: 'Power Cable',
      category: ProductCategory.CABLE,
      manufacturer: 'Generic',
      modelNumber: 'PC-16AWG-10M',
      widthMm: 10,
      heightMm: 10,
      depthMm: 10000,
      weightKg: 1,
      powerW: 0,
      voltageMin: 0,
      voltageMax: 600,
      unitCost: 15.00,
      unitPrice: 25.00,
    },
  })

  await prisma.cableSpec.create({
    data: {
      productId: cable.id,
      type: 'Power',
      lengthM: 10,
      gauge: '16AWG',
    },
  })

  // Create Hardware
  const hardware = await prisma.product.create({
    data: {
      name: 'Mounting Bracket',
      category: ProductCategory.HARDWARE,
      manufacturer: 'Generic',
      modelNumber: 'MB-500x500',
      widthMm: 520,
      heightMm: 520,
      depthMm: 20,
      weightKg: 2,
      powerW: 0,
      voltageMin: 0,
      voltageMax: 0,
      unitCost: 25.00,
      unitPrice: 40.00,
    },
  })

  await prisma.hardwareSpec.create({
    data: {
      productId: hardware.id,
      type: 'Mounting',
      material: 'Steel',
      loadKg: 50,
    },
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
