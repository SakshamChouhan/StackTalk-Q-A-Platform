# StackTalk Architecture

This document provides an overview of the architecture, design patterns, and data flow in the StackTalk application.

## System Architecture

StackTalk follows a modern full-stack architecture with clear separation of concerns:

```
┌─────────────────┐     ┌────────────────┐     ┌────────────────┐
│                 │     │                │     │                │
│  React Client   │────▶│  Express API   │────▶│  PostgreSQL    │
│                 │◀────│                │◀────│                │
└─────────────────┘     └────────────────┘     └────────────────┘
```

### Key Components

#### 1. Frontend (React)
- **UI Layer**: React components with Shadcn UI
- **State Management**: React Context for user state, React Query for server state
- **Routing**: Wouter for lightweight routing
- **API Interaction**: TanStack Query for data fetching and mutations

#### 2. Backend (Express)
- **API Layer**: Express.js REST endpoints
- **Storage Interface**: Abstract interface for data operations
- **Database Access**: PostgreSQL implementation via Drizzle ORM
- **Validation**: Zod schemas for request validation

#### 3. Database (PostgreSQL)
- Relational database with tables for users, questions, and answers
- Foreign key constraints for data integrity

## Data Model

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Users     │       │  Questions  │       │   Answers   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id          │       │ id          │       │ id          │
│ username    │       │ title       │       │ questionId  │──┐
└─────────────┘       │ body        │       │ body        │  │
       ▲              │ username    │◀──┐   │ username    │  │
       │              │ createdAt   │   │   │ createdAt   │  │
       │              └─────────────┘   │   └─────────────┘  │
       │                     ▲          │          ▲         │
       └─────────────────────┘          └──────────┘         │
                                                             │
                                                             │
                          ┌─────────────────────────────────┘
                          │
                          │
                ┌─────────┴──────┐
                │  Relationships │
                └────────────────┘
```

### Entity Relationships

- **User to Questions**: One-to-many (a user can ask multiple questions)
- **Question to Answers**: One-to-many (a question can have multiple answers)
- **User to Answers**: One-to-many (a user can provide multiple answers)

## Code Organization

### Backend Structure

```
server/
├── db.ts                # Database connection setup
├── index.ts             # Server entry point
├── migrations.ts        # Database migration logic
├── pgStorage.ts         # PostgreSQL implementation of storage interface
├── routes.ts            # API route definitions
├── storage.ts           # Storage interface definition and MemStorage implementation
└── vite.ts              # Development server configuration
```

### Frontend Structure

```
client/src/
├── components/          # UI components
│   ├── ui/              # Shadcn UI components
│   └── ...              # App-specific components
├── context/             # React context providers
│   └── UserContext.tsx  # User authentication context
├── hooks/               # Custom React hooks
│   ├── useQuestions.ts  # Question-related data fetching
│   └── ...              # Other hooks
├── lib/                 # Utility functions
├── pages/               # Page components
└── App.tsx              # Main application component
```

### Shared Code

```
shared/
└── schema.ts            # Database schema and shared type definitions
```

## Data Flow

### Authentication Flow

1. User enters a username
2. Frontend sends a POST request to `/api/user`
3. Backend checks if the username exists:
   - If exists, returns the existing user
   - If not, creates a new user
4. Frontend stores the user in Context and localStorage
5. User is considered logged in

### Question Submission Flow

1. User fills out question form
2. Frontend validates input using Zod schema
3. On submission, POST request to `/api/questions`
4. Backend validates input and creates question in database
5. Frontend invalidates question cache to refresh listings
6. User is redirected to the question detail page

### Answer Submission Flow

1. User views a question and types an answer
2. Frontend validates input using Zod schema
3. On submission, POST request to `/api/questions/:id/answers`
4. Backend validates input and creates answer in database
5. Frontend invalidates question detail cache to show the new answer
6. UI updates to display the new answer

## API Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/user` | POST | Login or register | `{ username: string }` | User object |
| `/api/user/:username/questions` | GET | Get user's questions | - | Array of questions |
| `/api/questions` | GET | Get all questions | - | Array of questions |
| `/api/questions` | POST | Create a question | Question object | Created question |
| `/api/questions/:id` | GET | Get question details | - | Question with answers |
| `/api/questions/:id/answers` | POST | Add answer to question | Answer object | Created answer |

## Storage Interface

The application uses a storage interface pattern to abstract the data access layer:

```typescript
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Question methods
  getQuestions(): Promise<Question[]>;
  getQuestionById(id: number): Promise<Question | undefined>;
  getQuestionsByUsername(username: string): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  
  // Answer methods
  getAnswersByQuestionId(questionId: number): Promise<Answer[]>;
  createAnswer(answer: InsertAnswer): Promise<Answer>;
  getAnswersCountByQuestionId(questionId: number): Promise<number>;
}
```

This interface is implemented by both:
- `MemStorage`: In-memory implementation for development/testing
- `PgStorage`: PostgreSQL implementation for production use

## Deployment Considerations

For deployment:
1. Set up production PostgreSQL database
2. Configure environment variables for database connection
3. Build the frontend for production: `npm run build`
4. Deploy to a Node.js hosting environment
5. Ensure database migrations run on startup