# Instruções para Corrigir o Erro de Vendas

## Problemas Identificados e Resolvidos

### 1. Erro de userId undefined
O erro `userId: undefined` na criação de vendas indicava que o `session.user.id` não estava sendo definido corretamente no NextAuth.

### 2. Erro de chave estrangeira customerId
O erro `Foreign key constraint violated: Sale_customerId_fkey` indicava que o frontend estava enviando o nome do cliente em vez do ID do cliente.

## Soluções Implementadas

### 1. Verificações Adicionadas na API (`app/api/sales/route.ts`)
- Adicionada verificação se `session.user.id` existe
- Adicionada verificação se o usuário existe no banco de dados
- Adicionados logs para debugging
- Corrigido cálculo do `totalPrice` convertendo Decimal para Number
- Implementada criação automática de clientes baseada no nome
- Implementada funcionalidade de vendas fiadas (status PENDING)
- Estoque só é reduzido para vendas pagas (não fiadas)

### 2. Interface do Frontend Melhorada (`app/vendas/page.tsx`)
- Campo de cliente agora permite nomes livres (Input em vez de Select)
- Implementada funcionalidade de vendas fiadas
- Suporte para "Consumidor Final" quando campo vazio

### 3. Configuração do NextAuth Melhorada (`lib/auth.ts`)
- Adicionado `NEXTAUTH_SECRET` na configuração
- Verificados os callbacks de JWT e session

## Ação Necessária do Usuário

### Criar arquivo .env.local
Você precisa criar um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/automationgas"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-development"

# App
NODE_ENV="development"
```

### Verificar se o Banco de Dados está Configurado
1. Certifique-se de que o PostgreSQL está rodando
2. Execute `npx prisma migrate dev` para aplicar as migrações
3. Execute `npx prisma db seed` para popular o banco com dados de teste

### Testar o Sistema
1. Faça login com as credenciais de teste:
   - Admin: `admin@test.com` / `admin123`
   - Atendente: `atendente@test.com` / `atendente123`
2. Tente criar uma nova venda
3. Verifique os logs do console para ver se há mensagens de debug

## Logs de Debug
Com as modificações implementadas, você verá logs no console que ajudarão a identificar onde está o problema:
- Se o `userId` não estiver na sessão
- Se o usuário não for encontrado no banco
- Os dados sendo enviados para criar a venda

## Novas Funcionalidades Implementadas

### 1. Nomes de Clientes Livres
- Agora você pode digitar qualquer nome de cliente no campo
- Se o cliente não existir, será criado automaticamente
- Se deixar vazio, será "Consumidor Final"
- Clientes são criados com código único (CLI-{timestamp})

### 2. Sistema de Fiado
- Selecione "Fiado" na forma de pagamento
- Vendas fiadas ficam com status "PENDING"
- Estoque NÃO é reduzido para vendas fiadas (só quando pagar)
- Vendas fiadas aparecem na seção "Fiados" do sistema

### 3. Fluxo de Vendas Fiadas
1. Cliente pega produto fiado
2. Venda é registrada com status PENDING
3. Estoque permanece inalterado
4. Quando cliente pagar, status muda para COMPLETED
5. Estoque é reduzido no momento do pagamento
6. Débito do cliente é automaticamente reduzido

### 4. Sistema de Pagamentos de Fiado (`app/api/credit-payments/route.ts`)
- Pagamentos reduzem automaticamente o débito do cliente
- Vendas pendentes são marcadas como COMPLETED quando pagas
- Estoque é reduzido apenas quando a venda é paga
- Sistema FIFO (First In, First Out) para pagamentos
- Logs detalhados de processamento de pagamentos

### 5. Correções de Cálculo de Débito (`app/api/customers/route.ts`)
- Débito calculado apenas das vendas pendentes (FIADO + PENDING)
- Código automático gerado quando não fornecido
- Método PUT para edição de dados do cliente (exceto código)

### 6. Edição de Funcionários (`app/api/employees/route.ts`)
- Método PUT para edição de dados dos funcionários
- Validação de email único
- Controle de acesso apenas para administradores

### 7. Relatórios de Funcionários (`app/api/reports/employees/route.ts`)
- Relatório completo de vendas e gastos por funcionário
- Filtros por período e funcionário específico
- Cálculo de resultado líquido (vendas - gastos)
- Detalhamento de todas as transações

## Próximos Passos
Se o problema persistir após seguir essas instruções, verifique:
1. Se o usuário está realmente logado (verificar cookies/session)
2. Se o banco de dados tem os usuários de teste
3. Se há algum problema de CORS ou configuração de ambiente
