# Ralph Loop: Debate Character Feature

Build a debate-style UI for VoteBlind where two Simpsons-style characters argue policy positions.

## Feature Requirements

### 1. Characters
- Two generic Simpsons-style cartoon avatars (SVG or CSS)
- Left character: progressive/collectivist (blue tones)
- Right character: libertarian/individualist (purple/gold tones)
- Simple, friendly but distinct designs
- No real political figures - generic cartoon people

### 2. Debate Format
Each topic has a conversation:
```
🔵 LEFT: "We need government action on [issue] -
         [benefit] for everyone."

🟣 RIGHT: "But that costs taxpayers [amount].
          [Market solution] works better."

🔵 LEFT: "[Rebuttal about market failures or
          social costs]"

🟣 RIGHT: "[Rebuttal about government inefficiency
          or individual freedom]"
```

### 3. Content Rules
- Include economic trade-offs: cost, inflation, debt, taxes
- Slightly adversarial but NEVER personal attacks
- Both sides make valid points
- Acknowledge real costs on both sides
- Keep each message under 100 characters

### 4. UI Behavior
- Initially show 2 messages (one each)
- "Tap for more" expands to full 4-message debate
- Messages animate in sequentially (chat-style, 300ms delay)
- Selected side highlights during/after selection
- Slider remains below the debate

### 5. Data Structure
Update PolicyTopic in types/index.ts:
```typescript
interface DebateMessage {
  side: 'left' | 'right';
  text: string;
}

interface PolicyTopic {
  // ... existing fields
  debate: DebateMessage[]; // 4 messages per topic
}
```

### 6. Component Structure
- `DebateCharacter.tsx` - SVG/CSS avatar component
- `DebateBubble.tsx` - Animated chat bubble
- `DebateView.tsx` - Full debate UI with expand/collapse
- Update `TopicSlider.tsx` to use DebateView

### 7. All 10 Topics Need Debates
Cover these economic angles across topics:
- Government spending / debt
- Inflation effects
- Tax burden
- Market efficiency
- Individual vs collective cost
- Long-term vs short-term trade-offs

## Completion Criteria
- [ ] Two distinct Simpsons-style character designs
- [ ] DebateView component with chat animation
- [ ] Tap to expand from 2 to 4 messages
- [ ] All 10 topics have 4-message debates
- [ ] Economic trade-offs included in debates
- [ ] Builds without errors
- [ ] Looks good on mobile (max-w-md)

Output `<promise>DEBATE FEATURE COMPLETE</promise>` when all criteria met.

## Current State
Check git status and existing components before starting.
Build iteratively: characters first, then component, then content.
