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

Copy `server/.env.example` to `server/.env`. Set `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` to match your MySQL setup. For local development, keep `PORT=3000` and `CLIENT_ORIGIN=http://localhost:5173`.

Keep real database credentials only in `server/.env`. Do not commit that file.

### 2. Initialize the MySQL database

The database named in `DB_NAME` must already exist. If you’re setting up MySQL locally, create an empty database and set `DB_NAME` to its name. The scripts create the tables inside that database.

**`schema.sql` drops and recreates the project tables. Use a separate empty database when testing from scratch so you don’t overwrite existing data.**

Run these scripts in order:

1. `server/sql/schema.sql` creates the project tables.
2. `server/sql/seed.sql` loads the initial courses, prerequisites, test user, and sample completions.

Choose one of these methods:

**MySQL Workbench**

1. Connect to MySQL and select the database named in `DB_NAME` as the default schema.
2. Open `server/sql/schema.sql` in a SQL tab and run the full script.
3. Open `server/sql/seed.sql` in another SQL tab, make sure the same database is selected, and run the full script.

**phpMyAdmin**

1. Sign in and select the database named in `DB_NAME` from the sidebar.
2. Open the **Import** tab, choose `server/sql/schema.sql`, and click **Import** (or **Go**).
3. Repeat with `server/sql/seed.sql` after the first import succeeds.

**WebStorm**

1. Open the **Database** tool window and choose **+ → Data Source → MySQL**.
2. Enter the host, port (usually `3306`), user, password, and database from your MySQL setup. Test the connection.
3. Run `server/sql/schema.sql` against the database named in `DB_NAME`, then run `server/sql/seed.sql` against the same database.

After a fresh setup, the database should contain 10 courses, 10 prerequisite relationships, 1 user, and 2 sample completions.

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

Mark an available course as completed, click **Save**, and refresh the page. The course should still be marked as completed. You can also check the saved course IDs at [http://localhost:3000/api/completions](http://localhost:3000/api/completions).