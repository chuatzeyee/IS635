export interface Question {
  readonly id: number
  readonly session: number
  readonly question: string
  readonly options: readonly string[]
  readonly correctIndex: number
}

export const questions: readonly Question[] = [
  // ── Session 1: Introduction to LCAP ──────────────────────────────

  {
    id: 1,
    session: 1,
    question: "What does LCAP stand for?",
    options: [
      "Low Cost Application Platform",
      "Low Code Application Platform",
      "Lightweight Cloud Application Protocol",
      "Local Code Assembly Platform",
    ],
    correctIndex: 1,
  },
  {
    id: 2,
    session: 1,
    question:
      "According to Gartner, by the close of 2028, Agentic AI will be implemented via enterprise LCAPs in how many businesses globally?",
    options: ["1 out of 5", "2 out of 5", "3 out of 5", "4 out of 5"],
    correctIndex: 3,
  },
  {
    id: 3,
    session: 1,
    question:
      "Compared to traditional coding, how many developers are typically needed for a low-code project of the same size?",
    options: [
      "Half as many",
      "Approximately one-third",
      "The same number",
      "Twice as many",
    ],
    correctIndex: 1,
  },
  {
    id: 4,
    session: 1,
    question:
      "How much faster is low-code development compared to traditional coding?",
    options: [
      "2 times faster",
      "Approximately 3 times faster",
      "5 times faster",
      "10 times faster",
    ],
    correctIndex: 1,
  },
  {
    id: 5,
    session: 1,
    question: "What is the default deployment method in OutSystems?",
    options: [
      "Docker containers",
      "Kubernetes clusters",
      "1-Click Publish",
      "Manual FTP upload",
    ],
    correctIndex: 2,
  },
  {
    id: 6,
    session: 1,
    question:
      "Which of the following is NOT a use case for enterprise LCAPs identified by Gartner?",
    options: [
      "Line-of-business software development",
      "Modernization of legacy business applications",
      "Replacing operating systems",
      "Internal company processes and digital workplaces",
    ],
    correctIndex: 2,
  },
  {
    id: 7,
    session: 1,
    question:
      "What are the three cloud environments managed by an LCAP provider?",
    options: [
      "Alpha, Beta, Production",
      "Dev, Test, and Prod",
      "Staging, QA, Live",
      "Build, Deploy, Run",
    ],
    correctIndex: 1,
  },
  {
    id: 8,
    session: 1,
    question: "Enterprise LCAP licensing is typically:",
    options: [
      "Free for all organizations",
      "Affordable for startups",
      "Very expensive (large orgs can pay more than US$1M annually)",
      "Pay-per-use with no minimum",
    ],
    correctIndex: 2,
  },
  {
    id: 9,
    session: 1,
    question:
      "In a low-code environment, how many infrastructure/DB engineers are typically needed per hosted application?",
    options: [
      "At least 2",
      "At least 1",
      "None (fully managed service)",
      "5 or more",
    ],
    correctIndex: 2,
  },
  {
    id: 10,
    session: 1,
    question:
      "Which version control system does traditional coding typically use?",
    options: ["SVN", "GitHub", "Perforce", "Mercurial"],
    correctIndex: 1,
  },
  {
    id: 11,
    session: 1,
    question: "In low-code platforms, version control and CI/CD are:",
    options: [
      "Not available",
      "Managed through GitHub",
      "Built-in",
      "Optional add-ons",
    ],
    correctIndex: 2,
  },
  {
    id: 12,
    session: 1,
    question:
      "Gartner defines LCAP platforms as using which development approach?",
    options: [
      "Waterfall development",
      "Agile development only",
      "Model-driven development tools, generative AI, and prebuilt component catalogs",
      "Test-driven development",
    ],
    correctIndex: 2,
  },
  {
    id: 13,
    session: 1,
    question:
      "Which of these is a MANDATORY feature of enterprise LCAPs according to Gartner?",
    options: [
      "Blockchain integration",
      "Visual development tools and IDEs with minimal coding",
      "Quantum computing support",
      "Virtual reality interfaces",
    ],
    correctIndex: 1,
  },
  {
    id: 14,
    session: 1,
    question: "Which of these is a COMMON (not mandatory) feature of LCAPs?",
    options: [
      "Visual development tools",
      "Security features with IAM",
      "Support for event-driven and microservices architectures",
      "Integrated runtime environment",
    ],
    correctIndex: 2,
  },
  {
    id: 15,
    session: 1,
    question:
      "The LCAP market is related to but different from which other market?",
    options: [
      "ERP Platform market",
      "Citizen Application Development Platform (CADP) market",
      "CRM Platform market",
      "Cloud Infrastructure market",
    ],
    correctIndex: 1,
  },
  {
    id: 16,
    session: 1,
    question: "What differentiates LCAP from CADP?",
    options: [
      "LCAPs are cheaper",
      "Target audience and complexity of applications built on the platform",
      "LCAPs only support mobile apps",
      "CADPs are enterprise-grade",
    ],
    correctIndex: 1,
  },
  {
    id: 17,
    session: 1,
    question:
      "In the Gartner LCAP market, which trend is described as the most prominent market catalyst?",
    options: [
      "Cloud migration",
      "Generative AI",
      "Blockchain integration",
      "IoT development",
    ],
    correctIndex: 1,
  },
  {
    id: 18,
    session: 1,
    question:
      "Which software engineering principle involves separating frontend and backend into different modules?",
    options: [
      "Encapsulation",
      "Separation of Concerns",
      "Reuse",
      "Abstraction",
    ],
    correctIndex: 1,
  },
  {
    id: 19,
    session: 1,
    question:
      "What serves as the 'service contract' between frontend and backend in SOA?",
    options: [
      "WSDL documentation",
      "REST API / Swagger documentation",
      "Database schema",
      "Configuration files",
    ],
    correctIndex: 1,
  },
  {
    id: 20,
    session: 1,
    question:
      "In the SOA Layered Architecture, which layer wraps external or legacy systems?",
    options: [
      "UI Layer",
      "Composite Services",
      "Atomic Services",
      "Wrapper Services",
    ],
    correctIndex: 3,
  },
  {
    id: 21,
    session: 1,
    question:
      "In the SOA Layered Architecture, which layer orchestrates Atomic and Wrapper services?",
    options: [
      "UI Layer",
      "Composite Services",
      "Atomic Services",
      "Wrapper Services",
    ],
    correctIndex: 1,
  },
  {
    id: 22,
    session: 1,
    question:
      "In the SOA Layered Architecture, which layer encapsulates a single entity?",
    options: [
      "UI Layer",
      "Composite Services",
      "Atomic Services",
      "Wrapper Services",
    ],
    correctIndex: 2,
  },
  {
    id: 23,
    session: 1,
    question:
      "What is the correct order of the SOA layers from top to bottom?",
    options: [
      "Atomic, Composite, Wrapper, UI",
      "Wrapper, Atomic, Composite, UI",
      "UI, Composite, Atomic, Wrapper",
      "UI, Atomic, Composite, Wrapper",
    ],
    correctIndex: 2,
  },
  {
    id: 24,
    session: 1,
    question: "How many layers does the OutSystems Designer Studio have?",
    options: ["2", "3", "4", "5"],
    correctIndex: 2,
  },
  {
    id: 25,
    session: 1,
    question:
      "Which layer in OutSystems Designer Studio is used to define Entities and ER diagrams?",
    options: ["Logic", "Interface", "Data", "Processes"],
    correctIndex: 2,
  },
  {
    id: 26,
    session: 1,
    question:
      "Which layer in OutSystems handles REST APIs and server-side logic?",
    options: ["Data", "Logic", "Interface", "Processes"],
    correctIndex: 1,
  },
  {
    id: 27,
    session: 1,
    question:
      "Which OutSystems feature allows you to bootstrap database entities from imported files?",
    options: [
      "SQL scripts",
      "Excel file import",
      "JSON file import",
      "XML file import",
    ],
    correctIndex: 1,
  },
  {
    id: 28,
    session: 1,
    question:
      "What is the OutSystems marketplace for plug-ins and components called?",
    options: [
      "OutSystems Store",
      "Forge",
      "OutSystems Hub",
      "Component Gallery",
    ],
    correctIndex: 1,
  },
  {
    id: 29,
    session: 1,
    question:
      "Which of these is NOT a Forge component example mentioned in the lecture?",
    options: ["OpenAI", "Google Maps", "Stripe", "Microsoft Teams"],
    correctIndex: 3,
  },
  {
    id: 30,
    session: 1,
    question: "What does OutSystems auto-create when Entities are defined?",
    options: [
      "Only the database tables",
      "Only the ER diagrams",
      "ER diagrams AND CRUD methods AND data model",
      "Only the CRUD methods",
    ],
    correctIndex: 2,
  },
  {
    id: 31,
    session: 1,
    question:
      "Which OutSystems layer supports Reactive Web App and PWA Mobile app deployment?",
    options: ["Data", "Logic", "Interface", "Processes"],
    correctIndex: 2,
  },
  {
    id: 32,
    session: 1,
    question:
      "The Processes layer example in the lecture demonstrates subscribing to messages from which broker?",
    options: ["Kafka", "RabbitMQ", "ActiveMQ", "Redis"],
    correctIndex: 1,
  },
  {
    id: 33,
    session: 1,
    question: "Swagger documentation for REST APIs in OutSystems is:",
    options: [
      "Manually written by developers",
      "Auto-created",
      "Imported from external tools",
      "Not supported",
    ],
    correctIndex: 1,
  },
  {
    id: 34,
    session: 1,
    question:
      "In which quadrant of the Gartner Magic Quadrant (Apr 2025) is OutSystems placed?",
    options: ["Challenger", "Visionary", "Leader", "Niche Player"],
    correctIndex: 2,
  },
  {
    id: 35,
    session: 1,
    question:
      "Which of the following is NOT a Leader in the Gartner LCAP Magic Quadrant (Apr 2025)?",
    options: ["Microsoft", "Salesforce", "Oracle", "ServiceNow"],
    correctIndex: 2,
  },
  {
    id: 36,
    session: 1,
    question:
      "Oracle is classified as which type of vendor in the Gartner LCAP Magic Quadrant?",
    options: ["Leader", "Challenger", "Visionary", "Niche Player"],
    correctIndex: 1,
  },
  {
    id: 37,
    session: 1,
    question: "What is Oracle's LCAP offering called?",
    options: [
      "Oracle Cloud Builder",
      "Oracle APEX",
      "Oracle Low Code Studio",
      "Oracle App Engine",
    ],
    correctIndex: 1,
  },
  {
    id: 38,
    session: 1,
    question: "What is Microsoft's LCAP offering called?",
    options: [
      "Microsoft Azure Builder",
      "Microsoft App Studio",
      "Power Platform (Power Apps, Power Automate, Copilot Studio, Dataverse)",
      "Microsoft Low Code Suite",
    ],
    correctIndex: 2,
  },
  {
    id: 39,
    session: 1,
    question: "What is Mendix's parent company?",
    options: ["Microsoft", "Siemens", "SAP", "IBM"],
    correctIndex: 1,
  },
  {
    id: 40,
    session: 1,
    question: "Which vendor's LCAP offering is Pega Infinity?",
    options: ["SAP", "Salesforce", "Pegasystems", "ServiceNow"],
    correctIndex: 2,
  },
  {
    id: 41,
    session: 1,
    question: "SAP's LCAP offering is called:",
    options: [
      "SAP Creator",
      "SAP App Engine",
      "SAP Build",
      "SAP Low Code Studio",
    ],
    correctIndex: 2,
  },
  {
    id: 42,
    session: 1,
    question: "Which quadrant is SAP placed in?",
    options: ["Leader", "Challenger", "Visionary", "Niche Player"],
    correctIndex: 2,
  },
  {
    id: 43,
    session: 1,
    question: "Which TWO vendors are Niche Players in the Gartner MQ?",
    options: [
      "Oracle and Zoho",
      "SAP and Pegasystems",
      "Retool and Creatio",
      "Appian and ServiceNow",
    ],
    correctIndex: 2,
  },
  {
    id: 44,
    session: 1,
    question: "The Y-axis of the Gartner Magic Quadrant represents:",
    options: [
      "Completeness of Vision",
      "Market Share",
      "Ability to Execute",
      "Customer Satisfaction",
    ],
    correctIndex: 2,
  },
  {
    id: 45,
    session: 1,
    question: "The X-axis of the Gartner Magic Quadrant represents:",
    options: [
      "Ability to Execute",
      "Revenue Growth",
      "Completeness of Vision",
      "Number of Customers",
    ],
    correctIndex: 2,
  },
  {
    id: 46,
    session: 1,
    question:
      "Which evaluation criteria have HIGH weighting for 'Ability to Execute'?",
    options: [
      "Marketing Execution and Operations",
      "Customer Experience and Sales",
      "Product or Service AND Overall Viability",
      "Innovation and Market Understanding",
    ],
    correctIndex: 2,
  },
  {
    id: 47,
    session: 1,
    question:
      "Which evaluation criteria have HIGH weighting for 'Completeness of Vision'?",
    options: [
      "Sales Strategy and Business Model",
      "Geographic Strategy and Vertical Strategy",
      "Market Understanding AND Innovation",
      "Marketing Strategy and Sales Strategy",
    ],
    correctIndex: 2,
  },
  {
    id: 48,
    session: 1,
    question: "Enterprise LCAP Leaders demonstrate:",
    options: [
      "Only strong execution",
      "Only strong vision",
      "Both strong execution AND strong vision",
      "Neither strong execution nor strong vision",
    ],
    correctIndex: 2,
  },
  {
    id: 49,
    session: 1,
    question: "Enterprise LCAP Challengers are characterized by:",
    options: [
      "Strong vision but weak execution",
      "Strong execution but lack the vision of Leaders",
      "Both weak execution and weak vision",
      "Focus on a specific market area",
    ],
    correctIndex: 1,
  },
  {
    id: 50,
    session: 1,
    question: "Enterprise LCAP Visionaries are characterized by:",
    options: [
      "Strong execution and strong vision",
      "Strong execution but weak vision",
      "Good strategic vision but haven't demonstrated strong execution track record",
      "Focus on a regional geographic footprint",
    ],
    correctIndex: 2,
  },
  {
    id: 51,
    session: 1,
    question:
      "What is the minimum LCAP revenue for inclusion in the Gartner MQ (one of the size requirements)?",
    options: [
      "$10 million",
      "$25 million",
      "$60 million (with 100+ enterprise customers)",
      "$100 million",
    ],
    correctIndex: 2,
  },
  {
    id: 52,
    session: 1,
    question:
      "To qualify for the Gartner MQ, vendors must have direct customers in at least how many geographies?",
    options: ["2", "3", "5", "7"],
    correctIndex: 1,
  },
  {
    id: 53,
    session: 1,
    question:
      "Which vendor was dropped from the Magic Quadrant because the LCAP product must be publicly available?",
    options: ["Retool", "Newgen", "Zoho", "Creatio"],
    correctIndex: 1,
  },
  {
    id: 54,
    session: 1,
    question:
      "No vendors were added to the 2025 Magic Quadrant. Which vendor was DROPPED?",
    options: ["Retool", "Creatio", "Newgen", "Pegasystems"],
    correctIndex: 2,
  },
  {
    id: 55,
    session: 1,
    question: "ServiceNow's LCAP offering is called:",
    options: [
      "ServiceNow Creator",
      "ServiceNow Studio",
      "App Engine",
      "Now Platform Builder",
    ],
    correctIndex: 2,
  },
  {
    id: 56,
    session: 1,
    question:
      "Appian's LCAP platform includes which of these AI-related features?",
    options: [
      "Maia AI",
      "Einstein AI",
      "AI Copilot and Agent Studio",
      "Copilot Studio",
    ],
    correctIndex: 2,
  },
  {
    id: 57,
    session: 1,
    question:
      "Which vendor's LCAP is ONLY available as a vendor-managed cloud service (PaaS)?",
    options: ["OutSystems", "Microsoft", "Salesforce", "Appian"],
    correctIndex: 1,
  },
  {
    id: 58,
    session: 1,
    question: "Zoho's LCAP product is called:",
    options: ["Zoho Builder", "Zoho Apps", "Zoho Creator", "Zoho Platform"],
    correctIndex: 2,
  },
  {
    id: 59,
    session: 1,
    question: "How many paying customers does Zoho Creator have?",
    options: ["5,000+", "10,000+", "20,000+", "50,000+"],
    correctIndex: 2,
  },
  {
    id: 60,
    session: 1,
    question:
      "Salesforce's agentic AI feature for AI orchestration is called:",
    options: [
      "Einstein Bot",
      "Salesforce Copilot",
      "Agentforce",
      "Salesforce Agent Builder",
    ],
    correctIndex: 2,
  },
  {
    id: 61,
    session: 1,
    question: "Mendix's AI assistant is called:",
    options: ["Einstein", "Copilot", "Maia AI", "Agent Studio"],
    correctIndex: 2,
  },
  {
    id: 62,
    session: 1,
    question:
      "OutSystems' recent investment includes a NATS-based event bus for:",
    options: [
      "Database replication",
      "Event-driven and distributed applications",
      "User authentication",
      "File storage",
    ],
    correctIndex: 1,
  },
  {
    id: 63,
    session: 1,
    question:
      "Pegasystems' tool that uses GenAI to generate app components from requirement documents is called:",
    options: [
      "Pega Builder",
      "GenAI Blueprint",
      "Pega Copilot",
      "Pega Designer",
    ],
    correctIndex: 1,
  },
  {
    id: 64,
    session: 1,
    question: "Which vendor integrates with Slack, Tableau, and MuleSoft?",
    options: ["Microsoft", "Salesforce", "OutSystems", "Appian"],
    correctIndex: 1,
  },
  {
    id: 65,
    session: 1,
    question: "Retool primarily targets:",
    options: [
      "External customer-facing applications",
      "Internal app development",
      "Mobile-only applications",
      "Government applications",
    ],
    correctIndex: 1,
  },
  {
    id: 66,
    session: 1,
    question:
      "Which Gartner publication year is the Magic Quadrant report used in this course?",
    options: ["2023", "2024", "2025 (July 2025)", "2026"],
    correctIndex: 2,
  },
  {
    id: 67,
    session: 1,
    question:
      "Zoho is classified as which type of vendor in the Gartner MQ?",
    options: ["Leader", "Challenger", "Visionary", "Niche Player"],
    correctIndex: 1,
  },
  {
    id: 68,
    session: 1,
    question:
      "In Singapore, which organizations require new applications to be developed using LCAP?",
    options: [
      "Only banks",
      "Only telecommunications companies",
      "All government agencies",
      "Only large MNCs",
    ],
    correctIndex: 2,
  },
  {
    id: 69,
    session: 1,
    question: "Which Singapore telcos are mentioned as using LCAP?",
    options: [
      "StarHub and M1",
      "SingTel and StarHub",
      "SingTel and M1",
      "All three telcos",
    ],
    correctIndex: 1,
  },
  {
    id: 70,
    session: 1,
    question: "What internal app did SMU IT develop using OutSystems?",
    options: [
      "Student Registration System",
      "Purchase Order System",
      "Learning Management System",
      "Email System",
    ],
    correctIndex: 1,
  },
  {
    id: 71,
    session: 1,
    question:
      "What is the name of the SMU spin-off company founded by Prof Alan?",
    options: [
      "SMU Tech Solutions",
      "Narwhal Financial Systems (Narfin)",
      "FinTech Solutions Pte Ltd",
      "Digital Banking Co",
    ],
    correctIndex: 1,
  },
  {
    id: 72,
    session: 1,
    question: "Prof Alan's research specialization is anchored around:",
    options: [
      "Machine Learning",
      "SMU Teaching Bank (SMU tBank)",
      "Blockchain technology",
      "Cloud Computing",
    ],
    correctIndex: 1,
  },
  {
    id: 73,
    session: 1,
    question:
      "What percentage must students score to pass the OutSystems Certification Exam?",
    options: ["50%", "60%", "70%", "80%"],
    correctIndex: 2,
  },
  {
    id: 74,
    session: 1,
    question:
      "The OutSystems Certification Exam used in this course consists of:",
    options: [
      "20 MCQ in 1 hour",
      "50 MCQ in 2 hours",
      "100 MCQ in 3 hours",
      "30 MCQ in 1.5 hours",
    ],
    correctIndex: 1,
  },
  {
    id: 75,
    session: 1,
    question: "Which of these is NOT an LCAP attribute?",
    options: [
      "GUI designer studio with drag-and-drop",
      "One-click publish to cloud",
      "Requires manual server configuration",
      "Fully automated CI/CD",
    ],
    correctIndex: 2,
  },
  {
    id: 76,
    session: 1,
    question: "Who primarily adopts LCAPs?",
    options: [
      "Small startups",
      "Individual freelancers",
      "Large enterprises (Governments, Banks, Telcos)",
      "Open source communities",
    ],
    correctIndex: 2,
  },
  {
    id: 77,
    session: 1,
    question: "In Singapore, which organizations use OutSystems?",
    options: [
      "Only private companies",
      "Only banks",
      "Government agencies, banks, and SMU",
      "Only educational institutions",
    ],
    correctIndex: 2,
  },
  {
    id: 78,
    session: 1,
    question:
      "Where is LCAP positioned in Gartner's 2023 Impact Radar?",
    options: [
      "Data Analytics category",
      "Software Engineering category",
      "Cloud Infrastructure category",
      "Cybersecurity category",
    ],
    correctIndex: 1,
  },
  {
    id: 79,
    session: 1,
    question: "What are the four layers of OutSystems Designer Studio?",
    options: [
      "Data, Logic, Interface, Processes",
      "Frontend, Backend, Database, API",
      "View, Controller, Model, Service",
      "Input, Output, Storage, Compute",
    ],
    correctIndex: 0,
  },
  {
    id: 80,
    session: 1,
    question:
      "Which deployment options does the Interface Layer support?",
    options: [
      "Only desktop web apps",
      "Only mobile apps",
      "Reactive Web App and PWA Mobile app",
      "Only server-side rendered pages",
    ],
    correctIndex: 2,
  },
  {
    id: 81,
    session: 1,
    question: "What does the Processes Layer handle?",
    options: [
      "User authentication only",
      "Database backups",
      "Message subscription and processing (e.g., RabbitMQ)",
      "CSS styling",
    ],
    correctIndex: 2,
  },
  {
    id: 82,
    session: 1,
    question:
      "What is automatically created for REST APIs in OutSystems?",
    options: [
      "Postman collections",
      "Swagger documentation",
      "GraphQL schemas",
      "WSDL files",
    ],
    correctIndex: 1,
  },
  {
    id: 83,
    session: 1,
    question: "What are Forge components in OutSystems?",
    options: [
      "Database templates",
      "Downloadable plug-ins (OpenAI, Google Maps, Stripe, etc.)",
      "Testing frameworks",
      "CI/CD pipeline tools",
    ],
    correctIndex: 1,
  },
  {
    id: 84,
    session: 1,
    question:
      "Which software engineering principle means grouping related logic and data within service boundaries?",
    options: [
      "Separation of Concerns",
      "Reuse",
      "Encapsulation",
      "Polymorphism",
    ],
    correctIndex: 2,
  },
  {
    id: 85,
    session: 1,
    question: "What is SMULab Utilities?",
    options: [
      "A testing framework",
      "Useful wrapper services reusable in term projects",
      "A grading rubric",
      "A database management tool",
    ],
    correctIndex: 1,
  },
  {
    id: 86,
    session: 1,
    question: "Why is LCAP licensing a barrier for startups?",
    options: [
      "It requires Java expertise",
      "Very expensive enterprise licensing",
      "It only runs on Linux",
      "It needs dedicated hardware",
    ],
    correctIndex: 1,
  },

  // ── Session 2: Architecture Best Practices ───────────────────────

  {
    id: 87,
    session: 2,
    question: "A monolithic application is characterized by:",
    options: [
      "Multiple code bases with loose coupling",
      "A single code base implementing all functions",
      "Independent deployment of each module",
      "Use of multiple programming languages",
    ],
    correctIndex: 1,
  },
  {
    id: 88,
    session: 2,
    question:
      "In OutSystems, a monolithic approach is recommended for:",
    options: [
      "Large enterprise applications",
      "Applications with many services",
      "Small applications",
      "All applications",
    ],
    correctIndex: 2,
  },
  {
    id: 89,
    session: 2,
    question: "A service in SOA can be implemented in:",
    options: [
      "Only Java",
      "Only the same language as other services",
      "Any programming language",
      "Only compiled languages",
    ],
    correctIndex: 2,
  },
  {
    id: 90,
    session: 2,
    question: "Services in SOA are described as:",
    options: [
      "Tightly coupled",
      "Loosely coupled",
      "Monolithically bound",
      "Statically linked",
    ],
    correctIndex: 1,
  },
  {
    id: 91,
    session: 2,
    question:
      "In the monolithic approach, deploying a change to one function typically requires:",
    options: [
      "Deploying only that function",
      "Redeploying the entire application package",
      "Deploying a patch file",
      "No deployment needed",
    ],
    correctIndex: 1,
  },
  {
    id: 92,
    session: 2,
    question: "A monolithic application is typically developed in:",
    options: [
      "Multiple programming languages on multiple platforms",
      "One programming language on one platform",
      "Only Python",
      "Only cloud-native languages",
    ],
    correctIndex: 1,
  },
  {
    id: 93,
    session: 2,
    question:
      "Which approach is recommended for large enterprise applications in OutSystems?",
    options: [
      "Monolithic architecture",
      "Service-Oriented Architecture (SOA)",
      "Peer-to-peer architecture",
      "Client-server architecture",
    ],
    correctIndex: 1,
  },
  {
    id: 94,
    session: 2,
    question:
      "Which type of service is named as a NOUN (e.g., 'Book', 'Customer')?",
    options: [
      "Composite Service",
      "Atomic Service",
      "Wrapper Service",
      "UI Service",
    ],
    correctIndex: 1,
  },
  {
    id: 95,
    session: 2,
    question:
      "Which type of service is named as a VERB (e.g., 'PlaceOrder')?",
    options: [
      "Atomic Service",
      "Composite Service",
      "Wrapper Service",
      "UI Service",
    ],
    correctIndex: 1,
  },
  {
    id: 96,
    session: 2,
    question:
      "Which type of service has EXCLUSIVE ownership of data entities?",
    options: [
      "Composite Service",
      "Atomic Service",
      "Wrapper Service",
      "UI Module",
    ],
    correctIndex: 1,
  },
  {
    id: 97,
    session: 2,
    question: "Can a Composite Service own data?",
    options: [
      "Yes, it always owns data",
      "Yes, but only read-only data",
      "No, it does not own data",
      "Only if no Atomic Service exists",
    ],
    correctIndex: 2,
  },
  {
    id: 98,
    session: 2,
    question: "Can an Atomic Service invoke other services?",
    options: [
      "Yes, that's its main purpose",
      "Yes, but only Wrapper Services",
      "Never",
      "Only during initialization",
    ],
    correctIndex: 2,
  },
  {
    id: 99,
    session: 2,
    question: "A Composite Service's main purpose is to:",
    options: [
      "Own and manage data entities",
      "Wrap external systems",
      "Orchestrate other atomic/composite services",
      "Display user interfaces",
    ],
    correctIndex: 2,
  },
  {
    id: 100,
    session: 2,
    question:
      "Atomic Services and Composite Services can also be referred to as:",
    options: ["Endpoints", "Microservices", "Macroservices", "Modules"],
    correctIndex: 1,
  },
  {
    id: 101,
    session: 2,
    question:
      "Building services once and reusing them many times primarily saves:",
    options: [
      "Storage space",
      "Development cost",
      "Network bandwidth",
      "Database licenses",
    ],
    correctIndex: 1,
  },
  {
    id: 102,
    session: 2,
    question:
      "Assembling existing reusable services into new applications ensures:",
    options: [
      "Lower licensing costs",
      "Better security",
      "Time-to-market agility",
      "Fewer bugs",
    ],
    correctIndex: 2,
  },
  {
    id: 103,
    session: 2,
    question: "Service reuse in SOA requires which standards?",
    options: [
      "SOAP and WSDL",
      "REST and Swagger",
      "GraphQL and gRPC",
      "XML and XSLT",
    ],
    correctIndex: 1,
  },
  {
    id: 104,
    session: 2,
    question: "The Party atomic service can represent:",
    options: [
      "Only customers",
      "Only employees",
      "Only organizations",
      "Any Person OR any Organization",
    ],
    correctIndex: 3,
  },
  {
    id: 105,
    session: 2,
    question: "The Product atomic service hierarchy is:",
    options: [
      "Product Type > Product Class > Product Family",
      "Product Family > Product Class > Product Type",
      "Product Category > Product Line > Product Item",
      "Product Group > Product Set > Product Unit",
    ],
    correctIndex: 1,
  },
  {
    id: 106,
    session: 2,
    question:
      "How is data segregated in a multi-tenant deployment?",
    options: [
      "Separate databases per team",
      "Separate servers per team",
      "Unique Tenant ID",
      "Separate cloud regions",
    ],
    correctIndex: 2,
  },
  {
    id: 107,
    session: 2,
    question: "In OutSystems, what is an 'Application'?",
    options: [
      "A single module",
      "A group of Modules",
      "A database table",
      "A REST API endpoint",
    ],
    correctIndex: 1,
  },
  {
    id: 108,
    session: 2,
    question: "It is best practice in OutSystems to separate:",
    options: [
      "Data modules from Logic modules",
      "Client modules from Server modules",
      "Service modules from UI modules",
      "Test modules from Production modules",
    ],
    correctIndex: 2,
  },
  {
    id: 109,
    session: 2,
    question:
      "In OutSystems, which module should ONLY access the 'User' table directly?",
    options: [
      "Atomic Service module",
      "Composite Service module",
      "UI module",
      "Wrapper Service module",
    ],
    correctIndex: 2,
  },
  {
    id: 110,
    session: 2,
    question:
      "The 'Book' atomic service sets its database table's Public property to:",
    options: ["Yes", "No", "Read-Only", "Protected"],
    correctIndex: 1,
  },
  {
    id: 111,
    session: 2,
    question:
      "In OutSystems, the 'System' module owns and exposes which table that UI modules can access directly?",
    options: [
      "Party table",
      "Product table",
      "User table",
      "Config table",
    ],
    correctIndex: 2,
  },
  {
    id: 112,
    session: 2,
    question:
      "Why should reference data be loaded into browser memory during login?",
    options: [
      "To save server storage",
      "To avoid on-demand server reads that impact response time",
      "To comply with security requirements",
      "Because OutSystems requires it",
    ],
    correctIndex: 1,
  },
  {
    id: 113,
    session: 2,
    question:
      "Server-side data loaded into browser memory is stored as:",
    options: [
      "Cookies",
      "Local Storage",
      "Client Variables",
      "Session Variables",
    ],
    correctIndex: 2,
  },
  {
    id: 114,
    session: 2,
    question:
      "The 'loading server-side data into browser memory' pattern should happen:",
    options: [
      "On every page load",
      "When the user clicks a button",
      "During user login",
      "When the server restarts",
    ],
    correctIndex: 2,
  },
  {
    id: 115,
    session: 2,
    question:
      "User-specific data loaded into browser memory is then read:",
    options: [
      "From the server on each request",
      "Instantaneously from browser memory (no network transmission)",
      "From a local database",
      "From cached API responses",
    ],
    correctIndex: 1,
  },
  {
    id: 116,
    session: 2,
    question:
      "Server-side data should only be updated (written back) when:",
    options: [
      "Every page loads",
      "Data is created or updated",
      "The user logs out",
      "The session expires",
    ],
    correctIndex: 1,
  },
  {
    id: 117,
    session: 2,
    question:
      "In the SOA reuse example, what are Atomic Services described as?",
    options: [
      "Temporary modules",
      "Foundational building blocks that can be assembled into different solutions",
      "UI components",
      "Database triggers",
    ],
    correctIndex: 1,
  },
  {
    id: 118,
    session: 2,
    question:
      "How is the Party service deployed in SMU's environment?",
    options: [
      "Single-tenant per team",
      "Multi-tenant -- data segregated by team's unique Tenant ID",
      "Shared without segregation",
      "Each team gets a separate database",
    ],
    correctIndex: 1,
  },
  {
    id: 119,
    session: 2,
    question: "Who should own data in the SOA architecture?",
    options: [
      "Only Composite Services",
      "Only Atomic Services",
      "Only the UI module",
      "Any module can own data",
    ],
    correctIndex: 1,
  },
  {
    id: 120,
    session: 2,
    question: "Should the UI module access database tables directly?",
    options: [
      "Yes, for all data",
      "Only the User table; all other data via REST API calls",
      "Never access any table",
      "Only for read operations",
    ],
    correctIndex: 1,
  },

  // ── Session 3: Data Layer ────────────────────────────────────────

  {
    id: 121,
    session: 3,
    question:
      "What is the default database engine hosted on the OutSystems cloud?",
    options: ["MySQL", "PostgreSQL", "MSSQL", "Oracle DB"],
    correctIndex: 2,
  },
  {
    id: 122,
    session: 3,
    question:
      "Database Entities in OutSystems can be bootstrapped from:",
    options: [
      "A JSON file",
      "An imported Excel file",
      "A CSV file only",
      "A SQL script",
    ],
    correctIndex: 1,
  },
  {
    id: 123,
    session: 3,
    question:
      "When Entities are defined in OutSystems, which of the following is auto-created?",
    options: [
      "Only the database table",
      "Only ER diagrams",
      "Only CRUD methods",
      "ER diagrams, CRUD methods, AND data model",
    ],
    correctIndex: 3,
  },
  {
    id: 124,
    session: 3,
    question:
      "Developers in OutSystems need to manually install which database engine?",
    options: [
      "MySQL",
      "PostgreSQL",
      "None -- it is managed by OutSystems",
      "MSSQL Server",
    ],
    correctIndex: 2,
  },
  {
    id: 125,
    session: 3,
    question:
      "In an Entity diagram, the Primary Key is represented by:",
    options: [
      "A lock icon",
      "An Identifier symbol",
      "A star icon",
      "A key icon",
    ],
    correctIndex: 1,
  },
  {
    id: 126,
    session: 3,
    question: "Static Entities in OutSystems are:",
    options: [
      "Editable at runtime",
      "Read-Only",
      "Only visible to Client Actions",
      "Automatically generated from Excel",
    ],
    correctIndex: 1,
  },
  {
    id: 127,
    session: 3,
    question: "Static Entities are commonly used to implement:",
    options: [
      "User authentication",
      "Enumerations (fixed reference data values)",
      "Complex business logic",
      "REST API endpoints",
    ],
    correctIndex: 1,
  },
  {
    id: 128,
    session: 3,
    question: "For Static Entities, which methods are available?",
    options: [
      "Get, Create, Update, Delete",
      "Get, Create, Update",
      "Only Get",
      "Get and Update only",
    ],
    correctIndex: 2,
  },
  {
    id: 129,
    session: 3,
    question:
      "The lecture gives which example of Static Entity values?",
    options: [
      "Product categories",
      "Role types (e.g., Company, Customer, Employee)",
      "Country codes",
      "Currency symbols",
    ],
    correctIndex: 1,
  },
  {
    id: 130,
    session: 3,
    question:
      "In the term project, the Party Atomic Service is used to identify:",
    options: [
      "Only customers",
      "Only companies",
      "Different parties and their roles and relationships",
      "Only employees",
    ],
    correctIndex: 2,
  },
  {
    id: 131,
    session: 3,
    question:
      "In OutSystems, a Structure represents what in REST APIs?",
    options: [
      "An XML element",
      "A JSON Object",
      "A database table",
      "An HTML form",
    ],
    correctIndex: 1,
  },
  {
    id: 132,
    session: 3,
    question: "A List of Structures in OutSystems represents:",
    options: [
      "A JSON Object",
      "A JSON Array",
      "A database view",
      "An XML document",
    ],
    correctIndex: 1,
  },
  {
    id: 133,
    session: 3,
    question: "Structure Attributes in OutSystems are:",
    options: [
      "Case-insensitive",
      "Case-sensitive",
      "Always lowercase",
      "Always uppercase",
    ],
    correctIndex: 1,
  },
  {
    id: 134,
    session: 3,
    question: "A Structure is a:",
    options: [
      "System-defined data type",
      "Developer-defined data type",
      "Database constraint",
      "CSS class",
    ],
    correctIndex: 1,
  },
  {
    id: 135,
    session: 3,
    question:
      "The 'Name in JSON' config in Structure Attributes specifies:",
    options: [
      "The database column name",
      "How the API consumer should name their request parameters",
      "The display label in the UI",
      "The variable name in server code",
    ],
    correctIndex: 1,
  },
  {
    id: 136,
    session: 3,
    question: "Client Variables are stored in:",
    options: [
      "The server database",
      "The client-side browser memory",
      "A cookie file",
      "The OutSystems cloud",
    ],
    correctIndex: 1,
  },
  {
    id: 137,
    session: 3,
    question: "Client Variables are visible to:",
    options: [
      "Server Actions only",
      "Both Client and Server Actions",
      "Client Actions only",
      "Neither Client nor Server Actions",
    ],
    correctIndex: 2,
  },
  {
    id: 138,
    session: 3,
    question: "Client Variables can be of which data types?",
    options: [
      "Any data type including Structures",
      "Only Text",
      "Primitive data types only (Integer, Boolean, Text)",
      "Only Integer and Boolean",
    ],
    correctIndex: 2,
  },
  {
    id: 139,
    session: 3,
    question:
      "To store a Structure in a Client Variable, you must first:",
    options: [
      "Convert it to an Integer",
      "Serialize it (convert to Text/JSON)",
      "Store it in a database first",
      "Encrypt it",
    ],
    correctIndex: 1,
  },
  {
    id: 140,
    session: 3,
    question:
      "If a user stores shopping cart data as a Client Variable, what happens when they log in from a different machine?",
    options: [
      "The cart data follows them",
      "The cart data is synced from the cloud",
      "The cart data will NOT be available",
      "The cart is restored from a backup",
    ],
    correctIndex: 2,
  },
  {
    id: 141,
    session: 3,
    question: "Client Variables are NOT visible to:",
    options: [
      "Client Actions",
      "Server Actions",
      "UI widgets",
      "Event handlers",
    ],
    correctIndex: 1,
  },
  {
    id: 142,
    session: 3,
    question: "Site Properties are persisted at:",
    options: [
      "Client-side (browser)",
      "Server-side",
      "Both client and server",
      "Neither (temporary only)",
    ],
    correctIndex: 1,
  },
  {
    id: 143,
    session: 3,
    question: "Site Properties have:",
    options: [
      "Session scope",
      "User scope",
      "Application scope",
      "Module scope",
    ],
    correctIndex: 2,
  },
  {
    id: 144,
    session: 3,
    question: "Site Properties can be changed at run-time via:",
    options: [
      "Client Actions",
      "OutSystems Service Center",
      "Browser developer tools",
      "Excel import",
    ],
    correctIndex: 1,
  },
  {
    id: 145,
    session: 3,
    question: "Changing a Site Property at run-time requires:",
    options: [
      "No re-Publish of the application",
      "A full re-Publish",
      "A server restart",
      "Database migration",
    ],
    correctIndex: 0,
  },
  {
    id: 146,
    session: 3,
    question: "Site Properties are NOT visible to:",
    options: [
      "Server Actions",
      "Client Actions",
      "Database queries",
      "Other modules",
    ],
    correctIndex: 1,
  },
  {
    id: 147,
    session: 3,
    question: "Site Properties are used to set:",
    options: [
      "UI layout templates",
      "Global parameters",
      "Database schemas",
      "REST API endpoints",
    ],
    correctIndex: 1,
  },
  {
    id: 148,
    session: 3,
    question:
      "The Resources folder in OutSystems is used to import all of the following EXCEPT:",
    options: [
      "favicon.png",
      "Custom JavaScript/CSS",
      "Excel spreadsheets for bootstrapping",
      "REST API configurations",
    ],
    correctIndex: 3,
  },
  {
    id: 149,
    session: 3,
    question: "A favicon.png file is used for:",
    options: [
      "Application splash screen",
      "Application icon displayed in web and mobile browsers",
      "Background image",
      "Loading animation",
    ],
    correctIndex: 1,
  },
  {
    id: 150,
    session: 3,
    question:
      "After bootstrapping a database from Excel, the Excel file:",
    options: [
      "Must remain in Resources permanently",
      "Is automatically deleted",
      "Can be removed from Resources",
      "Must be updated every deployment",
    ],
    correctIndex: 2,
  },
  {
    id: 151,
    session: 3,
    question:
      "Which of the following correctly matches the OutSystems concept to its description?",
    options: [
      "Static Entity = developer-defined data type",
      "Structure = read-only reference data",
      "Client Variable = browser-stored session data",
      "Site Property = client-side global parameter",
    ],
    correctIndex: 2,
  },
  {
    id: 152,
    session: 3,
    question:
      "Which data storage mechanism is server-side with application scope?",
    options: [
      "Client Variable",
      "Site Property",
      "Structure",
      "Static Entity record",
    ],
    correctIndex: 1,
  },
  {
    id: 153,
    session: 3,
    question:
      "Which data type requires serialization to be stored in a Client Variable?",
    options: ["Integer", "Boolean", "Text", "Structure"],
    correctIndex: 3,
  },

  // ── Session 4: Logic Layer ───────────────────────────────────────

  {
    id: 154,
    session: 4,
    question:
      "Which layer of OutSystems Designer Studio handles business logic?",
    options: [
      "Data Layer",
      "Logic Layer",
      "Interface Layer",
      "Processes Layer",
    ],
    correctIndex: 1,
  },
  {
    id: 155,
    session: 4,
    question: "Server Actions in OutSystems emit code in which language?",
    options: ["Java", "Python", "C# .NET", "JavaScript"],
    correctIndex: 2,
  },
  {
    id: 156,
    session: 4,
    question:
      "Client Actions in OutSystems emit code in which framework?",
    options: ["Angular", "Vue.js", "React.JS", "jQuery"],
    correctIndex: 2,
  },
  {
    id: 157,
    session: 4,
    question: "Built-in Client-Side Logic Elements are used for:",
    options: [
      "Database operations only",
      "Browser-side logic execution",
      "Server configuration",
      "API documentation",
    ],
    correctIndex: 1,
  },
  {
    id: 158,
    session: 4,
    question: "Built-in Server-Side Logic Elements are used for:",
    options: [
      "Browser animations",
      "Server-side business logic execution",
      "CSS styling",
      "Client-side storage",
    ],
    correctIndex: 1,
  },
  {
    id: 159,
    session: 4,
    question:
      "Which statement about Client Actions vs Server Actions is correct?",
    options: [
      "Both emit the same code",
      "Client Actions emit C# .NET; Server Actions emit React.JS",
      "Server Actions emit C# .NET; Client Actions emit React.JS",
      "Neither emits any code",
    ],
    correctIndex: 2,
  },
  {
    id: 160,
    session: 4,
    question:
      "The 'For Each' element in OutSystems is used to:",
    options: [
      "Create conditional branches",
      "Iterate through a List",
      "Handle exceptions",
      "Define variables",
    ],
    correctIndex: 1,
  },
  {
    id: 161,
    session: 4,
    question: "A 'For Each' element must have:",
    options: [
      "2 outgoing Cycle paths",
      "Only return paths, no Cycle path",
      "1 outgoing Cycle path and 1 or more return paths",
      "Exactly 1 outgoing path only",
    ],
    correctIndex: 2,
  },
  {
    id: 162,
    session: 4,
    question:
      "The current value during a 'For Each' iteration is accessed via:",
    options: [
      "The List's first element",
      "The List's last element",
      "The List's Current attribute",
      "A separate counter variable",
    ],
    correctIndex: 2,
  },
  {
    id: 163,
    session: 4,
    question:
      "Which tool is used to inspect values during a For Each iteration?",
    options: [
      "Properties Panel",
      "Module Tree",
      "Debugger View",
      "Service Center",
    ],
    correctIndex: 2,
  },
  {
    id: 164,
    session: 4,
    question: "Built-in List actions are available for:",
    options: [
      "Only Server Actions",
      "Only Client Actions",
      "Both Client Actions and Server Actions",
      "Neither Client nor Server Actions",
    ],
    correctIndex: 2,
  },
  {
    id: 165,
    session: 4,
    question:
      "The set of built-in Client Actions for Lists and built-in Server Actions for Lists are:",
    options: [
      "Identical in functionality",
      "Separate sets with their own operations",
      "Only available in Server Actions",
      "Not available in OutSystems",
    ],
    correctIndex: 1,
  },
  {
    id: 166,
    session: 4,
    question: "List operations in OutSystems help developers:",
    options: [
      "Only sort data",
      "Manipulate, filter, and transform List data",
      "Only display data in tables",
      "Only delete records",
    ],
    correctIndex: 1,
  },
  {
    id: 167,
    session: 4,
    question:
      "Which of the following is a built-in function category available in OutSystems?",
    options: [
      "Machine Learning functions",
      "Math functions",
      "Blockchain functions",
      "Graphics functions",
    ],
    correctIndex: 1,
  },
  {
    id: 168,
    session: 4,
    question:
      "To make a Client Action visible as a User Function, you must:",
    options: [
      "Export it as a module",
      "Set the Function property to 'Yes'",
      "Add it to the Forge",
      "Create a wrapper Server Action",
    ],
    correctIndex: 1,
  },
  {
    id: 169,
    session: 4,
    question:
      "Built-in Functions and User Functions are visible via:",
    options: [
      "The Module Tree",
      "The Properties Panel",
      "The Expression Editor",
      "The Debugger View",
    ],
    correctIndex: 2,
  },
  {
    id: 170,
    session: 4,
    question:
      "Which of the following is NOT a built-in function category in OutSystems?",
    options: ["Math", "Text", "Date and Time", "Machine Learning"],
    correctIndex: 3,
  },
  {
    id: 171,
    session: 4,
    question: "Built-in Math Functions in OutSystems include:",
    options: [
      "Power(n, m) and Sqrt(n)",
      "Only basic arithmetic (+, -, x, /)",
      "Matrix operations",
      "Statistical analysis functions",
    ],
    correctIndex: 0,
  },
  {
    id: 172,
    session: 4,
    question:
      "User-Defined Functions in OutSystems are created by:",
    options: [
      "Writing custom C# code",
      "Writing custom JavaScript",
      "Converting a Client Action to a Function",
      "Importing an external library",
    ],
    correctIndex: 2,
  },
  {
    id: 173,
    session: 4,
    question:
      "The built-in Conversion functions in OutSystems support:",
    options: [
      "Only text-to-number conversion",
      "Data Conversion between different types",
      "Only date formatting",
      "Only currency conversion",
    ],
    correctIndex: 1,
  },
  {
    id: 174,
    session: 4,
    question:
      "Built-in functions for working with Text allow developers to:",
    options: [
      "Only concatenate strings",
      "Perform text manipulation operations",
      "Only count characters",
      "Only convert to uppercase",
    ],
    correctIndex: 1,
  },
  {
    id: 175,
    session: 4,
    question:
      "Complex business logic in OutSystems can be built using:",
    options: [
      "Only drag-and-drop UI widgets",
      "For Each, If, Switch, List, and Exception Handler elements",
      "Only SQL queries",
      "Only built-in functions",
    ],
    correctIndex: 1,
  },
  {
    id: 176,
    session: 4,
    question: "Which logic element allows branching based on conditions?",
    options: ["For Each", "If", "Assign", "Start"],
    correctIndex: 1,
  },
  {
    id: 177,
    session: 4,
    question:
      "Which logic element allows multi-way branching (multiple conditions)?",
    options: ["For Each", "If", "Switch", "Assign"],
    correctIndex: 2,
  },
  {
    id: 178,
    session: 4,
    question:
      "Exception Handlers in OutSystems logic are used for:",
    options: [
      "Styling UI elements",
      "Error handling and recovery",
      "Sorting Lists",
      "Creating database tables",
    ],
    correctIndex: 1,
  },
  {
    id: 179,
    session: 4,
    question: "The Expression Editor in OutSystems can use:",
    options: [
      "Only built-in functions",
      "Only user-defined functions",
      "Both built-in functions and user functions",
      "Only JavaScript expressions",
    ],
    correctIndex: 2,
  },
  {
    id: 180,
    session: 4,
    question:
      "Built-in Numeric functions are separate from Math functions and include:",
    options: [
      "Only rounding",
      "Number formatting and manipulation",
      "Only random number generation",
      "Only integer conversion",
    ],
    correctIndex: 1,
  },
  {
    id: 181,
    session: 4,
    question: "The Environment built-in functions provide access to:",
    options: [
      "Weather data",
      "Runtime environment information",
      "Hardware specifications",
      "Network diagnostics",
    ],
    correctIndex: 1,
  },
  {
    id: 182,
    session: 4,
    question:
      "The attributes of a List in a For Each include:",
    options: [
      "Only the List length",
      "Current value at the current iteration, plus Length and Empty",
      "Only the first and last elements",
      "Only the List name",
    ],
    correctIndex: 1,
  },
  {
    id: 183,
    session: 4,
    question:
      "What are the two types of built-in logic in OutSystems?",
    options: [
      "Frontend Actions and Backend Actions",
      "Client Actions and Server Actions",
      "Public Actions and Private Actions",
      "Sync Actions and Async Actions",
    ],
    correctIndex: 1,
  },
  {
    id: 184,
    session: 4,
    question:
      "What built-in function categories does OutSystems provide?",
    options: [
      "Only Math and Text",
      "Math, Numeric, Text, Date/Time, Conversion, Environment",
      "Only String manipulation",
      "Only data conversion",
    ],
    correctIndex: 1,
  },
  {
    id: 185,
    session: 4,
    question:
      "Which lab activity is associated with the Logic Layer session?",
    options: [
      "Exposing REST APIs",
      "Developing a Web Reactive User Interface",
      "Creating database entities",
      "Setting up the lab environment",
    ],
    correctIndex: 1,
  },

  // ── Session 5: Interface Layer ───────────────────────────────────

  {
    id: 186,
    session: 5,
    question:
      "A Reactive Web App in OutSystems implements which architecture?",
    options: [
      "Multi-Page Application (MPA)",
      "Single Page Application (SPA)",
      "Server-Side Rendering (SSR)",
      "Static Site Generation (SSG)",
    ],
    correctIndex: 1,
  },
  {
    id: 187,
    session: 5,
    question:
      "In a Reactive Web App, how are HTML, JavaScript, and CSS loaded?",
    options: [
      "Each page triggers a new server request",
      "All retrieved with a single page load; pages are never reloaded",
      "Only HTML is loaded initially; JS/CSS are lazy-loaded",
      "Each component is loaded separately via AJAX",
    ],
    correctIndex: 1,
  },
  {
    id: 188,
    session: 5,
    question:
      "Reactive Web Apps in OutSystems use which JavaScript framework?",
    options: ["Angular", "Vue.js", "ReactJS", "jQuery"],
    correctIndex: 2,
  },
  {
    id: 189,
    session: 5,
    question:
      "What does a Reactive Web App use to make asynchronous requests to the server?",
    options: [
      "Full page reloads",
      "WebSocket connections only",
      "ReactJS framework for async requests for XML or JSON data",
      "Server-Sent Events",
    ],
    correctIndex: 2,
  },
  {
    id: 190,
    session: 5,
    question:
      "Which of the following is possible in a Reactive Web App but NOT in Traditional Web?",
    options: [
      "Server Actions",
      "Client Actions and Client Variables",
      "Database queries",
      "REST API calls",
    ],
    correctIndex: 1,
  },
  {
    id: 191,
    session: 5,
    question:
      "A Traditional Web App loads a page from the server:",
    options: [
      "Only once on initial visit",
      "For every screen change",
      "Only when explicitly refreshed",
      "Only on login",
    ],
    correctIndex: 1,
  },
  {
    id: 192,
    session: 5,
    question:
      "Traditional Web Apps use which type of variables that Reactive Web Apps do not?",
    options: [
      "Client Variables",
      "Site Properties",
      "Session Variables",
      "Local Variables",
    ],
    correctIndex: 2,
  },
  {
    id: 193,
    session: 5,
    question:
      "A Phone App in OutSystems can be distributed in how many ways?",
    options: [
      "1 (PWA only)",
      "2 (Android and iOS)",
      "3 (Android APK, iOS IPA, and PWA)",
      "4 (Android, iOS, PWA, and Desktop)",
    ],
    correctIndex: 2,
  },
  {
    id: 194,
    session: 5,
    question:
      "Phone Apps in OutSystems have access to:",
    options: [
      "Only the browser APIs",
      "Only server-side resources",
      "Device hardware (e.g., phone camera)",
      "Only local storage",
    ],
    correctIndex: 2,
  },
  {
    id: 195,
    session: 5,
    question:
      "Which module-level setting defines the start screen of the application?",
    options: [
      "Splash Screen",
      "Default Theme",
      "Default Screen",
      "Default Transition",
    ],
    correctIndex: 2,
  },
  {
    id: 196,
    session: 5,
    question:
      "The 'Splash Screen' setting controls:",
    options: [
      "The home page layout",
      "The screen displayed as the application is loading",
      "The login screen appearance",
      "The error page",
    ],
    correctIndex: 1,
  },
  {
    id: 197,
    session: 5,
    question:
      "The 'Server Request Timeout' setting defines:",
    options: [
      "How long the database waits for a query",
      "Maximum time in seconds to wait for a server request before triggering a Communications Exception",
      "How long the login session lasts",
      "The API rate limit interval",
    ],
    correctIndex: 1,
  },
  {
    id: 198,
    session: 5,
    question:
      "Can the Server Request Timeout be overridden for individual actions?",
    options: [
      "No, it is always global",
      "Yes, for any Run Server Action or Aggregate",
      "Only for Aggregates",
      "Only for REST API calls",
    ],
    correctIndex: 1,
  },
  {
    id: 199,
    session: 5,
    question:
      "The 'Global Exception Handler' setting defines:",
    options: [
      "The database error handler",
      "The OnException handler used by all flows of the application",
      "The API error response format",
      "The logging configuration",
    ],
    correctIndex: 1,
  },
  {
    id: 200,
    session: 5,
    question:
      "Which module-level setting specifies where to install an externally prepared customized UI Theme?",
    options: [
      "Default Screen",
      "Default Theme",
      "Icon",
      "Default Transition",
    ],
    correctIndex: 1,
  },
  {
    id: 201,
    session: 5,
    question:
      "Which module-level setting controls the transition effect when navigating screens?",
    options: [
      "Splash Screen",
      "Global Exception Handler",
      "Default Transition",
      "Server Request Timeout",
    ],
    correctIndex: 2,
  },
  {
    id: 202,
    session: 5,
    question:
      "New applications in OutSystems are configured with:",
    options: [
      "No theme",
      "A custom theme you must create first",
      "The Default Theme",
      "A purchased theme from the Forge",
    ],
    correctIndex: 2,
  },
  {
    id: 203,
    session: 5,
    question:
      "After editing a Theme, you can make it available to other applications by:",
    options: [
      "Exporting it as a file",
      "Making the new Theme public",
      "Emailing it to other developers",
      "Publishing it to the Forge",
    ],
    correctIndex: 1,
  },
  {
    id: 204,
    session: 5,
    question:
      "Which of these is auto-created for each application?",
    options: [
      "Database backup schedule",
      "REST API documentation",
      "OnException Action, InvalidPermissions Screen, Login Screen, RedirectToURL, Web Blocks",
      "CI/CD pipeline configuration",
    ],
    correctIndex: 2,
  },
  {
    id: 205,
    session: 5,
    question:
      "The 'InvalidPermissions Screen' is used when:",
    options: [
      "The database connection fails",
      "Users are redirected here when they have invalid permissions",
      "The application fails to deploy",
      "An API returns a 403 error",
    ],
    correctIndex: 1,
  },
  {
    id: 206,
    session: 5,
    question:
      "'RedirectToURL' can redirect the user to:",
    options: [
      "Only internal Screens",
      "Only external websites",
      "An internal Screen (e.g., 'Home') or any external website (e.g., https://www.cnn.com/)",
      "Only screens within the same module",
    ],
    correctIndex: 2,
  },
  {
    id: 207,
    session: 5,
    question:
      "Web Blocks in OutSystems are:",
    options: [
      "Database table definitions",
      "Built-in reusable screen elements that can be made public to every Screen",
      "API endpoint configurations",
      "Server-side caching blocks",
    ],
    correctIndex: 1,
  },
  {
    id: 208,
    session: 5,
    question:
      "Which two screen Layouts are most commonly used in OutSystems?",
    options: [
      "LayoutGrid and LayoutFlex",
      "LayoutTopMenu and LayoutSideMenu",
      "LayoutDashboard and LayoutForm",
      "LayoutBlank and LayoutFull",
    ],
    correctIndex: 1,
  },
  {
    id: 209,
    session: 5,
    question:
      "The Widget Styles Editor allows you to change all of the following EXCEPT:",
    options: [
      "Font style, size, and color",
      "Layout width, height, alignment, margin, and padding",
      "Database query parameters",
      "Borders line width, color, and corner roundness",
    ],
    correctIndex: 2,
  },
  {
    id: 210,
    session: 5,
    question:
      "Which tool is very useful for navigating through the layers of screen widgets?",
    options: [
      "The Module Tree",
      "The Debugger View",
      "The Widget Styles Editor toolbar",
      "The Service Center",
    ],
    correctIndex: 2,
  },
  {
    id: 211,
    session: 5,
    question:
      "A 'Form Accelerator' in OutSystems is used to:",
    options: [
      "Speed up database queries",
      "Auto-generate a form by dragging it into the MainContent placeholder",
      "Optimize API response times",
      "Accelerate the build process",
    ],
    correctIndex: 1,
  },
  {
    id: 212,
    session: 5,
    question:
      "Forms generated by the Form Accelerator are based on:",
    options: [
      "A manually defined template",
      "The entity structure",
      "An imported Excel file",
      "A JSON schema",
    ],
    correctIndex: 1,
  },
  {
    id: 213,
    session: 5,
    question:
      "Which of the following is a Screen Widget event handler in OutSystems?",
    options: [
      "OnLoad",
      "OnClick",
      "OnRender",
      "OnInit",
    ],
    correctIndex: 1,
  },
  {
    id: 214,
    session: 5,
    question:
      "Which of these is NOT a Screen Widget event handler in OutSystems?",
    options: [
      "OnClick",
      "OnFocus",
      "OnCompile",
      "OnKeyDown",
    ],
    correctIndex: 2,
  },
  {
    id: 215,
    session: 5,
    question:
      "The Widget Styles Editor can add 'Style Classes' from:",
    options: [
      "An external CSS framework",
      "The CSS library",
      "A JavaScript plugin",
      "The Forge marketplace",
    ],
    correctIndex: 1,
  },
  {
    id: 216,
    session: 5,
    question:
      "In a Reactive Web App, JavaScript is used to:",
    options: [
      "Reload the entire page",
      "Dynamically change the page content without reloading",
      "Compile the server-side code",
      "Manage database connections",
    ],
    correctIndex: 1,
  },
  {
    id: 217,
    session: 5,
    question:
      "The 'Is User Provider' module setting is set to 'Yes' when:",
    options: [
      "The module consumes REST APIs",
      "The module provides user records",
      "The module has a login screen",
      "The module connects to an external database",
    ],
    correctIndex: 1,
  },
  {
    id: 218,
    session: 5,
    question:
      "The 'DBMS' module setting defines:",
    options: [
      "Which cloud provider to use",
      "Which DBMS standards are used when evaluating SQL statements",
      "The database backup schedule",
      "The data encryption method",
    ],
    correctIndex: 1,
  },
  {
    id: 219,
    session: 5,
    question:
      "What is the typical Default Screen for an OutSystems application?",
    options: [
      "The Login screen",
      "The Settings screen",
      "The Home screen",
      "The Splash screen",
    ],
    correctIndex: 2,
  },
  {
    id: 220,
    session: 5,
    question:
      "Screen Widgets in OutSystems include all of the following EXCEPT:",
    options: [
      "Dropdowns and Buttons",
      "Checkboxes and Radio Buttons",
      "Database Aggregates",
      "Tables and Inputs",
    ],
    correctIndex: 2,
  },
  {
    id: 221,
    session: 5,
    question:
      "Which of the following best describes the difference between Reactive Web and Phone App?",
    options: [
      "Reactive Web is mobile-only; Phone App is desktop-only",
      "Both are SPAs, but Phone App can access device hardware and be distributed as APK/IPA/PWA",
      "Phone App uses a different programming language",
      "Reactive Web cannot use Client Actions",
    ],
    correctIndex: 1,
  },
  {
    id: 222,
    session: 5,
    question:
      "The OnException Action that is auto-created for each application:",
    options: [
      "Only handles database errors",
      "Only handles API errors",
      "Handles all downstream exceptions thrown in the application",
      "Only handles client-side JavaScript errors",
    ],
    correctIndex: 2,
  },
  {
    id: 223,
    session: 5,
    question:
      "Which common element provides basic user authentication out of the box?",
    options: [
      "InvalidPermissions Screen",
      "Login Screen",
      "RedirectToURL",
      "Web Blocks",
    ],
    correctIndex: 1,
  },
  {
    id: 224,
    session: 5,
    question:
      "The Login Screen that is auto-created is typically:",
    options: [
      "Left as-is for production",
      "Deleted and replaced entirely",
      "Enhanced by the developer",
      "Hidden from users",
    ],
    correctIndex: 2,
  },
  {
    id: 225,
    session: 5,
    question:
      "Which UI template type is considered 'Legacy' in OutSystems?",
    options: [
      "Reactive Web App",
      "Phone App",
      "Traditional Web",
      "Progressive Web App",
    ],
    correctIndex: 2,
  },

  // ── Session 6: Processes Layer ──────────────────────────────

  {
    id: 226,
    session: 6,
    question:
      "What is the key difference between Processes and Timers in OutSystems?",
    options: [
      "Processes run on a schedule; Timers respond to events",
      "Processes handle multi-step workflows with human interaction; Timers handle scheduled batch jobs",
      "Timers support more concurrent threads than Processes",
      "There is no difference — they are interchangeable",
    ],
    correctIndex: 1,
  },
  {
    id: 227,
    session: 6,
    question:
      "How many concurrent threads do Processes support in OutSystems?",
    options: [
      "3",
      "10",
      "20",
      "Unlimited",
    ],
    correctIndex: 2,
  },
  {
    id: 228,
    session: 6,
    question:
      "How many concurrent threads do Timers support in OutSystems?",
    options: [
      "1",
      "3",
      "10",
      "20",
    ],
    correctIndex: 1,
  },
  {
    id: 229,
    session: 6,
    question:
      "Which Process flow element executes server-side logic without human intervention?",
    options: [
      "Human Activity",
      "Decision",
      "Automatic Activity",
      "Wait",
    ],
    correctIndex: 2,
  },
  {
    id: 230,
    session: 6,
    question:
      "Which Process flow element pauses the process and waits for a user to complete a task?",
    options: [
      "Automatic Activity",
      "Human Activity",
      "Wait",
      "Conditional Start",
    ],
    correctIndex: 1,
  },
  {
    id: 231,
    session: 6,
    question:
      "What does the Wait element do in a Process flow?",
    options: [
      "Terminates the process",
      "Launches a sub-process",
      "Pauses the process until a timeout or database event occurs",
      "Executes a server action automatically",
    ],
    correctIndex: 2,
  },
  {
    id: 232,
    session: 6,
    question:
      "What does the Execute Process element do?",
    options: [
      "Ends the current process",
      "Launches a sub-process (child process) from within the current process",
      "Starts a Timer",
      "Branches the flow conditionally",
    ],
    correctIndex: 1,
  },
  {
    id: 233,
    session: 6,
    question:
      "What is a Conditional Start in a Process flow?",
    options: [
      "A decision element that branches the flow",
      "An alternative entry point triggered by a database event instead of an explicit launch",
      "A Start element with a boolean condition",
      "A Timer that starts based on a condition",
    ],
    correctIndex: 1,
  },
  {
    id: 234,
    session: 6,
    question:
      "In the Sequential Activities pattern, how do activities execute?",
    options: [
      "All at the same time",
      "One after another in a linear chain",
      "Based on conditional branching",
      "In random order determined by the Scheduler Service",
    ],
    correctIndex: 1,
  },
  {
    id: 235,
    session: 6,
    question:
      "How do you synchronize (join) parallel activities back into a single path in OutSystems?",
    options: [
      "Use a Decision element",
      "Use a Wait element with a timeout",
      "Wrap parallel activities in a sub-process using Execute Process",
      "Add a Conditional Start to each parallel path",
    ],
    correctIndex: 2,
  },
  {
    id: 236,
    session: 6,
    question:
      "Is OutSystems BPMN compliant?",
    options: [
      "Yes, fully compliant",
      "Yes, partially compliant",
      "No, but it provides a mapping table for BPMN practitioners",
      "No, and there is no mapping available",
    ],
    correctIndex: 2,
  },
  {
    id: 237,
    session: 6,
    question:
      "Which of these BPM tools is also NOT BPMN compliant?",
    options: [
      "Camunda",
      "Pega",
      "Bizagi",
      "Bonita",
    ],
    correctIndex: 1,
  },
  {
    id: 238,
    session: 6,
    question:
      "Which tool is an example of a BPMN-compliant BPM tool?",
    options: [
      "OutSystems",
      "Pega",
      "Camunda",
      "Salesforce",
    ],
    correctIndex: 2,
  },
  {
    id: 239,
    session: 6,
    question:
      "In the auto-grader example, why is a Process used instead of a synchronous call?",
    options: [
      "Processes are faster than synchronous calls",
      "Synchronous grading would cause a frontend timeout due to long execution time",
      "Processes can access the database but Server Actions cannot",
      "Timers cannot be used for grading",
    ],
    correctIndex: 1,
  },
  {
    id: 240,
    session: 6,
    question:
      "In the auto-grader Process, what is the only process element used?",
    options: [
      "Human Activity",
      "Decision",
      "Automatic Activity",
      "Wait",
    ],
    correctIndex: 2,
  },
  {
    id: 241,
    session: 6,
    question:
      "What does the auto-grader frontend do after launching the Process?",
    options: [
      "Waits for the Process to finish before showing any UI",
      "Checks progress every 500ms and displays it on a progress bar",
      "Redirects to a different screen",
      "Sends an email when grading is complete",
    ],
    correctIndex: 1,
  },
  {
    id: 242,
    session: 6,
    question:
      "Which OutSystems service manages Timer execution?",
    options: [
      "Process Engine",
      "Deployment Controller",
      "Scheduler Service",
      "Timer Manager",
    ],
    correctIndex: 2,
  },
  {
    id: 243,
    session: 6,
    question:
      "In the Timer Lab's RabbitMQ architecture, what role does the Exchange play?",
    options: [
      "It consumes messages from the Queue",
      "It receives messages from Publishers and routes them to bound Queues",
      "It stores messages permanently",
      "It sends emails directly to recipients",
    ],
    correctIndex: 1,
  },
  {
    id: 244,
    session: 6,
    question:
      "In the Timer Lab, what does the Subscriber Timer do after consuming a message from the Queue?",
    options: [
      "Publishes it to another Exchange",
      "Sends the email and logs the event in a database",
      "Deletes the Queue",
      "Starts a new Process",
    ],
    correctIndex: 1,
  },
  {
    id: 245,
    session: 6,
    question:
      "Where is a Timer created in OutSystems Service Studio?",
    options: [
      "Data > Entities",
      "Interface > Screens",
      "Logic > Timers",
      "Processes > Timers",
    ],
    correctIndex: 2,
  },
  {
    id: 246,
    session: 6,
    question:
      "What are Site Properties used for in the Timer Lab?",
    options: [
      "Storing user session data",
      "Configuring RabbitMQ connection details (Exchange, Queue, Host, Username, Password)",
      "Defining screen layouts",
      "Setting up database indexes",
    ],
    correctIndex: 1,
  },
  {
    id: 247,
    session: 6,
    question:
      "What does 'multi-tenant' mean for the Party atomic service?",
    options: [
      "Each tenant has a separate database",
      "Data is co-mingled in the same table, segregated by a unique Tenant ID",
      "Only one tenant can use the service at a time",
      "Tenants share the same data without segregation",
    ],
    correctIndex: 1,
  },
  {
    id: 248,
    session: 6,
    question:
      "What header is used for authentication when calling the Party service API?",
    options: [
      "Authorization: Bearer",
      "X-API-Key",
      "X-Contacts-Key",
      "Content-Type",
    ],
    correctIndex: 2,
  },
  {
    id: 249,
    session: 6,
    question:
      "What identifier is returned when creating a Person in the Party service?",
    options: [
      "UserId",
      "PersonId",
      "PartyId",
      "TenantId",
    ],
    correctIndex: 2,
  },
  {
    id: 250,
    session: 6,
    question:
      "What file format is used to backup OutSystems projects?",
    options: [
      "ZIP",
      "OAP (OutSystems Application Pack)",
      "WAR",
      "JSON",
    ],
    correctIndex: 1,
  },
  {
    id: 251,
    session: 6,
    question:
      "Why should you download an OAP file after each coding session?",
    options: [
      "To share code with teammates",
      "To deploy to production",
      "Personal environments may be cleaned up after weeks of inactivity",
      "OAP files are required for 1-Click Publish",
    ],
    correctIndex: 2,
  },
  {
    id: 252,
    session: 6,
    question:
      "How do you restore an OutSystems project from an OAP file?",
    options: [
      "Import via Service Center",
      "From the home page: Environment > Open Files, select OAP, then install",
      "Upload to Forge and install from there",
      "Use the Debugger to load the OAP",
    ],
    correctIndex: 1,
  },
  {
    id: 253,
    session: 6,
    question:
      "Which process design pattern is used for SLA enforcement or sending reminders?",
    options: [
      "Sequential Activities",
      "Parallel Activities",
      "Wait with Timeout",
      "Conditional Start",
    ],
    correctIndex: 2,
  },
  {
    id: 254,
    session: 6,
    question:
      "What triggers a Wait with Database Event to resume?",
    options: [
      "A Timer fires",
      "A specific record is created or updated in the database",
      "A user clicks a button",
      "The Scheduler Service restarts",
    ],
    correctIndex: 1,
  },
  {
    id: 255,
    session: 6,
    question:
      "In the Pub-Sub pattern, what is the Publisher responsible for?",
    options: [
      "Consuming messages from the Queue",
      "Sending messages to the Exchange",
      "Binding the Queue to the Exchange",
      "Logging events in the database",
    ],
    correctIndex: 1,
  },

  // ── Session 6: Processes Layer (additional) ──────────────────

  {
    id: 256,
    session: 6,
    question:
      "Which of these is NOT a valid use case for a Process (rather than a Timer)?",
    options: [
      "An approval workflow requiring a manager to approve or reject",
      "Order fulfillment with multiple conditional steps",
      "Sending a daily batch of summary emails at 2am",
      "Customer onboarding with human and automatic steps",
    ],
    correctIndex: 2,
  },
  {
    id: 257,
    session: 6,
    question:
      "Which Process flow element would you use to branch the flow based on a loan-approval rule?",
    options: [
      "Wait",
      "Decision",
      "Automatic Activity",
      "End",
    ],
    correctIndex: 1,
  },
  {
    id: 258,
    session: 6,
    question:
      "In the parallel-activities synchronization pattern, when does the parent process resume?",
    options: [
      "As soon as the first parallel activity finishes",
      "Only when ALL parallel activities in the sub-process finish",
      "After a fixed timeout regardless of completion",
      "When the user manually resumes it",
    ],
    correctIndex: 1,
  },
  {
    id: 259,
    session: 6,
    question:
      "A Timer's logic is contained in which type of element?",
    options: [
      "A Client Action",
      "A Screen Action",
      "A Server Action",
      "A Human Activity",
    ],
    correctIndex: 2,
  },
  {
    id: 260,
    session: 6,
    question:
      "What is the primary benefit of running the auto-grader as a Process?",
    options: [
      "It grades faster than a synchronous call",
      "It runs asynchronously so the frontend is not blocked during long execution",
      "It avoids using the database",
      "It guarantees the grade is always correct",
    ],
    correctIndex: 1,
  },
  {
    id: 261,
    session: 6,
    question:
      "In a multi-tenant Party service, how is one tenant's data kept separate from another's?",
    options: [
      "Each tenant has a completely separate database server",
      "Data is co-mingled in the same tables and segregated by a unique Tenant ID",
      "Tenants take turns accessing the service one at a time",
      "Data is encrypted with a different algorithm per tenant",
    ],
    correctIndex: 1,
  },
  {
    id: 262,
    session: 6,
    question:
      "Which RabbitMQ component does a Subscriber bind its Queue to in order to receive messages?",
    options: [
      "Another Queue",
      "The Exchange",
      "The Publisher directly",
      "The Scheduler Service",
    ],
    correctIndex: 1,
  },
  {
    id: 263,
    session: 6,
    question:
      "Why might a Timer use a polling pattern against a RabbitMQ Queue?",
    options: [
      "To publish new messages to the Exchange",
      "To periodically check the Queue for new messages to consume",
      "To delete old messages automatically",
      "To create new Queues on demand",
    ],
    correctIndex: 1,
  },
  {
    id: 264,
    session: 6,
    question:
      "How many concurrent threads do Timers support compared to Processes?",
    options: [
      "Timers: 20, Processes: 3",
      "Timers: 3, Processes: 20",
      "Both support 10",
      "Both are unlimited",
    ],
    correctIndex: 1,
  },
  {
    id: 265,
    session: 6,
    question:
      "What is the recommended best practice to protect your work in a free OutSystems personal environment?",
    options: [
      "Commit your code to GitHub after each session",
      "Download an OAP file after each coding session",
      "Email yourself a screenshot of your work",
      "Keep the browser tab open at all times",
    ],
    correctIndex: 1,
  },

  // ── Session 8: Exploring Forge ──────────────────────────────

  {
    id: 266,
    session: 8,
    question:
      "What is Forge in the OutSystems ecosystem?",
    options: [
      "A database engine",
      "A marketplace of reusable components, plugins, and connectors",
      "A deployment pipeline tool",
      "A version control system",
    ],
    correctIndex: 1,
  },
  {
    id: 267,
    session: 8,
    question:
      "Which of these is NOT a Forge component?",
    options: [
      "Google Maps connector",
      "Stripe payments",
      "Microsoft Teams",
      "Speech Recognition plugin",
    ],
    correctIndex: 2,
  },
  {
    id: 268,
    session: 8,
    question:
      "What does installing a Forge component add to your application?",
    options: [
      "A new database table only",
      "A dependency module you can consume in your own apps",
      "A separate environment",
      "A new user account",
    ],
    correctIndex: 1,
  },
  {
    id: 269,
    session: 8,
    question:
      "Which Trust / support level indicates the most reliable Forge component?",
    options: [
      "Not Supported",
      "Trial",
      "Supported",
      "Experimental",
    ],
    correctIndex: 2,
  },
  {
    id: 270,
    session: 8,
    question:
      "In Lab 7, how many Forge components does a typical team explore?",
    options: [
      "Exactly 1 for the whole team",
      "5 or 6 — one per team member",
      "At least 20",
      "One per week of the term",
    ],
    correctIndex: 1,
  },
  {
    id: 271,
    session: 8,
    question:
      "What often ships alongside a Forge component to show how to use it?",
    options: [
      "A YouTube channel",
      "A Demo app",
      "A printed manual",
      "A certification exam",
    ],
    correctIndex: 1,
  },
  {
    id: 272,
    session: 8,
    question:
      "In the Lab 7 writeup, which section is the most valuable for your team project?",
    options: [
      "The component's icon",
      "The number of downloads",
      "How it could be used in your term project",
      "The author's name",
    ],
    correctIndex: 2,
  },
  {
    id: 273,
    session: 8,
    question:
      "When evaluating a Forge component, which factor signals active maintenance?",
    options: [
      "The length of its description",
      "A recent last-updated date and high download count",
      "The number of colors in its icon",
      "Whether it has a one-word name",
    ],
    correctIndex: 1,
  },
  {
    id: 274,
    session: 8,
    question:
      "What should you check before consuming a Forge component in your stack?",
    options: [
      "That it is written in Python",
      "Compatibility with your environment (O11 vs ODC) and platform (Reactive Web vs Mobile)",
      "That it has exactly 5 stars",
      "That it was published this week",
    ],
    correctIndex: 1,
  },
  {
    id: 275,
    session: 8,
    question:
      "Why is choosing a 'Not Supported' Forge component risky for a term project?",
    options: [
      "It costs money to install",
      "It can become technical debt — it may be abandoned or stop working",
      "It cannot be installed at all",
      "It deletes your other modules",
    ],
    correctIndex: 1,
  },
  {
    id: 276,
    session: 8,
    question:
      "After installing a Forge component, where do you explore its public Actions and Web Blocks?",
    options: [
      "In the browser developer tools",
      "In Service Studio, by opening the installed module",
      "In the Forge marketplace listing",
      "In the OutSystems forum",
    ],
    correctIndex: 1,
  },
  {
    id: 277,
    session: 8,
    question:
      "A Forge component requiring an external API key most likely means:",
    options: [
      "It is broken and should not be used",
      "It integrates with a third-party service that needs authentication",
      "It is free of any cost",
      "It only works offline",
    ],
    correctIndex: 1,
  },

  // ── Session 10: Advanced Topics (Multitenancy & Concurrency) ──

  {
    id: 278,
    session: 10,
    question: "What is multitenancy?",
    options: [
      "Running multiple OutSystems environments (Dev/Test/Prod)",
      "The mechanism by which SaaS applications serve multiple clients while isolating each one's data",
      "Hosting an app on multiple servers for load balancing",
      "Allowing multiple developers to edit a module at once",
    ],
    correctIndex: 1,
  },
  {
    id: 279,
    session: 10,
    question: "What does 'white labeling' mean for a SaaS application?",
    options: [
      "Removing all branding so the app is generic",
      "A company rebrands and sells a generic SaaS app as its own (own name, logo, theme)",
      "Labeling data as confidential",
      "Marking a module as Multitenant-ready",
    ],
    correctIndex: 1,
  },
  {
    id: 280,
    session: 10,
    question: "Which of these is NOT given as an example of a multitenant SaaS application?",
    options: [
      "Hotel Booking",
      "CRM",
      "Operating System",
      "Online Shopping",
    ],
    correctIndex: 2,
  },
  {
    id: 281,
    session: 10,
    question: "At the module level, setting IsMultitenant = Yes does what?",
    options: [
      "Speeds up the module's queries",
      "Isolates data, end-users, and processes per tenant, and marks the module Multitenant-ready",
      "Makes the module public to all other modules",
      "Disables the module's timers",
    ],
    correctIndex: 1,
  },
  {
    id: 282,
    session: 10,
    question: "Which element types inherit a module's IsMultitenant setting (unless overridden to Single Tenant)?",
    options: [
      "Screens, Blocks, and Themes",
      "Entities, Site Properties, and Timers",
      "Client Actions and Client Variables",
      "REST APIs and SOAP services",
    ],
    correctIndex: 1,
  },
  {
    id: 283,
    session: 10,
    question: "What happens to the session when you switch tenant context (Tenant_SwitchContext)?",
    options: [
      "Nothing — the session is preserved",
      "The session is cleared (an implicit logout) before changing the tenant",
      "The session is duplicated for both tenants",
      "The user is prompted to confirm",
    ],
    correctIndex: 1,
  },
  {
    id: 284,
    session: 10,
    question: "Registering for an SMULab API Key has what effect related to multitenancy?",
    options: [
      "It deletes your old tenant",
      "It creates a new Tenant for your team",
      "It makes the Party service single-tenant",
      "It has no relation to tenants",
    ],
    correctIndex: 1,
  },
  {
    id: 285,
    session: 10,
    question: "What is 'concurrency' in the OutSystems context?",
    options: [
      "Running two apps side by side",
      "When the same action or DB update is invoked at the exact same time by multiple users/processes/threads",
      "Scheduling timers to run sequentially",
      "Two developers publishing at once",
    ],
    correctIndex: 1,
  },
  {
    id: 286,
    session: 10,
    question: "How many concurrency methods does OutSystems offer?",
    options: [
      "Two",
      "Three",
      "Four (No, Optimistic, Versioned, Pessimistic)",
      "Five",
    ],
    correctIndex: 2,
  },
  {
    id: 287,
    session: 10,
    question: "What is the default concurrency behavior in OutSystems?",
    options: [
      "Optimistic Concurrency",
      "No Concurrency — last writer wins, silently overwriting the other change",
      "Pessimistic Concurrency",
      "Versioned Concurrency",
    ],
    correctIndex: 1,
  },
  {
    id: 288,
    session: 10,
    question: "Under No Concurrency, what happens when two users edit the same record and both save?",
    options: [
      "The second save is rejected with an error",
      "The last person to save overwrites the other's change (lost update)",
      "Both changes are merged automatically",
      "The record is locked until one user logs out",
    ],
    correctIndex: 1,
  },
  {
    id: 289,
    session: 10,
    question: "How does Optimistic Concurrency detect a conflict?",
    options: [
      "It locks the record permanently on fetch",
      "At save time it compares the latest DB state with the originally-fetched values and only writes if identical",
      "It increments a version number on every save",
      "It serializes all transactions",
    ],
    correctIndex: 1,
  },
  {
    id: 290,
    session: 10,
    question: "In Optimistic Concurrency, what is used at save time to lock and re-fetch the record's latest state?",
    options: [
      "A Site Property",
      "A Get…ForUpdate action",
      "A Timer",
      "A Client Variable",
    ],
    correctIndex: 1,
  },
  {
    id: 291,
    session: 10,
    question: "How does Versioned Concurrency detect that a record changed?",
    options: [
      "It compares every attribute one by one",
      "Each save increments a version field (Integer/Guid); a changed version on save signals a conflict",
      "It locks the record on fetch",
      "It checks the record's CreatedAt timestamp",
    ],
    correctIndex: 1,
  },
  {
    id: 292,
    session: 10,
    question: "In the blog example, why is the User entity's External_Id field used to hold the version number?",
    options: [
      "Because External_Id is faster to read",
      "Because User is a system entity where you cannot add your own attributes",
      "Because External_Id is encrypted",
      "Because it is the primary key",
    ],
    correctIndex: 1,
  },
  {
    id: 293,
    session: 10,
    question: "What is the core idea of Pessimistic Concurrency?",
    options: [
      "Assume conflicts are rare and check only at save",
      "Lock the resource up front so only one transaction runs at a time; others wait",
      "Increment a version number per save",
      "Let the last writer win",
    ],
    correctIndex: 1,
  },
  {
    id: 294,
    session: 10,
    question: "Why does Get…ForUpdate NOT solve the gapless invoice-numbering problem?",
    options: [
      "Because invoices are read-only",
      "Because new records are being created — there is no existing record to lock",
      "Because invoices use a Static Entity",
      "Because Get…ForUpdate only works on the User entity",
    ],
    correctIndex: 1,
  },
  {
    id: 295,
    session: 10,
    question: "What does a Generic Locking Mechanism do?",
    options: [
      "Encrypts the database",
      "Forces parallel transactions into serial processing — one at a time, others wait their turn",
      "Speeds up concurrent reads",
      "Automatically merges conflicting edits",
    ],
    correctIndex: 1,
  },
  {
    id: 296,
    session: 10,
    question: "The Forge plugin for Pessimistic Concurrency provides which 4 Service Actions?",
    options: [
      "Create, Read, Update, Delete",
      "Register a Resource, Check if locked, Lock, Unlock",
      "Open, Close, Commit, Rollback",
      "Fetch, Compare, Write, Retry",
    ],
    correctIndex: 1,
  },
  {
    id: 297,
    session: 10,
    question: "Which real-world incident was cited as caused by improper handling of concurrent transactions?",
    options: [
      "A bank data breach",
      "The AWS outage (October 2025)",
      "A ransomware attack",
      "A DNS misconfiguration",
    ],
    correctIndex: 1,
  },

  // ── Session 10: deeper / scenario questions ──────────────────────
  {
    id: 298,
    session: 10,
    question:
      "A SaaS HR app serves 50 client companies. Each company must see only its own employees, with the same code base. Which OutSystems feature directly enables this?",
    options: [
      "Site Properties per screen",
      "Setting the module's IsMultitenant property to Yes",
      "A separate module per client",
      "Static Entities for each company",
    ],
    correctIndex: 1,
  },
  {
    id: 299,
    session: 10,
    question:
      "In a multitenant module, which of these is automatically isolated per tenant WITHOUT extra developer work?",
    options: [
      "Only Entities",
      "Entities, Site Properties, and Timers",
      "Only end-user accounts",
      "Screens and UI flows",
    ],
    correctIndex: 1,
  },
  {
    id: 300,
    session: 10,
    question:
      "A developer calls Tenant_SwitchContext to switch a background process to another tenant. What key side effect must they account for?",
    options: [
      "The database is locked for all tenants",
      "The session is cleared — an implicit logout — before the tenant changes",
      "All timers stop running",
      "The module recompiles automatically",
    ],
    correctIndex: 1,
  },
  {
    id: 301,
    session: 10,
    question:
      "Two agents open the same customer record. Agent A saves a phone change; then Agent B saves an address change to their older copy. Under OutSystems' DEFAULT (No Concurrency) behaviour, what happens?",
    options: [
      "Agent B gets an error and must re-fetch",
      "Agent B's save silently overwrites Agent A's change (last write wins)",
      "Both changes merge automatically",
      "The record locks until Agent A logs out",
    ],
    correctIndex: 1,
  },
  {
    id: 302,
    session: 10,
    question:
      "You want users WARNED when they save a record someone else already changed since they fetched it — but you don't want to lock records. Which model fits?",
    options: [
      "No Concurrency",
      "Optimistic (or Versioned) Concurrency",
      "Pessimistic Concurrency",
      "Generic Locking only",
    ],
    correctIndex: 1,
  },
  {
    id: 303,
    session: 10,
    question:
      "What is the practical difference between Optimistic and Versioned concurrency in the blog example?",
    options: [
      "Optimistic locks the row; Versioned does not",
      "Optimistic compares the current stored values; Versioned compares a version number that auto-increments on each save",
      "They are identical",
      "Versioned works only for static entities",
    ],
    correctIndex: 1,
  },
  {
    id: 304,
    session: 10,
    question:
      "An invoicing system must generate unique, gapless, consecutive invoice numbers under heavy concurrent load. Which model is required?",
    options: [
      "No Concurrency",
      "Optimistic Concurrency",
      "Pessimistic Concurrency (locking the record while generating the number)",
      "Versioned Concurrency",
    ],
    correctIndex: 2,
  },
  {
    id: 305,
    session: 10,
    question:
      "Why does Optimistic/Versioned concurrency NOT solve the gapless invoice-number problem?",
    options: [
      "It locks too many records",
      "It only detects a conflict at save time — by then two transactions may have already read the same 'next number'",
      "It cannot be used with numbers",
      "It requires multitenancy to be enabled",
    ],
    correctIndex: 1,
  },
  {
    id: 306,
    session: 10,
    question:
      "In the Generic Locking (Pessimistic) pattern, what does a 'Resource' represent?",
    options: [
      "A physical server",
      "Any logic flow placed between the Lock and Unlock actions (e.g. a product listing being edited)",
      "A database table only",
      "A user session token",
    ],
    correctIndex: 1,
  },
  {
    id: 307,
    session: 10,
    question:
      "Using the Forge Pessimistic Concurrency plugin, a second user tries to edit a record already locked by someone else. Expected behaviour?",
    options: [
      "Their edit silently overwrites the first user's",
      "They see a message like 'currently locked by another user, try again later' and are blocked until it's unlocked",
      "The record is duplicated for them",
      "The system switches to Optimistic mode",
    ],
    correctIndex: 1,
  },
  {
    id: 308,
    session: 10,
    question:
      "A money-transfer flow does: Select-for-Update sender, Select-for-Update receiver, debit sender, credit receiver, then Commit. Which concurrency approach is this?",
    options: [
      "Optimistic Concurrency",
      "No Concurrency",
      "Pessimistic Concurrency",
      "Versioned Concurrency",
    ],
    correctIndex: 2,
  },
  {
    id: 309,
    session: 10,
    question:
      "Which statement best captures the trade-off when choosing a concurrency model?",
    options: [
      "Pessimistic is always best because it prevents all conflicts",
      "Stricter models (Pessimistic) give stronger guarantees but reduce throughput by locking; lighter models (Optimistic) allow more parallelism but require conflict handling",
      "Optimistic is always best because it never errors",
      "The model choice has no performance impact",
    ],
    correctIndex: 1,
  },
]
