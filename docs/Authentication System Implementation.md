# Pull Request: Complete Authentication System Implementation  

## Overview  
This pull request implements a full authentication system, providing secure and robust user management features. The authentication flow includes user login, registration, password reset, profile picture management, and account deletion, along with route protection for authorization.  

## Features Implemented  

### 1. **Login**  
- Users can authenticate using their credentials.  
- Proper error handling for incorrect credentials.  
- Secure token-based authentication.  

### 2. **Registration**  
- New users can register with required details.  
- Email validation and error handling implemented.  

### 3. **Reset Password**  
- Users can request a password reset.  
- Secure token-based password reset mechanism.  

### 4. **Profile Picture Management**  
- Users can upload/update their profile pictures.  
- Images stored securely with proper validation.  

### 5. **Soft Delete**  
- Users can deactivate their accounts without permanent data loss.  
- Data remains stored but flagged as inactive.  

### 6. **Permanent Delete**  
- Users can permanently delete their accounts.  
- All associated data is removed from the system.  

### 7. **Authorization (Route Protection)**  
- Implemented role-based access control (RBAC).  
- Restricted access to specific routes based on user roles.  

## Testing  
The following tests were conducted to ensure the system functions as expected:  
✔ **User authentication flow** – Login, registration, and password reset.  
✔ **Account management** – Soft delete and permanent delete processes.  
✔ **Profile picture handling** – Upload, update, and validation.  
✔ **Route protection** – Ensured restricted areas are accessible only to authorized users.  

## Dependencies  
- Ensure the authentication service is running.  
- Requires environment variables for API endpoints and security configurations.  

## Related Issues  
- Closes #ISSUE_NUMBER (if applicable).  

## Notes  
- Future improvements may include Multi-Factor Authentication (MFA) and session expiration handling.  
