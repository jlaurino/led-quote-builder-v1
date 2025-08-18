import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create sample products
  const products = [
    {
      name: 'P2.5 LED Tile',
      category: 'LED_TILE',
      manufacturer: 'NovaStar',
      modelNumber: 'NS-P2.5-500',
      unitCost: 150,
      unitPrice: 200,
      widthMm: 500,
      heightMm: 500,
      depthMm: 80,
      weightKg: 2.5,
      powerW: 45,
      voltageMin: 110,
      voltageMax: 240,
      ledTile: {
        pixelPitchMm: 2.5,
        resolutionW: 200,
        resolutionH: 200,
        brightnessNits: 5000,
        refreshRateHz: 3840,
      },
    },
    {
      name: 'P3 LED Tile',
      category: 'LED_TILE',
      manufacturer: 'NovaStar',
      modelNumber: 'NS-P3-500',
      unitCost: 120,
      unitPrice: 160,
      widthMm: 500,
      heightMm: 500,
      depthMm: 80,
      weightKg: 2.2,
      powerW: 40,
      voltageMin: 110,
      voltageMax: 240,
      ledTile: {
        pixelPitchMm: 3.0,
        resolutionW: 167,
        resolutionH: 167,
        brightnessNits: 4500,
        refreshRateHz: 3840,
      },
    },
    {
      name: 'Professional LED Processor',
      category: 'LED_PROCESSOR',
      manufacturer: 'NovaStar',
      modelNumber: 'NS-VX1000',
      unitCost: 2500,
      unitPrice: 3200,
      widthMm: 440,
      heightMm: 88,
      depthMm: 350,
      weightKg: 3.5,
      powerW: 200,
      voltageMin: 100,
      voltageMax: 240,
      ledProcessor: {
        inputs: 4,
        outputs: 4,
        maxResW: 4096,
        maxResH: 2160,
        scaling: true,
      },
    },
    {
      name: 'Standard LED Processor',
      category: 'LED_PROCESSOR',
      manufacturer: 'NovaStar',
      modelNumber: 'NS-VX600',
      unitCost: 1200,
      unitPrice: 1500,
      widthMm: 440,
      heightMm: 88,
      depthMm: 350,
      weightKg: 2.8,
      powerW: 150,
      voltageMin: 100,
      voltageMax: 240,
      ledProcessor: {
        inputs: 2,
        outputs: 2,
        maxResW: 1920,
        maxResH: 1080,
        scaling: false,
      },
    },
    {
      name: '5kW Power Supply',
      category: 'POWER_EQUIPMENT',
      manufacturer: 'Mean Well',
      modelNumber: 'SP-5000-48',
      unitCost: 800,
      unitPrice: 1000,
      widthMm: 400,
      heightMm: 150,
      depthMm: 200,
      weightKg: 8.5,
      powerW: 5000,
      voltageMin: 180,
      voltageMax: 264,
      powerEquipment: {
        capacityW: 5000,
        phase: 'Single',
        redundancy: false,
      },
    },
    {
      name: '10kW Power Supply',
      category: 'POWER_EQUIPMENT',
      manufacturer: 'Mean Well',
      modelNumber: 'SP-10000-48',
      unitCost: 1500,
      unitPrice: 1900,
      widthMm: 600,
      heightMm: 200,
      depthMm: 250,
      weightKg: 15.0,
      powerW: 10000,
      voltageMin: 180,
      voltageMax: 264,
      powerEquipment: {
        capacityW: 10000,
        phase: 'Three',
        redundancy: true,
      },
    },
    {
      name: 'Media Server',
      category: 'COMPUTING',
      manufacturer: 'Disguise',
      modelNumber: 'vx4',
      unitCost: 8000,
      unitPrice: 10000,
      widthMm: 440,
      heightMm: 88,
      depthMm: 350,
      weightKg: 4.2,
      powerW: 800,
      voltageMin: 100,
      voltageMax: 240,
      computing: {
        cpu: 'Intel Xeon E5-2680 v4',
        ramGb: 64,
        storageGb: 2000,
        gpu: 'NVIDIA RTX 4000',
      },
    },
    {
      name: 'LED Par Light',
      category: 'LIGHTING',
      manufacturer: 'Chauvet',
      modelNumber: 'Par Q12',
      unitCost: 200,
      unitPrice: 280,
      widthMm: 300,
      heightMm: 300,
      depthMm: 300,
      weightKg: 3.2,
      powerW: 120,
      voltageMin: 100,
      voltageMax: 240,
      lighting: {
        lumens: 12000,
        colorTemp: 3200,
        dmx: true,
      },
    },
    {
      name: 'Line Array Speaker',
      category: 'AUDIO',
      manufacturer: 'JBL',
      modelNumber: 'VRX932LAP',
      unitCost: 1200,
      unitPrice: 1600,
      widthMm: 400,
      heightMm: 600,
      depthMm: 400,
      weightKg: 25.0,
      powerW: 500,
      voltageMin: 100,
      voltageMax: 240,
      audio: {
        type: 'Active',
        powerW: 500,
        channels: 2,
      },
    },
    {
      name: 'PTZ Camera',
      category: 'CAMERA',
      manufacturer: 'Sony',
      modelNumber: 'SRG-X400',
      unitCost: 2500,
      unitPrice: 3200,
      widthMm: 200,
      heightMm: 200,
      depthMm: 300,
      weightKg: 2.8,
      powerW: 50,
      voltageMin: 12,
      voltageMax: 24,
      camera: {
        sensor: '1/2.8" Exmor CMOS',
        resolutionW: 1920,
        resolutionH: 1080,
        fps: 60,
      },
    },
  ]

  for (const productData of products) {
    const { ledTile, ledProcessor, powerEquipment, computing, lighting, audio, camera, ...product } = productData

    await prisma.product.create({
      data: {
        ...product,
        ledTile: ledTile ? { create: ledTile } : undefined,
        ledProcessor: ledProcessor ? { create: ledProcessor } : undefined,
        powerEquipment: powerEquipment ? { create: powerEquipment } : undefined,
        computing: computing ? { create: computing } : undefined,
        lighting: lighting ? { create: lighting } : undefined,
        audio: audio ? { create: audio } : undefined,
        camera: camera ? { create: camera } : undefined,
      },
    })
  }

  // Create a default user
  await prisma.user.create({
    data: {
      email: 'admin@ledquotes.com',
      password: 'hashedpassword', // In real app, hash this
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

