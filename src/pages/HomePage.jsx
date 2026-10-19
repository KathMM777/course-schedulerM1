import useFetch from '../hooks/useFetch'
import CourseList from '../components/CourseList'
import { useState } from 'react'

function HomePage() {
    const url = `${import.meta.env.VITE_API_BASE_URL}/courses`
    const { data: courses, isPending, error } = useFetch(url)

    const [completed, setCompleted] = useState([])

    if (isPending) return <p>Loading courses...</p>
    if (error) return <p>Error: {error}</p>

    /* part 3 */
    return <CourseList courses={courses} allCourses={courses} />
}

export default HomePage