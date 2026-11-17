# Aurora CS Course Scheduler

**Milestone 2 — Version 2.0.0**  
**Authors:** Katherine Maya and Karen Segura

The app displays the CS Developer Track catalog, shows which courses are available based on prerequisites, and saves completed courses to MySQL.

## How to run

You’ll need Node.js, npm, and access to a MySQL database.

### 1. Configure the environment

Create a `.env` file in the project root, next to `package.json`, with:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Copy `server/.env.example` to `server/.env`. Fill in `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` with your MySQL database settings. For local development, keep `PORT=3000` and `CLIENT_ORIGIN=http://localhost:5173`.

Keep real database credentials only in `server/.env`. Do not commit that file.

### 2. Initialize the MySQL database

1. In MySQL Workbench or phpMyAdmin, connect to MySQL and select the database specified by `DB_NAME` in `server/.env`.
2. Run `server/sql/schema.sql` to create the project tables.
3. Run `server/sql/seed.sql` to load the initial courses, prerequisites, test user, and sample completions.

Run `schema.sql` before `seed.sql`. The schema script drops and recreates the project tables, so use a separate empty database when testing the setup from scratch.

### 3. Start Express (terminal 1)

From the project root, run:

```powershell
cd server
npm install
npm run dev
```

The API runs at [http://localhost:3000](http://localhost:3000). Keep this terminal open.

### 4. Start React (terminal 2)

Open a second terminal in the project root and run:

```powershell
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Verify that progress saves

Mark an available course as completed, click **Save**, and refresh the page. The course should still be marked. You can also check the saved course IDs at [http://localhost:3000/api/completions](http://localhost:3000/api/completions).