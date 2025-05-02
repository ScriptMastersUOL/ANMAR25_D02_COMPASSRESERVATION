# Compass Reservation

<p align="center">
  <img src="https://via.placeholder.com/150?text=CR" alt="Compass Reservation Logo">
</p>

---

*Read this in [Portuguese](#compass-reservation-pt)*

## About

Compass Reservation is a robust reservation management system developed for managing space bookings, resources, and client information. The system features a complete authentication flow, user management, client management, space and resource management, and reservation handling.

## Technologies

- NestJS
- TypeScript
- Prisma ORM
- MySQL
- Docker
- Jest
- Swagger

## Features

- Authentication with JWT
- User management (CRUD)
- Client management (CRUD)
- Space management (CRUD)
- Resource management (CRUD)
- Reservation management (CRUD)
- Email module (optional)

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Docker and Docker Compose (for database)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/ANMAR25_D02_COMPASSRESERVATION.git
cd ANMAR25_D02_COMPASSRESERVATION
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following content:
```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/compass_reservation"

# MySQL Docker Configuration
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DB_NAME=compass_reservation
MYSQL_USER=user
MYSQL_PASSWORD=password
MYSQL_DB_PORT=3306

# Authentication
JWT_SECRET="your-secret-key"
JWT_EXPIRATION="1d"

# Default User
DEFAULT_USER_NAME="Admin"
DEFAULT_USER_EMAIL="admin@example.com"
DEFAULT_USER_PASSWORD="password123"

# Email (Optional)
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASSWORD=
MAIL_FROM=
```

4. Start the MySQL database using Docker
```bash
docker-compose up -d
```

Our Docker configuration:
```yaml
services:
  db_mysql:
    container_name: compassreservation_mysql
    image: mysql:8.0
    ports:
      - ${MYSQL_DB_PORT}:${MYSQL_DB_PORT}
    volumes:
      - compassreservation_mysql_volume:/var/lib/mysql
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_DATABASE=${MYSQL_DB_NAME}
      - MYSQL_USER=${MYSQL_USER}
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
volumes:
  compassreservation_mysql_volume:
```

5. Run the database migrations
```bash
npx prisma migrate dev
```

6. Seed the database with the default user
```bash
npm run seed
# or
yarn seed
```

7. Start the development server
```bash
npm run start:dev
# or
yarn start:dev
```

8. Access the Swagger API documentation at:
```
http://localhost:3000/api
```

## API Endpoints

### Authentication
- `POST /auth/login` - User login

### Users
- `POST /users` - Create a user
- `GET /users` - List users
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user (set to inactive)

### Clients
- `POST /clients` - Create a client
- `GET /clients` - List clients
- `GET /clients/:id` - Get client by ID
- `PATCH /clients/:id` - Update client
- `DELETE /clients/:id` - Delete client (set to inactive)

### Spaces
- `POST /spaces` - Create a space
- `GET /spaces` - List spaces
- `GET /spaces/:id` - Get space by ID
- `PATCH /spaces/:id` - Update space
- `DELETE /spaces/:id` - Delete space (set to inactive)

### Resources
- `POST /resources` - Create a resource
- `GET /resources` - List resources
- `GET /resources/:id` - Get resource by ID
- `PATCH /resources/:id` - Update resource
- `DELETE /resources/:id` - Delete resource (set to inactive)

### Reservations
- `POST /reservations` - Create a reservation
- `GET /reservations` - List reservations
- `GET /reservations/:id` - Get reservation by ID
- `PATCH /reservations/:id` - Update reservation
- `DELETE /reservations/:id` - Cancel reservation (when status is open)

### Mail (Optional)
- `POST /mail` - Send email
- `GET /mail` - List emails
- `GET /mail/:id` - Get email by ID
- `PATCH /mail/:id` - Update email status

## Architecture

The project follows a modular architecture with the following structure:

```
├── src/
│   ├── auth/             # Authentication module
│   ├── clients/          # Clients module
│   ├── config/           # Configuration files
│   ├── enums/            # Enumerations
│   ├── mail/             # Email module
│   ├── prisma/           # Prisma ORM setup
│   ├── reservations/     # Reservations module
│   ├── resources/        # Resources module
│   ├── spaces/           # Spaces module
│   └── users/            # Users module
├── test/                 # Tests
├── prisma/               # Prisma schema and migrations
└── docker-compose.yml    # Docker configuration
```

## Testing

To run tests:

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

<a name="compass-reservation-pt"></a>
# Compass Reservation (PT-BR)

<p align="center">
  <img src="https://via.placeholder.com/150?text=CR" alt="Compass Reservation Logo">
</p>

## Sobre

Compass Reservation é um sistema robusto de gerenciamento de reservas desenvolvido para administrar reservas de espaços, recursos e informações de clientes. O sistema apresenta um fluxo completo de autenticação, gerenciamento de usuários, gerenciamento de clientes, gerenciamento de espaços e recursos e tratamento de reservas.

## Tecnologias

- NestJS
- TypeScript
- Prisma ORM
- MySQL
- Docker
- Jest
- Swagger

## Funcionalidades

- Autenticação com JWT
- Gerenciamento de usuários (CRUD)
- Gerenciamento de clientes (CRUD)
- Gerenciamento de espaços (CRUD)
- Gerenciamento de recursos (CRUD)
- Gerenciamento de reservas (CRUD)
- Módulo de e-mail (opcional)

## Como Começar

### Pré-requisitos

- Node.js (v16+)
- npm ou yarn
- Docker e Docker Compose (para o banco de dados)

### Instalação

1. Clone o repositório
```bash
git clone https://github.com/seuusuario/ANMAR25_D02_COMPASSRESERVATION.git
cd ANMAR25_D02_COMPASSRESERVATION
```

2. Instale as dependências
```bash
npm install
# ou
yarn install
```

3. Crie um arquivo `.env` no diretório raiz com o seguinte conteúdo:
```env
# Banco de Dados
DATABASE_URL="mysql://usuario:senha@localhost:3306/compass_reservation"

# Configuração do Docker para MySQL
MYSQL_ROOT_PASSWORD=senhadoroot
MYSQL_DB_NAME=compass_reservation
MYSQL_USER=usuario
MYSQL_PASSWORD=senha
MYSQL_DB_PORT=3306

# Autenticação
JWT_SECRET="sua-chave-secreta"
JWT_EXPIRATION="1d"

# Usuário Padrão
DEFAULT_USER_NAME="Admin"
DEFAULT_USER_EMAIL="admin@example.com"
DEFAULT_USER_PASSWORD="senha123"

# E-mail (Opcional)
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASSWORD=
MAIL_FROM=
```

4. Inicie o banco de dados MySQL usando Docker
```bash
docker-compose up -d
```

Nossa configuração do Docker:
```yaml
services:
  db_mysql:
    container_name: compassreservation_mysql
    image: mysql:8.0
    ports:
      - ${MYSQL_DB_PORT}:${MYSQL_DB_PORT}
    volumes:
      - compassreservation_mysql_volume:/var/lib/mysql
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_DATABASE=${MYSQL_DB_NAME}
      - MYSQL_USER=${MYSQL_USER}
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
volumes:
  compassreservation_mysql_volume:
```

5. Execute as migrações do banco de dados
```bash
npx prisma migrate dev
```

6. Popule o banco de dados com o usuário padrão
```bash
npm run seed
# ou
yarn seed
```

7. Inicie o servidor de desenvolvimento
```bash
npm run start:dev
# ou
yarn start:dev
```

8. Acesse a documentação da API Swagger em:
```
http://localhost:3000/api
```

## Endpoints da API

### Autenticação
- `POST /auth/login` - Login de usuário

### Usuários
- `POST /users` - Criar um usuário
- `GET /users` - Listar usuários
- `GET /users/:id` - Obter usuário por ID
- `PATCH /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Excluir usuário (definir como inativo)

### Clientes
- `POST /clients` - Criar um cliente
- `GET /clients` - Listar clientes
- `GET /clients/:id` - Obter cliente por ID
- `PATCH /clients/:id` - Atualizar cliente
- `DELETE /clients/:id` - Excluir cliente (definir como inativo)

### Espaços
- `POST /spaces` - Criar um espaço
- `GET /spaces` - Listar espaços
- `GET /spaces/:id` - Obter espaço por ID
- `PATCH /spaces/:id` - Atualizar espaço
- `DELETE /spaces/:id` - Excluir espaço (definir como inativo)

### Recursos
- `POST /resources` - Criar um recurso
- `GET /resources` - Listar recursos
- `GET /resources/:id` - Obter recurso por ID
- `PATCH /resources/:id` - Atualizar recurso
- `DELETE /resources/:id` - Excluir recurso (definir como inativo)

### Reservas
- `POST /reservations` - Criar uma reserva
- `GET /reservations` - Listar reservas
- `GET /reservations/:id` - Obter reserva por ID
- `PATCH /reservations/:id` - Atualizar reserva
- `DELETE /reservations/:id` - Cancelar reserva (quando o status é aberto)

### E-mail (Opcional)
- `POST /mail` - Enviar e-mail
- `GET /mail` - Listar e-mails
- `GET /mail/:id` - Obter e-mail por ID
- `PATCH /mail/:id` - Atualizar status do e-mail

## Arquitetura

O projeto segue uma arquitetura modular com a seguinte estrutura:

```
├── src/
│   ├── auth/             # Módulo de autenticação
│   ├── clients/          # Módulo de clientes
│   ├── config/           # Arquivos de configuração
│   ├── enums/            # Enumerações
│   ├── mail/             # Módulo de e-mail
│   ├── prisma/           # Configuração do Prisma ORM
│   ├── reservations/     # Módulo de reservas
│   ├── resources/        # Módulo de recursos
│   ├── spaces/           # Módulo de espaços
│   └── users/            # Módulo de usuários
├── test/                 # Testes
├── prisma/               # Schema e migrações do Prisma
└── docker-compose.yml    # Configuração do Docker
```

## Testes

Para executar os testes:

```bash
# Testes unitários
npm run test

# Testes end-to-end
npm run test:e2e

# Cobertura de testes
npm run test:cov
```
