# AutomationGas - Sistema de Gestão para Empresa de Gás

Sistema interno completo para gestão de empresa de gás, desenvolvido em Next.js 14 com TypeScript, Prisma e PostgreSQL.

## 🚀 Funcionalidades

### 📊 Dashboard
- Visão geral com cards de resumo
- Total de vendas, despesas e lucro líquido
- Alertas do sistema (estoque baixo, fiados vencidos)
- Vendas recentes

### 💰 Controle de Vendas
- Registro de vendas por funcionário
- Cálculo de vendas diárias, semanais e mensais
- Diferentes formas de pagamento (Dinheiro, Cartão, PIX, Fiado)
- Histórico completo de transações

### 💸 Controle de Despesas
- Registro de despesas por categoria
- Separação de custos por entregador
- Controle de gastos com veículos (combustível, manutenção)
- Relatórios de despesas

### 👥 Controle de Fiados
- Cadastro de clientes fiados
- Controle de limites de crédito
- Histórico de pagamentos
- Relatórios de débitos pendentes

### 📈 Controle de Lucros
- Cálculo de lucro líquido (vendas - despesas)
- Gráficos interativos com Recharts
- Análises diárias, semanais, mensais e anuais
- Insights e recomendações automáticas

### 📦 Controle de Estoque
- Cadastro de produtos (botijões de gás)
- Atualização automática após vendas
- Alertas de estoque baixo
- Histórico de movimentações

### 👨‍💼 Funcionários e Veículos
- Gestão de funcionários com diferentes roles
- Associação de funcionários a veículos
- Controle de despesas por veículo
- Histórico de manutenções

### 📋 Relatórios (Apenas Administradores)
- Relatórios financeiros detalhados
- Análise de performance
- Top produtos e clientes
- Exportação em PDF e Excel

## 🛠️ Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **NextAuth** - Autenticação
- **TailwindCSS** - Estilização
- **Shadcn UI** - Componentes de interface
- **Recharts** - Gráficos e visualizações

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL 12+
- npm ou yarn

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd automationgas
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/automationgas"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# App
NODE_ENV="development"
```

4. **Configure o banco de dados**
```bash
# Gerar o cliente Prisma
npm run db:generate

# Executar as migrações
npm run db:push

# Popular o banco com dados iniciais
npm run db:seed
```

5. **Execute o projeto**
```bash
npm run dev
```

O sistema estará disponível em `http://localhost:3000`

## 👤 Usuários de Teste

Após executar o seed, você pode usar os seguintes usuários:

### Administrador
- **Email:** admin@test.com
- **Senha:** admin123
- **Permissões:** Acesso completo ao sistema

### Atendente
- **Email:** atendente@test.com
- **Senha:** atendente123
- **Permissões:** Vendas, fiados, estoque (sem acesso a relatórios)

## 🎯 Roles e Permissões

### Atendente
- ✅ Dashboard básico
- ✅ Registrar vendas
- ✅ Gerenciar fiados
- ✅ Movimentar estoque
- ✅ Registrar despesas básicas
- ❌ Acessar relatórios financeiros
- ❌ Gerenciar funcionários
- ❌ Gerenciar veículos
- ❌ Visualizar análises de lucros

### Administrativo
- ✅ Dashboard completo
- ✅ Todas as funcionalidades do Atendente
- ✅ Visualizar relatórios
- ✅ Gerenciar funcionários e veículos
- ✅ Acessar análises de lucros
- ✅ Exportar relatórios
- ✅ Controle total do sistema

### 🔒 Sistema de Proteção
- **Middleware**: Protege rotas no nível do servidor
- **Hook usePermissions**: Verifica permissões no cliente
- **Componente ProtectedRoute**: Wrapper para páginas protegidas
- **Sidebar dinâmica**: Mostra apenas itens permitidos

## 📱 Responsividade

O sistema é totalmente responsivo e funciona perfeitamente em:
- 💻 Desktop
- 📱 Mobile
- 📱 Tablet

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm run start

# Linting
npm run lint

# Banco de dados
npm run db:push      # Aplicar mudanças no schema
npm run db:studio    # Abrir Prisma Studio
npm run db:generate  # Gerar cliente Prisma
npm run db:seed      # Popular banco com dados iniciais
```

## 📊 Estrutura do Banco de Dados

### Principais Entidades
- **Users** - Funcionários do sistema
- **Products** - Produtos (botijões de gás)
- **Customers** - Clientes fiados
- **Sales** - Vendas realizadas
- **Expenses** - Despesas operacionais
- **Vehicles** - Frota de veículos
- **Inventory** - Movimentações de estoque
- **CreditPayments** - Pagamentos de fiados

## 🎨 Interface

O sistema utiliza uma interface moderna e intuitiva com:
- **Design System** baseado em Shadcn UI
- **Cores** organizadas e consistentes
- **Componentes** reutilizáveis
- **Navegação** lateral com sidebar
- **Cards** informativos no dashboard
- **Tabelas** responsivas com filtros
- **Modais** para formulários
- **Gráficos** interativos

## 📈 Gráficos e Visualizações

Utilizando Recharts para:
- **Gráficos de linha** - Evolução temporal
- **Gráficos de barras** - Comparações
- **Gráficos de pizza** - Distribuições
- **Tooltips** informativos
- **Legendas** interativas

## 🔐 Segurança

- **Autenticação** com NextAuth
- **Proteção de rotas** baseada em roles
- **Validação** de dados com Zod
- **Sanitização** de inputs
- **Sessões** seguras

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Configure o banco PostgreSQL (Vercel Postgres ou externo)
4. Execute o deploy

### Outras Plataformas
O sistema pode ser deployado em qualquer plataforma que suporte Next.js:
- Railway
- Heroku
- DigitalOcean
- AWS

## 🤝 Contribuição

## 🔑 Credenciais de Acesso

Após executar o seed (`npm run db:seed`), você pode acessar o sistema com:

**Administrador:**
- Email: `admin@test.com`
- Senha: `admin123`

**Atendente:**
- Email: `atendente@test.com`
- Senha: `atendente123`

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte ou dúvidas:
- Abra uma issue no GitHub
- Entre em contato via email

---

**AutomationGas** - Sistema completo de gestão para empresas de gás 🚀
