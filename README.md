# StackTalk - Q&A Platform

StackTalk is a lightweight Q&A platform similar to Stack Overflow, allowing users to ask questions, answer others' questions, and track their contributions. Built with modern web technologies, it offers a seamless experience for knowledge sharing and community building.

![StackTalk Screenshot](screenshot.png)

## Features

- **User Authentication**: Simple username-based authentication
- **Ask Questions**: Post questions with detailed descriptions
- **Answer Questions**: Contribute answers to the community
- **User Profiles**: Track your questions and contributions
- **Persistent Storage**: PostgreSQL database for reliable data storage

## Tech Stack

### Frontend
- React with TypeScript
- Shadcn UI components with Tailwind CSS
- TanStack React Query for data fetching
- Wouter for routing

### Backend
- Express.js API server
- PostgreSQL database with Drizzle ORM
- Zod for validation

## Getting Started

### Prerequisites
- Node.js v16 or higher
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/stacktalk.git
cd stacktalk
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with:
```
DATABASE_URL=postgresql://username:password@localhost:5432/stacktalk
```

4. Set up the database
```bash
npm run db:push
```

5. Start the development server
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5000`

## Usage

1. **Register/Login**: Enter a username to get started
2. **Ask a Question**: Click "Ask Question" to create a new thread
3. **Browse Questions**: View all questions on the homepage
4. **Answer Questions**: Contribute your knowledge by answering others' questions
5. **Track Your Activity**: View your questions in the "My Questions" section

## Project Structure

```
.
├── client/                  # Frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions
│   │   ├── pages/           # Page components
│   │   └── types/           # TypeScript type definitions
├── server/                  # Backend application
│   ├── db.ts                # Database connection
│   ├── index.ts             # Express server entry point
│   ├── migrations.ts        # Database migrations
│   ├── pgStorage.ts         # PostgreSQL storage implementation
│   ├── routes.ts            # API routes
│   ├── storage.ts           # Storage interface
│   └── vite.ts              # Vite development server setup
├── shared/                  # Shared code between frontend and backend
│   └── schema.ts            # Database schema and types
└── package.json             # Project dependencies and scripts
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful component library
- [Drizzle ORM](https://orm.drizzle.team/) for database interactions
- [TanStack Query](https://tanstack.com/query/latest) for data fetching