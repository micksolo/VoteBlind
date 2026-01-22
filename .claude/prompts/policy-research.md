# Ralph Loop: Policy Research

Research and update party positions in src/data/topicsData.ts with cited sources.

## Task
For each of the 100 party positions (10 parties × 10 topics):
1. Find official party platform, policy document, or parliamentary voting record
2. Verify the position value (-2 to +2) is accurate
3. Add source_url to each PartyPosition

## Update Types
Add to PartyPosition in types/index.ts:
```typescript
interface PartyPosition {
  // ... existing
  source_url?: string;
  source_date?: string; // When policy was stated
}
```

## Sources to Check
- Official party websites (alp.org.au, liberal.org.au, greens.org.au, etc.)
- They Vote For You (theyvoteforyou.org.au)
- Parliamentary voting records
- 2022/2025 election policy documents

## Completion Criteria
- [ ] All 100 positions have source_url
- [ ] Sources are from 2022 or later
- [ ] Position values verified against sources
- [ ] TypeScript builds without errors

Output `<promise>RESEARCH COMPLETE</promise>` when all positions sourced.
