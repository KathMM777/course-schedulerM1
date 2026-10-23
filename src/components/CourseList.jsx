import CourseCard from './CourseCard'

function CourseList({ courses, allCourses, completed, onToggle }) {
    const isCompleted = (id) =>
        completed.some(completedId => String(completedId) === String(id))

    const getPrereqNumbers = (course) =>
        course.prerequisites.length === 0
            ? 'None'
            : course.prerequisites.map(id => {
                const prerequisite = allCourses.find(
                    c => String(c.id) === String(id)
                )

                return prerequisite
                    ? prerequisite.number
                    : `Unknown (${id})`
            }).join(', ')

    return (
        <div className="row g-3">
            {courses.map(course => {
                const courseCompleted = isCompleted(course.id)

                const prerequisitesMet = course.prerequisites.every(
                    id => isCompleted(id)
                )

                const isLocked = !courseCompleted && !prerequisitesMet

                return (
                    <div className="col-md-4" key={course.id}>
                        <CourseCard
                            course={course}
                            prereqNumbers={getPrereqNumbers(course)}
                            isCompleted={courseCompleted}
                            isLocked={isLocked}
                            onToggle={onToggle}
                        />
                    </div>
                )
            })}
        </div>
    )
}

export default CourseList