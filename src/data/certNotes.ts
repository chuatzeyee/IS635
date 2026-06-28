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
    summary: 'Three ways to hold data — the difference is WHERE it lives and WHO can change it.',
    blocks: [
      {
        kind: 'text',
        text: 'The single question that separates these three: **is the data stored in the database, and can the running app change it?** An **Entity** is a live database table. A **Static Entity** is a database table too, but its rows are frozen at design time. A **Structure** is not in the database at all — it only exists in memory while logic runs.',
      },
      {
        kind: 'table',
        table: {
          headers: ['', 'Entity', 'Static Entity', 'Structure'],
          rows: [
            ['Stored in database?', 'Yes — a real table', 'Yes — a small fixed table', 'No — memory only'],
            ['Who sets the rows?', 'The app, at runtime', 'The developer, at design time', 'Nobody — it has no rows'],
            ['Runtime actions', 'Create, Read, Update, Delete', 'Get only (read)', 'None (just a shape)'],
            ['Survives a restart?', 'Yes (in the DB)', 'Yes (in the DB)', 'No (gone after the action)'],
            ['Example', 'Customer, Order, Visit', 'OrderStatus, CareType, Gender', 'An API request/response body'],
          ],
        },
      },
      {
        kind: 'bullets',
        items: [
          '**Entity** = your live data. Users create and edit these rows constantly (every new Order is a new row). Auto-gets an `Id` primary key and full CRUD entity actions.',
          '**Static Entity** = a fixed reference list you type in once as a developer. The app can read it but never add/edit/delete rows at runtime — so it only gets a **Get** action. It behaves like an **enumeration** (see next card).',
          '**Structure** = a named bundle of fields with **no table behind it**. Used to group values in memory — e.g. the shape you deserialize JSON into, or a multi-field input/output of an action.',
          'Both Entity rows and Structures can be the Data Type of a Variable or List; a Static Entity is referenced by its **Identifier** (like picking an enum value).',
        ],
      },
      {
        kind: 'tip',
        text: 'Decide by asking: Will users change this data while the app runs? → **Entity**. Is it a fixed list I define once (statuses, types)? → **Static Entity**. Do I just need to carry some fields around in memory? → **Structure**.',
      },
      {
        kind: 'warn',
        text: 'Common trap: a Static Entity is still **persisted in the database** — it is NOT in-memory. The in-memory one is the **Structure**. And a Static Entity has **no Create/Update/Delete**, only Get.',
      },
    ],
  },
  {
    id: 'enumeration',
    title: 'Enumeration',
    summary: 'A fixed set of named, known-in-advance values — modelled in OutSystems as a Static Entity.',
    blocks: [
      {
        kind: 'text',
        text: 'An **enumeration** (enum) is a small, **fixed set of named choices** that are known when you build the app and do not change at runtime — like the days of the week, or order statuses {Draft, Submitted, Approved, Rejected}. Instead of scattering raw numbers or text strings ("status = 2") through your logic, you give each value a clear name.',
      },
      {
        kind: 'text',
        text: 'OutSystems has **no separate "enum" type** — you model an enumeration with a **Static Entity**. Each record is one enum value, with an auto **Identifier** (the value you compare against) plus any extra attributes you add, such as a display **Label** or a sort **Order**.',
      },
      {
        kind: 'bullets',
        items: [
          'Records are defined at **design time** in the Static Entity\'s records table — fixed, read-only at runtime.',
          'Reference a value by its **Identifier**, e.g. `OrderStatus.Approved` — readable and refactor-safe, unlike a magic number `3`.',
          'Add attributes like `Label` ("Approved") or `Color` and read them with the **Get** action for display.',
          'Use enums to drive **If/Switch** logic, dropdown options, and status columns — anywhere a column can only be one of a known list.',
        ],
      },
      {
        kind: 'tip',
        text: 'Rule of thumb: if a field can only ever be one of a short, pre-known list that the app does not edit, make it a **Static Entity** (an enumeration) and reference values by name, not by number.',
      },
      {
        kind: 'warn',
        text: 'If the list of choices can grow or be edited by users at runtime (e.g. product categories an admin manages), it is NOT an enumeration — use a regular **Entity** instead.',
      },
    ],
  },
  {
    id: 'aggregates',
    title: 'Aggregates & Data Fetching',
    summary: 'The visual query (SELECT) — how you read data from Entities without writing SQL.',
    blocks: [
      {
        kind: 'text',
        text: 'An **Aggregate** is OutSystems\' visual way to read data from one or more Entities — the low-code equivalent of a SQL **SELECT**. You pick source Entities, add filters, sorts, and joins in a visual editor, and it returns a **List** of records. It always runs on the **server** (only the server can reach the database) and the result is sent to the screen.',
      },
      {
        kind: 'table',
        table: {
          headers: ['Part of an Aggregate', 'What it does'],
          rows: [
            ['Sources', 'The Entities you read from (one or more)'],
            ['Filters', 'Conditions that keep/drop rows — like SQL WHERE'],
            ['Sorts', 'Order the results by one or more attributes'],
            ['Joins', 'How multiple sources are combined (With / With or Without)'],
            ['Output', 'A **List** of records, plus **.Count** (how many matched)'],
            ['Max Records', 'Caps how many rows are fetched (performance)'],
          ],
        },
      },
      {
        kind: 'bullets',
        items: [
          '**Filters combine with AND** — a row must pass *every* filter to be returned. To express OR, write a single filter expression using the `or` operator (e.g. `Status = 1 or Status = 2`).',
          '**With (inner join)**: returns only rows that have a match on both sides. Use when you need the related record to exist.',
          '**With or Without (left join)**: keeps every row from the main source even when the joined side has no match (missing side comes back as null/empty). Use when the related record is optional.',
          'The Aggregate gives you `<Aggregate>.List` (the records) and `<Aggregate>.List.Count` (the total) — bind the List to a Table/List widget on screen.',
          'On a Reactive Screen, the Aggregate runs its query, then the screen\'s **OnAfterFetch** event fires once the data has returned — the right place to post-process results.',
          'Re-running a screen Aggregate (after data changes) is done with **Refresh Data**; preview results at design time with **Test Values**.',
        ],
      },
      {
        kind: 'tip',
        text: 'Think of an Aggregate as a saved SELECT you build by clicking: Sources = FROM, Filters = WHERE, Sorts = ORDER BY, Joins = JOIN. Output is always a List you can loop or bind.',
      },
      {
        kind: 'warn',
        text: 'Aggregate is **server-side only** — it does NOT exist inside a Client Action (the browser can\'t query the DB). To get data from the client, call a Server Action/Data Action that runs the Aggregate. Common exam trap.',
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
