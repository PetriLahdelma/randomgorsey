# Storybook WIP Badge

This project has a Work In Progress (WIP) badge configured for all Storybook stories.

## Current Status
🔴 **WIP Badge ENABLED** - A red "WIP" badge appears in the bottom-right corner of all stories.

## What it does
- Displays a red badge with "WIP" text on every Storybook story
- Positioned at the bottom-right corner with a high z-index (9999)
- Uses the project's Badge component with `variant="danger"`
- Non-interactive (pointer-events: none)

## How to remove the WIP badge

When stories are ready for production and no longer work-in-progress:

1. **Edit the preview configuration:**
   ```bash
   open .storybook/preview.tsx
   ```

2. **Remove the WIPDecorator:**
   - Remove `WIPDecorator` from the decorators array
   - Remove or comment out the WIPDecorator function
   - Remove the Badge import if no longer needed

3. **Example of clean preview.tsx without WIP badge:**
   ```tsx
   const preview: Preview = {
     decorators: [
       // WIPDecorator, // <- Remove this line
       (Story) => (
         <MemoryRouter>
           <Story />
         </MemoryRouter>
       ),
     ],
     // ... rest of config
   };
   ```

## Files modified
- `.storybook/preview.tsx` - Added WIPDecorator
- `src/components/Text.tsx` - Fixed polymorphic typing for dateTime prop

## Badge component used
- Component: `src/components/Badge.tsx`
- Variant: `danger` (red background)
- Text: "WIP"

---
*This badge will appear on ALL new stories until manually removed from the global decorators.*
