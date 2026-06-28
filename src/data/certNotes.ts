export interface NoteTable {
  readonly headers: readonly string[]
  readonly rows: readonly (readonly string[])[]
}

export interface NoteBlock {
  readonly kind: 'text' | 'bullets' | 'table' | 'tip' | 'warn'
  readonly text?: string
  readonly items?: readonly string[]
  readonly table?: NoteTable
}

export interface CertNote {
  readonly id: string
  readonly title: string
  readonly summary: string
  readonly blocks: readonly NoteBlock[]
}

// Inline emphasis: wrap text in **double asterisks** to bold/mono it.
export const certNotes: readonly CertNote[] = [
  {
    id: 'pk-fk',
    title: 'Primary Key (PK) & Foreign Key (FK)',
    summary: 'How rows are uniquely identified and how two Entities link together.',
    blocks: [
      {
        kind: 'text',
        text: 'A **Primary Key (PK)** is the column that uniquely identifies each row in a table. No two rows share the same PK, and it is never empty. In OutSystems every Entity automatically gets a PK named **Id** — an auto-numbered Long Integer the platform assigns (1, 2, 3…). You never create it.',
      },
      {
        kind: 'text',
        text: 'A **Foreign Key (FK)** is a column in one Entity that stores the PK value of a row in another Entity — that is how two tables link. In OutSystems you add an FK by adding a **Reference attribute** (attribute whose Data Type is another Entity).',
      },
      {
        kind: 'bullets',
        items: [
          '**Parent** = the Entity whose PK is pointed to (e.g. Order).',
          '**Child** = the Entity holding the FK that points out (e.g. OrderItem.OrderId).',
          'One parent → many children = a **one-to-many** relationship.',
          'The FK literally holds the parent PK value copied into the child row.',
          'Adding a Reference attribute also auto-creates a **non-unique index** on it for fast lookups.',
        ],
      },
      {
        kind: 'tip',
        text: 'Mental model: OrderItem.OrderId = 2 means "this item belongs to the Order whose Id is 2." Joins/aggregates follow the FK back to the parent.',
      },
      {
        kind: 'warn',
        text: 'A **Unique Index** is NOT the same as a PK. The PK (Id) is auto-created; you add a Unique Index yourself (e.g. on Email) to forbid duplicate values on a non-PK column.',
      },
    ],
  },
  {
    id: 'delete-rules',
    title: 'Delete Rules',
    summary: 'What happens to child records when the parent they reference is deleted.',
    blocks: [
      {
        kind: 'text',
        text: 'A Delete Rule lives on the **Reference (FK) attribute** of the child Entity. It answers: "When someone deletes the parent record, what happens to the children pointing at it?" There are exactly **3** rules, and **Protect is the default**.',
      },
      {
        kind: 'table',
        table: {
          headers: ['Rule', 'When parent is deleted…', 'Result'],
          rows: [
            ['Protect (default)', 'Blocks the delete while any child references it', 'Delete fails / integrity error — no orphans'],
            ['Delete', 'Cascades — deletes the child records too', 'Parent and all children removed together'],
            ['Ignore', 'Deletes the parent, leaves children untouched', 'Children become orphans (FK points at nothing)'],
          ],
        },
      },
      {
        kind: 'bullets',
        items: [
          '**Protect** → safest. Forces you to remove/reassign children first. A "referential integrity" error on delete means the rule is Protect.',
          '**Delete** → convenient cascade (e.g. delete a Cart → its CartLines vanish), but easy to wipe more than intended.',
          '**Ignore** → fastest, no checks; use only when orphans are acceptable (e.g. an audit/log row keeping a UserId after the user is gone).',
        ],
      },
      {
        kind: 'warn',
        text: 'There is **NO "Set Null"** Delete Rule in OutSystems — only Protect / Delete / Ignore. "Set Null" is a common distractor. Also: Delete Rule (what happens on parent delete) is separate from Mandatory (whether the FK can be empty).',
      },
      {
        kind: 'tip',
        text: 'Memory hook from the child\'s view when the parent dies: Protect = "stop, don\'t delete it"; Delete = "take me with you"; Ignore = "leave me (orphan)."',
      },
    ],
  },
  {
    id: 'entities-static-structures',
    title: 'Entity vs Static Entity vs Structure',
    summary: 'Three data shapes — which is persisted, which is fixed, which is in-memory.',
    blocks: [
      {
        kind: 'table',
        table: {
          headers: ['Type', 'Persisted in DB?', 'Runtime CRUD?', 'Use for'],
          rows: [
            ['Entity', 'Yes (a table)', 'Create / Read / Update / Delete', 'Live application data (Orders, Customers)'],
            ['Static Entity', 'Yes (fixed records)', 'Read only — only a Get action', 'Fixed lookup/enumeration lists (Status, CareType)'],
            ['Structure', 'No (in-memory only)', 'N/A — just a data shape', 'API payloads, passing grouped data between actions'],
          ],
        },
      },
      {
        kind: 'bullets',
        items: [
          '**Static Entity** records are defined at **design time** and behave like an enumeration; they expose only a **Get** action (no Create/Update/Delete).',
          'Static Entities CAN have extra attributes (e.g. a Label or Order), filled per record in the design-time table.',
          '**Structure** maps to no database table — used for in-memory composite data (e.g. deserialized JSON).',
          'Both Entities and Structures can be used as the Data Type of variables and Lists.',
        ],
      },
    ],
  },
  {
    id: 'aggregates',
    title: 'Aggregates & Data Fetching',
    summary: 'The visual SELECT — where it runs and how filters/joins behave.',
    blocks: [
      {
        kind: 'bullets',
        items: [
          'An **Aggregate** executes on the **server** (it queries the database); the browser cannot query the DB directly.',
          'Multiple filters are combined with logical **AND** — a record must satisfy every filter. For OR, write one filter expression using the `or` operator.',
          'Join types: **With (inner)** returns only matched rows; **With or Without (left)** keeps the source rows even when the joined side has no match.',
          'The Aggregate outputs a **List** plus a **.Count**; **Max Records** limits how many rows are fetched.',
          'On a Reactive Screen, an Aggregate fetched in the screen runs its query, then **OnAfterFetch** runs once the data returns.',
          'Use **Test Values** in the editor to preview results at design time.',
        ],
      },
      {
        kind: 'warn',
        text: 'Aggregate is **server-side only** — it is not available in a Client Action. Common exam trap.',
      },
    ],
  },
  {
    id: 'screen-lifecycle',
    title: 'Screen / Block Lifecycle Events',
    summary: 'Which client-side event runs when — and where to put init logic.',
    blocks: [
      {
        kind: 'table',
        table: {
          headers: ['Event', 'When it runs', 'Typical use'],
          rows: [
            ['OnInitialize', 'Once, before the first render', 'Initialize local variables'],
            ['OnRender', 'On initial render AND every re-render', 'React to variable changes each paint'],
            ['OnAfterFetch', 'After a screen Aggregate/Data Action returns', 'Post-process fetched data'],
            ['OnParametersChanged', 'When an input parameter value changes', 'Refresh a Block when its inputs change'],
          ],
        },
      },
      {
        kind: 'tip',
        text: 'OnInitialize = once (init vars). OnRender = every UI update. Don\'t put one-time setup in OnRender — it fires repeatedly.',
      },
    ],
  },
  {
    id: 'client-server-logic',
    title: 'Client vs Server Actions',
    summary: 'Server = C#/.NET, Client = React/JS — which elements live where.',
    blocks: [
      {
        kind: 'bullets',
        items: [
          '**Server Actions** emit C# .NET and run on the server; **Client Actions** emit React.JS and run in the browser.',
          '**Server-only** elements: Aggregate, SQL, Record List ⇆ Excel, Send Email, Comment.',
          '**Client-only** elements: Message, Destination, Download, JavaScript, Refresh Data.',
          '**Shared** by both: If, Switch, For Each, Assign, JSON Serialize/Deserialize, Exception Handler, Raise Exception, Run Server Action.',
          'A Client Action can call a Server Action via **Run Server Action** (a round trip to the server).',
        ],
      },
      {
        kind: 'warn',
        text: '**Aggregate is SERVER-only**; **Message is CLIENT-only**. These two are the most-tested placements.',
      },
    ],
  },
  {
    id: 'exceptions',
    title: 'Exception Handling & Debugging',
    summary: 'Scope of an Exception Handler and the catch-all hierarchy.',
    blocks: [
      {
        kind: 'bullets',
        items: [
          'An **Exception Handler** catches only exceptions raised **within the scope of the flow that contains it** — not other flows/screens.',
          '**AllExceptions** is the most generic handler; it catches anything not caught by a more specific handler in the same flow.',
          'Specific handlers (e.g. a User Exception type) take priority over AllExceptions.',
          '**Raise Exception** throws an exception from the current flow (e.g. to abort and roll back).',
          'Unhandled exceptions surface in **Service Center → Monitoring → Errors**; use the debugger + breakpoints in Service Studio to step through logic.',
        ],
      },
      {
        kind: 'tip',
        text: 'Order matters: put specific exception handlers first, AllExceptions last as the safety net.',
      },
    ],
  },
  {
    id: 'variables-scope',
    title: 'Variables & Scope',
    summary: 'Local, Input, and Session/Client variables — lifetime and reach.',
    blocks: [
      {
        kind: 'table',
        table: {
          headers: ['Variable', 'Scope / lifetime', 'Notes'],
          rows: [
            ['Local Variable', 'One action or screen execution', 'Reset each run; not shared'],
            ['Input Parameter', 'Passed into an action / screen / block', 'Read-only convention; drives OnParametersChanged'],
            ['Session Variable', 'Whole user session, server-side', 'e.g. logged-in user id'],
            ['Client Variable', 'Persisted in the browser per device', 'Survives navigation; good for lightweight client state'],
          ],
        },
      },
      {
        kind: 'bullets',
        items: [
          'Local Variables live only for one execution — use them for temporary working values.',
          'Aggregates on a screen are cached client-side after fetch; re-running needs **Refresh Data**.',
        ],
      },
    ],
  },
  {
    id: 'indexes',
    title: 'Indexes & Uniqueness',
    summary: 'Speeding up queries and enforcing no-duplicates.',
    blocks: [
      {
        kind: 'bullets',
        items: [
          'An **Index** speeds up queries that filter or sort on the indexed attribute(s).',
          'A **Unique Index** additionally enforces that the value(s) cannot repeat — the way to guarantee e.g. no two Customers share an Email.',
          'Marking an attribute **Mandatory** only forbids null — it does NOT prevent duplicates.',
          'The Email Data Type only validates format, not uniqueness.',
          'Adding a Reference attribute auto-creates a non-unique index on the FK.',
        ],
      },
    ],
  },
  {
    id: 'app-lifecycle',
    title: 'Application Lifecycle & Platform',
    summary: 'Modules, dependencies, publishing, and the two studios.',
    blocks: [
      {
        kind: 'bullets',
        items: [
          '**1-Click Publish** compiles, deploys, and runs the module in one step.',
          'An **Application** groups **Modules**; logic/data is reused across modules via references.',
          'Use **Manage Dependencies (Ctrl+Q)** to reference public elements from another module; **Refresh** to pick up producer changes.',
          'Only elements marked **Public = Yes** can be referenced by other modules.',
          '**Service Studio** = build (visual IDE). **Service Center** = operate/monitor (logs, Site Properties, timers, environment config).',
          'Environments pipeline: **Dev → Test → Prod**, managed by the platform (LifeTime).',
        ],
      },
      {
        kind: 'warn',
        text: 'If a referenced action/structure changed in the producer, the consumer shows an outdated reference until you **Refresh** it in Manage Dependencies.',
      },
    ],
  },
]
