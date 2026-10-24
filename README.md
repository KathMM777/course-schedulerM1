# Aurora CS Course Scheduler

## How to run
1. Open the terminal in the project's root folder 
2. Install all the dependencies with `npm install` 
3. Create `.env` in the project root with the following line: `VITE_API_BASE_URL=http://localhost:3333`
4. In one terminal, start JSON Server with: `npx json-server --watch db/db.json --port 3333`
5. In a second terminal, start the app with: `npm run dev`
6. Finally, open http://localhost:5173 in your browser