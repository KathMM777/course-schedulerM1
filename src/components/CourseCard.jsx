import HomePage from "../pages/HomePage.jsx";

function CourseCard({course, prereqNumbers}) {
    return (
        <div className="card h-100">
            <div className="card-body">
                <h6>{course.number}</h6>
                <h5>{course.title}</h5>
                <p className="text-muted">{course.credits} credits</p>
                <p>{course.description}</p>
                <p><strong>Prerequisites:</strong>{prereqNumbers}</p>
            </div>
        </div>
    )
}

export default CourseCard;