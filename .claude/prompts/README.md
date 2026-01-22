# VoteBlind Ralph Loop Prompts

These prompts are designed for iterative development using the Ralph Loop technique.

## Usage (Manual)

Since the Ralph Loop plugin may have issues, run manually:

```bash
# Run a single iteration
cat .claude/prompts/debate-feature.md | claude --continue

# Run as loop (Ctrl+C to stop)
while true; do
  cat .claude/prompts/debate-feature.md | claude --continue
  sleep 2
done
```

## Available Prompts

| Prompt | Purpose | Completion Signal |
|--------|---------|-------------------|
| `debate-feature.md` | Build debate character UI | `DEBATE FEATURE COMPLETE` |
| `policy-research.md` | Add sources to party positions | `RESEARCH COMPLETE` |
| `test-coverage.md` | Add unit tests (80% target) | `TESTS COMPLETE` |
| `accessibility.md` | Fix a11y issues | `A11Y COMPLETE` |

## How It Works

1. Prompt describes the task with clear completion criteria
2. Claude works on the task, modifying files
3. Loop repeats - Claude sees its previous work
4. Continues until completion signal or manual stop

## Writing New Prompts

Include:
- Clear task description
- Specific completion criteria (checklist)
- `<promise>SIGNAL</promise>` output requirement
- Current state check instruction
