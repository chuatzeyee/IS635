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
            title: 'Build the sync flow — Homes',
            instructions: [
              '**Logic** → right-click **Server Actions** → **Add Server Action** → name **SyncHomesAndSales**',
              '— Call the API —',
              'Drag a **Run Server Action** node onto the flow after **Start** → in its dropdown pick the consumed **GetHomes** method (this fires the real API call → checkpoint 1). The node will be auto-named **GetHomes**.',
              '— Find the list the API returned (this is the part the placeholder hid) —',
              'GetHomes returns its data in an OUTPUT parameter. To see its exact name: click the **GetHomes** node and look at its outputs, or expand the consumed **GetHomes** method in the tree and look under **Output Parameters**.',
              'OutSystems consumed-REST methods almost always wrap the rows in an output structure. The full path to the rows is therefore **GetHomes.Response.<RowsAttribute>**, where:',
              '• **GetHomes** = the node name on the flow',
              '• **Response** = the output parameter of the method (the deserialized JSON body)',
              '• **<RowsAttribute>** = the attribute INSIDE Response that holds the list — its real name depends on the API. Common names: the same as the structure (e.g. **HomeData**), or **HomeList**, or a generic **List**. Open Response in the expression editor and pick whichever list-typed attribute appears.',
              'EXAMPLE: if Response has an attribute named **HomeData** that is a "List of HomeData", the path is **GetHomes.Response.HomeData**.',
              '— Loop over the rows —',
              'Drag a **For Each** node after GetHomes. Click it, and in **Properties** set the **List** property = the rows path you found (e.g. **GetHomes.Response.HomeData**). Type it in the expression editor and let auto-complete confirm the attribute exists.',
              'Inside the loop, the current row is **ForEach1.CurrentObj** (older O11 shows the iterator under the For Each — you reference the current item via the list’s **.Current**, e.g. **GetHomes.Response.HomeData.Current**).',
              '— Write each row to the local entity —',
              'Inside the loop drag **CreateOrUpdateLocalHome** (the auto-generated CRUD action for LocalHome) → set its **Source** record to the current API row (e.g. **GetHomes.Response.HomeData.Current**). Because LocalHome’s attribute names were copied from HomeData, the fields map 1-to-1.',
            ],
            tip: 'If you cannot remember the rows-attribute name, just type "GetHomes.Response." in the expression editor — auto-complete lists every attribute, and the list-typed one (a table icon) is the rows you loop over. That is what the <list> placeholder meant.',
          },
          {
            title: 'Build the sync flow — Home Sales (same pattern)',
            instructions: [
              'After the Homes loop, drag another **Run Server Action** → pick **GetHomeSales** (→ checkpoint 2). Node auto-named **GetHomeSales**.',
              'Drag a **For Each** → set **List** = **GetHomeSales.Response.<RowsAttribute>** (find the list-typed attribute inside GetHomeSales.Response the same way — likely **HomeSalesData** or similar). Example: **GetHomeSales.Response.HomeSalesData**.',
              'Inside, drag **CreateOrUpdateLocalHomeSales** → **Source** = the current row (e.g. **GetHomeSales.Response.HomeSalesData.Current**)',
              'Connect to **End**',
              'Final flow: **Start** → **GetHomes** → **For Each (Homes)** → **GetHomeSales** → **For Each (Sales)** → **End**',
            ],
            important:
              'Use **CreateOrUpdate** (keyed by the API id, e.g. HomeId) so re-running does not duplicate rows. If HomeSalesData has no natural key to upsert on, drag a **DeleteAll** of LocalHomeSales (or run "Delete All Entity Records") BEFORE the loop so each run starts clean — otherwise checkpoint 4 (record count) drifts.',
          },
          {
            title: 'Why a sync action (not direct SQL on the API)',
            instructions: [
              'REST responses are in-memory lists — you cannot run GROUP BY / JOIN against them',
              'By landing them in LocalHome / LocalHomeSales (real DB tables), the summary SQL in Phase 4 can JOIN and aggregate',
              'This indirection is the whole reason the lab asks for local entities',
            ],
            tip: 'Speed: map fields by copy-pasting attribute names earlier so the CreateOrUpdate Source maps almost automatically.',
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
            title: 'TopAgent SQL',
            instructions: [
              'You will place these inside the CreateHomeSalesSummary flow (next section). Each is a **SQL** element.',
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
        summary: 'The prof\'s 3-loop algorithm. Build it exactly in this order.',
        steps: [
          {
            title: 'Loop 1 — build one record per distinct Year+Month',
            instructions: [
              'Create Server Action **CreateHomeSalesSummary** with a local **List of LocalHomeSalesSummary** variable named **SummaryData**',
              'Start → **ClearSummaryData**: an **Assign** that sets SummaryData = empty (ListClear) — initialise the summary list',
              'Drag an **Aggregate GetHomeSales** → Source **LocalHomeSales** (all local sales)',
              'Drag a **For Each** over GetHomeSales.List (the "Sales Data" loop)',
              'Inside: **ListIndexOf** on SummaryData looking for an existing record with the same Year AND Month',
              'Drag an **If**: Condition **ListIndexOf.Position = -1** (not found)',
              'TRUE → **ListAppend** a new SummaryData record, setting ONLY **Year** and **Month** from the current sale',
              'FALSE → **NoOp** (already have that month)',
              'Result after loop 1: SummaryData has one blank-but-for-Year/Month row per distinct month → checkpoint 4 (record count).',
            ],
            tip: 'ListIndexOf needs a condition comparing both Year and Month of the current row to each SummaryData element. This dedupes months.',
          },
          {
            title: 'Loop 2 — fill each month via the 3 SQL + commission math',
            instructions: [
              'Drag a second **For Each** over **SummaryData** (the "Summary Data" loop)',
              'Inside, in order: run **TopAgent** SQL → **TopSellingHomeType** SQL → **TotalAgencySales** SQL, each passing **Year = SummaryData.Current.Year** and **Month = SummaryData.Current.Month**',
              'Then an **Assign** ("Update Summary Data") to populate the current SummaryData record:',
              '**TopAgent** = TopAgent.List.Current.AgentName (or first row) ',
              '**TopAgentHomesSold** = TopAgent row HomesSold',
              '**TopAgentCommission** = TopAgent row **TotalSales × 0.018**',
              '**TopSellingHomeType** = TopSellingHomeType row Bedrooms + " Bedroom " + PropertyType',
              '**TotalAgencyCommission** = TotalAgencySales row **TotalAgencySales × 0.002**',
              '(Each SQL is TOP 1 — one row. Read it as **TopAgentSQL.List[0]** — OutSystems lists are **0-indexed**, so [0] is the first/only row. (Do NOT use [1] — that is the second row and does not exist, giving null → 0 commission.) **.Current** also works immediately after running the SQL or inside a For Each. Example: TopAgentCommission = TopAgentSQL.List[0].TotalSales × 0.018.)',
            ],
            important:
              'Commission math is checkpoints 7 and 9: Agent = TotalSales × 0.018, Agency = TotalAgencySales × 0.002. Home type string must read like "2 Bedroom Condo" — use Bedrooms + " Bedroom " + PropertyType (mind the spaces).',
          },
          {
            title: 'Loop 3 — persist to the LocalHomeSalesSummary entity',
            instructions: [
              'Drag a third **For Each** over **SummaryData**',
              'Inside: **Aggregate GetSalesSummaryByYearMonth** → Source LocalHomeSalesSummary, Filter Year = Current.Year AND Month = Current.Month',
              'Drag an **If**: Condition **GetSalesSummaryByYearMonth.List.Empty**',
              'TRUE → **CreateLocalHomeSalesSummary** (Source = SummaryData.Current)',
              'FALSE → **UpdateLocalHomeSalesSummary** (Source = SummaryData.Current, carrying the existing Id)',
              'Connect to **End**',
              'Now LocalHomeSalesSummary holds the final per-month summary, ready to display and submit.',
            ],
            tip: 'Create-or-Update means re-running the screen does not duplicate summary rows — it refreshes them. This keeps checkpoint 4 (record count) correct across reruns.',
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
