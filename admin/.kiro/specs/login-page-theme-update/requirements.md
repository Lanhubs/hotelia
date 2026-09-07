# Login Page Theme Update Requirements

## Introduction
Update the admin login page to match the dashboard page's theme and color combination, converting it from dark theme to light theme while preserving all functionality. This provides a consistent visual experience for hotel staff when accessing the admin system.

## Glossary
- **Dark Theme**: Current login page styling with dark backgrounds (`bg-[#0B0F19]`, `bg-[#121826]`)
- **Light Theme**: Dashboard styling with light backgrounds (`bg-white`, `bg-zinc-50`)
- **Dashboard Theme**: Visual design used in dashboard components (white backgrounds, zinc borders, indigo accents)
- **Color Mapping**: Systematic replacement of dark color classes with light equivalents

## Requirements

### Requirement 1: Color Scheme Conversion

**User Story:** As a hotel staff member, I want the login page to use light colors like the dashboard, so that I have a consistent visual experience.

#### Acceptance Criteria

1. Right panel background changed from `bg-[#0B0F19]` to `bg-white` or `bg-zinc-50`
2. Form input backgrounds changed from `bg-[#121826]` to `bg-white`
3. Text colors updated: `text-white` → `text-zinc-900`, `text-zinc-300` → `text-zinc-700`
4. Border colors updated: `border-zinc-800` → `border-zinc-200`
5. Accent colors preserved: `text-ink`, `text-indigo-600`, gradient buttons kept unchanged

### Requirement 2: Form Element Updates

**User Story:** As a user logging in, I want form elements to be clearly visible with proper contrast, so that I can easily enter my credentials.

#### Acceptance Criteria

1. All form inputs have white backgrounds and dark text for readability
2. All dropdowns/select elements updated to light theme
3. Checkbox styling updated for light theme with visible borders
4. Submit button retains indigo gradient but ensures text is clearly visible
5. "Forgot PIN / Access?" link uses appropriate color for light theme

### Requirement 3: Interactive Components

**User Story:** As a user selecting my role, I want role cards to be clearly visible with proper hover states, so that I can easily choose my access level.

#### Acceptance Criteria

1. Role selection cards updated to light theme with proper visual states
2. Selected role cards clearly indicated with `bg-zinc-50` and `border-ink`
3. Unselected role cards use `bg-white` with `border-zinc-200`
4. Hover effects work properly with `hover:shadow-md` and `hover:border-zinc-300`
5. Icon backgrounds and colors updated for light theme

### Requirement 4: Banners and Modals

**User Story:** As a user encountering errors or notifications, I want banners and modals to be clearly visible, so that I can understand system messages.

#### Acceptance Criteria

1. Quick demo banner uses `bg-indigo-50` instead of `bg-indigo-950/40`
2. Error banner uses `bg-red-50` with `text-red-700` instead of dark red background
3. Forgot credentials modal updated to light theme with `bg-white` background
4. Modal text colors updated for proper contrast on light background
5. Success/confirmation messages remain clearly visible

### Requirement 5: Layout Consistency

**User Story:** As a user viewing the login page, I want consistent styling with the dashboard, so that the visual transition is seamless.

#### Acceptance Criteria

1. All components use `rounded-2xl` for consistency with dashboard
2. All cards use `border border-zinc-200/80` like dashboard components
3. All shadows match dashboard styling (`shadow-[0_1px_3px_rgba(0,0,0,0.02)]`)
4. Left panel text has sufficient contrast on light/transparent backgrounds
5. Background image opacity adjusted if needed for readability

### Requirement 6: Functionality Preservation

**User Story:** As a user, I want all login features to work exactly as before, so that I can access the system without issues.

#### Acceptance Criteria

1. All login functionality works as before theme update
2. Role selection functionality unchanged
3. Quick demo login buttons work
4. Form validation and error messages work
5. Forgot credentials modal flow works
6. Responsive design works on all screen sizes

### Requirement 7: Accessibility Compliance

**User Story:** As a user with visual impairments, I want sufficient color contrast, so that I can use the login page effectively.

#### Acceptance Criteria

1. Sufficient color contrast for text on light backgrounds (WCAG AA minimum)
2. All interactive elements remain clearly visible
3. Form labels and instructions remain clear
4. Error states clearly distinguishable
5. Focus indicators visible for keyboard navigation

## Technical Notes

### File to Modify
- `src/pages/LoginPage.tsx` - Only this file requires changes

### Implementation Approach
1. **Systematic Color Updates**: Replace dark theme classes with light theme equivalents
2. **No Structural Changes**: Keep all JSX structure, event handlers, and state management
3. **TypeScript Types**: No changes to types or interfaces required

### Testing Requirements
- **Visual Testing**: Verify light theme matches dashboard
- **Functional Testing**: Test all login scenarios
- **Responsive Testing**: Test mobile, tablet, and desktop views
- **Browser Testing**: Test in major browsers