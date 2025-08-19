# Restaurant Management + Simple Recommender

Đồ án: Hệ thống quản lý nhà hàng (CRUD, POS, inventory, báo cáo) kèm mô-đun recommend đơn giản.

## Stack chính

- Backend: NestJS + TypeORM (TypeScript)
- Database: PostgreSQL
- Cache: Redis (recommend cache)
- Frontend: React (khuyến nghị) — frontend có thể phát triển song song
- Batch/ETL: Python (pandas) hoặc Node cron jobs
- Container: Docker + docker-compose

## Mục tiêu

- MVP quản lý menu, orders, inventory, users/roles, dashboard cơ bản.
- Ghi log interactions (view, add-to-cart, order) làm dữ liệu cho recommender.
- Recommender đơn giản: popularity + item-item co-occurrence + content-based hybrid.

## Cấu trúc repo quan trọng

- `src/app.module.ts` — cấu hình app (TypeORM, ConfigModule)
- `src/users/` — user entity, service, controller
- `src/auth/` — auth (JWT)
- `src` — modules: menu, orders, inventory, recommender (thêm khi phát triển)
- `docker-compose.yml`, `Dockerfile` — chạy stack

## Yêu cầu môi trường (local)

- Node.js >= 16
- npm hoặc yarn
- Docker & docker-compose (khuyên dùng để chạy toàn bộ stack)

## File `.env` mẫu (tạo ở root)

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=nestjs_app
JWT_SECRET=your_jwt_secret
PORT=3000

> Lưu ý: `synchronize: true` hiện bật cho phát triển — tắt trước khi production.

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
- Users
  - GET `/users` — danh sách users (admin)
- Menu
  - GET `/menu` — danh sách món
  - POST `/menu` — tạo món (admin)
- Orders
  - POST `/orders` — tạo order
  - GET `/orders/:id` — xem order
- Recommendations
  - GET `/recommendations/:userId?limit=10` — top-K gợi ý (popularity + item-item hybrid)
  - GET `/recommendations/item/:itemId` — gợi ý theo item

## Dữ liệu & recommender (ghi chú ngắn)

- Bảng `interactions` (userId, itemId, eventType, timestamp, value) là nguồn chính.
- Batch job tính:
  - popular items (window 7d/30d)
  - co-occurrence matrix → item-item similarity
  - content vectors (category/tags/TF-IDF) cho cold-start
- Lưu kết quả vào Redis hoặc table `item_similarities` để serve nhanh.

## Đánh giá offline

- Chia dataset theo thời gian (latest order per user → test).
- Metrics: Precision@K, Recall@K, HitRate@K.

## Roadmap tóm tắt (12 tuần)

1. Thiết kế DB & API
2. CRUD menu, orders, users, inventory
3. Ghi interactions
4. Implement recommender baseline (popularity + co-occurrence)
5. Cache & serve recommendations
6. Offline evaluation + report
7. Dockerize, tests, viết báo cáo + slide

## Tests

- E2E tests: `test/app.e2e-spec.ts` (Jest + Supertest)
- Chạy: `npm run test:e2e`

## Cách đóng góp

- Fork → branch feature/x → PR → merge vào `develop`.
- Viết unit/e2e tests cho feature mới.

## Tài liệu tham khảo

- "Recommender Systems: The Textbook" — Charu Aggarwal
- Papers: "Deep Neural Networks for YouTube Recommendations", SASRec, BERT4Rec
- Tools: Faiss, Redis, PostgreSQL, NestJS docs

## License

- MIT

---

Cập nhật README khi project tiến triển.
