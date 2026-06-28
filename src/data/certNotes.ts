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
      {
        kind: 'warn',
        text: 'A reference to a **Static Entity** still carries a Delete Rule (default Protect) and enforces referential integrity — a Static Entity is a real persisted table, so its FK behaves like any other. "Static" only means the rows are defined at design time; it does NOT disable the Delete Rule. (e.g. you can\'t delete a Country record that an Address still references.)',
      },
    ],
  },
  {
    id: 'attribute-migration',
    title: 'Changing an Attribute Data Type (Migration on Publish)',
    summary: 'On publish OutSystems migrates the column. Widening is safe; narrowing can truncate or lose data.',
    blocks: [
      {
        kind: 'text',
        text: 'When you change an Entity attribute\'s **Data Type** and publish, OutSystems runs a **database migration** — it alters the underlying column and **attempts to convert every existing value** to the new type. Whether that is safe depends on the direction of the conversion.',
      },
      {
        kind: 'table',
        table: {
          headers: ['Direction', 'Examples', 'Result'],
          rows: [
            ['Widening (safe)', 'Integer → Long Integer, Integer → Decimal, Integer/Decimal → Text', 'Every value fits — migrates cleanly, no loss'],
            ['Narrowing (risky)', 'Text → Integer, Decimal → Integer, Long Integer → Integer, Text(200) → Text(50)', 'Lossy — values may truncate, reset to default, or the migration errors'],
          ],
        },
      },
      {
        kind: 'text',
        text: 'What happens to existing data in the **narrowing** cases:',
      },
      {
        kind: 'bullets',
        items: [
          '**Text → Integer**: numeric strings ("42") convert; non-numeric ("abc", "") cannot → reset to the default (0) or cause the migration to fail.',
          '**Decimal → Integer**: the fractional part is **truncated** (3.9 → 3).',
          '**Long Integer → Integer**: values that exceed Integer range **overflow** → error/reset.',
          '**Text(200) → Text(50)**: strings longer than 50 are **truncated** to 50 characters.',
          'OutSystems shows a **warning** before publishing a potentially lossy change — but once published, lost/truncated data is gone (not reversible).',
        ],
      },
      {
        kind: 'tip',
        text: 'Widening = safe & automatic (Integer → Text just works). Narrowing = lossy: expect truncation, defaulting, or a failed migration. Safer pattern: add a NEW attribute of the target type, migrate values with explicit logic handling the bad cases, then retire the old one.',
      },
      {
        kind: 'warn',
        text: 'Don\'t treat a data-type change as reversible. A narrowing publish that truncates/zeroes values destroys the originals — there is no automatic undo.',
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
        kind: 'text',
        text: '**When to use "With or Without" (left join)** — whenever the related record is optional and you still want the main row to appear. The giveaway phrase is "all X **including those without** Y":',
      },
      {
        kind: 'table',
        table: {
          headers: ['Use case', 'Why "With or Without"'],
          rows: [
            ['All customers including those with no orders', 'Inner join would drop customers who never ordered'],
            ['List visits where the caregiver is not yet assigned', 'Optional FK (CaregiverId is null) — keep the visit visible'],
            ['Counts/sums that must show zeros (sales per region, incl. 0)', 'Inner join omits the zero rows, skewing the report'],
            ['Find records that LACK a relation (customers with no orders)', 'Left join, then filter `Order.Id = NullIdentifier()`'],
            ['All products including those never reviewed', 'Show every product even with no related reviews'],
          ],
        },
      },
      {
        kind: 'tip',
        text: 'Decision rule: "Do I want main-side rows even when the joined side is empty?" Yes → **With or Without** (left). Only matched pairs → **With** (inner). To find the *missing* ones, left-join then filter `JoinedEntity.Id = NullIdentifier()`.',
      },
      {
        kind: 'tip',
        text: 'Think of an Aggregate as a saved SELECT you build by clicking: Sources = FROM, Filters = WHERE, Sorts = ORDER BY, Joins = JOIN. Output is always a List you can loop or bind.',
      },
      {
        kind: 'warn',
        text: 'After a "With or Without" join the missing side\'s attributes come back **null/empty** — guard for it in expressions. And Aggregate is **server-side only**: it does NOT exist inside a Client Action (the browser can\'t query the DB); call a Server/Data Action instead. Common exam trap.',
      },
    ],
  },
  {
    id: 'screen-lifecycle',
    title: 'Screen / Block Lifecycle Events',
    summary: 'The On-events that fire as a Screen or Block is created, updated, and destroyed.',
    blocks: [
      {
        kind: 'text',
        text: 'Every Reactive Screen and Block runs through a **lifecycle**: it is created, rendered (possibly many times), and eventually destroyed. The "On" events let you hook logic into each stage. They run **client-side** (in the browser).',
      },
      {
        kind: 'table',
        table: {
          headers: ['Event', 'When it runs', 'On Screen?', 'On Block?', 'Typical use'],
          rows: [
            ['OnInitialize', 'Once, when created, before the first render', 'Yes', 'Yes', 'Initialize local variables'],
            ['OnRender', 'On initial render AND every re-render', 'Yes', 'Yes', 'React to variable/data changes each paint'],
            ['OnParametersChanged', 'When an input parameter value changes', 'No', 'Yes (Blocks only)', 'Re-fetch/recompute when parent passes new inputs'],
            ['OnDestroy', 'When the Screen/Block is destroyed (removed)', 'Yes', 'Yes', 'Cleanup — clear timers, intervals, listeners'],
            ['OnAfterFetch', 'After an Aggregate/Data Action finishes loading', 'Yes', 'Yes', 'Post-process fetched data'],
          ],
        },
      },
      {
        kind: 'text',
        text: 'Typical order on first appearance: **OnInitialize → (data fetches) → OnAfterFetch → OnRender**. OnRender then fires again on every later UI update. **OnDestroy** fires last, when the element goes away.',
      },
      {
        kind: 'tip',
        text: 'OnInitialize = once (init vars). OnRender = every UI update (don\'t put one-time setup here — it fires repeatedly). OnDestroy = cleanup. OnParametersChanged = a Block reacting to new inputs.',
      },
      {
        kind: 'warn',
        text: '**OnParametersChanged is a Block-only event** — Screens have no input-parameter-change event. Both Screens and Blocks DO have OnDestroy (see the next card for what "destroyed" means).',
      },
    ],
  },
  {
    id: 'ondestroy',
    title: 'OnDestroy & What "Being Destroyed" Means',
    summary: 'A Screen/Block is destroyed when it is removed from the page — OnDestroy is your cleanup hook.',
    blocks: [
      {
        kind: 'text',
        text: 'A Screen or Block is **"destroyed"** when it is removed from the running page and its in-memory state (local variables, fetched data, timers) is discarded. The opposite of OnInitialize (create): OnInitialize sets things up, **OnDestroy tears them down**.',
      },
      {
        kind: 'text',
        text: 'When does it actually happen?',
      },
      {
        kind: 'bullets',
        items: [
          '**Navigating away from a Screen** — you go to another Screen, so the old one is destroyed (its local variables are gone; come back and OnInitialize runs fresh).',
          '**A Block inside an `If` widget whose condition turns False** — the Block is removed from the DOM and destroyed. (Turns True again → a NEW instance is created, OnInitialize runs again.)',
          '**A Block rendered inside a List/For Each when its item is removed** — that item\'s Block instance is destroyed.',
          '**Conditionally shown content being hidden** — anything unmounted from the screen tree is destroyed.',
        ],
      },
      {
        kind: 'text',
        text: 'What OnDestroy is for — **cleanup of things that would otherwise leak or keep running**:',
      },
      {
        kind: 'bullets',
        items: [
          'Clear a JavaScript `setInterval` / `setTimeout` you started so it doesn\'t fire after the UI is gone.',
          'Remove event listeners or subscriptions added in OnInitialize/OnRender.',
          'Release references to large client-side data.',
        ],
      },
      {
        kind: 'tip',
        text: 'Pair them: whatever you START in OnInitialize (a timer, a listener), STOP it in OnDestroy. "Destroyed" = removed from the page + state discarded, not "deleted from the database."',
      },
      {
        kind: 'warn',
        text: 'Destroying a Screen/Block does NOT delete any database records — it only discards the in-memory UI instance and its local state. Don\'t confuse UI destroy with an Entity Delete.',
      },
    ],
  },
  {
    id: 'blocks',
    title: 'Blocks (Reusable UI Components)',
    summary: 'A reusable piece of UI + logic you build once and drop into many Screens or other Blocks.',
    blocks: [
      {
        kind: 'text',
        text: 'A **Block** is OutSystems\' reusable UI component — a self-contained bundle of widgets, styling, local variables, and client logic that you build once and **embed in many Screens** (or inside other Blocks). Think of it like a custom widget: a navigation bar, a reusable card, a search box, a rating stars control. It keeps UI DRY — change the Block once and every Screen using it updates.',
      },
      {
        kind: 'text',
        text: 'A Block lives in the **Interface** layer alongside Screens. The big difference: a **Screen** has its own URL and you navigate to it; a **Block** has no URL — it only exists embedded inside a Screen or another Block.',
      },
      {
        kind: 'table',
        table: {
          headers: ['', 'Screen', 'Block'],
          rows: [
            ['Has a URL / navigable?', 'Yes (you navigate to it)', 'No (embedded only)'],
            ['Reusable in many places?', 'No — one destination', 'Yes — drop into many Screens/Blocks'],
            ['Input parameters', 'Yes (from URL / navigation)', 'Yes (passed by the parent)'],
            ['Can raise Events to parent?', 'N/A', 'Yes — its main way to talk back'],
            ['Lifecycle events', 'OnInitialize, OnRender, OnAfterFetch', 'OnInitialize, OnRender, OnParametersChanged'],
          ],
        },
      },
      {
        kind: 'text',
        text: 'How a Block communicates — **data flows down via Input Parameters, events flow up via Events**:',
      },
      {
        kind: 'bullets',
        items: [
          '**Input Parameters** — the parent Screen/Block passes data IN (e.g. a `CustomerId` or a record to display). One-way: parent → block.',
          '**Events** — the Block talks BACK to its parent. The Block defines a named Event (e.g. `OnItemClick`); the parent provides a **handler** (a Client Action) that runs when the Block triggers it. This is how a reusable Block stays decoupled — it announces "something happened" and lets each parent decide what to do.',
          '**OnParametersChanged** — a Block-specific lifecycle event that fires whenever one of its **Input Parameters changes value**. Use it to re-fetch or recompute when the parent passes new inputs (a Screen does NOT have this event).',
          '**Placeholders** — named slots inside a Block where the parent can inject its own content (like a slot/children). Lets a Block define layout while the parent fills specific regions.',
          '**Public Block** — set Public = Yes to reuse a Block across modules (referenced via Manage Dependencies), same as other public elements.',
        ],
      },
      {
        kind: 'tip',
        text: 'Memory aid: Input Parameters go DOWN (parent → block), Events go UP (block → parent). A Block reacts to new inputs with OnParametersChanged. If you need a URL, it\'s a Screen, not a Block.',
      },
      {
        kind: 'warn',
        text: 'Common traps: a Block has **no URL** and can\'t be navigated to — only embedded. **OnParametersChanged** belongs to Blocks (fires when inputs change), not Screens. To send data from a Block back to its parent, you raise an **Event** — you do NOT write to the parent\'s variables directly.',
      },
    ],
  },
  {
    id: 'forms-validation',
    title: 'Forms, Validation & Widget States',
    summary: 'Form.Valid, Input.Valid / ValidationMessage, mandatory fields, and how validation runs.',
    blocks: [
      {
        kind: 'text',
        text: 'A **Form** widget groups inputs and exposes runtime **state** you read in logic to decide whether to save. The two you must know: **`Form.Valid`** (Boolean — is every input in the form currently valid?) and each input\'s **`.Valid`** + **`.ValidationMessage`**. These are runtime properties on the widget, not data attributes.',
      },
      {
        kind: 'table',
        table: {
          headers: ['State / property', 'On what', 'Meaning'],
          rows: [
            ['Valid', 'Form and each Input', 'Boolean — true if the field/whole form passes validation'],
            ['ValidationMessage', 'each Input (and Form)', 'Text shown under the field when Valid = False'],
            ['Mandatory', 'Input', 'If Yes, an empty value auto-fails validation (required field)'],
            ['Enabled', 'Input / Button', 'Whether the widget accepts interaction'],
          ],
        },
      },
      {
        kind: 'text',
        text: 'The standard save flow — **validate, then check Form.Valid, then save**:',
      },
      {
        kind: 'bullets',
        items: [
          'Mandatory inputs validate automatically; for custom rules you set `Input.Valid = False` and `Input.ValidationMessage = "..."` in your logic.',
          'Built-in client action **`ValidateForm`** runs all the form\'s validations and refreshes each input\'s Valid state.',
          'After validating, branch on **`Form.Valid`**: if True → run the save (Server Action); if False → stop, the invalid inputs already show their ValidationMessage.',
          'Validation feedback (red borders + messages) renders **client-side** — no round-trip just to validate. Only the save hits the server.',
          'A **Button** can have its **Enabled** bound to an expression (e.g. disable Save while a field is empty).',
        ],
      },
      {
        kind: 'tip',
        text: 'Save pattern: ValidateForm → If Form.Valid = True → CreateOrUpdate (server) → feedback; else do nothing (messages already shown). Reading Form.Valid BEFORE validating can give a stale result — validate first.',
      },
      {
        kind: 'warn',
        text: '`Form.Valid` / `Input.Valid` are runtime widget STATES, not Entity attributes — you read them in client logic, you don\'t store them. Marking an input **Mandatory** only blocks empty values; other rules (format, ranges) you enforce by setting `.Valid` + `.ValidationMessage` yourself.',
      },
    ],
  },
  {
    id: 'common-widgets',
    title: 'Common UI Widgets',
    summary: 'What the core Reactive widgets are for — Container, Input, Link vs Button, List, If, For Each.',
    blocks: [
      {
        kind: 'table',
        table: {
          headers: ['Widget', 'Purpose'],
          rows: [
            ['Container', 'Layout/grouping box; the building block for structure & styling'],
            ['Form', 'Groups inputs and exposes Valid / validation for a save flow'],
            ['Input', 'Bound to a variable/attribute; has Valid, ValidationMessage, Mandatory'],
            ['Label', 'Caption tied to an input (accessibility + click-to-focus)'],
            ['Button', 'Triggers an On Click action; has Enabled; Submit vs normal'],
            ['Link', 'Navigates (to a Screen) or triggers an action; for navigation, not form submit'],
            ['List', 'Renders a record List, one item template repeated per record'],
            ['If (widget)', 'Shows one of two UI branches based on a Boolean'],
            ['For Each (widget)', 'Repeats UI per item of a List (inside a List/Container)'],
            ['Container/Table', 'Tabular display of records bound to an Aggregate output'],
          ],
        },
      },
      {
        kind: 'bullets',
        items: [
          '**Link vs Button**: a **Link** is for navigation (go to a Screen) or a lightweight action; a **Button** is the primary action trigger and can be a form Submit. Use a Button to save a Form, a Link to navigate.',
          '**If widget vs For Each widget** are UI-tree elements (they show/repeat UI) — distinct from the **If / For Each logic nodes** inside an action flow.',
          '**Events** on widgets (e.g. a Button\'s On Click, an Input\'s On Change) wire UI interactions to Client Actions.',
          'Most widgets have **Visible** and **Enabled** properties bound to expressions for dynamic UI.',
        ],
      },
      {
        kind: 'warn',
        text: 'Don\'t confuse the **If / For Each WIDGETS** (in the screen UI tree, controlling what renders) with the **If / For Each LOGIC nodes** (inside an action flow, controlling execution). Same names, different places.',
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
    id: 'round-trips',
    title: 'Server Round-Trips & Performance',
    summary: 'A round-trip = browser → server → back. They cost latency, so Reactive minimizes them.',
    blocks: [
      {
        kind: 'text',
        text: 'A **round-trip** is one complete request from the **browser to the server and back**: the client sends a request, the server does work (queries the DB, runs C# logic), and returns a response. Each round-trip costs **network latency**, so fewer round-trips = a snappier app. Reactive Web keeps most logic in the browser precisely to avoid them.',
      },
      {
        kind: 'table',
        table: {
          headers: ['Causes a round-trip (→ server)', 'No round-trip (stays in browser)'],
          rows: [
            ['Run Server Action (incl. anything using an Aggregate/SQL/Entity action)', 'Client Action logic: If, Assign, For Each on in-memory data'],
            ['Fetching data — a screen Aggregate / Data Action loading from the DB', 'Showing a Message; navigating (Destination)'],
            ['Calling a REST/SOAP integration via a server action', 'Reading a Client Variable or local variable'],
            ['Refresh Data (re-runs the server query)', 'Client-side validation, UI updates, If-widget toggling'],
          ],
        },
      },
      {
        kind: 'bullets',
        items: [
          'A **Client Action calling a Server Action** incurs one round-trip for that call.',
          'A Server Action call **inside a loop** = one round-trip per iteration → slow. Prefer one bulk fetch/send over many small calls.',
          'Validation messages and show/hide should be **client-side** (no round-trip); hit the server only when you truly need DB/server work.',
          'Same client/server split as the logic card, viewed through latency: **Aggregate is server-side → fetching it is a round-trip; Message is client-side → no round-trip.**',
        ],
      },
      {
        kind: 'tip',
        text: 'Mental model: a round-trip = "the browser has to ask the server and wait." Anything the browser can answer itself (already-loaded data, local logic, UI changes) is NOT a round-trip.',
      },
      {
        kind: 'warn',
        text: 'Traditional Web did a **full-page round-trip** on most interactions (every button posted back and reloaded the page). **Reactive Web** is an SPA that only round-trips for data/server logic — the platform\'s headline performance win.',
      },
    ],
  },
  {
    id: 'reactivity',
    title: 'Reactivity: Auto-Refetch & Variable Tracking',
    summary: 'When the UI re-fetches/recomputes by itself when data changes — and when you must trigger it manually.',
    blocks: [
      {
        kind: 'text',
        text: 'Reactive Web is "reactive" because the screen **automatically re-renders when a variable it displays changes** — you don\'t manually repaint the UI. But that auto-tracking only covers some things; data already loaded from the database does NOT silently re-query when the DB changes. Knowing the boundary is heavily tested.',
      },
      {
        kind: 'text',
        text: 'AUTOMATIC — happens without you doing anything:',
      },
      {
        kind: 'bullets',
        items: [
          '**UI re-renders when a bound variable changes** — change a Local/Input Variable and any widget/expression showing it updates instantly (in-browser, no round-trip).',
          '**Aggregate auto-refetches when one of its OWN inputs changes** — if a screen Aggregate\'s filter/sort references a variable (e.g. a search box bound to `SearchText`), editing that variable **re-runs the Aggregate automatically**. Its data source reactively depends on those inputs.',
          '**A dependent Aggregate/expression recomputes when its source changes** — derived values that reference reactive data re-evaluate.',
          '**A Block re-runs OnParametersChanged when its parent passes new Input Parameters** — so it can react to new inputs.',
        ],
      },
      {
        kind: 'text',
        text: 'NOT automatic — you must trigger it yourself:',
      },
      {
        kind: 'bullets',
        items: [
          '**Stale data after a Create/Update/Delete** — an Aggregate fetched its rows once; writing to the same Entity does NOT auto-refresh it. Call **Refresh Data** (on that Aggregate/Data Action) to re-query.',
          '**Changes made by ANOTHER user / another screen** — the database changed, but your already-loaded Aggregate won\'t know. Re-fetch (Refresh Data) or re-enter the screen.',
          '**Manually mutating a List variable** (ListAppend/ListRemove on a local copy) — does not write to the DB, and the source Aggregate is unaffected.',
          '**Plain non-bound logic** — a Server Action result you stored in a variable only updates the UI if a widget is bound to that variable.',
        ],
      },
      {
        kind: 'tip',
        text: 'Rule of thumb: changing an Aggregate\'s INPUTS (filter/sort variables) → auto-refetch. Changing the underlying DATA (Create/Update/Delete) → NOT automatic, use Refresh Data. Variable change → UI re-renders if a widget is bound to it.',
      },
      {
        kind: 'warn',
        text: 'Classic trap: "I saved a record but the list didn\'t update." The Aggregate doesn\'t re-query on a DB write — you must call **Refresh Data** after the Create/Update/Delete. Auto-refetch only tracks the Aggregate\'s own input variables, not the table\'s contents.',
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
    id: 'debugger-stepping',
    title: 'Debugger: Step Into / Step Over / Continue',
    summary: 'How to walk through paused logic — and the Step Into vs Step Over distinction.',
    blocks: [
      {
        kind: 'text',
        text: 'You set a **breakpoint** on a node; when execution reaches it the debugger **pauses** and you can inspect variables. From there, the stepping controls decide how execution proceeds:',
      },
      {
        kind: 'table',
        table: {
          headers: ['Control', 'What it does', 'When to use'],
          rows: [
            ['Step Into', 'Executes the next node; if it is a call to an action, ENTERS that action and pauses on its first node', 'Follow execution down INTO a called Server/Client Action'],
            ['Step Over', 'Executes the next node fully; if it calls an action, runs the whole action WITHOUT descending, then pauses on the next node in the current flow', 'Skip the internals of a call you trust'],
            ['Continue', 'Resumes normal execution until the next breakpoint (or the flow ends)', 'Run on to the next breakpoint'],
          ],
        },
      },
      {
        kind: 'bullets',
        items: [
          '**Step Into** is the only one that descends into a **called action** — it pauses on the first node inside it. (This is the answer to "continue step by step, including into a called action.")',
          '**Step Over** runs the called action to completion but stays at the current level — you do not see its inner nodes.',
          '**Continue** ignores remaining nodes until it hits another breakpoint.',
          'While paused you can inspect/expand variable values; breakpoints + the debugger live in **Service Studio**.',
        ],
      },
      {
        kind: 'tip',
        text: 'Memory aid: Step INTO = go INSIDE the called action. Step OVER = jump OVER it (run it, don\'t enter). Continue = run to the next breakpoint.',
      },
      {
        kind: 'warn',
        text: 'Exam trap: to step into a called action node-by-node you need **Step Into** — Step Over would execute that action in one go without entering it.',
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
  {
    id: 'architecture-canvas',
    title: 'Architecture: Canvas Layers vs SOA Terms',
    summary: 'OutSystems\' official 3-layer canvas — and how it maps to general SOA terms (Atomic/Composite/Wrapper).',
    blocks: [
      {
        kind: 'text',
        text: 'OutSystems\' OFFICIAL way to structure an app is the **Architecture Canvas**, a 3-layer model. Modules are placed in a layer and may only depend **downward** (upper layers consume lower ones, never the reverse) — this keeps dependencies clean and avoids cycles.',
      },
      {
        kind: 'table',
        table: {
          headers: ['Canvas layer', 'Holds', 'Examples'],
          rows: [
            ['End-User', 'UI / user-facing screens & flows', 'Screens, navigation, app UI modules'],
            ['Core', 'Business entities, rules, services owning data', 'Customer, Order business logic + data'],
            ['Foundation', 'Reusable, non-business assets & integrations', 'Themes, UI patterns, external system connectors'],
          ],
        },
      },
      {
        kind: 'text',
        text: 'The general **SOA service terms** (often taught alongside) map roughly onto the canvas:',
      },
      {
        kind: 'table',
        table: {
          headers: ['SOA term', 'Named as', 'Owns data?', 'Maps to (canvas)'],
          rows: [
            ['Atomic service', 'a NOUN (Customer, Product)', 'Yes — exclusively', 'Core layer'],
            ['Composite service', 'a VERB (PlaceOrder)', 'No — orchestrates others', 'Core layer (orchestration)'],
            ['Wrapper service', '—', 'Wraps an external/legacy system', 'Foundation layer'],
          ],
        },
      },
      {
        kind: 'tip',
        text: 'Atomic = NOUN that owns its data and never calls other services. Composite = VERB that orchestrates and owns no data. Wrapper = a standard interface over an external system.',
      },
      {
        kind: 'warn',
        text: 'Exam scope guard: **"End-User / Core / Foundation" is the OFFICIAL OutSystems Architecture Canvas** and is fair game on the cert. **"Atomic/Composite/Wrapper service" and "Party Atomic Service" are general SOA / course (SMU IS635) terms — NOT official OutSystems vocabulary.** "Party" (= any Person or Organization) is the industry Party data-model pattern, not an OutSystems feature. Expect canvas layers on the cert; expect Atomic/Composite/Party on the SMU exam.',
      },
    ],
  },
]
