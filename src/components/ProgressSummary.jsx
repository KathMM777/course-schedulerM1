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
                Completed: {completedCount} | Available: {availableCount} |
                {' '}Locked: {lockedCount}
            </p>
        </div>
    );
}

export default ProgressSummary;