const express = require('express')
const router = express.Router()                       // a mini-app that handles /api/courses routes
const pool = require('../util/database')              // the shared connection pool
const { getCoursesWithPrereqs } = require('../util/courseData') // given helper

router.get('/', async (req, res) => {                 // '/' here means /api/courses (set in server.js)
    try {
        const courses = await getCoursesWithPrereqs(pool) // courses plus a prerequisites array for each
        res.json(courses)                                 // sends the array back as JSON (status 200)
    } catch (err) {
        res.status(500).json({ error: err.message })      // a database error returns 500 instead of crashing
    }
})

module.exports = router                               // server.js mounts this router