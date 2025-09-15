import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar usuários iniciais
  console.log('👤 Criando usuários...')
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@test.com',
      role: UserRole.ADMINISTRATIVO,
      phone: '(11) 99999-9999',
      address: 'Rua Admin, 123'
    }
  })

  const atendenteUser = await prisma.user.upsert({
    where: { email: 'atendente@test.com' },
    update: {},
    create: {
      name: 'Atendente',
      email: 'atendente@test.com',
      role: UserRole.ATENDENTE,
      phone: '(11) 88888-8888',
      address: 'Rua Atendente, 456'
    }
  })

  // Criar produtos
  console.log('📦 Criando produtos...')
  
  const produto1 = await prisma.product.upsert({
    where: { id: 'produto-p13' },
    update: {},
    create: {
      id: 'produto-p13',
      name: 'Botijão P13',
      description: 'Botijão de gás de 13kg',
      price: 85.00,
      stock: 50,
      minStock: 10
    }
  })

  const produto2 = await prisma.product.upsert({
    where: { id: 'produto-p45' },
    update: {},
    create: {
      id: 'produto-p45',
      name: 'Botijão P45',
      description: 'Botijão de gás de 45kg',
      price: 95.00,
      stock: 20,
      minStock: 5
    }
  })

  const produto3 = await prisma.product.upsert({
    where: { id: 'produto-p20' },
    update: {},
    create: {
      id: 'produto-p20',
      name: 'Botijão P20',
      description: 'Botijão de gás de 20kg',
      price: 45.00,
      stock: 30,
      minStock: 8
    }
  })

  const produto4 = await prisma.product.upsert({
    where: { id: 'produto-p8' },
    update: {},
    create: {
      id: 'produto-p8',
      name: 'Botijão P8',
      description: 'Botijão de gás de 8kg',
      price: 35.00,
      stock: 15,
      minStock: 5
    }
  })

  // Criar clientes
  console.log('👥 Criando clientes...')
  
  const cliente1 = await prisma.customer.upsert({
    where: { code: 'CLI001' },
    update: {},
    create: {
      name: 'João Silva',
      code: 'CLI001',
      phone: '(11) 99999-9999',
      address: 'Rua das Flores, 123',
      creditLimit: 500.00
    }
  })

  const cliente2 = await prisma.customer.upsert({
    where: { code: 'CLI002' },
    update: {},
    create: {
      name: 'Maria Santos',
      code: 'CLI002',
      phone: '(11) 88888-8888',
      address: 'Av. Principal, 456',
      creditLimit: 300.00
    }
  })

  const cliente3 = await prisma.customer.upsert({
    where: { code: 'CLI003' },
    update: {},
    create: {
      name: 'Pedro Costa',
      code: 'CLI003',
      phone: '(11) 77777-7777',
      creditLimit: 200.00
    }
  })

  // Criar veículos
  console.log('🚗 Criando veículos...')
  
  const veiculo1 = await prisma.vehicle.upsert({
    where: { plate: 'ABC-1234' },
    update: {},
    create: {
      name: 'Van Branca',
      plate: 'ABC-1234',
      model: 'Ford Transit',
      year: 2020,
      isActive: true,
      userId: atendenteUser.id
    }
  })

  const veiculo2 = await prisma.vehicle.upsert({
    where: { plate: 'DEF-5678' },
    update: {},
    create: {
      name: 'Van Azul',
      plate: 'DEF-5678',
      model: 'Mercedes Sprinter',
      year: 2021,
      isActive: true
    }
  })

  const veiculo3 = await prisma.vehicle.upsert({
    where: { plate: 'GHI-9012' },
    update: {},
    create: {
      name: 'Moto Entrega',
      plate: 'GHI-9012',
      model: 'Honda CG 160',
      year: 2022,
      isActive: true
    }
  })

  // Criar algumas vendas de exemplo
  console.log('💰 Criando vendas...')
  
  await prisma.sale.create({
    data: {
      quantity: 2,
      totalPrice: 170.00,
      paymentType: 'DINHEIRO',
      status: 'COMPLETED',
      userId: atendenteUser.id,
      productId: produto1.id,
      customerId: cliente1.id,
      notes: 'Venda realizada com sucesso'
    }
  })

  await prisma.sale.create({
    data: {
      quantity: 1,
      totalPrice: 95.00,
      paymentType: 'PIX',
      status: 'COMPLETED',
      userId: atendenteUser.id,
      productId: produto2.id,
      customerId: cliente2.id
    }
  })

  await prisma.sale.create({
    data: {
      quantity: 1,
      totalPrice: 85.00,
      paymentType: 'FIADO',
      status: 'PENDING',
      userId: atendenteUser.id,
      productId: produto1.id,
      customerId: cliente3.id,
      notes: 'Venda fiada'
    }
  })

  // Criar algumas despesas de exemplo
  console.log('💸 Criando despesas...')
  
  await prisma.expense.create({
    data: {
      description: 'Combustível - Posto Central',
      amount: 150.00,
      category: 'COMBUSTIVEL',
      userId: atendenteUser.id,
      vehicleId: veiculo1.id,
      notes: 'Abastecimento completo'
    }
  })

  await prisma.expense.create({
    data: {
      description: 'Manutenção - Freios',
      amount: 320.00,
      category: 'MANUTENCAO',
      userId: adminUser.id,
      vehicleId: veiculo2.id,
      notes: 'Troca de pastilhas e discos'
    }
  })

  await prisma.expense.create({
    data: {
      description: 'Material de escritório',
      amount: 45.00,
      category: 'OUTROS',
      userId: adminUser.id,
      notes: 'Papel, canetas e clips'
    }
  })

  // Criar movimentações de estoque
  console.log('📊 Criando movimentações de estoque...')
  
  await prisma.inventory.create({
    data: {
      quantity: -2,
      type: 'SAIDA',
      notes: 'Venda para João Silva',
      productId: produto1.id
    }
  })

  await prisma.inventory.create({
    data: {
      quantity: -1,
      type: 'SAIDA',
      notes: 'Venda para Maria Santos',
      productId: produto2.id
    }
  })

  await prisma.inventory.create({
    data: {
      quantity: -1,
      type: 'SAIDA',
      notes: 'Venda fiada para Pedro Costa',
      productId: produto1.id
    }
  })

  // Criar um pagamento de crédito
  console.log('💳 Criando pagamento de crédito...')
  
  await prisma.creditPayment.create({
    data: {
      amount: 85.00,
      notes: 'Pagamento em dinheiro',
      customerId: cliente3.id
    }
  })

  console.log('✅ Seed concluído com sucesso!')
  console.log(`
📊 Dados criados:
- 2 usuários (1 admin, 1 atendente)
- 4 produtos
- 3 clientes
- 3 veículos (1 atribuído ao atendente)
- 3 vendas
- 3 despesas
- 3 movimentações de estoque
- 1 pagamento de crédito

🔑 Credenciais de acesso:
Admin: admin@test.com / admin123
Atendente: atendente@test.com / atendente123
  `)
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })