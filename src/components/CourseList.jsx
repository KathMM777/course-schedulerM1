import CourseCard from './CourseCard'

function CourseList ({courses, allCourses} ) {
    const getPrereqNumbers = (course) =>
        course.prerequisites.length === 0 ?
            'None': course.prerequisites.map(id => allCourses.find(c => c.id === id).number).join(', ')
    return (
        <div className="row g-3">
            {courses.map(course => (
                <div className="col-md-4" key={course.id}>
                    <CourseCard course={course}
                                prereqNumbers={getPrereqNumbers(course)}
                    />
                </div>
            ))}
        </div>

    )
}

export default CourseList