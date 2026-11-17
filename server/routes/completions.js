const express = require('express')
const pool = require('../util/database')
const { getCoursesWithPrereqs, replaceCompletions } = require('../util/courseData')

const router = express.Router()
const USER_ID = 1 // M3: replaced by the logged-in user's id

// Check that every completed course exists and that all its prerequisites are included.
const isValidCompletionSet = (courses, completed) => {
    return completed.every(id => {
        const course = courses.find(c => c.id === id)
        return course && course.prerequisites.every(p => completed.includes(p))
    })
}

// GET /api/completions: return the saved course IDs for this user.
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT course_id FROM completions WHERE user_id = ? ORDER BY course_id',
            [USER_ID]
        )

        res.json(rows.map(row => row.course_id))
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// PUT /api/completions: replace the saved list after checking prerequisites.
router.put('/', async (req, res) => {
    const completed = req.body

    // The request body must be an array of unique integer course IDs.
    if (
        !Array.isArray(completed) ||
        !completed.every(id => Number.isInteger(id)) ||
        new Set(completed).size !== completed.length
    ) {
        return res.status(400).json({
            error: 'Send an array of unique integer course IDs.'
        })
    }

    try {
        const courses = await getCoursesWithPrereqs(pool)

        // Reject invalid lists before changing anything in the database.
        if (!isValidCompletionSet(courses, completed)) {
            return res.status(400).json({
                error: 'Every completed course must exist and have all its prerequisites completed.'
            })
        }

        // Save the validated list using the helper provided for M2.
        const sortedIds = [...completed].sort((a, b) => a - b)
        await replaceCompletions(pool, USER_ID, sortedIds)

        res.json(sortedIds)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router