# Contributing to Health+

## Development Process

### Branch Strategy
- `main` - Production branch
- `develop` - Staging branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Hot fix branches

### Creating a New Feature
1. Create a new branch from `develop`:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

2. Make your changes following coding standards
3. Submit PR by Tuesday 7 PM

### Pull Request Process
1. Update documentation
2. Update CHANGELOG.md
3. Get at least one approval
4. Pass all tests and lint checks

### Code Review Schedule
- PRs submitted by: Tuesday 7 PM
- Reviews conducted: Tuesday evening/Wednesday 

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```
Types: feat, fix, docs, style, refactor, test, chore

### Code Style
- Use Prettier for formatting
- Follow ESLint rules
- Use TypeScript for type safety
- Write meaningful comments
- Create comprehensive tests

## Pull Request Requirements
- Description of changes
- Screenshot/video for UI changes
- Test coverage report
- No merge conflicts
- Passing CI checks


## Testing Guidelines
- Unit tests for utilities
- Component tests for UI
- Integration tests for features
- E2E tests for critical flows

## Documentation
- Code comments
- API documentation
- Component documentation
- Architecture updates

## Questions?
Contact the team lead or post in our development channel.