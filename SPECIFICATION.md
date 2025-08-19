SPECIFICATION — Hệ thống quản lý nhà hàng + Recommender (đồ án)

1. Tiêu đề
   Hệ thống quản lý nhà hàng (Menu / POS / Inventory / Dashboard) kèm mô-đun recommend đơn giản cho món ăn.

2. Tóm tắt (1 câu)
   Xây ứng dụng web RESTful để quản lý hoạt động cơ bản của nhà hàng và phục vụ gợi ý sản phẩm dựa trên popularity + co-occurrence để minh hoạ phần personalization trong đồ án.

3. Mục tiêu cụ thể (SMART)

- Cung cấp CRUD quản lý menu, categories, inventory và quản lý đơn hàng (POS).
- Hỗ trợ đăng nhập/ phân quyền (admin, staff, customer).
- Ghi lại interaction (view, add-to-cart, order) để dùng cho recommender.
- Triển khai recommender baseline: popularity + item-item co-occurrence; serve qua API.
- Có demo frontend cơ bản và báo cáo offline đánh giá (Precision@10, HitRate@10).

4. Phạm vi

- In-scope: backend (NestJS + TypeORM), Postgres, Redis cache, batch job tính recommend, frontend demo (React), Dockerized stack, báo cáo kết quả offline.
- Out-of-scope: realtime deep-learning models, ANN scale lớn (Faiss), production hardening (backup, monitoring chuyên sâu).

5. Yêu cầu chức năng chính

- Auth & Users: register, login (JWT), role-based access.
- Menu: create/read/update/delete menu items & categories.
- Orders (POS): tạo order, danh sách order, cập nhật trạng thái, tính total, cập nhật inventory khi hoàn thành.
- Inventory: xem và điều chỉnh tồn kho.
- Interactions: ghi sự kiện user (view, add-to-cart, order) vào bảng `interactions`.
- Recommendations API:
  - GET /recommendations/:userId?limit=10 — trả top-K gợi ý per user (hybrid).
  - GET /recommendations/item/:itemId — trả items liên quan.
- Admin dashboard: doanh thu theo ngày, top bán chạy.

6. Yêu cầu phi chức năng

- Hiệu năng: trả lời API recommend < 200ms trên môi trường dev với cache (Redis).
- Độ tin cậy: lỗi xử lý rõ ràng; input validation cho các API.
- Bảo mật: JWT, password hashed (bcrypt), không lưu mật khẩu plaintext.
- Portability: chạy được bằng docker-compose.

7. Success metrics (đánh giá đồ án)

- Kĩ thuật: có repo chạy end-to-end bằng docker-compose với seed data.
- Functionality: CRUD menu + order flow hoạt động; recommendations hiển thị khi có lịch sử mua/không có lịch sử (cold-start fallback).
- ML/Analytics: có script offline tính Precision@10 và report so sánh popularity vs item-item vs hybrid.
- Deliverables: code, Docker setup, report (PDF), slide (10–15 slide) + demo.

8. Kiến trúc tổng quan (stack)

- Backend: NestJS (TypeScript) + TypeORM
- DB: PostgreSQL
- Cache: Redis (recommendations cache)
- Frontend: React (demo)
- Batch: cron job (Node hoặc Python) để build popularity & co-occurrence
- Deployment: docker-compose cho local demo

9. Timeline (milestone ngắn)

- M1 (Weeks 1–4): thiết kế DB, implement CRUD menu, users, auth, order flow.
- M2 (Weeks 5–7): interactions logging, inventory, admin dashboard.
- M3 (Weeks 6–9): batch recommender (popularity, co-occurrence), API serve, cache.
- M4 (Weeks 10–12): offline eval, tests, dockerize, report & slides, rehearsal.

10. Owner / Contact

- Student: (tên sinh viên) — cập nhật thông tin ở báo cáo nộp.

---

Tài liệu này là bản tóm tắt để nộp kèm mã nguồn. Chi tiết triển khai (ERD, API spec, migration, nội dung bảng) được lưu trong repo dưới `docs/` hoặc README nếu cần.
