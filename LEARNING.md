# Learning Guide: NestJS + Prisma + JWT Authentication

A comprehensive guide to understanding this project's architecture, patterns, and how every piece fits together.

---

## Table of Contents

1. [Project Setup & Tooling](#1-project-setup--tooling)
2. [NestJS Fundamentals](#2-nestjs-fundamentals)
3. [Prisma ORM](#3-prisma-orm)
4. [JWT Authentication](#4-jwt-authentication)
5. [Role-Based Access Control (RBAC)](#5-role-based-access-control-rbac)
6. [Request Lifecycle](#6-request-lifecycle)
7. [Testing](#7-testing)
8. [API Reference](#8-api-reference)

---

## 1. Project Setup & Tooling

### Getting Started

```bash
# 1. Start the database
docker compose up -d

# 2. Install dependencies
pnpm install

# 3. Copy environment variables
cp .env.example .env

# 4. Run database migrations
pnpm run prisma:migrate

# 5. Seed the database with initial data
pnpm run prisma:seed

# 6. Start the dev server
pnpm run start:dev
```

The server runs at `http://localhost:3000`. All routes are prefixed with `/api`.

### Environment Variables

| Variable        | Description                  | Default                        |
| --------------- | ---------------------------- | ------------------------------ |
| `DATABASE_URL`  | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/nestjs_app` |
| `JWT_SECRET`    | Secret key for signing JWTs  | (must be set)                  |
| `JWT_EXPIRES_IN`| Token expiration time        | `1d`                           |
| `PORT`          | Server port                  | `3000`                         |

### Build System

The project uses **SWC** instead of the default TypeScript compiler for faster builds. This is configured in `nest-cli.json`:

```json
{
  "compilerOptions": {
    "builder": "swc",
    "typeCheck": true
  }
}
```

SWC compiles TypeScript much faster than `tsc` but doesn't type-check, so `typeCheck: true` runs `tsc` in parallel for safety.

---

## 2. NestJS Fundamentals

### What is NestJS?

NestJS is a framework for building server-side Node.js applications. It uses **decorators** and **dependency injection** — concepts borrowed from Angular. If you've used Spring Boot (Java) or ASP.NET, NestJS will feel familiar.

### Core Concepts

#### Modules

Every NestJS app is organized into **modules**. A module is a class decorated with `@Module()` that groups related functionality.

```typescript
// src/users/users.module.ts
@Module({
  controllers: [UsersController],   // handles HTTP requests
  providers: [UsersService],        // business logic / services
  exports: [UsersService],          // makes UsersService available to other modules
})
export class UsersModule {}
```

The **root module** (`AppModule`) imports all other modules:

```typescript
// src/app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  // .env variables, available everywhere
    PrismaModule,       // database access
    AuthModule,         // authentication
    UsersModule,        // user management
    RolesModule,        // role management
    PermissionsModule,  // permission management
  ],
})
export class AppModule {}
```

**Key rule:** A service is only usable in modules that import the module where it's defined — *unless* that module is `@Global()`.

#### Controllers

Controllers handle incoming HTTP requests and return responses. Each method is mapped to a route via decorators:

```typescript
// src/auth/auth.controller.ts
@Controller('auth')   // base path: /api/auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()            // skips JWT authentication (explained later)
  @Post('register')    // POST /api/auth/register
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @Get('me')           // GET /api/auth/me (requires JWT by default)
  getProfile(@CurrentUser('id') userId: string) {
    return this.authService.getProfile(userId)
  }
}
```

**Decorator cheat sheet:**

| Decorator         | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `@Controller(path)` | Defines a controller with a base route |
| `@Get()`, `@Post()`, `@Patch()`, `@Delete()` | HTTP method handlers |
| `@Body()`         | Extracts the request body                |
| `@Param('id')`    | Extracts a URL parameter                 |
| `@Query()`        | Extracts query string parameters         |

#### Services (Providers)

Services contain business logic. They're injected into controllers via the constructor:

```typescript
// src/users/users.service.ts
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationQueryDto) {
    const [total, items] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.findMany({
        select: userSelect,
        skip: query.skip,
        take: query.limit,
        orderBy: { createdAt: 'desc' },
      }),
    ])
    return { items, total, page: query.page, limit: query.limit }
  }
}
```

**Dependency Injection (DI)** is the core pattern: you declare what a class needs in its constructor, and NestJS automatically provides ("injects") the instances. You never call `new UsersService()` yourself.

#### The Global Module Pattern

The `PrismaModule` is decorated with `@Global()`, meaning `PrismaService` is available everywhere without explicitly importing `PrismaModule`:

```typescript
// src/prisma/prisma.module.ts
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

### Bootstrap (`main.ts`)

The entry point configures global behavior that applies to **every** request:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')  // all routes start with /api

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // strips unknown properties from body
      forbidNonWhitelisted: true,   // throws error if unknown properties sent
      transform: true,              // auto-converts types (e.g., string "1" → number 1)
    }),
  )

  app.useGlobalFilters(new HttpExceptionFilter())      // standardizes error responses
  app.useGlobalInterceptors(new TransformInterceptor()) // wraps responses in { data: ... }

  await app.listen(process.env.PORT ?? 3000)
}
```

### DTOs and Validation

**DTOs** (Data Transfer Objects) define and validate the shape of incoming request data using `class-validator` decorators:

```typescript
// src/auth/dto/register.dto.ts
export class RegisterDto {
  @IsEmail()
  email!: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string

  @IsString()
  @IsNotEmpty()
  name!: string
}
```

When a request hits `POST /api/auth/register`, NestJS automatically:
1. Creates a `RegisterDto` instance from the request body
2. Validates it using the decorators
3. Returns a `400 Bad Request` with details if validation fails
4. Strips any extra fields not defined in the DTO (`whitelist: true`)

### Pagination

A shared DTO handles paginated list endpoints:

```typescript
// src/common/dto/pagination-query.dto.ts
export class PaginationQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number = 1

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  limit?: number = 10

  get skip(): number {
    return ((this.page ?? 1) - 1) * (this.limit ?? 10)
  }
}
```

Usage: `GET /api/users?page=2&limit=20`

### Response Wrapping

The `TransformInterceptor` wraps every successful response:

```typescript
// What the service returns:
{ id: '...', email: 'admin@example.com', name: 'Admin' }

// What the client receives:
{ data: { id: '...', email: 'admin@example.com', name: 'Admin' } }
```

### Error Handling

The `HttpExceptionFilter` catches all exceptions and normalizes them:

```json
{
  "statusCode": 401,
  "timestamp": "2026-02-07T12:00:00.000Z",
  "message": "Invalid credentials"
}
```

Non-HTTP exceptions (unexpected errors) become `500 Internal Server Error`.

---

## 3. Prisma ORM

### What is Prisma?

Prisma is a **type-safe ORM** for Node.js. You define your database schema in a `.prisma` file, and Prisma generates a fully-typed TypeScript client that you use to query the database. No raw SQL needed for most operations.

### The Schema (`prisma/schema.prisma`)

This is the single source of truth for your database structure:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"   // where the generated client goes
}

datasource db {
  provider = "postgresql"
}
```

#### Models = Database Tables

Each `model` maps to a table:

```prisma
model User {
  id        String   @id @default(uuid())       // PK, auto-generated UUID
  email     String   @unique                     // unique constraint
  password  String
  name      String
  createdAt DateTime @default(now()) @map("created_at")  // auto-set on create
  updatedAt DateTime @updatedAt @map("updated_at")       // auto-set on update

  userRoles       UserRole[]          // relation: one user → many UserRole entries
  userPermissions UserPermission[]

  @@map("users")   // actual table name in PostgreSQL (snake_case convention)
}
```

**Important decorators:**

| Decorator          | Purpose                                        |
| ------------------ | ---------------------------------------------- |
| `@id`              | Marks the primary key                          |
| `@default(uuid())` | Auto-generates a UUID                         |
| `@unique`          | Creates a unique constraint                    |
| `@updatedAt`       | Auto-updates the timestamp on every change     |
| `@map("...")`      | Maps the Prisma field name to a DB column name |
| `@@map("...")`     | Maps the model name to a DB table name         |
| `@@id([a, b])`     | Composite primary key                          |
| `@@unique([a, b])` | Composite unique constraint                    |

#### The Triangle M2M Relationship

This project has a "triangle" of many-to-many relationships using **explicit join tables**:

```
    Users ←——→ Roles
      ↑           ↑
      |           |
      └——→ Permissions ←——┘
```

- **UserRole**: links users to roles (e.g., "admin@example.com has the admin role")
- **RolePermission**: links roles to permissions (e.g., "the admin role can create:user")
- **UserPermission**: links users *directly* to permissions, bypassing roles

```prisma
model UserRole {
  userId     String   @map("user_id")
  roleId     String   @map("role_id")
  assignedAt DateTime @default(now()) @map("assigned_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role Role @relation(fields: [roleId], references: [id], onDelete: Cascade)

  @@id([userId, roleId])   // composite PK — a user can only have a role once
  @@map("user_roles")
}
```

**`onDelete: Cascade`** means if a User is deleted, all their `UserRole` entries are automatically deleted too.

### Prisma 7 Specifics

This project uses **Prisma 7**, which requires a **driver adapter** instead of managing connections internally:

```typescript
// src/prisma/prisma.service.ts
import { PrismaClient } from '../generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(configService: ConfigService) {
    const adapter = new PrismaPg({
      connectionString: configService.get<string>('DATABASE_URL')!,
    })
    super({ adapter })  // pass the adapter to PrismaClient
  }

  async onModuleInit() {
    await this.$connect()     // connect when the module starts
  }

  async onModuleDestroy() {
    await this.$disconnect()  // disconnect on shutdown
  }
}
```

Key differences from older Prisma versions:
- **No more `new PrismaClient()` without arguments** — you must provide an adapter
- The generated client is output to `src/generated/prisma/` so it compiles into `dist/`
- Seed configuration lives in `prisma.config.ts`, not `package.json`

### Migrations

Migrations track database schema changes over time:

```bash
# Create a migration after changing schema.prisma
pnpm run prisma:migrate

# Regenerate the TypeScript client after schema changes
pnpm run prisma:generate

# Open a visual database browser
pnpm run prisma:studio
```

### Common Query Patterns

```typescript
// Find one by unique field
const user = await this.prisma.user.findUnique({ where: { email } })

// Find one or throw (404-like)
const user = await this.prisma.user.findUniqueOrThrow({ where: { id } })

// Create
const user = await this.prisma.user.create({
  data: { email, password: hashedPassword, name },
})

// Update
const user = await this.prisma.user.update({
  where: { id },
  data: { name: 'New Name' },
})

// Delete
await this.prisma.user.delete({ where: { id } })

// Paginated list with count
const [total, items] = await Promise.all([
  this.prisma.user.count(),
  this.prisma.user.findMany({
    skip: 0,
    take: 10,
    orderBy: { createdAt: 'desc' },
  }),
])

// Include related data (JOINs)
const user = await this.prisma.user.findUniqueOrThrow({
  where: { id },
  include: {
    userRoles: { include: { role: true } },
    userPermissions: { include: { permission: true } },
  },
})

// Select specific fields (exclude password)
const userSelect = {
  id: true,
  email: true,
  name: true,
  createdAt: true,
  updatedAt: true,
  // password deliberately omitted
}
const users = await this.prisma.user.findMany({ select: userSelect })

// Upsert (create or update)
const role = await this.prisma.role.upsert({
  where: { name: 'admin' },
  update: {},
  create: { name: 'admin', description: 'Administrator' },
})
```

### The Seed Script (`prisma/seed.ts`)

Seeds populate the database with initial data. This project's seed creates:

1. **12 permissions**: CRUD (`create`, `read`, `update`, `delete`) for 3 resources (`user`, `role`, `permission`)
2. **2 roles**: `admin` (all permissions) and `user` (read-only)
3. **2 users**: `admin@example.com` (password: `admin123`) and `user@example.com` (password: `user1234`)
4. Role assignments and one example direct permission

```bash
pnpm run prisma:seed
```

---

## 4. JWT Authentication

### How JWT Auth Works

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│  Client   │         │  Server   │         │ Database  │
└─────┬────┘         └─────┬────┘         └─────┬────┘
      │  POST /api/auth/login     │               │
      │  { email, password }      │               │
      │──────────────────────────→│               │
      │                           │  find user    │
      │                           │──────────────→│
      │                           │  user data    │
      │                           │←──────────────│
      │                           │               │
      │                           │ compare password (bcrypt)
      │                           │ generate JWT token
      │                           │               │
      │  { accessToken, user }    │               │
      │←──────────────────────────│               │
      │                           │               │
      │  GET /api/users           │               │
      │  Authorization: Bearer <token>            │
      │──────────────────────────→│               │
      │                           │ verify JWT    │
      │                           │ extract user info
      │                           │──────────────→│
      │                           │←──────────────│
      │  { data: [...users] }     │               │
      │←──────────────────────────│               │
```

A **JWT (JSON Web Token)** is a signed string that contains a payload (like the user ID). The server signs it with a secret key. On subsequent requests, the client sends this token, and the server verifies it without touching the database.

### The Auth Flow in Code

#### Step 1: Registration

```typescript
// src/auth/auth.service.ts
async register(dto: RegisterDto) {
  // Check if email is already taken
  const existing = await this.prisma.user.findUnique({ where: { email: dto.email } })
  if (existing) throw new ConflictException('Email already in use')

  // Hash the password (NEVER store plain text passwords)
  const hashedPassword = await bcrypt.hash(dto.password, 10)  // 10 = salt rounds

  // Create the user
  const user = await this.prisma.user.create({
    data: { email: dto.email, password: hashedPassword, name: dto.name },
  })

  // Generate a JWT and return it
  const token = this.generateToken(user.id, user.email)
  return { accessToken: token, user: { id: user.id, email: user.email, name: user.name } }
}
```

#### Step 2: Login

```typescript
async login(dto: LoginDto) {
  // Validate email + password
  const user = await this.validateUser(dto.email, dto.password)

  // Generate a JWT and return it
  const token = this.generateToken(user.id, user.email)
  return { accessToken: token, user: { id: user.id, email: user.email, name: user.name } }
}

async validateUser(email: string, password: string) {
  const user = await this.prisma.user.findUnique({ where: { email } })
  if (!user) throw new UnauthorizedException('Invalid credentials')

  // bcrypt.compare handles hashing the input and comparing
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials')

  return user
}
```

**Security note:** The error message is intentionally vague ("Invalid credentials") for both wrong email and wrong password. This prevents attackers from knowing which one was wrong.

#### Step 3: Token Generation

```typescript
private generateToken(userId: string, email: string): string {
  return this.jwtService.sign({ sub: userId, email })
}
```

The JWT payload (`{ sub: userId, email }`) is encoded and signed. `sub` is a standard JWT claim meaning "subject" (the user ID).

#### Step 4: Token Verification (on every request)

The `JwtStrategy` handles extracting and verifying the token automatically via Passport.js:

```typescript
// src/auth/strategies/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  // reads "Authorization: Bearer <token>"
      ignoreExpiration: false,   // reject expired tokens
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    })
  }

  // Called AFTER the token is verified. The return value is set as `request.user`.
  validate(payload: JwtPayload) {
    return { id: payload.sub, email: payload.email }
  }
}
```

After this runs, `request.user` is `{ id: '...', email: '...' }` on every authenticated request.

### The Global JWT Guard

In most apps, you'd add `@UseGuards(JwtAuthGuard)` to every protected route. This project does it **globally** instead:

```typescript
// src/auth/auth.module.ts
providers: [
  { provide: APP_GUARD, useClass: JwtAuthGuard },   // EVERY route is protected
  { provide: APP_GUARD, useClass: PermissionsGuard }, // permission checking on top
]
```

This means **all routes require authentication by default**. To make a route public, use the `@Public()` decorator:

```typescript
@Public()
@Post('login')
login(@Body() dto: LoginDto) { ... }
```

How `@Public()` works internally:

```typescript
// Sets metadata on the route handler
export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

// The guard reads that metadata
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true          // skip auth for @Public() routes
    return super.canActivate(context)  // otherwise, verify JWT
  }
}
```

### Custom Decorators

#### `@CurrentUser()`

Extracts the authenticated user from the request:

```typescript
// Gets the full user object
@Get('me')
getProfile(@CurrentUser() user: { id: string; email: string }) { ... }

// Gets a specific property
@Get('me')
getProfile(@CurrentUser('id') userId: string) { ... }
```

How it works:

```typescript
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const user = request.user          // set by JwtStrategy.validate()
    return data ? user[data] : user    // return specific field or full object
  },
)
```

---

## 5. Role-Based Access Control (RBAC)

### The Permission Model

Permissions follow the `action:resource` pattern:

| Permission          | Meaning                    |
| ------------------- | -------------------------- |
| `create:user`       | Can create users           |
| `read:user`         | Can view users             |
| `update:role`       | Can modify roles           |
| `delete:permission` | Can delete permissions     |

Users get permissions in two ways:
1. **Via roles**: User → Role → Permission (indirect)
2. **Direct assignment**: User → Permission (bypass roles)

### The `@RequirePermissions()` Decorator

Protects routes by requiring specific permissions:

```typescript
@RequirePermissions('create:user')
@Post()
create(@Body() dto: CreateUserDto) { ... }

// Multiple permissions — user must have ALL of them
@RequirePermissions('read:user', 'read:role')
@Get('dashboard')
dashboard() { ... }
```

### The Permissions Guard

When a request reaches a protected route, the `PermissionsGuard` runs:

```typescript
// src/auth/guards/permissions.guard.ts
async canActivate(context: ExecutionContext): Promise<boolean> {
  // 1. Read the required permissions from the decorator metadata
  const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
    PERMISSIONS_KEY,
    [context.getHandler(), context.getClass()],
  )

  // 2. If no permissions required, allow access
  if (!requiredPermissions || requiredPermissions.length === 0) return true

  // 3. Get the user ID from the JWT (set by JwtStrategy)
  const userId = request.user?.id
  if (!userId) return false

  // 4. Query the database for ALL the user's permissions (direct + via roles)
  const [directPermissions, rolePermissions] = await Promise.all([
    this.prisma.userPermission.findMany({
      where: { userId },
      include: { permission: true },
    }),
    this.prisma.userRole.findMany({
      where: { userId },
      include: { role: { include: { rolePermissions: { include: { permission: true } } } } },
    }),
  ])

  // 5. Build a set of all permissions the user has
  const userPermissions = new Set<string>()
  for (const dp of directPermissions) {
    userPermissions.add(`${dp.permission.action}:${dp.permission.resource}`)
  }
  for (const ur of rolePermissions) {
    for (const rp of ur.role.rolePermissions) {
      userPermissions.add(`${rp.permission.action}:${rp.permission.resource}`)
    }
  }

  // 6. Check that the user has EVERY required permission
  return requiredPermissions.every((perm) => userPermissions.has(perm))
}
```

### Guard Execution Order

Guards run in this order for every request:

```
Request → JwtAuthGuard → PermissionsGuard → Controller Method
              │                │
              │                └─ checks permissions (if @RequirePermissions is set)
              └─ skips if @Public(), otherwise verifies JWT
```

---

## 6. Request Lifecycle

Here's what happens when a client sends `GET /api/users?page=2`:

```
1. HTTP Request arrives
   ↓
2. Global Prefix — matches /api/...
   ↓
3. JwtAuthGuard — extracts "Bearer <token>" from header
   → JwtStrategy verifies token, sets request.user = { id, email }
   ↓
4. PermissionsGuard — reads @RequirePermissions('read:user')
   → queries DB for user's permissions
   → checks user has 'read:user' → allows
   ↓
5. ValidationPipe — validates query params using PaginationQueryDto
   → page=2 → valid, limit defaults to 10
   ↓
6. UsersController.findAll() called
   → delegates to UsersService.findAll()
   ↓
7. UsersService queries Prisma
   → SELECT count(*) FROM users
   → SELECT * FROM users OFFSET 10 LIMIT 10 ORDER BY created_at DESC
   ↓
8. TransformInterceptor wraps response
   → { data: { items: [...], total: 50, page: 2, limit: 10 } }
   ↓
9. HTTP Response sent (200 OK)
```

If anything goes wrong:

```
Error thrown anywhere
   ↓
HttpExceptionFilter catches it
   → { statusCode: 4xx/5xx, timestamp: '...', message: '...' }
   ↓
HTTP Response sent
```

---

## 7. Testing

### Unit Tests

Located alongside source files (`*.spec.ts`). They mock dependencies and test services in isolation.

```bash
pnpm run test          # run once
pnpm run test:watch    # watch mode
pnpm run test:cov      # with coverage report
```

Example pattern from `auth.service.spec.ts`:

```typescript
describe('AuthService', () => {
  let service: AuthService

  // Mock the database and JWT service — no real DB needed
  const mockPrisma = {
    user: {
      findUnique: vi.fn(),
      findUniqueOrThrow: vi.fn(),
      create: vi.fn(),
    },
  }
  const mockJwtService = { sign: vi.fn() }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile()

    service = module.get(AuthService)
  })

  it('should hash password and create user on register', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null)       // no existing user
    mockPrisma.user.create.mockResolvedValue(mockUser)       // return mock user
    mockJwtService.sign.mockReturnValue('mock-token')

    const result = await service.register({ email, password, name })

    expect(result.accessToken).toBe('mock-token')
    expect(result.user.email).toBe(email)
  })
})
```

### E2E Tests

Located in `test/` directory. They spin up the **real** NestJS application and make HTTP requests against it using `supertest`:

```bash
pnpm run test:e2e    # requires a running database!
```

Example:

```typescript
describe('Auth (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    app = await createTestApp()

    // Clean the database before tests
    await prisma.userPermission.deleteMany()
    await prisma.userRole.deleteMany()
    await prisma.rolePermission.deleteMany()
    await prisma.user.deleteMany()
    await prisma.role.deleteMany()
    await prisma.permission.deleteMany()
  })

  it('POST /api/auth/register — should register a new user', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'test@test.com', password: 'password123', name: 'Test' })
      .expect(201)

    expect(res.body.data.accessToken).toBeDefined()
    expect(res.body.data.user.email).toBe('test@test.com')
  })

  it('GET /api/auth/me — should return 401 without token', async () => {
    await request(app.getHttpServer())
      .get('/api/auth/me')
      .expect(401)
  })
})
```

**Important E2E considerations:**
- `fileParallelism: false` in the Vitest E2E config — tests run sequentially to avoid database conflicts
- Each test file cleans ALL tables in `beforeAll` (join tables first due to foreign key constraints)
- The test app setup mirrors `main.ts` — including `ValidationPipe`, `HttpExceptionFilter`, and `TransformInterceptor`

### Test Setup Helper

```typescript
// test/setup-app.ts
export async function createTestApp(): Promise<INestApplication> {
  const module = await Test.createTestingModule({
    imports: [AppModule],   // uses the REAL AppModule
  }).compile()

  const app = module.createNestApplication()

  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new TransformInterceptor())

  await app.init()
  return app
}
```

---

## 8. API Reference

### Authentication

| Method | Endpoint              | Auth     | Description                |
| ------ | --------------------- | -------- | -------------------------- |
| POST   | `/api/auth/register`  | Public   | Register a new user        |
| POST   | `/api/auth/login`     | Public   | Login, get JWT token       |
| GET    | `/api/auth/me`        | JWT      | Get current user's profile |

**Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@test.com","password":"secret123","name":"John"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

**Use the token:**
```bash
curl http://localhost:3000/api/auth/me \
  -H 'Authorization: Bearer <your-token-here>'
```

### Users

| Method | Endpoint                                  | Permission     |
| ------ | ----------------------------------------- | -------------- |
| POST   | `/api/users`                              | `create:user`  |
| GET    | `/api/users?page=1&limit=10`              | `read:user`    |
| GET    | `/api/users/:id`                          | `read:user`    |
| PATCH  | `/api/users/:id`                          | `update:user`  |
| DELETE | `/api/users/:id`                          | `delete:user`  |
| POST   | `/api/users/:id/roles`                    | `update:user`  |
| DELETE | `/api/users/:id/roles/:roleId`            | `update:user`  |
| POST   | `/api/users/:id/permissions`              | `update:user`  |
| DELETE | `/api/users/:id/permissions/:permissionId`| `update:user`  |

### Roles

| Method | Endpoint                                    | Permission     |
| ------ | ------------------------------------------- | -------------- |
| POST   | `/api/roles`                                | `create:role`  |
| GET    | `/api/roles?page=1&limit=10`                | `read:role`    |
| GET    | `/api/roles/:id`                            | `read:role`    |
| PATCH  | `/api/roles/:id`                            | `update:role`  |
| DELETE | `/api/roles/:id`                            | `delete:role`  |
| POST   | `/api/roles/:id/permissions`                | `update:role`  |
| DELETE | `/api/roles/:id/permissions/:permissionId`  | `update:role`  |

### Permissions

| Method | Endpoint                       | Permission            |
| ------ | ------------------------------ | --------------------- |
| POST   | `/api/permissions`             | `create:permission`   |
| GET    | `/api/permissions?page=1&limit=10` | `read:permission` |
| GET    | `/api/permissions/:id`         | `read:permission`     |
| PATCH  | `/api/permissions/:id`         | `update:permission`   |
| DELETE | `/api/permissions/:id`         | `delete:permission`   |

### Seeded Test Accounts

| Email               | Password   | Role    | Permissions                    |
| ------------------- | ---------- | ------- | ------------------------------ |
| `admin@example.com` | `admin123` | admin   | All CRUD on all resources      |
| `user@example.com`  | `user1234` | user    | Read-only + direct `create:user` |
