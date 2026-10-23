import useFetch from '../hooks/useFetch'
import CourseList from '../components/CourseList'
import ProgressSummary from '../components/ProgressSummary'
import { useState } from 'react'

function HomePage() {
    const url = `${import.meta.env.VITE_API_BASE_URL}/courses`
    const { data: courses, isPending, error } = useFetch(url)

    const [completed, setCompleted] = useState([])

    function toggleCourse(courseId) {
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

    return (
        <>
            <ProgressSummary
                courses={courses}
                completed={completed}
            />

            <CourseList
                courses={courses}
                allCourses={courses}
                completed={completed}
                onToggle={toggleCourse}
            />
        </>
    )
}

export default HomePage