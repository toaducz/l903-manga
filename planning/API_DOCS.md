# Tài Liệu Tích Hợp API (Dành cho Frontend)

**Base URL (Local)**: `https://l903-movie-backend.vercel.app`  

---

## 1. API Đăng Nhập (Login)

Sử dụng để xác thực người dùng và lấy bộ Token (Access & Refresh). API này được bảo vệ nghiêm ngặt bởi 2 lớp: **API Key** và **Rate Limit (Chống Spam)**.

- **Endpoint**: `/auth/login`
- **Method**: `POST`
- **Headers Yêu Cầu**:
  - `Content-Type`: `application/json`
  - `x-api-key`: *(Bắt buộc)* Chuỗi định danh tĩnh lấy từ biến môi trường `SCERET_KEY` của Backend.

### Body (JSON)
```json
{
  "username": "your_username",
  "password": "your_password" // Bắt buộc, tối thiểu 6 ký tự
}
```

### Các Trạng Thái Trả Về (Responses)

🟢 **200 OK - Đăng nhập thành công**
```json
{
  "status": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

🔴 **401 Unauthorized - Sai thông tin hoặc thiếu API Key**
```json
{
  "success": false,
  "statusCode": 401,
  "path": "/auth/login",
  "message": "UNAUTHORIZED hoặc Tài khoản/Mật khẩu không chính xác",
}
```

🔴 **429 Too Many Requests - Bị chặn do Spam (Rate Limit)**
*(Quy tắc: Tối đa 10 lần gọi / 1 phút. Cố tình gọi thêm khi đang bị chặn sẽ tự động cộng dồn thêm 15 giây phạt).*
```json
{
  "success": false,
  "statusCode": 429,
  "path": "/auth/login",
  "message": "Bạn đã gọi quá giới hạn. Vui lòng thử lại sau 75 giây.",
  "remainingTime": 75 
}
```
*Frontend lưu ý: Có thể bắt field `remainingTime` để hiển thị đồng hồ đếm ngược (countdown) cho UI mượt mà hơn.*

---

## 2. API Cấp Lại Token (Refresh)

Khi `accessToken` bị hết hạn (hết hiệu lực sau 15 phút), Frontend sử dụng `refreshToken` (có thời hạn 7 ngày) để lấy lại `accessToken` mới mà không bắt user phải đăng nhập lại.

- **Endpoint**: `/auth/refresh`
- **Method**: `POST`
- **Headers Yêu Cầu**:
  - `Content-Type`: `application/json`
  *(API này hiện tại không yêu cầu `x-api-key` để tối ưu luồng chạy ngầm của FE)*

### Body (JSON)
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // Truyền vào refreshToken lấy từ lúc Login
}
```

### Các Trạng Thái Trả Về (Responses)

🟢 **200 OK - Cấp mới thành công**
```json
{
  "status": true,
  "accessToken": "eyJ_NEW_ACCESS_TOKEN..."
}
```

🔴 **401 Unauthorized - Refresh Token hết hạn hoặc không hợp lệ**
```json
{
  "success": false,
  "statusCode": 401,
  "path": "/auth/refresh",
  "message": "Token không hợp lệ hoặc đã hết hạn"
}
```
*Frontend lưu ý: Nếu nhận được lỗi 401 tại API này, bắt buộc phải ép user đăng xuất (Clear localStorage/cookies) và đẩy về trang `/login`.*
