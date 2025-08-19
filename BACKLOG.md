BACKLOG — Hệ thống quản lý nhà hàng + Recommender

Format: [ID] Title (Type) — Priority — Est. hours

[EPIC-1] Project setup & infra (Epic) — High — 8h

- TASK-1.1: Init repo, README, .env.example, Dockerfiles — AC: repo with README and `.env.example`.
- TASK-1.2: Setup CI basic (optional) — AC: GitHub Actions build passes.

[EPIC-2] Auth & Users (Epic) — High — 16h

- STORY-2.1: Register & Login (JWT) — AC: user can register & login, JWT returned.
- TASK-2.2: User roles (admin/staff/customer) — AC: roles enforced on protected endpoints.

[EPIC-3] Menu management (Epic) — High — 24h

- STORY-3.1: CRUD menu items — AC: endpoints create/read/update/delete working + validation.
- TASK-3.2: Categories CRUD — AC: categories manageable.
- TASK-3.3: Seed sample menu data — AC: seed script or SQL file.

[EPIC-4] Orders & POS (Epic) — High — 40h

- STORY-4.1: Create order flow (cart → checkout) — AC: can create order with orderItems and compute total.
- TASK-4.2: Order status lifecycle (created, preparing, completed, cancelled) — AC: update status endpoint.
- TASK-4.3: Inventory decrement on completed order — AC: inventory updates correctly; error if insufficient stock.

[EPIC-5] Interactions & Logging (Epic) — High — 8h

- TASK-5.1: Create `interactions` table & log events (view/add/order) — AC: events stored with timestamp.
- TASK-5.2: Export interactions sample for offline eval — AC: csv export script.

[EPIC-6] Recommender baseline (Epic) — High — 32h

- STORY-6.1: Popularity scorer (7d/30d windows) — AC: API returns top-N popular items.
- STORY-6.2: Co-occurrence (item-item) batch job — AC: job computes similarity and stores top-K related items.
- TASK-6.3: Hybrid endpoint combine popularity + item-item — AC: /recommendations/:userId works.

[EPIC-7] Content-based & cold-start (Epic) — Medium — 24h

- TASK-7.1: Build item feature vectors (one-hot category, tags, TF-IDF description) — AC: vector store.
- TASK-7.2: Cold-start policy (fallback to popularity or content-similarity) — AC: new user gets reasonable suggestions.

[EPIC-8] Cache & Performance (Epic) — Medium — 8h

- TASK-8.1: Redis cache per-user recommendations + invalidation on new order — AC: cache hits reduce response time.

[EPIC-9] Frontend demo (Epic) — Medium — 24h

- TASK-9.1: Menu page + cart + checkout — AC: user can order in UI
- TASK-9.2: Show recommendations widget on menu/product page — AC: widget displays recommended items.

[EPIC-10] Offline evaluation & report (Epic) — Medium — 16h

- TASK-10.1: Split dataset (train/test) by time — AC: scripts create train/test csv
- TASK-10.2: Compute Precision@K, HitRate@K for algorithms — AC: report comparing methods

[EPIC-11] Tests, Dockerize & Deployment (Epic) — Medium — 16h

- TASK-11.1: E2E tests (Jest + Supertest) for key flows — AC: tests pass locally
- TASK-11.2: docker-compose for Postgres + Redis + app + frontend — AC: demo runs with `docker-compose up`

[EPIC-12] Final report & slides (Epic) — High — 16h

- TASK-12.1: Write final report (problem, design, results, limitations) — AC: PDF report
- TASK-12.2: Prepare slide deck (10–15 slides) — AC: slides ready for presentation

Notes:

- Prioritize EPIC-2 → EPIC-3 → EPIC-4 → EPIC-5 → EPIC-6 for MVP.
- Convert each backlog item to GitHub Issue and assign labels: `priority:high|medium|low`, `type:epic|task|story`.
