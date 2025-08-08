# Authentication System Separation

## Overview
The application has completely separate authentication systems for the main platform and microestate platform with no cross-contamination or conflicts.

## Main Platform Authentication

### Storage Keys Used:
- **SessionStorage**: `authToken`
- **LocalStorage**: `authToken` 
- **Cookies**: `authToken`

### Authentication Flow:
1. User logs in via main website navbar
2. Token stored as `authToken` in sessionStorage and cookies
3. Main website checks for `authToken` in sessionStorage/cookies
4. Logout clears `authToken` from all storage locations

### Files Using Main Auth:
- `app/components/navbar.tsx` - Main website navigation and auth
- `app/lib/api-helpers.ts` - API helper functions
- `app/api/auth/login/route.ts` - Returns token for main platform
- `app/api/auth/signup/route.ts` - Returns token for main platform
- Various pages: `app/admin/verification/page.tsx`, `app/compare/page.tsx`, etc.

## Microestate Platform Authentication

### Storage Keys Used:
- **LocalStorage**: `microestate_user` (user data)
- **LocalStorage**: `userRole` (user role)
- **Cookies**: `microauth` (JWT token)
- **SessionStorage**: Not used for microestate auth

### Authentication Flow:
1. User logs in via microestate platform
2. User data stored in `microestate_user` in localStorage
3. JWT token stored in `microauth` cookie (NOT `authToken`)
4. Microestate middleware validates `microauth` cookie
5. Logout clears `microestate_user`, `userRole`, and `microauth`

### Files Using Microestate Auth:
- `app/(microestate)/Context/AuthProvider.tsx` - Microestate auth context
- `app/(microestate)/middleware.ts` - Validates `microauth` cookie
- `app/(microestate)/_components/Navbar.tsx` - Microestate navigation
- `app/(microestate)/microestate/auth/` - Auth pages
- `app/(microestate)/microestate/api/auth/` - Auth API routes

## Key Benefits

### 1. Complete Isolation
- **Different cookie names**: Main uses `authToken`, Microestate uses `microauth`
- **Different localStorage keys**: Main uses `authToken`, Microestate uses `microestate_user`
- **Independent session management**: No shared authentication state

### 2. No Conflicts
- Main platform: `authToken` cookie and sessionStorage
- Microestate: `microauth` cookie and `microestate_user` localStorage
- Completely different storage mechanisms prevent any overlap

### 3. Platform-Specific Features
- Main platform: Standard JWT in sessionStorage/cookies
- Microestate: Role-based authentication with middleware protection

## Storage Comparison

| Platform | Cookie Name | SessionStorage | LocalStorage |
|----------|------------|----------------|--------------|
| Main     | `authToken` | `authToken`    | `authToken`  |
| Microestate | `microauth` | Not used    | `microestate_user`, `userRole` |

## Usage Examples

### Main Platform
```javascript
// Check if user is logged in to main platform
const mainToken = sessionStorage.getItem('authToken');
const isMainUserLoggedIn = !!mainToken;
```

### Microestate Platform
```javascript
// Check if user is logged in to microestate
const microestateUser = localStorage.getItem('microestate_user');
const isMicroestateUserLoggedIn = !!microestateUser;
```

## Testing
Both platforms can run simultaneously with independent authentication:
- User can be logged into main platform only
- User can be logged into microestate only  
- User can be logged into both platforms with different accounts
- Logging out of one platform doesn't affect the other

## Technical Implementation
- **Main Platform**: Uses traditional JWT stored in `authToken` cookie/sessionStorage
- **Microestate**: Uses `microauth` cookie for JWT and `microestate_user` localStorage for user data
- **Middleware Protection**: Only microestate routes are protected by microestate middleware
- **No Cross-Platform Access**: Each system only reads its own storage keys
