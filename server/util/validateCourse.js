function validateCourse(body) {                      // body is req.body from POST or PUT
    const { number, title, credits } = body            // pull out the three required fields

    if (!number || !title || credits === undefined || credits === null || credits === '') {
        return 'number, title, and credits are required' // returns an error message string
    }
    return null                                        // null means valid, no error
}

module.exports = validateCourse