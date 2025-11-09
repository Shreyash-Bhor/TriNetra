# 🧩 Authentication Routes Testing Guide

This section explains the step-by-step process used to test all authentication routes using **Postman**.

---

## 🧠 Setup Before Testing

- Backend server running at: `http://localhost:5000`
- `cookie-parser` and CORS with `{ credentials: true }` are enabled
- MongoDB is connected and running
- Postman setting: **Send cookies automatically = ON**

---

## ✅ Step 1 — Signup (Register User)

**Method:** `POST`
**URL:** `http://localhost:5000/api/auth/signup`

**Body (JSON):**

```json
{
  "username": "shreyash123",
  "email": "shreyash@example.com",
  "password": "StrongPass@123",
  "firstName": "Shreyash",
  "lastName": "Bhor",
  "phone": "9876543210"
}
```

**Expected Response:** `201 Created`

```json
{
  "message": "User registered successfully",
  "accessToken": "<JWT>",
  "user": {
    "id": "...",
    "email": "shreyash@example.com",
    "username": "shreyash123",
    "role": "user"
  }
}
```

✅ Check: `refresh_token` cookie set in Postman → Cookies tab

---

## ✅ Step 2 — Login (Authenticate Existing User)

**Method:** `POST`
**URL:** `http://localhost:5000/api/auth/login`

**Body (JSON):**

```json
{
  "email": "shreyash@example.com",
  "password": "StrongPass@123"
}
```

**Expected Response:** `200 OK`

```json
{
  "message": "Login successful",
  "accessToken": "<JWT>",
  "user": {
    "id": "...",
    "email": "shreyash@example.com",
    "role": "user"
  }
}
```

✅ Check: `refresh_token` cookie updated in Postman

---

## ✅ Step 3 — Refresh Token (Rotate Tokens)

**Method:** `POST`
**URL:** `http://localhost:5000/api/auth/refresh`

**Body:** _none_

**Expected Response:** `200 OK`

```json
{
  "accessToken": "<NEW_ACCESS_TOKEN>"
}
```

✅ Check: `refresh_token` cookie rotated (new cookie replaces old one)

---

## ✅ Step 4 — Logout (Revoke Session)

**Method:** `POST`
**URL:** `http://localhost:5000/api/auth/logout`

**Expected Response:** `200 OK`

```json
{
  "message": "Logged out successfully"
}
```

✅ Cookie cleared → `refresh_token` removed from Postman cookies
✅ DB → RefreshToken document now has `revokedAt`

---

## 🧩 Summary Table

| Step | Endpoint            | Purpose             | Expected                                 |
| ---- | ------------------- | ------------------- | ---------------------------------------- |
| 1    | `/api/auth/signup`  | Register new user   | Access & Refresh tokens issued           |
| 2    | `/api/auth/login`   | Login existing user | Tokens reissued                          |
| 3    | `/api/auth/refresh` | Renew session       | New access token & rotated refresh token |
| 4    | `/api/auth/logout`  | End session         | Cookie cleared & token revoked           |

---

## 🧠 Postman Testing Setup

1. Install the **Postman Desktop Agent** to enable cookie-based testing.

   - Download link: [Postman Desktop Agent](https://www.postman.com/downloads/postman-agent/)

2. Open **Postman Web or Desktop App** → select your base URL (e.g., `http://localhost:5000`)
3. Test endpoints step-by-step as described above.
4. Verify cookies and responses in **Cookies Tab** and **Console Logs**.

---

✅ **Testing complete:** All routes verified via Postman with proper token issuance, rotation, and revocation.
