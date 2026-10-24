import useFetch from '../hooks/useFetch'
import CourseList from '../components/CourseList'
import ProgressSummary from '../components/ProgressSummary'
import { useState } from 'react'

function HomePage() {
    const url = `${import.meta.env.VITE_API_BASE_URL}/courses`
    const { data: courses, isPending, error } = useFetch(url)

    const [completed, setCompleted] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('completed')) || []
        } catch {
            return []
        }
    })

    const [filter, setFilter] = useState('all')
    const [saved,setSaved] = useState(false)

    const saveProgress = () => {
        localStorage.setItem('completed', JSON.stringify(completed))
        setSaved(true)
    }

    function toggleCourse(courseId) {
        setSaved(false)
        const id = String(courseId)

        setCompleted(previous => {
            const current = previous.map(String)
            const course = courses.find(c => String(c.id) === id)

            if (!course) return previous

            if (!current.includes(id)) {
                const prerequisitesMet = course.prerequisites.every(
                    prerequisiteId =>
                        current.includes(String(prerequisiteId))
                )

                if (!prerequisitesMet) return previous

                return [...current, id]
            }

            let updated = current.filter(
                completedId => completedId !== id
            )
            let changed = true

            while (changed) {
                const before = updated.length

                updated = updated.filter(completedId => {
                    const completedCourse = courses.find(
                        c => String(c.id) === completedId
                    )

                    return completedCourse &&
                        completedCourse.prerequisites.every(
                            prerequisiteId =>
                                updated.includes(String(prerequisiteId))
                        )
                })

                changed = updated.length !== before
            }

            return updated
        })
    }

    if (isPending) return <p>Loading courses...</p>
    if (error) return <p>Error: {error}</p>
    if (!courses) return null

    const visibleCourses = courses.filter(course => {
        const isDone = completed.includes(String(course.id))
        if (filter === 'completed') return isDone
        if (filter === 'remaining') return !isDone
        return true
        }

    )

    return (
        <>
            <ProgressSummary courses={courses} completed={completed}/>

            <div className="d-flex justify-content-between align-items-center my-3">
                <div className="btn-group">
                    <button
                        className={`btn btn-outline-dark ${filter === 'all' ? 'active' : ''}`}
                        onClick = {() => setFilter('all')}
                        >All Courses</button>

                    <button
                        className={`btn btn-outline-dark ${filter === 'completed' ? 'active' : ''}`}
                        onClick = {() => setFilter('completed')}
                    >Completed</button>

                    <button
                        className={`btn btn-outline-dark ${filter === 'remaining' ? 'active' : ''}`}
                        onClick = {() => setFilter('remaining')}
                    >Remaining</button>
                </div>

                <div>
                    {saved && <span className="text-success me-2">Progress Saved</span>}
                    <button className="btn btn-success" onClick={saveProgress}>Save</button>
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