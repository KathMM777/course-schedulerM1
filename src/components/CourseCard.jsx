function CourseCard({
                        course,
                        prereqNumbers,
                        isCompleted,
                        isLocked,
                        onToggle
                    }) {
    const status = isCompleted
        ? 'Completed'
        : isLocked
            ? 'Locked'
            : 'Available'

    const badgeColor = isCompleted
        ? 'bg-success'
        : isLocked
            ? 'bg-secondary'
            : 'bg-primary'

    return (
        <div className="card h-100">
            <div className="card-body">
                <h6>{course.number}</h6>
                <h5>{course.title}</h5>
                <p className="text-muted">{course.credits} credits</p>
                <p>{course.description}</p>

                <p>
                    <strong>Prerequisites: </strong>
                    {prereqNumbers}
                </p>

                <span className={`badge ${badgeColor} mb-3`}>
                    {status}
                </span>

                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id={`completed-${course.id}`}
                        checked={isCompleted}
                        disabled={isLocked}
                        onChange={() => onToggle(course.id)}
                    />

                    <label
                        className="form-check-label"
                        htmlFor={`completed-${course.id}`}
                    >
                        Completed
                    </label>
                </div>
            </div>
        </div>
    )
}

export default CourseCard