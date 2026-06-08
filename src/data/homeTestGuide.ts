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
              '**TopSellingHomeType** = `IntegerToText(GetTopSellingHomeType.List[0].TopSellingHomeType.Bedrooms) + " Bedroom " + GetTopSellingHomeType.List[0].TopSellingHomeType.PropertyType`',
              '**TotalAgencyCommission** = `GetTotalAgencySales.List[0].TotalAgencySales.TotalAgencySales * 0.002`',
              'This node’s arrow loops back up to the For Each automatically (it is the last node in the loop body).',
            ],
            important:
              'The home-type "+" error means **PropertyType is not a Text attribute** in your TopSellingHomeType structure. Fix: Data → Structures → TopSellingHomeType → click **PropertyType** → set **Data Type = Text**. (Also wrap the Integer Bedrooms in **IntegerToText(...)** as shown.) If your environment does NOT show the .<StructureName> wrapper segment, just drop it (use .List[0].AgentName) — go with what auto-complete offers. Lists are 0-indexed → .List[0] only. Commission: Agent × 0.018, Agency × 0.002.',
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
