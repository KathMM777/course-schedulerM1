import useFetch from '../hooks/useFetch';

function HomePage() {
    const url = `${import.meta.env.VITE_API_BASE_URL}/courses`;
    const { data: courses, isPending, error } = useFetch(url);

    return (
        <div>
            <h1>Aurora CS Course Scheduler</h1>

            {isPending && <p>Loading courses...</p>}
            {error && <p>Error: {error}</p>}

            {courses && courses.map(course => (
                <div key={course.id}>
                    <h2>{course.number}: {course.title}</h2>
                    <p>Credits: {course.credits}</p>
                    <p>{course.description}</p>
                </div>
            ))}
        </div>
    );
}

export default HomePage;