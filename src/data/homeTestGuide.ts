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
              'Drag an **If** node · Condition: **Response.StatusCode < 200 or Response.StatusCode > 299** (treat ALL 2xx as success — a POST may return 202/204, not just 200/201)',
              'TRUE branch: drag a **Raise Exception** → set the Message to **"HTTP " + Response.StatusCode + " :: " + Response.ResponseText** so the real API error shows up in your error log (NOT a generic "Exception!" that hides the cause).',
              'FALSE branch: connect straight to **End**',
              'Flow: **Start** → **Assign** → **If** —True→ **RaiseException(status + body)**; —False→ **End**',
            ],
            tip: 'Make the RaiseException message include Response.StatusCode + Response.ResponseText. When the API rejects your POST (e.g. HTTP 400 with a JSON error), this is what tells you EXACTLY what to fix — a generic message wastes minutes.',
            important:
              'Use **> 299**, not **> 201**. With > 201 a successful 202/204 POST would be wrongly treated as an error and raise — a confusing false failure on submit.',
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
              'From the **Toolbox** drag a **SQL** element onto the line after GetHomes. Double-click it → in the SQL text type: **DELETE FROM {LocalHome}**.',
              'IMPORTANT: OutSystems requires EVERY SQL element to have an **Output** structure set — even a DELETE that returns nothing. In the editor click **Output → Select Structure** and pick **LocalHome** (any entity/structure works; the result list just stays empty). Without this you get "Output structure must be set". No parameters are needed. Click Done.',
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
              'Drag a **SQL** element after it → text: **DELETE FROM {LocalHomeSales}**. Set its **Output → Select Structure = LocalHomeSales** (required even for DELETE — see the LocalHome note above). No parameters. Done.',
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
        title: 'Reference — the 4 SQL queries you will paste',
        summary: 'Do NOT build anything here. This is a copy-paste reference. You actually create each SQL element inside the action in 4.2, at the moment you drop it. Read the "how a SQL element works" card, then keep these queries handy.',
        steps: [
          {
            title: 'How ANY SQL element works (the 4 things you always set)',
            instructions: [
              'A **SQL** element runs raw SQL against your LOCAL entities (LocalHome, LocalHomeSales, …). Every time you add one, you set 4 things in its editor:',
              '1) **Name** — click the element, Properties → Name (e.g. TopAgent).',
              '2) **Output** — click **Output** → **Select Structure** → pick the structure/entity the result rows look like. Result is then read as **<Name>.List**. REQUIRED on every SQL element, even DELETE.',
              '3) **Parameters** (inputs) — under Parameters click **Add** to declare each **@param** (e.g. Year, Month as Integer). A query with no @params (like DELETE or SELECT DISTINCT) needs none.',
              '4) **Query text** — paste the SQL into the big text box. Click **Done**.',
              'KEY RULE: each column ALIAS in the SELECT (AS HomesSold, AS TotalSales, …) must EXACTLY equal an attribute name in the Output structure — that is how a row maps to fields.',
            ],
            tip: 'Curly braces wrap entities: {LocalHome}. Square brackets wrap columns: {LocalHome}.[Price]. @Name references a parameter you declared. Get these wrong and it will not compile.',
          },
          {
            title: 'Query 1 — DistinctMonths (no params)',
            instructions: [
              'Output structure: a small **YearMonth** structure with **Year** (Integer) + **Month** (Integer). Parameters: none.',
              'Query:',
              '`SELECT DISTINCT {LocalHomeSales}.[Year], {LocalHomeSales}.[Month] FROM {LocalHomeSales}`',
              'Purpose: gives one row per month that has sales — you loop over these to build one summary row per month (checkpoint 4).',
            ],
          },
          {
            title: 'Query 2 — TopAgent (params: Year, Month)',
            instructions: [
              'Output structure: **TopAgent** with **AgentName** (Text), **HomesSold** (Integer), **TotalSales** (Decimal). Parameters: Year, Month (Integer).',
              'Query:',
              '`SELECT TOP 1 {LocalHomeSales}.[AgentName], COUNT({LocalHome}.[Price]) AS HomesSold, SUM({LocalHome}.[Price]) AS TotalSales FROM {LocalHome} INNER JOIN {LocalHomeSales} ON {LocalHomeSales}.[HomeId]={LocalHome}.[HomeId] WHERE {LocalHomeSales}.[Year]=@Year AND {LocalHomeSales}.[Month]=@Month GROUP BY {LocalHomeSales}.[AgentName] ORDER BY TotalSales DESC`',
              'TOP 1 + ORDER BY TotalSales DESC = the highest-selling agent that month → Top Agent (chk 5), HomesSold (chk 6), TotalSales feeds commission (chk 7).',
            ],
            important: 'The Output structure attribute MUST be named **TotalSales** to match "AS TotalSales". A different name → commission reads null → checkpoint 7 fails.',
          },
          {
            title: 'Query 3 — TopSellingHomeType (params: Year, Month)',
            instructions: [
              'Output structure: **TopSellingHomeType** with **Bedrooms** (Integer), **PropertyType** (Text), **TopPropertyCount** (Integer). Parameters: Year, Month.',
              'Query:',
              '`SELECT TOP 1 {LocalHome}.[Bedrooms], {LocalHome}.[PropertyType], COUNT(CONCAT({LocalHome}.[Bedrooms], {LocalHome}.[PropertyType])) AS TopPropertyCount FROM {LocalHome} INNER JOIN {LocalHomeSales} ON {LocalHomeSales}.[HomeId]={LocalHome}.[HomeId] WHERE {LocalHomeSales}.[Year]=@Year AND {LocalHomeSales}.[Month]=@Month GROUP BY {LocalHome}.[Bedrooms], {LocalHome}.[PropertyType] ORDER BY TopPropertyCount DESC`',
              'Most frequent Bedrooms+PropertyType combo that month → Top Selling Home Type (chk 8).',
            ],
          },
          {
            title: 'Query 4 — TotalAgencySales (params: Year, Month)',
            instructions: [
              'Output structure: **TotalAgencySales** with **TotalAgencySales** (Decimal). Parameters: Year, Month.',
              'Query (note the **AS TotalAgencySales** alias — the provided SQL.txt omits it):',
              '`SELECT SUM({LocalHome}.[Price]) AS TotalAgencySales FROM {LocalHome} INNER JOIN {LocalHomeSales} ON {LocalHomeSales}.[HomeId]={LocalHome}.[HomeId] WHERE {LocalHomeSales}.[Year]=@Year AND {LocalHomeSales}.[Month]=@Month`',
              'Sum of all home prices sold that month → feeds Total Agency Commission (chk 9).',
            ],
            important: 'Without "AS TotalAgencySales" the column will not map to the structure → checkpoint 9 fails. The alias must match the structure attribute name.',
          },
        ],
      },
      {
        id: '4.2',
        title: 'Build CreateHomeSalesSummary (one continuous click-by-click flow)',
        summary: 'Create one Server Action and drop 6 nodes onto its line, in order. Each SQL element is created right where you drop it using the 4.1 reference. Result: LocalHomeSalesSummary holds one correct row per month.',
        steps: [
          {
            title: 'Step 1 — Create the action',
            instructions: [
              '**Logic** tab → right-click **Server Actions** → **Add Server Action** → Properties → Name = **CreateHomeSalesSummary**.',
              'You now have a blank canvas: **Start → End**. You will drop 6 nodes on this line in order. After each drop, the next one goes after it.',
            ],
          },
          {
            title: 'Step 2 — Node 1: SQL "ClearSummary" (DELETE)',
            instructions: [
              'Drag a **SQL** element from the Toolbox onto the line after **Start**.',
              'Click it → Properties → Name = **ClearSummary**.',
              'Double-click it → **Output** → Select Structure = **LocalHomeSalesSummary** (required even for DELETE). No parameters.',
              'Query text: `DELETE FROM {LocalHomeSalesSummary}` → **Done**.',
              'WHY: wipes last run’s rows so the count is always correct (you only have a Create action, no Update).',
            ],
          },
          {
            title: 'Step 3 — Node 2: SQL "DistinctMonths"',
            instructions: [
              'Drag another **SQL** element onto the line after ClearSummary.',
              'Name = **DistinctMonths**. Double-click → **Output** → Select Structure = **YearMonth** (your small Year+Month structure from 4.1 Query 1; create that structure in the Data tab first if you have not). No parameters.',
              'Query text: `SELECT DISTINCT {LocalHomeSales}.[Year], {LocalHomeSales}.[Month] FROM {LocalHomeSales}` → **Done**.',
              'After this, **DistinctMonths.List** holds one row per month.',
            ],
          },
          {
            title: 'Step 4 — Node 3: For Each over the months',
            instructions: [
              'Drag a **For Each** onto the line after DistinctMonths.',
              'Click it → Properties → **List** = **DistinctMonths.List**.',
              'This loop body (its **Cycle** branch, the connector hanging DOWN from it) is where Steps 5–8 go. Each pass = one month, referenced as **DistinctMonths.List.Current**.',
            ],
            important: 'Steps 5, 6, 7, 8 must all sit on the For Each’s Cycle (down) branch, chained one after another — NOT on the main line. The last one loops back up to the For Each.',
          },
          {
            title: 'Step 5 — Node 4: SQL "GetTopAgent" (inside the loop)',
            instructions: [
              'Drag a **SQL** element onto the For Each’s **Cycle** branch.',
              'Name = **GetTopAgent** (NOT just "TopAgent" — see the naming warning below). Double-click → **Output** = structure **TopAgent**. Add Parameters **Year** (Integer) and **Month** (Integer). Paste Query 2 from 4.1. **Done**.',
              'Now click the GetTopAgent node on the canvas and set its parameter VALUES (right panel): **Year** = **DistinctMonths.List.Current.Year**, **Month** = **DistinctMonths.List.Current.Month**.',
            ],
            important:
              'CRITICAL — name the SQL element **GetTopAgent**, NOT **TopAgent**. If you name the element the same as its Output structure (TopAgent) AND the destination entity attribute (also TopAgent), the expression editor cannot tell them apart — you will type "TopAgent.List[0]." and NOT see .AgentName, and get "Text data type required instead of TopAgent". A distinct element name (GetTopAgent) fixes it: then GetTopAgent.List[0].AgentName resolves cleanly.',
          },
          {
            title: 'Step 6 — Node 5: SQL "GetTopSellingHomeType" (inside the loop)',
            instructions: [
              'Drag a **SQL** element after GetTopAgent (still on the Cycle branch).',
              'Name = **GetTopSellingHomeType** (distinct from the structure name). Output = structure **TopSellingHomeType**. Parameters Year, Month. Paste Query 3. **Done**.',
              'On the node, set parameter values: **Year** = **DistinctMonths.List.Current.Year**, **Month** = **DistinctMonths.List.Current.Month**.',
            ],
          },
          {
            title: 'Step 7 — Node 6: SQL "GetTotalAgencySales" (inside the loop)',
            instructions: [
              'Drag a **SQL** element after GetTopSellingHomeType.',
              'Name = **GetTotalAgencySales** (distinct from the structure name). Output = structure **TotalAgencySales**. Parameters Year, Month. Paste Query 4. **Done**.',
              'On the node, set parameter values: **Year** = **DistinctMonths.List.Current.Year**, **Month** = **DistinctMonths.List.Current.Month**.',
            ],
          },
          {
            title: 'Step 8 — Node 7: CreateLocalHomeSalesSummary (inside the loop)',
            instructions: [
              'From the tree **Data → Entities → LocalHomeSalesSummary**, drag **CreateLocalHomeSalesSummary** onto the Cycle branch, after GetTotalAgencySales.',
              'Click it → Properties → **Source** record → set each field by clicking its value box and typing the expression.',
              'WRAPPER PATH: an Advanced SQL element nests its rows under the OUTPUT-STRUCTURE name. So the path is **<element>.List[0].<StructureName>.<attribute>** — note the structure-name segment in the MIDDLE. E.g. GetTopAgent.List[0]**.TopAgent.**AgentName. (That middle ".TopAgent" is why dotting into .List[0] first shows ".TopAgent", not ".AgentName" directly — keep dotting.)',
              'TYPE RULE for "+": OutSystems concatenation requires ALL operands to be Text. Convert Integers with **IntegerToText(...)**. A field that is not Text on either side of "+" throws "Cannot apply + operator to Text together with <Type>".',
              '**Year** = `DistinctMonths.List.Current.YearMonth.Year`',
              '**Month** = `DistinctMonths.List.Current.YearMonth.Month`',
              '**TopAgent** = `GetTopAgent.List[0].TopAgent.AgentName`  (Text ← Text)',
              '**TopAgentHomesSold** = `GetTopAgent.List[0].TopAgent.HomesSold`',
              '**TopAgentCommission** = `GetTopAgent.List[0].TopAgent.TotalSales * 0.018`',
              '**TopSellingHomeType** = `GetTopSellingHomeType.List[0].TopSellingHomeType.Bedrooms + " " + GetTopSellingHomeType.List[0].TopSellingHomeType.PropertyType`  ← Bedrooms already holds text like "3 Bedroom", so join with a single SPACE (no literal " Bedroom ", no IntegerToText) → "3 Bedroom HDB". Doubling it ("3 Bedroom Bedroom HDB") makes the API reject with "Home [...] not found in database".',
              '**TotalAgencyCommission** = `GetTotalAgencySales.List[0].TotalAgencySales.TotalAgencySales * 0.002`',
              'This node’s arrow loops back up to the For Each automatically (it is the last node in the loop body).',
            ],
            important:
              'HOME-TYPE FORMAT: in this dataset Bedrooms is TEXT already ("3 Bedroom") and PropertyType is "HDB"/"Condo". So join with ONE space → "3 Bedroom HDB". Do NOT add a literal " Bedroom " and do NOT use IntegerToText — that yields "3 Bedroom Bedroom HDB", which the API rejects with HTTP 400 "Home [...] not found in database". Set BOTH structure attributes (Bedrooms, PropertyType) to Data Type = Text (Data → Structures → TopSellingHomeType), or the SQL throws "Input string was not in a correct format". If your editor does NOT show the .<StructureName> wrapper segment, drop it (use .List[0].PropertyType). Lists are 0-indexed → .List[0]. Commission: Agent × 0.018, Agency × 0.002.',
          },
          {
            title: 'Step 9 — Connect to End, verify names, publish',
            instructions: [
              'The For Each’s main exit (when the loop finishes) connects to **End**. Confirm the line goes Start → ClearSummary → DistinctMonths → For Each → End, with the 4 inner nodes on the Cycle branch.',
              'NAMING RULE recap: SQL ELEMENTS = GetTopAgent / GetTopSellingHomeType / GetTotalAgencySales. STRUCTURES (their Output) = TopAgent / TopSellingHomeType / TotalAgencySales. They must be DIFFERENT names or the expression editor gets confused.',
              'VERIFY COLUMN NAMES match your live entities (from the Phase 2 copy-paste): LocalHome has **Price, Bedrooms, PropertyType, HomeId**; LocalHomeSales has **AgentName, Year, Month, HomeId**. If a name differs, edit the SQL [brackets] OR rename the attribute so they agree.',
              'Press **Ctrl+S**, then **1-Click Publish**. Fix any red errors (usually a column name or a missing Output structure).',
              'FINAL FLOW: **Start → ClearSummary(SQL) → DistinctMonths(SQL) → For Each(DistinctMonths.List){ GetTopAgent → GetTopSellingHomeType → GetTotalAgencySales → CreateLocalHomeSalesSummary } → End**.',
            ],
            tip: 'A single mismatched column name (SQL [PropertyType] vs entity [Type]) is the #1 cause of checkpoints 5–9 failing. Verify before publishing.',
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
        summary: 'Open the Home screen, make it Anonymous, run Sync+Compute on open, then bind a table to the summary entity. Built node-by-node.',
        steps: [
          {
            title: 'Step 1 — Open the Home screen',
            instructions: [
              'Click the **Interface** tab (top bar).',
              'In the left tree expand **UI Flows → MainFlow**. There is already a **Home** screen (created with the app). Double-click **Home** to open it on the canvas.',
              'If there is no Home screen, right-click **MainFlow → Add Screen → Empty**, name it **Home**.',
            ],
          },
          {
            title: 'Step 2 — Make the screen Anonymous (no login)',
            instructions: [
              'With the Home screen open, click an empty part of the canvas to select the SCREEN itself (the tree shows "Home" highlighted).',
              'In **Properties** (right) find the **Roles** (a.k.a. Accessible / Anonymous) property.',
              'Set it so **Anonymous** is allowed — in O11 Reactive: open the screen’s **Roles** property and tick **(Anonymous)**, or remove "Registered" so it is public.',
              'WHY: the grader’s checks and your screenshot must load the page WITHOUT a login prompt.',
            ],
            important:
              'If you skip this, opening the app shows the Login screen first and the auto-load never runs → table is empty and you cannot screenshot it.',
          },
          {
            title: 'Step 3 — Create the screen Aggregate that feeds the table',
            instructions: [
              'In the tree, right-click the **Home** screen → **Fetch Data from Database** (this adds an Aggregate to the screen).',
              'In the Aggregate editor, drag the **LocalHomeSalesSummary** entity in as the Source. Close the editor.',
              'It is auto-named **GetLocalHomeSalesSummaries** (or similar). Its rows are read as **GetLocalHomeSalesSummaries.List**.',
              'This Aggregate runs automatically when the screen loads — but it must run AFTER Sync+Compute, which Step 4 arranges.',
            ],
          },
          {
            title: 'Step 4 — Run Sync + Compute when the screen opens',
            instructions: [
              'You need SyncHomesAndSales then CreateHomeSalesSummary to run BEFORE the table renders. Wire them to the screen’s load event.',
              'In the tree under the **Home** screen, find the **OnInitialize** client action (if absent: right-click Home → **Add Event Handler → OnInitialize**, or right-click → Add Client Action and name it Preparation/OnInitialize). Double-click to open its flow.',
              'Drag a **Run Server Action** onto the line → pick **SyncHomesAndSales** (pulls the API into LocalHome/LocalHomeSales).',
              'Drag another **Run Server Action** after it → pick **CreateHomeSalesSummary** (builds LocalHomeSalesSummary).',
              'Drag a **Refresh Data** element after those → select **GetLocalHomeSalesSummaries** (the Step 3 aggregate). This re-queries the summary AFTER compute so the table shows fresh rows.',
              'Connect to **End**. Flow: **Start → Run SyncHomesAndSales → Run CreateHomeSalesSummary → Refresh Data(GetLocalHomeSalesSummaries) → End**.',
            ],
            important:
              'ORDER MATTERS: Sync → Compute → Refresh. Without the Refresh Data at the end, the aggregate may have queried the (empty) summary before compute ran, leaving the table blank on first load.',
          },
          {
            title: 'Step 5 — Add the table and its 7 columns',
            instructions: [
              'From the **Toolbox** drag a **Table** widget onto the screen body (below the title).',
              'A "Source" prompt appears → set Source = **GetLocalHomeSalesSummaries.List** (the Step 3 aggregate).',
              'It auto-creates a column per attribute. Keep/arrange these 7 columns in order: **Year, Month, TopAgent, TopAgentHomesSold, TopAgentCommission, TopSellingHomeType, TotalAgencyCommission**.',
              'Delete any extra columns (e.g. Id) you do not want shown.',
              'If you stored TopSellingHomeType as a composed Text in Phase 4 (e.g. "2 Bedroom Condo"), just bind the column to that attribute — no extra work.',
            ],
            tip: 'Match the mockup’s column order (Year | Month | Top Agent | Homes Sold | Top Agent Commission | Top Selling Home Type | Total Agency Commission) for a fast visual self-check before you submit.',
          },
          {
            title: 'Step 6 — Publish and confirm the table populates',
            instructions: [
              'Press **Ctrl+S**, then **1-Click Publish**.',
              'Click **Open in Browser**. The page should load WITHOUT a login, run Sync+Compute, and show the summary table filled with one row per month.',
              'If the table is empty: check Step 4 order (Sync→Compute→Refresh) and that the aggregate Source is LocalHomeSalesSummary.',
              'If you see a login page: revisit Step 2 (Anonymous).',
            ],
          },
        ],
      },
      {
        id: '5.2',
        title: 'Submit Sales Summary button → POST',
        summary: 'Build a SubmitSummary server action that reads LocalHomeSalesSummary, fills the API request list, and calls the HomeSalesSummary POST. Then wire a button to run it. Node-by-node.',
        steps: [
          {
            title: 'Step 1 — Check the POST method’s input shape',
            instructions: [
              'In the tree expand **Integrations → REST → IS467LabTest_HomeSales → HomeSalesSummary** → **Input Parameters**.',
              'There is one input (the request body). Note its NAME and TYPE — it is a "List of HomeSalesSummaryData" (or the API’s equivalent). Expand the HomeSalesSummaryData structure and note its attribute names (e.g. Year, Month, TopAgent, TopAgentHomesSold, TopAgentCommission, TopSellingHomeType, TotalAgencyCommission).',
              'You will fill ONE HomeSalesSummaryData per summary row and pass the whole list to this input.',
            ],
            important:
              'The HomeSalesSummaryData attribute names are what the grader reads (checkpoints 4–9). Map each one exactly — a typo means the call succeeds (chk 3 passes) but the values are wrong/empty (chk 4–9 fail).',
          },
          {
            title: 'Step 2 — Create the SubmitSummary server action',
            instructions: [
              '**Logic** tab → right-click **Server Actions** → **Add Server Action** → name **SubmitSummary**. Blank Start→End canvas appears.',
              'Add a **Local Variable** to hold the request list: in the action’s tree node, right-click → **Add Local Variable** → name **RequestList** → Data Type = **List** of **HomeSalesSummaryData** (the API structure from Step 1). This is the body you will build then send.',
            ],
          },
          {
            title: 'Step 3 — Read the computed summary rows',
            instructions: [
              'Drag an **Aggregate** onto the line after Start → drag **LocalHomeSalesSummary** in as Source → close. Auto-named **GetLocalHomeSalesSummaries**; rows = **GetLocalHomeSalesSummaries.List**.',
              '(These are the per-month rows you created in Phase 4.)',
            ],
          },
          {
            title: 'Step 4 — Loop the rows and build the request list',
            instructions: [
              'Drag a **For Each** after the aggregate → set **List** = **GetLocalHomeSalesSummaries.List**.',
              'Inside the loop (Cycle branch), drag a **Run Server Action** → pick the built-in **ListAppend**.',
              'Set ListAppend **List** = **RequestList** (your local variable).',
              'Set ListAppend **Element** = a new HomeSalesSummaryData built from the current row. Click the Element value → in the expression editor build the record, mapping each API attribute to the current summary row:',
              '**Year** = `GetLocalHomeSalesSummaries.List.Current.LocalHomeSalesSummary.Year`',
              '**Month** = `...Current.LocalHomeSalesSummary.Month`',
              '**TopAgent** = `...Current.LocalHomeSalesSummary.TopAgent`',
              '**TopAgentHomesSold** = `...Current.LocalHomeSalesSummary.TopAgentHomesSold`',
              '**TopAgentCommission** = `...Current.LocalHomeSalesSummary.TopAgentCommission`',
              '**TopSellingHomeType** = `...Current.LocalHomeSalesSummary.TopSellingHomeType`',
              '**TotalAgencyCommission** = `...Current.LocalHomeSalesSummary.TotalAgencyCommission`',
              '(If the editor will not let you build a record inline, instead: before ListAppend add an **Assign** that sets each attribute of a scratch HomeSalesSummaryData local var, then ListAppend that var.)',
            ],
            tip: 'Tip to avoid typing the long path: after the For Each is set, the current row autocompletes from GetLocalHomeSalesSummaries.List.Current — drill into .LocalHomeSalesSummary then the attribute.',
          },
          {
            title: 'Step 5 — Call the POST API',
            instructions: [
              'After the For Each (back on the MAIN line, not the loop branch), drag a **Run Server Action** → pick the consumed **HomeSalesSummary** method.',
              'Set its input (the request body parameter from Step 1) = **RequestList**.',
              'Connect to **End**. This is the actual POST → checkpoint 3.',
              'Flow: **Start → GetLocalHomeSalesSummaries(Aggregate) → For Each{ ListAppend → RequestList } → Run HomeSalesSummary(RequestList) → End**.',
            ],
            important:
              'The header (X-Contacts-Key) is added automatically by OnBeforeRequest, so you do NOT set it here. If you get 401/403 on submit, the OnBeforeRequest header (Phase 1.5) is wrong.',
          },
          {
            title: 'Step 6 — Add the button and wire it',
            instructions: [
              'Go to the **Home** screen (Interface tab). From the **Toolbox** drag a **Button** onto the screen (top-right, like the mockup). Set its label to **Submit Sales Summary**.',
              'With the button selected, find its **On Click** event in Properties → choose **New Client Action** (opens SubmitSalesSummaryOnClick).',
              'Inside that client action: drag a **Run Server Action** → pick **SubmitSummary** (your Step 2 action).',
              'After it, drag a **Message** element → Type = **Success**, Message = "Summary submitted". Connect to End.',
              '**Ctrl+S → 1-Click Publish.**',
            ],
          },
          {
            title: 'Step 7 — Test the button',
            instructions: [
              'Open the app in the browser, let the table load, then click **Submit Sales Summary**.',
              'You should see the green "Summary submitted" message and no error.',
              'If you get an error: open **Service Center → Monitoring → Errors** to read the real cause (usually a request attribute name mismatch with HomeSalesSummaryData, or the OnBeforeRequest header).',
              'Submitting is checkpoint 3; whether the VALUES are right is checkpoints 4–9, verified next in Phase 6.',
            ],
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
