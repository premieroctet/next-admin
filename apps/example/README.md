This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
pnpm i && pnpm dev
```

Init db

```bash
docker-compose up
pnpm prisma migrate dev && pnpm prisma db seed
```

Open [http://localhost:3000/admin](http://localhost:3000/admin) to see the admin
