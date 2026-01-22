# Ralph Loop: Test Coverage

Add comprehensive unit tests for VoteBlind. Target: 80% coverage.

## Setup (if not done)
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Add to package.json:
```json
"scripts": {
  "test": "vitest",
  "test:coverage": "vitest --coverage"
}
```

## Priority Test Areas

### 1. Scoring Algorithm (Critical)
- `src/store/quizStore.ts` - calculateResults()
- Test: exact match = 100%, opposite = 0%, neutral handling
- Test: all parties scored correctly

### 2. Quiz Store
- State transitions
- Position setting
- Reset functionality
- Persistence

### 3. Components
- TopicSlider renders correctly
- Selection updates state
- Navigation works
- ResultsPage displays scores

## Test Structure
```
src/
  __tests__/
    scoring.test.ts
    quizStore.test.ts
    components/
      TopicSlider.test.tsx
      ResultsPage.test.tsx
```

## Completion Criteria
- [ ] Vitest configured and running
- [ ] Scoring algorithm fully tested
- [ ] Quiz store state tested
- [ ] Key components have render tests
- [ ] `npm run test` passes
- [ ] Coverage >= 80%

Output `<promise>TESTS COMPLETE</promise>` when coverage target met.
