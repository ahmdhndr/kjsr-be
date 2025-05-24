# NestJS Starter ⚡️

Basic starter project for building scalable and maintainable [NestJS](https://nestjs.com) applications, equipped with developer-friendly tooling and CI-ready setup.

---

## ✨ Features

- 🚀 Built with [NestJS](https://nestjs.com)
- 📦 Auto-import sorting via `@trivago/prettier-plugin-sort-imports`
- 📋 Pre commit with [Husky](https://typicode.github.io/husky/) and commit linting with [Conventional Commits](https://www.conventionalcommits.org/)
- 📝 Logger with [Pino](https://getpino.io/#/)
- ✅ CI Workflows for type checking & linting
  > Check `.github/workflows/ci.yml` for more details.
- 🔒 Type safe environment variables.
- 📄 Swagger Docs

---

## 📦 Getting Started

This starter template assumes you are using `pnpm` as your package manager. Of course, `pnpm` and `npm` can be used interchangeably.

You can clone this project or use `npx` as below:

```bash
npx @ahmdhndrsyh/nestjs-starter my-app
cd my-app
mv env.example .env
pnpm start:dev
```

> `mv` is a `Unix` command and if you're come from `Windows`, you have 2 options:
>
> 1. Installing `Git Bash` and use `mv` command in the `bash`
> 2. Using Windows `move` command.

### 📋 Git Hooks & Commit Rules

This starter uses:

- [husky](https://typicode.github.io/husky/)
- [commitlint](https://commitlint.js.org/)

Conventional commit examples:

```bash
feat(auth): add JWT strategy
fix(core): fix logger context issue
chore: update dependencies
```

### 🔒 Type Safe Env Variables

This starter uses [Zod](https://zod.dev/) for validating your environment variables. You can define your environment variables in the `src/core/config/env.schema.ts` file.
Example:

```typescript
import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']), // defined in the schema but forgot added to the .env file
  PORT: z.string().transform(Number).default('3000'),
  // Add more environment variables as needed
});
```

it will be validated at runtime and will throw an error if the validation fails.

```bash
❌ Invalid environment variables:
{ _errors: [], NODE_ENV: { _errors: [ 'Required' ] } }
```

> Since there is already an `envSchema`, you can use that to get type completion for the env you created.
>
> ```typescript
> // main.ts
> import { env } from '@shared/utils';
>
> await app.listen(env.PORT); // The `env` used here is parsed from envSchema.
> ```

### 📄 Swagger Docs

This starter includes Swagger documentation for your API endpoints. You can access the API documentation at `http://localhost:3000/docs` or change to your preferred url in the `main.ts` file.
Here is an example of how to use it:

```typescript
// app.controller.ts
@Post() // Method Decorator
  @ApiParam({ name: 'message', description: 'Message to be sent' }) // Document the parameters present in the URL path
  @ApiBody({ // Document the content of the request body
    schema: {
      type: 'object',
      properties: {
        fullName: { type: 'string', example: 'John' },
      },
    },
  })
  greeting(
    @Body(new ZodValidationPipe(greetingSchema)) greetingDto: GreetingDto,
  ) {
    return this.appService.greeting(greetingDto);
  }
```

Visit [NestJS Swagger Docs](https://docs.nestjs.com/openapi/introduction) for more information.

### 🔧 Tooling

| Tool                      | Purpose                                 |
| ------------------------- | --------------------------------------- |
| `pino`                    | Fast, structured logging                |
| `prettier + sort-imports` | Auto-format + sort imports              |
| `eslint`                  | Lint codebase                           |
| `husky` + `commitlint`    | Enforce clean commit messages           |
| GitHub Actions            | Run Type Check & Linter on pull request |
