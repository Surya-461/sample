// pages/About.jsx
import "./About.css";

const About = () => {
    return (
        <div className="about-page">

            {/* ================= TOP CAROUSEL ================= */}
            {/* <section className="about-carousel">
                <div
                    id="aboutCarousel"
                    className="carousel slide carousel-fade"
                    data-bs-ride="carousel"
                    data-bs-interval="4000"
                >

                    <div className="carousel-indicators">
                        <button data-bs-target="#aboutCarousel" data-bs-slide-to="0" className="active"></button>
                        <button data-bs-target="#aboutCarousel" data-bs-slide-to="1"></button>
                        <button data-bs-target="#aboutCarousel" data-bs-slide-to="2"></button>
                    </div>

                    <div className="carousel-inner">

                        <div className="carousel-item active">
                            <div className="carousel-bg slide-1">
                                <div className="carousel-content">
                                    <h1>Insurance Claim Analytics</h1>
                                    <p>
                                        Transforming complex insurance data into
                                        actionable business insights.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="carousel-item">
                            <div className="carousel-bg slide-2">
                                <div className="carousel-content">
                                    <h1>Fraud & Risk Intelligence</h1>
                                    <p>
                                        Detect suspicious claims early and
                                        reduce financial losses.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="carousel-item">
                            <div className="carousel-bg slide-3">
                                <div className="carousel-content">
                                    <h1>Data-Driven Growth</h1>
                                    <p>
                                        Improve efficiency, compliance,
                                        and customer trust.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#aboutCarousel"
                        data-bs-slide="prev"
                    >
                        <span className="carousel-control-prev-icon"></span>
                    </button>

                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#aboutCarousel"
                        data-bs-slide="next"
                    >
                        <span className="carousel-control-next-icon"></span>
                    </button>

                </div>
            </section> */}

            {/* ================= MISSION ================= */}
            {/* ================= OUR STORY ================= */}
            {/* <section className="about-section our-story"> */}
                <div className="container py-5">
                    <div className="row align-items-start g-5">

                        {/* LEFT CONTENT */}
                        <div className="col-lg-6">
                            <h2 className="section-title mb-4">Our Story</h2>

                            <p className="section-text">
                                Founded in 2020, InsureClaim was created to solve a common problem —
                                insurance claims were often slow, complex, and frustrating. Our
                                founders experienced firsthand how confusing paperwork, repeated
                                follow-ups, and lack of transparency could make an already stressful
                                situation even harder.
                            </p>

                            <p className="section-text">
                                We set out to change that. By combining customer-first thinking with
                                modern digital technology, we built a platform that simplifies the
                                entire claims journey — from submission to settlement — while keeping
                                users informed at every step.
                            </p>

                        </div>

                        {/* RIGHT STATS */}
                        <div className="col-lg-6">
                            <div className="row g-4">

                                <div className="col-md-6">
                                    <div className="story-card">
                                        <h3>2020</h3>
                                        <p>Year Founded</p>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="story-card">
                                        <h3>50K+</h3>
                                        <p>Claims Processed</p>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="story-card">
                                        <h3>98%</h3>
                                        <p>Satisfaction Rate</p>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="story-card">
                                        <h3>24/7</h3>
                                        <p>Support Available</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            {/* </section> */}



            {/* ================= OUR CORE VALUES ================= */}
            {/* <section className="about-section about-serve"> */}
                <div className="container ">
                    <div className="row text-center mb-4">
                        <h2 className="about-title text-wind">
                            Our Core Values
                        </h2>
                        <p className="about-text">
                            These core values guide everything we do at InsureClaim.
                        </p>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-3">
                            <div className="impact-card">
                                <div className="icon-box">🛡️</div>
                                <h3>Trust & Security</h3>
                                <p>
                                    Your data and claims are protected with the highest security
                                    standards in the industry.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="impact-card">
                                <div className="icon-box">👥</div>
                                <h3>Customer First</h3>
                                <p>
                                    Every decision we make is guided by what’s best for our customers
                                    and their needs.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="impact-card">
                                <div className="icon-box">🎯</div>
                                <h3>Innovation</h3>
                                <p>
                                    We continuously improve our platform to make claims processing
                                    faster and easier.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="impact-card">
                                <div className="icon-box">🏆</div>
                                <h3>Excellence</h3>
                                <p>
                                    We strive for excellence in everything we do, from customer service
                                    to claims processing.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            {/* </section> */}


            {/* ================= ANALYTICS APPROACH ================= */}
            {/* <section className="about-section about-approach"> */}
                <div className="container py-5">
                    <div className="row align-items-center">

                        <div className="col-md-6">
                            <h2 className="about-title text-wind mb-3 ">
                                Our Analytics Approach
                            </h2>
                            <ul className="about-list">
                                <li>Data ingestion from claim & policy systems</li>
                                <li>Cleaning, validation & feature engineering</li>
                                <li>Fraud and risk indicator analysis</li>
                                <li>Interactive Power BI dashboards</li>
                                <li>Continuous performance monitoring</li>
                            </ul>
                        </div>

                        <div className="col-md-6 text-center">
                            <img
                                src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=900&q=80"
                                alt="Analytics Process"
                                className="img-fluid shadow about-img"
                            />
                        </div>

                    </div>
                </div>
            {/* </section> */}

            {/* ================= WHY CHOOSE US ================= */}
            {/* <section className="about-section about-why"> */}
                <div className="container py-5">

                    {/* ================= TITLE ================= */}
                    <div className="row text-center mb-5">
                        <h2 className="about-title text-wind">
                            Why Choose FinDrive Analytics?
                        </h2>
                        <p className="about-text mt-2">
                            We've reimagined the insurance claims process to make it faster,
                            simpler, and more transparent.
                        </p>
                    </div>

                    {/* ================= CARDS ================= */}
                    <div className="row g-4">
                        <div className="col-md-3">
                            <div className="impact-card text-start h-100">
                                <div className="icon-box mb-3">📄</div>
                                <h4>Easy Claims Filing</h4>
                                <p>
                                    Submit your claims online in minutes with our streamlined
                                    digital process.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="impact-card text-start h-100">
                                <div className="icon-box mb-3">⏱️</div>
                                <h4>Fast Processing</h4>
                                <p>
                                    Get your claims processed within 24–48 hours with real-time
                                    status updates.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="impact-card text-start h-100">
                                <div className="icon-box mb-3">🎧</div>
                                <h4>24/7 Support</h4>
                                <p>
                                    Our dedicated support team is always here to help you through
                                    the process.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="impact-card text-start h-100">
                                <div className="icon-box mb-3">🛡️</div>
                                <h4>Secure & Reliable</h4>
                                <p>
                                    Your data is protected with enterprise-grade security and
                                    encryption.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            {/* </section> */}


        </div>
    );
};

export default About;
