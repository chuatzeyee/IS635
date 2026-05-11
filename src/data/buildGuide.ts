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
  // ──────────────────────────────────────────────
  // PHASE 1: Module Setup
  // ──────────────────────────────────────────────
  {
    id: 1,
    title: 'Module Setup',
    description:
      'Create the application, 6 Service modules, static entities, and site properties in **CC_Orchestration**.',
    timeEstimate: '1-2 hours',
    sections: [
      {
        id: '1.1',
        title: 'Module Types — Service vs Reactive Web App',
        summary:
          'All 6 backend modules are **Service** modules. Only the frontend **CareConnect_UI** is a **Reactive Web App**.',
        steps: [
          {
            title: 'Understand the 6 Service modules',
            instructions: [
              '**CareConnect_Family** — entity + REST APIs, no UI',
              '**CareConnect_Caregiver** — entity + REST APIs, no UI',
              '**CareConnect_AvailabilitySlot** — entity + REST APIs, no UI',
              '**CareConnect_CareRequest** — entity + REST APIs, no UI',
              '**CareConnect_CareVisit** — entity + REST APIs, no UI',
              '**CC_Orchestration** — composites + REST APIs, no UI',
            ],
            tip: 'Service modules skip the Interface layer (screens, blocks, themes) — no dead weight for headless services.',
            important:
              'Only the frontend team applies the theme (**IS635_AY25T3_Team2**) to **CareConnect_UI**. Backend Service modules have no **Interface** tab.',
          },
        ],
      },
      {
        id: '1.2',
        title: 'Create the Application & First Module',
        summary:
          'Create the **CareConnect Integration** application in **Service Studio** with the first module.',
        steps: [
          {
            title: 'Create CareConnect Integration app',
            instructions: [
              'Open **Service Studio** > **New Application**',
              'Select **Service** > click **Next**',
              'Application Name: **CareConnect Integration**',
              'First module name: **CareConnect_Family** (type: **Service**)',
              'Click **Create Module**',
            ],
          },
          {
            title: 'Create remaining 5 modules',
            instructions: [
              'Click the application name tab at the top-left to return to the application overview',
              'Right-click **CareConnect Integration** > **Add Module**',
              'Create: **CareConnect_Caregiver** (type: **Service**)',
              'Create: **CareConnect_AvailabilitySlot** (type: **Service**)',
              'Create: **CareConnect_CareRequest** (type: **Service**)',
              'Create: **CareConnect_CareVisit** (type: **Service**)',
              'Create: **CC_Orchestration** (type: **Service**)',
            ],
            important:
              'Spelling matters for REST URLs — use exact module names with underscores.',
          },
        ],
      },
      {
        id: '1.4',
        title: 'Create Static Entities in CC_Orchestration',
        summary:
          'Create **CareRequestStatus**, **VisitStatus**, and **PaymentStatus** static entities with their records.',
        steps: [
          {
            title: 'Create CareRequestStatus',
            instructions: [
              'Open **CC_Orchestration** module',
              '**Data** tab > right-click **Entities** > **Add Static Entity**',
              'Name: **CareRequestStatus**',
              'Right-click **CareRequestStatus** > **Add Record** for each:',
              '**Open**',
              '**Assigned**',
              '**Completed**',
              '**Cancelled**',
              '**Escalated**',
            ],
          },
          {
            title: 'Create VisitStatus',
            instructions: [
              'Right-click **Entities** > **Add Static Entity**',
              'Name: **VisitStatus**',
              'Add records:',
              '**Scheduled**',
              '**Completed**',
              '**Disputed**',
              '**Escalated**',
            ],
          },
          {
            title: 'Create PaymentStatus',
            instructions: [
              'Right-click **Entities** > **Add Static Entity**',
              'Name: **PaymentStatus**',
              'Add records:',
              '**Held**',
              '**Released**',
              '**Refunded**',
            ],
          },
          {
            title: 'Make static entities Public',
            instructions: [
              'Click **CareRequestStatus** > in the **Properties** panel, set **Public** = **Yes**',
              'Click **VisitStatus** > set **Public** = **Yes**',
              'Click **PaymentStatus** > set **Public** = **Yes**',
              '**1-Click Publish** (**Ctrl+Shift+P**)',
            ],
            tip: 'Setting **Public** = **Yes** allows other modules (e.g., **CareConnect_CareRequest**, **CareConnect_CareVisit**) to reference these status values via **Manage Dependencies**.',
          },
        ],
      },
      {
        id: '1.5',
        title: 'Create Site Properties',
        summary:
          'Configure runtime settings for API keys, RabbitMQ credentials, and product IDs in **CC_Orchestration**.',
        steps: [
          {
            title: 'Add all Site Properties in CC_Orchestration',
            instructions: [
              '**Data** tab > right-click **Site Properties** > **Add Site Property** for each:',
              '**DefaultProductFamilyId** (**Text**) — Home Care Services family ID',
              '**ElderlyCarePCId** (**Text**) — Elderly Care ProductClass ID',
              '**ChildSNPCId** (**Text**) — Child Special Needs ProductClass ID',
              '**PostSurgPCId** (**Text**) — Post-Surgery Recovery ProductClass ID',
              '**MaxAssignmentAttempts** (**Integer**, default: **3**)',
              '**TimerIntervalMinutes** (**Integer**, default: **30**)',
              '**ProductAPIKey** (**Text**) — your SMULab API key',
              '**OpenAIApiKey** (**Text**) — for AI summary generation',
              '**RabbitMQ_Hostname** (**Text**)',
              '**RabbitMQ_VirtualHost** (**Text**)',
              '**RabbitMQ_Username** (**Text**)',
              '**RabbitMQ_Password** (**Text**)',
            ],
            important:
              'Leave the ID properties (**DefaultProductFamilyId**, **ElderlyCarePCId**, etc.) empty initially — you will fill them in Phase 5 after seeding product data.',
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // PHASE 2: Wrapper Services
  // ──────────────────────────────────────────────
  {
    id: 2,
    title: 'Wrapper Services',
    description:
      'Consume 4 external REST APIs via Swagger and create wrapper Server Actions + exposed REST endpoints in **CC_Orchestration**.',
    timeEstimate: '2-3 hours',
    sections: [
      {
        id: '2.1',
        title: 'Consume REST APIs via Swagger',
        summary:
          'Import 4 external wrappers (**Party**, **Product**, **RabbitMQ**, **S3**) using their Swagger URLs.',
        steps: [
          {
            title: 'How to consume a REST API',
            instructions: [
              'Open **CC_Orchestration** module',
              '**Logic** tab > **Integrations** > right-click **REST** > **Consume REST API...**',
              'Click the **Add Multiple Methods** tab',
              'Paste the Swagger URL > click **OK** / **Consume**',
              'Check the methods you need > click **Finish**',
              'OutSystems auto-generates consumed methods + **Structures**',
            ],
          },
          {
            title: 'Party wrapper (SMULab)',
            instructions: [
              'Swagger URL: **smuedu-dev.outsystemsenterprise.com/SMULab_Party/rest/Party/swagger.json**',
              'Select methods:',
              '**AddPerson**',
              '**GetPerson**',
              '**GetDocumentTypes**',
              '**GetRoleTypes**',
            ],
          },
          {
            title: 'Product wrapper (SMULab)',
            instructions: [
              'Swagger URL: **smuedu-dev.outsystemsenterprise.com/SMULab_Product/rest/Product/swagger.json**',
              'Select methods:',
              '**GetProductFamilies**',
              '**GetProductClasses**',
              '**GetProductTypes**',
              '**GetProductHierarchy**',
              '**AddProductFamily**',
              '**AddProductClass**',
              '**AddProductType**',
            ],
            important:
              'The Product API requires an **X-Contacts-Key** header. For EVERY Product method (all 7), add an input parameter: Name = **APIKey**, Send In = **Header**, Name in Header = **X-Contacts-Key**.',
          },
          {
            title: 'RabbitMQ wrapper (SMULab)',
            instructions: [
              'Swagger URL: **smuedu-dev.outsystemsenterprise.com/SMULab_RabbitMQ/rest/RabbitMQ/swagger.json**',
              'Select methods:',
              '**PublishMessage**',
              '**ConsumeMessage**',
              '**SubscribeMessage**',
              '**PutExchange**',
              '**PutQueue**',
              '**BindQueue**',
            ],
            tip: 'Every RabbitMQ method requires a **Connection** object. Use Site Properties (**Site.RabbitMQ_Hostname**, **Site.RabbitMQ_VirtualHost**, etc.) to fill it each time.',
          },
          {
            title: 'S3 / AmazonS3 wrapper (SMULab)',
            instructions: [
              'Swagger URL: **smuedu-dev.outsystemsenterprise.com/SMULab_AmazonS3/rest/AmazonS3/swagger.json**',
              'Select ALL 4 methods:',
              '**UploadFile**',
              '**FetchFile**',
              '**FetchFileUrl**',
              '**DeleteFile**',
            ],
            tip: 'All S3 methods use **POST** (not GET/DELETE). Each takes a single **Request** Structure as input — build the Structure first in an **Assign** node, then pass it.',
          },
        ],
      },
      {
        id: '2.2',
        title: 'Error Handling Exceptions',
        summary: 'Create custom exceptions for wrapper error handling in **CC_Orchestration**.',
        steps: [
          {
            title: 'Create exceptions in CC_Orchestration',
            instructions: [
              '**Logic** tab > right-click **Exceptions** > **Add Exception**',
              'Name: **RabbitMQException**',
              'Right-click **Exceptions** > **Add Exception**',
              'Name: **S3Exception**',
              'Leave defaults (Type = **User Exception**) for both',
            ],
          },
        ],
      },
      {
        id: '2.4',
        title: 'Wrapper Facade Server Actions',
        summary:
          'Create Server Actions that wrap consumed REST calls with proper inputs/outputs.',
        steps: [
          {
            title: 'SA_GetProductFamilies',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_GetProductFamilies**',
              'Add Output Parameter:',
              '**ProductFamilies** — Data Type: **ProductFamily List**',
              'Flow: **Start** → **GetProductFamilies** (set **APIKey** = **Site.ProductAPIKey**) → **Assign** (**ProductFamilies** = **GetProductFamilies.List**) → **End**',
            ],
          },
          {
            title: 'SA_GetProductClasses',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_GetProductClasses**',
              'Add Input Parameter:',
              '**ProductFamilyId** — Data Type: **Text**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**ProductClasses** — Data Type: **ProductClass List**',
              'Flow: **Start** → **GetProductClasses** (**ProductFamilyId** = **ProductFamilyId**, **APIKey** = **Site.ProductAPIKey**) → **Assign** (**ProductClasses** = **GetProductClasses.List**) → **End**',
            ],
          },
          {
            title: 'SA_GetProductTypes',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_GetProductTypes**',
              'Add Input Parameter:',
              '**ProductClassId** — Data Type: **Text**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**ProductTypes** — Data Type: **ProductType List**',
              'Flow: **Start** → **GetProductTypes** (**ProductClassId** = **ProductClassId**, **APIKey** = **Site.ProductAPIKey**) → **Assign** (**ProductTypes** = **GetProductTypes.List**) → **End**',
            ],
          },
          {
            title: 'SA_GetProductHierarchy',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_GetProductHierarchy**',
              'No Input Parameters',
              'Add Output Parameter:',
              '**Hierarchy** — Data Type: **ProductHierarchy List**',
              'Flow: **Start** → **GetProductHierarchy** (**APIKey** = **Site.ProductAPIKey**) → **Assign** (**Hierarchy** = **GetProductHierarchy.List**) → **End**',
            ],
          },
          {
            title: 'SA_UploadToS3',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_UploadToS3**',
              'Add Input Parameters:',
              '**FileName** — Data Type: **Text**, Is Mandatory: **Yes**',
              '**File** — Data Type: **Text** (base64 content), Is Mandatory: **Yes**',
              '**FolderName** — Data Type: **Text**, Is Mandatory: **Yes**',
              '**SubFolderName** — Data Type: **Text**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**S3Key** — Data Type: **Text**',
              'Add Local Variable:',
              '**UploadRequest** — Data Type: **UploadFileRequest** (Structure)',
              'Flow: **Start** → **Assign** (build **UploadRequest** from inputs) → **UploadFile** (**Request** = **UploadRequest**) → **Assign** (**S3Key** = **UploadFile.Response.S3Key**) → **End**',
              'Add **Exception Handler** → catch **AllExceptions** → **Raise Exception**: **S3Exception** with message **AllExceptions.ExceptionMessage**',
            ],
            tip: '**UploadFile** takes a single **Request** Structure — not individual fields. Build the Structure first with an **Assign** node.',
          },
          {
            title: 'SA_FetchFileUrl',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_FetchFileUrl**',
              'Add Input Parameters:',
              '**FolderName** — Data Type: **Text**, Is Mandatory: **Yes**',
              '**SubFolderName** — Data Type: **Text**, Is Mandatory: **Yes**',
              '**S3Key** — Data Type: **Text**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**FileUrl** — Data Type: **Text**',
              'Add Local Variable:',
              '**FetchUrlRequest** — Data Type: **FetchFileUrlRequest** (Structure)',
              'Flow: **Start** → **Assign** (build **FetchUrlRequest** from inputs) → **FetchFileUrl** (**Request** = **FetchUrlRequest**) → **Assign** (**FileUrl** = **FetchFileUrl.Response.Url**) → **End**',
            ],
          },
          {
            title: 'SA_PublishEvent (generic RabbitMQ publisher)',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_PublishEvent**',
              'Add Input Parameters:',
              '**ExchangeName** — Data Type: **Text**, Is Mandatory: **Yes**',
              '**RoutingKey** — Data Type: **Text**, Is Mandatory: **Yes**',
              '**Payload** — Data Type: **Text**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**Success** — Data Type: **Boolean**',
              'Add Local Variable:',
              '**PubRequest** — Data Type: **MyPublishMessageRequest** (Structure)',
              'First **Assign** node — build the request:',
              '**PubRequest.RoutingKey** = **RoutingKey**',
              '**PubRequest.Payload** = **Payload**',
              '**PubRequest.PayloadEncoding** = **"string"**',
              '**PubRequest.Connection.Hostname** = **Site.RabbitMQ_Hostname**',
              '**PubRequest.Connection.VirtualHost** = **Site.RabbitMQ_VirtualHost**',
              '**PubRequest.Connection.Port** = **0**',
              '**PubRequest.Connection.Username** = **Site.RabbitMQ_Username**',
              '**PubRequest.Connection.Password** = **Site.RabbitMQ_Password**',
              'Flow: **Start** → **Assign** → **PublishMessage** (**Exchange** = **ExchangeName**, **Request** = **PubRequest**) → **Assign** (**Success** = **True**) → **End**',
              'Add **Exception Handler** → catch **AllExceptions** → **Raise Exception**: **RabbitMQException**',
            ],
          },
        ],
      },
      {
        id: '2.5',
        title: 'Expose Wrapper Facades as REST Endpoints',
        summary:
          'Create exposed REST APIs so the UI team and Swagger can access your wrappers.',
        steps: [
          {
            title: 'Create "Product" REST API',
            instructions: [
              '**Logic** tab > **Integrations** > **REST** > right-click **REST** > **Expose REST API**',
              'Name: **Product**',
              'Right-click **Product** > **Add REST API Method**:',
              '**GetProductFamilies** — HTTP Method: **GET**',
              'Flow: **Start** → **SA_GetProductFamilies** → **Assign** output → **End**',
              'Right-click **Product** > **Add REST API Method**:',
              '**GetProductClasses** — HTTP Method: **GET**',
              'Add Input Parameter: **ProductFamilyId** (**Text**, Receive In: **URL**)',
              'Flow: **Start** → **SA_GetProductClasses**(**ProductFamilyId**) → **Assign** output → **End**',
              'Right-click **Product** > **Add REST API Method**:',
              '**GetProductTypes** — HTTP Method: **GET**',
              'Add Input Parameter: **ProductClassId** (**Text**, Receive In: **URL**)',
              'Flow: **Start** → **SA_GetProductTypes**(**ProductClassId**) → **Assign** output → **End**',
              'Right-click **Product** > **Add REST API Method**:',
              '**GetProductHierarchy** — HTTP Method: **GET**',
              'Flow: **Start** → **SA_GetProductHierarchy** → **Assign** output → **End**',
            ],
          },
          {
            title: 'Create "Storage" REST API',
            instructions: [
              'Right-click **REST** > **Expose REST API**',
              'Name: **Storage**',
              'Right-click **Storage** > **Add REST API Method**:',
              '**UploadFile** — HTTP Method: **POST**',
              'Add Input Parameter: **Request** — Data Type: **UploadFileRequest**, Receive In: **Body**',
              'Add Output Parameter: **S3Key** — Data Type: **Text**',
              'Right-click **Storage** > **Add REST API Method**:',
              '**GetFileUrl** — HTTP Method: **POST**',
              'Add Input Parameter: **Request** — Data Type: **FetchFileUrlRequest**, Receive In: **Body**',
              'Add Output Parameter: **FileUrl** — Data Type: **Text**',
            ],
            important:
              'OutSystems only allows one input with **Receive In** = **Body** — use the Structure type as a single input.',
          },
          {
            title: 'Verify and publish',
            instructions: [
              '**1-Click Publish** (**Ctrl+Shift+P**)',
              'Right-click exposed REST API > **Open Documentation** to test via **Swagger UI**',
              'Try **GET /GetProductFamilies** — should return JSON (may be empty if no products seeded yet)',
            ],
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // PHASE 3: Atomic Services
  // ──────────────────────────────────────────────
  {
    id: 3,
    title: 'Atomic Services',
    description:
      'Build 5 atomic CRUD services: **Family**, **Caregiver**, **AvailabilitySlot**, **CareRequest**, **CareVisit+Payment**. Each follows the same pattern.',
    timeEstimate: '4-6 hours',
    sections: [
      // ── 3.pattern ──
      {
        id: '3.pattern',
        title: 'The Atomic Service Pattern',
        summary:
          'Every atomic service follows the same 5-step pattern. Learn it once, apply it 5 times.',
        steps: [
          {
            title: 'The pattern for each service module',
            instructions: [
              '1. **Create Entity** (**Data** tab) — define attributes, indexes, set PK to **AutoNumber**',
              '2. **Create User Exception** (**Logic** tab) — e.g., **FamilyNotFoundException**',
              '3. **Create Server Actions** (**Logic** tab) — CRUD operations with proper flows',
              '4. **Expose REST APIs** (**Logic** > **Integrations** > **REST**) — wire each endpoint to its Server Action',
              '5. **Publish and test** via **Swagger UI**',
            ],
            tip: 'The **Family** service (3A) is written with full click-by-click detail. The remaining services follow the same steps with different attribute names.',
          },
        ],
      },

      // ── 3A: Family Service ──
      {
        id: '3A',
        title: 'Family Service (CareConnect_Family)',
        summary:
          'Entity with 10 attributes, 2 indexes, 1 exception, 5 Server Actions, 5 REST endpoints.',
        steps: [
          // Entity
          {
            title: 'Create the Family Entity',
            instructions: [
              'Open the **CareConnect_Family** module',
              '**Data** tab > right-click **Entities** > **Add Entity**',
              'Name: **Family**',
              'Click the auto-generated **Id** attribute > rename it to **FamilyId**',
              'In the **Properties** panel set **Is AutoNumber** = **Yes**',
            ],
          },
          {
            title: 'Add Family Entity attributes',
            instructions: [
              'Right-click **Family** > **Add Entity Attribute** for each:',
              '**UserId** — Data Type: **Long Integer**',
              '**PartyId** — Data Type: **Text**, Length: **50**',
              '**Email** — Data Type: **Text**, Length: **200**',
              '**PhoneNumber** — Data Type: **Text**, Length: **20**',
              '**PreferredSkillProductTypeIds** — Data Type: **Text**, Length: **500**',
              '**Rating** — Data Type: **Decimal**, Length: **10**, Decimals: **2**',
              '**TotalRequests** — Data Type: **Integer**',
              '**IsActive** — Data Type: **Boolean**, Default Value: **True**',
              '**CreatedAt** — Data Type: **Date Time**',
              '**UpdatedAt** — Data Type: **Date Time**',
            ],
          },
          {
            title: 'Create indexes on Family',
            instructions: [
              'Click **Family** entity > in the **Properties** panel scroll to **Indexes**',
              'Click **+** to add a new index',
              'Name: **idx_UserId**',
              'Add attribute: **UserId**',
              'Click **+** again to add a second index',
              'Name: **idx_PartyId**',
              'Add attribute: **PartyId**',
            ],
          },
          // Exception
          {
            title: 'Create the FamilyNotFoundException exception',
            instructions: [
              '**Logic** tab > right-click **Exceptions** > **Add Exception**',
              'Name: **FamilyNotFoundException**',
              'Leave defaults (Type = **User Exception**)',
            ],
          },
          // SA_CreateFamily
          {
            title: 'Server Action: SA_CreateFamily',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_CreateFamily**',
              'Add Input Parameters:',
              '**UserId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              '**PartyId** — Data Type: **Text**, Is Mandatory: **Yes**',
              '**Email** — Data Type: **Text**, Is Mandatory: **Yes**',
              '**PhoneNumber** — Data Type: **Text**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**Result** — Data Type: **Family**',
              'Add Local Variable:',
              '**Result** — Data Type: **Family** (if not using the output directly)',
            ],
          },
          {
            title: 'SA_CreateFamily — build the flow',
            instructions: [
              'Drag an **Assign** node after **Start**',
              'Add assignments:',
              '**Result.UserId** = **UserId**',
              '**Result.PartyId** = **PartyId**',
              '**Result.Email** = **Email**',
              '**Result.PhoneNumber** = **PhoneNumber**',
              '**Result.IsActive** = **True**',
              '**Result.CreatedAt** = **CurrDateTime()**',
              '**Result.UpdatedAt** = **CurrDateTime()**',
              'Drag the **CreateFamily** CRUD action (from the **Family** entity) after the **Assign**',
              'Set its **Source** = **Result**',
              'Drag another **Assign** node after **CreateFamily**',
              '**Result.FamilyId** = **CreateFamily.Id**',
              'Connect to **End**',
            ],
            tip: 'The **CreateFamily** CRUD action is auto-generated when you create the entity. Find it under **Data** > **Family** > **CreateFamily**. Drag it onto the flow canvas.',
          },
          // SA_GetFamilyByUserId
          {
            title: 'Server Action: SA_GetFamilyByUserId',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_GetFamilyByUserId**',
              'Add Input Parameter:',
              '**UserId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**Result** — Data Type: **Family**',
            ],
          },
          {
            title: 'SA_GetFamilyByUserId — build the flow',
            instructions: [
              'Drag an **Aggregate** onto the flow after **Start**',
              'Double-click the **Aggregate** to open it',
              'Add Source: **Family** entity',
              'Go to the **Filters** tab > click **Add Filter**',
              'Filter: **Family.UserId** = **UserId**',
              'Close the Aggregate editor',
              'Drag an **If** node after the **Aggregate**',
              'Condition: **GetFamilies.List.Empty**',
              'On the **True** branch (list is empty):',
              'Drag a **Raise Exception** node',
              'Select exception: **FamilyNotFoundException**',
              'Message: **"Family not found for the given UserId"**',
              'On the **False** branch (record found):',
              'Drag an **Assign** node',
              '**Result** = **GetFamilies.List.Current.Family**',
              'Connect to **End**',
            ],
          },
          // SA_GetFamilyById
          {
            title: 'Server Action: SA_GetFamilyById',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_GetFamilyById**',
              'Add Input Parameter:',
              '**FamilyId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**Result** — Data Type: **Family**',
            ],
          },
          {
            title: 'SA_GetFamilyById — build the flow',
            instructions: [
              'Drag an **Aggregate** onto the flow after **Start**',
              'Double-click to open > Add Source: **Family**',
              'Filter: **Family.FamilyId** = **LongIntegerToIdentifier(FamilyId)**',
              'Close the Aggregate editor',
              'Drag an **If** node after the **Aggregate**',
              'Condition: **GetFamilies.List.Empty**',
              'True branch: **Raise Exception** > **FamilyNotFoundException** with message **"Family not found for the given FamilyId"**',
              'False branch: **Assign** > **Result** = **GetFamilies.List.Current.Family**',
              'Connect to **End**',
            ],
            tip: 'Use **LongIntegerToIdentifier()** to convert the **Long Integer** input to an **Identifier** type that matches the entity PK.',
          },
          // SA_UpdateFamily
          {
            title: 'Server Action: SA_UpdateFamily',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_UpdateFamily**',
              'Add Input Parameters:',
              '**FamilyId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              '**Email** — Data Type: **Text**, Is Mandatory: **Yes**',
              '**PhoneNumber** — Data Type: **Text**, Is Mandatory: **Yes**',
              '**PreferredSkillProductTypeIds** — Data Type: **Text**, Is Mandatory: **No**',
              'Add Output Parameter:',
              '**Success** — Data Type: **Boolean**',
            ],
          },
          {
            title: 'SA_UpdateFamily — build the flow',
            instructions: [
              'Drag an **Aggregate** onto the flow after **Start**',
              'Double-click > Add Source: **Family**',
              'Filter: **Family.FamilyId** = **LongIntegerToIdentifier(FamilyId)**',
              'Close the Aggregate editor',
              'Drag an **If** node after the **Aggregate**',
              'Condition: **GetFamilies.List.Empty**',
              'True branch: **Raise Exception** > **FamilyNotFoundException**',
              'False branch: Drag an **Assign** node',
              '**GetFamilies.List.Current.Family.Email** = **Email**',
              '**GetFamilies.List.Current.Family.PhoneNumber** = **PhoneNumber**',
              '**GetFamilies.List.Current.Family.PreferredSkillProductTypeIds** = **PreferredSkillProductTypeIds**',
              '**GetFamilies.List.Current.Family.UpdatedAt** = **CurrDateTime()**',
              'Drag the **UpdateFamily** CRUD action after the **Assign**',
              'Set **Source** = **GetFamilies.List.Current.Family**',
              'Drag another **Assign**: **Success** = **True**',
              'Connect to **End**',
            ],
          },
          // SA_ListFamiliesByRating
          {
            title: 'Server Action: SA_ListFamiliesByRating',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_ListFamiliesByRating**',
              'Add Input Parameters:',
              '**MinimumRating** — Data Type: **Decimal**, Default Value: **0**',
              '**Limit** — Data Type: **Integer**, Default Value: **10**',
              'Add Output Parameter:',
              '**Results** — Data Type: **Family List**',
            ],
          },
          {
            title: 'SA_ListFamiliesByRating — build the flow',
            instructions: [
              'Drag an **Aggregate** onto the flow after **Start**',
              'Double-click > Add Source: **Family**',
              'Filter: **Family.Rating** >= **MinimumRating**',
              'Go to the **Sorting** tab > click **Add Sort**',
              'Sort by: **Family.Rating**, Order: **Descending**',
              'In the **Aggregate** properties panel, set **Max. Records** = **Limit**',
              'Close the Aggregate editor',
              'Drag an **Assign** node:',
              '**Results** = **GetFamilies.List**',
              'Connect to **End**',
            ],
          },
          // REST Endpoints
          {
            title: 'Create the "Family" Exposed REST API',
            instructions: [
              '**Logic** tab > **Integrations** > **REST** > right-click **REST** > **Expose REST API**',
              'Name: **Family**',
            ],
          },
          {
            title: 'REST Endpoint: POST /families — CreateFamily',
            instructions: [
              'Right-click **Family** REST API > **Add REST API Method**',
              'Name: **CreateFamily**',
              'HTTP Method: **POST**',
              'Create a **Structure** first (if not already):',
              '**Data** tab > right-click **Structures** > **Add Structure**',
              'Name: **CreateFamilyRequest**',
              'Add attributes: **UserId** (**Long Integer**), **PartyId** (**Text**), **Email** (**Text**), **PhoneNumber** (**Text**)',
              'Back in the REST method, add Input Parameter:',
              '**Request** — Data Type: **CreateFamilyRequest**, Receive In: **Body**',
              'Add Output Parameter:',
              '**Result** — Data Type: **Family**',
              'Flow: **Start** → **SA_CreateFamily** (pass **Request.UserId**, **Request.PartyId**, **Request.Email**, **Request.PhoneNumber**) → **Assign** (**Result** = **SA_CreateFamily.Result**) → **End**',
            ],
          },
          {
            title: 'REST Endpoint: GET /families/{UserId} — GetFamilyByUserId',
            instructions: [
              'Right-click **Family** REST API > **Add REST API Method**',
              'Name: **GetFamilyByUserId**',
              'HTTP Method: **GET**',
              'Add Input Parameter:',
              '**UserId** — Data Type: **Long Integer**, Receive In: **URL**',
              'Add Output Parameter:',
              '**Result** — Data Type: **Family**',
              'Flow: **Start** → **SA_GetFamilyByUserId** (**UserId** = **UserId**) → **Assign** (**Result** = **SA_GetFamilyByUserId.Result**) → **End**',
            ],
          },
          {
            title: 'REST Endpoint: GET /families/id/{FamilyId} — GetFamilyById',
            instructions: [
              'Right-click **Family** REST API > **Add REST API Method**',
              'Name: **GetFamilyById**',
              'HTTP Method: **GET**',
              'Add Input Parameter:',
              '**FamilyId** — Data Type: **Long Integer**, Receive In: **URL**',
              'Add Output Parameter:',
              '**Result** — Data Type: **Family**',
              'Flow: **Start** → **SA_GetFamilyById** (**FamilyId** = **FamilyId**) → **Assign** (**Result** = **SA_GetFamilyById.Result**) → **End**',
            ],
          },
          {
            title: 'REST Endpoint: PUT /families/{FamilyId} — UpdateFamily',
            instructions: [
              'Right-click **Family** REST API > **Add REST API Method**',
              'Name: **UpdateFamily**',
              'HTTP Method: **PUT**',
              'Add Input Parameter for URL:',
              '**FamilyId** — Data Type: **Long Integer**, Receive In: **URL**',
              'Create a **Structure**:',
              'Name: **UpdateFamilyRequest**',
              'Add attributes: **Email** (**Text**), **PhoneNumber** (**Text**), **PreferredSkillProductTypeIds** (**Text**)',
              'Add Input Parameter for Body:',
              '**Request** — Data Type: **UpdateFamilyRequest**, Receive In: **Body**',
              'Add Output Parameter:',
              '**Success** — Data Type: **Boolean**',
              'Flow: **Start** → **SA_UpdateFamily** (**FamilyId**, **Request.Email**, **Request.PhoneNumber**, **Request.PreferredSkillProductTypeIds**) → **Assign** (**Success** = **SA_UpdateFamily.Success**) → **End**',
            ],
          },
          {
            title: 'REST Endpoint: GET /families/list-by-rating — ListByRating',
            instructions: [
              'Right-click **Family** REST API > **Add REST API Method**',
              'Name: **ListByRating**',
              'HTTP Method: **GET**',
              'Add Input Parameters (both Receive In: **Query String**):',
              '**MinimumRating** — Data Type: **Decimal**, Default Value: **0**',
              '**Limit** — Data Type: **Integer**, Default Value: **10**',
              'Add Output Parameter:',
              '**Results** — Data Type: **Family List**',
              'Flow: **Start** → **SA_ListFamiliesByRating** (**MinimumRating**, **Limit**) → **Assign** (**Results** = **SA_ListFamiliesByRating.Results**) → **End**',
            ],
          },
          {
            title: 'Publish and test Family service',
            instructions: [
              '**1-Click Publish** (**Ctrl+Shift+P**)',
              'Right-click the **Family** REST API > **Open Documentation**',
              'Test **POST /families** with a sample JSON body',
              'Test **GET /families/{UserId}** with the UserId you just created',
            ],
            tip: 'For **GET** methods, input parameters with **Receive In** = **URL** appear as path segments. Parameters with **Receive In** = **Query String** appear as **?key=value** pairs.',
          },
        ],
      },

      // ── 3B: Caregiver Service ──
      {
        id: '3B',
        title: 'Caregiver Service (CareConnect_Caregiver)',
        summary:
          'Entity with 13 attributes, 3 indexes, 1 exception, 7 Server Actions, 7 REST endpoints.',
        steps: [
          // Entity
          {
            title: 'Create the Caregiver Entity',
            instructions: [
              'Open the **CareConnect_Caregiver** module',
              '**Data** tab > right-click **Entities** > **Add Entity**',
              'Name: **Caregiver**',
              'Rename **Id** to **CaregiverId**',
              'Set **Is AutoNumber** = **Yes**',
            ],
          },
          {
            title: 'Add Caregiver Entity attributes',
            instructions: [
              'Right-click **Caregiver** > **Add Entity Attribute** for each:',
              '**UserId** — Data Type: **Long Integer**',
              '**PartyId** — Data Type: **Text**, Length: **50**',
              '**Bio** — Data Type: **Text**, Length: **500**',
              '**SkillProductClassIds** — Data Type: **Text**, Length: **500**',
              '**SkillProductTypeIds** — Data Type: **Text**, Length: **500**',
              '**IsAvailable** — Data Type: **Boolean**, Default Value: **True**',
              '**IsVerified** — Data Type: **Boolean**, Default Value: **False**',
              '**Rating** — Data Type: **Decimal**, Length: **10**, Decimals: **2**',
              '**TotalVisits** — Data Type: **Integer**',
              '**ResponseTime** — Data Type: **Integer**',
              '**LastAssignedAt** — Data Type: **Date Time**',
              '**CreatedAt** — Data Type: **Date Time**',
              '**UpdatedAt** — Data Type: **Date Time**',
            ],
          },
          {
            title: 'Create indexes on Caregiver',
            instructions: [
              'Click **Caregiver** entity > **Properties** panel > **Indexes**',
              'Add index: **idx_UserId** on attribute **UserId**',
              'Add index: **idx_PartyId** on attribute **PartyId**',
              'Add index: **idx_IsAvailable** on attribute **IsAvailable**',
            ],
          },
          // Exception
          {
            title: 'Create the CaregiverNotFoundException exception',
            instructions: [
              '**Logic** tab > right-click **Exceptions** > **Add Exception**',
              'Name: **CaregiverNotFoundException**',
              'Leave defaults (Type = **User Exception**)',
            ],
          },
          // SA_CreateCaregiver
          {
            title: 'Server Action: SA_CreateCaregiver',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_CreateCaregiver**',
              'Add Input Parameters:',
              '**UserId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              '**PartyId** — Data Type: **Text**, Is Mandatory: **Yes**',
              '**Bio** — Data Type: **Text**, Is Mandatory: **No**',
              '**SkillProductClassIds** — Data Type: **Text**, Is Mandatory: **No**',
              '**SkillProductTypeIds** — Data Type: **Text**, Is Mandatory: **No**',
              'Add Output Parameter:',
              '**Result** — Data Type: **Caregiver**',
            ],
          },
          {
            title: 'SA_CreateCaregiver — build the flow',
            instructions: [
              'Drag an **Assign** node after **Start**',
              '**Result.UserId** = **UserId**',
              '**Result.PartyId** = **PartyId**',
              '**Result.Bio** = **Bio**',
              '**Result.SkillProductClassIds** = **SkillProductClassIds**',
              '**Result.SkillProductTypeIds** = **SkillProductTypeIds**',
              '**Result.IsAvailable** = **True**',
              '**Result.IsVerified** = **False**',
              '**Result.Rating** = **0**',
              '**Result.TotalVisits** = **0**',
              '**Result.ResponseTime** = **0**',
              '**Result.CreatedAt** = **CurrDateTime()**',
              '**Result.UpdatedAt** = **CurrDateTime()**',
              'Drag **CreateCaregiver** CRUD action after the **Assign**',
              'Set **Source** = **Result**',
              'Drag another **Assign**:',
              '**Result.CaregiverId** = **CreateCaregiver.Id**',
              'Connect to **End**',
            ],
          },
          // SA_GetCaregiverByUserId
          {
            title: 'Server Action: SA_GetCaregiverByUserId',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_GetCaregiverByUserId**',
              'Add Input Parameter:',
              '**UserId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**Result** — Data Type: **Caregiver**',
            ],
          },
          {
            title: 'SA_GetCaregiverByUserId — build the flow',
            instructions: [
              'Drag an **Aggregate** > Add Source: **Caregiver**',
              'Filter: **Caregiver.UserId** = **UserId**',
              'Drag an **If** node:',
              'Condition: **GetCaregivers.List.Empty**',
              'True branch: **Raise Exception** > **CaregiverNotFoundException** with message **"Caregiver not found for the given UserId"**',
              'False branch: **Assign** > **Result** = **GetCaregivers.List.Current.Caregiver**',
              'Connect to **End**',
            ],
          },
          // SA_GetCaregiverById
          {
            title: 'Server Action: SA_GetCaregiverById',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_GetCaregiverById**',
              'Add Input Parameter:',
              '**CaregiverId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**Result** — Data Type: **Caregiver**',
            ],
          },
          {
            title: 'SA_GetCaregiverById — build the flow',
            instructions: [
              'Drag an **Aggregate** > Add Source: **Caregiver**',
              'Filter: **Caregiver.CaregiverId** = **LongIntegerToIdentifier(CaregiverId)**',
              'Drag an **If** node:',
              'Condition: **GetCaregivers.List.Empty**',
              'True branch: **Raise Exception** > **CaregiverNotFoundException** with message **"Caregiver not found for the given CaregiverId"**',
              'False branch: **Assign** > **Result** = **GetCaregivers.List.Current.Caregiver**',
              'Connect to **End**',
            ],
          },
          // SA_ListCaregiversBySkills
          {
            title: 'Server Action: SA_ListCaregiversBySkills',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_ListCaregiversBySkills**',
              'Add Input Parameters:',
              '**SkillProductClassId** — Data Type: **Text**, Is Mandatory: **Yes**',
              '**SkillProductTypeId** — Data Type: **Text**, Is Mandatory: **No** (optional for broader match)',
              '**ExcludeIds** — Data Type: **Text**, Is Mandatory: **No** (comma-separated IDs to exclude)',
              'Add Output Parameter:',
              '**Results** — Data Type: **Caregiver List**',
            ],
          },
          {
            title: 'SA_ListCaregiversBySkills — build the flow',
            instructions: [
              'Drag an **Aggregate** > Add Source: **Caregiver**',
              'Add Filters:',
              '**Caregiver.IsAvailable** = **True**',
              '**Caregiver.SkillProductClassIds** like **"%" + SkillProductClassId + "%"**',
              'Go to the **Sorting** tab > Add Sort:',
              '**Caregiver.LastAssignedAt** — Order: **Ascending** (round-robin: least recently assigned first)',
              'Close the Aggregate editor',
              'This is Pass 1 — exact skill class match',
              'Optionally add a second pass (Pass 2) with a broader category match if Pass 1 returns no results',
              'Drag an **Assign** node:',
              '**Results** = **GetCaregivers.List**',
              'Connect to **End**',
            ],
            tip: 'The **LIKE** filter with **"%" + SkillProductClassId + "%"** matches caregivers whose comma-separated skill list contains the target class. Sorting by **LastAssignedAt Ascending** ensures round-robin assignment.',
          },
          // SA_UpdateCaregiver
          {
            title: 'Server Action: SA_UpdateCaregiver',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_UpdateCaregiver**',
              'Add Input Parameters:',
              '**CaregiverId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              '**Bio** — Data Type: **Text**, Is Mandatory: **No**',
              '**SkillProductClassIds** — Data Type: **Text**, Is Mandatory: **No**',
              '**SkillProductTypeIds** — Data Type: **Text**, Is Mandatory: **No**',
              '**IsAvailable** — Data Type: **Boolean**, Is Mandatory: **No**',
              'Add Output Parameter:',
              '**Success** — Data Type: **Boolean**',
            ],
          },
          {
            title: 'SA_UpdateCaregiver — build the flow',
            instructions: [
              'Drag an **Aggregate** > Add Source: **Caregiver**',
              'Filter: **Caregiver.CaregiverId** = **LongIntegerToIdentifier(CaregiverId)**',
              'Drag an **If** node:',
              'Condition: **GetCaregivers.List.Empty**',
              'True branch: **Raise Exception** > **CaregiverNotFoundException**',
              'False branch: Drag an **Assign** node:',
              '**GetCaregivers.List.Current.Caregiver.Bio** = **Bio**',
              '**GetCaregivers.List.Current.Caregiver.SkillProductClassIds** = **SkillProductClassIds**',
              '**GetCaregivers.List.Current.Caregiver.SkillProductTypeIds** = **SkillProductTypeIds**',
              '**GetCaregivers.List.Current.Caregiver.IsAvailable** = **IsAvailable**',
              '**GetCaregivers.List.Current.Caregiver.UpdatedAt** = **CurrDateTime()**',
              'Drag **UpdateCaregiver** CRUD action',
              'Set **Source** = **GetCaregivers.List.Current.Caregiver**',
              'Drag **Assign**: **Success** = **True**',
              'Connect to **End**',
            ],
          },
          // SA_UpdateCaregiverRating
          {
            title: 'Server Action: SA_UpdateCaregiverRating',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_UpdateCaregiverRating**',
              'Add Input Parameter:',
              '**CaregiverId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**Success** — Data Type: **Boolean**',
            ],
          },
          {
            title: 'SA_UpdateCaregiverRating — build the flow',
            instructions: [
              'Drag an **Aggregate** > Add Source: **Caregiver**',
              'Filter: **Caregiver.CaregiverId** = **LongIntegerToIdentifier(CaregiverId)**',
              'Drag an **If** node:',
              'Condition: **GetCaregivers.List.Empty**',
              'True branch: **Raise Exception** > **CaregiverNotFoundException**',
              'False branch: Drag an **Assign** node:',
              '**GetCaregivers.List.Current.Caregiver.TotalVisits** = **GetCaregivers.List.Current.Caregiver.TotalVisits + 1**',
              '**GetCaregivers.List.Current.Caregiver.UpdatedAt** = **CurrDateTime()**',
              'Drag **UpdateCaregiver** CRUD action',
              'Set **Source** = **GetCaregivers.List.Current.Caregiver**',
              'Drag **Assign**: **Success** = **True**',
              'Connect to **End**',
            ],
          },
          // SA_UpdateLastAssigned
          {
            title: 'Server Action: SA_UpdateLastAssigned',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_UpdateLastAssigned**',
              'Add Input Parameter:',
              '**CaregiverId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**Success** — Data Type: **Boolean**',
            ],
          },
          {
            title: 'SA_UpdateLastAssigned — build the flow',
            instructions: [
              'Drag an **Aggregate** > Add Source: **Caregiver**',
              'Filter: **Caregiver.CaregiverId** = **LongIntegerToIdentifier(CaregiverId)**',
              'Drag an **If** node:',
              'Condition: **GetCaregivers.List.Empty**',
              'True branch: **Raise Exception** > **CaregiverNotFoundException**',
              'False branch: Drag an **Assign** node:',
              '**GetCaregivers.List.Current.Caregiver.LastAssignedAt** = **CurrDateTime()**',
              '**GetCaregivers.List.Current.Caregiver.UpdatedAt** = **CurrDateTime()**',
              'Drag **UpdateCaregiver** CRUD action',
              'Set **Source** = **GetCaregivers.List.Current.Caregiver**',
              'Drag **Assign**: **Success** = **True**',
              'Connect to **End**',
            ],
          },
          // REST Endpoints
          {
            title: 'Create the "Caregiver" Exposed REST API',
            instructions: [
              '**Logic** tab > **Integrations** > **REST** > right-click **REST** > **Expose REST API**',
              'Name: **Caregiver**',
            ],
          },
          {
            title: 'REST Endpoint: POST /caregivers — CreateCaregiver',
            instructions: [
              'Right-click **Caregiver** REST API > **Add REST API Method**',
              'Name: **CreateCaregiver**',
              'HTTP Method: **POST**',
              'Create **Structure**: **CreateCaregiverRequest**',
              'Attributes: **UserId** (**Long Integer**), **PartyId** (**Text**), **Bio** (**Text**), **SkillProductClassIds** (**Text**), **SkillProductTypeIds** (**Text**)',
              'Add Input Parameter: **Request** — Data Type: **CreateCaregiverRequest**, Receive In: **Body**',
              'Add Output Parameter: **Result** — Data Type: **Caregiver**',
              'Flow: **Start** → **SA_CreateCaregiver** (pass fields from **Request**) → **Assign** output → **End**',
            ],
          },
          {
            title: 'REST Endpoint: GET /caregivers/{UserId} — GetCaregiverByUserId',
            instructions: [
              'Name: **GetCaregiverByUserId**',
              'HTTP Method: **GET**',
              'Add Input Parameter: **UserId** — Data Type: **Long Integer**, Receive In: **URL**',
              'Add Output Parameter: **Result** — Data Type: **Caregiver**',
              'Flow: **Start** → **SA_GetCaregiverByUserId** → **Assign** output → **End**',
            ],
          },
          {
            title: 'REST Endpoint: GET /caregivers/id/{CaregiverId} — GetCaregiverById',
            instructions: [
              'Name: **GetCaregiverById**',
              'HTTP Method: **GET**',
              'Add Input Parameter: **CaregiverId** — Data Type: **Long Integer**, Receive In: **URL**',
              'Add Output Parameter: **Result** — Data Type: **Caregiver**',
              'Flow: **Start** → **SA_GetCaregiverById** → **Assign** output → **End**',
            ],
          },
          {
            title: 'REST Endpoint: GET /caregivers/list — ListCaregiversBySkills',
            instructions: [
              'Name: **ListCaregiversBySkills**',
              'HTTP Method: **GET**',
              'Add Input Parameters (all Receive In: **Query String**):',
              '**SkillProductClassId** — Data Type: **Text**',
              '**SkillProductTypeId** — Data Type: **Text** (optional)',
              '**ExcludeIds** — Data Type: **Text** (optional)',
              'Add Output Parameter: **Results** — Data Type: **Caregiver List**',
              'Flow: **Start** → **SA_ListCaregiversBySkills** → **Assign** output → **End**',
            ],
          },
          {
            title: 'REST Endpoint: PUT /caregivers/{CaregiverId} — UpdateCaregiver',
            instructions: [
              'Name: **UpdateCaregiver**',
              'HTTP Method: **PUT**',
              'Add Input Parameter: **CaregiverId** — Data Type: **Long Integer**, Receive In: **URL**',
              'Create **Structure**: **UpdateCaregiverRequest**',
              'Attributes: **Bio** (**Text**), **SkillProductClassIds** (**Text**), **SkillProductTypeIds** (**Text**), **IsAvailable** (**Boolean**)',
              'Add Input Parameter: **Request** — Data Type: **UpdateCaregiverRequest**, Receive In: **Body**',
              'Add Output Parameter: **Success** — Data Type: **Boolean**',
              'Flow: **Start** → **SA_UpdateCaregiver** → **Assign** output → **End**',
            ],
          },
          {
            title: 'REST Endpoint: PUT /caregivers/{CaregiverId}/update-rating — UpdateCaregiverRating',
            instructions: [
              'Name: **UpdateCaregiverRating**',
              'HTTP Method: **PUT**',
              'Add Input Parameter: **CaregiverId** — Data Type: **Long Integer**, Receive In: **URL**',
              'Add Output Parameter: **Success** — Data Type: **Boolean**',
              'Flow: **Start** → **SA_UpdateCaregiverRating** → **Assign** output → **End**',
            ],
          },
          {
            title: 'REST Endpoint: PUT /caregivers/{CaregiverId}/last-assigned — UpdateLastAssigned',
            instructions: [
              'Name: **UpdateLastAssigned**',
              'HTTP Method: **PUT**',
              'Add Input Parameter: **CaregiverId** — Data Type: **Long Integer**, Receive In: **URL**',
              'Add Output Parameter: **Success** — Data Type: **Boolean**',
              'Flow: **Start** → **SA_UpdateLastAssigned** → **Assign** output → **End**',
            ],
          },
          {
            title: 'Publish and test Caregiver service',
            instructions: [
              '**1-Click Publish** (**Ctrl+Shift+P**)',
              'Right-click the **Caregiver** REST API > **Open Documentation**',
              'Test each endpoint via **Swagger UI**',
            ],
          },
        ],
      },

      // ── 3C: AvailabilitySlot Service ──
      {
        id: '3C',
        title: 'AvailabilitySlot Service (CareConnect_AvailabilitySlot)',
        summary:
          'Entity with 8 attributes, 3 indexes, 3 exceptions, 5 Server Actions, 5 REST endpoints.',
        steps: [
          // Entity
          {
            title: 'Create the AvailabilitySlot Entity',
            instructions: [
              'Open the **CareConnect_AvailabilitySlot** module',
              '**Data** tab > right-click **Entities** > **Add Entity**',
              'Name: **AvailabilitySlot**',
              'Rename **Id** to **AvailabilitySlotId**',
              'Set **Is AutoNumber** = **Yes**',
            ],
          },
          {
            title: 'Add AvailabilitySlot Entity attributes',
            instructions: [
              'Right-click **AvailabilitySlot** > **Add Entity Attribute** for each:',
              '**CaregiverId** — Data Type: **Long Integer**',
              '**SlotDate** — Data Type: **Date**',
              '**SlotStartTime** — Data Type: **Time**',
              '**SlotEndTime** — Data Type: **Time**',
              '**IsBooked** — Data Type: **Boolean**, Default Value: **False**',
              '**CareTypeProductClassId** — Data Type: **Text**, Length: **50**',
              '**CreatedAt** — Data Type: **Date Time**',
              '**UpdatedAt** — Data Type: **Date Time**',
            ],
          },
          {
            title: 'Create indexes on AvailabilitySlot',
            instructions: [
              'Click **AvailabilitySlot** entity > **Properties** panel > **Indexes**',
              'Add index: **idx_CaregiverId** on attribute **CaregiverId**',
              'Add index: **idx_SlotDate** on attribute **SlotDate**',
              'Add index: **idx_IsBooked** on attribute **IsBooked**',
            ],
          },
          // Exceptions
          {
            title: 'Create exceptions for AvailabilitySlot',
            instructions: [
              '**Logic** tab > right-click **Exceptions** > **Add Exception**',
              'Name: **SlotOverlapException**',
              'Right-click **Exceptions** > **Add Exception**',
              'Name: **SlotAlreadyBookedException**',
              'Right-click **Exceptions** > **Add Exception**',
              'Name: **SlotNotFoundException**',
              'Leave defaults (Type = **User Exception**) for all three',
            ],
          },
          // SA_CreateSlot
          {
            title: 'Server Action: SA_CreateSlot',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_CreateSlot**',
              'Add Input Parameters:',
              '**CaregiverId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              '**SlotDate** — Data Type: **Date**, Is Mandatory: **Yes**',
              '**SlotStartTime** — Data Type: **Time**, Is Mandatory: **Yes**',
              '**SlotEndTime** — Data Type: **Time**, Is Mandatory: **Yes**',
              '**CareTypeProductClassId** — Data Type: **Text**, Is Mandatory: **No**',
              'Add Output Parameter:',
              '**Result** — Data Type: **AvailabilitySlot**',
            ],
          },
          {
            title: 'SA_CreateSlot — build the flow (overlap check)',
            instructions: [
              'Drag an **Aggregate** after **Start** (overlap check)',
              'Add Source: **AvailabilitySlot**',
              'Add Filters:',
              '**AvailabilitySlot.CaregiverId** = **CaregiverId**',
              '**AvailabilitySlot.SlotDate** = **SlotDate**',
              '**AvailabilitySlot.SlotStartTime** < **SlotEndTime**',
              '**AvailabilitySlot.SlotEndTime** > **SlotStartTime**',
              'Drag an **If** node:',
              'Condition: **not GetAvailabilitySlots.List.Empty**',
              'True branch (overlap found): **Raise Exception** > **SlotOverlapException** with message **"This slot overlaps with an existing slot"**',
              'False branch (no overlap): continue to create',
            ],
          },
          {
            title: 'SA_CreateSlot — assign and create',
            instructions: [
              'Drag an **Assign** node on the False branch:',
              '**Result.CaregiverId** = **CaregiverId**',
              '**Result.SlotDate** = **SlotDate**',
              '**Result.SlotStartTime** = **SlotStartTime**',
              '**Result.SlotEndTime** = **SlotEndTime**',
              '**Result.IsBooked** = **False**',
              '**Result.CareTypeProductClassId** = **CareTypeProductClassId**',
              '**Result.CreatedAt** = **CurrDateTime()**',
              '**Result.UpdatedAt** = **CurrDateTime()**',
              'Drag the **CreateAvailabilitySlot** CRUD action',
              'Set **Source** = **Result**',
              'Drag another **Assign**:',
              '**Result.AvailabilitySlotId** = **CreateAvailabilitySlot.Id**',
              'Connect to **End**',
            ],
          },
          // SA_ListAvailableSlots
          {
            title: 'Server Action: SA_ListAvailableSlots',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_ListAvailableSlots**',
              'Add Input Parameters:',
              '**CaregiverId** — Data Type: **Long Integer**, Default Value: **0** (0 means all caregivers)',
              '**SlotDate** — Data Type: **Date**, Default Value: **NullDate()** (null means all dates)',
              '**IsBooked** — Data Type: **Boolean**, Default Value: **False**',
              'Add Output Parameter:',
              '**Results** — Data Type: **AvailabilitySlot List**',
            ],
          },
          {
            title: 'SA_ListAvailableSlots — build the flow',
            instructions: [
              'Drag an **Aggregate** > Add Source: **AvailabilitySlot**',
              'Add Filters (conditional):',
              '**CaregiverId** = **0** or **AvailabilitySlot.CaregiverId** = **CaregiverId**',
              '**SlotDate** = **NullDate()** or **AvailabilitySlot.SlotDate** = **SlotDate**',
              '**AvailabilitySlot.IsBooked** = **IsBooked**',
              'Drag an **Assign** node:',
              '**Results** = **GetAvailabilitySlots.List**',
              'Connect to **End**',
            ],
            tip: 'Use the expression **(CaregiverId = 0) or (AvailabilitySlot.CaregiverId = CaregiverId)** as the filter so that passing **0** returns all caregivers.',
          },
          // SA_BookSlot
          {
            title: 'Server Action: SA_BookSlot',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_BookSlot**',
              'Add Input Parameter:',
              '**AvailabilitySlotId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**Success** — Data Type: **Boolean**',
            ],
          },
          {
            title: 'SA_BookSlot — build the flow',
            instructions: [
              'Drag an **Aggregate** > Add Source: **AvailabilitySlot**',
              'Filter: **AvailabilitySlot.AvailabilitySlotId** = **LongIntegerToIdentifier(AvailabilitySlotId)**',
              'Drag an **If** node:',
              'Condition: **GetAvailabilitySlots.List.Empty**',
              'True branch: **Raise Exception** > **SlotNotFoundException** with message **"Slot not found"**',
              'False branch: Drag another **If** node:',
              'Condition: **GetAvailabilitySlots.List.Current.AvailabilitySlot.IsBooked** = **True**',
              'True branch: **Raise Exception** > **SlotAlreadyBookedException** with message **"This slot is already booked"**',
              'False branch: Drag an **Assign** node:',
              '**GetAvailabilitySlots.List.Current.AvailabilitySlot.IsBooked** = **True**',
              '**GetAvailabilitySlots.List.Current.AvailabilitySlot.UpdatedAt** = **CurrDateTime()**',
              'Drag **UpdateAvailabilitySlot** CRUD action',
              'Set **Source** = **GetAvailabilitySlots.List.Current.AvailabilitySlot**',
              'Drag **Assign**: **Success** = **True**',
              'Connect to **End**',
            ],
          },
          // SA_UnbookSlot
          {
            title: 'Server Action: SA_UnbookSlot',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_UnbookSlot**',
              'Add Input Parameter:',
              '**AvailabilitySlotId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**Success** — Data Type: **Boolean**',
            ],
          },
          {
            title: 'SA_UnbookSlot — build the flow',
            instructions: [
              'Drag an **Aggregate** > Add Source: **AvailabilitySlot**',
              'Filter: **AvailabilitySlot.AvailabilitySlotId** = **LongIntegerToIdentifier(AvailabilitySlotId)**',
              'Drag an **If** node:',
              'Condition: **GetAvailabilitySlots.List.Empty**',
              'True branch: **Raise Exception** > **SlotNotFoundException** with message **"Slot not found"**',
              'False branch: Drag an **Assign** node:',
              '**GetAvailabilitySlots.List.Current.AvailabilitySlot.IsBooked** = **False**',
              '**GetAvailabilitySlots.List.Current.AvailabilitySlot.UpdatedAt** = **CurrDateTime()**',
              'Drag **UpdateAvailabilitySlot** CRUD action',
              'Set **Source** = **GetAvailabilitySlots.List.Current.AvailabilitySlot**',
              'Drag **Assign**: **Success** = **True**',
              'Connect to **End**',
            ],
          },
          // SA_DeleteSlot
          {
            title: 'Server Action: SA_DeleteSlot',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_DeleteSlot**',
              'Add Input Parameter:',
              '**AvailabilitySlotId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**Success** — Data Type: **Boolean**',
            ],
          },
          {
            title: 'SA_DeleteSlot — build the flow',
            instructions: [
              'Drag an **Aggregate** > Add Source: **AvailabilitySlot**',
              'Filter: **AvailabilitySlot.AvailabilitySlotId** = **LongIntegerToIdentifier(AvailabilitySlotId)**',
              'Drag an **If** node:',
              'Condition: **GetAvailabilitySlots.List.Empty**',
              'True branch: **Raise Exception** > **SlotNotFoundException** with message **"Slot not found"**',
              'False branch: Drag another **If** node:',
              'Condition: **GetAvailabilitySlots.List.Current.AvailabilitySlot.IsBooked** = **True**',
              'True branch: **Raise Exception** > **SlotAlreadyBookedException** with message **"Cannot delete a booked slot"**',
              'False branch: Drag the **DeleteAvailabilitySlot** CRUD action',
              'Set **Id** = **GetAvailabilitySlots.List.Current.AvailabilitySlot.AvailabilitySlotId**',
              'Drag **Assign**: **Success** = **True**',
              'Connect to **End**',
            ],
          },
          // REST Endpoints
          {
            title: 'Create the "AvailabilitySlot" Exposed REST API',
            instructions: [
              '**Logic** tab > **Integrations** > **REST** > right-click **REST** > **Expose REST API**',
              'Name: **AvailabilitySlot**',
            ],
          },
          {
            title: 'REST Endpoint: POST /slots — CreateSlot',
            instructions: [
              'Right-click **AvailabilitySlot** REST API > **Add REST API Method**',
              'Name: **CreateSlot**',
              'HTTP Method: **POST**',
              'Create **Structure**: **CreateSlotRequest**',
              'Attributes: **CaregiverId** (**Long Integer**), **SlotDate** (**Date**), **SlotStartTime** (**Time**), **SlotEndTime** (**Time**), **CareTypeProductClassId** (**Text**)',
              'Add Input Parameter: **Request** — Data Type: **CreateSlotRequest**, Receive In: **Body**',
              'Add Output Parameter: **Result** — Data Type: **AvailabilitySlot**',
              'Flow: **Start** → **SA_CreateSlot** (pass fields from **Request**) → **Assign** output → **End**',
            ],
          },
          {
            title: 'REST Endpoint: GET /slots/list — ListAvailableSlots',
            instructions: [
              'Name: **ListAvailableSlots**',
              'HTTP Method: **GET**',
              'Add Input Parameters (all Receive In: **Query String**):',
              '**CaregiverId** — Data Type: **Long Integer**, Default Value: **0**',
              '**SlotDate** — Data Type: **Date**, Default Value: **NullDate()**',
              '**IsBooked** — Data Type: **Boolean**, Default Value: **False**',
              'Add Output Parameter: **Results** — Data Type: **AvailabilitySlot List**',
              'Flow: **Start** → **SA_ListAvailableSlots** → **Assign** output → **End**',
            ],
          },
          {
            title: 'REST Endpoint: PUT /slots/{AvailabilitySlotId}/book — BookSlot',
            instructions: [
              'Name: **BookSlot**',
              'HTTP Method: **PUT**',
              'Add Input Parameter: **AvailabilitySlotId** — Data Type: **Long Integer**, Receive In: **URL**',
              'Add Output Parameter: **Success** — Data Type: **Boolean**',
              'Flow: **Start** → **SA_BookSlot** → **Assign** output → **End**',
            ],
          },
          {
            title: 'REST Endpoint: PUT /slots/{AvailabilitySlotId}/unbook — UnbookSlot',
            instructions: [
              'Name: **UnbookSlot**',
              'HTTP Method: **PUT**',
              'Add Input Parameter: **AvailabilitySlotId** — Data Type: **Long Integer**, Receive In: **URL**',
              'Add Output Parameter: **Success** — Data Type: **Boolean**',
              'Flow: **Start** → **SA_UnbookSlot** → **Assign** output → **End**',
            ],
          },
          {
            title: 'REST Endpoint: DELETE /slots/{AvailabilitySlotId} — DeleteSlot',
            instructions: [
              'Name: **DeleteSlot**',
              'HTTP Method: **DELETE**',
              'Add Input Parameter: **AvailabilitySlotId** — Data Type: **Long Integer**, Receive In: **URL**',
              'Add Output Parameter: **Success** — Data Type: **Boolean**',
              'Flow: **Start** → **SA_DeleteSlot** → **Assign** output → **End**',
            ],
          },
          {
            title: 'Publish and test AvailabilitySlot service',
            instructions: [
              '**1-Click Publish** (**Ctrl+Shift+P**)',
              'Right-click the **AvailabilitySlot** REST API > **Open Documentation**',
              'Test creating a slot, then booking it, then trying to delete the booked slot (should fail)',
            ],
          },
        ],
      },

      // ── 3D: CareRequest Service ──
      {
        id: '3D',
        title: 'CareRequest Service (CareConnect_CareRequest)',
        summary:
          'Entity with 17 attributes, 2 indexes, 1 exception, 8 Server Actions, 8 REST endpoints. Depends on **CC_Orchestration** for the **CareRequestStatus** static entity.',
        steps: [
          // Dependency
          {
            title: 'Add dependency on CC_Orchestration',
            instructions: [
              'Open the **CareConnect_CareRequest** module',
              'Press **Ctrl+Q** to open **Manage Dependencies**',
              'Search for **CC_Orchestration**',
              'Expand it and check **CareRequestStatus** (the static entity)',
              'Click **Apply** and wait for refresh',
            ],
            important:
              'You MUST add this dependency before creating the entity, because the **Status** attribute uses **CareRequestStatus Identifier** as its data type.',
          },
          // Entity
          {
            title: 'Create the CareRequest Entity',
            instructions: [
              '**Data** tab > right-click **Entities** > **Add Entity**',
              'Name: **CareRequest**',
              'Rename **Id** to **CareRequestId**',
              'Set **Is AutoNumber** = **Yes**',
            ],
          },
          {
            title: 'Add CareRequest Entity attributes',
            instructions: [
              'Right-click **CareRequest** > **Add Entity Attribute** for each:',
              '**FamilyUserId** — Data Type: **Long Integer**',
              '**FamilyPartyId** — Data Type: **Text**, Length: **50**',
              '**PatientName** — Data Type: **Text**, Length: **200**',
              '**CareTypeProductClassId** — Data Type: **Text**, Length: **50**',
              '**SkillProductTypeIds** — Data Type: **Text**, Length: **500**',
              '**AvailabilitySlotId** — Data Type: **Long Integer**',
              '**AssignedCaregiverId** — Data Type: **Long Integer**',
              '**RequestedSlot** — Data Type: **Date Time**',
              '**DurationHours** — Data Type: **Decimal**, Length: **10**, Decimals: **2**',
              '**Notes** — Data Type: **Text**, Length: **2000**',
              '**SupportingDocS3Key** — Data Type: **Text**, Length: **500**',
              '**Status** — Data Type: **CareRequestStatus Identifier**, Default Value: **Entities.CareRequestStatus.Open**',
              '**AssignmentAttempts** — Data Type: **Integer**, Default Value: **0**',
              '**NotifiedCaregiverIds** — Data Type: **Text**, Length: **2000**',
              '**LastNotifiedAt** — Data Type: **Date Time**',
              '**CreatedAt** — Data Type: **Date Time**',
              '**UpdatedAt** — Data Type: **Date Time**',
            ],
          },
          {
            title: 'Create indexes on CareRequest',
            instructions: [
              'Click **CareRequest** entity > **Properties** panel > **Indexes**',
              'Add index: **idx_FamilyUserId** on attribute **FamilyUserId**',
              'Add index: **idx_AssignedCaregiverId** on attribute **AssignedCaregiverId**',
            ],
            tip: 'Do NOT create an index on **Status** — OutSystems auto-creates an index for **Identifier** type attributes that reference static entities.',
          },
          // Exception
          {
            title: 'Create the CareRequestNotFoundException exception',
            instructions: [
              '**Logic** tab > right-click **Exceptions** > **Add Exception**',
              'Name: **CareRequestNotFoundException**',
              'Leave defaults (Type = **User Exception**)',
            ],
          },
          // SA_CreateCareRequest
          {
            title: 'Server Action: SA_CreateCareRequest',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_CreateCareRequest**',
              'Add Input Parameters:',
              '**FamilyUserId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              '**FamilyPartyId** — Data Type: **Text**, Is Mandatory: **Yes**',
              '**PatientName** — Data Type: **Text**, Is Mandatory: **Yes**',
              '**CareTypeProductClassId** — Data Type: **Text**, Is Mandatory: **Yes**',
              '**SkillProductTypeIds** — Data Type: **Text**, Is Mandatory: **No**',
              '**AvailabilitySlotId** — Data Type: **Long Integer**, Is Mandatory: **No**',
              '**RequestedSlot** — Data Type: **Date Time**, Is Mandatory: **No**',
              '**DurationHours** — Data Type: **Decimal**, Is Mandatory: **No**',
              '**Notes** — Data Type: **Text**, Is Mandatory: **No**',
              '**SupportingDocS3Key** — Data Type: **Text**, Is Mandatory: **No**',
              '**NotifiedCaregiverIds** — Data Type: **Text**, Is Mandatory: **No**',
              'Add Output Parameter:',
              '**Result** — Data Type: **CareRequest**',
            ],
          },
          {
            title: 'SA_CreateCareRequest — build the flow',
            instructions: [
              'Drag an **Assign** node after **Start**:',
              '**Result.FamilyUserId** = **FamilyUserId**',
              '**Result.FamilyPartyId** = **FamilyPartyId**',
              '**Result.PatientName** = **PatientName**',
              '**Result.CareTypeProductClassId** = **CareTypeProductClassId**',
              '**Result.SkillProductTypeIds** = **SkillProductTypeIds**',
              '**Result.AvailabilitySlotId** = **AvailabilitySlotId**',
              '**Result.RequestedSlot** = **RequestedSlot**',
              '**Result.DurationHours** = **DurationHours**',
              '**Result.Notes** = **Notes**',
              '**Result.SupportingDocS3Key** = **SupportingDocS3Key**',
              '**Result.NotifiedCaregiverIds** = **NotifiedCaregiverIds**',
              '**Result.Status** = **Entities.CareRequestStatus.Open**',
              '**Result.AssignmentAttempts** = **0**',
              '**Result.CreatedAt** = **CurrDateTime()**',
              '**Result.UpdatedAt** = **CurrDateTime()**',
              'Drag the **CreateCareRequest** CRUD action',
              'Set **Source** = **Result**',
              'Drag another **Assign**:',
              '**Result.CareRequestId** = **CreateCareRequest.Id**',
              'Connect to **End**',
            ],
          },
          // SA_GetCareRequestById
          {
            title: 'Server Action: SA_GetCareRequestById',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_GetCareRequestById**',
              'Add Input Parameter:',
              '**CareRequestId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**Result** — Data Type: **CareRequest**',
            ],
          },
          {
            title: 'SA_GetCareRequestById — build the flow',
            instructions: [
              'Drag an **Aggregate** > Add Source: **CareRequest**',
              'Filter: **CareRequest.CareRequestId** = **LongIntegerToIdentifier(CareRequestId)**',
              'Drag an **If** node:',
              'Condition: **GetCareRequests.List.Empty**',
              'True branch: **Raise Exception** > **CareRequestNotFoundException** with message **"Care request not found"**',
              'False branch: **Assign** > **Result** = **GetCareRequests.List.Current.CareRequest**',
              'Connect to **End**',
            ],
          },
          // SA_ListCareRequestsByFamily
          {
            title: 'Server Action: SA_ListCareRequestsByFamily',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_ListCareRequestsByFamily**',
              'Add Input Parameters:',
              '**FamilyUserId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              '**Status** — Data Type: **CareRequestStatus Identifier**, Is Mandatory: **No** (pass **NullIdentifier()** for all statuses)',
              'Add Output Parameter:',
              '**Results** — Data Type: **CareRequest List**',
            ],
            important:
              'This action uses a **SQL** element instead of an **Aggregate** because the **Status** field is an **Identifier** type. Filtering on Identifiers with optional conditions is easier with raw SQL.',
          },
          {
            title: 'SA_ListCareRequestsByFamily — build the flow with SQL',
            instructions: [
              'Drag a **SQL** element onto the flow after **Start**',
              'Double-click to open the SQL editor',
              'Add Output Structure: **CareRequest** (select the entity)',
              'Add Parameters:',
              '**FamilyUserId** — Data Type: **Long Integer**',
              '**Status** — Data Type: **CareRequestStatus Identifier**',
              'Write the query:',
              '**SELECT {CareRequest}.* FROM {CareRequest} WHERE {CareRequest}.[FamilyUserId] = @FamilyUserId AND (@Status = 0 OR {CareRequest}.[Status] = @Status)**',
              'Close the SQL editor',
              'Drag an **Assign** node:',
              '**Results** = **SQL1.List**',
              'Connect to **End**',
            ],
            tip: 'In OutSystems SQL, **{CareRequest}** references the entity, **@FamilyUserId** references the input parameter, and **@Status = 0** effectively means "no filter on status" because **NullIdentifier()** resolves to **0**.',
          },
          // SA_ListCareRequestsByStatus
          {
            title: 'Server Action: SA_ListCareRequestsByStatus',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_ListCareRequestsByStatus**',
              'Add Input Parameter:',
              '**Status** — Data Type: **CareRequestStatus Identifier**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**Results** — Data Type: **CareRequest List**',
            ],
          },
          {
            title: 'SA_ListCareRequestsByStatus — build the flow with SQL',
            instructions: [
              'Drag a **SQL** element onto the flow',
              'Add Output Structure: **CareRequest**',
              'Add Parameter: **Status** — Data Type: **CareRequestStatus Identifier**',
              'Query: **SELECT {CareRequest}.* FROM {CareRequest} WHERE {CareRequest}.[Status] = @Status**',
              'Drag an **Assign** node:',
              '**Results** = **SQL1.List**',
              'Connect to **End**',
            ],
          },
          // SA_UpdateCareRequestStatus
          {
            title: 'Server Action: SA_UpdateCareRequestStatus',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_UpdateCareRequestStatus**',
              'Add Input Parameters:',
              '**CareRequestId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              '**NewStatus** — Data Type: **CareRequestStatus Identifier**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**Success** — Data Type: **Boolean**',
            ],
          },
          {
            title: 'SA_UpdateCareRequestStatus — build the flow',
            instructions: [
              'Drag an **Aggregate** > Add Source: **CareRequest**',
              'Filter: **CareRequest.CareRequestId** = **LongIntegerToIdentifier(CareRequestId)**',
              'Drag an **If** node:',
              'Condition: **GetCareRequests.List.Empty**',
              'True branch: **Raise Exception** > **CareRequestNotFoundException**',
              'False branch: Drag an **Assign** node:',
              '**GetCareRequests.List.Current.CareRequest.Status** = **NewStatus**',
              '**GetCareRequests.List.Current.CareRequest.UpdatedAt** = **CurrDateTime()**',
              'Drag **UpdateCareRequest** CRUD action',
              'Set **Source** = **GetCareRequests.List.Current.CareRequest**',
              'Drag **Assign**: **Success** = **True**',
              'Connect to **End**',
            ],
          },
          // SA_AssignCaregiverToRequest
          {
            title: 'Server Action: SA_AssignCaregiverToRequest',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_AssignCaregiverToRequest**',
              'Add Input Parameters:',
              '**CareRequestId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              '**AssignedCaregiverId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              '**NotifiedCaregiverIds** — Data Type: **Text**, Is Mandatory: **No**',
              'Add Output Parameter:',
              '**Success** — Data Type: **Boolean**',
            ],
          },
          {
            title: 'SA_AssignCaregiverToRequest — build the flow',
            instructions: [
              'Drag an **Aggregate** > Add Source: **CareRequest**',
              'Filter: **CareRequest.CareRequestId** = **LongIntegerToIdentifier(CareRequestId)**',
              'Drag an **If** node:',
              'Condition: **GetCareRequests.List.Empty**',
              'True branch: **Raise Exception** > **CareRequestNotFoundException**',
              'False branch: Drag an **Assign** node:',
              '**GetCareRequests.List.Current.CareRequest.Status** = **Entities.CareRequestStatus.Assigned**',
              '**GetCareRequests.List.Current.CareRequest.AssignedCaregiverId** = **AssignedCaregiverId**',
              '**GetCareRequests.List.Current.CareRequest.NotifiedCaregiverIds** = **NotifiedCaregiverIds**',
              '**GetCareRequests.List.Current.CareRequest.UpdatedAt** = **CurrDateTime()**',
              'Drag **UpdateCareRequest** CRUD action',
              'Set **Source** = **GetCareRequests.List.Current.CareRequest**',
              'Drag **Assign**: **Success** = **True**',
              'Connect to **End**',
            ],
          },
          // SA_IncrementAssignmentAttempts
          {
            title: 'Server Action: SA_IncrementAssignmentAttempts',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_IncrementAssignmentAttempts**',
              'Add Input Parameter:',
              '**CareRequestId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**Success** — Data Type: **Boolean**',
            ],
          },
          {
            title: 'SA_IncrementAssignmentAttempts — build the flow',
            instructions: [
              'Drag an **Aggregate** > Add Source: **CareRequest**',
              'Filter: **CareRequest.CareRequestId** = **LongIntegerToIdentifier(CareRequestId)**',
              'Drag an **If** node:',
              'Condition: **GetCareRequests.List.Empty**',
              'True branch: **Raise Exception** > **CareRequestNotFoundException**',
              'False branch: Drag an **Assign** node:',
              '**GetCareRequests.List.Current.CareRequest.AssignmentAttempts** = **GetCareRequests.List.Current.CareRequest.AssignmentAttempts + 1**',
              '**GetCareRequests.List.Current.CareRequest.LastNotifiedAt** = **CurrDateTime()**',
              '**GetCareRequests.List.Current.CareRequest.UpdatedAt** = **CurrDateTime()**',
              'Drag **UpdateCareRequest** CRUD action',
              'Set **Source** = **GetCareRequests.List.Current.CareRequest**',
              'Drag **Assign**: **Success** = **True**',
              'Connect to **End**',
            ],
          },
          // SA_CancelCareRequest
          {
            title: 'Server Action: SA_CancelCareRequest',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_CancelCareRequest**',
              'Add Input Parameter:',
              '**CareRequestId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**Success** — Data Type: **Boolean**',
            ],
          },
          {
            title: 'SA_CancelCareRequest — build the flow',
            instructions: [
              'Drag an **Aggregate** > Add Source: **CareRequest**',
              'Filter: **CareRequest.CareRequestId** = **LongIntegerToIdentifier(CareRequestId)**',
              'Drag an **If** node:',
              'Condition: **GetCareRequests.List.Empty**',
              'True branch: **Raise Exception** > **CareRequestNotFoundException**',
              'False branch: Drag another **If** node to validate status:',
              'Condition: **GetCareRequests.List.Current.CareRequest.Status** = **Entities.CareRequestStatus.Open** or **GetCareRequests.List.Current.CareRequest.Status** = **Entities.CareRequestStatus.Assigned**',
              'True branch (status is **Open** or **Assigned** — valid for cancellation):',
              'Drag an **Assign** node:',
              '**GetCareRequests.List.Current.CareRequest.Status** = **Entities.CareRequestStatus.Cancelled**',
              '**GetCareRequests.List.Current.CareRequest.UpdatedAt** = **CurrDateTime()**',
              'Drag **UpdateCareRequest** CRUD action',
              'Set **Source** = **GetCareRequests.List.Current.CareRequest**',
              'Drag **Assign**: **Success** = **True**',
              'False branch (status is **Completed**, **Cancelled**, or **Escalated** — cannot cancel):',
              '**Raise Exception** > **CareRequestNotFoundException** with message **"Cannot cancel a request with status: " + GetCareRequests.List.Current.CareRequest.Status**',
              'Connect to **End**',
            ],
            tip: 'Only requests in **Open** or **Assigned** status can be cancelled. Completed, Cancelled, and Escalated requests cannot be cancelled.',
          },
          // REST Endpoints
          {
            title: 'Create the "CareRequest" Exposed REST API',
            instructions: [
              '**Logic** tab > **Integrations** > **REST** > right-click **REST** > **Expose REST API**',
              'Name: **CareRequest**',
            ],
          },
          {
            title: 'REST Endpoint: POST /care-requests — CreateCareRequest',
            instructions: [
              'Right-click **CareRequest** REST API > **Add REST API Method**',
              'Name: **CreateCareRequest**',
              'HTTP Method: **POST**',
              'Create **Structure**: **CreateCareRequestRequest**',
              'Add all 11 input attributes matching the Server Action inputs',
              'Add Input Parameter: **Request** — Data Type: **CreateCareRequestRequest**, Receive In: **Body**',
              'Add Output Parameter: **Result** — Data Type: **CareRequest**',
              'Flow: **Start** → **SA_CreateCareRequest** (pass fields from **Request**) → **Assign** output → **End**',
            ],
          },
          {
            title: 'REST Endpoint: GET /care-requests/{CareRequestId} — GetCareRequestById',
            instructions: [
              'Name: **GetCareRequestById**',
              'HTTP Method: **GET**',
              'Add Input Parameter: **CareRequestId** — Data Type: **Long Integer**, Receive In: **URL**',
              'Add Output Parameter: **Result** — Data Type: **CareRequest**',
              'Flow: **Start** → **SA_GetCareRequestById** → **Assign** output → **End**',
            ],
          },
          {
            title: 'REST Endpoint: GET /care-requests/by-family/{FamilyUserId} — ListByFamily',
            instructions: [
              'Name: **ListCareRequestsByFamily**',
              'HTTP Method: **GET**',
              'Add Input Parameters:',
              '**FamilyUserId** — Data Type: **Long Integer**, Receive In: **URL**',
              '**Status** — Data Type: **CareRequestStatus Identifier**, Receive In: **Query String** (optional)',
              'Add Output Parameter: **Results** — Data Type: **CareRequest List**',
              'Flow: **Start** → **SA_ListCareRequestsByFamily** → **Assign** output → **End**',
            ],
          },
          {
            title: 'REST Endpoint: GET /care-requests/by-status — ListByStatus',
            instructions: [
              'Name: **ListCareRequestsByStatus**',
              'HTTP Method: **GET**',
              'Add Input Parameter: **Status** — Data Type: **CareRequestStatus Identifier**, Receive In: **Query String**',
              'Add Output Parameter: **Results** — Data Type: **CareRequest List**',
              'Flow: **Start** → **SA_ListCareRequestsByStatus** → **Assign** output → **End**',
            ],
          },
          {
            title: 'REST Endpoint: PUT /care-requests/{CareRequestId}/status — UpdateStatus',
            instructions: [
              'Name: **UpdateCareRequestStatus**',
              'HTTP Method: **PUT**',
              'Add Input Parameter: **CareRequestId** — Data Type: **Long Integer**, Receive In: **URL**',
              'Create a small **Structure** or add an Input Parameter:',
              '**NewStatus** — Data Type: **CareRequestStatus Identifier**, Receive In: **Body**',
              'Add Output Parameter: **Success** — Data Type: **Boolean**',
              'Flow: **Start** → **SA_UpdateCareRequestStatus** → **Assign** output → **End**',
            ],
          },
          {
            title: 'REST Endpoint: PUT /care-requests/{CareRequestId}/assign — AssignCaregiver',
            instructions: [
              'Name: **AssignCaregiverToRequest**',
              'HTTP Method: **PUT**',
              'Add Input Parameter: **CareRequestId** — Data Type: **Long Integer**, Receive In: **URL**',
              'Create **Structure**: **AssignCaregiverRequest**',
              'Attributes: **AssignedCaregiverId** (**Long Integer**), **NotifiedCaregiverIds** (**Text**)',
              'Add Input Parameter: **Request** — Data Type: **AssignCaregiverRequest**, Receive In: **Body**',
              'Add Output Parameter: **Success** — Data Type: **Boolean**',
              'Flow: **Start** → **SA_AssignCaregiverToRequest** → **Assign** output → **End**',
            ],
          },
          {
            title: 'REST Endpoint: PUT /care-requests/{CareRequestId}/increment-attempts — IncrementAttempts',
            instructions: [
              'Name: **IncrementAssignmentAttempts**',
              'HTTP Method: **PUT**',
              'Add Input Parameter: **CareRequestId** — Data Type: **Long Integer**, Receive In: **URL**',
              'Add Output Parameter: **Success** — Data Type: **Boolean**',
              'Flow: **Start** → **SA_IncrementAssignmentAttempts** → **Assign** output → **End**',
            ],
          },
          {
            title: 'REST Endpoint: PUT /care-requests/{CareRequestId}/cancel — CancelCareRequest',
            instructions: [
              'Name: **CancelCareRequest**',
              'HTTP Method: **PUT**',
              'Add Input Parameter: **CareRequestId** — Data Type: **Long Integer**, Receive In: **URL**',
              'Add Output Parameter: **Success** — Data Type: **Boolean**',
              'Flow: **Start** → **SA_CancelCareRequest** → **Assign** output → **End**',
            ],
          },
          {
            title: 'Publish and test CareRequest service',
            instructions: [
              '**1-Click Publish** (**Ctrl+Shift+P**)',
              'Right-click the **CareRequest** REST API > **Open Documentation**',
              'Test creating a request, querying by family, updating status, and cancelling',
            ],
          },
        ],
      },

      // ── 3E: CareVisit + Payment Service ──
      {
        id: '3E',
        title: 'CareVisit + Payment Service (CareConnect_CareVisit)',
        summary:
          'Two entities in one module: **CareVisit** (14 attributes) and **Payment** (10 attributes). 2 exceptions, 8 CareVisit Server Actions, 4 Payment Server Actions, 7 CareVisit REST endpoints, 4 Payment REST endpoints.',
        steps: [
          // Dependencies
          {
            title: 'Add dependencies on CC_Orchestration',
            instructions: [
              'Open the **CareConnect_CareVisit** module',
              'Press **Ctrl+Q** to open **Manage Dependencies**',
              'Search for **CC_Orchestration**',
              'Expand it and check:',
              '**VisitStatus** (static entity)',
              '**PaymentStatus** (static entity)',
              'Click **Apply** and wait for refresh',
            ],
            important:
              'You need both **VisitStatus** and **PaymentStatus** from **CC_Orchestration** because the **CareVisit** entity uses **VisitStatus Identifier** and the **Payment** entity uses **PaymentStatus Identifier** as data types.',
          },
          // CareVisit Entity
          {
            title: 'Create the CareVisit Entity',
            instructions: [
              '**Data** tab > right-click **Entities** > **Add Entity**',
              'Name: **CareVisit**',
              'Rename **Id** to **VisitId**',
              'Set **Is AutoNumber** = **Yes**',
            ],
          },
          {
            title: 'Add CareVisit Entity attributes',
            instructions: [
              'Right-click **CareVisit** > **Add Entity Attribute** for each:',
              '**CareRequestId** — Data Type: **Long Integer**',
              '**CaregiverId** — Data Type: **Long Integer**',
              '**FamilyUserId** — Data Type: **Long Integer**',
              '**CheckInTime** — Data Type: **Date Time**',
              '**CheckOutTime** — Data Type: **Date Time**, Default Value: **NullDate()**',
              '**DurationMinutes** — Data Type: **Integer**, Default Value: **0**',
              '**ProofPhotoS3Key** — Data Type: **Text**, Length: **500**',
              '**CaregiverNotes** — Data Type: **Text**, Length: **1000**',
              '**FamilyConfirmed** — Data Type: **Boolean**, Default Value: **False**',
              '**FamilyConfirmedAt** — Data Type: **Date Time**',
              '**AIGeneratedSummary** — Data Type: **Text**, Length: **2000**',
              '**Status** — Data Type: **VisitStatus Identifier**, Default Value: **Entities.VisitStatus.Scheduled**',
              '**CreatedAt** — Data Type: **Date Time**',
              '**UpdatedAt** — Data Type: **Date Time**',
            ],
          },
          // Payment Entity
          {
            title: 'Create the Payment Entity',
            instructions: [
              '**Data** tab > right-click **Entities** > **Add Entity**',
              'Name: **Payment**',
              'Rename **Id** to **PaymentId**',
              'Set **Is AutoNumber** = **Yes**',
            ],
          },
          {
            title: 'Add Payment Entity attributes',
            instructions: [
              'Right-click **Payment** > **Add Entity Attribute** for each:',
              '**VisitId** — Data Type: **Long Integer**',
              '**FamilyUserId** — Data Type: **Long Integer**',
              '**Amount** — Data Type: **Decimal**, Length: **10**, Decimals: **2**',
              '**Currency** — Data Type: **Text**, Length: **10**, Default Value: **"SGD"**',
              '**Status** — Data Type: **PaymentStatus Identifier**, Default Value: **Entities.PaymentStatus.Held**',
              '**HeldAt** — Data Type: **Date Time**',
              '**ReleasedAt** — Data Type: **Date Time**',
              '**RefundReason** — Data Type: **Text**, Length: **500**',
              '**CreatedAt** — Data Type: **Date Time**',
              '**UpdatedAt** — Data Type: **Date Time**',
            ],
          },
          // Exceptions
          {
            title: 'Create exceptions for CareVisit and Payment',
            instructions: [
              '**Logic** tab > right-click **Exceptions** > **Add Exception**',
              'Name: **CareVisitNotFoundException**',
              'Right-click **Exceptions** > **Add Exception**',
              'Name: **PaymentNotFoundException**',
              'Leave defaults (Type = **User Exception**) for both',
            ],
          },
          // CareVisit Server Actions
          {
            title: 'Server Action: SA_CreateCareVisit',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_CreateCareVisit**',
              'Add Input Parameters:',
              '**CareRequestId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              '**CaregiverId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              '**FamilyUserId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              '**CheckInTime** — Data Type: **Date Time**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**Result** — Data Type: **CareVisit**',
            ],
          },
          {
            title: 'SA_CreateCareVisit — build the flow',
            instructions: [
              'Drag an **Assign** node after **Start**:',
              '**Result.CareRequestId** = **CareRequestId**',
              '**Result.CaregiverId** = **CaregiverId**',
              '**Result.FamilyUserId** = **FamilyUserId**',
              '**Result.CheckInTime** = **CheckInTime**',
              '**Result.CheckOutTime** = **NullDate()**',
              '**Result.DurationMinutes** = **0**',
              '**Result.FamilyConfirmed** = **False**',
              '**Result.Status** = **Entities.VisitStatus.Scheduled**',
              '**Result.CreatedAt** = **CurrDateTime()**',
              '**Result.UpdatedAt** = **CurrDateTime()**',
              'Drag the **CreateCareVisit** CRUD action',
              'Set **Source** = **Result**',
              'Drag another **Assign**:',
              '**Result.VisitId** = **CreateCareVisit.Id**',
              'Connect to **End**',
            ],
          },
          {
            title: 'Server Action: SA_GetCareVisitById',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_GetCareVisitById**',
              'Add Input Parameter:',
              '**VisitId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**Result** — Data Type: **CareVisit**',
            ],
          },
          {
            title: 'SA_GetCareVisitById — build the flow',
            instructions: [
              'Drag an **Aggregate** > Add Source: **CareVisit**',
              'Filter: **CareVisit.VisitId** = **LongIntegerToIdentifier(VisitId)**',
              'Drag an **If** node:',
              'Condition: **GetCareVisits.List.Empty**',
              'True branch: **Raise Exception** > **CareVisitNotFoundException** with message **"Care visit not found"**',
              'False branch: **Assign** > **Result** = **GetCareVisits.List.Current.CareVisit**',
              'Connect to **End**',
            ],
          },
          {
            title: 'Server Action: SA_ListCareVisitsByCaregiver',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_ListCareVisitsByCaregiver**',
              'Add Input Parameter:',
              '**CaregiverId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**Results** — Data Type: **CareVisit List**',
            ],
          },
          {
            title: 'SA_ListCareVisitsByCaregiver — build the flow',
            instructions: [
              'Drag an **Aggregate** > Add Source: **CareVisit**',
              'Filter: **CareVisit.CaregiverId** = **CaregiverId**',
              'Drag an **Assign** node:',
              '**Results** = **GetCareVisits.List**',
              'Connect to **End**',
            ],
          },
          {
            title: 'Server Action: SA_ListCareVisitsByCareRequest',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_ListCareVisitsByCareRequest**',
              'Add Input Parameter:',
              '**CareRequestId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**Results** — Data Type: **CareVisit List**',
            ],
          },
          {
            title: 'SA_ListCareVisitsByCareRequest — build the flow',
            instructions: [
              'Drag an **Aggregate** > Add Source: **CareVisit**',
              'Filter: **CareVisit.CareRequestId** = **CareRequestId**',
              'Drag an **Assign** node:',
              '**Results** = **GetCareVisits.List**',
              'Connect to **End**',
            ],
          },
          {
            title: 'Server Action: SA_CompleteCareVisit',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_CompleteCareVisit**',
              'Add Input Parameters:',
              '**VisitId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              '**CheckOutTime** — Data Type: **Date Time**, Is Mandatory: **Yes**',
              '**ProofPhotoS3Key** — Data Type: **Text**, Is Mandatory: **No**',
              '**CaregiverNotes** — Data Type: **Text**, Is Mandatory: **No**',
              'Add Output Parameter:',
              '**Success** — Data Type: **Boolean**',
            ],
          },
          {
            title: 'SA_CompleteCareVisit — build the flow',
            instructions: [
              'Drag an **Aggregate** > Add Source: **CareVisit**',
              'Filter: **CareVisit.VisitId** = **LongIntegerToIdentifier(VisitId)**',
              'Drag an **If** node:',
              'Condition: **GetCareVisits.List.Empty**',
              'True branch: **Raise Exception** > **CareVisitNotFoundException**',
              'False branch: Drag an **Assign** node:',
              '**GetCareVisits.List.Current.CareVisit.CheckOutTime** = **CheckOutTime**',
              '**GetCareVisits.List.Current.CareVisit.DurationMinutes** = **DiffMinutes(GetCareVisits.List.Current.CareVisit.CheckInTime, CheckOutTime)**',
              '**GetCareVisits.List.Current.CareVisit.ProofPhotoS3Key** = **ProofPhotoS3Key**',
              '**GetCareVisits.List.Current.CareVisit.CaregiverNotes** = **CaregiverNotes**',
              '**GetCareVisits.List.Current.CareVisit.Status** = **Entities.VisitStatus.Completed**',
              '**GetCareVisits.List.Current.CareVisit.UpdatedAt** = **CurrDateTime()**',
              'Drag **UpdateCareVisit** CRUD action',
              'Set **Source** = **GetCareVisits.List.Current.CareVisit**',
              'Drag **Assign**: **Success** = **True**',
              'Connect to **End**',
            ],
            tip: 'Use the built-in **DiffMinutes()** function to calculate the duration between **CheckInTime** and **CheckOutTime**. This populates the **DurationMinutes** field automatically.',
          },
          {
            title: 'Server Action: SA_ConfirmCareVisit',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_ConfirmCareVisit**',
              'Add Input Parameter:',
              '**VisitId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**Success** — Data Type: **Boolean**',
            ],
          },
          {
            title: 'SA_ConfirmCareVisit — build the flow',
            instructions: [
              'Drag an **Aggregate** > Add Source: **CareVisit**',
              'Filter: **CareVisit.VisitId** = **LongIntegerToIdentifier(VisitId)**',
              'Drag an **If** node:',
              'Condition: **GetCareVisits.List.Empty**',
              'True branch: **Raise Exception** > **CareVisitNotFoundException**',
              'False branch: Drag an **Assign** node:',
              '**GetCareVisits.List.Current.CareVisit.FamilyConfirmed** = **True**',
              '**GetCareVisits.List.Current.CareVisit.FamilyConfirmedAt** = **CurrDateTime()**',
              '**GetCareVisits.List.Current.CareVisit.UpdatedAt** = **CurrDateTime()**',
              'Drag **UpdateCareVisit** CRUD action',
              'Set **Source** = **GetCareVisits.List.Current.CareVisit**',
              'Drag **Assign**: **Success** = **True**',
              'Connect to **End**',
            ],
          },
          {
            title: 'Server Action: SA_UpdateVisitSummary',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_UpdateVisitSummary**',
              'Add Input Parameters:',
              '**VisitId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              '**AIGeneratedSummary** — Data Type: **Text**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**Success** — Data Type: **Boolean**',
            ],
          },
          {
            title: 'SA_UpdateVisitSummary — build the flow',
            instructions: [
              'Drag an **Aggregate** > Add Source: **CareVisit**',
              'Filter: **CareVisit.VisitId** = **LongIntegerToIdentifier(VisitId)**',
              'Drag an **If** node:',
              'Condition: **GetCareVisits.List.Empty**',
              'True branch: **Raise Exception** > **CareVisitNotFoundException**',
              'False branch: Drag an **Assign** node:',
              '**GetCareVisits.List.Current.CareVisit.AIGeneratedSummary** = **AIGeneratedSummary**',
              '**GetCareVisits.List.Current.CareVisit.UpdatedAt** = **CurrDateTime()**',
              'Drag **UpdateCareVisit** CRUD action',
              'Set **Source** = **GetCareVisits.List.Current.CareVisit**',
              'Drag **Assign**: **Success** = **True**',
              'Connect to **End**',
            ],
          },
          {
            title: 'Server Action: SA_UpdateVisitStatus',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_UpdateVisitStatus**',
              'Add Input Parameters:',
              '**VisitId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              '**NewStatus** — Data Type: **VisitStatus Identifier**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**Success** — Data Type: **Boolean**',
            ],
          },
          {
            title: 'SA_UpdateVisitStatus — build the flow',
            instructions: [
              'Drag an **Aggregate** > Add Source: **CareVisit**',
              'Filter: **CareVisit.VisitId** = **LongIntegerToIdentifier(VisitId)**',
              'Drag an **If** node:',
              'Condition: **GetCareVisits.List.Empty**',
              'True branch: **Raise Exception** > **CareVisitNotFoundException**',
              'False branch: Drag an **Assign** node:',
              '**GetCareVisits.List.Current.CareVisit.Status** = **NewStatus**',
              '**GetCareVisits.List.Current.CareVisit.UpdatedAt** = **CurrDateTime()**',
              'Drag **UpdateCareVisit** CRUD action',
              'Set **Source** = **GetCareVisits.List.Current.CareVisit**',
              'Drag **Assign**: **Success** = **True**',
              'Connect to **End**',
            ],
          },
          // Payment Server Actions
          {
            title: 'Server Action: SA_CreatePayment',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_CreatePayment**',
              'Add Input Parameters:',
              '**VisitId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              '**FamilyUserId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              '**Amount** — Data Type: **Decimal**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**Result** — Data Type: **Payment**',
            ],
          },
          {
            title: 'SA_CreatePayment — build the flow',
            instructions: [
              'Drag an **Assign** node after **Start**:',
              '**Result.VisitId** = **VisitId**',
              '**Result.FamilyUserId** = **FamilyUserId**',
              '**Result.Amount** = **Amount**',
              '**Result.Currency** = **"SGD"**',
              '**Result.Status** = **Entities.PaymentStatus.Held**',
              '**Result.HeldAt** = **CurrDateTime()**',
              '**Result.CreatedAt** = **CurrDateTime()**',
              '**Result.UpdatedAt** = **CurrDateTime()**',
              'Drag the **CreatePayment** CRUD action',
              'Set **Source** = **Result**',
              'Drag another **Assign**:',
              '**Result.PaymentId** = **CreatePayment.Id**',
              'Connect to **End**',
            ],
          },
          {
            title: 'Server Action: SA_GetPaymentByVisitId',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_GetPaymentByVisitId**',
              'Add Input Parameter:',
              '**VisitId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**Result** — Data Type: **Payment**',
            ],
          },
          {
            title: 'SA_GetPaymentByVisitId — build the flow',
            instructions: [
              'Drag an **Aggregate** > Add Source: **Payment**',
              'Filter: **Payment.VisitId** = **VisitId**',
              'Drag an **If** node:',
              'Condition: **GetPayments.List.Empty**',
              'True branch: **Raise Exception** > **PaymentNotFoundException** with message **"Payment not found for the given VisitId"**',
              'False branch: **Assign** > **Result** = **GetPayments.List.Current.Payment**',
              'Connect to **End**',
            ],
          },
          {
            title: 'Server Action: SA_ReleasePayment',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_ReleasePayment**',
              'Add Input Parameter:',
              '**VisitId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**Success** — Data Type: **Boolean**',
            ],
          },
          {
            title: 'SA_ReleasePayment — build the flow',
            instructions: [
              'Drag an **Aggregate** > Add Source: **Payment**',
              'Filter: **Payment.VisitId** = **VisitId**',
              'Drag an **If** node:',
              'Condition: **GetPayments.List.Empty**',
              'True branch: **Raise Exception** > **PaymentNotFoundException**',
              'False branch: Drag an **Assign** node:',
              '**GetPayments.List.Current.Payment.Status** = **Entities.PaymentStatus.Released**',
              '**GetPayments.List.Current.Payment.ReleasedAt** = **CurrDateTime()**',
              '**GetPayments.List.Current.Payment.UpdatedAt** = **CurrDateTime()**',
              'Drag **UpdatePayment** CRUD action',
              'Set **Source** = **GetPayments.List.Current.Payment**',
              'Drag **Assign**: **Success** = **True**',
              'Connect to **End**',
            ],
          },
          {
            title: 'Server Action: SA_RefundPayment',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_RefundPayment**',
              'Add Input Parameters:',
              '**VisitId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              '**RefundReason** — Data Type: **Text**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**Success** — Data Type: **Boolean**',
            ],
          },
          {
            title: 'SA_RefundPayment — build the flow',
            instructions: [
              'Drag an **Aggregate** > Add Source: **Payment**',
              'Filter: **Payment.VisitId** = **VisitId**',
              'Drag an **If** node:',
              'Condition: **GetPayments.List.Empty**',
              'True branch: **Raise Exception** > **PaymentNotFoundException**',
              'False branch: Drag an **Assign** node:',
              '**GetPayments.List.Current.Payment.Status** = **Entities.PaymentStatus.Refunded**',
              '**GetPayments.List.Current.Payment.RefundReason** = **RefundReason**',
              '**GetPayments.List.Current.Payment.UpdatedAt** = **CurrDateTime()**',
              'Drag **UpdatePayment** CRUD action',
              'Set **Source** = **GetPayments.List.Current.Payment**',
              'Drag **Assign**: **Success** = **True**',
              'Connect to **End**',
            ],
          },
          // CareVisit REST Endpoints
          {
            title: 'Create the "CareVisit" Exposed REST API',
            instructions: [
              '**Logic** tab > **Integrations** > **REST** > right-click **REST** > **Expose REST API**',
              'Name: **CareVisit**',
            ],
          },
          {
            title: 'REST Endpoint: POST /visits — CreateCareVisit',
            instructions: [
              'Right-click **CareVisit** REST API > **Add REST API Method**',
              'Name: **CreateCareVisit**',
              'HTTP Method: **POST**',
              'Create **Structure**: **CreateCareVisitRequest**',
              'Attributes: **CareRequestId** (**Long Integer**), **CaregiverId** (**Long Integer**), **FamilyUserId** (**Long Integer**), **CheckInTime** (**Date Time**)',
              'Add Input Parameter: **Request** — Data Type: **CreateCareVisitRequest**, Receive In: **Body**',
              'Add Output Parameter: **Result** — Data Type: **CareVisit**',
              'Flow: **Start** → **SA_CreateCareVisit** (pass fields from **Request**) → **Assign** output → **End**',
            ],
          },
          {
            title: 'REST Endpoint: GET /visits/{VisitId} — GetCareVisitById',
            instructions: [
              'Name: **GetCareVisitById**',
              'HTTP Method: **GET**',
              'Add Input Parameter: **VisitId** — Data Type: **Long Integer**, Receive In: **URL**',
              'Add Output Parameter: **Result** — Data Type: **CareVisit**',
              'Flow: **Start** → **SA_GetCareVisitById** → **Assign** output → **End**',
            ],
          },
          {
            title: 'REST Endpoint: GET /visits/by-caregiver/{CaregiverId} — ListByCaregiver',
            instructions: [
              'Name: **ListCareVisitsByCaregiver**',
              'HTTP Method: **GET**',
              'Add Input Parameter: **CaregiverId** — Data Type: **Long Integer**, Receive In: **URL**',
              'Add Output Parameter: **Results** — Data Type: **CareVisit List**',
              'Flow: **Start** → **SA_ListCareVisitsByCaregiver** → **Assign** output → **End**',
            ],
          },
          {
            title: 'REST Endpoint: GET /visits/by-request/{CareRequestId} — ListByCareRequest',
            instructions: [
              'Name: **ListCareVisitsByCareRequest**',
              'HTTP Method: **GET**',
              'Add Input Parameter: **CareRequestId** — Data Type: **Long Integer**, Receive In: **URL**',
              'Add Output Parameter: **Results** — Data Type: **CareVisit List**',
              'Flow: **Start** → **SA_ListCareVisitsByCareRequest** → **Assign** output → **End**',
            ],
          },
          {
            title: 'REST Endpoint: PUT /visits/{VisitId}/complete — CompleteCareVisit',
            instructions: [
              'Name: **CompleteCareVisit**',
              'HTTP Method: **PUT**',
              'Add Input Parameter: **VisitId** — Data Type: **Long Integer**, Receive In: **URL**',
              'Create **Structure**: **CompleteCareVisitRequest**',
              'Attributes: **CheckOutTime** (**Date Time**), **ProofPhotoS3Key** (**Text**), **CaregiverNotes** (**Text**)',
              'Add Input Parameter: **Request** — Data Type: **CompleteCareVisitRequest**, Receive In: **Body**',
              'Add Output Parameter: **Success** — Data Type: **Boolean**',
              'Flow: **Start** → **SA_CompleteCareVisit** (**VisitId**, **Request.CheckOutTime**, **Request.ProofPhotoS3Key**, **Request.CaregiverNotes**) → **Assign** output → **End**',
            ],
          },
          {
            title: 'REST Endpoint: PUT /visits/{VisitId}/confirm — ConfirmCareVisit',
            instructions: [
              'Name: **ConfirmCareVisit**',
              'HTTP Method: **PUT**',
              'Add Input Parameter: **VisitId** — Data Type: **Long Integer**, Receive In: **URL**',
              'Add Output Parameter: **Success** — Data Type: **Boolean**',
              'Flow: **Start** → **SA_ConfirmCareVisit** → **Assign** output → **End**',
            ],
          },
          {
            title: 'REST Endpoint: PUT /visits/{VisitId}/summary — UpdateVisitSummary',
            instructions: [
              'Name: **UpdateVisitSummary**',
              'HTTP Method: **PUT**',
              'Add Input Parameter: **VisitId** — Data Type: **Long Integer**, Receive In: **URL**',
              'Create **Structure**: **UpdateVisitSummaryRequest**',
              'Attribute: **AIGeneratedSummary** (**Text**)',
              'Add Input Parameter: **Request** — Data Type: **UpdateVisitSummaryRequest**, Receive In: **Body**',
              'Add Output Parameter: **Success** — Data Type: **Boolean**',
              'Flow: **Start** → **SA_UpdateVisitSummary** (**VisitId**, **Request.AIGeneratedSummary**) → **Assign** output → **End**',
            ],
          },
          // Payment REST Endpoints
          {
            title: 'Create the "Payment" Exposed REST API',
            instructions: [
              'Right-click **REST** > **Expose REST API**',
              'Name: **Payment**',
            ],
          },
          {
            title: 'REST Endpoint: POST /payments — CreatePayment',
            instructions: [
              'Right-click **Payment** REST API > **Add REST API Method**',
              'Name: **CreatePayment**',
              'HTTP Method: **POST**',
              'Create **Structure**: **CreatePaymentRequest**',
              'Attributes: **VisitId** (**Long Integer**), **FamilyUserId** (**Long Integer**), **Amount** (**Decimal**)',
              'Add Input Parameter: **Request** — Data Type: **CreatePaymentRequest**, Receive In: **Body**',
              'Add Output Parameter: **Result** — Data Type: **Payment**',
              'Flow: **Start** → **SA_CreatePayment** (pass fields from **Request**) → **Assign** output → **End**',
            ],
          },
          {
            title: 'REST Endpoint: GET /payments/by-visit/{VisitId} — GetPaymentByVisitId',
            instructions: [
              'Name: **GetPaymentByVisitId**',
              'HTTP Method: **GET**',
              'Add Input Parameter: **VisitId** — Data Type: **Long Integer**, Receive In: **URL**',
              'Add Output Parameter: **Result** — Data Type: **Payment**',
              'Flow: **Start** → **SA_GetPaymentByVisitId** → **Assign** output → **End**',
            ],
          },
          {
            title: 'REST Endpoint: PUT /payments/by-visit/{VisitId}/release — ReleasePayment',
            instructions: [
              'Name: **ReleasePayment**',
              'HTTP Method: **PUT**',
              'Add Input Parameter: **VisitId** — Data Type: **Long Integer**, Receive In: **URL**',
              'Add Output Parameter: **Success** — Data Type: **Boolean**',
              'Flow: **Start** → **SA_ReleasePayment** → **Assign** output → **End**',
            ],
          },
          {
            title: 'REST Endpoint: PUT /payments/by-visit/{VisitId}/refund — RefundPayment',
            instructions: [
              'Name: **RefundPayment**',
              'HTTP Method: **PUT**',
              'Add Input Parameter: **VisitId** — Data Type: **Long Integer**, Receive In: **URL**',
              'Create **Structure**: **RefundPaymentRequest**',
              'Attribute: **RefundReason** (**Text**)',
              'Add Input Parameter: **Request** — Data Type: **RefundPaymentRequest**, Receive In: **Body**',
              'Add Output Parameter: **Success** — Data Type: **Boolean**',
              'Flow: **Start** → **SA_RefundPayment** (**VisitId**, **Request.RefundReason**) → **Assign** output → **End**',
            ],
          },
          {
            title: 'Publish and test CareVisit + Payment service',
            instructions: [
              '**1-Click Publish** (**Ctrl+Shift+P**)',
              'Right-click the **CareVisit** REST API > **Open Documentation**',
              'Right-click the **Payment** REST API > **Open Documentation**',
              'Test the full flow: create a visit, complete it (check **DurationMinutes** is calculated), confirm it, then create and release a payment',
            ],
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // PHASE 4: CC_Orchestration Composite
  // ──────────────────────────────────────────────
  {
    id: 4,
    title: 'CC_Orchestration Composite',
    description:
      'Build composite Server Actions that orchestrate across all atomic services, set up the **Timer**, and expose final REST endpoints.',
    timeEstimate: '2-3 hours',
    sections: [
      {
        id: '4.1',
        title: 'Add Dependencies on Atomic Services',
        summary:
          'Import all **SA_*** Server Actions from the 5 atomic modules using **Manage Dependencies**.',
        steps: [
          {
            title: 'Open Manage Dependencies (Ctrl+Q)',
            instructions: [
              'Open the **CC_Orchestration** module',
              'Press **Ctrl+Q** to open **Manage Dependencies**',
              'Search for **CareConnect_Family** > expand > check all **SA_*** actions',
              'Search for **CareConnect_Caregiver** > expand > check all **SA_*** actions',
              'Search for **CareConnect_AvailabilitySlot** > expand > check all **SA_*** actions',
              'Search for **CareConnect_CareRequest** > expand > check all **SA_*** actions',
              'Search for **CareConnect_CareVisit** > expand > check all **SA_*** actions',
              'Also import from **(System)**: **User_CreateOrUpdate**, **User_Login**',
              'Click **Apply** and wait for refresh',
            ],
            tip: 'Direct module references (Service Actions) give compile-time type checking, no HTTP overhead, and auto-update when source changes. This is faster and safer than calling REST endpoints internally.',
          },
        ],
      },
      {
        id: '4.3',
        title: 'Composite Server Actions',
        summary:
          'Build the main business logic actions that orchestrate multiple atomic services.',
        steps: [
          {
            title: 'SA_DoRegisterUser (US1a)',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_DoRegisterUser**',
              'Add Input Parameters:',
              '**GivenName** — Data Type: **Text**, Is Mandatory: **Yes**',
              '**FamilyName** — Data Type: **Text**, Is Mandatory: **Yes**',
              '**Email** — Data Type: **Text**, Is Mandatory: **Yes**',
              '**Password** — Data Type: **Text**, Is Mandatory: **Yes**',
              '**UserRole** — Data Type: **Text**, Is Mandatory: **Yes** ("Family" or "Caregiver")',
              '**PhoneNumber** — Data Type: **Text**, Is Mandatory: **No**',
              '**Bio** — Data Type: **Text**, Is Mandatory: **No**',
              '**SkillProductClassIds** — Data Type: **Text**, Is Mandatory: **No**',
              '**SkillProductTypeIds** — Data Type: **Text**, Is Mandatory: **No**',
              'Add Output Parameters:',
              '**UserId** — Data Type: **Long Integer**',
              '**PartyId** — Data Type: **Text**',
              '**OutUserRole** — Data Type: **Text**',
            ],
          },
          {
            title: 'SA_DoRegisterUser — build the flow',
            instructions: [
              'Flow: **Start** → **AddPerson** (Party API: **GivenName**, **FamilyName**, **Email**) → **User_CreateOrUpdate** (System: create platform user) → **If** (**UserRole** = **"Family"**)',
              'True branch: **SA_CreateFamily** (**UserId**, **PartyId**, **Email**, **PhoneNumber**)',
              'False branch: **SA_CreateCaregiver** (**UserId**, **PartyId**, **Bio**, **SkillProductClassIds**, **SkillProductTypeIds**)',
              'Both branches converge to: **Assign** outputs (**UserId**, **PartyId**, **OutUserRole**) → **End**',
            ],
          },
          {
            title: 'SA_DoLoginUser (US1a)',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_DoLoginUser**',
              'Add Input Parameters:',
              '**Email** — Data Type: **Text**, Is Mandatory: **Yes**',
              '**Password** — Data Type: **Text**, Is Mandatory: **Yes**',
              'Add Output Parameters:',
              '**UserId** — Data Type: **Long Integer**',
              '**PartyId** — Data Type: **Text**',
              '**UserRole** — Data Type: **Text**',
              '**GivenName** — Data Type: **Text**',
            ],
          },
          {
            title: 'SA_DoLoginUser — build the flow',
            instructions: [
              'Flow: **Start** → **User_Login** (**Email**, **Password**) → **GetUserId()** (built-in) → Try **SA_GetFamilyByUserId**',
              'If **FamilyNotFoundException** is caught: try **SA_GetCaregiverByUserId** → set **UserRole** = **"Caregiver"**',
              'If Family is found: set **UserRole** = **"Family"**',
              'Then: **GetPerson** (Party API with **PartyId**) → **Assign** all outputs (**UserId**, **PartyId**, **UserRole**, **GivenName**) → **End**',
            ],
            tip: 'Use an **Exception Handler** around **SA_GetFamilyByUserId** to catch **FamilyNotFoundException**, then fall through to try the Caregiver path.',
          },
          {
            title: 'SA_RequestCareVisit (US1b)',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_RequestCareVisit**',
              'Add Input Parameters:',
              '**FamilyId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              '**PatientName** — Data Type: **Text**, Is Mandatory: **Yes**',
              '**SkillProductTypeId** — Data Type: **Text**, Is Mandatory: **Yes**',
              '**RequestedDate** — Data Type: **Date**, Is Mandatory: **Yes**',
              '**StartTime** — Data Type: **Time**, Is Mandatory: **Yes**',
              '**EndTime** — Data Type: **Time**, Is Mandatory: **Yes**',
              '**Notes** — Data Type: **Text**, Is Mandatory: **No**',
              '**DocumentFile** — Data Type: **Text** (base64), Is Mandatory: **No**',
              '**DocumentFileName** — Data Type: **Text**, Is Mandatory: **No**',
            ],
          },
          {
            title: 'SA_RequestCareVisit — build the flow',
            instructions: [
              'Flow: **Start** → **SA_CreateCareRequest** (pass all relevant fields) → **If** (**DocumentFile** <> **""**)',
              'True branch: **SA_UploadToS3** (**DocumentFileName**, **DocumentFile**, folder, subfolder) → update request with **S3Key**',
              'False branch: skip upload',
              'Both converge to: **SA_PublishEvent** (**ExchangeName** = **"CareRequestCreated"**, **RoutingKey** = **"care.request.new"**, **Payload** = JSON of request) → **End**',
            ],
          },
          {
            title: 'SA_MatchAndAssign (US2)',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_MatchAndAssign**',
              'Add Input Parameter:',
              '**CareRequestId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              'Add Output Parameter:',
              '**Assigned** — Data Type: **Boolean**',
            ],
          },
          {
            title: 'SA_MatchAndAssign — build the flow',
            instructions: [
              'Flow: **Start** → **SA_GetCareRequestById** → **SA_ListCaregiversBySkills** (pass **CareTypeProductClassId**, **SkillProductTypeIds**) → **For Each** caregiver in list',
              'Inside loop: match by **SkillProductTypeId** → **SA_AssignCaregiverToRequest** → **SA_CreateCareVisit** → **SA_CreatePayment** (hold payment) → **SA_UpdateLastAssigned** → **SA_PublishEvent** ("CaregiverAssigned") → **Assign** **Assigned** = **True** → **End**',
              'If no match found after loop: **SA_IncrementAssignmentAttempts** → check if **AssignmentAttempts** >= **Site.MaxAssignmentAttempts** → If yes: **SA_EscalateRequest**',
            ],
            important:
              'If no caregiver matches and **AssignmentAttempts** >= **MaxAssignmentAttempts**, escalate the request by setting its status to **Escalated**.',
          },
          {
            title: 'SA_ConfirmAndRelease (US3a)',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_ConfirmAndRelease**',
              'Add Input Parameters:',
              '**CareVisitId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              '**CaregiverNotes** — Data Type: **Text**, Is Mandatory: **No**',
              '**ProofPhotoFile** — Data Type: **Text** (base64), Is Mandatory: **No**',
              '**ProofPhotoFileName** — Data Type: **Text**, Is Mandatory: **No**',
            ],
          },
          {
            title: 'SA_ConfirmAndRelease — build the flow',
            instructions: [
              'Flow: **Start** → If **ProofPhotoFile** is not empty: **SA_UploadToS3** (upload proof photo) → **SA_CompleteCareVisit** (set **CheckOutTime**, **ProofPhotoS3Key**, **CaregiverNotes**)',
              'Then: **SA_ReleasePayment** (release held payment) → **SA_UpdateCaregiverRating** (increment TotalVisits) → **SA_UpdateVisitSummary** (hardcoded AI summary for now) → **SA_PublishEvent** ("VisitCompleted") → **End**',
            ],
            tip: 'For the AI summary, use a hardcoded string for now: **"Care visit completed. Patient: " + PatientName + ". Duration: X hours."** Replace with real AI integration later.',
          },
          {
            title: 'SA_EscalateRequest (US3b)',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_EscalateRequest**',
              'Add Input Parameter:',
              '**CareRequestId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              'Flow: **Start** → **SA_UpdateCareRequestStatus** (**CareRequestId**, **Entities.CareRequestStatus.Escalated**) → **SA_PublishEvent** ("EscalationTriggered") → **End**',
            ],
          },
          {
            title: 'SA_DisputeVisit',
            instructions: [
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_DisputeVisit**',
              'Add Input Parameter:',
              '**VisitId** — Data Type: **Long Integer**, Is Mandatory: **Yes**',
              'Flow: **Start** → **SA_UpdateVisitStatus** (**VisitId**, **Entities.VisitStatus.Disputed**) → **SA_PublishEvent** ("VisitDisputed") → **End**',
            ],
          },
        ],
      },
      {
        id: '4.4',
        title: 'ReassignmentCheck Timer',
        summary:
          'A **Timer** that periodically checks for open care requests and attempts to assign caregivers.',
        steps: [
          {
            title: 'Create the Timer',
            instructions: [
              '**Logic** tab > right-click **Timers** > **Add Timer**',
              'Name: **ReassignmentCheck**',
              'In the **Properties** panel: set **Schedule** = **"Every 30 minutes"** (or use **TimerIntervalMinutes** site property)',
              'Double-click the Timer to open its flow',
              'Flow: **Start** → **SA_ListCareRequestsByStatus** (pass **Entities.CareRequestStatus.Open**) → **For Each** request in results → **SA_MatchAndAssign** (**CareRequestId**) → **End**',
            ],
            important:
              'The Timer runs on the server automatically. It picks up requests that failed initial assignment and retries matching them with available caregivers.',
          },
        ],
      },
      {
        id: '4.5',
        title: 'Expose Composite REST Endpoints',
        summary:
          'Create REST APIs that the UI team calls for user registration, login, care requests, and visit management.',
        steps: [
          {
            title: 'Create "User" REST API',
            instructions: [
              '**Logic** tab > **Integrations** > **REST** > right-click **REST** > **Expose REST API**',
              'Name: **User**',
              'Right-click **User** > **Add REST API Method**:',
              '**RegisterUser** — HTTP Method: **POST**',
              'Add Input Parameter: **Request** (Structure with all registration fields), Receive In: **Body**',
              'Flow: **Start** → **SA_DoRegisterUser** → **Assign** outputs → **End**',
              'Right-click **User** > **Add REST API Method**:',
              '**LoginUser** — HTTP Method: **POST**',
              'Add Input Parameter: **Request** (Structure with **Email**, **Password**), Receive In: **Body**',
              'Flow: **Start** → **SA_DoLoginUser** → **Assign** outputs → **End**',
            ],
          },
          {
            title: 'Create "CareRequest" REST API',
            instructions: [
              'Right-click **REST** > **Expose REST API**',
              'Name: **CareRequest**',
              '**RequestCareVisit** — HTTP Method: **POST**',
              'Input: **Request** (Structure), Receive In: **Body**',
              'Flow: **Start** → **SA_RequestCareVisit** → **Assign** output → **End**',
              '**GetRequestsByFamilyId** — HTTP Method: **GET**',
              'Input: **FamilyId** (**Long Integer**), Receive In: **URL**',
              'Flow: **Start** → **SA_ListCareRequestsByFamily** → **Assign** output → **End**',
              '**MatchAndAssign** — HTTP Method: **POST**',
              'Input: **CareRequestId** (**Long Integer**), Receive In: **Body**',
              'Flow: **Start** → **SA_MatchAndAssign** → **Assign** output → **End**',
            ],
          },
          {
            title: 'Create "CareVisit" REST API',
            instructions: [
              'Right-click **REST** > **Expose REST API**',
              'Name: **CareVisit**',
              '**ConfirmAndRelease** — HTTP Method: **POST**',
              'Input: **Request** (Structure with **CareVisitId**, **CaregiverNotes**, **ProofPhotoFile**, **ProofPhotoFileName**), Receive In: **Body**',
              'Flow: **Start** → **SA_ConfirmAndRelease** → **Assign** output → **End**',
              '**DisputeVisit** — HTTP Method: **POST**',
              'Input: **VisitId** (**Long Integer**), Receive In: **Body**',
              'Flow: **Start** → **SA_DisputeVisit** → **Assign** output → **End**',
              '**GetVisitsByCaregiverId** — HTTP Method: **GET**',
              'Input: **CaregiverId** (**Long Integer**), Receive In: **URL**',
              'Flow: **Start** → **SA_ListCareVisitsByCaregiver** → **Assign** output → **End**',
            ],
          },
          {
            title: 'Publish and test the full workflow',
            instructions: [
              '**1-Click Publish** all modules (publish atomics first, then **CC_Orchestration**)',
              'Open **Swagger UI** for **CC_Orchestration**',
              'Test the full flow:',
              '1. **RegisterUser** (POST) — create a Family user and a Caregiver user',
              '2. **LoginUser** (POST) — verify login returns correct role',
              '3. **RequestCareVisit** (POST) — create a care request',
              '4. **MatchAndAssign** (POST) — assign a caregiver',
              '5. **ConfirmAndRelease** (POST) — complete and release payment',
            ],
            tip: 'Publish order matters: atomic services first (**CareConnect_Family**, **CareConnect_Caregiver**, etc.), then **CC_Orchestration** (which depends on them).',
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // PHASE 5: Seed Product Data
  // ──────────────────────────────────────────────
  {
    id: 5,
    title: 'Seed Product Data',
    description:
      'Create the product taxonomy (**Family** > **Class** > **Type**) in **SMULab** so caregivers can declare skills and families can select care types.',
    timeEstimate: '30-45 min',
    sections: [
      {
        id: '5.1',
        title: 'Create Product Hierarchy',
        summary:
          'Use **Swagger UI** or **Postman** to create 1 Product Family, 3 Product Classes, and 10 Product Types.',
        steps: [
          {
            title: 'Get your API key',
            instructions: [
              'Go to **SMULab Utilities**: **smuedu-dev.outsystemsenterprise.com/SMULabUtilities/**',
              'Register for an API key (sent to your email)',
              'Add header **X-Contacts-Key** to every Product API call',
            ],
          },
          {
            title: 'Create Product Family',
            instructions: [
              '**POST /AddProductFamily**',
              'Body:',
              '**Name**: **"Home Care Services"**',
              '**Description**: **"Home-based caregiving services"**',
              'Copy the returned **ProductFamilyId** — you need it for classes and Site Properties',
            ],
          },
          {
            title: 'Create 3 Product Classes',
            instructions: [
              '**POST /AddProductClass** for each:',
              '**Elderly Care** — Description: **"Care services for elderly individuals"**',
              '**Child Special Needs** — Description: **"Care services for children with special needs"**',
              '**Post-Surgery Recovery** — Description: **"Care services for post-surgery recovery"**',
              'Copy each **ProductClassId** — these become your Site Property values',
            ],
          },
          {
            title: 'Create 10 Product Types',
            instructions: [
              '**POST /AddProductType** for each:',
              'Under **Elderly Care**:',
              '**Mobility Assistance**',
              '**Medication Reminders**',
              '**Dementia Care Support**',
              '**Meal Preparation**',
              'Under **Child Special Needs**:',
              '**ABA Therapy Companion**',
              '**Communication Assistance**',
              '**Sensory Activity Support**',
              'Under **Post-Surgery Recovery**:',
              '**Wound Care Observation**',
              '**Physical Therapy Support**',
              '**Post-Op Medication Management**',
            ],
          },
          {
            title: 'Update Site Properties with IDs',
            instructions: [
              'Go to **Service Center** > **Factory** > **Modules** > **CC_Orchestration** > **Site Properties**',
              'Set **DefaultProductFamilyId** = the **ProductFamilyId** you copied',
              'Set **ElderlyCarePCId** = the Elderly Care **ProductClassId**',
              'Set **ChildSNPCId** = the Child Special Needs **ProductClassId**',
              'Set **PostSurgPCId** = the Post-Surgery Recovery **ProductClassId**',
            ],
            important:
              'Use **Service Center** (web browser), not **Service Studio**, to update Site Property values in the deployed environment.',
          },
        ],
      },
    ],
  },
]
