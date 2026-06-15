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
            title: 'Set Product Server Actions and Structures to Public',
            instructions: [
              'For each of the 4 Product Server Actions (**SA_GetProductFamilies**, **SA_GetProductClasses**, **SA_GetProductTypes**, **SA_GetProductHierarchy**):',
              'Click the action name > in the **Properties** panel, set **Public** = **Yes**',
              'Next, set the Structures used by these actions to Public as well:',
              'Go to the **Data** tab > **Structures**',
              'Click **ProductFamily** > in **Properties**, set **Public** = **Yes**',
              'Click **ProductClass** > set **Public** = **Yes**',
              'Click **ProductType** > set **Public** = **Yes**',
              'Click **ProductHierarchy** > set **Public** = **Yes**',
            ],
            important: 'If a Server Action is Public but its output Structure is NOT Public, you will get an error: "Invalid Public Action — parameter is defined as a record of type X Structure that is not public." You must set BOTH the action AND its Structures to Public.',
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
              'No Local Variables needed — you will build the record directly on the **Result** output parameter',
            ],
          },
          {
            title: 'SA_CreateFamily — build the flow',
            instructions: [
              'Drag an **Assign** node after **Start**',
              'Add assignments (build the Family record directly on the **Result** output parameter):',
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
              '**Result.Id** = **CreateFamily.Id**',
              'Connect to **End**',
            ],
            tip: 'The **CreateFamily** CRUD action is auto-generated when you create the entity. Find it under **Data** > **Family** > **CreateFamily**. Drag it onto the flow canvas. The output **CreateFamily.Id** is the auto-generated primary key of the newly inserted record.',
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
              'Add Input Parameters (set **Receive In** = **URL** for both — since they are NOT in the URL path pattern, OutSystems treats them as query string ?key=value pairs):',
              '**MinimumRating** — Data Type: **Decimal**, Default Value: **0**, Receive In: **URL**',
              '**Limit** — Data Type: **Integer**, Default Value: **10**, Receive In: **URL**',
              'Add Output Parameter:',
              '**Results** — Data Type: **Family List**',
              'Flow: **Start** → **SA_ListFamiliesByRating** (**MinimumRating**, **Limit**) → **Assign** (**Results** = **SA_ListFamiliesByRating.Results**) → **End**',
            ],
          },
          {
            title: 'Set Entity and Server Actions to Public',
            instructions: [
              'Before publishing, you must set the Entity and all Server Actions to **Public** so other modules can consume them via Ctrl+Q:',
              '**Data** tab > **Entities** > click **Family** > in **Properties**, set **Public** = **Yes**',
              '**Logic** tab > **Server Actions** > for EACH Server Action (**SA_CreateFamily**, **SA_GetFamilyByUserId**, **SA_GetFamilyById**, **SA_UpdateFamily**, **SA_ListFamiliesByRating**): click it > set **Public** = **Yes**',
            ],
            important: 'If a Server Action is Public but the Entity it returns is NOT Public, you will get: **"Invalid Public Action — parameter is defined as a record of type Family Entity that is not public."** You must set BOTH the Server Actions AND the Entity to Public.',
          },
          {
            title: 'Publish the Family service',
            instructions: [
              'Press **Ctrl+Shift+P** to publish the **CareConnect_Family** module',
              'Wait for the green **"1-Click Publish completed"** message at the bottom of Service Studio',
              'If you see errors, read them and fix before proceeding — common issues:',
              '**"Invalid Public Action"** — you forgot to set the **Family** entity to **Public = Yes**. Go to Data > Entities > Family > Properties > Public = Yes',
              '**"Database Upgrade Error"** — you may have changed the primary key or deleted/recreated the entity. Delete the entity, publish (drops the table), recreate it, publish again',
              '**"Type mismatch"** — check that your Server Action inputs/outputs match the entity attribute types exactly',
            ],
          },
          {
            title: 'Open Swagger UI for testing',
            instructions: [
              'In the **Logic** tab, expand **Integrations** > **REST** > find the **Family** exposed REST API',
              'Right-click **Family** > **Open Documentation**',
              'Your browser opens the **Swagger UI** page for this module — this is where you test every endpoint',
              'You should see all your REST methods listed: **CreateFamily**, **GetFamilyByUserId**, **GetFamilyById**, **UpdateFamily**, **ListByRating**',
              'If any method is missing, go back to Service Studio and check you created it under the **Family** exposed REST API',
            ],
          },
          {
            title: 'Test 1: POST /families (CreateFamily)',
            instructions: [
              'In Swagger UI, click on **POST /CreateFamily** to expand it',
              'Click the **Try it out** button (top-right of the expanded section)',
              'In the **Request body** text box, paste this sample JSON:',
              '```{ "UserId": 1, "PartyId": "test-party-001", "Email": "test@example.com", "PhoneNumber": "+6591234567" }```',
              'Click the blue **Execute** button',
              'Check the **Response body** — you should see a JSON object with all the Family fields, including an auto-generated **Id** (the primary key)',
              '**Copy the Id value** (e.g., **1**) — you will need it for the next tests',
              'Also note the **UserId** value (e.g., **1**) — you will need it too',
              'The **Response Code** should be **200**',
            ],
            important: 'If you get a **500 error**, check **Service Center** > **Monitoring** > **Errors** for the detailed error message. Common causes: missing required fields, database constraint violations, or the Server Action flow has an error.',
          },
          {
            title: 'Test 2: GET /families/{UserId} (GetFamilyByUserId)',
            instructions: [
              'In Swagger UI, click on **GET /GetFamilyByUserId** to expand it',
              'Click **Try it out**',
              'In the **UserId** field, enter the UserId you used in Test 1 (e.g., **1**)',
              'Click **Execute**',
              'The **Response body** should return the same Family record you created in Test 1',
              'Verify the **Email**, **PhoneNumber**, and **PartyId** match what you sent',
            ],
          },
          {
            title: 'Test 3: GET /families/id/{FamilyId} (GetFamilyById)',
            instructions: [
              'Click on **GET /GetFamilyById** > **Try it out**',
              'Enter the **Id** (FamilyId) you copied from Test 1 (e.g., **1**)',
              'Click **Execute**',
              'Should return the same Family record',
            ],
          },
          {
            title: 'Test 4: PUT /families/{FamilyId} (UpdateFamily)',
            instructions: [
              'Click on **PUT /UpdateFamily** > **Try it out**',
              'In the **FamilyId** field, enter the Id from Test 1 (e.g., **1**)',
              'In the **Request body**, paste:',
              '```{ "Email": "updated@example.com", "PhoneNumber": "+6599887766", "PreferredSkillProductTypeIds": "" }```',
              'Click **Execute**',
              'Response should show **"Success": true**',
              'To verify: go back and run **GET /GetFamilyById** again with the same Id — the Email and PhoneNumber should now show the updated values',
            ],
          },
          {
            title: 'Test 5: GET /families/list-by-rating (ListByRating)',
            instructions: [
              'Click on **GET /ListByRating** > **Try it out**',
              'Leave **MinimumRating** as **0** and **Limit** as **10** (or adjust as you like)',
              'Click **Execute**',
              'Response should return a list (array) of Family records — at least the one you created',
              'If the list is empty, the MinimumRating filter may be excluding your record (the default Rating is **0**, so MinimumRating = **0** should include it)',
            ],
            tip: 'For **GET** methods, set **Receive In** = **URL** for all input parameters (the default is **Body**, which is invalid for GET). Parameters that appear in the URL path pattern become path segments. Parameters that do NOT appear in the URL path pattern become query string **?key=value** pairs automatically.',
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
              'Add Input Parameters (set **Receive In** = **URL** for all — since they are NOT in the URL path pattern, they become query string params):',
              '**SkillProductClassId** — Data Type: **Text**, Receive In: **URL**',
              '**SkillProductTypeId** — Data Type: **Text**, Receive In: **URL** (optional)',
              '**ExcludeIds** — Data Type: **Text**, Receive In: **URL** (optional)',
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
            title: 'Set Entity and Server Actions to Public',
            instructions: [
              '**Data** tab > **Entities** > click **Caregiver** > set **Public** = **Yes**',
              '**Logic** tab > **Server Actions** > set **Public** = **Yes** on ALL Server Actions (**SA_CreateCaregiver**, **SA_GetCaregiverByUserId**, **SA_GetCaregiverById**, **SA_UpdateCaregiver**, **SA_ListCaregiversBySkills**, **SA_UpdateCaregiverRating**, **SA_UpdateLastAssigned**)',
            ],
            important: 'Both the Entity AND the Server Actions must be Public. If either is missing, you get "Invalid Public Action" errors on publish.',
          },
          {
            title: 'Publish the Caregiver service',
            instructions: [
              'Press **Ctrl+Shift+P** to publish the **CareConnect_Caregiver** module',
              'Wait for the green **"1-Click Publish completed"** message',
              'Right-click the **Caregiver** REST API > **Open Documentation** to open Swagger UI',
            ],
          },
          {
            title: 'Test 1: POST /caregivers (CreateCaregiver)',
            instructions: [
              'Click **POST /CreateCaregiver** > **Try it out**',
              'Paste this sample JSON in the Request body:',
              '```{ "UserId": 2, "PartyId": "test-party-002", "Bio": "Experienced elderly care provider", "SkillProductClassIds": "", "SkillProductTypeIds": "" }```',
              'Click **Execute**',
              'Response should return a Caregiver record with an auto-generated **Id**, **IsAvailable** = **true**, **IsVerified** = **false**, **Rating** = **0**',
              '**Copy the Id value** — you need it for the next tests',
            ],
          },
          {
            title: 'Test 2: GET /caregivers/{UserId} (GetCaregiverByUserId)',
            instructions: [
              'Click **GET /GetCaregiverByUserId** > **Try it out**',
              'Enter **UserId** = **2** (the UserId from Test 1)',
              'Click **Execute** — should return the same Caregiver record',
            ],
          },
          {
            title: 'Test 3: GET /caregivers/id/{CaregiverId} (GetCaregiverById)',
            instructions: [
              'Click **GET /GetCaregiverById** > **Try it out**',
              'Enter the **CaregiverId** (the Id from Test 1)',
              'Click **Execute** — should return the same Caregiver record',
            ],
          },
          {
            title: 'Test 4: PUT /caregivers/{CaregiverId} (UpdateCaregiver)',
            instructions: [
              'Click **PUT /UpdateCaregiver** > **Try it out**',
              'Enter the **CaregiverId** from Test 1',
              'Paste this JSON in the Request body:',
              '```{ "Bio": "Updated bio - 5 years experience", "SkillProductClassIds": "class-001", "SkillProductTypeIds": "type-001,type-002", "IsAvailable": true }```',
              'Click **Execute** — Response should show **"Success": true**',
              'Verify: run **GET /GetCaregiverById** again — Bio, SkillProductClassIds, and SkillProductTypeIds should show updated values',
            ],
          },
          {
            title: 'Test 5: GET /caregivers/list (ListCaregiversBySkills)',
            instructions: [
              'Click **GET /ListCaregiversBySkills** > **Try it out**',
              'Enter **SkillProductClassId** = **class-001** (the value you set in Test 4)',
              'Leave **SkillProductTypeId** and **ExcludeIds** empty',
              'Click **Execute** — should return a list containing your caregiver',
            ],
          },
          {
            title: 'Test 6: PUT /caregivers/{CaregiverId}/update-rating and /last-assigned',
            instructions: [
              'Click **PUT /UpdateCaregiverRating** > **Try it out**',
              'Enter the **CaregiverId** — click **Execute** — should return **"Success": true**',
              'Click **PUT /UpdateLastAssigned** > **Try it out**',
              'Enter the **CaregiverId** — click **Execute** — should return **"Success": true**',
              'Verify: run **GET /GetCaregiverById** — check that **Rating** and **LastAssignedAt** have been updated',
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
              'Add Input Parameters (set **Receive In** = **URL** for all — since they are NOT in the URL path pattern, they become query string params):',
              '**CaregiverId** — Data Type: **Long Integer**, Default Value: **0**, Receive In: **URL**',
              '**SlotDate** — Data Type: **Date**, Default Value: **NullDate()**, Receive In: **URL**',
              '**IsBooked** — Data Type: **Boolean**, Default Value: **False**, Receive In: **URL**',
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
            title: 'Set Entity and Server Actions to Public',
            instructions: [
              '**Data** tab > **Entities** > click **AvailabilitySlot** > set **Public** = **Yes**',
              '**Logic** tab > **Server Actions** > set **Public** = **Yes** on ALL Server Actions (**SA_CreateSlot**, **SA_ListAvailableSlots**, **SA_BookSlot**, **SA_UnbookSlot**, **SA_DeleteSlot**)',
            ],
            important: 'Both the Entity AND the Server Actions must be Public. If either is missing, you get "Invalid Public Action" errors on publish.',
          },
          {
            title: 'Publish the AvailabilitySlot service',
            instructions: [
              'Press **Ctrl+Shift+P** to publish the **CareConnect_AvailabilitySlot** module',
              'Wait for the green **"1-Click Publish completed"** message',
              'Right-click the **AvailabilitySlot** REST API > **Open Documentation** to open Swagger UI',
            ],
          },
          {
            title: 'Test 1: POST /slots (CreateSlot)',
            instructions: [
              'Click **POST /CreateSlot** > **Try it out**',
              'Paste this sample JSON (use tomorrow\'s date in YYYY-MM-DD format):',
              '```{ "CaregiverId": 1, "SlotDate": "2026-05-15", "SlotStartTime": "09:00:00", "SlotEndTime": "12:00:00", "CareTypeProductClassId": "class-001" }```',
              'Click **Execute**',
              'Response should return a slot record with **IsBooked** = **false** and an auto-generated **Id**',
              '**Copy the Id value** — you need it for the booking and delete tests',
            ],
            tip: 'Replace **2026-05-15** with an actual future date. The **CaregiverId** should match a caregiver that exists in your system (e.g., the one you created in 3B tests).',
          },
          {
            title: 'Test 2: GET /slots/list (ListAvailableSlots)',
            instructions: [
              'Click **GET /ListAvailableSlots** > **Try it out**',
              'Set **CaregiverId** = **1**, leave **SlotDate** empty, set **IsBooked** = **false**',
              'Click **Execute** — should return a list containing the slot you just created',
            ],
          },
          {
            title: 'Test 3: PUT /slots/{AvailabilitySlotId}/book (BookSlot)',
            instructions: [
              'Click **PUT /BookSlot** > **Try it out**',
              'Enter the **AvailabilitySlotId** (the Id from Test 1)',
              'Click **Execute** — should return **"Success": true**',
              'Verify: run **GET /ListAvailableSlots** with **IsBooked** = **true** — your slot should appear with **IsBooked** = **true**',
            ],
          },
          {
            title: 'Test 4: DELETE /slots/{AvailabilitySlotId} (DeleteSlot — should FAIL)',
            instructions: [
              'Click **DELETE /DeleteSlot** > **Try it out**',
              'Enter the same **AvailabilitySlotId** (which is now booked)',
              'Click **Execute**',
              'This should **fail** with a **500 error** — your SA_DeleteSlot should raise an exception because the slot is booked',
              'This is the expected behavior — you cannot delete a booked slot',
            ],
          },
          {
            title: 'Test 5: PUT /slots/{AvailabilitySlotId}/unbook → then DELETE (should succeed)',
            instructions: [
              'Click **PUT /UnbookSlot** > **Try it out**',
              'Enter the same **AvailabilitySlotId** — click **Execute** — should return **"Success": true**',
              'Now click **DELETE /DeleteSlot** > **Try it out** > enter the same Id > **Execute**',
              'This time it should **succeed** with **"Success": true** because the slot is no longer booked',
              'Verify: run **GET /ListAvailableSlots** — the deleted slot should no longer appear',
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
              '**Result.AssignedCaregiverId** = **0** (no caregiver assigned yet — this gets set later via SA_AssignCaregiverToRequest)',
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
            title: 'Server Action: SA_ListCareRequestsByStatus — create & define the signature',
            instructions: [
              'This action returns every CareRequest that currently has a given status (e.g. all **Open** requests). The matching engine uses it later to find work that needs a caregiver.',
              'In the **Logic** tab, right-click **Server Actions** > **Add Server Action**',
              'Click the new action once and, in the **Properties** panel (bottom-right), set **Name** = **SA_ListCareRequestsByStatus**',
              '— Add the INPUT parameter —',
              'Right-click the action in the tree > **Add Input Parameter**',
              '**Name**: **Status** · **Data Type**: **CareRequestStatus Identifier** · **Is Mandatory**: **Yes**',
              '(Pick the Data Type by typing "CareRequestStatus" in the dropdown and choosing the **Identifier** entry — NOT the entity itself.)',
              '— Add the OUTPUT parameter —',
              'Right-click the action > **Add Output Parameter**',
              '**Name**: **Results** · **Data Type**: **CareRequest List** (type "CareRequest" and choose the **List** option)',
            ],
            tip: 'Unlike SA_ListCareRequestsByFamily, this action has only ONE input (Status) and it is mandatory — the caller must always specify which status to filter by.',
            important:
              'We use a **SQL** element (not an **Aggregate**) here for consistency with the other List actions and because **Status** is an **Identifier** type. An Aggregate would also work for this simple single-filter case, but the term project standardises on SQL for the CareRequest list actions.',
          },
          {
            title: 'SA_ListCareRequestsByStatus — build the flow with SQL',
            instructions: [
              '— Add the SQL element —',
              'From the toolbox on the left, drag a **SQL** element onto the flow line, placing it between **Start** and **End**',
              'Double-click the SQL element to open the **SQL editor**',
              '— Define the output shape —',
              'In the editor, find **Output** > click **Add** (or the **+**) > select the **CareRequest** entity. This tells OutSystems each row maps to a CareRequest record, exposed as **SQL1.List**.',
              '— Declare the query parameter —',
              'In the editor, find **Parameters** > click **Add** > **Name**: **Status** · **Data Type**: **CareRequestStatus Identifier**',
              '(This @-parameter is what safely injects the input value into the query — never concatenate values into SQL text.)',
              '— Write the query — type this exactly into the SQL text area:',
              '**SELECT {CareRequest}.* FROM {CareRequest} WHERE {CareRequest}.[Status] = @Status**',
              'Click **Done** / close the SQL editor',
              '— Map the result to the output —',
              'Drag an **Assign** node onto the flow after the SQL element',
              'In the Assign, set: **Results** (left) = **SQL1.List** (right)',
              '(If your SQL element was auto-named something other than SQL1, use that name + **.List**.)',
              'Connect the Assign to **End**',
              'Final flow: **Start** → **SQL1** → **Assign (Results = SQL1.List)** → **End**',
            ],
            tip: 'OutSystems SQL syntax: **{CareRequest}** = the entity (wrapped in curly braces), **{CareRequest}.[Status]** = the column (column in square brackets), and **@Status** = the input parameter you declared. Get the braces/brackets wrong and the query will not compile.',
            important:
              'After building, **1-Click Publish** and test in **Service Center** or via the REST endpoint. A common mistake is leaving the Assign out — without it, **Results** stays empty even though the SQL ran. The SQL element holds the rows in **SQL1.List**; the Assign is what copies them into the action\'s **Results** output.',
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
            title: 'REST Endpoint: POST /care-requests — CreateCareRequest (1/2: create the request Structure)',
            instructions: [
              'GOAL: expose **SA_CreateCareRequest** to the outside world as an HTTP endpoint. A family\'s app will POST a JSON body to this URL to create a new care request. We first build the **Structure** that defines the shape of that JSON body.',
              '— Make sure the REST API container exists —',
              'In the **Logic** tab, expand **Integrations** > **REST**. You should already have a **CareRequest** REST API group (the one you created earlier). If not: right-click **REST** > **Expose REST API** > name it **CareRequest**.',
              '— Create the input Structure —',
              'In the **Data** tab, right-click **Structures** > **Add Structure**',
              'Name it **CreateCareRequestRequest** (this is what the API consumer sends as JSON)',
              'Add these **11 attributes** (right-click the Structure > **Add Structure Attribute** for each). They mirror the inputs of **SA_CreateCareRequest** exactly:',
              '**FamilyUserId** — **Long Integer**',
              '**FamilyPartyId** — **Text**',
              '**PatientName** — **Text**',
              '**CareTypeProductClassId** — **Text**',
              '**SkillProductTypeIds** — **Text**',
              '**AvailabilitySlotId** — **Long Integer**',
              '**RequestedSlot** — **Date Time**',
              '**DurationHours** — **Decimal**',
              '**Notes** — **Text**',
              '**SupportingDocS3Key** — **Text**',
              '**NotifiedCaregiverIds** — **Text**',
            ],
            tip: 'Attribute names in the Structure become the JSON field names the consumer sends, and they are CASE-SENSITIVE. Keep them identical to the Server Action input names so the mapping in the next step is 1-to-1 and obvious.',
            important:
              'Do NOT reuse the **CareRequest** entity as the input. The entity has server-managed fields (CareRequestId, Status, CreatedAt, AssignmentAttempts…) that the caller must never set. The **CreateCareRequestRequest** Structure deliberately contains ONLY the 11 fields the caller is allowed to provide.',
          },
          {
            title: 'REST Endpoint: POST /care-requests — CreateCareRequest (2/2: add the method & wire the flow)',
            instructions: [
              '— Add the REST method —',
              'Right-click the **CareRequest** REST API > **Add REST API Method**',
              'Click the new method, and in the **Properties** panel set **Name** = **CreateCareRequest**',
              'Set **HTTP Method** = **POST** (POST = create a new resource)',
              '— Define the input parameter —',
              'Right-click the **CreateCareRequest** method > **Add Input Parameter**',
              '**Name**: **Request** · **Data Type**: **CreateCareRequestRequest** (the Structure from step 1/2) · **Receive In**: **Body**',
              '(POST data always arrives in the **Body** as JSON — never URL. This is the opposite of the GET endpoints, where simple params go in the URL.)',
              '— Define the output parameter —',
              'Right-click the method > **Add Output Parameter**',
              '**Name**: **Result** · **Data Type**: **CareRequest** (the full entity record, including the new Id and default Status, is returned to the caller)',
              '— Build the flow (double-click the method to open its action flow) —',
              'Drag a **Run Server Action** node onto the flow after **Start** > pick **SA_CreateCareRequest**',
              'In the node\'s properties, map each Server Action input to the matching field from **Request**:',
              '**FamilyUserId** = **Request.FamilyUserId** · **FamilyPartyId** = **Request.FamilyPartyId** · **PatientName** = **Request.PatientName**',
              '**CareTypeProductClassId** = **Request.CareTypeProductClassId** · **SkillProductTypeIds** = **Request.SkillProductTypeIds**',
              '**AvailabilitySlotId** = **Request.AvailabilitySlotId** · **RequestedSlot** = **Request.RequestedSlot** · **DurationHours** = **Request.DurationHours**',
              '**Notes** = **Request.Notes** · **SupportingDocS3Key** = **Request.SupportingDocS3Key** · **NotifiedCaregiverIds** = **Request.NotifiedCaregiverIds**',
              'Drag an **Assign** node after the Server Action:',
              '**Result** = **SA_CreateCareRequest.Result** (copy the created record into the endpoint\'s output)',
              'Connect the Assign to **End**',
              'Final flow: **Start** → **SA_CreateCareRequest (inputs mapped from Request)** → **Assign (Result = SA_CreateCareRequest.Result)** → **End**',
            ],
            tip: 'The endpoint is intentionally thin: it just unpacks the JSON Body into the Server Action and returns the result. ALL business logic (defaulting Status to Open, stamping CreatedAt, setting AssignmentAttempts = 0) lives inside SA_CreateCareRequest — the REST method is only the HTTP doorway.',
            important:
              'For the endpoint to publish and be consumable, **SA_CreateCareRequest** must be **Public = Yes** (a later step sets this on all CareRequest Server Actions). After publishing, the auto-generated **Swagger** page will show POST /CreateCareRequest with the CreateCareRequestRequest body schema — use it to test (see the Test section).',
          },
          {
            title: 'REST Endpoint: GET /care-requests/{CareRequestId} — GetCareRequestById',
            instructions: [
              'GOAL: let a caller fetch ONE care request by its Id, by calling GET /care-requests/42 (where 42 is the Id sitting inside the URL path).',
              'PREREQUISITE: the **SA_GetCareRequestById** Server Action already exists (built earlier) and takes **CareRequestId** (Long Integer) in, returns **Result** (CareRequest). This endpoint is just the thin HTTP wrapper around it.',
              '— Step 1: Add the method —',
              'In the **Logic** tab, expand **Integrations > REST**, right-click your **CareRequest** REST API > **Add REST API Method**',
              'Click the new method once; in the **Properties** panel (bottom-right) set **Name** = **GetCareRequestById**',
              'Set **HTTP Method** = **GET** (GET = read-only, never carries a Body)',
              '— Step 2: Set the URL Path so the Id lands in the path (this is the part people miss) —',
              'Still in the method **Properties**, find the **URL Path** property',
              'Type: **/{CareRequestId}**  (the curly-brace name MUST exactly match the input parameter you add next — same spelling, same casing)',
              'Without this, O11 would push the parameter into the query string (…?CareRequestId=42) instead of the path (…/42). The {…} placeholder is what binds it to the path.',
              '— Step 3: Add the input parameter —',
              'Right-click the **GetCareRequestById** method > **Add Input Parameter**',
              '**Name**: **CareRequestId** · **Data Type**: **Long Integer** · **Receive In**: **URL**',
              '(Because the name matches the **{CareRequestId}** placeholder in the URL Path, OutSystems binds it to the PATH segment rather than the query string.)',
              '— Step 4: Add the output parameter —',
              'Right-click the method > **Add Output Parameter**: **Name** = **Result** · **Data Type** = **CareRequest** (the whole entity record is returned to the caller)',
              '— Step 5: Build the flow (double-click the method to open its action canvas) —',
              'From the toolbox, drag a **Run Server Action** node onto the line after **Start** > pick **SA_GetCareRequestById**',
              'In that node\'s properties, map the input: **CareRequestId** = **CareRequestId** (the endpoint\'s input param)',
              'Drag an **Assign** node after it: **Result** (left) = **SA_GetCareRequestById.Result** (right) — this copies the record into the endpoint\'s output',
              'Connect the Assign to **End**',
              'Final flow: **Start** → **SA_GetCareRequestById (CareRequestId = CareRequestId)** → **Assign (Result = SA_GetCareRequestById.Result)** → **End**',
            ],
            tip: 'Two different "CareRequestId" names exist and that is fine: the endpoint INPUT parameter, and the {CareRequestId} placeholder in the URL Path. They must be spelled identically so O11 links them. The SA also has its own CareRequestId input — you map endpoint→SA in Step 5.',
            important:
              'If you forget Step 2 (the URL Path = /{CareRequestId}), the build still publishes but the Id arrives as a query string and your "GET /care-requests/{id}" shape is wrong. Also: SA_GetCareRequestById raises **CareRequestNotFoundException** for an unknown Id, so testing a non-existent Id returns an error, not an empty 200 — test a real Id (from your POST test) to see the record.',
          },
          {
            title: 'REST Endpoint: GET /care-requests/by-family/{FamilyUserId} — ListByFamily',
            instructions: [
              'GOAL: return ALL care requests belonging to one family, optionally filtered by status. Used by the family portal to show "my requests".',
              '— Add the method —',
              'Right-click the **CareRequest** REST API > **Add REST API Method**',
              'In **Properties** set **Name** = **ListCareRequestsByFamily** · **HTTP Method** = **GET**',
              '— Input parameters (right-click method > Add Input Parameter for each) —',
              '**FamilyUserId** — Data Type: **Long Integer** · **Receive In**: **URL** (it is in the path pattern {FamilyUserId})',
              '**Status** — Data Type: **CareRequestStatus Identifier** · **Is Mandatory**: **No** · **Receive In**: **URL**',
              '(Status is NOT in the path pattern, so with Receive In = URL it automatically becomes a **query string** param, e.g. ?Status=2. Callers omit it to get all statuses — the Server Action treats NullIdentifier()/0 as "no status filter".)',
              '— Output parameter —',
              '**Results** — Data Type: **CareRequest List**',
              '— Build the flow —',
              'Drag **Run Server Action** > **SA_ListCareRequestsByFamily**; map **FamilyUserId** = **FamilyUserId**, **Status** = **Status**',
              'Drag an **Assign**: **Results** = **SA_ListCareRequestsByFamily.Results**',
              'Connect to **End**',
              'Final flow: **Start** → **SA_ListCareRequestsByFamily** → **Assign (Results = …Results)** → **End**',
            ],
            important:
              'There is NO "Query String" choice in O11. For any param NOT named in the URL path pattern, set **Receive In = URL** and OutSystems makes it a query string param. Leaving it as **Body** on a GET causes: "Invalid HTTP Method … cannot have input parameters with Receive In set to Body".',
          },
          {
            title: 'REST Endpoint: GET /care-requests/by-status — ListByStatus',
            instructions: [
              'GOAL: return ALL care requests with a given status across every family (e.g. all **Open** requests). The matching engine calls this to find work needing a caregiver.',
              '— Add the method —',
              'Right-click the **CareRequest** REST API > **Add REST API Method**',
              'In **Properties** set **Name** = **ListCareRequestsByStatus** · **HTTP Method** = **GET**',
              '— Input parameter —',
              '**Status** — Data Type: **CareRequestStatus Identifier** · **Is Mandatory**: **Yes** · **Receive In**: **URL**',
              '(The path is /by-status with NO {placeholder}, so Status is not in the path. Receive In = URL turns it into a query string param: GET /care-requests/by-status?Status=1.)',
              '— Output parameter —',
              '**Results** — Data Type: **CareRequest List**',
              '— Build the flow —',
              'Drag **Run Server Action** > **SA_ListCareRequestsByStatus**; map **Status** = **Status**',
              'Drag an **Assign**: **Results** = **SA_ListCareRequestsByStatus.Results**',
              'Connect to **End**',
              'Final flow: **Start** → **SA_ListCareRequestsByStatus** → **Assign (Results = …Results)** → **End**',
            ],
            tip: 'ListByStatus differs from ListByFamily: here Status is MANDATORY (you must say which status), whereas ByFamily makes Status optional on top of a required FamilyUserId.',
          },
          {
            title: 'REST Endpoint: PUT /care-requests/{CareRequestId}/status — UpdateStatus',
            instructions: [
              'GOAL: change the status of an existing care request (e.g. Open → Assigned → Completed). PUT = update an existing resource.',
              '— Add the method —',
              'Right-click the **CareRequest** REST API > **Add REST API Method**',
              'In **Properties** set **Name** = **UpdateCareRequestStatus** · **HTTP Method** = **PUT**',
              '— Input parameters —',
              '**CareRequestId** — Data Type: **Long Integer** · **Receive In**: **URL** (it is in the path pattern {CareRequestId})',
              '**NewStatus** — Data Type: **CareRequestStatus Identifier** · **Receive In**: **Body**',
              '(For PUT/POST the changed value travels in the Body as JSON, e.g. { "NewStatus": 3 }. A single scalar can be received directly in the Body; only wrap it in a Structure if you prefer a named JSON object.)',
              '— Output parameter —',
              '**Success** — Data Type: **Boolean**',
              '— Build the flow —',
              'Drag **Run Server Action** > **SA_UpdateCareRequestStatus**; map **CareRequestId** = **CareRequestId**, **NewStatus** = **NewStatus**',
              'Drag an **Assign**: **Success** = **SA_UpdateCareRequestStatus.Success**',
              'Connect to **End**',
              'Final flow: **Start** → **SA_UpdateCareRequestStatus** → **Assign (Success = …Success)** → **End**',
            ],
            important:
              'SA_UpdateCareRequestStatus raises **CareRequestNotFoundException** if the Id does not exist — the endpoint then returns an error to the caller. Test both a valid Id (200, Success=true) and a missing Id (error).',
          },
          {
            title: 'REST Endpoint: PUT /care-requests/{CareRequestId}/assign — AssignCaregiver',
            instructions: [
              'GOAL: assign a caregiver to a request and record who was notified. This flips the status to Assigned (handled inside the Server Action).',
              '— Create the Body Structure first (Data tab > Structures > Add Structure) —',
              'Name: **AssignCaregiverRequest** with attributes: **AssignedCaregiverId** (**Long Integer**), **NotifiedCaregiverIds** (**Text**)',
              '— Add the method —',
              'Right-click the **CareRequest** REST API > **Add REST API Method**',
              'In **Properties** set **Name** = **AssignCaregiverToRequest** · **HTTP Method** = **PUT**',
              '— Input parameters —',
              '**CareRequestId** — Data Type: **Long Integer** · **Receive In**: **URL** (in the path pattern {CareRequestId})',
              '**Request** — Data Type: **AssignCaregiverRequest** · **Receive In**: **Body** (the JSON object holding the two fields)',
              '— Output parameter —',
              '**Success** — Data Type: **Boolean**',
              '— Build the flow —',
              'Drag **Run Server Action** > **SA_AssignCaregiverToRequest**; map: **CareRequestId** = **CareRequestId**, **AssignedCaregiverId** = **Request.AssignedCaregiverId**, **NotifiedCaregiverIds** = **Request.NotifiedCaregiverIds**',
              'Drag an **Assign**: **Success** = **SA_AssignCaregiverToRequest.Success**',
              'Connect to **End**',
              'Final flow: **Start** → **SA_AssignCaregiverToRequest** → **Assign (Success = …Success)** → **End**',
            ],
            tip: 'Two fields go together as one JSON Body object, so we wrap them in the AssignCaregiverRequest Structure. Compare to UpdateStatus, where a single value can sit directly in the Body without a Structure.',
          },
          {
            title: 'REST Endpoint: PUT /care-requests/{CareRequestId}/increment-attempts — IncrementAttempts',
            instructions: [
              'GOAL: bump the AssignmentAttempts counter by 1 and stamp LastNotifiedAt — called each time the matching engine notifies caregivers about a request.',
              '— Add the method —',
              'Right-click the **CareRequest** REST API > **Add REST API Method**',
              'In **Properties** set **Name** = **IncrementAssignmentAttempts** · **HTTP Method** = **PUT**',
              '— Input parameter —',
              '**CareRequestId** — Data Type: **Long Integer** · **Receive In**: **URL** (in the path pattern {CareRequestId})',
              '(No Body is needed — the only input is the Id in the path; the +1 logic lives inside the Server Action.)',
              '— Output parameter —',
              '**Success** — Data Type: **Boolean**',
              '— Build the flow —',
              'Drag **Run Server Action** > **SA_IncrementAssignmentAttempts**; map **CareRequestId** = **CareRequestId**',
              'Drag an **Assign**: **Success** = **SA_IncrementAssignmentAttempts.Success**',
              'Connect to **End**',
              'Final flow: **Start** → **SA_IncrementAssignmentAttempts** → **Assign (Success = …Success)** → **End**',
            ],
            tip: 'Even though it is a PUT, this endpoint needs no Body — the server already knows how to increment; it just needs WHICH request (the Id in the URL).',
          },
          {
            title: 'REST Endpoint: PUT /care-requests/{CareRequestId}/cancel — CancelCareRequest',
            instructions: [
              'GOAL: cancel a care request. The Server Action only allows cancelling requests that are still Open or Assigned; otherwise it raises an exception.',
              '— Add the method —',
              'Right-click the **CareRequest** REST API > **Add REST API Method**',
              'In **Properties** set **Name** = **CancelCareRequest** · **HTTP Method** = **PUT**',
              '— Input parameter —',
              '**CareRequestId** — Data Type: **Long Integer** · **Receive In**: **URL** (in the path pattern {CareRequestId})',
              '(No Body — cancelling needs only the Id; the validation and status change live inside the Server Action.)',
              '— Output parameter —',
              '**Success** — Data Type: **Boolean**',
              '— Build the flow —',
              'Drag **Run Server Action** > **SA_CancelCareRequest**; map **CareRequestId** = **CareRequestId**',
              'Drag an **Assign**: **Success** = **SA_CancelCareRequest.Success**',
              'Connect to **End**',
              'Final flow: **Start** → **SA_CancelCareRequest** → **Assign (Success = …Success)** → **End**',
            ],
            important:
              'Cancelling a request that is already Completed, Cancelled, or Escalated makes SA_CancelCareRequest raise an exception ("Cannot cancel a request with status: …"). When testing, expect Success=true only for Open/Assigned requests.',
          },
          {
            title: 'Set Entity and Server Actions to Public',
            instructions: [
              '**Data** tab > **Entities** > click **CareRequest** > set **Public** = **Yes**',
              '**Logic** tab > **Server Actions** > set **Public** = **Yes** on ALL Server Actions (**SA_CreateCareRequest**, **SA_GetCareRequestById**, **SA_ListCareRequestsByFamily**, **SA_ListCareRequestsByStatus**, **SA_UpdateCareRequestStatus**, **SA_AssignCaregiverToRequest**, **SA_IncrementAssignmentAttempts**, **SA_CancelCareRequest**)',
            ],
            important: 'Both the Entity AND the Server Actions must be Public. If either is missing, you get "Invalid Public Action" errors on publish.',
          },
          {
            title: 'Publish the CareRequest service',
            instructions: [
              'Press **Ctrl+Shift+P** to publish the **CareConnect_CareRequest** module',
              'Wait for the green **"1-Click Publish completed"** message',
              'Right-click the **CareRequest** REST API > **Open Documentation** to open Swagger UI',
            ],
          },
          {
            title: 'Test 1: POST /care-requests (CreateCareRequest)',
            instructions: [
              'Click **POST /CreateCareRequest** > **Try it out**',
              'Paste a sample JSON body (adjust fields to match your CreateCareRequestRequest Structure — the exact attributes depend on how you defined it, but it should include at minimum):',
              '```{ "FamilyUserId": 1, "PatientName": "John Doe", "SkillProductTypeId": "type-001", "RequestedDate": "2026-05-20", "PreferredStartTime": "09:00:00", "PreferredEndTime": "12:00:00", "SpecialInstructions": "Needs wheelchair accessible caregiver", "Address": "123 Test Street", "PostalCode": "123456", "PatientAge": 75, "SkillProductClassId": "class-001" }```',
              'Click **Execute**',
              'Response should return a CareRequest record with an auto-generated **Id** and **Status** set to the default (e.g., Pending)',
              '**Copy the Id value** — you need it for the next tests',
            ],
            tip: 'If you get a 500 error, check that you have the CareRequestStatus static entity dependency set up correctly (from CC_Orchestration via Ctrl+Q). Also check that all required fields are present in the JSON.',
          },
          {
            title: 'Test 2: GET /care-requests/{CareRequestId} (GetCareRequestById)',
            instructions: [
              'Click **GET /GetCareRequestById** > **Try it out**',
              'Enter the **CareRequestId** from Test 1',
              'Click **Execute** — should return the full CareRequest record',
            ],
          },
          {
            title: 'Test 3: GET /care-requests/by-family/{FamilyUserId} (ListByFamily)',
            instructions: [
              'Click **GET /ListCareRequestsByFamily** > **Try it out**',
              'Enter **FamilyUserId** = **1** (the FamilyUserId from Test 1)',
              'Leave **Status** empty (to get all statuses)',
              'Click **Execute** — should return a list containing the care request you created',
            ],
          },
          {
            title: 'Test 4: PUT /care-requests/{CareRequestId}/status (UpdateStatus)',
            instructions: [
              'Click **PUT /UpdateCareRequestStatus** > **Try it out**',
              'Enter the **CareRequestId** from Test 1',
              'In the Request body, enter the new status identifier (this depends on your CareRequestStatus static entity — typically a numeric ID like **2** for "Assigned")',
              'Click **Execute** — should return **"Success": true**',
              'Verify: run **GET /GetCareRequestById** again — the **Status** field should show the updated value',
            ],
          },
          {
            title: 'Test 5: PUT /care-requests/{CareRequestId}/assign (AssignCaregiver)',
            instructions: [
              'Click **PUT /AssignCaregiverToRequest** > **Try it out**',
              'Enter the **CareRequestId** from Test 1',
              'Paste this JSON:',
              '```{ "AssignedCaregiverId": 1, "NotifiedCaregiverIds": "1,2" }```',
              'Click **Execute** — should return **"Success": true**',
              'Verify: run **GET /GetCareRequestById** — **AssignedCaregiverId** should now be **1**',
            ],
          },
          {
            title: 'Test 6: PUT /care-requests/{CareRequestId}/cancel (CancelCareRequest)',
            instructions: [
              'Click **PUT /CancelCareRequest** > **Try it out**',
              'Enter the **CareRequestId** from Test 1',
              'Click **Execute** — should return **"Success": true**',
              'Verify: run **GET /GetCareRequestById** — the **Status** should now be "Cancelled" (or the equivalent from your CareRequestStatus static entity)',
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
            title: 'Create the "CareVisit" Exposed REST API (the container for the Visit endpoints)',
            instructions: [
              'GOAL: create the REST API "container" that will hold all the Visit HTTP endpoints (POST /visits, GET /visits/{id}, etc.). This step makes the empty API; you add the individual methods in the steps that follow.',
              '— Open the REST integrations area —',
              'Click the **Logic** tab (top bar, next to Processes/Interface/Data).',
              'In the left tree, expand **Integrations**. Under it you will see **REST** and **SOAP**.',
              '— Create the exposed API —',
              'Right-click **REST** → choose **Expose REST API** (NOT "Consume REST API" — Expose = you are the server publishing endpoints; Consume = you are calling someone else\'s API).',
              'A new REST API node appears, selected and ready to rename.',
              '— Name it —',
              'In the **Properties** panel (right) set **Name** = **CareVisit**. (No spaces; this name becomes part of the URL: …/rest/**CareVisit**/.)',
              'Press Enter. You now have an empty **CareVisit** REST API under Integrations > REST.',
              '— (Optional) confirm/leave the defaults —',
              'Click the **CareVisit** API node and glance at Properties. Leave these at default for the lab: **Base URL** auto-generated, **Authentication** = None (the SMULab key gate is handled elsewhere / not enforced for the lab).',
              'Notice it auto-creates **OnBeforeRequest** and **OnAfterResponse** handlers under the API — you do NOT need to edit these for CareVisit (those were only needed when CONSUMING an external API like in the Home Test lab). Leave them empty.',
              'You will now add the actual methods (POST /visits, GET /visits/{VisitId}, etc.) to this CareVisit API in the next steps.',
            ],
            tip: 'One module (CareConnect_CareVisit) can expose TWO REST APIs: CareVisit AND Payment. Repeat this exact step later with Name = Payment to create the second container. They live side by side under Integrations > REST.',
            important: 'After you finish adding all CareVisit (and Payment) methods, you MUST 1-Click Publish, and the Entity + every Server Action used by the endpoints must be Public = Yes — otherwise the module fails to publish and the whole API returns HTTP 500 (a generic "Internal server error" page, not a JSON error). This is the single most common reason the CareVisit/Payment endpoints come back broken.',
          },
          {
            title: 'REST Endpoint: POST /visits — CreateCareVisit (1/2: the request Structure)',
            instructions: [
              'GOAL: expose **SA_CreateCareVisit** as an HTTP POST so the orchestrator can create a visit by sending a JSON body. First, build the Structure that defines that body.',
              '— Create the input Structure —',
              'Go to the **Data** tab → right-click **Structures** → **Add Structure**',
              'In **Properties** set **Name** = **CreateCareVisitRequest**',
              'Right-click the new Structure → **Add Structure Attribute**, four times, creating:',
              '**CareRequestId** — Data Type: **Long Integer**',
              '**CaregiverId** — Data Type: **Long Integer**',
              '**FamilyUserId** — Data Type: **Long Integer**',
              '**CheckInTime** — Data Type: **Date Time**',
              '(These four mirror the four input parameters of SA_CreateCareVisit exactly — same names, same types — so the mapping in part 2/2 is 1-to-1.)',
            ],
            important:
              'Do NOT reuse the **CareVisit** entity as the input type. The entity has server-managed fields (VisitId, Status, CheckOutTime, CreatedAt…) the caller must never set — SA_CreateCareVisit fills those itself. The Structure contains ONLY the 4 caller-supplied fields.',
          },
          {
            title: 'REST Endpoint: POST /visits — CreateCareVisit (2/2: method, parameters & the Assign)',
            instructions: [
              '— Add the method —',
              'Back in the **Logic** tab, right-click the **CareVisit** REST API (under Integrations > REST) → **Add REST API Method**',
              'Click the new method → in **Properties** set **Name** = **CreateCareVisit** and **HTTP Method** = **POST**',
              '— Input parameter —',
              'Right-click the **CreateCareVisit** method → **Add Input Parameter**',
              '**Name**: **Request** · **Data Type**: **CreateCareVisitRequest** (the Structure from 1/2) · **Receive In**: **Body**',
              '— Output parameter —',
              'Right-click the method → **Add Output Parameter**',
              '**Name**: **Result** · **Data Type**: **CareVisit** (the full entity record, including the new VisitId and Status, goes back to the caller)',
              '— Build the flow (double-click the method to open its canvas) —',
              'NODE 1: from the Toolbox drag **Run Server Action** onto the line after **Start** → in the picker choose **SA_CreateCareVisit**',
              'Click the SA_CreateCareVisit node — its 4 input slots appear in **Properties**. Set each one (click the value box → expression editor):',
              '**CareRequestId** = `Request.CareRequestId`',
              '**CaregiverId** = `Request.CaregiverId`',
              '**FamilyUserId** = `Request.FamilyUserId`',
              '**CheckInTime** = `Request.CheckInTime`',
              'NODE 2: drag an **Assign** node onto the line after SA_CreateCareVisit. THIS is "Assign output" — it copies the Server Action\'s result into the endpoint\'s own output. It has exactly ONE assignment:',
              'Variable (left): **Result**   ·   Value (right): **SA_CreateCareVisit.Result**',
              '(Left side = the endpoint\'s Output Parameter you created above. Right side = the Server Action node\'s output, typed as a CareVisit record. One whole-record assignment — you do NOT map field by field here, because both sides are the same CareVisit type.)',
              'Connect the Assign to **End**',
              'Final flow: **Start → SA_CreateCareVisit (4 inputs from Request) → Assign (Result = SA_CreateCareVisit.Result) → End**',
            ],
            tip: 'Two different "Result"s exist and that is normal: the ENDPOINT\'s output parameter (left of the Assign) and the SERVER ACTION\'s output (right, reached as SA_CreateCareVisit.Result). The Assign bridges them. If autocomplete does not offer SA_CreateCareVisit.Result, click the Run Server Action node and check it actually picked SA_CreateCareVisit.',
            important:
              'The endpoint stays thin on purpose: defaults like Status = Scheduled, CheckOutTime = NullDate(), CreatedAt = CurrDateTime() are set INSIDE SA_CreateCareVisit (you built that flow earlier) — never in the REST method. If you skip the Assign node, the endpoint compiles but always returns an EMPTY CareVisit: the SA ran, but nothing copied its result into the endpoint output.',
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
            title: 'Set Entities and Server Actions to Public',
            instructions: [
              'This module has TWO entities — both must be Public:',
              '**Data** tab > **Entities** > click **CareVisit** > set **Public** = **Yes**',
              '**Data** tab > **Entities** > click **Payment** > set **Public** = **Yes**',
              '**Logic** tab > **Server Actions** > set **Public** = **Yes** on ALL Server Actions (all 8 CareVisit actions + all 4 Payment actions)',
            ],
            important: 'Both entities AND all Server Actions must be Public. If either is missing, you get "Invalid Public Action" errors on publish.',
          },
          {
            title: 'Publish the CareVisit + Payment service',
            instructions: [
              'Press **Ctrl+Shift+P** to publish the **CareConnect_CareVisit** module',
              'Wait for the green **"1-Click Publish completed"** message',
              'Right-click the **CareVisit** REST API > **Open Documentation** to open Swagger UI',
              'You will also need to open **Payment** REST API > **Open Documentation** in a separate tab for payment tests',
            ],
          },
          {
            title: 'Test 1: POST /visits (CreateCareVisit)',
            instructions: [
              'In the **CareVisit** Swagger UI, click **POST /CreateCareVisit** > **Try it out**',
              'Paste this sample JSON (use a current date-time):',
              '```{ "CareRequestId": 1, "CaregiverId": 1, "FamilyUserId": 1, "CheckInTime": "2026-05-15T09:00:00" }```',
              'Click **Execute**',
              'Response should return a CareVisit record with an auto-generated **Id**, **VisitStatus** set to the default (e.g., InProgress), and **DurationMinutes** = **0** (not yet completed)',
              '**Copy the Id value** (this is the **VisitId**) — you need it for all subsequent tests',
            ],
            tip: 'The **CareRequestId**, **CaregiverId**, and **FamilyUserId** should reference records that exist in your other modules. For initial testing, use the IDs from your 3A (Family) and 3B (Caregiver) tests. If they don\'t exist, you may get a 500 error.',
          },
          {
            title: 'Test 2: GET /visits/{VisitId} (GetCareVisitById)',
            instructions: [
              'Click **GET /GetCareVisitById** > **Try it out**',
              'Enter the **VisitId** from Test 1',
              'Click **Execute** — should return the full CareVisit record',
            ],
          },
          {
            title: 'Test 3: GET /visits/by-caregiver/{CaregiverId} (ListByCaregiver)',
            instructions: [
              'Click **GET /ListCareVisitsByCaregiver** > **Try it out**',
              'Enter **CaregiverId** = **1**',
              'Click **Execute** — should return a list containing the visit you created',
            ],
          },
          {
            title: 'Test 4: PUT /visits/{VisitId}/complete (CompleteCareVisit)',
            instructions: [
              'Click **PUT /CompleteCareVisit** > **Try it out**',
              'Enter the **VisitId** from Test 1',
              'Paste this JSON (use a time AFTER the CheckInTime — e.g., 3 hours later):',
              '```{ "CheckOutTime": "2026-05-15T12:00:00", "ProofPhotoS3Key": "test-photo-key", "CaregiverNotes": "Visit completed successfully, patient in good condition" }```',
              'Click **Execute** — should return **"Success": true**',
              'Verify: run **GET /GetCareVisitById** again — check that:',
              '**CheckOutTime** is set to the value you sent',
              '**DurationMinutes** is calculated (should be **180** for a 9am-12pm visit)',
              '**VisitStatus** has changed to Completed (or equivalent)',
            ],
            important: 'The **DurationMinutes** calculation happens inside your **SA_CompleteCareVisit** Server Action. If it shows **0**, check that your flow calculates `DiffMinutes(CheckInTime, CheckOutTime)` and assigns it to the DurationMinutes field.',
          },
          {
            title: 'Test 5: PUT /visits/{VisitId}/confirm (ConfirmCareVisit)',
            instructions: [
              'Click **PUT /ConfirmCareVisit** > **Try it out**',
              'Enter the same **VisitId**',
              'Click **Execute** — should return **"Success": true**',
              'Verify: run **GET /GetCareVisitById** — **VisitStatus** should now be Confirmed (or equivalent)',
            ],
          },
          {
            title: 'Test 6: POST /payments (CreatePayment) — switch to Payment Swagger',
            instructions: [
              'Open the **Payment** Swagger UI (right-click **Payment** REST API > **Open Documentation**, or use the tab you opened earlier)',
              'Click **POST /CreatePayment** > **Try it out**',
              'Paste this JSON:',
              '```{ "VisitId": 1, "FamilyUserId": 1, "Amount": 150.00 }```',
              'Replace the **VisitId** with the actual VisitId from your tests',
              'Click **Execute**',
              'Response should return a Payment record with an auto-generated **Id**, **PaymentStatus** set to the default (e.g., Pending), and the **Amount** you specified',
            ],
          },
          {
            title: 'Test 7: GET /payments/by-visit/{VisitId} (GetPaymentByVisitId)',
            instructions: [
              'Click **GET /GetPaymentByVisitId** > **Try it out**',
              'Enter the **VisitId**',
              'Click **Execute** — should return the Payment record you just created',
            ],
          },
          {
            title: 'Test 8: PUT /payments/by-visit/{VisitId}/release (ReleasePayment)',
            instructions: [
              'Click **PUT /ReleasePayment** > **Try it out**',
              'Enter the **VisitId**',
              'Click **Execute** — should return **"Success": true**',
              'Verify: run **GET /GetPaymentByVisitId** — **PaymentStatus** should now be Released (or equivalent)',
            ],
          },
          {
            title: 'Test 9: PUT /payments/by-visit/{VisitId}/refund (RefundPayment — optional)',
            instructions: [
              'To test the refund flow, first create another payment (repeat Test 6 with a new VisitId)',
              'Click **PUT /RefundPayment** > **Try it out**',
              'Enter the **VisitId** of the new payment',
              'Paste this JSON: ```{ "RefundReason": "Service not as described" }```',
              'Click **Execute** — should return **"Success": true**',
              'Verify: run **GET /GetPaymentByVisitId** — **PaymentStatus** should now be Refunded (or equivalent)',
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
  // ──────────────────────────────────────────────
  // PHASE 6: OpenAI Wrapper Service
  // ──────────────────────────────────────────────
  {
    id: 6,
    title: 'OpenAI Wrapper Service',
    description:
      'Create the **CareConnect_OpenAIWrapper** Service module — a Layer 1 wrapper around the OpenAI Responses API. This module has no screens, no Entities, and no Client Actions. It exposes a single **ChatCompletion** Server Action that the rest of CareConnect consumes.',
    timeEstimate: '1.5-2.5 hours',
    sections: [
      // ── 6.1: Create the Service Module ──
      {
        id: '6.1',
        title: 'Create the Service Module',
        summary:
          'Understand the architecture position and create the **CareConnect_OpenAIWrapper** module inside the **CareConnect Integration** application.',
        steps: [
          {
            title: 'Understand the architecture position',
            instructions: [
              'The CareConnect system has four layers:',
              '**Layer 4**: **CareConnect UI** — the Reactive Web App that end users interact with',
              '**Layer 3**: **CC_Orchestration** — the composite service that coordinates business logic across modules',
              '**Layer 2**: **CareConnect_Family**, **CareConnect_Caregiver**, **CareConnect_AvailabilitySlot**, **CareConnect_CareRequest**, **CareConnect_CareVisit** — atomic services that each own one entity',
              '**Layer 1**: **CareConnect_OpenAIWrapper** — the module you are about to create; it wraps the external OpenAI system behind a standardized interface',
              'This module is a **Service module** — it has no screens, no Entities, and no Client Actions',
              'Its only job is to call the OpenAI API and return a clean response to the layers above',
            ],
            tip: 'Service modules are lightweight — they skip the Interface layer entirely (no screens, blocks, or themes). This keeps your wrapper module focused on integration logic only.',
          },
          {
            title: 'Create the CareConnect_OpenAIWrapper module',
            instructions: [
              'Open **Service Studio**',
              'Open the **CareConnect Integration** application (you created this in Phase 1)',
              'Right-click the **CareConnect Integration** application name > select **Add Module**',
              'In the **Name** field, type **CareConnect_OpenAIWrapper**',
              'In the **Type** dropdown, select **Service**',
              'Click **Create Module**',
              'Wait for the module to open — you should see the **Logic**, **Interface**, **Data**, and **Processes** tabs on the left',
            ],
            important:
              'The module type MUST be **Service**, not **Reactive Web App**. A Service module has no UI layer, which is exactly what you want for an API wrapper.',
          },
        ],
      },

      // ── 6.2: Understand Auto-Generated Structures ──
      {
        id: '6.2',
        title: 'Understand Auto-Generated Structures',
        summary:
          'Learn how OutSystems automatically creates Structures when you paste sample JSON in the Consume REST API dialog. Do **NOT** manually create Structures — doing so causes type-mismatch errors.',
        steps: [
          {
            title: 'How auto-generated Structures work',
            instructions: [
              'When you paste sample **Request** and **Response** JSON in the **Consume REST API** dialog (Section 6.4), OutSystems automatically creates Structures that match the JSON shape',
              'You do **NOT** need to manually create any Structures for the OpenAI request or response',
              'If you manually create Structures AND also paste sample JSON, you will end up with **two sets** of Structures with different names',
              'This causes type-mismatch errors like **"Expected InputItem instead of InputMessage"** because OutSystems sees them as different, incompatible types',
              'The auto-generated Structures are the ones that the consumed REST method actually uses — your manually created ones will NOT be wired up',
            ],
            important:
              'Do **NOT** manually create Structures for the OpenAI request or response. The Consume REST API dialog will auto-generate them for you in Section 6.4. If you already created manual Structures, delete them before proceeding.',
          },
          {
            title: 'What the auto-generated Structures will look like — Request side',
            instructions: [
              'OutSystems will create Structures for the **request** JSON you paste',
              'There will be a **top-level request Structure** with attributes like **Model**, **Instructions**, **Input**, **MaxOutputTokens**, and **Temperature**',
              'There will be an **input item Structure** with attributes like **Role** and **Content** — this represents one message in the input array',
              'There will be a **content item Structure** with attributes like **Type** and **Text** — this represents one content block inside a message',
              'The exact names OutSystems assigns will vary — it might call them **Input**, **Input2**, **Content**, **Content2**, **InputItem**, etc.',
              'The names depend on the order you paste JSON and whether other Structures already exist in the module',
            ],
            tip: 'Do not worry about the exact names right now. You will look them up in Section 6.4 after pasting the sample JSON. The key is to identify each Structure by its **attributes** (what fields it contains), not by its name.',
          },
          {
            title: 'What the auto-generated Structures will look like — Response side',
            instructions: [
              'OutSystems will create Structures for the **response** JSON you paste',
              'There will be a **top-level response Structure** with attributes like **Id**, **Object**, **CreatedAt**, **Status**, **Model**, **Output**, and **Usage**',
              'There will be an **output item Structure** with attributes like **Id**, **Type**, **Status**, **Content**, and **Role** — this represents one output message',
              'There will be an **output content Structure** with attributes like **Type** and **Text** — this holds the actual AI-generated text',
              'There will be a **usage Structure** with attributes like **InputTokens**, **OutputTokens**, and **TotalTokens**',
              'Again, the exact names will vary (e.g., **Output**, **Output2**, **Content**, **Content3**, etc.)',
            ],
          },
          {
            title: 'Write down the auto-generated names after Section 6.4',
            instructions: [
              'After you complete Section 6.4 (Consume the OpenAI REST API), you will come back and identify the auto-generated Structure names',
              'You will need to know the name of the **content item Structure** (the one with **Type** and **Text** attributes) to create Local Variables in Section 6.5',
              'You will need to know the name of the **input item Structure** (the one with **Role** and **Content** attributes) to create Local Variables in Section 6.5',
              'Section 6.4 includes a step that walks you through finding and writing down these names',
            ],
            tip: 'A quick way to identify which Structure is which: click on each auto-generated Structure in the **Data** tab and look at its attributes. The content item Structure has **Type** and **Text**. The input item Structure has **Role** and **Content**. The usage Structure has **InputTokens**, **OutputTokens**, and **TotalTokens**.',
          },
        ],
      },

      // ── 6.3: Create Site Properties ──
      {
        id: '6.3',
        title: 'Create Site Properties',
        summary:
          'Create three **Site Properties** to store the OpenAI API key, model name, and default max tokens. These values are configured at runtime via **Service Center** — never hardcoded.',
        steps: [
          {
            title: 'Create the OpenAI_APIKey Site Property',
            instructions: [
              'Click the **Data** tab on the left panel',
              'Expand the **Site Properties** folder (under **Data**)',
              'Right-click **Site Properties** > select **Add Site Property**',
              'Set **Name** to **OpenAI_APIKey**',
              'Set **Data Type** to **Text**',
              'Leave the **Default Value** empty — do NOT type your API key here',
            ],
            important:
              'NEVER hardcode your OpenAI API key in the module. The real key is set at runtime via **Service Center** after publishing. Hardcoding secrets in source code is a critical security violation.',
          },
          {
            title: 'Create the OpenAI_Model Site Property',
            instructions: [
              'Right-click **Site Properties** > select **Add Site Property**',
              'Set **Name** to **OpenAI_Model**',
              'Set **Data Type** to **Text**',
              'Set **Default Value** to **gpt-4o-mini**',
            ],
            tip: 'Making the model name a Site Property means you can switch from **gpt-4o-mini** to **gpt-4o** or any other model at runtime via **Service Center** — no re-publishing required.',
          },
          {
            title: 'Create the OpenAI_DefaultMaxTokens Site Property',
            instructions: [
              'Right-click **Site Properties** > select **Add Site Property**',
              'Set **Name** to **OpenAI_DefaultMaxTokens**',
              'Set **Data Type** to **Integer**',
              'Set **Default Value** to **1024**',
            ],
            tip: '**1024** tokens is a reasonable default for most conversational responses. This value maps to the **max_output_tokens** parameter in the Responses API request. You can increase this for use cases that need longer outputs (e.g., care plan generation).',
          },
        ],
      },

      // ── 6.4: Consume the OpenAI REST API ──
      {
        id: '6.4',
        title: 'Consume the OpenAI REST API',
        summary:
          'Add the OpenAI Responses endpoint as a **Consumed REST API**, paste sample JSON to auto-generate Structures, and add header Input Parameters for authentication.',
        steps: [
          {
            title: 'Add the Consumed REST API method',
            instructions: [
              'Click the **Logic** tab on the left panel',
              'Expand the **Integrations** folder',
              'Right-click **REST** (under Integrations) > select **Consume REST API...**',
              'In the dialog, select **Add Single Method**',
              'Set **Name** to **CreateResponse**',
              'Set **Method** to **POST**',
              'Set **URL** to **https://api.openai.com/v1/responses**',
            ],
          },
          {
            title: 'Paste the Request sample JSON',
            instructions: [
              'In the consumed REST method dialog, click the **Request** tab (or **Body** tab)',
              'Click **Add Example** or paste the following sample JSON into the request body area:',
              '```{"model":"gpt-4o-mini","instructions":"You are a helpful assistant.","input":[{"role":"user","content":[{"type":"input_text","text":"Hello"}]}],"max_output_tokens":1024,"temperature":0.7}```',
              'OutSystems will auto-generate request Structures from this sample',
            ],
            tip: 'The sample JSON helps OutSystems understand the shape of the request payload. It auto-creates Structures that match the JSON keys. Notice the key differences from the old Chat Completions API: **instructions** replaces the system message, **input** replaces **messages**, and **max_output_tokens** replaces **max_tokens**.',
          },
          {
            title: 'Paste the Response sample JSON',
            instructions: [
              'Click the **Response** tab in the consumed REST method dialog',
              'Click **Add Example** or paste the following sample JSON into the response body area:',
              '```{"id":"resp_abc123","object":"response","created_at":1677858242,"status":"completed","model":"gpt-4o-mini","output":[{"id":"msg_abc123","type":"message","status":"completed","content":[{"type":"output_text","text":"Hello! How can I help you?"}],"role":"assistant"}],"usage":{"input_tokens":13,"output_tokens":7,"total_tokens":20}}```',
              'OutSystems will auto-generate response Structures from this sample',
              'Click **OK** or **Finish** to close the dialog',
            ],
            important:
              'Do NOT delete the auto-generated Structures and replace them with manually created ones. The consumed REST method is wired to the auto-generated Structures. If you create your own Structures with different names, you will get type-mismatch errors.',
          },
          {
            title: 'Note the auto-generated Structure names',
            instructions: [
              'Click the **Data** tab on the left panel',
              'Expand the **Structures** folder',
              'You will see several new auto-generated Structures — OutSystems created these from the sample JSON you just pasted',
              'Find the **content item Structure** — it has attributes **Type** (Text) and **Text** (Text)',
              'Write down its name (e.g., **Content**, **ContentItem**, **Content2** — the exact name varies)',
              'Find the **input item Structure** — it has attributes **Role** (Text) and **Content** (a List of the content item Structure)',
              'Write down its name (e.g., **Input**, **InputItem**, **Input2** — the exact name varies)',
              'Find the **output item Structure** — it has attributes **Id**, **Type**, **Status**, **Content** (a List), and **Role**',
              'Write down its name (e.g., **Output**, **OutputItem**, **Output2**)',
              'Find the **output content Structure** — it has attributes **Type** (Text) and **Text** (Text), similar to the input content item but for the response side',
              'Write down its name (e.g., **Content**, **Content2**, **Content3**)',
              'Find the **usage Structure** — it has attributes **InputTokens**, **OutputTokens**, and **TotalTokens**',
              'Write down its name (e.g., **Usage**)',
              'You will use these names when creating Local Variables in Section 6.5',
            ],
            tip: 'To identify which Structure is which, click on each one and look at its attributes in the **Properties** panel. The content item Structure for requests has **Type** and **Text**. The input item Structure has **Role** and **Content**. The usage Structure has **InputTokens**, **OutputTokens**, and **TotalTokens**. If two Structures have the same attribute names (e.g., both the request content and response content have **Type** and **Text**), look at how they are referenced by the consumed REST method to tell them apart.',
          },
          {
            title: 'Add the Authorization header as an Input Parameter',
            instructions: [
              'In the **Logic** tab, expand **Integrations** > **REST** > find the **CreateResponse** consumed REST method',
              'Right-click **CreateResponse** > select **Add Input Parameter**',
              'Set **Name** to **Authorization**',
              'Set **Data Type** to **Text**',
              'In the **Properties** panel on the right, set **Send In** to **Header**',
              'This tells OutSystems to send this parameter as an HTTP header (not in the request body)',
              'You do NOT need to set a default value — you will pass the value from your Server Action each time you call the method',
            ],
            tip: 'By setting **Send In** to **Header**, OutSystems automatically sends this as an HTTP request header named **Authorization**. You will pass the value **"Bearer " + Site.OpenAI_APIKey** when calling the method in Section 6.5.',
          },
          {
            title: 'Add the Content-Type header as an Input Parameter',
            instructions: [
              'Right-click **CreateResponse** again > select **Add Input Parameter**',
              'Set **Name** to **ContentType**',
              'Set **Data Type** to **Text**',
              'Set **Send In** to **Header**',
              'In the **Properties** panel, find **Name in Header** (or **Name**)',
              'Set it to **Content-Type** (with the hyphen — this is the actual HTTP header name)',
            ],
            important:
              'The header value for **Authorization** must be exactly **"Bearer "** followed by the API key — note the space after **Bearer**. If you omit the space, OpenAI will return a 401 Unauthorized error.',
          },
        ],
      },

      // ── 6.5: Build the ChatCompletion Server Action ──
      {
        id: '6.5',
        title: 'Build the ChatCompletion Server Action',
        summary:
          'Create a public **ChatCompletion** Server Action that accepts a user message and system prompt, calls the consumed OpenAI API, and returns the AI response with error handling. Uses the auto-generated Structures from Section 6.4.',
        steps: [
          {
            title: 'Create the ChatCompletion Server Action',
            instructions: [
              'Click the **Logic** tab on the left panel',
              'Right-click **Server Actions** > select **Add Server Action**',
              'Set **Name** to **ChatCompletion**',
              'In the **Properties** panel on the right, set **Public** to **Yes**',
            ],
            important:
              'You MUST set **Public** to **Yes**. If you leave it as **No**, other modules (like **CC_Orchestration** and **CareConnect UI**) will not be able to find or consume this Server Action via **Ctrl+Q**.',
          },
          {
            title: 'Add Input Parameters',
            instructions: [
              'Right-click **ChatCompletion** Server Action > select **Add Input Parameter**',
              'Set **Name** to **UserMessage**',
              'Set **Data Type** to **Text**',
              'Set **Is Mandatory** to **Yes**',
              'Right-click **ChatCompletion** > select **Add Input Parameter**',
              'Set **Name** to **SystemPrompt**',
              'Set **Data Type** to **Text**',
              'Set **Is Mandatory** to **No**',
              'Set **Default Value** to **"You are a helpful assistant for CareConnect, a caregiving platform."**',
              'Right-click **ChatCompletion** > select **Add Input Parameter**',
              'Set **Name** to **Model**',
              'Set **Data Type** to **Text**',
              'Set **Is Mandatory** to **No**',
              'Set **Default Value** to **""** (empty string)',
              'Right-click **ChatCompletion** > select **Add Input Parameter**',
              'Set **Name** to **MaxTokens**',
              'Set **Data Type** to **Integer**',
              'Set **Is Mandatory** to **No**',
              'Set **Default Value** to **0**',
              'Right-click **ChatCompletion** > select **Add Input Parameter**',
              'Set **Name** to **Temperature**',
              'Set **Data Type** to **Decimal**',
              'Set **Is Mandatory** to **No**',
              'Set **Default Value** to **0.7**',
            ],
          },
          {
            title: 'Add Output Parameters',
            instructions: [
              'Right-click **ChatCompletion** Server Action > select **Add Output Parameter**',
              'Set **Name** to **ResponseText**',
              'Set **Data Type** to **Text**',
              'Right-click **ChatCompletion** > select **Add Output Parameter**',
              'Set **Name** to **Success**',
              'Set **Data Type** to **Boolean**',
              'Right-click **ChatCompletion** > select **Add Output Parameter**',
              'Set **Name** to **ErrorMessage**',
              'Set **Data Type** to **Text**',
              'Right-click **ChatCompletion** > select **Add Output Parameter**',
              'Set **Name** to **TokensUsed**',
              'Set **Data Type** to **Integer**',
            ],
          },
          {
            title: 'Create Local Variables (using auto-generated Structure names)',
            instructions: [
              'First, go to the **Data** tab > **Structures** folder and check the names OutSystems auto-generated when you pasted the sample JSON in Section 6.4',
              'The typical auto-generated names in O11 are: **Input_text** (content item with Type/Text), **InputItem** (input message with Role/Content), **Message** (output message), **Output_text** (output content), **Usage** (token counts)',
              'Now create the Local Variables:',
              'Right-click **ChatCompletion** Server Action > select **Add Local Variable**',
              'Set **Name** to **ContentList**',
              'Click the **Data Type** dropdown — scroll down and find **Input_text List** (the List variant is a separate entry below the regular type)',
              'Select **Input_text List**',
              'Right-click **ChatCompletion** > select **Add Local Variable**',
              'Set **Name** to **TextContent**',
              'Click the **Data Type** dropdown and select **Input_text** (without List — this is a single item, not a list)',
              'Right-click **ChatCompletion** > select **Add Local Variable**',
              'Set **Name** to **InputMsg**',
              'Click the **Data Type** dropdown and select **InputItem**',
              'Right-click **ChatCompletion** > select **Add Local Variable**',
              'Set **Name** to **InputList**',
              'Click the **Data Type** dropdown and select **InputItem List**',
            ],
            important:
              'You MUST use the exact same Structure types that OutSystems auto-generated in Section 6.4. If you manually created Structures with different names (e.g., **InputMessage** instead of the auto-generated **InputItem**), you will get type-mismatch errors when you try to pass these variables to the consumed REST method. Delete any manually created Structures.',
            tip: 'In OutSystems 11 (Service Studio), both the single type and the List type appear as **separate entries** in the Data Type dropdown. For example, you will see both **Input_text** and **Input_text List** — select the one that says **List** for ContentList and InputList. There is no **SystemMsg** variable because the Responses API passes the system prompt as a top-level **Instructions** parameter, not as a message in the input array.',
          },
          {
            title: 'Step 1: Assign node — SetDefaults',
            instructions: [
              'Double-click the **ChatCompletion** Server Action to open the flow editor',
              'Drag an **Assign** node from the toolbox and drop it after the **Start** node',
              'Rename this Assign node to **SetDefaults** (click the node label to rename)',
              'Add the first assignment:',
              'Set **Target**: **Model**',
              'Set **Value**: **If(Model = "", Site.OpenAI_Model, Model)**',
              'Add the second assignment:',
              'Set **Target**: **MaxTokens**',
              'Set **Value**: **If(MaxTokens = 0, Site.OpenAI_DefaultMaxTokens, MaxTokens)**',
            ],
            tip: 'This pattern lets callers override the model and token limit, but falls back to the Site Property values when they pass empty/zero defaults.',
          },
          {
            title: 'Step 2: Build the input message (using ListAppend from the toolbox)',
            instructions: [
              'Drag an **Assign** node after **SetDefaults**',
              'Rename this Assign node to **BuildInput**',
              'Add the first assignment — set **Target**: **TextContent.Type**',
              'Set **Value**: **"input_text"**',
              'Add the second assignment — set **Target**: **TextContent.Text**',
              'Set **Value**: **UserMessage**',
              'Now you need to append **TextContent** to **ContentList**',
              'In the toolbox on the left side of the flow editor, expand **Built-in Actions** (or look under the **List** category)',
              'Find **ListAppend** and drag it onto the flow canvas',
              'Drop it as a **separate flow node** directly after the **BuildInput** Assign node',
              'Connect **BuildInput** to this **ListAppend** node',
              'In the **Properties** panel for this ListAppend node, set **List** to **ContentList**',
              'Set **Element** to **TextContent**',
              'Drag another **Assign** node after the **ListAppend** node',
              'Rename this Assign node to **BuildInputMsg**',
              'Add the first assignment — set **Target**: **InputMsg.Role**',
              'Set **Value**: **"user"**',
              'Add the second assignment — set **Target**: **InputMsg.Content**',
              'Set **Value**: **ContentList**',
              'Drag another **ListAppend** from the toolbox onto the flow canvas after the **BuildInputMsg** Assign node',
              'Connect **BuildInputMsg** to this second **ListAppend** node',
              'In the **Properties** panel for this second ListAppend node, set **List** to **InputList**',
              'Set **Element** to **InputMsg**',
            ],
            important:
              '**ListAppend** is a **flow action** that you drag from the toolbox as a separate node in the flow. It is NOT an expression function. You cannot type **ListAppend(ContentList, TextContent)** inside an Assign node Value field — that will cause an error. You must drag it from the toolbox and place it as its own node in the flow, then connect the nodes together. The system prompt is NOT added as a message in the input array. It will be passed as the **Instructions** parameter directly on the API call in the next step.',
          },
          {
            title: 'Step 3: Call the Consumed CreateResponse API',
            instructions: [
              'Drag the **CreateResponse** consumed REST method from the **Logic** tab > **Integrations** > **REST** and drop it after the second **ListAppend** node',
              'In the properties of the **CreateResponse** call, map the input parameters:',
              'Set **Authorization** to **"Bearer " + Site.OpenAI_APIKey**',
              'Set **ContentType** to **"application/json"**',
              'Set **Model** to **Model**',
              'Set **Instructions** to **SystemPrompt**',
              'Set **Input** to **InputList**',
              'Set **MaxOutputTokens** to **MaxTokens**',
              'Set **Temperature** to **Temperature**',
            ],
            tip: 'The **Authorization** and **ContentType** parameters are sent as HTTP headers (not in the JSON body) because you set **Send In** to **Header** in Section 6.4. The remaining parameters are sent in the request body as JSON.',
          },
          {
            title: 'Step 4: Assign node — SetOutput',
            instructions: [
              'Drag another **Assign** node after the **CreateResponse** call',
              'Rename this Assign node to **SetOutput**',
              'Add the first assignment:',
              'Set **Target**: **Success**',
              'Set **Value**: **True**',
              'Add the second assignment:',
              'Set **Target**: **ResponseText**',
              'Set **Value**: **CreateResponse.Response.Output.Current.Content.Current.Text**',
              'Add the third assignment:',
              'Set **Target**: **TokensUsed**',
              'Set **Value**: **LongIntegerToInteger(CreateResponse.Response.Usage.Total_tokens)** — the conversion function is needed because OutSystems auto-generates token counts as **Long Integer** but our output parameter is **Integer**',
              'Add the fourth assignment:',
              'Set **Target**: **ErrorMessage**',
              'Set **Value**: **""**',
              'Connect the **SetOutput** node to the **End** node',
            ],
            important:
              'The response path **CreateResponse.Response.Output.Current.Content.Current.Text** navigates: response object > **Output** list > first item (via **.Current**) > **Content** list > first item (via **.Current**) > **Text** attribute. The exact property names in this path depend on the auto-generated Structure names. Use OutSystems autocomplete (type **CreateResponse.Response.** and wait for suggestions) to build the correct path. If your auto-generated names differ, the path will look slightly different but the navigation pattern is the same: response > output list > first output > content list > first content > text.',
          },
          {
            title: 'Step 5: Add Exception Handler',
            instructions: [
              'Right-click anywhere on the flow canvas > select **Add Exception Handler**',
              'Set the **Exception** to **All Exceptions**',
              'Drag an **Assign** node after the **All Exceptions** handler',
              'Rename this Assign node to **HandleError**',
              'Add the first assignment:',
              'Set **Target**: **Success**',
              'Set **Value**: **False**',
              'Add the second assignment:',
              'Set **Target**: **ResponseText**',
              'Set **Value**: **""**',
              'Add the third assignment:',
              'Set **Target**: **ErrorMessage**',
              'Set **Value**: **"OpenAI API call failed: " + AllExceptions.ExceptionMessage**',
              'Add the fourth assignment:',
              'Set **Target**: **TokensUsed**',
              'Set **Value**: **0**',
              'Connect the **HandleError** node to the **End** node',
            ],
            important:
              'The Exception Handler is critical. Without it, any OpenAI API failure (network timeout, rate limit, invalid key) will crash the calling module. The handler ensures a graceful failure with **Success = False** and a descriptive error message.',
          },
        ],
      },

      // ── 6.6: Expose as REST API (Optional) ──
      {
        id: '6.6',
        title: 'Expose as REST API (Optional)',
        summary:
          'Optionally expose the **ChatCompletion** functionality as an **Exposed REST API** endpoint so external systems can call it over HTTP.',
        steps: [
          {
            title: 'Create the Exposed REST API',
            instructions: [
              'Click the **Logic** tab on the left panel',
              'Expand the **Integrations** folder',
              'Right-click **REST** (under Integrations) > select **Expose REST API**',
              'Set **Name** to **OpenAIService**',
            ],
          },
          {
            title: 'Create the ChatCompletionAPIRequest Structure',
            instructions: [
              'Before adding the REST method, first create the request Structure',
              'Click the **Data** tab > right-click **Structures** > select **Add Structure**',
              'Set **Name** to **ChatCompletionAPIRequest**',
              'Right-click **ChatCompletionAPIRequest** > select **Add Structure Attribute**',
              'Set **Name** to **UserMessage**',
              'Set **Data Type** to **Text**',
              'Set **Is Mandatory** to **Yes**',
              'Right-click **ChatCompletionAPIRequest** > select **Add Structure Attribute**',
              'Set **Name** to **SystemPrompt**',
              'Set **Data Type** to **Text**',
              'Set **Is Mandatory** to **No**',
              'Right-click **ChatCompletionAPIRequest** > select **Add Structure Attribute**',
              'Set **Name** to **Model**',
              'Set **Data Type** to **Text**',
              'Set **Is Mandatory** to **No**',
              'Right-click **ChatCompletionAPIRequest** > select **Add Structure Attribute**',
              'Set **Name** to **MaxTokens**',
              'Set **Data Type** to **Integer**',
              'Set **Is Mandatory** to **No**',
              'Right-click **ChatCompletionAPIRequest** > select **Add Structure Attribute**',
              'Set **Name** to **Temperature**',
              'Set **Data Type** to **Decimal**',
              'Set **Is Mandatory** to **No**',
            ],
          },
          {
            title: 'Create the ChatCompletionAPIResponse Structure',
            instructions: [
              'Right-click **Structures** > select **Add Structure**',
              'Set **Name** to **ChatCompletionAPIResponse**',
              'Right-click **ChatCompletionAPIResponse** > select **Add Structure Attribute**',
              'Set **Name** to **Success**',
              'Set **Data Type** to **Boolean**',
              'Right-click **ChatCompletionAPIResponse** > select **Add Structure Attribute**',
              'Set **Name** to **ResponseText**',
              'Set **Data Type** to **Text**',
              'Right-click **ChatCompletionAPIResponse** > select **Add Structure Attribute**',
              'Set **Name** to **ErrorMessage**',
              'Set **Data Type** to **Text**',
              'Right-click **ChatCompletionAPIResponse** > select **Add Structure Attribute**',
              'Set **Name** to **TokensUsed**',
              'Set **Data Type** to **Integer**',
            ],
          },
          {
            title: 'Add the REST API Method',
            instructions: [
              'Click the **Logic** tab > expand **Integrations** > **REST**',
              'Right-click the **OpenAIService** exposed REST API > select **Add REST API Method**',
              'Set **Name** to **ChatCompletion**',
              'Set **HTTP Method** to **POST**',
              'Set **URL Path** to **/chatcompletion**',
              'Right-click the **ChatCompletion** method > select **Add Input Parameter**',
              'Set **Name** to **Request**',
              'Set **Data Type** to **ChatCompletionAPIRequest**',
              'Set **Receive In** to **Body**',
              'Right-click the **ChatCompletion** method > select **Add Output Parameter**',
              'Set **Name** to **Response**',
              'Set **Data Type** to **ChatCompletionAPIResponse**',
            ],
            important:
              'A REST method can only have ONE **Body** parameter. That is why you wrap all input fields into the **ChatCompletionAPIRequest** Structure instead of adding them individually.',
          },
          {
            title: 'Build the exposed REST method flow',
            instructions: [
              'Double-click the **ChatCompletion** REST method to open the flow editor',
              'Drag the **ChatCompletion** Server Action (from **Server Actions** in the Logic tree) into the flow after **Start**',
              'Map the Server Action inputs from the Body parameter:',
              'Set **UserMessage** to **Request.UserMessage**',
              'Set **SystemPrompt** to **Request.SystemPrompt**',
              'Set **Model** to **Request.Model**',
              'Set **MaxTokens** to **Request.MaxTokens**',
              'Set **Temperature** to **Request.Temperature**',
              'Drag an **Assign** node after the Server Action call',
              'Set **Target**: **Response.Success**',
              'Set **Value**: **ChatCompletion.Success**',
              'Set **Target**: **Response.ResponseText**',
              'Set **Value**: **ChatCompletion.ResponseText**',
              'Set **Target**: **Response.ErrorMessage**',
              'Set **Value**: **ChatCompletion.ErrorMessage**',
              'Set **Target**: **Response.TokensUsed**',
              'Set **Value**: **ChatCompletion.TokensUsed**',
              'Connect the **Assign** node to the **End** node',
            ],
          },
        ],
      },

      // ── 6.7: Publish, Configure & Test ──
      {
        id: '6.7',
        title: 'Publish, Configure & Test',
        summary:
          'Publish the module, set the OpenAI API key in **Service Center**, and verify the wrapper works end-to-end.',
        steps: [
          {
            title: 'Publish the module',
            instructions: [
              'Click the **1-Click Publish** button in the toolbar (or press **Ctrl+Shift+P**)',
              'Wait for the publish to complete',
              'If there are errors, read each error message carefully and fix the issue before re-publishing',
              'Common errors at this stage: missing **Name in JSON** values, wrong data types, or unconnected flow nodes',
            ],
          },
          {
            title: 'Set the API Key in Service Center',
            instructions: [
              'Open a web browser and navigate to your **Service Center** URL (e.g., **https://your-environment.outsystemscloud.com/ServiceCenter**)',
              'Log in with your OutSystems credentials',
              'Go to **Factory** > **Modules**',
              'Search for **CareConnect_OpenAIWrapper** and click on it',
              'Click the **Site Properties** tab',
              'Find **OpenAI_APIKey** and click **Edit**',
              'Paste your actual OpenAI API key (it starts with **sk-proj-...**)',
              'Click **Save**',
              'Verify that **OpenAI_Model** shows **gpt-4o-mini**',
              'Verify that **OpenAI_DefaultMaxTokens** shows **1024**',
            ],
            important:
              'Use **Service Center** (the web browser admin portal), NOT **Service Studio** (the desktop IDE), to set Site Property values in the deployed environment. Service Studio only sets design-time defaults.',
          },
          {
            title: 'Test the wrapper',
            instructions: [
              'If you created the Exposed REST API in Section 6.6, right-click the **OpenAIService** REST API in **Service Studio** > select **Open Documentation**',
              'This opens the **Swagger UI** auto-generated documentation in your browser',
              'Find the **POST /chatcompletion** endpoint and click **Try it out**',
              'Enter a test JSON body: **{"UserMessage": "Hello, can you help me find a caregiver?"}**',
              'Click **Execute** and verify you get a successful AI response',
              'If you did NOT create the Exposed REST API, create a simple test **Screen** in a separate module, add a button that calls the **ChatCompletion** Server Action, and display the result',
            ],
            tip: 'If you get a **401 Unauthorized** error, double-check that the API key is set correctly in Service Center and that the **Authorization** header input parameter value includes the **"Bearer "** prefix with a space.',
          },
        ],
      },

      // ── 6.8: Consume from CareConnect UI ──
      {
        id: '6.8',
        title: 'Consume from CareConnect UI',
        summary:
          'Add a dependency from the **CareConnect UI** module to the **CareConnect_OpenAIWrapper**, build a screen with an input field and a button, wire up a Client Action that calls the AI, and display the response.',
        steps: [
          {
            title: 'Add the dependency via Ctrl+Q',
            instructions: [
              'Open the **CareConnect UI** module in **Service Studio**',
              'Press **Ctrl+Q** on your keyboard to open the **Manage Dependencies** dialog',
              'In the search box at the top, type **CareConnect_OpenAIWrapper**',
              'Click on **CareConnect_OpenAIWrapper** in the results list on the left panel',
              'In the right panel, expand **Server Actions**',
              'Check the checkbox next to **ChatCompletion**',
              'Click **Apply** at the bottom-right of the dialog',
              'Wait for the dependency to be added — you will see a progress bar',
              'To verify: go to the **Logic** tab > expand **Server Actions** > you should see a folder called **CareConnect_OpenAIWrapper** with **ChatCompletion** inside it',
            ],
            important:
              'If **ChatCompletion** does not appear in the dependency list, go back to the **CareConnect_OpenAIWrapper** module and verify that **Public** is set to **Yes** on the Server Action. Then re-publish that module and try **Ctrl+Q** again.',
          },
          {
            title: 'Create a new Screen for the AI chat',
            instructions: [
              'Go to the **Interface** tab on the left panel',
              'Expand **UI Flows** > **MainFlow**',
              'Right-click **MainFlow** > select **Add Screen**',
              'Choose the **Empty** screen template',
              'Set the **Name** to **AIChat**',
              'Click **Create Screen**',
              'The new screen opens in the screen editor',
            ],
            tip: 'If you already have a screen where you want to add the AI feature, skip this step and open that screen instead.',
          },
          {
            title: 'Add Local Variables to the screen',
            instructions: [
              'In the screen editor, look at the **widget tree** on the right side (or the screen node in the element tree)',
              'Right-click the **AIChat** screen node > select **Add Local Variable**',
              'Set **Name** to **UserInput**',
              'Set **Data Type** to **Text**',
              'This variable will hold whatever the user types in the input field',
              'Right-click the **AIChat** screen node again > select **Add Local Variable**',
              'Set **Name** to **AIResponseText**',
              'Set **Data Type** to **Text**',
              'This variable will hold the AI response to display on screen',
              'Right-click the **AIChat** screen node again > select **Add Local Variable**',
              'Set **Name** to **IsLoading**',
              'Set **Data Type** to **Boolean**',
              'Set **Default Value** to **False**',
              'This variable controls whether to show a "Loading..." indicator while waiting for the AI',
              'Right-click the **AIChat** screen node again > select **Add Local Variable**',
              'Set **Name** to **ErrorText**',
              'Set **Data Type** to **Text**',
              'This variable will hold any error message if the AI call fails',
            ],
          },
          {
            title: 'Add a heading to the screen',
            instructions: [
              'In the **toolbox** on the left side of the screen editor, find **Text** (under **Content** or just search for it)',
              'Drag a **Text** widget onto the screen content area',
              'Type a heading like **Ask CareConnect AI**',
              'In the **Properties** panel, set the **Style** or **Style Classes** to **heading3** (or whatever heading style your theme uses)',
            ],
          },
          {
            title: 'Add an Input widget for the user message',
            instructions: [
              'In the toolbox, find **Input** (under **Form** or search for it)',
              'Drag an **Input** widget onto the screen below the heading',
              'In the **Properties** panel on the right, find the **Variable** property',
              'Click the dropdown and select **UserInput** (the Local Variable you created)',
              'Find the **Prompt** property (or **Placeholder**)',
              'Set it to **"Type your message here..."**',
              'Optionally set **Style Classes** to **"form-control"** or whatever your theme uses for styled inputs',
            ],
            tip: 'The **Variable** property binds the Input widget to your Local Variable. Whatever the user types will be stored in **UserInput** automatically.',
          },
          {
            title: 'Add a Button to send the message',
            instructions: [
              'In the toolbox, find **Button** (under **Form** or search for it)',
              'Drag a **Button** widget onto the screen below the Input widget',
              'Click on the button text and type **Ask AI**',
              'In the **Properties** panel, find the **Events** section',
              'Find the **On Click** event',
              'Click the **On Click** dropdown > select **New Client Action**',
              'Service Studio creates a new Client Action and opens the flow editor — you will build the AI call logic here in the next step',
            ],
          },
          {
            title: 'Build the Client Action flow — call the AI',
            instructions: [
              'You should now be in the Client Action flow editor (it opened when you created the On Click action)',
              'Drag an **Assign** node from the toolbox and drop it after the **Start** node',
              'Rename it to **StartLoading**',
              'Add the first assignment — set **Target**: **IsLoading**',
              'Set **Value**: **True**',
              'Add the second assignment — set **Target**: **ErrorText**',
              'Set **Value**: **""** (empty string — clears any previous error)',
              'Add the third assignment — set **Target**: **AIResponseText**',
              'Set **Value**: **""** (empty string — clears any previous response)',
              'Now drag **Run Server Action** from the toolbox and drop it after the **StartLoading** Assign node',
              'A dialog appears — expand **CareConnect_OpenAIWrapper** and select **ChatCompletion**',
              'Click **OK**',
              'In the properties of the **ChatCompletion** call, set the input parameters:',
              'Set **UserMessage** to **UserInput**',
              'Leave **SystemPrompt** blank to use the default, or set it to a custom prompt like **"You are a helpful assistant for CareConnect, a caregiving platform that connects families with caregivers."**',
              'Leave **Model**, **MaxTokens**, and **Temperature** blank to use their defaults',
            ],
          },
          {
            title: 'Handle the response — If / True / False branches',
            instructions: [
              'Drag an **If** node from the toolbox and drop it after the **ChatCompletion** Server Action call',
              'In the **Properties** panel, set **Condition** to **ChatCompletion.Success**',
              'On the **True** branch (left side): drag an **Assign** node',
              'Rename it to **SetResponse**',
              'Add the assignment — set **Target**: **AIResponseText**',
              'Set **Value**: **ChatCompletion.ResponseText**',
              'Connect the **SetResponse** Assign to the flow (toward End)',
              'On the **False** branch (right side): drag an **Assign** node',
              'Rename it to **SetError**',
              'Add the assignment — set **Target**: **ErrorText**',
              'Set **Value**: **ChatCompletion.ErrorMessage**',
              'Connect the **SetError** Assign to the flow (toward End)',
              'After both branches, drag a final **Assign** node',
              'Rename it to **StopLoading**',
              'Add the assignment — set **Target**: **IsLoading**',
              'Set **Value**: **False**',
              'Connect the **StopLoading** node to the **End** node',
            ],
            important:
              'Always set **IsLoading** back to **False** at the end, even after an error. Otherwise the loading indicator will stay on screen forever if the API call fails.',
          },
          {
            title: 'Display the AI response on the screen',
            instructions: [
              'Go back to the screen editor (click the **AIChat** screen name in the **Interface** tab)',
              'Below the Button, drag an **If** widget from the toolbox onto the screen',
              'In the **Properties** panel, set **Condition** to **IsLoading**',
              'Inside the **True** branch of the If widget, drag a **Text** widget and type **Loading... please wait**',
              'Inside the **False** branch of the If widget, drag an **Expression** widget',
              'Set the Expression **Value** to **AIResponseText**',
              'This will display the AI response after the button is clicked',
            ],
            tip: 'The **If** widget shows the "Loading..." text while the AI is thinking, then swaps to show the actual response once **IsLoading** becomes **False**.',
          },
          {
            title: 'Display errors on the screen',
            instructions: [
              'Below the response area, drag another **If** widget onto the screen',
              'Set **Condition** to **ErrorText <> ""** (this means: only show if there is an error)',
              'Inside the **True** branch, drag a **Text** widget',
              'Set the text to the **Expression**: **ErrorText**',
              'Optionally set **Style Classes** to **"text-danger"** or a red color class so the error stands out',
              'Leave the **False** branch empty — nothing shows when there is no error',
            ],
          },
          {
            title: 'Publish and test',
            instructions: [
              'Click the **1-Click Publish** button in the toolbar',
              'Wait for the publish to complete — fix any errors if they appear',
              'Click **Open in browser** to launch your app',
              'Navigate to the **AIChat** screen (you may need to add it to your menu or navigate directly via URL)',
              'Type a test message like **"Hello, can you help me find a caregiver?"**',
              'Click the **Ask AI** button',
              'You should see **"Loading... please wait"** appear briefly',
              'After a few seconds, the AI response should replace the loading text',
              'If you see an error message instead, check Section 6.9 (Common Gotchas) for troubleshooting',
            ],
            important:
              'If you get a blank response or an error, the most common causes are: (1) API key not set in Service Center, (2) the **ChatCompletion** Server Action was not added via **Ctrl+Q**, or (3) the **UserInput** variable is not bound to the Input widget. Double-check all three.',
          },
        ],
      },

      // ── 6.9: Common Gotchas & Checklist ──
      {
        id: '6.9',
        title: 'Common Gotchas & Checklist',
        summary:
          'Review common mistakes and verify your implementation against the final checklist before moving on.',
        steps: [
          {
            title: 'Common gotchas to watch for',
            instructions: [
              '**Type mismatch errors (e.g., "Expected InputItem instead of InputMessage")**: This happens when you manually created Structures AND also pasted sample JSON in the Consume REST API dialog. OutSystems auto-generates Structures from the sample JSON, and the consumed REST method is wired to those auto-generated types. If you also manually created Structures with different names, the types do not match. Fix: delete the manually created Structures and use only the auto-generated ones throughout your Server Action',
              '**ListAppend used as an expression**: **ListAppend** is a **flow action** that you drag from the toolbox as a separate node. You cannot type **ListAppend(MyList, MyItem)** inside an Assign node Value field. If you see an error about ListAppend not being recognized as a function, remove it from the Assign and drag it from the toolbox as its own node in the flow',
              '**400 Bad Request**: The auto-generated Structures from the sample JSON should have correct **Name in JSON** values automatically. However, if you see this error, verify the consumed REST API URL is **https://api.openai.com/v1/responses** (not the old **/v1/chat/completions**) and that the sample JSON uses Responses API field names (**input**, **instructions**, **max_output_tokens**)',
              '**401 Unauthorized**: The API key is not set in **Service Center**, or the **Authorization** header input parameter value is missing the **"Bearer "** prefix (with a space after Bearer)',
              '**Empty response / runtime error on Output**: Check that the **Output** list is not empty before accessing **.Current.Content.Current.Text** — an empty list will cause a runtime error',
              '**429 Rate Limit Exceeded**: You are sending too many requests too quickly — add retry logic with a delay, or switch to **gpt-4o-mini** which has higher rate limits',
              '**Module cannot find ChatCompletion via Ctrl+Q**: Ensure **Public** is set to **Yes** on the Server Action, re-publish the wrapper module, then re-open **Ctrl+Q** in the consuming module',
              '**Response path autocomplete does not match the guide**: The exact property path (e.g., **CreateResponse.Response.Output.Current.Content.Current.Text**) depends on the auto-generated Structure names. Use OutSystems autocomplete to navigate: type **CreateResponse.Response.** and follow the suggestions through Output > Current > Content > Current > Text',
              '**Wrong URL**: Make sure the consumed REST API URL is **https://api.openai.com/v1/responses** — NOT the old **/v1/chat/completions** endpoint',
            ],
            tip: 'The Responses API also supports file inputs. As a bonus feature, you can send PDFs or images to the AI by adding content items with **type: "input_file"** and a **file_url**. This is useful for document-aware features like care plan analysis.',
          },
          {
            title: 'Final implementation checklist',
            instructions: [
              'Verify: **CareConnect_OpenAIWrapper** is a separate **Service** module inside the **CareConnect Integration** application',
              'Verify: Structures were **auto-generated** from the sample JSON pasted in the Consume REST API dialog — you did NOT manually create OpenAI request/response Structures',
              'Verify: You created **3 Site Properties**: **OpenAI_APIKey** (Text, empty default), **OpenAI_Model** (Text, default **gpt-4o-mini**), **OpenAI_DefaultMaxTokens** (Integer, default **1024**)',
              'Verify: The **Consumed REST API** points to **https://api.openai.com/v1/responses**',
              'Verify: The consumed method is named **CreateResponse** (not **ChatCompletions**)',
              'Verify: The **Authorization** and **ContentType** Input Parameters on the consumed method have **Send In** set to **Header**',
              'Verify: The **ChatCompletion** Server Action has **Public** set to **Yes**',
              'Verify: Local Variables in the Server Action use the **auto-generated Structure types** (not manually created ones)',
              'Verify: **ListAppend** is used as a **flow action node** dragged from the toolbox — NOT as an expression inside an Assign value',
              'Verify: The response text is read via the path **CreateResponse.Response.Output.Current.Content.Current.Text** (the exact property names depend on your auto-generated Structure names — use autocomplete to verify)',
              'Verify: The **Exception Handler** catches **All Exceptions** and returns **Success = False** with a descriptive error message',
              'Verify: The module is published and the API key is set via **Service Center** (not hardcoded)',
              'Verify: A test call returns a valid AI response with **Success = True**',
              'Verify: The **CareConnect UI** (or **CC_Orchestration**) can consume the **ChatCompletion** action via **Ctrl+Q** dependency',
            ],
            important:
              'Do not proceed to integrating the AI into the main CareConnect workflows until every item on this checklist passes. A misconfigured wrapper will cause cascading failures in the layers above.',
          },
        ],
      },
    ],
  },
  // ──────────────────────────────────────────────
  // PHASE 7: Consuming the OpenAI Wrapper (For Other Teams)
  // ──────────────────────────────────────────────
  {
    id: 7,
    title: 'Consuming the OpenAI Wrapper',
    description:
      'A step-by-step guide for **any project team** on the same OutSystems environment to consume the **CareConnect_OpenAIWrapper** module. You do NOT need to build your own OpenAI integration — just add a dependency to the existing wrapper and call the **ChatCompletion** Server Action. This guide assumes you have never consumed an external module before.',
    timeEstimate: '30-45 min',
    sections: [
      // ── 7.1: Prerequisites ──
      {
        id: '7.1',
        title: 'Prerequisites — What You Need Before Starting',
        summary:
          'Verify that you are on the same OutSystems environment and that the **CareConnect_OpenAIWrapper** module has been published.',
        steps: [
          {
            title: 'Confirm you are on the same environment',
            instructions: [
              'Open **Service Studio** on your computer',
              'Look at the **Environment** field in the top-left corner of Service Studio — it shows the server URL you are connected to (e.g., **https://smumitb-dev.outsystemscloud.com**)',
              'Ask the CareConnect team what environment they published **CareConnect_OpenAIWrapper** to',
              'Both URLs must match exactly — if they do not match, you are on a different environment and cannot use **Ctrl+Q** (you would need to consume it as an external REST API instead)',
            ],
            important:
              'If you are on a different environment, skip to Section 7.6 which covers the REST API consumption approach. The **Ctrl+Q** method described in Sections 7.2–7.5 only works when both teams share the same environment.',
          },
          {
            title: 'Verify the wrapper module is published',
            instructions: [
              'In **Service Studio**, press **Ctrl+Q** to open the **Manage Dependencies** dialog',
              'In the search box, type **CareConnect_OpenAIWrapper**',
              'If the module appears in the search results, it is published and ready to consume — close the dialog for now (you will come back in the next section)',
              'If the module does NOT appear, contact the CareConnect team and ask them to **1-Click Publish** the **CareConnect_OpenAIWrapper** module',
            ],
            tip: 'The module must be published at least once before it appears in the Manage Dependencies search. If the CareConnect team just created it but has not yet published, it will be invisible to your project.',
          },
          {
            title: 'Understand what the wrapper provides',
            instructions: [
              'The **CareConnect_OpenAIWrapper** module exposes a single public Server Action called **ChatCompletion**',
              'You send it a **UserMessage** (the text you want the AI to respond to)',
              'You optionally send a **SystemPrompt** (instructions that tell the AI how to behave for your specific use case)',
              'You optionally override the **Model**, **MaxTokens**, and **Temperature** settings',
              'It returns **ResponseText** (the AI reply), **Success** (true/false), **ErrorMessage** (if something went wrong), and **TokensUsed** (how many OpenAI tokens were consumed)',
              'You do NOT need to worry about API keys, HTTP headers, JSON serialization, or error handling — the wrapper handles all of that internally',
            ],
          },
        ],
      },

      // ── 7.2: Add the Dependency ──
      {
        id: '7.2',
        title: 'Add the Dependency to Your Module',
        summary:
          'Use **Ctrl+Q** (Manage Dependencies) to add a reference from your module to the **CareConnect_OpenAIWrapper** module.',
        steps: [
          {
            title: 'Open your module in Service Studio',
            instructions: [
              'Open **Service Studio**',
              'Open the **application** that contains your project (e.g., your team\'s app)',
              'Open the specific **module** where you want to add AI features',
              'This can be a **Reactive Web App** module (if you want to call the AI from the frontend) or a **Service** module (if you want to call the AI from backend logic)',
            ],
          },
          {
            title: 'Add the dependency via Manage Dependencies',
            instructions: [
              'Press **Ctrl+Q** on your keyboard — this opens the **Manage Dependencies** dialog',
              'You will see a search box at the top and a list of available modules below',
              'In the search box, type **CareConnect_OpenAIWrapper**',
              'Click on **CareConnect_OpenAIWrapper** in the search results (left panel)',
              'The right panel will show the public elements available from this module',
              'Expand the **Server Actions** folder in the right panel',
              'You should see **ChatCompletion** listed — check the **checkbox** next to it',
              'Click **Apply** at the bottom-right of the dialog',
              'Wait for Service Studio to refresh the references — you will see a progress bar',
            ],
            important:
              'If **ChatCompletion** does not appear under Server Actions, the CareConnect team may not have set **Public = Yes** on the Server Action. Ask them to verify this setting and re-publish.',
          },
          {
            title: 'Verify the dependency was added',
            instructions: [
              'After clicking Apply, look at the **Logic** tab on the left panel',
              'Expand **Server Actions**',
              'You should see a new folder called **CareConnect_OpenAIWrapper**',
              'Inside that folder, you should see **ChatCompletion**',
              'If you see it, the dependency is correctly added and you can proceed to the next section',
            ],
            tip: 'The **ChatCompletion** action will appear with a small arrow icon indicating it is a referenced (external) Server Action, not one you created locally.',
          },
        ],
      },

      // ── 7.3: Call ChatCompletion from a Server Action ──
      {
        id: '7.3',
        title: 'Call ChatCompletion from a Server Action',
        summary:
          'Create a Server Action in your own module that calls the **ChatCompletion** wrapper. This is the recommended approach because it lets you add your own custom **SystemPrompt** and handle the response in your own business logic.',
        steps: [
          {
            title: 'Create your own wrapper Server Action',
            instructions: [
              'Go to the **Logic** tab',
              'Right-click **Server Actions** > select **Add Server Action**',
              'Set **Name** to something meaningful for your use case — for example: **SA_AskAI**, **SA_GetAIRecommendation**, **SA_GenerateSummary**, etc.',
              'Set **Public** to **Yes** if other modules in your app need to call it, or **No** if only this module will use it',
            ],
          },
          {
            title: 'Add Input Parameters to your Server Action',
            instructions: [
              'Right-click your new Server Action > select **Add Input Parameter**',
              'Set **Name** to **UserMessage**',
              'Set **Data Type** to **Text**',
              'Set **Is Mandatory** to **Yes**',
              'Add any other inputs your use case needs (e.g., a patient ID, a context string, etc.)',
            ],
          },
          {
            title: 'Add Output Parameters to your Server Action',
            instructions: [
              'Right-click your Server Action > select **Add Output Parameter**',
              'Set **Name** to **AIResponse**',
              'Set **Data Type** to **Text**',
              'Right-click your Server Action > select **Add Output Parameter**',
              'Set **Name** to **Success**',
              'Set **Data Type** to **Boolean**',
              'Right-click your Server Action > select **Add Output Parameter**',
              'Set **Name** to **ErrorMessage**',
              'Set **Data Type** to **Text**',
            ],
          },
          {
            title: 'Build the flow — call ChatCompletion',
            instructions: [
              'Double-click your Server Action to open the flow editor',
              'From the **Logic** tab on the left, expand **Server Actions** > **CareConnect_OpenAIWrapper**',
              'Drag **ChatCompletion** onto the flow canvas and drop it between the **Start** and **End** nodes',
              'The action will appear as a node with input and output connectors',
            ],
          },
          {
            title: 'Map the input parameters',
            instructions: [
              'Click on the **ChatCompletion** node you just dragged onto the canvas',
              'In the **Properties** panel on the right, you will see the input parameters:',
              'Set **UserMessage** to your input parameter — for example: **UserMessage**',
              'Set **SystemPrompt** to a text string that tells the AI how to behave for YOUR project — for example: **"You are a helpful assistant for [YourProjectName]. Answer questions about [your domain]."**',
              'Leave **Model** empty (it will use the default **gpt-4o-mini**) or set it to a specific model like **"gpt-4o"** if you need higher quality responses',
              'Leave **MaxTokens** as **0** (it will use the default **1024**) or set a custom value',
              'Leave **Temperature** as **0.7** (balanced creativity) or set **0.2** for more factual responses, or **1.0** for more creative responses',
            ],
            tip: 'The **SystemPrompt** is the most important parameter for your team to customize. It controls the AI personality and behavior. For example: "You are a medical triage assistant. Only answer health-related questions. If unsure, recommend the user consult a doctor." — make it specific to YOUR project, not CareConnect.',
          },
          {
            title: 'Handle the response',
            instructions: [
              'Drag an **If** node after the **ChatCompletion** node',
              'Set the **Condition** to **ChatCompletion.Success**',
              'On the **True** branch (left): drag an **Assign** node',
              'Set **AIResponse** = **ChatCompletion.ResponseText**',
              'Set **Success** = **True**',
              'Set **ErrorMessage** = **""**',
              'Connect the Assign to the **End** node',
              'On the **False** branch (right): drag an **Assign** node',
              'Set **AIResponse** = **""**',
              'Set **Success** = **False**',
              'Set **ErrorMessage** = **ChatCompletion.ErrorMessage**',
              'Connect the Assign to the **End** node',
            ],
            important:
              'Always check **ChatCompletion.Success** before using **ChatCompletion.ResponseText**. If the API call failed (network error, invalid key, rate limit), **ResponseText** will be empty and **ErrorMessage** will contain the reason.',
          },
        ],
      },

      // ── 7.4: Call from the UI (Screen + Button) ──
      {
        id: '7.4',
        title: 'Call from the UI — Screen with Input and Button',
        summary:
          'Create a simple screen with a text input and a button that sends the user\'s message to the AI and displays the response. This is the quickest way to test the integration end-to-end.',
        steps: [
          {
            title: 'Create the screen (if you don\'t already have one)',
            instructions: [
              'Go to the **Interface** tab',
              'Right-click **MainFlow** > select **Add Screen**',
              'Choose **Empty** screen template',
              'Set **Name** to something like **AIChat** or **AskAI**',
              'Click **Create Screen**',
            ],
          },
          {
            title: 'Add Local Variables for state management',
            instructions: [
              'Right-click the screen name in the widget tree > select **Add Local Variable**',
              'Set **Name** to **UserInput**',
              'Set **Data Type** to **Text**',
              'Right-click the screen name > select **Add Local Variable**',
              'Set **Name** to **AIResponseText**',
              'Set **Data Type** to **Text**',
              'Right-click the screen name > select **Add Local Variable**',
              'Set **Name** to **IsLoading**',
              'Set **Data Type** to **Boolean**',
              'Set **Default Value** to **False**',
              'Right-click the screen name > select **Add Local Variable**',
              'Set **Name** to **ErrorText**',
              'Set **Data Type** to **Text**',
            ],
          },
          {
            title: 'Add an Input widget for the user\'s message',
            instructions: [
              'Drag an **Input** widget from the toolbox onto the screen',
              'In the **Properties** panel, set **Variable** to **UserInput**',
              'Optionally set **Prompt** (placeholder text) to **"Type your message here..."**',
            ],
          },
          {
            title: 'Add a Button to send the message',
            instructions: [
              'Drag a **Button** widget below the Input widget',
              'Set the **Text** property to **"Ask AI"** (or whatever label fits your project)',
              'In the **Events** section of the Button properties, find **On Click**',
              'Click the **On Click** dropdown > select **New Client Action**',
              'This creates a new Client Action and opens the flow editor',
            ],
          },
          {
            title: 'Build the Client Action flow',
            instructions: [
              'Inside the Client Action flow, drag an **Assign** node after **Start**',
              'Set **IsLoading** = **True** (this lets you show a loading spinner on the screen)',
              'Set **ErrorText** = **""** (clear any previous errors)',
              'Drag **Run Server Action** from the toolbox after the Assign',
              'If you created a wrapper in Section 7.3, select your **SA_AskAI** (or equivalent) Server Action',
              'If you did NOT create a wrapper, select **CareConnect_OpenAIWrapper > ChatCompletion** directly',
              'Map **UserMessage** to **UserInput**',
              'If calling ChatCompletion directly, set **SystemPrompt** to a string for your project\'s context',
              'Drag an **If** node after the Server Action',
              'Set the **Condition** to **SA_AskAI.Success** (or **ChatCompletion.Success** if calling directly)',
              'On the **True** branch: drag an **Assign** — set **AIResponseText** = **SA_AskAI.AIResponse** (or **ChatCompletion.ResponseText**)',
              'On the **False** branch: drag an **Assign** — set **ErrorText** = **SA_AskAI.ErrorMessage** (or **ChatCompletion.ErrorMessage**)',
              'After both branches merge, drag another **Assign** node',
              'Set **IsLoading** = **False**',
              'Connect to **End**',
            ],
            tip: 'Setting **IsLoading** to **True** at the start and **False** at the end lets you bind a loading indicator on the screen using an **If** widget with **Condition = IsLoading**.',
          },
          {
            title: 'Display the AI response on the screen',
            instructions: [
              'Go back to the screen editor (click the screen name in the Interface tab)',
              'Below the Button, drag an **Expression** widget',
              'Set its **Value** to **AIResponseText**',
              'This will display the AI\'s response after the button is clicked',
              'Optionally, add another **Expression** or **If** widget to show **ErrorText** when it is not empty — wrap it in an **If** widget with **Condition** = **ErrorText <> ""** to hide it when there is no error',
            ],
          },
          {
            title: 'Test it',
            instructions: [
              'Click the green **1-Click Publish** button in the top-right of Service Studio',
              'Wait for the publish to complete',
              'Click **Open in browser** to launch your app',
              'Navigate to the AI screen',
              'Type a test message like **"Hello, what can you do?"**',
              'Click the **Ask AI** button',
              'You should see the AI response appear below the button within a few seconds',
            ],
            important:
              'If you get an error, check these common causes: (1) the CareConnect team has not set the API key in Service Center, (2) you are on a different environment, (3) you did not check the ChatCompletion checkbox in Ctrl+Q. See Section 7.7 for a full troubleshooting guide.',
          },
        ],
      },

      // ── 7.5: Customizing the SystemPrompt for Your Project ──
      {
        id: '7.5',
        title: 'Customizing the SystemPrompt for Your Project',
        summary:
          'The **SystemPrompt** parameter is how you tailor the AI behavior to your specific project. This section explains what it does and gives examples for different use cases.',
        steps: [
          {
            title: 'What is the SystemPrompt?',
            instructions: [
              'The **SystemPrompt** is a hidden instruction sent to the AI before the user\'s message',
              'It tells the AI WHO it is, WHAT it should do, and HOW it should respond',
              'The user never sees the SystemPrompt — only the AI sees it',
              'If you do not provide one, the default is: **"You are a helpful assistant for CareConnect, a caregiving platform."**',
              'You almost certainly want to override this default with something specific to YOUR project',
            ],
          },
          {
            title: 'Example SystemPrompts for different use cases',
            instructions: [
              'For a **healthcare Q&A bot**: **"You are a medical information assistant. Provide accurate health information based on established medical knowledge. Always include a disclaimer to consult a healthcare professional. Never diagnose conditions."**',
              'For a **customer service bot**: **"You are a customer support agent for [Your Company]. Be polite, concise, and helpful. If you cannot resolve the issue, tell the user to contact support@example.com."**',
              'For a **study assistant**: **"You are a study tutor for [Course Name]. Explain concepts clearly using simple language. Give examples. If the student is confused, try a different explanation approach."**',
              'For a **data summarizer**: **"You are a data analyst assistant. When given data or text, summarize the key insights in 3-5 bullet points. Be factual and avoid speculation."**',
              'For a **code helper**: **"You are a programming assistant specializing in [Language]. Provide code examples with comments. Explain your reasoning step by step."**',
            ],
            tip: 'A good SystemPrompt is specific and includes constraints. "You are a helpful assistant" is too vague. "You are a nutrition advisor for elderly patients. Only discuss food and nutrition. Limit responses to 200 words. Cite sources when possible." is much better.',
          },
          {
            title: 'How to pass the SystemPrompt in your code',
            instructions: [
              'When you call **ChatCompletion** (either directly or through your wrapper Server Action), set the **SystemPrompt** input parameter',
              'You can hardcode it as a string literal: **"You are a helpful assistant for [YourProject]..."**',
              'You can store it in a **Site Property** in your own module so you can change it at runtime without re-publishing',
              'You can even make it dynamic — build the string based on context, e.g.: **"You are assisting a patient named " + PatientName + ". Their care plan includes: " + CarePlanSummary**',
            ],
            important:
              'Do NOT put sensitive information in the SystemPrompt that you would not want the AI to potentially repeat. The AI may quote parts of the SystemPrompt in its response if the user asks cleverly.',
          },
        ],
      },

      // ── 7.6: Alternative — Consume via REST API (Different Environment) ──
      {
        id: '7.6',
        title: 'Alternative — Consume via REST API',
        summary:
          'If you are on a **different OutSystems environment** or prefer HTTP-based integration, you can consume the OpenAI wrapper through its exposed REST endpoint instead of **Ctrl+Q**.',
        steps: [
          {
            title: 'Get the REST API URL from the CareConnect team',
            instructions: [
              'Ask the CareConnect team for the **Swagger URL** of their **OpenAIService** exposed REST API',
              'The URL will look something like: **https://[environment-url]/CareConnect_OpenAIWrapper/rest/OpenAIService**',
              'You can also ask for the full Swagger/OpenAPI JSON URL, which is usually at: **https://[environment-url]/CareConnect_OpenAIWrapper/rest/OpenAIService/$swagger**',
            ],
            important:
              'The CareConnect team must have completed Section 6.6 (Expose as REST API) in their build guide for this to work. If they only built the Server Action without the exposed REST endpoint, this approach is not available — you must use Ctrl+Q on the same environment.',
          },
          {
            title: 'Consume the REST API in your module',
            instructions: [
              'Open your module in **Service Studio**',
              'Go to the **Logic** tab',
              'Expand **Integrations**',
              'Right-click **REST** > select **Consume REST API**',
              'Select **Add Single Method**',
              'Set **Name** to **OpenAIChatCompletion**',
              'Set **Method** to **POST**',
              'Set **URL** to the endpoint URL provided by the CareConnect team (e.g., **https://[environment-url]/CareConnect_OpenAIWrapper/rest/OpenAIService/chatcompletion**)',
            ],
          },
          {
            title: 'Configure the Request body',
            instructions: [
              'In the **Request** tab of the consumed method, paste this sample JSON:',
              '**{"UserMessage": "Hello", "SystemPrompt": "You are a helpful assistant.", "Model": "", "MaxTokens": 0, "Temperature": 0.7}**',
              'Click **OK** to let OutSystems generate the request Structure',
            ],
          },
          {
            title: 'Configure the Response body',
            instructions: [
              'In the **Response** tab, paste this sample JSON:',
              '**{"Success": true, "ResponseText": "Hello! How can I help?", "ErrorMessage": "", "TokensUsed": 25}**',
              'Click **OK** to let OutSystems generate the response Structure',
            ],
          },
          {
            title: 'Call the consumed REST API from your code',
            instructions: [
              'The consumed REST method now appears under **Logic** > **Integrations** > **REST**',
              'Drag it onto any Server Action flow, just like you would call a local Server Action',
              'Map the inputs: **UserMessage** (required), **SystemPrompt** (optional), **Model** (optional), **MaxTokens** (optional), **Temperature** (optional)',
              'The outputs will be: **Success**, **ResponseText**, **ErrorMessage**, **TokensUsed**',
            ],
            tip: 'The REST approach adds network latency since you are making an HTTP call between environments. The Ctrl+Q approach (same environment) is faster because it is a direct in-process call.',
          },
        ],
      },

      // ── 7.7: Troubleshooting ──
      {
        id: '7.7',
        title: 'Troubleshooting Common Issues',
        summary:
          'Solutions for the most common problems you may encounter when consuming the **CareConnect_OpenAIWrapper** module.',
        steps: [
          {
            title: 'Problem: ChatCompletion does not appear in Ctrl+Q',
            instructions: [
              '**Cause 1**: The wrapper module has not been published yet — ask the CareConnect team to **1-Click Publish** the module',
              '**Cause 2**: The **ChatCompletion** Server Action does not have **Public = Yes** — ask the CareConnect team to check this setting',
              '**Cause 3**: You are on a different environment — check the environment URL in the top-left corner of Service Studio',
              '**Fix**: After the CareConnect team fixes and re-publishes, close and re-open the **Ctrl+Q** dialog to refresh the module list',
            ],
          },
          {
            title: 'Problem: API call returns Success = False with an error message',
            instructions: [
              '**"OpenAI API call failed: 401 Unauthorized"** — the API key is not configured in Service Center. Ask the CareConnect team to set the **OpenAI_APIKey** Site Property',
              '**"OpenAI API call failed: 429 Too Many Requests"** — the API is being rate-limited. Wait a few seconds and try again, or ask the CareConnect team if other consumers are also hitting the API',
              '**"OpenAI API call failed: 400 Bad Request"** — this usually means a Structure mismatch in the wrapper. Report the exact error message to the CareConnect team',
              '**"OpenAI API call failed: [network error]"** — the OutSystems server cannot reach **api.openai.com**. This may be a firewall or proxy issue on the environment',
            ],
          },
          {
            title: 'Problem: Response is empty or gibberish',
            instructions: [
              'Check that your **SystemPrompt** is clear and specific — a vague prompt produces vague responses',
              'Check that **UserMessage** is not empty — sending an empty string will produce an unpredictable response',
              'Try increasing **MaxTokens** if the response seems cut off — the default is **1024** tokens which is about 750 words',
              'Try lowering **Temperature** to **0.2** if the response seems random or incoherent — lower temperature produces more focused responses',
            ],
          },
          {
            title: 'Problem: Response is slow (takes many seconds)',
            instructions: [
              'OpenAI API calls typically take **2-10 seconds** depending on the model and response length — this is normal',
              'Use **gpt-4o-mini** (the default) for faster responses — **gpt-4o** is slower but more capable',
              'Reduce **MaxTokens** to limit the response length — shorter responses are faster',
              'Add a loading indicator on your screen so the user knows the app is working (see the **IsLoading** pattern in Section 7.4)',
            ],
            tip: 'If you are calling the AI from a Client Action, the UI thread is not blocked — the user can still interact with the screen while waiting. But adding a visual loading indicator (spinner, "Thinking..." text) is strongly recommended for good UX.',
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // PHASE 8: Product & Party Data in UI
  // ──────────────────────────────────────────────
  {
    id: 8,
    title: 'Product & Party Data in UI',
    description:
      'Wire up the **Product** and **Party** data from **CC_Orchestration** into your **CareConnect_UI** Reactive Web App. You will add dependencies, create screens with Data Actions, build cascading dropdowns for the Product hierarchy, display Party person data, and test everything end-to-end.',
    timeEstimate: '2-3 hours',
    sections: [
      // ── 8.1: Architecture Overview ──
      {
        id: '8.1',
        title: 'Architecture Overview',
        summary:
          'Understand how data flows from the external SMULab APIs through CC_Orchestration Server Actions into your UI module.',
        steps: [
          {
            title: 'Understand the data flow',
            instructions: [
              'The **Product** and **Party** data lives on the **SMULab** environment — it is NOT stored in your CareConnect entities',
              'In **Phase 2** you consumed the SMULab REST APIs (**SMULab_Product**, **SMULab_Party**) into **CC_Orchestration**',
              'You then created wrapper **Server Actions** (SA_GetProductFamilies, SA_GetProductClasses, SA_GetProductTypes, SA_GetProductHierarchy) that call those APIs and return typed Lists',
              'Your **CareConnect_UI** module will use **Ctrl+Q (Manage Dependencies)** to import those Server Actions from **CC_Orchestration**',
              'On each UI screen, a **Data Action** (client-side fetch) calls the Server Action on screen load, and you bind the result to widgets (dropdowns, tables, lists)',
            ],
          },
          {
            title: 'Data flow diagram',
            instructions: [
              '**SMULab_Product API** (external) → **CC_Orchestration** (consumed REST + wrapper SA) → **CareConnect_UI** (Ctrl+Q dependency) → **Screen Data Action** → **UI Widget**',
              '**SMULab_Party API** (external) → **CC_Orchestration** (consumed REST + wrapper SA) → **CareConnect_UI** (Ctrl+Q dependency) → **Screen Data Action** → **UI Widget**',
            ],
            tip: 'Every time the screen loads or a Data Action is re-triggered, a real HTTP call goes to SMULab. This means the data is always fresh but the screen needs a loading indicator while waiting.',
          },
          {
            title: 'What you will build',
            instructions: [
              '**ProductCatalog** screen — displays the full Product hierarchy with cascading dropdowns (Family → Class → Type)',
              '**PartyLookup** screen — looks up a person by PartyId and displays their details',
              'Both screens will be accessible from the CareConnect UI navigation',
            ],
          },
        ],
      },

      // ── 8.2: Add Dependencies from CC_Orchestration ──
      {
        id: '8.2',
        title: 'Add Dependencies from CC_Orchestration',
        summary:
          'Use **Manage Dependencies (Ctrl+Q)** to import the Product and Party wrapper Server Actions and their Structures into **CareConnect_UI**.',
        steps: [
          {
            title: 'Open CareConnect_UI in Service Studio',
            instructions: [
              'Open **Service Studio** and double-click **CareConnect_UI** to open the module',
              'If you have not created CareConnect_UI yet, go to your **CareConnect** application > right-click > **Add Module** > Name: **CareConnect_UI**, Type: **Reactive Web App**',
            ],
          },
          {
            title: 'Open Manage Dependencies',
            instructions: [
              'Press **Ctrl+Q** — the **Manage Dependencies** dialog opens',
              'This dialog shows all modules on your environment that expose public Server Actions, Entities, or Structures',
            ],
          },
          {
            title: 'PREREQUISITE — Set Server Actions AND Structures to Public in CC_Orchestration',
            instructions: [
              'Before CareConnect_UI can import anything, the Server Actions AND their Structures must be **Public** in CC_Orchestration',
              'Open **CC_Orchestration** in Service Studio',
              'Go to **Logic** > **Server Actions** — for each of these 4 actions, click it and set **Public** = **Yes** in Properties:',
              '**SA_GetProductFamilies**',
              '**SA_GetProductClasses**',
              '**SA_GetProductTypes**',
              '**SA_GetProductHierarchy**',
              'Next, go to **Data** > **Structures** — for each of these 4 Structures, click it and set **Public** = **Yes**:',
              '**ProductFamily**',
              '**ProductClass**',
              '**ProductType**',
              '**ProductHierarchy**',
              '**Publish** CC_Orchestration (**Ctrl+Shift+P**)',
            ],
            important: 'If you set the Server Actions to Public but forget the Structures, you will get: **"Invalid Public Action — parameter is defined as a record of type X Structure that is not public."** You MUST set BOTH the actions AND the Structures they use to Public.',
          },
          {
            title: 'Add Product Server Actions',
            instructions: [
              'Switch to **CareConnect_UI** and press **Ctrl+Q**',
              'In the **Search** box at the top-left, type **CC_Orchestration**',
              'Click **CC_Orchestration** in the left panel to expand it',
              'Under **Server Actions**, check (tick the checkbox for) each of these:',
              '**SA_GetProductFamilies** — returns a list of product families',
              '**SA_GetProductClasses** — takes a ProductFamilyId, returns a list of product classes',
              '**SA_GetProductTypes** — takes a ProductClassId, returns a list of product types',
              '**SA_GetProductHierarchy** — returns the full hierarchy in one call',
            ],
            important: 'You MUST check the checkbox — just expanding the tree is not enough. The checkbox appears to the LEFT of each action name. A checked item shows a filled checkbox.',
          },
          {
            title: 'Add Party Server Actions (optional — skip if not built yet)',
            instructions: [
              '**SA_DoRegisterUser** and **SA_DoLoginUser** are complex composite actions built in **Phase 4**. They depend on the atomic services from Phase 3 (SA_CreateFamily, SA_CreateCaregiver, etc.)',
              'If you have NOT completed Phase 3 and Phase 4, **skip this step** — you do not need these actions for the Product Catalog or Party Lookup screens',
              'The only Party action you need for Phase 8 is **SA_GetPerson**, which you will create in Section 8.6 — it calls the consumed **GetPerson** REST method directly and does NOT depend on Phase 3 or 4',
              'If you HAVE completed Phase 4 and want to add them: still inside **Manage Dependencies** with **CC_Orchestration** expanded, check **SA_DoRegisterUser** and **SA_DoLoginUser** under Server Actions',
            ],
            tip: 'If you do not see a Server Action listed, it means CC_Orchestration has not been published with that action set to **Public = Yes**. Go back to CC_Orchestration, set the action\'s **Public** property to **Yes**, re-publish (**Ctrl+Shift+P**), then come back here and click **Refresh** in Manage Dependencies.',
          },
          {
            title: 'Add Structures (auto-imported)',
            instructions: [
              'When you check a Server Action, OutSystems **automatically imports** all Structures used by that action\'s inputs and outputs',
              'After checking the actions above, you should see these Structures appear under **CC_Orchestration > Structures**:',
              '**ProductFamily** — used by SA_GetProductFamilies output',
              '**ProductClass** — used by SA_GetProductClasses output',
              '**ProductType** — used by SA_GetProductTypes output',
              '**ProductHierarchy** — used by SA_GetProductHierarchy output',
              'You do NOT need to manually check Structures — they come along automatically',
            ],
          },
          {
            title: 'Apply and verify',
            instructions: [
              'Click **Apply** at the bottom-right of the Manage Dependencies dialog',
              'Wait for the refresh to complete (progress bar at the bottom)',
              'Click **Close**',
              'Verify: go to the **Logic** tab > **Server Actions** > you should see a **CC_Orchestration** folder containing the actions you imported',
              'Verify: go to the **Data** tab > **Structures** > you should see the imported Structures (ProductFamily, ProductClass, ProductType, etc.)',
            ],
            important: 'If you see red errors after applying, it usually means CC_Orchestration was not published. Go publish it first (Ctrl+Shift+P in CC_Orchestration), then retry Ctrl+Q in CareConnect_UI.',
          },
        ],
      },

      // ── 8.3: ProductCatalog Screen — Setup ──
      {
        id: '8.3',
        title: 'ProductCatalog Screen — Setup',
        summary:
          'Create the **ProductCatalog** screen, add Local Variables for the cascading dropdown state, and create Data Actions to fetch product data on screen load.',
        steps: [
          {
            title: 'Create the screen',
            instructions: [
              'Go to the **Interface** tab > **UI Flows** > **MainFlow** (or your main flow)',
              'Right-click **MainFlow** > **Add Screen**',
              'Select **Empty** template (do NOT pick a pre-built template — we want full control)',
              'Name: **ProductCatalog**',
              'Click **Create Screen**',
            ],
          },
          {
            title: 'Set the screen role (optional)',
            instructions: [
              'Click on the **ProductCatalog** screen name in the tree',
              'In the **Properties** panel on the right, find **Roles**',
              'If you want this screen accessible without login, check **Anonymous**',
              'If you want it restricted to logged-in users, check **Registered** (default)',
            ],
            tip: 'For testing purposes, set it to **Anonymous** so you can access it without logging in. You can restrict it later.',
          },
          {
            title: 'Add Local Variables for dropdown state',
            instructions: [
              'Double-click the **ProductCatalog** screen to open it in the editor',
              'In the **Widget Tree** panel (right side), right-click the screen name > **Add Local Variable**',
              'Create these 3 Local Variables one by one:',
              '**SelectedFamilyId** — Data Type: **Text**, Default Value: **""**',
              '**SelectedClassId** — Data Type: **Text**, Default Value: **""**',
              '**SelectedTypeId** — Data Type: **Text**, Default Value: **""**',
            ],
            important: 'These hold the currently selected dropdown value. When the user picks a Family, we store its ID in SelectedFamilyId. When they pick a Class, we store it in SelectedClassId. This is how cascading dropdowns work — the next dropdown depends on the previous selection.',
          },
          {
            title: 'Create Data Action: GetFamilies',
            instructions: [
              'In the **Widget Tree**, right-click the screen name > **Add Data Action**',
              'Name: **GetFamilies**',
              'The Data Action flow editor opens — you see a **Start** and **End** node',
              'From the **Logic** tab (left panel), expand **Server Actions** > **CC_Orchestration** > drag **SA_GetProductFamilies** onto the flow between **Start** and **End**',
              'No input parameters needed — SA_GetProductFamilies takes no inputs',
              'The output **SA_GetProductFamilies.ProductFamilies** is now available to bind to widgets',
            ],
            tip: 'Data Actions run **automatically when the screen loads**. You do not need to trigger them manually. Every time the screen opens, GetFamilies runs and fetches fresh data from the SMULab Product API.',
          },
          {
            title: 'Create Data Action: GetClasses',
            instructions: [
              'Right-click the screen name > **Add Data Action**',
              'Name: **GetClasses**',
              'The flow editor opens',
              'From the **Logic** tab, drag **SA_GetProductClasses** onto the flow between **Start** and **End**',
              'Click on the **SA_GetProductClasses** node — in **Properties**, set:',
              '**ProductFamilyId** = **SelectedFamilyId**',
              'Now click on the **GetClasses** Data Action name in the tree (the root, not the node inside)',
              'In **Properties**, find **Fetch** — change it from **At Start** to **Only on demand**',
            ],
            important: 'Setting Fetch to **Only on demand** means this Data Action does NOT run when the screen loads. It only runs when you explicitly call **GetClasses.Fetch()** in a Client Action. This is critical for cascading behavior — classes should only load AFTER the user picks a family.',
          },
          {
            title: 'Create Data Action: GetTypes',
            instructions: [
              'Right-click the screen name > **Add Data Action**',
              'Name: **GetTypes**',
              'Drag **SA_GetProductTypes** onto the flow between **Start** and **End**',
              'Click on the **SA_GetProductTypes** node — in **Properties**, set:',
              '**ProductClassId** = **SelectedClassId**',
              'Click on the **GetTypes** Data Action name in the tree',
              'In **Properties**, change **Fetch** to **Only on demand**',
            ],
          },
        ],
      },

      // ── 8.4: ProductCatalog Screen — Build the UI ──
      {
        id: '8.4',
        title: 'ProductCatalog Screen — Build the UI',
        summary:
          'Add a title, 3 cascading dropdowns (Family → Class → Type), and a results table to the ProductCatalog screen.',
        steps: [
          {
            title: 'Add the page title',
            instructions: [
              'Open the **ProductCatalog** screen in the editor (double-click it)',
              'From the **Toolbox** (left panel), drag an **Expression** widget into the **Content** area of the screen',
              'Set its **Value** to: **"Product Catalog"**',
              'In **Properties**, under **Style**, set **Style Classes** to **heading2** (or your theme\'s heading class)',
              'Alternatively, drag a **Text** widget and type **Product Catalog** — then bold it using the toolbar',
            ],
          },
          {
            title: 'Add the Family dropdown',
            instructions: [
              'From the **Toolbox**, drag a **Dropdown** widget below the title',
              'In the **Dropdown Properties** panel:',
              '**Variable** = **SelectedFamilyId** (the Local Variable you created in 8.3)',
              '**List** = **GetFamilies.List** (the output of your GetFamilies Data Action)',
              '**Options Text** = **ProductFamily.Name** (the display text for each option)',
              '**Options Value** = **ProductFamily.Id** (the value stored when selected)',
              'Add a **Label** widget above the Dropdown — set its text to **"Select Product Family"**',
            ],
            important: 'If you don\'t see **GetFamilies.List** in the dropdown suggestions, make sure you created the GetFamilies Data Action in step 8.3 and that it contains the SA_GetProductFamilies node.',
          },
          {
            title: 'Add On Change handler for Family dropdown',
            instructions: [
              'Click on the **Family Dropdown** widget',
              'In **Properties**, find **Events** > **On Change**',
              'Click **(New Client Action)** — this creates a new Client Action named **DropdownOnChange** (rename it to **OnFamilyChange**)',
              'The Client Action flow editor opens with **Start** and **End** nodes',
              'From the **Toolbox** (left panel under Client Actions), drag an **Assign** node after **Start**',
              'In the **Assign**, add one assignment:',
              '**SelectedClassId** = **""** (reset the class selection when family changes)',
              'Drag another **Assign** node after the first one:',
              '**SelectedTypeId** = **""** (also reset the type selection)',
              'From the left panel, find the **GetClasses** Data Action — drag its **Fetch** node onto the flow after the second Assign',
              'This calls **GetClasses.Fetch()** which re-runs the GetClasses Data Action with the new SelectedFamilyId',
              'Connect to **End**',
            ],
            tip: 'The full flow is: **Start** → **Assign** (reset SelectedClassId to "") → **Assign** (reset SelectedTypeId to "") → **GetClasses.Fetch** → **End**. When the user picks a new family, this clears the downstream selections and loads the classes for that family.',
          },
          {
            title: 'Add the Class dropdown',
            instructions: [
              'From the **Toolbox**, drag another **Dropdown** widget below the Family dropdown',
              'In **Dropdown Properties**:',
              '**Variable** = **SelectedClassId**',
              '**List** = **GetClasses.List**',
              '**Options Text** = **ProductClass.Name**',
              '**Options Value** = **ProductClass.Id**',
              'Add a **Label** widget above it — text: **"Select Product Class"**',
              'In the Dropdown **Properties**, find **Enabled** — set it to: **SelectedFamilyId <> ""**',
            ],
            important: 'Setting **Enabled** to **SelectedFamilyId <> ""** makes this dropdown disabled (greyed out) until the user selects a family. This prevents confusion — users can\'t pick a class before picking a family.',
          },
          {
            title: 'Add On Change handler for Class dropdown',
            instructions: [
              'Click on the **Class Dropdown** widget',
              'In **Properties** > **Events** > **On Change** > click **(New Client Action)**',
              'Rename to **OnClassChange**',
              'In the flow editor:',
              'Drag an **Assign** node after **Start**:',
              '**SelectedTypeId** = **""** (reset the type selection)',
              'Drag **GetTypes.Fetch** after the Assign node',
              'Connect to **End**',
              'Full flow: **Start** → **Assign** (reset SelectedTypeId to "") → **GetTypes.Fetch** → **End**',
            ],
          },
          {
            title: 'Add the Type dropdown',
            instructions: [
              'From the **Toolbox**, drag another **Dropdown** widget below the Class dropdown',
              'In **Dropdown Properties**:',
              '**Variable** = **SelectedTypeId**',
              '**List** = **GetTypes.List**',
              '**Options Text** = **ProductType.Name**',
              '**Options Value** = **ProductType.Id**',
              'Add a **Label** widget above it — text: **"Select Product Type"**',
              'In the Dropdown **Properties**, set **Enabled** to: **SelectedClassId <> ""**',
            ],
          },
          {
            title: 'Add a results display (optional)',
            instructions: [
              'Below the dropdowns, drag an **Expression** widget',
              'Set its **Value** to:',
              '**If(SelectedTypeId <> "", "Selected Type: " + SelectedTypeId, If(SelectedClassId <> "", "Selected Class: " + SelectedClassId, If(SelectedFamilyId <> "", "Selected Family: " + SelectedFamilyId, "No selection yet")))**',
              'This shows the current selection state as a simple text readout',
            ],
            tip: 'In a real app, you would use the SelectedTypeId to filter caregivers or create a care request. For now, this expression confirms the cascading dropdowns are working correctly.',
          },
          {
            title: 'Add an empty state message',
            instructions: [
              'Below each dropdown, you can add an **If** widget to show a message when no data is available:',
              'Drag an **If** widget below the Class dropdown',
              'Condition: **GetClasses.List.Empty and SelectedFamilyId <> ""**',
              'True branch: drag a **Text** widget — text: **"No product classes found for this family"**',
              'False branch: leave empty',
              'Repeat for the Type dropdown:',
              'Condition: **GetTypes.List.Empty and SelectedClassId <> ""**',
              'True branch: text: **"No product types found for this class"**',
            ],
          },
        ],
      },

      // ── 8.5: ProductCatalog Screen — Full Hierarchy Table ──
      {
        id: '8.5',
        title: 'ProductCatalog Screen — Full Hierarchy Table',
        summary:
          'Add a table below the dropdowns that displays the complete Product hierarchy from SA_GetProductHierarchy in a single view.',
        steps: [
          {
            title: 'Create Data Action: GetFullHierarchy',
            instructions: [
              'In the **Widget Tree**, right-click the **ProductCatalog** screen name > **Add Data Action**',
              'Name: **GetFullHierarchy**',
              'From the **Logic** tab, drag **SA_GetProductHierarchy** onto the flow between **Start** and **End**',
              'Leave **Fetch** as **At Start** (we want this to load automatically with the page)',
            ],
          },
          {
            title: 'Add a section heading',
            instructions: [
              'Below the dropdowns section, drag a **Text** widget',
              'Type: **Full Product Hierarchy**',
              'Bold it using the toolbar',
            ],
          },
          {
            title: 'Add a Table Records widget',
            instructions: [
              'From the **Toolbox**, drag a **Table Records** widget below the heading',
              'In the **Properties** panel:',
              '**Source** = **GetFullHierarchy.List** (the output of your Data Action)',
              'OutSystems auto-generates columns for each attribute of the **ProductHierarchy** Structure',
              'The columns depend on the Structure, but typically include: **ProductFamilyName**, **ProductClassName**, **ProductTypeName**, **ProductFamilyId**, **ProductClassId**, **ProductTypeId**',
            ],
            tip: 'If you only want to show names (not IDs), delete the ID columns: right-click a column header > **Delete Column**.',
          },
          {
            title: 'Clean up the table columns',
            instructions: [
              'Click on each **Header Cell** (the top row of the table) and rename them to friendly names:',
              '**Product Family** (for the ProductFamilyName column)',
              '**Product Class** (for the ProductClassName column)',
              '**Product Type** (for the ProductTypeName column)',
              'Delete any ID columns you don\'t want to display by right-clicking the column > **Delete Column**',
              'If no columns were auto-generated, manually add them:',
              'Right-click the Table Records > **Add Column** — then drag an **Expression** widget into the cell and set Value to **GetFullHierarchy.List.Current.ProductFamilyName** (repeat for each field)',
            ],
          },
          {
            title: 'Add empty state for the table',
            instructions: [
              'Drag an **If** widget above the Table Records widget',
              'Condition: **GetFullHierarchy.List.Empty**',
              'True branch: drag a **Text** widget — text: **"No product data found. Make sure you have seeded product data in Phase 5."**',
              'False branch: move the Table Records widget into this branch (drag it into the False placeholder)',
            ],
          },
          {
            title: 'Add a loading indicator',
            instructions: [
              'Drag an **If** widget above the table section',
              'Condition: **GetFullHierarchy.IsDataFetched = False**',
              'True branch: drag a **Text** widget — text: **"Loading product data..."**',
              'False branch: put the table (and its empty-state If) inside this branch',
              'This shows "Loading..." while the Data Action is fetching from the API',
            ],
            tip: '**IsDataFetched** is a built-in property of every Data Action. It is **False** while the fetch is in progress and **True** once it completes (successfully or with an error).',
          },
        ],
      },

      // ── 8.6: PartyLookup Screen — Setup & Build ──
      {
        id: '8.6',
        title: 'PartyLookup Screen — Setup & Build',
        summary:
          'Create a **PartyLookup** screen where a user can enter a PartyId and see that person\'s details from the SMULab Party API.',
        steps: [
          {
            title: 'Understand Party data access',
            instructions: [
              'In Phase 2, you consumed the **SMULab_Party** REST API which includes:',
              '**GetPerson** — takes a **PersonId** (also called PartyId) and returns the person\'s details (GivenName, FamilyName, Email, etc.)',
              '**AddPerson** — creates a new person in the Party system',
              '**GetDocumentTypes** — returns a list of document types',
              '**GetRoleTypes** — returns a list of role types',
              'The **SA_DoRegisterUser** and **SA_DoLoginUser** actions in CC_Orchestration already use AddPerson and GetPerson internally',
              'For this screen, we will call **GetPerson** from CC_Orchestration to look up a person by their PartyId',
            ],
          },
          {
            title: 'Ensure CC_Orchestration has a public SA_GetPerson action',
            instructions: [
              'Open **CC_Orchestration** in Service Studio',
              'Check if you already have a **SA_GetPerson** Server Action. If not, create one:',
              'Right-click **Server Actions** > **Add Server Action**',
              'Name: **SA_GetPerson**',
              'Set **Public** = **Yes** in Properties',
              'Add Input Parameter: **PersonId** — Data Type: **Text**, Is Mandatory: **Yes**',
              'Add Output Parameters (create each one):',
              '**GivenName** — Data Type: **Text**',
              '**FamilyName** — Data Type: **Text**',
              '**Email** — Data Type: **Text**',
              '**BirthDate** — Data Type: **Text**',
              '**Success** — Data Type: **Boolean**',
              '**ErrorMessage** — Data Type: **Text**',
            ],
          },
          {
            title: 'Build the SA_GetPerson flow',
            instructions: [
              'Open the **SA_GetPerson** Server Action flow',
              'Drag the consumed **GetPerson** REST method from **Logic** > **Integrations** > **REST** > **Party** onto the flow after **Start**',
              'Set its **PersonId** parameter = the input **PersonId**',
              'Drag an **Assign** node after **GetPerson**:',
              '**GivenName** = **GetPerson.Response.GivenName** (or the matching attribute from the Structure)',
              '**FamilyName** = **GetPerson.Response.FamilyName**',
              '**Email** = **GetPerson.Response.Email**',
              '**BirthDate** = **GetPerson.Response.BirthDate**',
              '**Success** = **True**',
              'Add an **Exception Handler** > catch **AllExceptions**:',
              'Assign **Success** = **False**, **ErrorMessage** = **AllExceptions.ExceptionMessage**',
              'Connect to **End**',
              '**Publish** CC_Orchestration (**Ctrl+Shift+P**)',
            ],
            important: 'The exact attribute names (GivenName, FamilyName, etc.) depend on how OutSystems parsed the Party Swagger. Check the auto-generated **GetPerson** response Structure under **Data** > **Structures** to see the exact names. Map them to your output parameters accordingly.',
          },
          {
            title: 'Add the dependency in CareConnect_UI',
            instructions: [
              'Switch to **CareConnect_UI** module',
              'Press **Ctrl+Q** (Manage Dependencies)',
              'Find **CC_Orchestration** > expand **Server Actions**',
              'Check **SA_GetPerson** (you may need to click **Refresh** if you just published CC_Orchestration)',
              'Click **Apply** > **Close**',
            ],
          },
          {
            title: 'Create the PartyLookup screen',
            instructions: [
              'Go to the **Interface** tab > **UI Flows** > **MainFlow**',
              'Right-click > **Add Screen** > **Empty** template',
              'Name: **PartyLookup**',
              'Click **Create Screen**',
              'In Properties, set **Roles** to **Anonymous** (for testing)',
            ],
          },
          {
            title: 'Add Local Variables',
            instructions: [
              'Right-click the **PartyLookup** screen > **Add Local Variable**',
              'Create these Local Variables:',
              '**SearchPartyId** — Data Type: **Text**, Default Value: **""** — the PartyId the user types in',
              '**PersonGivenName** — Data Type: **Text**, Default Value: **""** — filled after lookup',
              '**PersonFamilyName** — Data Type: **Text**, Default Value: **""**',
              '**PersonEmail** — Data Type: **Text**, Default Value: **""**',
              '**PersonBirthDate** — Data Type: **Text**, Default Value: **""**',
              '**LookupSuccess** — Data Type: **Boolean**, Default Value: **False**',
              '**LookupError** — Data Type: **Text**, Default Value: **""**',
              '**HasSearched** — Data Type: **Boolean**, Default Value: **False** — tracks whether the user has clicked Lookup yet',
            ],
          },
          {
            title: 'Build the screen UI — Input section',
            instructions: [
              'Double-click the **PartyLookup** screen to open the editor',
              'Drag a **Text** widget into the **Content** area — type **Party Person Lookup** and bold it (this is your page title)',
              'Below the title, drag an **Input** widget from the Toolbox',
              'In **Input Properties**: **Variable** = **SearchPartyId**',
              'Above the Input, drag a **Label** widget — text: **"Enter Party ID"**',
              'Below the Input, drag a **Button** widget — text: **"Lookup Person"**',
            ],
          },
          {
            title: 'Build the Lookup Client Action',
            instructions: [
              'Click on the **Lookup Person** button',
              'In **Properties** > **Events** > **On Click** > select **(New Client Action)**',
              'Rename the Client Action to **OnLookupClick**',
              'The flow editor opens. Build this flow:',
              '**Step 1**: Drag an **Assign** node after **Start**:',
              '**HasSearched** = **True**',
              '**Step 2**: Drag **SA_GetPerson** (from **Logic** > **Server Actions** > **CC_Orchestration**) after the Assign',
              'Set its **PersonId** parameter = **SearchPartyId**',
              '**Step 3**: Drag an **Assign** node after SA_GetPerson:',
              '**PersonGivenName** = **SA_GetPerson.GivenName**',
              '**PersonFamilyName** = **SA_GetPerson.FamilyName**',
              '**PersonEmail** = **SA_GetPerson.Email**',
              '**PersonBirthDate** = **SA_GetPerson.BirthDate**',
              '**LookupSuccess** = **SA_GetPerson.Success**',
              '**LookupError** = **SA_GetPerson.ErrorMessage**',
              'Connect to **End**',
              'Full flow: **Start** → **Assign** (HasSearched=True) → **SA_GetPerson** → **Assign** (copy outputs) → **End**',
            ],
          },
          {
            title: 'Build the screen UI — Results section',
            instructions: [
              'Below the Lookup button, drag an **If** widget',
              'Condition: **HasSearched**',
              'In the **True** branch:',
              'Drag another **If** widget — Condition: **LookupSuccess**',
              'In the **True** branch (success):',
              'Drag 4 **Expression** widgets, one for each field:',
              '**"Given Name: " + PersonGivenName**',
              '**"Family Name: " + PersonFamilyName**',
              '**"Email: " + PersonEmail**',
              '**"Birth Date: " + PersonBirthDate**',
              'In the **False** branch (error):',
              'Drag an **Expression** widget — Value: **"Error: " + LookupError**',
              'In the **False** branch of the outer If (HasSearched = False):',
              'Leave it empty, or drag a **Text** widget: **"Enter a Party ID above and click Lookup"**',
            ],
          },
        ],
      },

      // ── 8.7: Add Navigation Links ──
      {
        id: '8.7',
        title: 'Add Navigation Links',
        summary:
          'Add links or buttons on your **Home** screen (or common menu) so users can navigate to the ProductCatalog and PartyLookup screens.',
        steps: [
          {
            title: 'Add a link on the Home screen',
            instructions: [
              'Open your **Home** screen (or whichever screen is your main landing page)',
              'Drag a **Link** widget from the **Toolbox** into the content area',
              'In **Link Properties**:',
              '**Text** = **"Product Catalog"**',
              '**On Click** > **Destination** = **ProductCatalog** (select it from the screen dropdown)',
              'Drag another **Link** widget below it:',
              '**Text** = **"Party Lookup"**',
              '**On Click** > **Destination** = **PartyLookup**',
            ],
            tip: 'If you prefer Buttons instead of Links, drag a **Button** widget, set its **On Click** event to a **(New Client Action)**, and inside that Client Action use a **Destination** node (or **RedirectToURL**) to navigate to the target screen.',
          },
          {
            title: 'Add to the Menu (if using a menu web block)',
            instructions: [
              'If your application uses a **Menu** web block (common in OutSystems templates):',
              'Go to **Interface** > **UI Flows** > **Common** > **Menu**',
              'Open the Menu web block',
              'Add a new **Menu Item** or **Link** for **ProductCatalog**',
              'Add another for **PartyLookup**',
              'Set the **Destination** property of each to the corresponding screen',
              'If you are using a custom navigation bar, add the links there instead',
            ],
          },
        ],
      },

      // ── 8.8: Publish, Test & Troubleshoot ──
      {
        id: '8.8',
        title: 'Publish, Test & Troubleshoot',
        summary:
          'Publish **CareConnect_UI**, open it in the browser, and verify that Product and Party data loads correctly.',
        steps: [
          {
            title: 'Publish the module',
            instructions: [
              'In **CareConnect_UI**, press **Ctrl+Shift+P** to publish',
              'Wait for the green **"1-Click Publish completed"** message',
              'If you see errors, read them carefully — most common issues:',
              '**"Missing dependency"** — go back to Ctrl+Q and make sure all Server Actions are checked',
              '**"Unknown Server Action"** — CC_Orchestration may not be published; publish it first',
              '**"Type mismatch"** — check that you are using the correct Structure types from CC_Orchestration, not manually created ones',
            ],
          },
          {
            title: 'Open in browser',
            instructions: [
              'After publishing, click the **Open in Browser** button (blue globe icon) in Service Studio',
              'Or navigate directly to: **https://smuedu-dev.outsystemsenterprise.com/CareConnect_UI/ProductCatalog**',
              '(Replace with your actual environment URL if different)',
            ],
          },
          {
            title: 'Test the ProductCatalog screen',
            instructions: [
              'The **Family dropdown** should populate automatically on page load',
              'Select a family — the **Class dropdown** should become enabled and populate',
              'Select a class — the **Type dropdown** should become enabled and populate',
              'The **Full Hierarchy table** at the bottom should show all products',
              'If the Family dropdown is empty, it means no product data has been seeded — complete **Phase 5** first',
            ],
          },
          {
            title: 'Test the PartyLookup screen',
            instructions: [
              'Navigate to the **PartyLookup** screen',
              'Enter a valid **PartyId** (you can get one from a previous registration, or from the Party API Swagger UI)',
              'Click **Lookup Person**',
              'The person\'s details (GivenName, FamilyName, Email, BirthDate) should appear below',
              'If you get an error, check that the PartyId exists in the Party system',
            ],
          },
          {
            title: 'Troubleshooting: Dropdown is empty',
            instructions: [
              'Check that you seeded product data in **Phase 5** — open Swagger UI for CC_Orchestration and call **GET /GetProductFamilies**. If it returns an empty list, go back to Phase 5',
              'Check that the **ProductAPIKey** Site Property is set — go to **Service Center** > **Modules** > **CC_Orchestration** > **Site Properties** > verify **ProductAPIKey** has a value',
              'Check that the Data Action is wired correctly — open the **GetFamilies** Data Action and verify it contains the **SA_GetProductFamilies** node',
              'Check **Service Center** > **Monitoring** > **Errors** for any error logs from the REST call',
            ],
          },
          {
            title: 'Troubleshooting: Cascading dropdown does not update',
            instructions: [
              'Verify the **On Change** Client Action on the Family dropdown calls **GetClasses.Fetch()**',
              'Verify the **On Change** Client Action on the Class dropdown calls **GetTypes.Fetch()**',
              'Make sure the **GetClasses** Data Action has **Fetch** set to **Only on demand** (not At Start)',
              'Make sure the **GetTypes** Data Action has **Fetch** set to **Only on demand**',
              'Check that the **ProductFamilyId** parameter inside GetClasses is bound to **SelectedFamilyId** (not hardcoded)',
              'Check that the **ProductClassId** parameter inside GetTypes is bound to **SelectedClassId** (not hardcoded)',
            ],
          },
          {
            title: 'Troubleshooting: Party lookup returns error',
            instructions: [
              'Check that **SA_GetPerson** exists in CC_Orchestration and is set to **Public = Yes**',
              'Check that the **PersonId** you entered is a valid PartyId from the SMULab Party system',
              'Check **Service Center** > **Monitoring** > **Errors** for the actual error message from the Party API',
              'Verify the **GetPerson** consumed REST method under **Logic** > **Integrations** > **REST** > **Party** still has the correct Swagger URL',
              'If the Party API is returning 401/403, your API key or environment credentials may have changed',
            ],
          },
        ],
      },

      // ── 8.9: Common Gotchas & Checklist ──
      {
        id: '8.9',
        title: 'Common Gotchas & Checklist',
        summary:
          'A checklist of things to verify and common mistakes when wiring Product & Party data into the UI.',
        steps: [
          {
            title: 'Pre-flight checklist',
            instructions: [
              '**CC_Orchestration published?** — All Server Actions must be published before CareConnect_UI can import them via Ctrl+Q',
              '**Server Actions set to Public?** — Only actions with **Public = Yes** appear in Manage Dependencies. Check this in CC_Orchestration for each SA_Get* action',
              '**Structures set to Public?** — If a Server Action output uses a Structure (e.g., ProductFamily), that Structure MUST also be **Public = Yes**. Otherwise you get "Invalid Public Action — parameter is defined as a record of type X Structure that is not public"',
              '**ProductAPIKey Site Property set?** — Without this, all Product API calls return 401. Set it in Service Center, not Service Studio',
              '**Product data seeded?** — Run Phase 5 to create Families, Classes, and Types in SMULab. Without this, dropdowns are empty',
              '**Data Action Fetch mode correct?** — GetFamilies should be **At Start**. GetClasses and GetTypes should be **Only on demand**',
              '**On Change handlers wired?** — Each dropdown needs an On Change Client Action that calls the next level\'s .Fetch()',
            ],
          },
          {
            title: 'Common mistake: Using wrong Structure types',
            instructions: [
              'If you manually created Product Structures (e.g., **MyProductFamily**), they are DIFFERENT from the auto-imported Structures from CC_Orchestration',
              'Always use the Structures that come from **Manage Dependencies** — these match the Server Action output types exactly',
              'If you see **"Type mismatch"** errors, delete your manual Structures and re-import via Ctrl+Q',
            ],
          },
          {
            title: 'Common mistake: Data Action runs but list is empty',
            instructions: [
              'The Data Action ran successfully but returned an empty list — this is NOT an error',
              'It means the SMULab API returned no data for your query',
              'For **GetProductFamilies**: you haven\'t seeded data in Phase 5',
              'For **GetProductClasses**: the ProductFamilyId you passed has no classes',
              'For **GetProductTypes**: the ProductClassId you passed has no types',
              'Always check with Swagger first: open CC_Orchestration\'s Swagger UI and call the endpoint manually to confirm data exists',
            ],
          },
          {
            title: 'Common mistake: Forgetting to reset downstream selections',
            instructions: [
              'When the user changes the Family dropdown, you MUST reset **SelectedClassId** and **SelectedTypeId** to **""** in the On Change Client Action',
              'If you forget this, the Class and Type dropdowns will show stale data from the previous selection',
              'Similarly, when the user changes the Class dropdown, reset **SelectedTypeId** to **""**',
              'This is why the On Change handlers include Assign nodes that clear the downstream variables before calling .Fetch()',
            ],
          },
        ],
      },
    ],
  },
]
