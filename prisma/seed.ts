import { PrismaClient, ProductCategory } from '@prisma/client'

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
      ledTile: {
        create: {
          pixelPitchMm: 2.5,
          resolutionW: 192,
          resolutionH: 192,
          brightnessNits: 5000,
          refreshRateHz: 3840,
        },
      },
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
      ledTile: {
        create: {
          pixelPitchMm: 3.0,
          resolutionW: 160,
          resolutionH: 160,
          brightnessNits: 4500,
          refreshRateHz: 3840,
        },
      },
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
      ledProcessor: {
        create: {
          inputs: 4,
          outputs: 8,
          maxResW: 7680,
          maxResH: 4320,
          scaling: true,
        },
      },
    },
  })

  // Create Power Equipment
  const powerSupply = await prisma.product.create({
    data: {
      name: '5kW Power Supply',
      category: ProductCategory.POWER_EQUIPMENT,
      manufacturer: 'Mean Well',
      modelNumber: 'SP-5000-48',
      widthMm: 400,
      heightMm: 200,
      depthMm: 100,
      weightKg: 12.0,
      powerW: 5000,
      voltageMin: 90,
      voltageMax: 264,
      unitCost: 800.00,
      unitPrice: 1200.00,
      powerEquipment: {
        create: {
          capacityW: 5000,
          phase: 'Single',
          redundancy: false,
        },
      },
    },
  })

  // Create Computing Equipment
  const computer = await prisma.product.create({
    data: {
      name: 'Media Server Pro',
      category: ProductCategory.COMPUTING,
      manufacturer: 'HP',
      modelNumber: 'HP-Z2-G9',
      widthMm: 350,
      heightMm: 100,
      depthMm: 250,
      weightKg: 5.5,
      powerW: 300,
      voltageMin: 100,
      voltageMax: 240,
      unitCost: 2500.00,
      unitPrice: 3500.00,
      computing: {
        create: {
          cpu: 'Intel i7-12700K',
          ramGb: 32,
          storageGb: 1000,
          gpu: 'RTX 3060',
        },
      },
    },
  })

  // Create Lighting Equipment
  const light = await prisma.product.create({
    data: {
      name: 'LED Wash Light',
      category: ProductCategory.LIGHTING,
      manufacturer: 'Chauvet',
      modelNumber: 'CH-WASH-FX',
      widthMm: 300,
      heightMm: 200,
      depthMm: 150,
      weightKg: 3.2,
      powerW: 150,
      voltageMin: 100,
      voltageMax: 240,
      unitCost: 450.00,
      unitPrice: 650.00,
      lighting: {
        create: {
          lumens: 15000,
          colorTemp: 3200,
          dmx: true,
        },
      },
    },
  })

  // Create Audio Equipment
  const speaker = await prisma.product.create({
    data: {
      name: 'Active Speaker',
      category: ProductCategory.AUDIO,
      manufacturer: 'JBL',
      modelNumber: 'JBL-PRX812',
      widthMm: 400,
      heightMm: 600,
      depthMm: 350,
      weightKg: 18.0,
      powerW: 1200,
      voltageMin: 100,
      voltageMax: 240,
      unitCost: 800.00,
      unitPrice: 1200.00,
      audio: {
        create: {
          type: 'Active Speaker',
          powerW: 1200,
          channels: 2,
        },
      },
    },
  })

  // Create Camera Equipment
  const camera = await prisma.product.create({
    data: {
      name: 'PTZ Camera',
      category: ProductCategory.CAMERA,
      manufacturer: 'Sony',
      modelNumber: 'SRG-X400',
      widthMm: 150,
      heightMm: 150,
      depthMm: 200,
      weightKg: 1.8,
      powerW: 25,
      voltageMin: 12,
      voltageMax: 24,
      unitCost: 1200.00,
      unitPrice: 1800.00,
      camera: {
        create: {
          sensor: '1/2.8" CMOS',
          resolutionW: 1920,
          resolutionH: 1080,
          fps: 60,
        },
      },
    },
  })

  // Create Networking Equipment
  const switch1 = await prisma.product.create({
    data: {
      name: 'Gigabit Switch',
      category: ProductCategory.NETWORKING,
      manufacturer: 'Cisco',
      modelNumber: 'SG350-28',
      widthMm: 440,
      heightMm: 44,
      depthMm: 200,
      weightKg: 2.5,
      powerW: 35,
      voltageMin: 100,
      voltageMax: 240,
      unitCost: 300.00,
      unitPrice: 450.00,
      networking: {
        create: {
          ports: 28,
          speedGbps: 1.0,
          poe: true,
        },
      },
    },
  })

  // Create Cable
  const cable = await prisma.product.create({
    data: {
      name: 'Cat6 Cable',
      category: ProductCategory.CABLE,
      manufacturer: 'Belden',
      modelNumber: 'CAT6-100M',
      widthMm: 6,
      heightMm: 6,
      depthMm: 100000,
      weightKg: 8.0,
      powerW: 0,
      voltageMin: 0,
      voltageMax: 0,
      unitCost: 120.00,
      unitPrice: 180.00,
      cable: {
        create: {
          type: 'Cat6',
          lengthM: 100,
          gauge: '23AWG',
        },
      },
    },
  })

  // Create Hardware
  const hardware = await prisma.product.create({
    data: {
      name: 'Mounting Bracket',
      category: ProductCategory.HARDWARE,
      manufacturer: 'Generic',
      modelNumber: 'MB-500x500',
      widthMm: 50,
      heightMm: 50,
      depthMm: 20,
      weightKg: 0.5,
      powerW: 0,
      voltageMin: 0,
      voltageMax: 0,
      unitCost: 25.00,
      unitPrice: 35.00,
      hardware: {
        create: {
          type: 'Mounting Bracket',
          material: 'Steel',
          loadKg: 50,
        },
      },
    },
  })

  console.log('✅ Created products:')
  console.log(`  - ${ledTile1.name} (${ledTile1.category})`)
  console.log(`  - ${ledTile2.name} (${ledTile2.category})`)
  console.log(`  - ${ledProcessor.name} (${ledProcessor.category})`)
  console.log(`  - ${powerSupply.name} (${powerSupply.category})`)
  console.log(`  - ${computer.name} (${computer.category})`)
  console.log(`  - ${light.name} (${light.category})`)
  console.log(`  - ${speaker.name} (${speaker.category})`)
  console.log(`  - ${camera.name} (${camera.category})`)
  console.log(`  - ${switch1.name} (${switch1.category})`)
  console.log(`  - ${cable.name} (${cable.category})`)
  console.log(`  - ${hardware.name} (${hardware.category})`)

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
