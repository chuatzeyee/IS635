// Exam Build Playbook — generic, reusable OutSystems build reference for the
// open-book practical exam covering Sessions 1-6. NOT tied to any single
// assignment scenario. Speed-checklist first, then layer-by-layer reference.

export interface PlaybookStep {
  readonly title: string
  readonly instructions: readonly string[]
  readonly tip?: string
  readonly important?: string
}

export interface PlaybookSection {
  readonly id: string
  readonly title: string
  readonly summary: string
  readonly steps: readonly PlaybookStep[]
}

export interface PlaybookPhase {
  readonly id: number
  readonly title: string
  readonly description: string
  readonly timeEstimate: string
  readonly sections: readonly PlaybookSection[]
}

export const playbookPhases: readonly PlaybookPhase[] = [
  // ──────────────────────────────────────────────
  // PHASE 1: First 30 Minutes — Speed Checklist
  // ──────────────────────────────────────────────
  {
    id: 1,
    title: 'First 30 Min',
    description:
      'A fixed opening sequence that works for almost any "build an app" prompt. Read the question, model the data, scaffold the module, then fill in logic and UI. **Do these in order.**',
    timeEstimate: '~30 min',
    sections: [
      {
        id: '1.1',
        title: 'Read the prompt & extract the data model',
        summary:
          'Before clicking anything, turn the exam scenario into Entities, attributes, and relationships on paper (or a scratch screen).',
        steps: [
          {
            title: 'Decompose the scenario into nouns and verbs',
            instructions: [
              'Underline every **noun** in the prompt — these become **Entities** (e.g. Book, Member, Loan)',
              'Underline every **verb / action** — these become **Server Actions** or **Screen flows** (e.g. BorrowBook, ReturnBook)',
              'Identify **fixed value lists** (status, type, role) — these become **Static Entities**',
              'Sketch relationships: one-to-many = a foreign-key attribute (e.g. Loan has BookId + MemberId)',
            ],
            tip: 'Spend 5 honest minutes here. A correct data model makes the rest of the build fall into place; a wrong one costs you the whole exam.',
            important:
              'Map marks to effort: if the rubric weights "working CRUD UI" heavily, do not over-engineer services. Build what is graded.',
          },
          {
            title: 'Decide the architecture shape',
            instructions: [
              'Simple CRUD app → **one Reactive Web App module**, entities + screens together (fastest)',
              'If the prompt explicitly asks for **services / REST / reuse** → split into **Service module(s)** + a **Reactive Web App** UI module',
              'Recall SOA layering: **UI > Composite > Atomic > Wrapper** (top to bottom)',
              'Atomic service = **NOUN**, owns data, never calls others. Composite = **VERB**, orchestrates, owns no data',
            ],
            important:
              'Only Atomic Services own data (Public = No on entities, exposed via REST). The UI module should only touch the User table directly — everything else via REST.',
          },
        ],
      },
      {
        id: '1.2',
        title: 'Scaffold the module',
        summary: 'Create the app + module, set the theme, and get a publishable shell up fast.',
        steps: [
          {
            title: 'Create app & module',
            instructions: [
              'Service Studio → **New Application** → name it per the prompt',
              'Pick **Reactive Web App** for a UI app (SPA, enables Client Actions/Variables)',
              'Pick **Service** module for headless backend (entities + REST, no Interface tab)',
              'Click **1-Click Publish** immediately to confirm the empty shell builds',
            ],
            tip: 'Publish early and often. A green publish after each layer means you always have a working fallback to submit.',
          },
        ],
      },
      {
        id: '1.3',
        title: 'Build order that always works',
        summary: 'The reliable sequence: Data → Logic → Interface → (Integration/Processes if asked).',
        steps: [
          {
            title: 'Follow the layer order',
            instructions: [
              '1. **Data**: create Entities, Static Entities, set attributes & relationships; bootstrap from Excel if data is given',
              '2. **Logic**: Server Actions for create/update/business rules; Aggregates to read',
              '3. **Interface**: Screens via Form Accelerator + list/detail; wire navigation',
              '4. **Integration** (only if asked): expose REST API, or consume an external/SMULab API',
              '5. **Processes** (only if asked): Timer for scheduled/batch work, Process for workflows',
              'Publish + test after each layer',
            ],
            important:
              'Do NOT start with the UI. Without entities, the Form Accelerator and aggregates have nothing to bind to. Data first, always.',
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // PHASE 2: Data Layer
  // ──────────────────────────────────────────────
  {
    id: 2,
    title: 'Data Layer',
    description:
      'Entities, Static Entities, Structures, and the data-storage concepts (Client Variable vs Site Property). The database (MSSQL) and CRUD are auto-generated — you just model.',
    timeEstimate: 'varies',
    sections: [
      {
        id: '2.1',
        title: 'Create an Entity',
        summary: 'Entities = database tables. Defining one auto-creates the ER diagram, data model, and CRUD methods.',
        steps: [
          {
            title: 'Add and configure the entity',
            instructions: [
              '**Data** tab → right-click **Entities** → **Add Entity**',
              'Keep the **Id** attribute, set **Is AutoNumber = Yes** (auto-increment PK)',
              'Right-click entity → **Add Entity Attribute** for each field',
              'Set each attribute **Data Type** (Text, Integer, Decimal, Date Time, Boolean, Email, etc.), **Length**, **Is Mandatory**, **Default Value**',
              'For a relationship, add an attribute of type **Entity Identifier** (e.g. BookId → Book Identifier) — this is the foreign key',
            ],
            tip: 'CRUD (CreateX, GetX, UpdateX, DeleteX, CreateOrUpdateX) and the ER diagram appear automatically — no SQL or DB setup needed.',
          },
          {
            title: 'Add an index (if filtering/searching on a column)',
            instructions: [
              'Right-click the entity → **Add Index** → pick the attribute(s)',
              'Use for columns you search or sort by frequently to keep aggregates fast',
            ],
          },
        ],
      },
      {
        id: '2.2',
        title: 'Static Entity (read-only lookup / enum)',
        summary: 'Fixed reference values like statuses, roles, types. Only Get methods — no Create/Update/Delete.',
        steps: [
          {
            title: 'Create the static entity',
            instructions: [
              '**Data** tab → right-click **Entities** → **Add Static Entity**',
              'Right-click → **Add Record** for each fixed value',
              'Set the **Label** (e.g. Available, Borrowed, Overdue)',
              'Reference it from a normal entity via an attribute of that Static Entity type',
            ],
            important:
              'Static Entities are READ-ONLY (Get only). Commonly tested. Use them for enumerations, NOT for data users can edit.',
          },
        ],
      },
      {
        id: '2.3',
        title: 'Bootstrap data from Excel',
        summary: 'Populate an entity with starter rows if the exam supplies a spreadsheet.',
        steps: [
          {
            title: 'Import from Excel',
            instructions: [
              'Make column headers in the Excel file match the entity attribute names',
              'Right-click the entity → **Import Data from Excel** (or drop the file into **Resources** and bootstrap)',
              'Map columns to attributes if prompted',
              'Publish — entity is now populated; the Excel file lands in **Resources** and can be deleted after',
            ],
          },
        ],
      },
      {
        id: '2.4',
        title: 'Structure (developer-defined data type)',
        summary: 'A Structure becomes a JSON Object in REST; a List of Structures becomes a JSON Array.',
        steps: [
          {
            title: 'Create a structure',
            instructions: [
              '**Data** tab → right-click **Structures** → **Add Structure**',
              'Add attributes with their data types',
              'Set **Name in JSON** when the API consumer expects specific field names (attributes are **case-sensitive**)',
              'Use as the input/output of REST endpoints and Server Actions',
            ],
            tip: 'Structure = JSON Object. List of Structures = JSON Array. If a REST call fails on field names, check Name in JSON casing.',
          },
        ],
      },
      {
        id: '2.5',
        title: 'Client Variable vs Site Property',
        summary: 'Two storage mechanisms that are opposites — know which is which.',
        steps: [
          {
            title: 'Pick the right one',
            instructions: [
              '**Client Variable**: browser-side, primitive types only (Integer/Boolean/Text), visible to **Client Actions only**, NOT persisted across machines',
              '**Site Property**: server-side, application scope, NOT visible to Client Actions, runtime-changeable via **Service Center** (no republish)',
              'Serialize a Structure to **Text** (JSON Serialize) before storing it in a Client Variable',
              'Create: right-click the module/Interface for Client Variable; **Data > Site Properties** for Site Property',
            ],
            important:
              'Client Variable = client-side, Client Actions only. Site Property = server-side, NOT Client Actions. They are opposites — a classic exam contrast.',
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // PHASE 3: Logic Layer
  // ──────────────────────────────────────────────
  {
    id: 3,
    title: 'Logic Layer',
    description:
      'Server Actions (C# .NET) and Client Actions (React.JS), Aggregates, For Each loops, If/Switch, and built-in functions. This is where business rules live.',
    timeEstimate: 'varies',
    sections: [
      {
        id: '3.1',
        title: 'Server Action vs Client Action',
        summary: 'Server = C# .NET on the server. Client = React.JS in the browser. Some elements are exclusive to each.',
        steps: [
          {
            title: 'Know what runs where',
            instructions: [
              '**Server-only** elements: **Aggregate**, SQL, Record List ⇄ Excel, Comment, Send Email',
              '**Client-only** elements: **Message**, Run Client Action, **Refresh Data**, **Destination**, Download, JavaScript',
              '**Shared**: If, Switch, For Each, Assign, JSON Serialize/Deserialize, Exception Handler, Raise Exception',
              'Create: **Logic** tab → right-click **Server Actions** / **Client Actions** → Add',
            ],
            important:
              'Aggregate is SERVER-side only. Message / Destination / Download / JavaScript are CLIENT-side only. This split is heavily tested.',
          },
        ],
      },
      {
        id: '3.2',
        title: 'Read data with an Aggregate',
        summary: 'The standard way to query an entity (a SELECT that returns a List).',
        steps: [
          {
            title: 'Build the aggregate',
            instructions: [
              'Inside a Server Action (or screen data) → add an **Aggregate**',
              'Drag the source **Entity** into it',
              'Add **Filters** (where clauses), **Sorts**, and **Joins** to other entities for related data',
              'Reference results as the aggregate output List (e.g. GetBooks.List)',
            ],
            tip: 'Join entities inside one aggregate instead of looping with nested queries — far faster and cleaner.',
          },
        ],
      },
      {
        id: '3.3',
        title: 'For Each loop',
        summary: 'Iterate a List. Must have one outgoing Cycle path and one or more return paths.',
        steps: [
          {
            title: 'Loop safely',
            instructions: [
              'Add a **For Each**, set its **List** property',
              'Access the current item as **List.Current** inside the loop',
              'Useful List attributes: **Current, EOF, BOF, CurrentRowNumber, Length, Empty**',
              'Check **List.Empty** before iterating to avoid wasted work',
              'Use the **Debugger View** to inspect Current values while testing',
            ],
            tip: 'Memorize the 6 List attributes: Current, EOF, BOF, CurrentRowNumber, Length, Empty.',
          },
        ],
      },
      {
        id: '3.4',
        title: 'Branching & built-in functions',
        summary: 'If / Switch for control flow; built-in function categories for transformations.',
        steps: [
          {
            title: 'Control flow + functions',
            instructions: [
              '**If**: two paths (True / False) on a Boolean expression',
              '**Switch**: 2+ paths on multiple Boolean expressions',
              'Function categories: **Math, Numeric, Text, Date and Time, Conversion, Environment** (Math and Numeric are separate)',
              'Make a reusable **User Function**: set a Client Action property **Function = Yes** — now usable in the Expression Editor',
            ],
            important:
              'NOT valid function categories: Machine Learning, Blockchain, Graphics. A User Function is just a Client Action with Function = Yes (no code).',
          },
          {
            title: 'Handle errors',
            instructions: [
              'Wrap risky logic; add an **Exception Handler** to catch and recover',
              'Use **Raise Exception** to throw a meaningful error from the flow',
              'Set a module **Global Exception Handler (OnException)** to catch anything unhandled',
            ],
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // PHASE 4: Interface Layer
  // ──────────────────────────────────────────────
  {
    id: 4,
    title: 'Interface Layer',
    description:
      'Reactive Web screens, the Form Accelerator for instant CRUD forms, list/detail patterns, navigation, and validation. Fastest marks-per-minute in most exams.',
    timeEstimate: 'varies',
    sections: [
      {
        id: '4.1',
        title: 'Reactive Web app setup',
        summary: 'SPA: one page load, no reloads, Client Actions enabled. The modern default.',
        steps: [
          {
            title: 'Configure the UI module',
            instructions: [
              'Use a **Reactive Web App** module (enables Client Actions + Client Variables)',
              'Set **Default Screen** (usually Home), pick a **Layout**: **LayoutTopMenu** or **LayoutSideMenu**',
              'Apply the **Theme** if a custom one is provided',
              'Traditional Web = legacy, reloads every navigation, NO Client Actions/Variables — avoid unless told',
            ],
            tip: 'LayoutTopMenu and LayoutSideMenu are the two layouts you will actually use.',
          },
        ],
      },
      {
        id: '4.2',
        title: 'Instant CRUD with the Form Accelerator',
        summary: 'Drag an entity onto a screen and OutSystems generates the whole form for you.',
        steps: [
          {
            title: 'Generate list + detail screens',
            instructions: [
              '**Interface** tab → drag an **Entity** onto the screen tree → OutSystems offers to create **list** and **detail** screens',
              'Or drag an entity into a screen MainContent placeholder → **Form Accelerator** generates the form bound to that entity',
              'It wires Save/Create/Update logic to the entity CRUD automatically',
              'Adjust widgets, labels, and which columns show',
            ],
            tip: 'The Form Accelerator is the single biggest time-saver in the exam. Use it before hand-building any form.',
          },
        ],
      },
      {
        id: '4.3',
        title: 'Navigation, feedback & validation',
        summary: 'Move between screens, show messages, and validate input.',
        steps: [
          {
            title: 'Wire interactions',
            instructions: [
              '**Destination** (client-side): redirect to another Screen, passing input parameters',
              '**Message**: show Success / Info / Error feedback to the user',
              '**Refresh Data**: re-fetch a screen aggregate after a create/update so the list updates',
              'Validation: set **Is Mandatory** on inputs; use **If** + Message, or built-in form validation, to block bad input',
              'Add a button → **On Click** → run a Client Action (which can Run Server Action for server logic)',
            ],
            important:
              'After creating/updating a record, call Refresh Data on the list aggregate or the UI will show stale data.',
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // PHASE 5: Integration (REST) — only if asked
  // ──────────────────────────────────────────────
  {
    id: 5,
    title: 'Integration (REST)',
    description:
      'Expose your service as a REST API, or consume an external / SMULab API. Swagger docs are auto-generated and act as the service contract. Only do this if the prompt asks for services / integration.',
    timeEstimate: 'if required',
    sections: [
      {
        id: '5.1',
        title: 'Expose a REST API',
        summary: 'Publish your service methods as REST endpoints with auto-generated Swagger.',
        steps: [
          {
            title: 'Create the exposed endpoint',
            instructions: [
              '**Logic** tab → right-click **Integrations > REST** → **Expose REST API**',
              'Add a **REST API Method**, set the **HTTP Method** (GET to read, POST to create, PUT to update, DELETE)',
              'Define input/output using **Structures** (or entity records)',
              'For GET query params: set the parameter **Receive In = URL** (params not in the URL path become query string)',
              'Implement the method logic (call your Server Actions / Aggregates)',
              'Swagger documentation is generated automatically as the service contract',
            ],
            important:
              'For other modules to consume your action, set the Server Action AND its output Structures/Entities to **Public = Yes**. Forgetting the Structure/Entity is the #1 "Invalid Public Action" error.',
          },
        ],
      },
      {
        id: '5.2',
        title: 'Consume a REST API',
        summary: 'Call an external service (or another team module / SMULab utility).',
        steps: [
          {
            title: 'Add and call the consumed API',
            instructions: [
              '**Logic** tab → right-click **Integrations > REST** → **Consume REST API**',
              'Paste the Swagger URL or a sample request, or add methods manually',
              'Set headers (e.g. an **API Key** header if the SMULab utility needs one)',
              'OutSystems generates the request/response Structures',
              'Call the generated action from a Server Action and map the response',
            ],
            tip: 'SMULab Wrapper Services (Notification, RabbitMQ, Party, Product) are consumable REST APIs — some need an API Key registered for your team.',
          },
          {
            title: 'Consume across your own modules (Manage Dependencies)',
            instructions: [
              'In the consuming module: **Manage Dependencies** (Ctrl+Q)',
              'Pick the producer module, tick the Public Server Actions / Entities / Structures you need',
              'If something is missing from the list, it was not set **Public = Yes** in the producer',
            ],
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // PHASE 6: Processes & Timers — only if asked
  // ──────────────────────────────────────────────
  {
    id: 6,
    title: 'Processes & Timers',
    description:
      'Timers for scheduled / batch work; Processes for multi-step business workflows. Only build these if the prompt explicitly calls for background or workflow logic.',
    timeEstimate: 'if required',
    sections: [
      {
        id: '6.1',
        title: 'Create a Timer (scheduled batch job)',
        summary: 'Periodic server-side logic run by the Scheduler Service. Up to 3 concurrent threads.',
        steps: [
          {
            title: 'Add the timer',
            instructions: [
              '**Logic** tab → right-click **Timers** → **Add Timer**',
              'Set the **Schedule** (e.g. every N minutes, a time, or "When Published")',
              'Set its **Action** to a **Server Action** that holds the batch logic',
              'Use **Site Properties** for connection/config values the timer needs',
              'Publish; verify runs in **Service Center**',
            ],
            tip: 'Timer use cases: daily email batches, archiving, polling a queue. Process use cases: approvals, multi-step workflows.',
          },
        ],
      },
      {
        id: '6.2',
        title: 'Create a Process (business workflow)',
        summary: 'Multi-step workflow with human + automatic steps. Up to 20 concurrent threads.',
        steps: [
          {
            title: 'Build the process flow',
            instructions: [
              '**Processes** tab → right-click **Processes** → **Add Process**',
              'Toolkit: **Start, End, Automatic Activity** (server logic), **Human Activity** (waits for a user), **Decision** (branch), **Wait** (timeout/DB event), **Execute Process** (sub-process), **Conditional Start** (DB-event trigger)',
              'Connect elements to define the flow; build Automatic Activity logic inside',
              'Launch the process from a Server Action',
              'To synchronize parallel paths: wrap them in a sub-process via **Execute Process** — parent resumes only when all finish',
            ],
            important:
              'Processes: 20 threads, human + conditional steps. Timers: 3 threads, scheduled batch. Neither OutSystems nor Pega is BPMN-compliant.',
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // PHASE 7: Pre-Submit Checklist
  // ──────────────────────────────────────────────
  {
    id: 7,
    title: 'Pre-Submit',
    description:
      'Final pass before time runs out. Tick these off, then make a backup.',
    timeEstimate: 'last 10 min',
    sections: [
      {
        id: '7.1',
        title: 'Final verification',
        summary: 'Make sure it publishes, runs, and meets the rubric.',
        steps: [
          {
            title: 'Tick every box',
            instructions: [
              'Does it **1-Click Publish** with no errors?',
              'Open the app — do the core flows from the prompt actually work end to end?',
              'Re-read the question: have you covered every explicit deliverable / marked item?',
              'CRUD: can you create, read, update, delete the main entity from the UI?',
              'If REST was required: does Swagger load and a test call return data?',
              'Any **Public = Yes** dependencies resolved (no Invalid Public Action errors)?',
            ],
            important:
              'A partly-working app that publishes beats a "complete" app that does not publish. Keep the last green publish safe.',
          },
          {
            title: 'Backup your work (OAP)',
            instructions: [
              'From the OutSystems home page → click your application → **Download** to save an **OAP** file',
              'Submit per the exam instructions (eLearn / specified location)',
              'If the environment misbehaves, the OAP is your recovery point',
            ],
            tip: 'Personal environments can be recycled — download the OAP as your safety net before you walk out.',
          },
        ],
      },
    ],
  },
]
