# Next-Admin CLI

This CLI allows you to generate the required files to use Next-Admin in your project.

## Usage

If the CLI is installed globally or locally :

```bash
npx next-admin-cli --help
```

If the CLI is not installed :

```bash
npx @premieroctet/next-admin-cli --help
```

## Available commands

### `init`

This command generates the required files to use Next-Admin in your project. It accepts the following options:

- `--cwd <path>` : The Next.js project directory. Default: current directory
- `-s, --schema <path>` : The directory path where the Prisma schema is located, relative to the current directory, or cwd if provided
- `-r, --baseRoutePath <path>` : The base route path to access your admin in the browser (e.g: /admin). Default: /admin
- `-a, --baseApiPath <path>` : The base route path for the API routes (e.g: /api/admin). Default: /api/admin
