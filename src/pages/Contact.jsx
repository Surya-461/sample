// pages/Contact.jsx
import { useState } from "react";
import "./Contact.css";

const faqs = [
    {
        question: "What services does FinDrive Analytics provide?",
        answer:
            "We provide insurance risk analytics, dashboards, fraud detection, and business intelligence tools for insurers."
    },
    {
        question: "How quickly will I receive support?",
        answer:
            "Our support team responds within 24 hours on business days. Priority clients receive faster SLA-based responses."
    },
    {
        question: "Do you offer live product demos?",
        answer:
            "Yes. We provide customized demos based on your insurance workflows and reporting needs."
    },
    {
        question: "Is my data secure with FinDrive Analytics?",
        answer:
            "Absolutely. We follow enterprise-grade security practices including encryption and strict access controls."
    }
];

const Contact = () => {
    /* ================= FORM STATE ================= */
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [sending, setSending] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);

    /* ================= HANDLERS ================= */
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);

        try {
            const res = await fetch("http://localhost:5000/send-message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (data.success) {
                alert("✅ Message sent successfully!");
                setFormData({
                    name: "",
                    email: "",
                    subject: "",
                    message: ""
                });
            } else {
                alert("❌ Failed to send message");
            }
        } catch (err) {
            alert("❌ Server error");
        }

        setSending(false);
    };

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="contact-page py-5">
            <div className="container">

                {/* ================= HEADER ================= */}
                <div className="text-center mb-5">
                    <h2 className="fw-bold contact-title">Let’s Connect</h2>
                    <p className="contact-subtitle">
                        Whether you need claim assistance, product demos, or technical support,
                        our experts are ready to help you move forward with confidence.
                    </p>
                </div>

                {/* ================= MAIN CONTENT ================= */}
                <div className="row g-4">

                    {/* ================= CONTACT FORM ================= */}
                    <div className="col-lg-6">
                        <div className="contact-frame h-100">
                            <h4 className="fw-bold mb-3 text-black">
                                Send us a Message
                            </h4>

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Your Name</label>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="Name"
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="you@company.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Subject</label>
                                    <input
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="How can we help you?"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="form-control"
                                        rows="4"
                                        placeholder="Tell us more about your requirements..."
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={sending}
                                >
                                    {sending ? "Sending..." : "Send Message"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* ================= CONTACT INFO ================= */}
                    <div className="col-lg-6">
                        <div className="contact-info h-100">
                            <h4 className="fw-bold mb-3">Contact Information</h4>

                            <div className="contact-info-card mb-3">
                                <div className="icon">✉️</div>
                                <div>
                                    <h6>Email Us</h6>
                                    <p className="mb-0">
                                        support@findriveanalytics.com
                                    </p>
                                </div>
                            </div>

                            <div className="contact-info-card mb-3">
                                <div className="icon">📞</div>
                                <div>
                                    <h6>Call Us</h6>
                                    <p className="mb-0">
                                        +91 98765 43210
                                    </p>
                                </div>
                            </div>

                            <div className="contact-info-card">
                                <div className="icon">📍</div>
                                <div>
                                    <h6>Visit Us</h6>
                                    <p className="mb-0">
                                        Financial Technology Park,<br />
                                        Hyderabad, Telangana – 500081
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= FAQ SECTION ================= */}
                <div className="mt-5">
                    <div className="faq-container">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`faq-item ${activeIndex === index ? "active" : ""}`}
                            >
                                <button
                                    type="button"
                                    className="faq-question"
                                    onClick={() => toggleFAQ(index)}
                                >
                                    {faq.question}
                                    <span>{activeIndex === index ? "−" : "+"}</span>
                                </button>
                                <div className="faq-answer">
                                    {faq.answer}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Contact;
