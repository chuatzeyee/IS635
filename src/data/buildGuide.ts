export interface BuildStep {
  readonly title: string
  readonly instructions: readonly string[]
  readonly tip?: string
  readonly important?: string
}

export interface BuildSection {
  readonly id: string
  readonly title: string
  readonly summary: string
  readonly steps: readonly BuildStep[]
}

export interface BuildPhase {
  readonly id: number
  readonly title: string
  readonly description: string
  readonly timeEstimate: string
  readonly sections: readonly BuildSection[]
}

export const buildPhases: readonly BuildPhase[] = [
  {
    id: 1,
    title: 'Module Setup',
    description: 'Create the application, 6 Service modules, static entities, and site properties in CC_Orchestration.',
    timeEstimate: '1-2 hours',
    sections: [
      {
        id: '1.1',
        title: 'Module Types — Service vs Reactive Web App',
        summary: 'All 6 backend modules are Service modules. Only the frontend CareConnect_UI is a Reactive Web App.',
        steps: [
          {
            title: 'Understand the 6 Service modules',
            instructions: [
              'CareConnect_Family — entity + REST APIs, no UI',
              'CareConnect_Caregiver — entity + REST APIs, no UI',
              'CareConnect_AvailabilitySlot — entity + REST APIs, no UI',
              'CareConnect_CareRequest — entity + REST APIs, no UI',
              'CareConnect_CareVisit — entity + REST APIs, no UI',
              'CC_Orchestration — composites + REST APIs, no UI',
            ],
            tip: 'Service modules skip the Interface layer (screens, blocks, themes) — no dead weight for headless services.',
            important: 'Only the frontend team applies the theme (IS635_AY25T3_Team2) to CareConnect_UI. Backend Service modules have no Interface tab.',
          },
        ],
      },
      {
        id: '1.2',
        title: 'Create the Application & First Module',
        summary: 'Create the CareConnect Integration application in Service Studio with the first module.',
        steps: [
          {
            title: 'Create CareConnect Integration app',
            instructions: [
              'Open Service Studio > New Application',
              'Select Service > click Next',
              'Application Name: CareConnect Integration',
              'First module name: CareConnect_Family (type: Service)',
              'Click Create Module',
            ],
          },
          {
            title: 'Create remaining 5 modules',
            instructions: [
              'Click the application name tab at top-left',
              'Right-click CareConnect Integration > Add Module',
              'Create each: CareConnect_Caregiver, CareConnect_AvailabilitySlot, CareConnect_CareRequest, CareConnect_CareVisit, CC_Orchestration',
              'Each module type: Service',
            ],
            important: 'Spelling matters for REST URLs — use exact module names.',
          },
        ],
      },
      {
        id: '1.4',
        title: 'Create Static Entities in CC_Orchestration',
        summary: 'Create CareRequestStatus, VisitStatus, and PaymentStatus static entities with their records.',
        steps: [
          {
            title: 'CareRequestStatus',
            instructions: [
              'Data > right-click Entities > Add Static Entity > name: CareRequestStatus',
              'Add records: Open, Assigned, Completed, Cancelled, Escalated',
            ],
          },
          {
            title: 'VisitStatus',
            instructions: [
              'Add Static Entity > name: VisitStatus',
              'Add records: Scheduled, Completed, Disputed, Escalated',
            ],
          },
          {
            title: 'PaymentStatus',
            instructions: [
              'Add Static Entity > name: PaymentStatus',
              'Add records: Held, Released, Refunded',
            ],
          },
          {
            title: 'Make static entities Public',
            instructions: [
              'Click each entity > Properties > set Public = Yes',
              '1-Click Publish (Ctrl+Shift+P)',
            ],
            tip: 'This allows other modules (CareRequest, CareVisit) to reference these status values.',
          },
        ],
      },
      {
        id: '1.5',
        title: 'Create Site Properties',
        summary: 'Configure runtime settings for API keys, RabbitMQ credentials, and IDs.',
        steps: [
          {
            title: 'Add all Site Properties in CC_Orchestration',
            instructions: [
              'Data > right-click Site Properties > Add Site Property for each:',
              'DefaultProductFamilyId (Text) — Home Care Services family ID',
              'ElderlyCarePCId (Text) — Elderly Care ProductClass ID',
              'ChildSNPCId (Text) — Child Special Needs ProductClass ID',
              'PostSurgPCId (Text) — Post-Surgery Recovery ProductClass ID',
              'MaxAssignmentAttempts (Integer, default: 3)',
              'TimerIntervalMinutes (Integer, default: 30)',
              'ProductAPIKey (Text) — your SMULab API key',
              'OpenAIApiKey (Text) — for AI summary generation',
              'RabbitMQ_Hostname, RabbitMQ_VirtualHost, RabbitMQ_Username, RabbitMQ_Password (all Text)',
            ],
            important: 'Leave ID properties empty initially — you will fill them in Phase 5 after seeding product data.',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Wrapper Services',
    description: 'Consume 4 external REST APIs via Swagger and create wrapper Server Actions + exposed REST endpoints in CC_Orchestration.',
    timeEstimate: '2-3 hours',
    sections: [
      {
        id: '2.1',
        title: 'Consume REST APIs via Swagger',
        summary: 'Import 4 external wrappers (Party, Product, RabbitMQ, S3) using their Swagger URLs.',
        steps: [
          {
            title: 'How to consume a REST API',
            instructions: [
              'Logic > Integrations > right-click REST > Consume REST API...',
              'Click Add Multiple Methods tab',
              'Paste the Swagger URL > click OK/Consume',
              'Check the methods you need > Finish',
              'OutSystems auto-generates consumed methods + Structures',
            ],
          },
          {
            title: 'Party wrapper (SMULab)',
            instructions: [
              'Swagger: smuedu-dev.outsystemsenterprise.com/SMULab_Party/rest/Party/swagger.json',
              'Select: AddPerson, GetPerson, GetDocumentTypes, GetRoleTypes',
            ],
          },
          {
            title: 'Product wrapper (SMULab)',
            instructions: [
              'Swagger: smuedu-dev.outsystemsenterprise.com/SMULab_Product/rest/Product/swagger.json',
              'Select: GetProductFamilies, GetProductClasses, GetProductTypes, GetProductHierarchy, AddProductFamily, AddProductClass, AddProductType',
            ],
            important: 'Product API requires X-Contacts-Key header. Add an APIKey input parameter (Send In: Header, Name: X-Contacts-Key) to EVERY Product method — 7 methods total.',
          },
          {
            title: 'RabbitMQ wrapper (SMULab)',
            instructions: [
              'Swagger: smuedu-dev.outsystemsenterprise.com/SMULab_RabbitMQ/rest/RabbitMQ/swagger.json',
              'Select: PublishMessage, ConsumeMessage, SubscribeMessage, PutExchange, PutQueue, BindQueue',
            ],
            tip: 'Every RabbitMQ method requires a Connection object. Use Site Properties (Site.RabbitMQ_Hostname, etc.) to fill it each time.',
          },
          {
            title: 'S3 / AmazonS3 wrapper (SMULab)',
            instructions: [
              'Swagger: smuedu-dev.outsystemsenterprise.com/SMULab_AmazonS3/rest/AmazonS3/swagger.json',
              'Select ALL 4 methods: UploadFile, FetchFile, FetchFileUrl, DeleteFile',
            ],
            tip: 'All S3 methods use POST (not GET/DELETE). Each takes a single Request Structure as input — build the Structure first, then pass it.',
          },
        ],
      },
      {
        id: '2.2',
        title: 'Error Handling Exceptions',
        summary: 'Create custom exceptions for wrapper error handling.',
        steps: [
          {
            title: 'Create exceptions in CC_Orchestration',
            instructions: [
              'Logic > right-click Exceptions > Add Exception > name: RabbitMQException',
              'Add Exception > name: S3Exception',
              'Leave defaults (Type = User Exception)',
            ],
          },
        ],
      },
      {
        id: '2.4',
        title: 'Wrapper Facade Server Actions',
        summary: 'Create Server Actions that wrap consumed REST calls with proper inputs/outputs.',
        steps: [
          {
            title: 'SA_GetProductFamilies',
            instructions: [
              'Output: ProductFamilies (ProductFamily List)',
              'Flow: Start → GetProductFamilies(APIKey: Site.ProductAPIKey) → Assign ProductFamilies = GetProductFamilies.List → End',
            ],
          },
          {
            title: 'SA_GetProductClasses',
            instructions: [
              'Input: ProductFamilyId (Text, Mandatory)',
              'Output: ProductClasses (ProductClass List)',
              'Flow: Start → GetProductClasses(ProductFamilyId, APIKey: Site.ProductAPIKey) → Assign → End',
            ],
          },
          {
            title: 'SA_GetProductTypes / SA_GetProductHierarchy',
            instructions: [
              'SA_GetProductTypes: Input ProductClassId → Output ProductTypes (ProductType List)',
              'SA_GetProductHierarchy: No input → Output Hierarchy (ProductHierarchy List)',
              'Both pass Site.ProductAPIKey to the API method',
            ],
          },
          {
            title: 'SA_UploadToS3',
            instructions: [
              'Inputs: FileName, File (base64 text), FolderName, SubFolderName',
              'Output: S3Key (Text)',
              'Local Variable: UploadRequest (UploadFileRequest)',
              'Flow: Start → Assign (build UploadRequest from inputs) → UploadFile(Request: UploadRequest) → Assign S3Key → End',
              'Add Exception Handler → AllExceptions → Raise S3Exception',
            ],
            tip: 'UploadFile takes a single Request Structure — not individual fields. Build the Structure first with an Assign node.',
          },
          {
            title: 'SA_FetchFileUrl',
            instructions: [
              'Inputs: FolderName, SubFolderName, S3Key',
              'Output: FileUrl (Text)',
              'Local Variable: FetchUrlRequest (FetchFileUrlRequest)',
              'Flow: Start → Assign (build request) → FetchFileUrl → Assign FileUrl → End',
            ],
          },
          {
            title: 'SA_PublishEvent (generic RabbitMQ publisher)',
            instructions: [
              'Inputs: ExchangeName, RoutingKey, Payload (all Text, Mandatory)',
              'Output: Success (Boolean)',
              'Local Variable: PubRequest (MyPublishMessageRequest)',
              'Assign: PubRequest.RoutingKey, Payload, PayloadEncoding="string"',
              'Assign Connection fields from Site Properties (Hostname, VirtualHost, Port=0, Username, Password)',
              'Flow: Start → Assign → PublishMessage(Exchange, Request: PubRequest) → Assign Success=True → End',
              'Exception Handler → Raise RabbitMQException',
            ],
          },
        ],
      },
      {
        id: '2.5',
        title: 'Expose Wrapper Facades as REST Endpoints',
        summary: 'Create exposed REST APIs so the UI team and Swagger can access your wrappers.',
        steps: [
          {
            title: 'Create "Product" REST API',
            instructions: [
              'Logic > Integrations > REST > right-click REST > Expose REST API > name: Product',
              'Add methods: GetProductFamilies (GET), GetProductClasses (GET, input: ProductFamilyId), GetProductTypes (GET, input: ProductClassId), GetProductHierarchy (GET)',
              'Each method calls its SA_* wrapper and assigns the output',
            ],
          },
          {
            title: 'Create "Storage" REST API',
            instructions: [
              'Expose REST API > name: Storage',
              'UploadFile (POST) — Input: Request (UploadFileRequest, Receive In: Body), Output: S3Key',
              'GetFileUrl (POST) — Input: Request (FetchFileUrlRequest, Receive In: Body), Output: FileUrl',
            ],
            important: 'OutSystems only allows one input with Receive In = Body — use the Structure type as a single input.',
          },
          {
            title: 'Verify and publish',
            instructions: [
              '1-Click Publish (Ctrl+Shift+P)',
              'Right-click exposed REST API > Open Documentation to test via Swagger UI',
              'Try GET /GetProductFamilies — should return JSON (may be empty if no products seeded yet)',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Atomic Services',
    description: 'Build 5 atomic CRUD services: Family, Caregiver, AvailabilitySlot, CareRequest, CareVisit+Payment. Each follows the same pattern.',
    timeEstimate: '4-6 hours',
    sections: [
      {
        id: '3.pattern',
        title: 'The Atomic Service Pattern',
        summary: 'Every atomic service follows the same 5-step pattern. Learn it once, apply it 5 times.',
        steps: [
          {
            title: 'The pattern',
            instructions: [
              '1. Create Entity (Data tab) — define attributes, indexes, set PK to AutoNumber',
              '2. Create User Exception (Logic tab) — e.g., FamilyNotFoundException',
              '3. Create Server Actions (Logic tab) — CRUD operations with proper flows',
              '4. Expose REST APIs (Logic > Integrations > REST) — wire to Server Actions',
              '5. Publish and test via Swagger',
            ],
            tip: 'Family (3A) is written with full click-by-click detail. The others follow the same steps with different attribute names.',
          },
        ],
      },
      {
        id: '3A',
        title: 'Family Service (CareConnect_Family)',
        summary: 'Entity with 10 attributes, 1 exception, 5 Server Actions, 5 REST endpoints.',
        steps: [
          {
            title: 'Create Family Entity',
            instructions: [
              'Data > right-click Entities > Add Entity > name: Family',
              'Rename Id to FamilyId, set Is AutoNumber = Yes',
              'Add attributes: UserId (Long Integer), PartyId (Text 50), Email (Text 200), PhoneNumber (Text 20), PreferredSkillProductTypeIds (Text 500), Rating (Decimal 10,2), TotalRequests (Integer), IsActive (Boolean, default True), CreatedAt/UpdatedAt (Date Time)',
              'Create indexes: idx_UserId, idx_PartyId',
            ],
          },
          {
            title: 'Create exception + Server Actions',
            instructions: [
              'Exception: FamilyNotFoundException',
              'SA_CreateFamily — Assign fields + CreateFamily CRUD + assign FamilyId',
              'SA_GetFamilyByUserId — Aggregate with filter UserId = input, If empty raise exception',
              'SA_GetFamilyById — Aggregate with filter FamilyId = input',
              'SA_UpdateFamily — GetFamilyForUpdate + Assign changes + UpdateFamily CRUD',
              'SA_UpdateFamilyRating — same update pattern for Rating and TotalRequests',
            ],
          },
          {
            title: 'Expose REST APIs',
            instructions: [
              'Expose REST API > name: Family',
              'POST /Create — calls SA_CreateFamily',
              'GET /GetByUserId — calls SA_GetFamilyByUserId',
              'GET /GetById — calls SA_GetFamilyById',
              'PUT /Update — calls SA_UpdateFamily',
              'PUT /UpdateRating — calls SA_UpdateFamilyRating',
            ],
            tip: 'For GET methods, add input parameters and set Receive In = URL. For POST/PUT with bodies, use a Structure with Receive In = Body.',
          },
        ],
      },
      {
        id: '3B',
        title: 'Caregiver Service (CareConnect_Caregiver)',
        summary: 'Entity with 13 attributes, 1 exception, 6 Server Actions, 6 REST endpoints.',
        steps: [
          {
            title: 'Create Caregiver Entity',
            instructions: [
              'Rename Id to CaregiverId, set Is AutoNumber = Yes',
              'Key attributes: UserId, PartyId, Bio (Text 500), SkillProductClassIds (Text 500), SkillProductTypeIds (Text 500), IsAvailable (Boolean), IsVerified (Boolean), Rating (Decimal), TotalVisits (Integer), ResponseTime (Integer), LastAssignedAt, CreatedAt, UpdatedAt',
              'Indexes: idx_UserId, idx_PartyId, idx_IsAvailable',
            ],
          },
          {
            title: 'Server Actions',
            instructions: [
              'SA_CreateCaregiver, SA_GetCaregiverByUserId, SA_GetCaregiverById',
              'SA_UpdateCaregiver, SA_UpdateCaregiverRating',
              'SA_GetAvailableCaregivers — Aggregate filtered by IsAvailable = True AND IsVerified = True',
            ],
            tip: 'SA_GetAvailableCaregivers returns a list. Add a Max Records if you want to limit results.',
          },
        ],
      },
      {
        id: '3C',
        title: 'AvailabilitySlot Service',
        summary: 'Entity with 7 attributes, 1 exception, 5 Server Actions, 5 REST endpoints.',
        steps: [
          {
            title: 'Create AvailabilitySlot Entity',
            instructions: [
              'Rename Id to SlotId, set Is AutoNumber = Yes',
              'Attributes: CaregiverId (Long Integer), DayOfWeek (Integer 1-7), StartTime (Time), EndTime (Time), IsRecurring (Boolean), CreatedAt, UpdatedAt',
              'Indexes: idx_CaregiverId, idx_DayOfWeek',
            ],
          },
          {
            title: 'Server Actions',
            instructions: [
              'SA_CreateSlot, SA_GetSlotsByCaregiverId (returns List), SA_GetSlotById',
              'SA_UpdateSlot, SA_DeleteSlot (use DeleteAvailabilitySlot CRUD)',
            ],
          },
        ],
      },
      {
        id: '3D',
        title: 'CareRequest Service',
        summary: 'Entity with 15+ attributes, 1 exception, 6+ Server Actions, 6+ REST endpoints.',
        steps: [
          {
            title: 'Create CareRequest Entity',
            instructions: [
              'Rename Id to CareRequestId, set Is AutoNumber = Yes',
              'Key attributes: FamilyId, PatientName, SkillProductTypeId, RequestedDate (Date), StartTime/EndTime (Time), Notes, StatusId (CareRequestStatus Id from CC_Orchestration), AssignedCaregiverId, AssignmentAttempts (Integer, default 0), S3DocumentKey, CreatedAt, UpdatedAt',
            ],
            important: 'Add a dependency on CC_Orchestration (Ctrl+Q) to use CareRequestStatus static entity. Reference it via CareRequestStatus Identifier data type.',
          },
          {
            title: 'Server Actions',
            instructions: [
              'SA_CreateRequest — set StatusId = Entities.CareRequestStatus.Open',
              'SA_GetRequestsByFamilyId, SA_GetRequestById, SA_UpdateRequestStatus',
              'SA_AssignCaregiver — set StatusId = Assigned, increment AssignmentAttempts',
              'SA_GetOpenRequests — Aggregate filtered by StatusId = Open',
            ],
          },
        ],
      },
      {
        id: '3E',
        title: 'CareVisit + Payment Service',
        summary: 'Two entities in one module: CareVisit (11 attrs) and Payment (8 attrs). Linked by CareVisitId.',
        steps: [
          {
            title: 'Create CareVisit Entity',
            instructions: [
              'Rename Id to CareVisitId, set Is AutoNumber = Yes',
              'Attributes: CareRequestId, CaregiverId, FamilyId, VisitDate (Date), StartTime/EndTime (Time), StatusId (VisitStatus), CaregiverNotes, ProofPhotoS3Key, AISummary, CreatedAt, UpdatedAt',
            ],
          },
          {
            title: 'Create Payment Entity',
            instructions: [
              'Add a second entity in the same module: Payment',
              'Rename Id to PaymentId, Is AutoNumber = Yes',
              'Attributes: CareVisitId (Long Integer), Amount (Decimal), StatusId (PaymentStatus), HeldAt/ReleasedAt (Date Time), CreatedAt, UpdatedAt',
            ],
            important: 'Add dependency on CC_Orchestration for VisitStatus and PaymentStatus static entities.',
          },
          {
            title: 'Server Actions (CareVisit + Payment combined)',
            instructions: [
              'CareVisit: SA_CreateVisit, SA_GetVisitById, SA_GetVisitsByCaregiverId, SA_UpdateVisitStatus, SA_UpdateVisitSummary',
              'Payment: SA_HoldPayment — create payment with StatusId = Held',
              'SA_ReleasePayment — update StatusId = Released, set ReleasedAt = CurrDateTime()',
              'SA_GetPaymentByVisitId',
            ],
            tip: 'SA_HoldPayment is called right after creating a visit. The Amount = hours × HourlyRate (calculated by the composite in Phase 4).',
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: 'CC_Orchestration Composite',
    description: 'Build composite Server Actions that orchestrate across all atomic services, set up the Timer, and expose final REST endpoints.',
    timeEstimate: '2-3 hours',
    sections: [
      {
        id: '4.1',
        title: 'Add Dependencies on Atomic Services',
        summary: 'Import all SA_* Server Actions from the 5 atomic modules using Manage Dependencies.',
        steps: [
          {
            title: 'Manage Dependencies (Ctrl+Q)',
            instructions: [
              'Search each module: CareConnect_Family, CareConnect_Caregiver, CareConnect_AvailabilitySlot, CareConnect_CareRequest, CareConnect_CareVisit',
              'Expand each > check all SA_* actions',
              'Also import from (System): User_CreateOrUpdate, User_Login',
              'Click Apply and wait for refresh',
            ],
            tip: 'Direct module references (Service Actions) give compile-time type checking, no HTTP overhead, and auto-update when source changes.',
          },
        ],
      },
      {
        id: '4.3',
        title: 'Composite Server Actions',
        summary: 'Build the main business logic actions that orchestrate multiple atomic services.',
        steps: [
          {
            title: 'SA_DoRegisterUser (US1a)',
            instructions: [
              'Inputs: GivenName, FamilyName, Email, Password, UserRole, PhoneNumber, Bio, SkillProductClassIds, SkillProductTypeIds',
              'Outputs: UserId, PartyId, OutUserRole',
              'Flow: AddPerson (Party API) → User_CreateOrUpdate (System) → If UserRole = "Family" then SA_CreateFamily else SA_CreateCaregiver → Assign outputs → End',
            ],
          },
          {
            title: 'SA_DoLoginUser (US1a)',
            instructions: [
              'Inputs: Email, Password',
              'Outputs: UserId, PartyId, UserRole, GivenName',
              'Flow: User_Login → GetUserId() → Try SA_GetFamilyByUserId (if FamilyNotFoundException → SA_GetCaregiverByUserId) → GetPerson (Party API) → End',
            ],
            tip: 'Use an Exception Handler around SA_GetFamilyByUserId to catch FamilyNotFoundException, then try Caregiver.',
          },
          {
            title: 'SA_RequestCareVisit (US1b)',
            instructions: [
              'Inputs: FamilyId, PatientName, SkillProductTypeId, RequestedDate, StartTime, EndTime, Notes, DocumentFile (base64), DocumentFileName',
              'Flow: SA_CreateRequest → If DocumentFile not empty: SA_UploadToS3 → update request with S3Key → SA_PublishEvent("CareRequestCreated") → End',
            ],
          },
          {
            title: 'SA_MatchAndAssign (US2)',
            instructions: [
              'Input: CareRequestId',
              'Output: Assigned (Boolean)',
              'Flow: SA_GetRequestById → SA_GetAvailableCaregivers → loop through caregivers → match by SkillProductTypeId → SA_AssignCaregiver → SA_CreateVisit → SA_HoldPayment → SA_PublishEvent("CaregiverAssigned") → End',
            ],
            important: 'If no caregiver matches and AssignmentAttempts >= MaxAssignmentAttempts, escalate the request.',
          },
          {
            title: 'SA_ConfirmAndRelease (US3a)',
            instructions: [
              'Inputs: CareVisitId, CaregiverNotes, ProofPhotoFile, ProofPhotoFileName',
              'Flow: Upload proof photo → Update visit status = Completed → Release payment → Update ratings → Generate AI summary (hardcoded for now) → Update visit summary → Publish events',
            ],
            tip: 'For the AI summary, use a hardcoded string for now: "Care visit completed. Patient: " + PatientName + ". Duration: X hours."',
          },
          {
            title: 'SA_EscalateRequest (US3b) / SA_DisputeVisit',
            instructions: [
              'SA_EscalateRequest: Update request status to Escalated, publish EscalationTriggered event',
              'SA_DisputeVisit: Update visit status to Disputed, publish VisitDisputed event',
            ],
          },
        ],
      },
      {
        id: '4.4',
        title: 'ReassignmentCheck Timer',
        summary: 'A Timer that periodically checks for open care requests and attempts to assign caregivers.',
        steps: [
          {
            title: 'Create the Timer',
            instructions: [
              'Logic > right-click Timers > Add Timer > name: ReassignmentCheck',
              'In Properties: Schedule = "Every 30 minutes" (or use TimerIntervalMinutes site property)',
              'Double-click to open flow',
              'Flow: SA_GetOpenRequests → For Each request → SA_MatchAndAssign → End',
            ],
            important: 'The Timer runs on the server automatically. It picks up requests that failed initial assignment and retries.',
          },
        ],
      },
      {
        id: '4.5',
        title: 'Expose Composite REST Endpoints',
        summary: 'Create REST APIs that the UI team calls for user registration, login, care requests, and visit management.',
        steps: [
          {
            title: 'Create exposed REST APIs',
            instructions: [
              'Expose REST API: "User" — RegisterUser (POST), LoginUser (POST)',
              'Expose REST API: "CareRequest" — RequestCareVisit (POST), GetRequestsByFamilyId (GET), MatchAndAssign (POST)',
              'Expose REST API: "CareVisit" — ConfirmAndRelease (POST), DisputeVisit (POST), GetVisitsByCaregiverId (GET)',
              'Each method calls its corresponding SA_* composite action',
            ],
          },
          {
            title: 'Publish and test the full workflow',
            instructions: [
              '1-Click Publish all modules (publish atomics first, then CC_Orchestration)',
              'Open Swagger UI for CC_Orchestration',
              'Test: RegisterUser → LoginUser → RequestCareVisit → MatchAndAssign → ConfirmAndRelease',
            ],
            tip: 'Publish order matters: atomic services first, then CC_Orchestration (which depends on them).',
          },
        ],
      },
    ],
  },
  {
    id: 5,
    title: 'Seed Product Data',
    description: 'Create the product taxonomy (Family > Class > Type) in SMULab so caregivers can declare skills and families can select care types.',
    timeEstimate: '30-45 min',
    sections: [
      {
        id: '5.1',
        title: 'Create Product Hierarchy',
        summary: 'Use Swagger UI or Postman to create 1 Product Family, 3 Product Classes, and 10 Product Types.',
        steps: [
          {
            title: 'Get your API key',
            instructions: [
              'Go to SMULab Utilities: smuedu-dev.outsystemsenterprise.com/SMULabUtilities/',
              'Register for an API key (sent to your email)',
              'Add header X-Contacts-Key to every Product API call',
            ],
          },
          {
            title: 'Create Product Family',
            instructions: [
              'POST /AddProductFamily',
              'Body: { "Name": "Home Care Services", "Description": "Home-based caregiving services" }',
              'Copy the returned ProductFamilyId — you need it for classes and Site Properties',
            ],
          },
          {
            title: 'Create 3 Product Classes',
            instructions: [
              'POST /AddProductClass for each:',
              'Elderly Care — "Care services for elderly individuals"',
              'Child Special Needs — "Care services for children with special needs"',
              'Post-Surgery Recovery — "Care services for post-surgery recovery"',
              'Copy each ProductClassId — these become your Site Property values',
            ],
          },
          {
            title: 'Create 10 Product Types',
            instructions: [
              'Under Elderly Care: Mobility Assistance, Medication Reminders, Dementia Care Support, Meal Preparation',
              'Under Child Special Needs: ABA Therapy Companion, Communication Assistance, Sensory Activity Support',
              'Under Post-Surgery Recovery: Wound Care Observation, Physical Therapy Support, Post-Op Medication Management',
            ],
          },
          {
            title: 'Update Site Properties',
            instructions: [
              'Go to Service Center > Factory > Modules > CC_Orchestration > Site Properties',
              'Set DefaultProductFamilyId = the ProductFamilyId you copied',
              'Set ElderlyCarePCId, ChildSNPCId, PostSurgPCId to the respective ProductClassIds',
            ],
            important: 'Use Service Center (web), not Service Studio, to update Site Property values in the deployed environment.',
          },
        ],
      },
    ],
  },
]
