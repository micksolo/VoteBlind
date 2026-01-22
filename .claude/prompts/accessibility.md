# Ralph Loop: Accessibility Audit

Audit and fix all accessibility issues in VoteBlind.

## Setup
```bash
npm install -D @axe-core/react
```

## Audit Checklist

### Keyboard Navigation
- [ ] All interactive elements focusable
- [ ] Tab order logical
- [ ] Slider usable with arrow keys
- [ ] Escape closes any modals
- [ ] Enter/Space activates buttons

### Screen Readers
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] ARIA labels on icon-only buttons
- [ ] Live regions for dynamic content
- [ ] Heading hierarchy correct (h1 → h2 → h3)

### Visual
- [ ] Color contrast >= 4.5:1 (text)
- [ ] Color contrast >= 3:1 (UI elements)
- [ ] Not relying on color alone
- [ ] Focus indicators visible
- [ ] Text scalable to 200%

### Motion
- [ ] Respects prefers-reduced-motion
- [ ] Animations can be disabled

## Components to Audit
1. TopicSlider - slider buttons, labels
2. ResultsPage - score announcements
3. LocationPage - form inputs
4. Header/Footer - navigation
5. HomePage - links, buttons

## Testing
Run axe-core in browser console or add to tests.

## Completion Criteria
- [ ] Keyboard navigation works throughout
- [ ] Screen reader tested (VoiceOver/NVDA)
- [ ] Color contrast passes
- [ ] ARIA labels added where needed
- [ ] prefers-reduced-motion respected

Output `<promise>A11Y COMPLETE</promise>` when no critical issues remain.
