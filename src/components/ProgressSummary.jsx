function ProgressSummary({ courses, completed }) {
    const isCompleted = (id) =>
        completed.some(completedId => String(completedId) === String(id));

    const hasPrerequisites = (course) =>
        course.prerequisites.every(id => isCompleted(id));

    const completedCount = courses.filter(
        course => isCompleted(course.id)
    ).length;

    const availableCount = courses.filter(
        course => !isCompleted(course.id) && hasPrerequisites(course)
    ).length;

    const lockedCount = courses.filter(
        course => !isCompleted(course.id) && !hasPrerequisites(course)
    ).length;

    return (
        <div className="alert alert-info">
            <h2 className="h5">Progress Summary</h2>
            <p className="mb-0">
                Completed: {completedCount} of {courses.length} | Available: {availableCount} |
                {' '}Locked: {lockedCount}
            </p>
            <progress
                className="w-100 mt-2"
                value={completedCount}
                max={courses.length || 1}
                aria-label="Course completion progress"
            />
        </div>
    );
}

export default ProgressSummary;