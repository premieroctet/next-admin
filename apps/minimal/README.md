This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn && yarn dev
```

Init db

```bash
docker-compose up
yarn prisma migrate dev && yarn prisma db seed
```

Open [http://localhost:3000/admin](http://localhost:3000/admin) to see the admin
