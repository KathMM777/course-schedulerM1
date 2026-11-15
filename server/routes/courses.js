const express = require('express')
const router = express.Router()                       // a mini-app that handles /api/courses routes
const pool = require('../util/database')              // the shared connection pool
const { getCoursesWithPrereqs } = require('../util/courseData') // given helper
const validateCourse = require('../util/validateCourse')   // loads the shared validator that POST and PUT call

router.get('/', async (req, res) => {                 // '/' here means /api/courses (set in server.js)
    try {
        const courses = await getCoursesWithPrereqs(pool) // courses plus a prerequisites array for each
        res.json(courses)                                 // sends the array back as JSON (status 200)
    } catch (err) {
        res.status(500).json({ error: err.message })      // a database error returns 500 instead of crashing
    }
})

router.get('/:id', async (req, res) => {              // :id is a placeholder, e.g. /api/courses/7
    try {
        const course = await getCoursesWithPrereqs(pool, req.params.id) // given helper, with an id: one course or null
        if (!course) {
            return res.status(404).json({ error: 'Course not found' })    // no such course -> 404
        }
        res.json(course)                                  // otherwise 200 with the course
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.post('/', async (req, res) => {
    const error = validateCourse(req.body)              // check required fields first
    if (error) {
        return res.status(400).json({ error })            // missing field -> 400, stop here
    }

    const { number, title, credits, description, prerequisites = [] } = req.body // prerequisites defaults to []

    try {
        const [result] = await pool.query(                // 1. insert the course; ? placeholders keep it safe
            'INSERT INTO courses (number, title, credits, description) VALUES (?, ?, ?, ?)',
            [number, title, credits, description]
        )
        const newId = result.insertId                     // MySQL gives us the new course's id

        if (prerequisites.length > 0) {                   // 2. only insert prereq rows if there are any
            const rows = prerequisites.map(prereqId => [newId, prereqId]) // [5, 9] becomes [[11,5],[11,9]]
            await pool.query(
                'INSERT INTO prerequisites (course_id, prereq_id) VALUES ?',
                [rows]                                        // VALUES ? with a nested array only works with pool.query
            )
        }

        const created = await getCoursesWithPrereqs(pool, newId) // 3. fetch the course in the standard shape
        res.status(201).json(created)                     // 201 = created
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.put('/:id', async (req, res) => {
    const error = validateCourse(req.body)               // same shared validator as POST
    if (error) {
        return res.status(400).json({ error })             // missing field -> 400
    }

    const { number, title, credits, description, prerequisites = [] } = req.body
    const id = req.params.id                             // the :id from the URL

    try {
        const [result] = await pool.query(                 // 1. update the course's own fields
            'UPDATE courses SET number = ?, title = ?, credits = ?, description = ? WHERE id = ?',
            [number, title, credits, description, id]
        )
        if (result.affectedRows === 0) {                   // no row matched -> the course doesn't exist
            return res.status(404).json({ error: 'Course not found' }) // stop before touching prerequisites
        }

        await pool.query('DELETE FROM prerequisites WHERE course_id = ?', [id]) // 2. remove all old prereq rows

        if (prerequisites.length > 0) {                    // 3. insert the full new list
            const rows = prerequisites.map(prereqId => [id, prereqId])
            await pool.query('INSERT INTO prerequisites (course_id, prereq_id) VALUES ?', [rows])
        }

        const updated = await getCoursesWithPrereqs(pool, id) // 4. send back the course in the standard shape
        res.json(updated)                                  // 200
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const course = await getCoursesWithPrereqs(pool, req.params.id) // fetch it first so we can return it
        if (!course) {
            return res.status(404).json({ error: 'Course not found' })
        }

        await pool.query('DELETE FROM courses WHERE id = ?', [req.params.id]) // cascade removes its prereq and completion rows
        res.json(course)                                   // 200 with the deleted course
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router                               // server.js mounts this router