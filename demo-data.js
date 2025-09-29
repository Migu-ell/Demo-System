// Mock API Data for ScholarStreet - University Scholarship System Demo
// This simulates what would come from your Laravel backend

// Mock Database - Scholarships
const scholarshipsDB = [
    {
        id: 1,
        name: "Merit Excellence Scholarship",
        amount: 5000,
        description: "For students with outstanding academic performance",
        requirements: [
            "Minimum GWA: 2.00",
            "Full-time enrollment",
            "Essay submission required",
            "Two letters of recommendation"
        ],
        deadline: "2025-12-15",
        category: "merit",
        available_spots: 25,
        total_applicants: 150,
        status: "active"
    },
    {
        id: 2,
        name: "Need-Based Financial Aid",
        amount: 7500,
        description: "Financial assistance for students demonstrating need",
        requirements: [
            "FAFSA completion required",
            "Family income verification",
            "Minimum GWA: 2.5",
            "Community service hours"
        ],
        deadline: "2025-01-30",
        category: "need-based",
        available_spots: 50,
        total_applicants: 200,
        status: "active"
    },
    {
        id: 3,
        name: "IT Innovation Grant",
        amount: 10000,
        description: "Supporting future innovators in IT fields",
        requirements: [
            "IT major enrollment",
            "Research project portfolio",
            "Professor recommendation",
            "Presentation required"
        ],
        deadline: "2025-02-28",
        category: "IT",
        available_spots: 15,
        total_applicants: 75,
        status: "active"
    },
    {
        id: 4,
        name: "International Student Support",
        amount: 6000,
        description: "Exclusive scholarship for international students",
        requirements: [
            "International student status",
            "Minimum GWA: 3.0",
            "Cultural contribution essay",
            "Language proficiency proof"
        ],
        deadline: "2025-03-15",
        category: "international",
        available_spots: 20,
        total_applicants: 85,
        status: "active"
    },
    {
        id: 5,
        name: "Leadership Development Award",
        amount: 4000,
        description: "For students showing exceptional leadership qualities",
        requirements: [
            "Leadership experience",
            "Community involvement",
            "Minimum GWA: 3.0",
            "Interview required"
        ],
        deadline: "2025-04-10",
        category: "leadership",
        available_spots: 30,
        total_applicants: 120,
        status: "active"
    }
];

// Mock Database - Student Profile (Batangas State University)
const studentProfile = {
    id: "23-30094",
    name: "John Doe",
    email: "john.doe@g.batstate-u.edu.ph",
    phone: "+1 (555) 123-4567",
    GWA: 3.85,
    major: "Information Technology",
    year: "Junior",
    enrollment_status: "Full-time",
    total_credits: 95,
    graduation_date: "2026-05-15",
    financial_aid_eligible: true,
    documents: {
        transcript: "uploaded",
        fafsa: "completed",
        photo_id: "uploaded",
        bank_statement: "pending"
    }
};

// Mock Database - Applications
const applicationsDB = [
    {
        id: 1,
        student_id: "23-30094",
        scholarship_id: 1,
        application_date: "2024-11-15",
        status: "approved",
        amount_awarded: 5000,
        documents_submitted: ["essay", "transcript", "recommendations"],
        review_notes: "Excellent academic record and compelling essay",
        reviewer_id: "admin001"
    },
    {
        id: 2,
        student_id: "23-30094",
        scholarship_id: 2,
        application_date: "2024-10-20",
        status: "under_review",
        amount_awarded: 0,
        documents_submitted: ["fafsa", "income_verification", "essay"],
        review_notes: "Documentation complete, awaiting final review",
        reviewer_id: "admin002"
    },
    {
        id: 3,
        student_id: "23-30094",
        scholarship_id: 4,
        application_date: "2024-09-10",
        status: "approved",
        amount_awarded: 2000,
        documents_submitted: ["essay", "community_service"],
        review_notes: "Strong community involvement demonstration",
        reviewer_id: "admin001"
    }
];

// Mock API Functions
class ScholarshipAPI {
    static async getScholarships() {
        // Simulate API delay
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: scholarshipsDB,
                    message: "Scholarships retrieved successfully"
                });
            }, 800);
        });
    }

    static async getStudentProfile() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: studentProfile,
                    message: "Profile retrieved successfully"
                });
            }, 500);
        });
    }

    static async getApplications(studentId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const studentApps = applicationsDB.filter(app => app.student_id === studentId);
                resolve({
                    success: true,
                    data: studentApps,
                    message: "Applications retrieved successfully"
                });
            }, 600);
        });
    }

    static async submitApplication(scholarshipId, applicationData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newApplication = {
                    id: Date.now(),
                    student_id: studentProfile.id,
                    scholarship_id: scholarshipId,
                    application_date: new Date().toISOString().split('T')[0],
                    status: "submitted",
                    amount_awarded: 0,
                    documents_submitted: applicationData.documents || [],
                    review_notes: "Application submitted successfully",
                    reviewer_id: null
                };
                
                applicationsDB.push(newApplication);
                
                resolve({
                    success: true,
                    data: newApplication,
                    message: "Application submitted successfully"
                });
            }, 1000);
        });
    }

    static async checkEligibility(scholarshipId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const scholarship = scholarshipsDB.find(s => s.id === scholarshipId);
                let eligible = true;
                let reasons = [];

                if (!scholarship) {
                    resolve({
                        success: false,
                        eligible: false,
                        reasons: ["Scholarship not found"]
                    });
                    return;
                }

                // Check GWA requirements
                if (scholarship.category === 'merit' && studentProfile.GWA < 2.00) {
                    eligible = false;
                    reasons.push("GWA requirement not met (2.00 required)");
                }

                if (scholarship.category === 'IT' && studentProfile.major !== 'Information Technology' && studentProfile.major !== 'Engineering') {
                    eligible = false;
                    reasons.push("Not enrolled in eligible IT program");
                }

                // Check if already applied
                const existingApp = applicationsDB.find(app => 
                    app.student_id === studentProfile.id && 
                    app.scholarship_id === scholarshipId
                );

                if (existingApp) {
                    eligible = false;
                    reasons.push("Already applied for this scholarship");
                }

                resolve({
                    success: true,
                    eligible: eligible,
                    reasons: reasons,
                    requirements_met: eligible ? scholarship.requirements : []
                });
            }, 400);
        });
    }
}

// Notification System
class NotificationSystem {
    static show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} notification-popup`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1060;
            max-width: 400px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            animation: slideInRight 0.5s ease-out;
        `;
        
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-${this.getIcon(type)} me-2"></i>
                <span>${message}</span>
                <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.5s ease-in';
                setTimeout(() => notification.remove(), 500);
            }
        }, duration);
    }

    static getIcon(type) {
        const icons = {
            'success': 'check-circle',
            'danger': 'exclamation-triangle',
            'warning': 'exclamation-circle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Make API available globally
window.ScholarshipAPI = ScholarshipAPI;
window.NotificationSystem = NotificationSystem;
window.scholarshipsDB = scholarshipsDB;
window.studentProfile = studentProfile;
window.applicationsDB = applicationsDB;