from __future__ import annotations

sample_user = {
    "id": "dev-user-01",
    "name": "Priya Sharma",
    "email": "demo@jobdheko.local",
    "role": "candidate",
    "headline": "Senior Full Stack Engineer",
    "location": "Hyderabad, India",
    "avatar": None,
    "phone": "+91 98765 43210",
}

sample_profile = {
    "name": "Priya Sharma",
    "title": "Senior Full Stack Engineer",
    "email": "demo@jobdheko.local",
    "phone": "+91 98765 43210",
    "location": "Hyderabad, India",
    "avatar": None,
    "bio": "Passionate full-stack developer with 5+ years of experience building high-scale web platforms in React, Node.js, and cloud ecosystems.",
    "experienceYears": "5 Years",
    "currentCompany": "Tech Innovators India",
    "currentRole": "Senior Software Engineer",
    "noticePeriod": "30 Days",
    "isFresher": False,
    "resumeName": "",
    "resumeUrl": "",
    "skills": ["React", "TypeScript", "Node.js", "Go", "AWS", "Docker", "PostgreSQL", "Tailwind CSS"],
    "experience": [
        {
            "id": "exp-1",
            "role": "Senior Software Engineer",
            "company": "Tech Innovators India",
            "location": "Hyderabad, India",
            "period": "2022 - Present",
            "description": "Architecting scalable frontends, microservices, and leading developer productivity initiatives.",
        },
        {
            "id": "exp-2",
            "role": "Software Engineer",
            "company": "CloudCore Systems",
            "location": "Bangalore, India",
            "period": "2019 - 2022",
            "description": "Built high-throughput dashboard widgets and modern customer portals with React and Redux.",
        },
    ],
    "education": [
        {
            "id": "edu-1",
            "degree": "B.Tech in Computer Science",
            "institution": "National Institute of Technology",
            "period": "2015 - 2019",
            "grade": "8.8 CGPA",
        }
    ],
    "projects": [
        {
            "id": "proj-1",
            "title": "AI Resume Analyzer",
            "description": "Open-source ATS scoring engine analyzing semantic match rates for developer resumes.",
            "tech": "React, Python, FastAPI",
            "status": "In Progress",
        }
    ],
    "certifications": [
        {
            "id": "cert-1",
            "name": "AWS Certified Solutions Architect",
            "issuer": "Amazon Web Services",
            "year": "2023",
        }
    ],
}

sample_companies = [
    {
        "id": "comp-google",
        "name": "Google",
        "tagline": "Organizing the world's information",
        "industry": "Technology",
        "location": "Hyderabad",
        "employees": "10k+",
        "rating": 4.8,
        "overview": "Google builds products and platforms that help people and organizations work more efficiently.",
        "culture": ["Innovation", "Learning", "Collaboration"],
    },
    {
        "id": "comp-microsoft",
        "name": "Microsoft",
        "tagline": "Empowering every person on the planet",
        "industry": "Cloud",
        "location": "Bangalore",
        "employees": "18k+",
        "rating": 4.7,
        "overview": "Microsoft creates cloud, AI, and productivity platforms used globally by enterprises and developers.",
        "culture": ["Diversity", "Growth", "Ownership"],
    },
    {
        "id": "comp-amazon",
        "name": "Amazon",
        "tagline": "Work hard. Have fun. Make history.",
        "industry": "E-commerce",
        "location": "Hyderabad",
        "employees": "25k+",
        "rating": 4.6,
        "overview": "Amazon delivers customer experiences through advanced fulfillment and cloud platforms.",
        "culture": ["Customer obsession", "Speed", "Scale"],
    },
]

sample_jobs = [
    {
        "id": "job-001",
        "title": "Software Engineer III",
        "company": "Google",
        "companyId": "comp-google",
        "location": "Hyderabad",
        "salary": "₹28-45 LPA",
        "workMode": "Hybrid",
        "experience": "3-6 years",
        "jobType": "Full Time",
        "skills": ["React", "Go", "Kubernetes", "gRPC"],
        "description": "Build performant, secure, and scalable products for a large developer ecosystem.",
        "posted": "2 days ago",
        "matchScore": 96,
    },
    {
        "id": "job-002",
        "title": "AI/ML Research Engineer",
        "company": "Microsoft",
        "companyId": "comp-microsoft",
        "location": "Bangalore",
        "salary": "₹32-52 LPA",
        "workMode": "Remote",
        "experience": "4-8 years",
        "jobType": "Full Time",
        "skills": ["Python", "PyTorch", "Azure ML"],
        "description": "Design and deploy large-scale AI and ML systems for automation and customer intelligence.",
        "posted": "5 days ago",
        "matchScore": 92,
    },
    {
        "id": "job-003",
        "title": "Senior Frontend Engineer",
        "company": "Amazon",
        "companyId": "comp-amazon",
        "location": "Hyderabad",
        "salary": "₹26-42 LPA",
        "workMode": "Hybrid",
        "experience": "3-7 years",
        "jobType": "Full Time",
        "skills": ["TypeScript", "Next.js", "AWS", "GraphQL"],
        "description": "Build and optimize customer-facing experiences in a large-scale product organization.",
        "posted": "1 week ago",
        "matchScore": 94,
    },
    {
        "id": "job-004",
        "title": "Platform Engineer",
        "company": "Infosys",
        "companyId": "comp-infosys",
        "location": "Pune",
        "salary": "₹16-26 LPA",
        "workMode": "Onsite",
        "experience": "2-4 years",
        "jobType": "Full Time",
        "skills": ["Docker", "Kubernetes", "Terraform"],
        "description": "Support developer productivity by building resilient cloud-native platforms and internal tooling.",
        "posted": "3 days ago",
        "matchScore": 88,
    },
]

sample_applications = [
    {
        "id": "app-101",
        "jobId": "job-001",
        "jobTitle": "Software Engineer III",
        "company": "Google",
        "status": "applied",
        "appliedAt": "2026-10-10T10:15:00Z",
    },
    {
        "id": "app-102",
        "jobId": "job-003",
        "jobTitle": "Senior Frontend Engineer",
        "company": "Amazon",
        "status": "interviewing",
        "appliedAt": "2026-10-08T09:00:00Z",
    },
]

sample_notifications = [
    {
        "id": "notif-1",
        "title": "Application status updated",
        "message": "Your application for Software Engineer III has moved to the interview stage.",
        "category": "jobs",
        "read": False,
        "createdAt": "2026-10-13T09:00:00Z",
    },
    {
        "id": "notif-2",
        "title": "New AI job match",
        "message": "A new role matching your profile is available in Hyderabad.",
        "category": "matches",
        "read": True,
        "createdAt": "2026-10-12T15:00:00Z",
    },
]

sample_resources = [
    {
        "id": "res-1",
        "title": "How to craft a strong ATS resume",
        "category": "resume",
        "description": "Use quantified results and keyword alignment to improve your discoverability.",
        "link": "https://example.com/ats-resume",
    },
    {
        "id": "res-2",
        "title": "Interview stories that stand out",
        "category": "interview",
        "description": "Learn how to structure examples around outcomes and technical trade-offs.",
        "link": "https://example.com/interview-stories",
    },
    {
        "id": "res-3",
        "title": "Career growth pathways for engineers",
        "category": "career",
        "description": "Map the path from individual contributor to senior technical leadership.",
        "link": "https://example.com/career-growth",
    },
]

sample_alerts = [
    {
        "id": "alert-1",
        "keyword": "React",
        "location": "Hyderabad",
        "status": "active",
        "createdAt": "2026-10-01T10:00:00Z",
    }
]

sample_messages = {
    "conversations": [
        {
            "id": "conv-1",
            "participant": "Recruiter - Google",
            "lastMessage": "Thanks for sharing your portfolio; can we schedule a quick call?",
            "timestamp": "2m ago",
        },
        {
            "id": "conv-2",
            "participant": "Hiring Manager - Microsoft",
            "lastMessage": "We loved your AI-focused project experience.",
            "timestamp": "24m ago",
        },
    ],
    "messagesByConversation": {
        "conv-1": [
            {"id": "msg-1", "sender": "them", "text": "Hi Priya, thanks for applying.", "time": "09:20"},
            {"id": "msg-2", "sender": "me", "text": "Thanks! I’d love to discuss my experience.", "time": "09:21"},
        ],
        "conv-2": [
            {"id": "msg-3", "sender": "them", "text": "We noticed your ML and product work strongly aligns.", "time": "08:40"},
        ],
    },
}

resume_data = {
    "documentTitle": "Priya Sharma Resume",
    "documentHtml": "<h1>Priya Sharma</h1><p>Senior Full Stack Engineer</p>",
    "personalInfo": {
        "fullName": "Priya Sharma",
        "email": "demo@jobdheko.local",
        "phone": "+91 98765 43210",
        "location": "Hyderabad, India",
        "website": "",
        "linkedin": "https://linkedin.com/in/priyasharma",
    },
    "summary": "Full-stack engineer focused on product reliability, cloud systems, and developer experience.",
    "experience": [],
    "education": [],
    "skills": ["React", "TypeScript", "Node.js", "AWS", "Docker"],
}

company_by_id = {company["id"]: company for company in sample_companies}
job_by_id = {job["id"]: job for job in sample_jobs}
