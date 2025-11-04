# TypeScript Path Aliases Guide

This project uses TypeScript path aliases to simplify imports and improve code readability.

## Available Aliases

| Alias | Path | Usage |
|-------|------|-------|
| `@components` | `src/components` | Import React components |
| `@hooks` | `src/hooks` | Import custom React hooks |
| `@data` | `src/data` | Import data files (JSON, context) |
| `@utils` | `src/utils` | Import utility functions |
| `@types` | `src/types` | Import TypeScript types/interfaces |
| `@constants` | `src/constants` | Import constants and config |
| `@pages` | `src/pages` | Import page components |

## Usage Examples

### Before Path Aliases
```typescript
import { About } from '../../components/About';
import { SOCIAL_LINKS } from '../../../constants';
import { useContactForm } from '../../hooks/useContactForm';
```

### After Path Aliases
```typescript
import { About } from '@components/About';
import { SOCIAL_LINKS } from '@constants';
import { useContactForm } from '@hooks/useContactForm';
```

## Component Barrel Export

Components can also be imported from the barrel export at `@components`:

```typescript
// Import multiple components at once
import { About, Experience, Projects, Navbar } from '@components';

// Import shared components
import { Button, Alert, SocialLinks } from '@components';

// Import sub-components if needed
import { TripCard, ChatWindow } from '@components';
```

## Configuration

Path aliases are configured in two files:

1. **tsconfig.json** - For TypeScript compilation
2. **vite.config.ts** - For Vite bundling

Both files must have matching alias configurations for proper functionality.

## Benefits

✅ **Cleaner imports** - No more `../../../` paths
✅ **Better refactoring** - Easier to move files around
✅ **Improved readability** - Clear where imports come from
✅ **IDE support** - Better autocomplete and jump-to-definition
✅ **Consistent patterns** - Standardized import style across the project

## Migration Guide

To migrate existing imports to use path aliases:

1. **Find all imports** from a specific folder:
   ```bash
   grep -r "from '../" src/
   ```

2. **Replace with alias**:
   - `../components/Foo` → `@components/Foo`
   - `../../hooks/useFoo` → `@hooks/useFoo`
   - `../../../constants` → `@constants`

3. **Test the build**:
   ```bash
   npm run build
   ```

## Notes

- Path aliases work in both development and production builds
- VS Code will provide autocomplete for aliased paths
- You can mix relative and aliased imports, but prefer aliases for consistency
- The barrel export (`@components`) is optional but recommended for cleaner imports
