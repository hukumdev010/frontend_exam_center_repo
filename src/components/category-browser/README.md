# Category Browser Components

This directory contains the refactored components that were extracted from the large `CategoryBrowser.tsx` file to improve maintainability and code organization.

## Components Overview

### Core Components

- **`CategoryBrowser.tsx`** - Main container component that orchestrates all child components
- **`SearchSection.tsx`** - Handles search functionality and state management
- **`SearchResults.tsx`** - Displays search results with proper routing logic
- **`CategoryGrid.tsx`** - Shows category groups and individual category cards

### UI Components

- **`LoadingSpinner.tsx`** - Reusable loading indicator
- **`ErrorMessage.tsx`** - Displays error messages with optional retry functionality
- **`CertificationCard.tsx`** - Individual certification display card
- **`TeacherCard.tsx`** - Individual teacher profile card
- **`SearchResultsHeader.tsx`** - Header for search results with clear functionality
- **`NoResults.tsx`** - Empty state component when no search results are found

### Types

- **`/types/category-browser.ts`** - Shared TypeScript interfaces and types

## Benefits of Refactoring

1. **Smaller Files**: Each component is focused on a single responsibility
2. **Reusability**: Components like `LoadingSpinner` and `ErrorMessage` can be reused
3. **Maintainability**: Easier to find and modify specific functionality
4. **Testability**: Individual components can be tested in isolation
5. **Readability**: Code is more organized and easier to understand

## File Structure

```
src/
├── components/
│   ├── CategoryBrowser.tsx           # Main component (107 lines vs 506 lines)
│   └── category-browser/
│       ├── index.ts                  # Exports all components
│       ├── CategoryGrid.tsx          # Category display logic
│       ├── CertificationCard.tsx     # Individual cert card
│       ├── ErrorMessage.tsx          # Error handling UI
│       ├── LoadingSpinner.tsx        # Loading state UI
│       ├── NoResults.tsx            # Empty search state
│       ├── SearchResults.tsx        # Search results container
│       ├── SearchResultsHeader.tsx  # Search header
│       ├── SearchSection.tsx        # Search functionality
│       └── TeacherCard.tsx          # Individual teacher card
└── types/
    └── category-browser.ts          # Shared types
```

## Usage

The main `CategoryBrowser` component can be used the same way as before:

```tsx
<CategoryBrowser showSearch={true} />
```

Individual components can also be imported and used separately if needed:

```tsx
import { LoadingSpinner, ErrorMessage } from '@/components/category-browser';
```