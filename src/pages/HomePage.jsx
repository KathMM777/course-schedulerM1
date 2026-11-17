import useFetch from '../hooks/useFetch'
import CourseList from '../components/CourseList'
import ProgressSummary from '../components/ProgressSummary'
import { useEffect, useState } from 'react'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

function HomePage() {
    const { data: courses, isPending, error } =
        useFetch(`${BASE_URL}/api/courses`)

    const {
        data: savedCompletions,
        isPending: completionsPending,
        error: completionsError
    } = useFetch(`${BASE_URL}/api/completions`)

    const [completed, setCompleted] = useState(null)
    const [filter, setFilter] = useState('all')
    const [saved, setSaved] = useState(false)
    const [saveError, setSaveError] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    // Copy saved IDs into editable state, using strings for the existing comparisons.
    useEffect(() => {
        if (Array.isArray(savedCompletions)) {
            setCompleted(savedCompletions.map(String))
        }
    }, [savedCompletions])

    async function saveProgress() {
        setSaved(false)
        setSaveError('')
        setIsSaving(true)

        try {
            // The API expects numeric course IDs in a plain array.
            const response = await fetch(`${BASE_URL}/api/completions`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(completed.map(Number))
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Could not save progress.')
            }

            setSaved(true)
        } catch (err) {
            setSaveError(err.message)
        } finally {
            setIsSaving(false)
        }
    }

    function toggleCourse(courseId) {
        if (isSaving) return

        setSaved(false)
        setSaveError('')
        const id = String(courseId)

        setCompleted(previous => {
            const current = previous.map(String)
            const course = courses.find(c => String(c.id) === id)

            if (!course) return previous

            if (!current.includes(id)) {
                const prerequisitesMet = course.prerequisites.every(
                    prerequisiteId => current.includes(String(prerequisiteId))
                )

                if (!prerequisitesMet) return previous

                return [...current, id]
            }

            let updated = current.filter(completedId => completedId !== id)
            let changed = true

            // Keep removing courses whose prerequisites are no longer completed.
            while (changed) {
                const before = updated.length

                updated = updated.filter(completedId => {
                    const completedCourse = courses.find(
                        c => String(c.id) === completedId
                    )

                    return completedCourse &&
                        completedCourse.prerequisites.every(
                            prerequisiteId => updated.includes(String(prerequisiteId))
                        )
                })

                changed = updated.length !== before
            }

            return updated
        })
    }

    if (error) return <p>Error loading courses: {error.message || error}</p>
    if (completionsError) {
        return <p>Error loading progress: {completionsError.message || completionsError}</p>
    }

    if (isPending || completionsPending || completed === null) {
        return <p>Loading courses and progress...</p>
    }

    if (!courses) return null

    const visibleCourses = courses.filter(course => {
        const isDone = completed.includes(String(course.id))
        if (filter === 'completed') return isDone
        if (filter === 'remaining') return !isDone
        return true
    })

    return (
        <>
            <ProgressSummary courses={courses} completed={completed} />

            <div className="d-flex justify-content-between align-items-center my-3">
                <div className="btn-group">
                    <button
                        className={`btn btn-outline-dark ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All Courses
                    </button>

                    <button
                        className={`btn btn-outline-dark ${filter === 'completed' ? 'active' : ''}`}
                        onClick={() => setFilter('completed')}
                    >
                        Completed
                    </button>

                    <button
                        className={`btn btn-outline-dark ${filter === 'remaining' ? 'active' : ''}`}
                        onClick={() => setFilter('remaining')}
                    >
                        Remaining
                    </button>
                </div>

                <div>
                    {saved && <span className="text-success me-2">Progress Saved</span>}
                    {saveError && <span className="text-danger me-2">{saveError}</span>}

                    <button
                        className="btn btn-success"
                        onClick={saveProgress}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            <CourseList
                courses={visibleCourses}
                allCourses={courses}
                completed={completed}
                onToggle={toggleCourse}
            />
        </>
    )
}

export default HomePage