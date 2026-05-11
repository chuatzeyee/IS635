export interface Topic {
  readonly title: string
  readonly points: readonly string[]
}

export interface Session {
  readonly id: number
  readonly title: string
  readonly topics: readonly Topic[]
}

export const sessions: readonly Session[] = [
  {
    id: 1,
    title: "Session 1: Introduction to LCAP",
    topics: [
      {
        title: "What is LCAP",
        points: [
          "Low Code Application Platform",
          "Uses model-driven development, generative AI, and prebuilt component catalogs",
          "Develop commercial-grade, full-stack applications without writing code",
          "GUI designer studio: drag-n-drop, connect, and configure components",
          "One-click 'Publish' to cloud-based runtime environment with fully automated CI/CD",
          "Cloud environments managed by LCAP provider: Dev, Test, and Prod",
        ],
      },
      {
        title: "LCAP Adoption",
        points: [
          "Very expensive enterprise licensing ($1M+ annually) -- startups cannot afford it",
          "Mostly used by very large enterprises: Governments, Banks, Telcos",
          "Singapore: all government agencies require new apps developed using LCAP",
          "Singapore telcos using LCAP: SingTel and StarHub",
          "SMU IT develops internal apps with OutSystems (e.g., Purchase Order System)",
          "Gartner Impact Radar (Aug 2023): LCAP in Software Engineering category",
        ],
      },
      {
        title: "LCAP vs Traditional Development",
        points: [
          "~1/3 developers needed for same-size project",
          "~3x faster development speed",
          "No infrastructure/DB engineers needed (fully managed service)",
          "Built-in code repository, version control, and CI/CD pipeline (vs GitHub for traditional)",
          "Packaging: 1-Click Publish (vs Docker/Kubernetes for traditional)",
          "Traditional: high infrastructure cost (AWS hosting for Dev/Test/Prod, API Gateway)",
          "Both support full-stack, JSON/REST, and OAuth standards",
        ],
      },
      {
        title: "CADP vs LCAP",
        points: [
          "CADP = Citizen Application Development Platform",
          "Different target audience and app complexity",
          "LCAP targets professional developers and enterprise apps",
          "CADP targets citizen developers and simpler use cases",
          "Closely related but distinctively different markets",
        ],
      },
      {
        title: "Gartner LCAP Use Cases",
        points: [
          "Line-of-business software development (back- and front-office)",
          "Modernization/augmentation of legacy business applications",
          "Internal company processes and digital workplaces",
          "NOT: replacing operating systems",
          "Most prominent market catalyst: Generative AI",
          "By 2028: Agentic AI in enterprise LCAPs in 4 out of 5 businesses globally",
        ],
      },
      {
        title: "Gartner Mandatory LCAP Features",
        points: [
          "Visual development tools and IDEs with minimal coding",
          "Data virtualization for complex distributed data architectures",
          "AI-assisted development features (generate/modify/optimize app components)",
          "Full self-service capabilities and technical documentation",
          "Extensibility through component catalogs, scripting, and code-based SDKs",
          "Security features: IAM, threat protection, compliance policies",
          "Integrated runtime environment for applications",
        ],
      },
      {
        title: "Gartner Common LCAP Features",
        points: [
          "Support for event-driven, streaming, microservices, micro front ends",
          "Collaborative development with versioning and multi-developer sync",
          "AI-powered functional components (NLP, AI agents)",
          "Extensible library of connectors for popular platforms",
          "Support for native/cross-platform mobile apps",
          "B2B and ISV use cases with multitenancy",
          "Integration with external test management and automation tools",
        ],
      },
      {
        title: "Software Engineering Principles (apply to low-code)",
        points: [
          "Separation of Concerns: frontend/backend in different modules",
          "Service Contract: REST API / Swagger documentation between frontend and backend",
          "Encapsulation: group related logic and data within service boundaries",
          "Reuse: design services as reusable building blocks",
        ],
      },
      {
        title: "SOA Layered Architecture",
        points: [
          "Layer 1 (bottom): Wrapper Services -- wraps external or legacy systems",
          "Layer 2: Atomic Services -- encapsulates a single entity",
          "Layer 3: Composite Services -- orchestrates Atomic and Wrapper services",
          "Layer 4 (top): User Interface",
          "Correct order from top to bottom: UI > Composite > Atomic > Wrapper",
        ],
      },
      {
        title: "OutSystems Designer Studio (4 Layers)",
        points: [
          "Data Layer: define Entities, ER diagrams (auto-created), CRUD methods (auto-created)",
          "Logic Layer: REST APIs, server-side logic, For Each, If, Switch, built-in functions",
          "Interface Layer: Reactive Web App, PWA Mobile app, drag-n-drop widgets",
          "Processes Layer: message subscription (e.g., RabbitMQ broker every 100ms)",
          "Database bootstrapped from imported Excel files, no manual DB setup needed",
          "Default database engine: MSSQL",
        ],
      },
      {
        title: "Forge Marketplace",
        points: [
          "OutSystems marketplace for downloadable plug-ins and components",
          "Examples: OpenAI, Google Maps, WhatsApp, Stripe, Speech Recognition, Bitcoin, Coinbase",
          "NOT a Forge component: Microsoft Teams",
          "Can download and use Forge components in term projects",
        ],
      },
      {
        title: "Swagger Documentation",
        points: [
          "Auto-created REST API documentation in OutSystems",
          "Serves as the service contract between frontend and backend",
          "NOT manually written, NOT imported from external tools",
        ],
      },
      {
        title: "SMULab Utilities",
        points: [
          "Useful Wrapper Services reusable in term projects",
          "Convenient utilities (e.g., store content/images for online shopping)",
          "Some Wrapper Services require an API Key (register for project team)",
          "Auto-Grader needs OutSystems Personal Environment Domain Name",
        ],
      },
      {
        title: "OutSystems Certification",
        points: [
          "Associate Developer Certification exam",
          "50 MCQ in 2 hours",
          "70% passing score required",
          "Free for SMU students (discount coupon)",
        ],
      },
      {
        title: "Gartner Magic Quadrant (Apr 2025)",
        points: [
          "Y-axis: Ability to Execute | X-axis: Completeness of Vision",
          "Leaders: OutSystems, Mendix, Microsoft, Salesforce, ServiceNow, Appian",
          "Challengers: Oracle, Zoho",
          "Visionaries: SAP, Pegasystems",
          "Niche Players: Retool, Creatio",
          "Leaders: both strong execution AND strong vision",
          "Challengers: strong execution but lack the vision of Leaders",
          "Visionaries: good strategic vision but haven't demonstrated strong execution",
          "Newgen dropped (product must be publicly available)",
          "No vendors were added to the 2025 MQ",
        ],
      },
      {
        title: "Gartner MQ - Ability to Execute (HIGH weight)",
        points: [
          "Product or Service",
          "Overall Viability",
        ],
      },
      {
        title: "Gartner MQ - Completeness of Vision (HIGH weight)",
        points: [
          "Market Understanding",
          "Innovation",
        ],
      },
      {
        title: "Gartner MQ Inclusion Criteria",
        points: [
          "Minimum $60M LCAP revenue with 100+ enterprise customers",
          "Direct customers in at least 3 geographies",
          "LCAP software product must be publicly available",
          "Go-to-market strategy for cross-industry/general-purpose app development",
        ],
      },
      {
        title: "LCAP Vendor Details",
        points: [
          "OutSystems (Leader): OutSystems Developer Cloud (ODC), NATS-based event bus",
          "Microsoft (Leader): Power Platform (Power Apps, Power Automate, Copilot Studio, Dataverse) -- PaaS only",
          "Salesforce (Leader): Salesforce Platform, Einstein, Agentforce, Slack/Tableau/MuleSoft integration",
          "Mendix (Leader): Siemens subsidiary, Studio Pro, Maia AI, Atlas UI with Figma integration",
          "Appian (Leader): Appian Designer, Data Fabric, AI Copilot, Agent Studio",
          "ServiceNow (Leader): App Engine, Now Assist, GenAI-native ServiceNow Studio",
          "Oracle (Challenger): Oracle APEX, embedded in Oracle Database at no extra cost",
          "Zoho (Challenger): Zoho Creator, 20,000+ paying customers",
          "SAP (Visionary): SAP Build, 500+ prebuilt content for finance/HCM/supply chain",
          "Pegasystems (Visionary): Pega Infinity, GenAI Blueprint",
          "Retool (Niche Player): targets internal app development",
          "Creatio (Niche Player): Studio Creatio, CRM-focused",
        ],
      },
      {
        title: "SMU OutSystems Applications",
        points: [
          "SMU IT: Purchase Order Justification, PGP Admissions, Facilities Booking, Conflict of Interest",
          "Student FYP: Retail Internet Banking, Corporate Internet Banking, Teller/Onboarding, General Ledger",
          "Narfin spinoff: Treasury Management, Digital Client Onboarding, Remittance, Vehicle Financing",
          "Prof Alan's research: anchored around SMU Teaching Bank (SMU tBank)",
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Session 2: Architecture Best Practices",
    topics: [
      {
        title: "Monolithic Architecture",
        points: [
          "Single code base implementing ALL functions for various business processes",
          "Typically one programming language on one platform",
          "Easier compatibility between parts, less flexibility for technology choices",
          "Over time: becomes large, complex, difficult to understand and maintain",
          "Modules are tightly coupled with complex inter-dependencies",
          "Deployment is all-or-none -- change to one function requires redeploying entire package",
          "Example: .war or .ear archive file in Java enterprise applications",
          "Recommended for SMALL applications in OutSystems",
        ],
      },
      {
        title: "Service-Oriented Architecture (SOA)",
        points: [
          "Services are 'loosely coupled': any language, any platform",
          "Each service: single unit implementing one or a few functions",
          "Can be changed independently as long as invocation interface stays the same",
          "Services communicate over network via standard interfaces (REST/Swagger)",
          "Recommended for LARGE enterprise applications in OutSystems",
          "Example: one service in Java, another in Python, running on different platforms",
        ],
      },
      {
        title: "Atomic Service",
        points: [
          "Named as a NOUN (e.g., Book, Customer, Party, Product)",
          "Encapsulates a single 'atomic' entity",
          "Has EXCLUSIVE ownership of data entities (Public set to 'No')",
          "NEVER invokes other services",
          "Highly reusable -- can be invoked by many applications",
          "Foundational building blocks assembled into different solutions",
          "Both Atomic and Composite services can be called 'Microservices'",
        ],
      },
      {
        title: "Composite Service",
        points: [
          "Named as a VERB (e.g., PlaceOrder)",
          "Orchestrates other atomic/composite services (its main purpose)",
          "Does NOT own any data",
          "Also reusable, but to a lesser extent than Atomic",
          "Both Atomic and Composite services can be called 'Microservices'",
        ],
      },
      {
        title: "Wrapper Service",
        points: [
          "Wraps external or legacy systems",
          "Provides a standardized service interface",
          "Bottom layer of the SOA architecture",
        ],
      },
      {
        title: "Service Reuse Benefits",
        points: [
          "Build once, reuse many times -- saves development cost",
          "Assemble existing reusable services into new apps -- time-to-market agility",
          "Requires REST and Swagger standards",
          "Example: Party, Product, Agreement services shared by Order Mgmt, Inventory, Shipping, Support",
        ],
      },
      {
        title: "Monolithic vs SOA (Example)",
        points: [
          "Monolithic: each app (Order Mgmt, Inventory, Shipping, Support) has its own copy of Party, Product, Agreement",
          "SOA: three shared Atomic Services (Party, Product, Agreement) used by all four UIs",
          "Party = any Person (customer, employee) or Organization (supplier, employer)",
          "Product = any product (food, clothing, loans, investments)",
          "Agreement = any agreement between two parties for any product",
        ],
      },
      {
        title: "Party Atomic Service",
        points: [
          "Represents any Person or Organization",
          "Manages roles and relationships (e.g., Company-Customer, Company-Employee)",
          "Deployed as Multi-Tenant -- all data co-mingled, segregated by team's unique Tenant ID",
          "Reused for both Group Assignment and Term Project",
        ],
      },
      {
        title: "Product Atomic Service",
        points: [
          "Product hierarchy: Family > Class > Type",
          "Example: Family=BOOKS, Class=FICTION, Type=SCIENCE FICTION",
          "Attributes: TITLE, ISBN13, PRICE, AVAILABILITY, AUTHOR",
          "Reusable across domains: Food & Bev, Financial, Medical, Legal, Educational, etc.",
          "Also deployed as Multi-Tenant",
        ],
      },
      {
        title: "Application Structure in OutSystems",
        points: [
          "Application = a group of Modules",
          "Good practice: separate Service modules from UI modules",
          "Reactive Web App modules and Service modules have different icons",
          "Only Atomic Services should own data (Public = 'No')",
          "UI module should only access the 'User' table directly",
          "All other data: accessed via REST API calls to service modules",
          "'System' module owns and exposes the User table (Public = 'Yes')",
        ],
      },
      {
        title: "Loading Server-Side Data into Browser Memory",
        points: [
          "Avoid reading reference/user-specific data on-demand (impacts response time)",
          "Instead: load data into browser memory during user login",
          "Stored as Client Variables -- read instantaneously (no network transmission)",
          "Only update server-side when data is created or updated",
          "Flow: Login Client Action -> LoadData Client Action -> Server Actions",
          "Clicking Login causes server-side data to load into browser memory",
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Session 3: Data Layer",
    topics: [
      {
        title: "Database in OutSystems",
        points: [
          "Default database engine: MSSQL (hosted on OutSystems cloud)",
          "Developers do NOT need to install any database engine manually",
          "Database and data model auto-created when Entities are defined",
          "ER Diagrams auto-created from data model",
          "CRUD methods auto-created from data model",
          "Database Entities can be bootstrapped from imported Excel files",
          "Primary Key represented by an Identifier symbol in Entity diagrams",
        ],
      },
      {
        title: "Static Entities",
        points: [
          "Setup manually by developer and are Read-Only",
          "Used for Enumerations -- fixed reference data values",
          "Examples: role types (Company, Customer, Employee), document types, education levels",
          "Only 'Get' methods available (no Create, Update, or Delete)",
          "Party Atomic Service uses Static Entities for party roles and relationships",
        ],
      },
      {
        title: "Structures",
        points: [
          "Developer-defined Data Type",
          "In REST APIs: a Structure = JSON Object",
          "A List of Structures = JSON Array",
          "Structure Attributes are case-sensitive",
          "'Name in JSON' config specifies how API consumer names request parameters",
          "Example: 'AddCustomerRequest' structure for API consumers",
          "Identifier symbol indicates the field is the Primary Key of an Entity",
        ],
      },
      {
        title: "Client Variables",
        points: [
          "Stored in client-side browser memory (NOT persisted server-side)",
          "Visible to Client Actions ONLY -- NOT visible to Server Actions",
          "Can only be primitive data types: Integer, Boolean, Text",
          "Structure data types must be serialized (converted to Text) before storing",
          "Shopping cart example: will NOT follow user to a different machine",
          "Read instantaneously from browser memory (no network transmission)",
        ],
      },
      {
        title: "Site Properties",
        points: [
          "Persisted at server-side",
          "Have Application scope -- used to set global parameters",
          "NOT visible to Client Actions",
          "Changeable at runtime via OutSystems Service Center",
          "No re-Publish needed when changed at runtime",
          "Service Center accessible via icon in the studio",
        ],
      },
      {
        title: "Resources Folder",
        points: [
          "Used to import: favicon.png, custom JavaScript/CSS, Excel files for bootstrapping",
          "NOT for: REST API configurations",
          "favicon.png = application icon displayed in web and mobile browsers",
          "Excel files can be removed from Resources after bootstrapping",
        ],
      },
      {
        title: "Data Concepts Summary",
        points: [
          "Entity = database table, auto-creates ER + CRUD + data model",
          "Static Entity = read-only reference data (enumerations), only Get",
          "Structure = developer-defined data type (JSON Object in REST)",
          "Client Variable = browser-stored, primitive types only, client-side only",
          "Site Property = server-side, application scope, runtime-changeable via Service Center",
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Session 4: Logic Layer",
    topics: [
      {
        title: "Server Actions vs Client Actions",
        points: [
          "Server Actions emit C# .NET code (run on the server)",
          "Client Actions emit React.JS code (run in the browser)",
          "Both have separate sets of built-in logic elements",
          "Server-side has unique elements: Aggregate, SQL, Record List to Excel, Excel to Record List, Comment, Send Email",
          "Client-side has unique elements: Message, Run Client Action, Refresh Data, Destination, Download, JavaScript",
          "Both share: If, Switch, For Each, Assign, JSON Serialize/Deserialize, Exception Handler, Raise Exception, Run Server Action",
        ],
      },
      {
        title: "Client-Side Logic Elements",
        points: [
          "Message: show user a message (Success, Info, or Error)",
          "Run Client Action: run client-side logic",
          "Run Server Action: run server-side logic from client",
          "Refresh Data: refresh UI table sourced from an Entity",
          "If: route logic to True or False path based on Boolean expression",
          "Switch: route logic to 2+ paths based on Boolean expressions",
          "For Each: iterate through a List",
          "Assign: assign values to Local Variables or Output Parameters",
          "JSON Serialize/Deserialize: convert between Structure and Text",
          "Exception Handler / Raise Exception: error handling",
          "Destination: redirect UI to another Screen",
          "Download: download Binary file content",
          "JavaScript: insert custom JS into the current UI Screen",
        ],
      },
      {
        title: "Server-Side Logic Elements",
        points: [
          "Run Server Action: run server-side logic",
          "Aggregate: execute SELECT on an Entity, returns a List",
          "SQL: execute any SQL statement (SELECT, INSERT, UPDATE)",
          "If / Switch: conditional branching (same as client-side)",
          "For Each: iterate through a List",
          "Assign: assign values to variables",
          "Record List to Excel: export a List to an Excel file",
          "Excel to Record List: import from Excel into a List",
          "JSON Serialize/Deserialize: convert between Structure and Text",
          "Exception Handler / Raise Exception: error handling",
          "Comment: developer comments in code",
          "Send Email: requires SMTP and Email Template setup via Service Centre",
        ],
      },
      {
        title: "For Each: Iterating through a List",
        points: [
          "Must have 1 outgoing 'Cycle' path and 1+ return paths",
          "List attributes available during iteration:",
          "  Current -- data value at the current iteration",
          "  EOF -- True if end of List was exceeded",
          "  BOF -- True if currently at first record",
          "  CurrentRowNumber -- row number of current iteration",
          "  Length -- number of records in the List",
          "  Empty -- True if the List is empty",
          "Current value viewable via Expression Editor and Debugger View",
        ],
      },
      {
        title: "Built-in List Actions",
        points: [
          "Available for BOTH Client Actions and Server Actions (separate sets)",
          "ListAll: check if all elements satisfy a condition",
          "ListAny: check if any element satisfies a condition",
          "ListAppend / ListAppendAll: add elements to end of list",
          "ListClear: remove all elements",
          "ListDistinct: filter duplicate elements",
          "ListDuplicate: copy elements to another list",
          "ListFilter: return new list with elements matching condition",
          "ListIndexOf: find position of first matching element (or -1)",
          "ListInsert: insert at specific position",
          "ListRemove: remove from specific position",
          "ListSort: sort elements by given criteria",
        ],
      },
      {
        title: "Built-in Function Categories",
        points: [
          "Math: Power(n,m), Sqrt(n), etc.",
          "Numeric: number formatting and manipulation (separate from Math)",
          "Text: text manipulation operations",
          "Date and Time: date/time operations",
          "Conversion: data type conversion between types",
          "Environment: runtime environment information",
          "NOT a category: Machine Learning, Blockchain, Graphics",
        ],
      },
      {
        title: "User-Defined Functions",
        points: [
          "Set a Client Action's 'Function' property to 'Yes'",
          "Makes the Client Action visible as a User Function",
          "Accessible via the Expression Editor alongside built-in functions",
          "Created by converting a Client Action (not by writing C#/JS code)",
        ],
      },
      {
        title: "Logic Flow Elements Summary",
        points: [
          "If: conditional branching (True/False paths)",
          "Switch: multi-way branching (2+ conditions)",
          "For Each: iterate through a List",
          "Exception Handler: error handling and recovery",
          "Raise Exception: throw an exception from current flow",
          "Assign: set variable values",
          "Complex business logic = For Each + If + Switch + List + Exception Handler + built-in functions",
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Session 5: Interface Layer",
    topics: [
      {
        title: "User Interface Templates",
        points: [
          "Reactive Web App: Single Page Application (SPA) architecture",
          "All HTML, JS, and CSS retrieved with a single page load -- pages never reload",
          "Uses ReactJS framework for async requests (XML or JSON data)",
          "JavaScript dynamically changes page content",
          "Makes Client Actions (UI event handlers) possible",
          "Phone App: also SPA, one codebase for Android (APK), iOS (IPA), and PWA",
          "Phone App has access to device hardware (e.g., camera)",
          "Traditional Web: legacy architecture, loads page from server on every screen change, uses Session variables",
          "Traditional Web: Client Actions and Client Variables NOT possible",
        ],
      },
      {
        title: "Module-level Settings",
        points: [
          "DBMS: defines which DBMS standards used for SQL statements",
          "Is User Provider: set to 'Yes' if module provides user records",
          "User Provider module: specifies source for user records",
          "Icon: icon displayed by the module",
          "Default Theme: where to install custom UI Theme",
          "Default Screen: start screen of the app (typically 'Home')",
          "Splash Screen: displayed while application is loading",
          "Global Exception Handler: defines OnException handler for all flows",
          "Default Transition: transition effect when navigating screens",
          "Server Request Timeout: max seconds to wait before Communications Exception (overridable per action)",
        ],
      },
      {
        title: "UI Theme Editor",
        points: [
          "New applications configured with Default Theme",
          "Can edit fonts, colors, spacing, etc.",
          "Save under a new name",
          "Make the new Theme public for other applications to use",
        ],
      },
      {
        title: "Common Elements (auto-created per application)",
        points: [
          "OnException Action: handles all downstream exceptions thrown",
          "InvalidPermissions Screen: users redirected here for invalid permissions",
          "Login Screen: basic user login (typically enhanced)",
          "RedirectToURL: redirect to internal Screen or any external website",
          "Web Blocks: built-in reusable screen elements, can be made public to every Screen",
        ],
      },
      {
        title: "Screen Layouts",
        points: [
          "Built-in screen Layouts available",
          "Most commonly used: LayoutTopMenu and LayoutSideMenu",
        ],
      },
      {
        title: "Widget Styles Editor",
        points: [
          "Change appearance of any Screen Widget",
          "Add 'Style Classes' from the CSS library",
          "Change Font: style, size, and color",
          "Change Layout: width, height, alignment, margin, and padding",
          "Change Borders: line width, color, corner roundness",
          "Toolbar useful for navigating through layers of screen widgets",
        ],
      },
      {
        title: "Screen Widgets & Form Accelerators",
        points: [
          "Comprehensive list of drag-and-drop widgets available in the studio",
          "Includes: Dropdowns, Buttons, Checkboxes, Radio Buttons, Inputs, Tables, etc.",
          "Event Handlers: OnClick, OnFocus, OnBlur, OnKeyUp, OnKeyDown, etc.",
          "Form Accelerator: drag into MainContent placeholder to auto-generate a form",
          "Forms generated based on entity structure",
        ],
      },
    ],
  },
]
