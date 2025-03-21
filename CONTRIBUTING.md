# Contributing to StackTalk

We love your input! We want to make contributing to StackTalk as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Submit your pull request!

### Development Setup

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
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/stacktalk
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

### Coding Standards

- Use TypeScript for all code
- Follow the existing code style (ESLint and Prettier are configured)
- Write meaningful commit messages
- Include comments where necessary

## Project Structure

Understanding the codebase:

```
.
├── client/               # Frontend React application
├── server/               # Backend Express API
├── shared/               # Shared types and schemas
└── ...
```

### Key Technologies

- **Frontend**: React, TypeScript, Shadcn UI, TanStack Query
- **Backend**: Express.js, Drizzle ORM
- **Database**: PostgreSQL

## Adding New Features

When adding new features:

1. **Define the problem**: What are you trying to solve?
2. **Design the solution**: How will your feature work?
3. **Update shared schema**: If needed, add to `shared/schema.ts`
4. **Implement backend**: Add routes and storage methods
5. **Implement frontend**: Create components and hooks
6. **Test thoroughly**: Ensure everything works as expected
7. **Update documentation**: Document your changes

## Database Changes

If you're making changes to the database schema:

1. Update the tables in `shared/schema.ts`
2. Update relations if necessary
3. Ensure migration logic in `server/migrations.ts` is updated

## Testing

Currently, the project doesn't have automated tests. If you're adding tests:

1. Use Jest for unit and integration tests
2. Place frontend tests next to components
3. Place backend tests in a `__tests__` directory
4. Aim for good coverage of core functionality

## Reporting Bugs

We use GitHub issues to track public bugs. Report a bug by opening a new issue.

### Bug Report Template

- **Title**: Short, descriptive title of the bug
- **Description**: Clear description of the issue
- **Steps to Reproduce**: Numbered steps to reproduce the bug
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Screenshots**: If applicable
- **Environment**: Browser, OS, etc.

## Feature Requests

We also use GitHub issues to track feature requests. When requesting a feature:

- **Title**: Clear, concise description of the feature
- **Problem**: What problem does this feature solve?
- **Proposed Solution**: How do you envision this feature working?
- **Alternatives**: Have you considered alternative solutions?
- **Additional Context**: Any other context or screenshots

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.