## Features

- 📝 Rich text editor with WYSIWYG interface
- 💾 Automatic saving while editing
- 🔄 Real-time updates
- 👥 Public/private note visibility
- 🔗 Shareable public links
- 📱 Responsive design

## Tech Stack

- **Frontend & Backend**: Next.js 14+ (App Router)
- **Editor**: TipTap
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS

## Key Technical Decisions

1. **App Router**: Leveraging Next.js 14 App Router for improved routing and server components
2. **Server Actions**: Using server actions for real-time data mutations
3. **Optimistic Updates**: Implementing optimistic updates for better UX
4. **Database Schema**: Normalized schema design for efficient note management

## Local Development Setup

1. Clone the repository:

```bash
git clone <https://github.com/yourusername/overnote.git>
```

2. Install dependencies:

```bash
npm install
```

3. Copy the `.env.example` file to `.env` and fill in your environment details
4. Start the database container:

```bash
docker-compose up -d
```

5. Run database migrations:

```bash
npx prisma migrate dev
```

6. Start the development server:

```bash
npm run dev
```

## Decision Making Process

1. **Editor Choice**: TipTap for its rich features and extensibility
2. **Database Choice**: PostgreSQL for its reliability and scalability
3. **ORM Choice**: Prisma for its type safety and ease of use
4. **Authentication**: NextAuth.js for its ease of integration and security
5. **React Query**: React Query for its efficient data fetching and caching
6. **Styling**: Tailwind CSS for its utility-first approach and ease of use
7. **Deployment**: Vercel for its ease of deployment and integration with Next.js
8. **Database**: Neon for its scalability and ease of use

## Deployment

- Frontend: Vercel (<https://overnote-seven.vercel.app/>)
- Database: Neon (<https://console.neon.tech/login>)
