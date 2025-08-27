This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Installation

1. **Clone the Repository**
    ```bash
    https://github.com/ahmadgee02/GAMA.git
    cd GAMA/user_interface/frontend
    ```
2. **Install the Runtime Dependencies**
    ```bash
   	npm install
    # or
    yarn install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    
## ⚙️ Environment Variables (.env)

```ini
[Paths]
NEXT_PUBLIC_API_URL="GAMA Gateway Server URL"
NEXT_PUBLIC_SOCKET_URL="Agent Socket URL"
```

## 🗂️ Project Structure

```bash
frontend/
├── public/
├── app/
│   ├── agents/
│   │   └── page.tsx
│   ├── components
│   │   ├── chat
│   │   ├── common
│   │   ├── intentextExamples
│   │   ├── ModeSelection
│   │   ├── Prompts
│   │   └── users
│   ├── games/
│   │   └── page.tsx
│   ├── hooks/
│   │   └── WebSocketHook.ts
│   ├── incontext-examples/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── prompt/
│   │   └── page.tsx
│   ├── users/
│   │   └── page.tsx
│   ├── services/
│   │   ├── core/
│   │   │   └── HttpService.tsx
│   │   ├── AgentService.tsx
│   │   ├── AuthService.tsx
│   │   ├── IncontextExampleService.ts
│   │   ├── PromptService.ts
│   │   └── UserService.tsx
│   ├── store
│   │   ├── redux
│   │   │   ├── authSlice.ts
│   │   │   ├── chatSlice.ts
│   │   │   ├── errorSlice.ts
│   │   │   └── pageSlice.ts
│   │   ├── auth.ts
│   │   ├── hooks.ts
│   │   ├── index.ts
│   │   └── rootReducer.ts
│   ├── utils
│   │   ├── Contants.ts
│   │   └── index.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── StoreProvider.tsx
├── .env
├── .env.sample
├── .gitignore
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```/

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
