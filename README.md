# Game Support Portal (Hỗ trợ game)

Ứng dụng: Website Hỗ trợ người chơi khi gặp lỗi trong game — ghi nhận lỗi, hướng dẫn khắc phục, và quản lý báo cáo từ người dùng.

## Mục tiêu

- Cung cấp nền tảng để người chơi báo lỗi (bug, crash, performance, connect), tìm hướng giải quyết và nhận hỗ trợ.
- Cho phép hệ thống tự tạo danh sách game và lỗi (không có dữ liệu ban đầu) — admin/dev có thể thêm, dữ liệu có thể đến từ người dùng hoặc batch job.
- Ghi lại interactions (xem hướng dẫn, vote hữu ích, comment) làm dữ liệu cho cải tiến sau này.

## Stack chính

- Backend: NestJS + TypeORM (TypeScript)
- Database: PostgreSQL
- Cache: Redis (caching, rate-limiting)
- Frontend: React (khuyến nghị)
- Container: Docker + docker-compose

## Yêu cầu môi trường (local)

- Node.js >= 16
- npm hoặc yarn
- Docker & docker-compose (khuyên dùng)

## File `.env` mẫu (tạo ở root)

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=nestjs_app
JWT_SECRET=your_jwt_secret
PORT=3000

> Lưu ý: `synchronize: true` hiện bật cho phát triển — tắt trước khi đưa lên production.

## Chạy project (local, không dùng Docker)

1. Cài dependencies
   npm install

2. Tạo database PostgreSQL theo `.env` hoặc chỉnh file `.env`

3. Chạy app
   npm run start:dev

## Chạy với Docker

1. Build & up
   docker-compose up --build

2. Dừng
   docker-compose down

## API cơ bản (gợi ý)

- Auth
  - POST `/auth/login` — login trả JWT
  - POST `/auth/register` — đăng ký user

- Games
  - GET `/games` — danh sách game
  - POST `/games` — tạo game (hệ thống hoặc admin)
  - GET `/games/:id` — chi tiết game (including common errors)

- Errors / Issues
  - GET `/issues?gameId=...&status=...` — danh sách lỗi theo game/ trạng thái
  - POST `/issues` — báo lỗi mới (user)
  - GET `/issues/:id` — xem chi tiết lỗi, hướng dẫn, comments
  - PATCH `/issues/:id` — cập nhật trạng thái (admin/moderator)

- Reports & Support
  - POST `/reports` — người dùng gửi report, attach logs
  - GET `/reports` — admin xem report

- Interactions (dùng cho analytics/recommender)
  - POST `/interactions` — ghi activity (view, vote, comment)

## Dữ liệu & lưu ý thiết kế

- Bảng `games` không cần dữ liệu ban đầu — cho phép tạo dynamic từ user hoặc batch import.
- Bảng `issues` (userId, gameId, title, description, type, severity, status, createdAt, attachments).
- `interactions` (userId, issueId, eventType, timestamp, details) để phân tích.
- Cần cơ chế chống spam (rate limit), xác thực file upload, và mô-đun moderation.

## Ghi chú vận hành

- Sử dụng Redis để cache trang phổ biến và hạn chế truy vấn.
- Tắt `synchronize` khi deploy production; dùng migrations.
- Backup DB định kỳ, lưu artifacts (logs) an toàn.

## Tests

- E2E tests: `test/app.e2e-spec.ts` (Jest + Supertest)
- Chạy: `npm run test:e2e`

## Cách đóng góp

- Fork → branch feature/x → PR → merge vào `develop`.
- Viết unit/e2e tests cho feature mới.

## ERD sơ bộ

Sơ đồ ERD dạng ASCII (mô tả các bảng chính và quan hệ):

```
Users            Games
------           -------
id PK            id PK
...              ...
  \               /
   \             /
    \           /
     Issues (N)      Tags
     ---------        ----
     id PK            id PK
     userId FK ---->  name
     gameId FK ---->  
     title
     status
     severity
     createdAt
       |
       | 1..N
       v
    Comments
    --------
    id PK
    issueId FK
    userId FK
    content
    createdAt

Issues 1..N <---> N..1 Attachments (polymorphic to issue/report)

Interactions
------------
id PK
userId FK
issueId FK (nullable)
eventType (view|vote|comment|follow)
metadata (json)
createdAt
```

Quan hệ tóm tắt:
- Users 1 — N Issues (một user tạo nhiều issue)
- Games 1 — N Issues (một game có nhiều issue)
- Issues 1 — N Comments
- Issues 1 — N Attachments (hoặc attachments polymorphic để dùng chung cho reports)
- Issues N — N Tags (thông qua issue_tags)
- Users 1 — N Interactions (ghi nhận các hành vi trên Issue/Guide)

## Mô tả entity (ngắn gọn)

- users (hiện đã có sẵn)
  - Các trường gợi ý: id (PK, uuid), email (unique), passwordHash, role (user|moderator|admin), displayName, avatarUrl, isVerified, createdAt, lastSeen
  - Ghi chú: giữ password hashed; thêm các trường profile nếu cần.

- games
  - id (PK, uuid)
  - name (string), slug (unique), developer, platforms (array hoặc json), description (text), releaseDate, metadata (json), createdAt, updatedAt
  - Ghi chú: game có thể được tạo bởi admin hoặc tự động khi user báo lỗi một game chưa có.

- issues
  - id (PK, uuid)
  - userId (FK -> users.id)
  - gameId (FK -> games.id)
  - title, description (text), stepsToReproduce (text), expectedBehavior, actualBehavior
  - type (enum: bug|crash|performance|connect|other)
  - severity (enum: low|medium|high|critical)
  - status (enum: open|in_progress|resolved|closed|duplicate)
  - attachmentsCount, commentsCount, votesUp, votesDown
  - resolvedBy (FK -> users.id nullable), resolvedAt
  - createdAt, updatedAt
  - Ghi chú: index lên (gameId, status, createdAt) và full-text index cho title+description.

- comments
  - id (PK), issueId (FK), userId (FK), content (text), createdAt, editedAt, isHidden
  - Ghi chú: hỗ trợ moderator hide/edit.

- attachments
  - id (PK), issueId (FK nullable), reportId (FK nullable), filename, url, contentType, size, uploadedBy (FK users), createdAt
  - Ghi chú: lưu metadata; xác thực type và giới hạn kích thước khi upload.

- tags
  - id (PK), name, slug

- issue_tags (join table)
  - issueId (FK), tagId (FK)

- interactions
  - id (PK), userId (FK nullable for anonymous), issueId (FK nullable), eventType (view|vote_up|vote_down|bookmark|share|comment), details (json), createdAt
  - Ghi chú: dùng cho analytic, recommender, rate limit, và đo hữu ích của guide.

- reports
  - id (PK), reporterId (FK users), issueId (FK nullable), type (abuse|spam|other), description, attachments (relationship), status, createdAt
  - Ghi chú: admin dashboard để xử lý report.

- moderation_logs
  - id, moderatorId (FK users), targetType (issue|comment|user), targetId, action (hide|ban|edit|note), reason, createdAt

## Gợi ý enum & index
- issue.type: ['bug','crash','performance','connect','other']
- issue.severity: ['low','medium','high','critical']
- issue.status: ['open','in_progress','resolved','closed','duplicate']
- Indexes: (games.slug), (issues.gameId, issues.status), full-text index trên (issues.title, issues.description), (interactions.userId, createdAt) cho analytic.

## Ghi chú khi triển khai với TypeORM
- Dùng UUID cho các id bằng "uuid"/"uuid_generate_v4()" (Postgres). Tạo migration cho production.
- Với attachments, lưu file lên S3/MinIO và chỉ lưu URL + metadata trong DB.
- Tách bảng audit/moderation để tránh làm bloated bảng chính.
- Quy tắc soft-delete cho issues/comments (thêm `isDeleted` hoặc `deletedAt`) nếu cần preserve lịch sử.

---

Cập nhật README nếu muốn biểu diễn ERD dưới dạng hình ảnh (SVG/PNG) hoặc thêm SQL schema/migrations mẫu. Nếu muốn, tôi có thể tạo các entity TypeORM skeletons (entities + DTOs) tiếp theo.
