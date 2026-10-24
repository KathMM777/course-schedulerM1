function AboutPage() {
    const currentDate = new Date().toLocaleDateString('en-US',
        {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})

    return (
        <div className="card mx-auto" style={{maxWidth: '600px'}}>
            <div className="card-body">
                <h4>About</h4>
                <p>The Aurora CS Course Scheduler shows the CS Developer Track catalog,
                tracks which courses you have completed, and shows which courses you are
                eligible to take next.</p>
                <dl className="row mb-0">
                    <dt className="col-sm-3">Author(s)</dt>
                    <dd className="col-sm-9">Katherine Maya & Karen Segura</dd>
                    <dt className="col-sm-3">Date</dt>
                    <dd className="col-sm-9">{currentDate}</dd>
                    <dt className="col-sm-3">Version</dt>
                    <dd className="col-sm-9">1.0.0</dd>
                </dl>
            </div>
        </div>
    )
}

export default AboutPage