// Home Test (Trial Midterm Lab) build guide — IS467/IS635 Real Estate Home Sales.
// Goal: build a Reactive Web App with one anonymous Home screen that consumes the
// IS467LabTest_HomeSales REST API, computes a monthly sales summary, submits it,
// and passes all 9 auto-graded checkpoints in the fastest time.
// Reuses the BuildPhase/Section/Step shape so it renders with the phased renderer.

export interface HTStep {
  readonly title: string
  readonly instructions: readonly string[]
  readonly tip?: string
  readonly important?: string
}

export interface HTSection {
  readonly id: string
  readonly title: string
  readonly summary: string
  readonly steps: readonly HTStep[]
}

export interface HTPhase {
  readonly id: number
  readonly title: string
  readonly description: string
  readonly timeEstimate: string
  readonly sections: readonly HTSection[]
}

export const homeTestPhases: readonly HTPhase[] = [
  // ──────────────────────────────────────────────
  // PHASE 0: Orientation — what you are building & the 9 checkpoints
  // ──────────────────────────────────────────────
  {
    id: 0,
    title: 'Orientation',
    description:
      'Read this once, then never stop again. The whole task: consume one REST API, mirror its 3 data shapes into local entities, compute a per-month sales summary with 3 SQL queries, show it on one anonymous Home screen, and POST it back. **Open-book, AI allowed.** A+ = all 9 PASS in the fastest time, so move deliberately and do not backtrack.',
    timeEstimate: '5 min read',
    sections: [
      {
        id: '0.1',
        title: 'The 9 auto-graded checkpoints',
        summary: 'Everything you build serves these. Keep them on screen.',
        steps: [
          {
            title: 'What the grader checks',
            instructions: [
              '1. Successful invocation of **GetHomes**',
              '2. Successful invocation of **GetHomeSales**',
              '3. Successful invocation of **HomeSalesSummary** (the POST you submit)',
              '4. **Correct number of records** in the submitted summary (= one row per distinct Year+Month)',
              '5. **Correct Top Agent** for each month',
              '6. **Correct Top Agent Homes Sold** for each month',
              '7. **Correct Top Agent Commission** for each month (= Top Agent total sales × 0.018)',
              '8. **Correct Top Selling Home Type** for each month',
              '9. **Correct Agency Commission** for each month (= total agency sales × 0.002)',
            ],
            important:
              'Checkpoints 1–3 = "did the API calls work" (header + error handling correct). 4–9 = "is the math right" (the 3 SQL queries + commission formulas). Get the OnBeforeRequest header right first or NOTHING else can pass.',
          },
          {
            title: 'The commission formulas (memorize)',
            instructions: [
              'Total commission on a sale is **2%**, split: **Agent 1.8%**, **Agency 0.2%**',
              '**Top Agent Commission** = (Top Agent total sales for the month) × **0.018**',
              '**Total Agency Commission** = (total agency sales for the month) × **0.002**',
              '**Top Selling Home Type** display = Bedrooms + " Bedroom " + PropertyType (e.g. "2 Bedroom Condo", "3 Bedroom HDB")',
            ],
            tip: 'The Home screen mockup shows: Year | Month | Top Agent | Top Agent Homes Sold | Top Agent Commission | Top Selling Home Type | Total Agency Commission — those are exactly the 7 columns of your summary entity.',
          },
          {
            title: 'The data pipeline at a glance',
            instructions: [
              'GetHomes (API) → **LocalHome** entity',
              'GetHomeSales (API) → **LocalHomeSales** entity',
              'compute → **LocalHomeSalesSummary** entity (7 columns, one row per Year+Month)',
              'LocalHomeSalesSummary → Home screen table + POST to **HomeSalesSummary** API',
            ],
            tip: 'You mirror the API shapes locally so you can run SQL JOINs/GROUP BYs against a real database. You cannot GROUP BY against a raw REST response.',
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // PHASE 1: API Key + App + Consume REST
  // ──────────────────────────────────────────────
  {
    id: 1,
    title: 'API Key & Consume',
    description:
      'Register your Lab Test API key, create the app, consume the REST API, and wire the authentication header. Until the header works, every call returns 401/403 and checkpoints 1–3 fail.',
    timeEstimate: '15 min',
    sections: [
      {
        id: '1.1',
        title: 'Register your Lab Test API Key',
        summary: 'You get a personal X-Contacts-Key. Without it the API rejects every call.',
        steps: [
          {
            title: 'Get the key',
            instructions: [
              'Go to **https://smuedu-dev.outsystemsenterprise.com/SMULabUtilities/RegisterLabTest**',
              'Enter the password given at the start of class',
              'You receive your **Lab Test API Key** by email AND SMS — copy it',
              'Keep it handy; you will store it as a Site Property in step 1.4',
            ],
            important:
              'The dataset is RESET just before the test starts. Do not pre-build against old data — register and pull fresh once the test begins.',
          },
        ],
      },
      {
        id: '1.2',
        title: 'Create the Reactive Web App',
        summary: 'Any name. You only need one screen, made Anonymous.',
        steps: [
          {
            title: 'New app',
            instructions: [
              'Service Studio home → **New Application** → **From scratch** → **Reactive Web App**',
              'Name it anything (e.g. **HomeSalesLabTest**) → pick an icon → **Create App**',
              'It creates a module. **1-Click Publish** once to confirm the shell builds.',
            ],
            tip: 'Speed: do not theme or decorate. One plain screen passes the same 9 checkpoints as a pretty one.',
          },
        ],
      },
      {
        id: '1.3',
        title: 'Consume the REST API (3 operations)',
        summary: 'Point OutSystems at the Swagger URL; it generates GetHomes, GetHomeSales, HomeSalesSummary plus their data structures.',
        steps: [
          {
            title: 'Add the consumed REST API',
            instructions: [
              '**Logic** tab → right-click **Integrations > REST** → **Consume REST API**',
              'Choose **Add all methods**, then paste each operation, OR paste the Swagger base URL',
              'API base: **https://smuedu-dev.outsystemsenterprise.com/IS467LabTest/rest/IS467LabTest_HomeSales/**',
              'You should end up with a REST API named **IS467LabTest_HomeSales** containing: **GetHomes** (GET), **GetHomeSales** (GET), **HomeSalesSummary** (POST)',
              'OutSystems auto-generates the response/request **Structures** (e.g. HomeData, HomeSalesData, HomeSalesSummaryData)',
            ],
            important:
              'Note the EXACT attribute names and data types inside the generated structures (HomeData, HomeSalesData, HomeSalesSummaryData). You will copy them verbatim into your local entities — names and types must match the API for the POST to be accepted.',
          },
        ],
      },
      {
        id: '1.4',
        title: 'Store the API key as a Site Property',
        summary: 'A server-side global so OnBeforeRequest can attach it to every call.',
        steps: [
          {
            title: 'Create the Site Property',
            instructions: [
              '**Data** tab → right-click **Site Properties** → **Add Site Property**',
              'Name: **LabTestAPIKey** · Data Type: **Text** · Default Value: paste your key from step 1.1',
              '(Storing it once here means you never hardcode the key in logic; OnBeforeRequest reads Site.LabTestAPIKey.)',
            ],
          },
        ],
      },
      {
        id: '1.5',
        title: 'OnBeforeRequest — attach the X-Contacts-Key header',
        summary: 'This is THE make-or-break step. Every API call needs the header or it is rejected.',
        steps: [
          {
            title: 'Add the header on the REST API',
            instructions: [
              'In the tree, expand the **IS467LabTest_HomeSales** REST API → double-click **OnBeforeRequest**',
              '(OnBeforeRequest runs before every request; **Request** holds the outgoing call, **CustomizedRequest** is the output.)',
              'The default flow already has an **Assign**: **CustomizedRequest = Request** — keep it',
              'Drag a **Run Server Action** node and pick **ListAppend** (the built-in list action)',
              'Set **List** = **Request.Headers**',
              'Set the new element fields: **Name** = **"X-Contacts-Key"** · **Value** = **Site.LabTestAPIKey**',
              'Flow: **Start** → **Assign (CustomizedRequest = Request)** → **ListAppend (add header)** → **End**',
            ],
            important:
              'The header name is exactly **X-Contacts-Key** (capital X, capital C, capital K, hyphenated). A wrong header name = 401/403 = checkpoints 1–3 all fail. This mirrors the SMULab Party/Contacts auth pattern from the Bookstore labs.',
          },
        ],
      },
      {
        id: '1.6',
        title: 'OnAfterResponse — surface API errors clearly',
        summary: 'So a bad call throws a readable exception instead of silently returning empty data.',
        steps: [
          {
            title: 'Add error handling on the REST API',
            instructions: [
              'Double-click **OnAfterResponse** under the same REST API',
              'Keep the default **Assign**: **CustomizedResponse = Response**',
              'Drag an **If** node · Condition: **Response.StatusCode < 200 or Response.StatusCode > 201**',
              'TRUE branch: drag a **JSON Deserialize** → Name **JSONDeserializeErrorStructure** · JSON String = **Response.ResponseText** · Data Type = **ErrorStructure** (create a small structure with a Text attribute if one is not auto-generated)',
              'Then drag a **Raise Exception** → throw a generic exception with the deserialized error message text',
              'FALSE branch: connect straight to **End**',
              'Flow: **Start** → **Assign** → **If** —True→ **JSONDeserialize** → **RaiseException**; —False→ **End**',
            ],
            tip: 'HTTP 200 and 201 are success. Anything else means the call failed — fail loudly now so you debug in seconds, not minutes. Speed depends on fast feedback.',
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // PHASE 2: Local entities + SQL output structures
  // ──────────────────────────────────────────────
  {
    id: 2,
    title: 'Entities & Structures',
    description:
      'Mirror the 3 API data shapes into local database entities (so you can run SQL on them), then define the 3 output structures the summary SQL queries return.',
    timeEstimate: '15 min',
    sections: [
      {
        id: '2.1',
        title: 'Create the 3 local entities',
        summary: 'LocalHome, LocalHomeSales, LocalHomeSalesSummary — copy attributes from the API structures.',
        steps: [
          {
            title: 'LocalHome (mirrors HomeData)',
            instructions: [
              '**Data** tab → right-click **Entities** → **Add Entity** → name **LocalHome**',
              'Open the consumed **HomeData** structure, select ALL its attributes, copy, and paste them into LocalHome (right-click LocalHome > Paste). This copies names AND data types exactly.',
              'Ensure these attributes exist (the summary SQL needs them): **HomeId**, **Price**, **Bedrooms**, **PropertyType**',
              'Set **HomeId** as the identifier if the API provides it as the key (so re-sync upserts instead of duplicating).',
            ],
            tip: 'Copy-paste from the API structure is the fastest, error-proof way to match attribute names and types — do not hand-type them.',
          },
          {
            title: 'LocalHomeSales (mirrors HomeSalesData)',
            instructions: [
              'Add Entity → **LocalHomeSales**',
              'Copy ALL attributes from the **HomeSalesData** structure into it',
              'Ensure these exist (SQL needs them): **HomeId**, **AgentName**, **Year**, **Month**',
              '(HomeSales links an agent to a home for a given year/month — this is what you GROUP BY.)',
            ],
          },
          {
            title: 'LocalHomeSalesSummary (your computed output)',
            instructions: [
              'Add Entity → **LocalHomeSalesSummary**',
              'Copy ALL attributes from the **HomeSalesSummaryData** structure (the POST body shape) so types match what the API expects',
              'It must have these 7 columns: **Year**, **Month**, **TopAgent**, **TopAgentHomesSold**, **TopAgentCommission**, **TopSellingHomeType**, **TotalAgencyCommission**',
              '(Use the exact attribute names/types from HomeSalesSummaryData; the names above are the conceptual columns shown on the mockup.)',
            ],
            important:
              'Match the commission attribute DATA TYPES to the API structure. If the API defines them as Integer, OutSystems rounds on assignment — that is fine as long as the grader expects the same. Mismatched types are a top cause of checkpoint 7/9 failures.',
          },
        ],
      },
      {
        id: '2.2',
        title: 'Create the 3 SQL output structures',
        summary: 'Each summary SQL returns rows that must map to a structure BY COLUMN-ALIAS = ATTRIBUTE-NAME.',
        steps: [
          {
            title: 'TopAgent structure',
            instructions: [
              '**Data** → right-click **Structures** → **Add Structure** → **TopAgent**',
              'Attributes (names MUST equal the SQL aliases): **AgentName** (Text), **HomesSold** (Integer), **TotalSales** (Decimal)',
            ],
            important:
              'GOTCHA: the provided TopAgent SQL ends "...SUM(...) AS TotalSales". If you name the attribute "TotalAgentSales" instead, it will NOT map and Top Agent Commission (checkpoint 7) silently computes from 0. Either name the attribute **TotalSales** to match the SQL, OR change the SQL alias to **AS TotalAgentSales**. They must be identical.',
          },
          {
            title: 'TopSellingHomeType structure',
            instructions: [
              'Add Structure → **TopSellingHomeType**',
              'Attributes: **Bedrooms** (Integer), **PropertyType** (Text), **TopPropertyCount** (Integer)',
              '(These already match the provided SQL aliases — no gotcha here.)',
            ],
          },
          {
            title: 'TotalAgencySales structure',
            instructions: [
              'Add Structure → **TotalAgencySales**',
              'Attribute: **TotalAgencySales** (Decimal)',
            ],
            important:
              'GOTCHA: the provided TotalAgencySales SQL is "SELECT SUM({LocalHome}.[Price]) FROM ..." with NO alias. An unaliased column will not map to the structure. You MUST add an alias: **SELECT SUM({LocalHome}.[Price]) AS TotalAgencySales FROM ...** — otherwise Total Agency Commission (checkpoint 9) computes from 0.',
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // PHASE 3: Sync local data from the API
  // ──────────────────────────────────────────────
  {
    id: 3,
    title: 'Sync Data',
    description:
      'A server action that calls GetHomes and GetHomeSales and writes the results into LocalHome and LocalHomeSales. This is what makes checkpoints 1 and 2 pass.',
    timeEstimate: '15 min',
    sections: [
      {
        id: '3.1',
        title: 'Server Action: SyncHomesAndSales',
        summary: 'Pull both lists from the API and upsert into local entities.',
        steps: [
          {
            title: 'Step A — Create the empty Server Action',
            instructions: [
              'Click the **Logic** tab (top-left of Service Studio, next to Processes/Interface/Data).',
              'In the left tree you will see folders: **Integrations, Roles, Server Actions, Client Actions, …**',
              'Right-click the **Server Actions** folder → click **Add Server Action**.',
              'A blank action canvas opens showing just a green **Start** circle and a red **End** circle joined by a line.',
              'On the right, in **Properties**, change **Name** to **SyncHomesAndSales** and press Enter.',
            ],
            tip: 'You now have an empty flow. Everything below is dragged ONTO the line between Start and End, in order. To drop a node on the line, drag it until the line highlights, then release — it auto-connects.',
          },
          {
            title: 'Step B — Call GetHomes (the API call)',
            instructions: [
              'Look at the **Toolbox** on the FAR LEFT (the vertical strip of icons). Find **Run Server Action** (gear-like icon). If you do not see it, use the search box at the top of the toolbox and type "Run".',
              'Drag **Run Server Action** onto the line just below **Start**. Drop it when the line highlights.',
              'A picker pops up: "Select Action". In its search box type **GetHomes**.',
              'Under **Integrations → IS467LabTest_HomeSales** you will see **GetHomes** — double-click it.',
              'The node on the canvas is now labelled **GetHomes**. (This is the real HTTP call → checkpoint 1.)',
              'GetHomes needs no inputs (the API key is added automatically by OnBeforeRequest), so you do not have to set anything on it.',
            ],
            important:
              'If the picker does not list GetHomes, you have not consumed the REST API yet — go back to Phase 1.3. The method must exist under Integrations → REST before you can Run it here.',
          },
          {
            title: 'Step C — Understand what GetHomes returns (Response IS the list)',
            instructions: [
              'Click the **GetHomes** node, or expand **Integrations → REST → IS467LabTest_HomeSales → GetHomes → Output Parameters** in the tree. There is ONE output parameter — its name is **Response**.',
              'When you dot into it (**GetHomes.Response.**) the expression editor shows **HomeId, Bedrooms, PropertyType, Price**. Those are the fields of ONE home.',
              'That means **Response itself is the LIST of homes** (a "List of" record with those 4 attributes). There is no extra wrapper attribute to drill into — the rows live directly at **GetHomes.Response**.',
              'So everywhere below: the loop List = **GetHomes.Response**, and the current home = **GetHomes.Response.Current** (which has .HomeId, .Bedrooms, .PropertyType, .Price).',
            ],
            important:
              'Earlier drafts of this guide used "GetHomes.Response.HomeData" — that was a guess at a wrapper. In your environment the response is the list directly, so use **GetHomes.Response** (no sub-attribute). If your editor instead shows a list-typed attribute under Response, use that path — but for this lab Response is the list.',
          },
          {
            title: 'Step D — Clear LocalHome, then add the For Each',
            instructions: [
              'FIRST clear old rows so re-running does not pile up duplicates (you only have CreateLocalHome, not CreateOrUpdate — so you must start clean).',
              'From the **Toolbox** drag a **SQL** element onto the line after GetHomes. Double-click it → in the SQL text type: **DELETE FROM {LocalHome}** → close. (No output, no parameters needed.) This empties the table each run.',
              'Now from the **Toolbox** drag a **For Each** onto the line after the SQL element.',
              'Click the For Each → in **Properties** click the **List** value box → expression editor → type **GetHomes.Response** → Done.',
              'The loop now runs once per home returned by the API.',
            ],
            tip: 'The DELETE keeps checkpoint 4 (record count) correct: every screen load wipes and re-loads, so the local tables always exactly mirror the current API data — no drift, no duplicates.',
          },
          {
            title: 'Step E — Inside the loop, CreateLocalHome for each row',
            instructions: [
              'In your environment only **CreateLocalHome** is auto-generated (that is all you need now that you DELETE first).',
              'In the left tree expand **Data → Entities → LocalHome** → you will see **CreateLocalHome**.',
              'Drag **CreateLocalHome** onto the loop body — drop it on the connector that hangs DOWN from the For Each (the **Cycle** branch), NOT the main line.',
              'Click the **CreateLocalHome** node → in **Properties** find the **Source** input (type "LocalHome Record").',
              'Click **Source** → expression editor → type **GetHomes.Response.Current** → Done. This inserts the current home.',
              'Because LocalHome’s attributes (HomeId, Bedrooms, PropertyType, Price) match the response record, the whole record assigns field-for-field automatically.',
              'Confirm CreateLocalHome’s out-arrow loops back up to the For Each (auto-connects; if not, drag from it to the For Each).',
            ],
            important:
              'If you DO see CreateOrUpdateLocalHome in the tree, you may use it instead and skip the DELETE in Step D. But CreateLocalHome + DELETE is the foolproof path and is what these steps assume.',
          },
          {
            title: 'Step F — Repeat for Home Sales, then close the flow',
            instructions: [
              'After the Homes For Each, drag another **Run Server Action** onto the MAIN line → pick **GetHomeSales** (→ checkpoint 2). Node auto-named **GetHomeSales**.',
              'Drag a **SQL** element after it → text: **DELETE FROM {LocalHomeSales}** → close.',
              'Drag a second **For Each** after the SQL → set its **List** = **GetHomeSales.Response** (same idea: GetHomeSales.Response is the list of sales; dot in to confirm it shows HomeId, AgentName, Year, Month).',
              'Into THAT loop body (Cycle branch) drag **CreateLocalHomeSales** (from Data → Entities → LocalHomeSales) → set **Source** = **GetHomeSales.Response.Current**.',
              'Connect the last node to **End**.',
              'FINAL FLOW: **Start → GetHomes → SQL(DELETE LocalHome) → For Each(Homes){CreateLocalHome} → GetHomeSales → SQL(DELETE LocalHomeSales) → For Each(Sales){CreateLocalHomeSales} → End**',
              'Press **Ctrl+S**, then **1-Click Publish** to confirm it compiles.',
            ],
            important:
              'Both DELETEs run BEFORE their loops, so each execution rebuilds the local tables from scratch = exactly the API’s rows = correct counts for checkpoint 4. Verify GetHomeSales.Response really exposes HomeId, AgentName, Year, Month (the SQL JOIN and GROUP BY in Phase 4 depend on those four).',
          },
          {
            title: 'Why a sync action (not direct SQL on the API)',
            instructions: [
              'REST responses are in-memory lists — you cannot run GROUP BY / JOIN against them',
              'By landing them in LocalHome / LocalHomeSales (real DB tables), the summary SQL in Phase 4 can JOIN and aggregate',
              'This indirection is the whole reason the lab asks for local entities',
            ],
            tip: 'Speed: because each local entity mirrors the API record exactly, the CreateLocalHome / CreateLocalHomeSales Source = the loop\'s .Current maps every field in one assignment — no per-field mapping.',
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // PHASE 4: Compute the summary (the prof's algorithm)
  // ──────────────────────────────────────────────
  {
    id: 4,
    title: 'Compute Summary',
    description:
      'CreateHomeSalesSummary — the heart of the test. Three loops: (1) build one record per distinct Year+Month, (2) fill each via the 3 SQL queries + commission math, (3) persist to LocalHomeSalesSummary. This drives checkpoints 4–9.',
    timeEstimate: '30 min',
    sections: [
      {
        id: '4.1',
        title: 'Add the 3 SQL elements (paste from SQL.txt)',
        summary: 'Three Advanced SQL queries, each with @Year and @Month parameters and the matching output structure.',
        steps: [
          {
            title: 'How to create a SQL element (the recipe you repeat 3× in Phase 4.2)',
            instructions: [
              'These SQL elements live INSIDE the CreateHomeSalesSummary action you build in 4.2 — but here is the exact recipe for adding one, so the 3 queries below make sense.',
              'From the **Toolbox** (far left), drag a **SQL** element onto the flow line. It is named SQL1 by default — rename it (Properties → Name) to **TopAgent** / **TopSellingHomeType** / **TotalAgencySales**.',
              'Double-click the SQL element → the **SQL editor** opens (a big text area, with **Inputs/Parameters** on the left and **Output** on the right/below).',
              'SET THE OUTPUT: click **Output** → **Select Structure** → pick the matching structure you made in Phase 2.2 (TopAgent / TopSellingHomeType / TotalAgencySales). This makes the result available as **<name>.List**.',
              'ADD PARAMETERS: under **Parameters/Inputs** click **Add** twice → create **Year** (Integer) and **Month** (Integer). These are the **@Year** and **@Month** you reference in the query.',
              'PASTE THE QUERY into the text area (queries below). Click **Done**.',
              'When you DROP the SQL element inside the Phase 4.2 loop, you then set those two parameters: **Year** = the current month-row’s Year, **Month** = its Month.',
            ],
            tip: 'Column ALIASES in the SQL (AS HomesSold, AS TotalSales, AS TopPropertyCount, AS TotalAgencySales) MUST exactly equal the attribute names in the chosen Output structure — that is how rows map to fields.',
          },
          {
            title: 'TopAgent SQL',
            instructions: [
              'Output Structure: **TopAgent** · Parameters: **Year** (Integer), **Month** (Integer)',
              'Query:',
              '`SELECT TOP 1 {LocalHomeSales}.[AgentName], COUNT({LocalHome}.[Price]) AS HomesSold, SUM({LocalHome}.[Price]) AS TotalSales FROM {LocalHome} INNER JOIN {LocalHomeSales} ON {LocalHomeSales}.[HomeId]={LocalHome}.[HomeId] WHERE {LocalHomeSales}.[Year]=@Year AND {LocalHomeSales}.[Month]=@Month GROUP BY {LocalHomeSales}.[AgentName] ORDER BY TotalSales DESC`',
              'TOP 1 + ORDER BY TotalSales DESC = the agent with the highest total sales that month → Top Agent (chk 5), HomesSold (chk 6), TotalSales feeds commission (chk 7).',
            ],
            important: 'Confirm the structure attribute is **TotalSales** (matches the AS TotalSales alias). See the Phase 2 gotcha.',
          },
          {
            title: 'TopSellingHomeType SQL',
            instructions: [
              'Output Structure: **TopSellingHomeType** · Parameters: **Year**, **Month**',
              'Query:',
              '`SELECT TOP 1 {LocalHome}.[Bedrooms], {LocalHome}.[PropertyType], COUNT(CONCAT({LocalHome}.[Bedrooms], {LocalHome}.[PropertyType])) AS TopPropertyCount FROM {LocalHome} INNER JOIN {LocalHomeSales} ON {LocalHomeSales}.[HomeId]={LocalHome}.[HomeId] WHERE {LocalHomeSales}.[Year]=@Year AND {LocalHomeSales}.[Month]=@Month GROUP BY {LocalHome}.[Bedrooms], {LocalHome}.[PropertyType] ORDER BY TopPropertyCount DESC`',
              'Returns the most frequent Bedrooms+PropertyType combo that month → Top Selling Home Type (chk 8).',
            ],
          },
          {
            title: 'TotalAgencySales SQL (add the alias!)',
            instructions: [
              'Output Structure: **TotalAgencySales** · Parameters: **Year**, **Month**',
              'Query (note the added **AS TotalAgencySales**):',
              '`SELECT SUM({LocalHome}.[Price]) AS TotalAgencySales FROM {LocalHome} INNER JOIN {LocalHomeSales} ON {LocalHomeSales}.[HomeId]={LocalHome}.[HomeId] WHERE {LocalHomeSales}.[Year]=@Year AND {LocalHomeSales}.[Month]=@Month`',
              'Sum of all home prices sold that month → feeds Total Agency Commission (chk 9).',
            ],
            important: 'The provided SQL.txt omits the alias. Without "AS TotalAgencySales" the column will not map to the structure and checkpoint 9 fails. Add it.',
          },
        ],
      },
      {
        id: '4.2',
        title: 'Server Action: CreateHomeSalesSummary',
        summary: 'A clear-then-rebuild version of the prof\'s algorithm. Wipe the summary table, build one row per distinct Year+Month, fill each via the 3 SQL + commission math, and Create it. Uses only the auto-generated CreateLocalHomeSalesSummary.',
        steps: [
          {
            title: 'Step A — Create the action + clear old summary rows',
            instructions: [
              '**Logic** tab → right-click **Server Actions** → **Add Server Action** → name **CreateHomeSalesSummary**.',
              'From the **Toolbox** drag a **SQL** element onto the line after Start → double-click → type **DELETE FROM {LocalHomeSalesSummary}** → Done. (No output, no parameters.) This empties the summary table so each run starts clean — the key to a correct record count (checkpoint 4) when you only have a Create action.',
            ],
            important:
              'Like the sync action, we clear-then-recreate instead of Create-or-Update, because your environment only auto-generated CreateLocalHomeSalesSummary (no Update). DELETE first = no duplicates, no stale rows.',
          },
          {
            title: 'Step B — Loop 1: one summary row per distinct Year+Month',
            instructions: [
              'You need the list of distinct months that have sales. Easiest reliable way: a SQL element returning distinct Year/Month.',
              'Drag a **SQL** element after the DELETE → rename **DistinctMonths**. Output Structure: make a tiny structure **YearMonth** with **Year** (Integer) and **Month** (Integer); set it as the Output. No parameters.',
              'Query: `SELECT DISTINCT {LocalHomeSales}.[Year], {LocalHomeSales}.[Month] FROM {LocalHomeSales}` → Done. **DistinctMonths.List** now has one row per month.',
              'Drag a **For Each** after it → set **List** = **DistinctMonths.List**. This loop runs once per month. Everything in Steps C–D goes INSIDE this loop (on the For Each’s Cycle branch).',
            ],
            tip: 'SELECT DISTINCT replaces the fiddly ListIndexOf/ListAppend dedupe from the original solution — same result (unique months), far fewer nodes, and it works with only a Create action. If your editor blocks DISTINCT, fall back to GROUP BY Year, Month.',
          },
          {
            title: 'Step C — inside the loop: run the 3 SQL for THIS month',
            instructions: [
              'Inside the For Each (Cycle branch), drag the **TopAgent** SQL element (built per the 4.1 recipe). Set its parameters: **Year** = **DistinctMonths.List.Current.Year**, **Month** = **DistinctMonths.List.Current.Month**.',
              'After it, drag the **TopSellingHomeType** SQL → same two parameters (Current.Year, Current.Month).',
              'After it, drag the **TotalAgencySales** SQL → same two parameters.',
              'Order inside the loop so far: **TopAgent → TopSellingHomeType → TotalAgencySales**, each fed the current month.',
            ],
            important:
              'Each SQL filters WHERE Year=@Year AND Month=@Month, so passing Current.Year / Current.Month scopes the result to this one month. Forgetting to set the parameters = every month computes the same (wrong) numbers.',
          },
          {
            title: 'Step D — inside the loop: CreateLocalHomeSalesSummary with the math',
            instructions: [
              'Still inside the loop, after the 3 SQL elements, drag **CreateLocalHomeSalesSummary** (from **Data → Entities → LocalHomeSalesSummary** in the tree) onto the Cycle branch.',
              'Click it → in **Properties**, expand the **Source** record and set each field (click each value → expression editor):',
              '**Year** = **DistinctMonths.List.Current.Year**',
              '**Month** = **DistinctMonths.List.Current.Month**',
              '**TopAgent** = **TopAgent.List[0].AgentName**',
              '**TopAgentHomesSold** = **TopAgent.List[0].HomesSold**',
              '**TopAgentCommission** = **TopAgent.List[0].TotalSales × 0.018**',
              '**TopSellingHomeType** = **TopSellingHomeType.List[0].Bedrooms + " Bedroom " + TopSellingHomeType.List[0].PropertyType**',
              '**TotalAgencyCommission** = **TotalAgencySales.List[0].TotalAgencySales × 0.002**',
              'Confirm the node loops back to the For Each, then connect the For Each’s exit to **End**.',
            ],
            important:
              'Lists are 0-indexed → use **.List[0]** for the single TOP-1 row (NOT [1]). Commission: Agent = TotalSales × 0.018, Agency = TotalAgencySales × 0.002. Home-type string must read "2 Bedroom Condo" — mind the spaces in " Bedroom ". These are checkpoints 5–9.',
          },
          {
            title: 'Step E — verify the column names line up (do this against your live entities)',
            instructions: [
              'The SQL references these columns — confirm they EXIST with these exact names in your entities (from the API copy-paste in Phase 2):',
              'LocalHome: **HomeId, Price, Bedrooms, PropertyType** · LocalHomeSales: **HomeId, AgentName, Year, Month**',
              'If the API used different names (e.g. Type instead of PropertyType, or SalesYear instead of Year), EITHER rename your entity attributes to match the SQL, OR edit the SQL [brackets] to match your attributes. They must agree.',
              'The structure attributes must match the SQL aliases: TopAgent(**AgentName, HomesSold, TotalSales**), TopSellingHomeType(**Bedrooms, PropertyType, TopPropertyCount**), TotalAgencySales(**TotalAgencySales**).',
              'Final action flow: **Start → DELETE summary → DistinctMonths SQL → For Each(month){ TopAgent → TopSellingHomeType → TotalAgencySales → CreateLocalHomeSalesSummary } → End**.',
            ],
            tip: 'Spend 60 seconds here before publishing — a single mismatched column name (SQL says [PropertyType], entity says [Type]) fails compilation or silently returns nulls. This is the #1 cause of checkpoints 5–9 failing.',
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // PHASE 5: Home screen + submit
  // ──────────────────────────────────────────────
  {
    id: 5,
    title: 'Home Screen & Submit',
    description:
      'One anonymous screen: a summary table that loads on open, and a Submit button that POSTs the summary to the HomeSalesSummary API (checkpoint 3).',
    timeEstimate: '20 min',
    sections: [
      {
        id: '5.1',
        title: 'Build & populate the Home screen',
        summary: 'Make it Anonymous (no login), load+compute on open, show the 7-column table.',
        steps: [
          {
            title: 'Create the screen and load data',
            instructions: [
              '**Interface** → in MainFlow open the default **Home** screen (or add one named Home)',
              'Set the screen **Roles/Anonymous** = Anonymous so no login is required',
              'Add a server **Data Action** on the screen, e.g. **LoadAndComputeSummary**, that runs on load and does: **SyncHomesAndSales** → **CreateHomeSalesSummary**',
              'Add a screen **Aggregate GetLocalHomeSalesSummary** → Source LocalHomeSalesSummary (this feeds the table)',
              'Ensure the aggregate refreshes AFTER the data action completes (call Refresh on it in the data action\'s success, or order them so compute runs first)',
            ],
            important:
              'The simplest race-free pattern: one Data Action that syncs, computes, THEN returns the LocalHomeSalesSummary list — bind the table directly to that action\'s output. Guarantees the table shows freshly computed data.',
          },
          {
            title: 'Add the table',
            instructions: [
              'Drag a **Table** widget onto the screen → Source = the summary list/aggregate',
              'Columns in order: **Year, Month, Top Agent, Top Agent Homes Sold, Top Agent Commission, Top Selling Home Type, Total Agency Commission**',
              'For Top Selling Home Type, show the composed string (Bedrooms + " Bedroom " + PropertyType) — either store it composed in the entity or compose it in the column expression',
            ],
            tip: 'Match the mockup column order for an easy visual self-check before submitting.',
          },
        ],
      },
      {
        id: '5.2',
        title: 'Submit Sales Summary button → POST',
        summary: 'Invoke the HomeSalesSummary API with your computed summary list (checkpoint 3).',
        steps: [
          {
            title: 'Wire the button',
            instructions: [
              'Drag a **Button** onto the screen → label **Submit Sales Summary**',
              'On Click → New Client Action **SubmitSalesSummaryOnClick**',
              'Inside: **Run Server Action** → a wrapper **SubmitSummary** server action that builds the request from LocalHomeSalesSummary and calls the consumed **HomeSalesSummary** (POST) method',
              'In SubmitSummary: Aggregate LocalHomeSalesSummary → For Each → ListAppend into the HomeSalesSummary request body list (mapping each field to the API HomeSalesSummaryData attribute names) → Run Server Action HomeSalesSummary(request)',
              'Back on the client: show a **Message** (Success) "Summary submitted"',
            ],
            important:
              'The POST body field names must match the API HomeSalesSummaryData structure exactly (that is why you copied them in Phase 2). A mismatch = the API accepts the call but stores wrong/empty fields = checkpoints 4–9 fail even though checkpoint 3 (invocation) passes.',
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // PHASE 6: Grade, debug, submit
  // ──────────────────────────────────────────────
  {
    id: 6,
    title: 'Grade & Submit',
    description:
      'Publish, submit, check your score via the grading API, fix to 9/9, then submit the screenshot. This loop is where the "fastest time" race is won or lost — debug systematically.',
    timeEstimate: '10 min + debug',
    sections: [
      {
        id: '6.1',
        title: 'Run and self-grade',
        summary: 'Publish, open the screen (loads + computes), click Submit, then call the grading API.',
        steps: [
          {
            title: 'Submit and check the score',
            instructions: [
              '**1-Click Publish**, then **Open in Browser** — the table should populate (homes + sales synced, summary computed)',
              'Click **Submit Sales Summary**',
              'Check your result by opening (replace the key): **https://smuedu-dev.outsystemsenterprise.com/IS467LabTest/rest/Grading/LabTestResult_Home?LabTestAPIKey={LabTestAPIKey}**',
              'Read which of the 9 components PASS/FAIL and fix accordingly (see the debug map below)',
              'Repeat until **9 of 9 PASS**',
            ],
            important:
              'You can ignore Warnings (the doc says so). Only the 9 PASS/FAIL components matter. Do NOT submit the grading-API output as your answer.',
          },
          {
            title: 'Debug map — which fix for which failure',
            instructions: [
              'Chk 1/2/3 FAIL (invocation) → OnBeforeRequest header wrong: verify name is exactly **X-Contacts-Key** and value **Site.LabTestAPIKey**; confirm the key registered',
              'Chk 4 FAIL (record count) → Loop 1 dedupe wrong: ListIndexOf must match BOTH Year and Month; one row per distinct month',
              'Chk 5/6 FAIL (top agent / homes sold) → TopAgent SQL ORDER BY TotalSales DESC + TOP 1; reading the wrong row',
              'Chk 7 FAIL (agent commission) → TotalSales not mapping (the AS TotalSales alias vs attribute name gotcha) OR forgot × 0.018',
              'Chk 8 FAIL (home type) → composed string format wrong; must be Bedrooms + " Bedroom " + PropertyType',
              'Chk 9 FAIL (agency commission) → TotalAgencySales SQL missing **AS TotalAgencySales** alias OR forgot × 0.002',
            ],
            tip: 'Fastest path: get checkpoints 1–3 green first (header), then 4 (counts), then 5–9 (math). Fix in that dependency order — a header failure makes everything else moot.',
          },
        ],
      },
      {
        id: '6.2',
        title: 'Submit your answer to eLearn',
        summary: 'A screenshot of the completed Home screen, with the app URL visible.',
        steps: [
          {
            title: 'Final submission',
            instructions: [
              'Take a screenshot of your completed **Home screen only**, populated with the summary table',
              'Make sure the **app URL is visible** in the screenshot (browser address bar)',
              'Submit the screenshot into **eLearn**',
              'DO NOT submit the grading-API output from step 6.1',
            ],
            important:
              'The URL MUST be visible in the screenshot or the submission is incomplete. Capture the address bar.',
          },
        ],
      },
    ],
  },
]
