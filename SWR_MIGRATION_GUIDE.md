# SWR Migration Guide

This guide shows how to migrate from useEffect-based API calls to SWR for better data fetching, caching, and synchronization.

## 1. Installation and Setup

SWR has been installed with:
```bash
yarn add swr
```

### SWR Configuration (`src/lib/swr-config.ts`)

The configuration includes:
- Default fetcher with authentication
- Error handling with status codes
- Optimized settings for revalidation

### Custom Hooks (`src/hooks/useApi.ts`)

Pre-built hooks for common API patterns:
- `useCategories()` - Fetch categories
- `useUserProgress()` - Fetch user progress
- `useTeachers(status, isAvailable, limit)` - Fetch teachers with filters
- `useRoles(page, itemsPerPage, search)` - Fetch roles with pagination
- Mutation hooks for CRUD operations

## 2. Migration Patterns

### Before: useEffect + useState Pattern
```tsx
// OLD WAY - Manual state management
function ComponentOld() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/data')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  
  return <DataDisplay data={data} />
}
```

### After: SWR Pattern
```tsx
// NEW WAY - SWR handles everything
function ComponentNew() {
  const { data = [], isLoading, error } = useCustomHook()

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error.message} />
  
  return <DataDisplay data={data} />
}
```

## 3. Key Benefits

### Automatic Features
- **Caching**: Data is cached and shared across components
- **Revalidation**: Auto-refresh on window focus/reconnect
- **Deduplication**: Multiple calls to same endpoint are deduplicated
- **Background Updates**: Fresh data without blocking UI
- **Error Recovery**: Automatic retries with exponential backoff

### Performance Improvements
- **Reduced Re-renders**: SWR optimizes when components update
- **Memory Efficiency**: Built-in garbage collection for unused data
- **Network Optimization**: Smart request batching and timing

## 4. Migration Examples

### Example 1: CategoryBrowser

**Before:**
```tsx
const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  fetchCategories();
}, []);

const fetchCategories = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.categories);
    const data = await response.json();
    setCategoryGroups(data.groups);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

**After:**
```tsx
const { data: categoriesData, error: categoriesError, isLoading } = useCategories()
const categoryGroups = (categoriesData as CategoriesResponse)?.groups || []
const error = categoriesError?.message || null
```

### Example 2: Progress Dashboard

**Before:**
```tsx
const [progress, setProgress] = useState<UserProgress[]>([])
const [isLoading, setIsLoading] = useState(true)

const fetchProgress = useCallback(async () => {
  try {
    const response = await fetch(API_ENDPOINTS.progress, {
      headers: getAuthHeaders()
    })
    const data = await response.json()
    setProgress(data)
  } catch (error) {
    console.error('Failed to fetch progress:', error)
  } finally {
    setIsLoading(false)
  }
}, [getAuthHeaders])

useEffect(() => {
  if (session?.user?.id) {
    fetchProgress()
  }
}, [session?.user?.id, fetchProgress])
```

**After:**
```tsx
const { data: progress = [], isLoading } = useUserProgress()
```

### Example 3: Teacher List

**Before:**
```tsx
const [teachers, setTeachers] = useState<Teacher[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchTeachers = async () => {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.base}/api/teachers/?status=approved&is_available=true&limit=6`
      );
      const data = await response.json();
      setTeachers(data);
    } catch (err) {
      console.error("Error fetching teachers:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchTeachers();
}, []);
```

**After:**
```tsx
const { data: teachersData = [], isLoading } = useTeachers("approved", true, 6);
const teachers = teachersData as Teacher[];
```

### Example 4: CRUD Operations with Mutations

**Before:**
```tsx
const handleCreate = async () => {
  try {
    await UsersService.createRole(formData);
    fetchRoles(currentPage, searchTerm); // Manual refetch
  } catch (err) {
    setError(err.message);
  }
};
```

**After:**
```tsx
const { trigger: createRole } = useCreateRole();
const { mutate: mutateRoles } = useRoles(currentPage, itemsPerPage, searchTerm);

const handleCreate = async () => {
  try {
    await createRole(formData);
    mutateRoles(); // SWR handles the refetch
  } catch (err) {
    console.error('Failed to create role:', err);
  }
};
```

## 5. Advanced Patterns

### Conditional Fetching
```tsx
// Only fetch when user is authenticated
const { data } = useAuthenticatedSWR(
  isAuthenticated ? '/api/user/data' : null
)

// Fetch with dynamic parameters
const { data } = useSWR(
  slug ? `/api/certifications/${slug}` : null
)
```

### Global Mutations
```tsx
import { mutate } from 'swr'

// Update all related caches
await mutate(key => typeof key === 'string' && key.startsWith('/api/users'))
```

### Optimistic Updates
```tsx
const { mutate } = useSWR('/api/users')

const addUser = async (newUser) => {
  // Optimistically update the UI
  mutate([...users, newUser], false)
  
  // Send request to server
  try {
    await api.createUser(newUser)
    // Revalidate to get fresh data
    mutate()
  } catch (error) {
    // Revert on error
    mutate(users)
  }
}
```

## 6. Migration Checklist

- [ ] Install SWR: `yarn add swr`
- [ ] Set up SWR configuration (`src/lib/swr-config.ts`)
- [ ] Create custom hooks (`src/hooks/useApi.ts`)
- [ ] Add SWRProvider to your app root
- [ ] Replace useEffect + useState patterns with SWR hooks
- [ ] Update error handling to use SWR error objects
- [ ] Replace manual refetching with SWR mutation hooks
- [ ] Remove unnecessary loading states and useCallback dependencies
- [ ] Test that data fetching still works as expected
- [ ] Verify that authentication headers are properly included

## 7. Common Gotchas

1. **Key Consistency**: Make sure SWR keys match your API endpoints exactly
2. **Type Safety**: Cast SWR data to proper TypeScript types
3. **Error Handling**: SWR errors have a different structure than manual try/catch
4. **Authentication**: Use conditional fetching for protected endpoints
5. **Cache Invalidation**: Use `mutate()` after mutations to keep data fresh

## 8. Benefits Gained

✅ **Reduced Code**: 50-70% less boilerplate code
✅ **Better UX**: Background updates and cached data
✅ **Performance**: Automatic request deduplication and optimization
✅ **Reliability**: Built-in error recovery and retry logic
✅ **Developer Experience**: Less state management, easier debugging
✅ **Real-time Feel**: Data stays fresh with minimal effort