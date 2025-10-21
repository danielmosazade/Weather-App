# TODO: Fix Frontend-Backend Connection

## Steps to Complete:
- [x] Create .env.example in client/ with REACT_APP_API_URL=http://localhost:5000
- [x] Edit client/src/pages/Login.tsx: Replace hardcoded URL with env-based, fix typo
- [x] Edit client/src/pages/AdminPage.tsx: Prefix axios calls with API_BASE_URL
- [x] Edit client/src/components/GetUsers.tsx: Prefix axios GET with API_BASE_URL
- [ ] User: Add REACT_APP_API_URL=https://mzgn-htb.onrender.com in Netlify site settings
- [ ] User: Redeploy frontend to Netlify
- [ ] User: Test login/admin features; check for CORS issues
- [ ] If CORS issues, update backend CORS to allow Netlify origin
