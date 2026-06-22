export interface ScriptSlide {
  readonly slide: string
  readonly speaker?: string
  readonly time?: string
  readonly lines: readonly string[]
}

export interface ScriptDoc {
  readonly id: string
  readonly title: string
  readonly subtitle: string
  readonly slides: readonly ScriptSlide[]
}

export const scripts: readonly ScriptDoc[] = [
  // ──────────────────────────────────────────────────────────────
  // FULL SCRIPT — all 11 slides, 3 speakers
  // ──────────────────────────────────────────────────────────────
  {
    id: 'full-script',
    title: 'Full Presentation Script',
    subtitle: 'All 11 slides · 3 speakers · ~16 min + live demo',
    slides: [
      {
        slide: 'Slide 1 — Title',
        speaker: 'Tze Yee',
        time: '~30 sec',
        lines: [
          "Good [morning/afternoon] everyone. We're [names], and our IS635 term project is CareConnect — a home-caregiving marketplace built on an SOA-layered architecture in OutSystems.",
          "The three ideas to remember: it does skill-matched care, it has escrow-protected payment, and it runs a full request-to-confirm lifecycle end-to-end. Let me start with why this problem matters.",
        ],
      },
      {
        slide: 'Slide 2 — Business Scenario',
        speaker: 'Tze Yee',
        time: '~1 min',
        lines: [
          "Arranging home care has a trust gap. A family needs elderly, child-special-needs, or post-surgery care — they must find a vetted caregiver with the right skills, for the right time slot, then pay upfront with no proof the visit happened.",
          "Families struggle to find a correctly-skilled, vetted caregiver, and it's risky to pay before care is delivered.",
          "Caregivers have no simple way to publish availability, get matched to suitable jobs, and be paid fairly and on time.",
          "And without escrow, proof, and ratings, neither side is protected if a visit is missed or disputed.",
          "CareConnect closes the gap: it auto-matches caregivers by declared skills, books the slot, and holds payment in escrow — releasing it only after the caregiver completes the visit and the family confirms. Money only moves when care actually happens.",
        ],
      },
      {
        slide: 'Slide 3 — User Story Summary',
        speaker: 'Tze Yee',
        time: '~1.5 min',
        lines: [
          "We scoped this into three user stories spanning the whole lifecycle.",
          "US1 — onboarding and request: a caregiver registers with skills and care-type preferences, completes a profile with a photo, and declares availability slots, instantly visible to families. Interesting bit: registration spans three external services in one composite call — Party, Product taxonomy, and S3 photo storage.",
          "US2 — matching and accept/reject: a family submits a request — one call books the slot, creates the request, holds Stripe payment, and publishes a RabbitMQ event. A two-pass algorithm matches skill-preferred first, then care-type fallback, with round-robin fairness. No response → a Timer retries every 30 min and escalates after three attempts.",
          "US3 — completion, AI summary, payment: the caregiver uploads proof and notes; OpenAI generates a care summary, non-blocking. The family confirms, and ConfirmAndRelease captures payment, releases payout, and updates the rating across five atomic services. The AI summary is decoupled from payment — an OpenAI failure never blocks a caregiver getting paid.",
        ],
      },
      {
        slide: 'Slide 4 — Main Business Process',
        speaker: 'Tze Yee',
        time: '~1 min',
        lines: [
          "Here's the end-to-end flow across four swimlanes — Family, Caregiver, System, Payment.",
          "It starts with the caregiver adding availability slots. The family submits a request and pays — payment goes into Escrow Held. The system matches and assigns a caregiver via the skills algorithm and RabbitMQ.",
          "The caregiver accepts or rejects. On reject, the system re-matches — a Timer escalates if needed. On accept, the caregiver later completes the visit with notes and a photo, the AI summary is populated, and the family confirms — which moves payment from Held to Released.",
          "Money only flows at the two ends — held at booking, released at confirmation.",
          "[Handover] Madeline will now take you through the SOA architecture behind each story.",
        ],
      },
      {
        slide: 'Slide 5 — SOA Architecture · US1',
        speaker: 'Madeline',
        time: '~1.5 min',
        lines: [
          "Our architecture has four layers — UI, Composite, Atomic, Wrapper — and the golden rule is the UI only ever talks to CC_Orchestration, never to atomic services or wrappers directly.",
          "Caregiver registration: the UI posts to CC_Orchestration's RegisterUser. That composite calls the SMULab Party wrapper to create a real-world person and get a PartyId; the Product wrapper for the care-type taxonomy; and our Caregiver atomic service to create the caregiver with those skills.",
          "Profile setup adds an S3 upload through the wrapper, storing just the S3 key. Declaring a slot calls the AvailabilitySlot atomic service — the slot is then live for families.",
          "Key point: every external dependency is hidden behind the composite layer, so the UI carries no API keys and atomic services stay independently deployable.",
        ],
      },
      {
        slide: 'Slide 6 — SOA Architecture · US2',
        speaker: 'Madeline',
        time: '~1.5 min',
        lines: [
          "US2 is our most orchestration-heavy flow. RequestCareVisit does five things in sequence: books the slot (409 if taken, stops the flow); creates the care request; creates a held Stripe PaymentIntent; records the Payment as Held; and publishes a RabbitMQ event — with compensating rollback at every step.",
          "Then matching runs server-side, no UI — the point of the async event. Pass 1 lists caregivers matched on skill class AND skill type, excluding already-notified ones, ordered by last-assigned for fairness. If Pass 1 finds nobody, Pass 2 drops the skill-type preference and falls back to care-type only — so no request is left unassigned due to a skill gap.",
          "On a match it assigns the caregiver and publishes caregiver.matched. If the caregiver doesn't respond, the Timer increments attempts, re-runs matching with an exclusion list, and escalates to admin review after three attempts.",
        ],
      },
      {
        slide: 'Slide 7 — SOA Architecture · US3',
        speaker: 'Madeline',
        time: '~1.5 min',
        lines: [
          "US3 splits into two phases. CompleteVisit: the caregiver's proof photo goes to S3, the visit is marked Completed, and we call the OpenAI wrapper to generate a care summary from the notes. This phase holds the payment; it doesn't touch money.",
          "ConfirmAndRelease — our most complex composite. When the family confirms it: confirms the visit; captures the Stripe payment from held state; flips Payment to Released; closes the parent care request; recomputes the caregiver's rating and increments their visit count; and publishes visit.confirmed.",
          "That's five atomic services plus Stripe and RabbitMQ in one ordered orchestration. The AI summary lives in the first phase, so if OpenAI fails the caregiver still gets paid in the second. We kept money off the AI's critical path.",
          "[Handover] Chenchen will now cover the data design and what we built beyond the labs.",
        ],
      },
      {
        slide: 'Slide 8 — Service Operations',
        speaker: 'Chenchen',
        time: '~1 min',
        lines: [
          "We built six atomic services, each owning exactly one entity with a clean REST API.",
          "Caregiver — register, profile, photo, rating, skills. Family — registration and profile. AvailabilitySlot — list, create, delete, and the book/unbook pair that enforces double-booking protection at the service boundary.",
          "CareRequest — create, status transitions, assign, cancel, increment-attempts (used by the Timer). CareVisit + Payment — visit lifecycle plus payment operations: create, release, refund.",
          "Three of these — Caregiver, CareRequest, Payment — are reused across all three user stories: the SOA reuse principle in practice.",
        ],
      },
      {
        slide: 'Slide 9 — Database Schema',
        speaker: 'Chenchen',
        time: '~1 min',
        lines: [
          "Each atomic service owns its own table — no shared tables, keeping services independently deployable.",
          "On CareRequest, FamilyUserId stores the platform UserId, not the Family entity's PK — so requests are keyed to who's logged in.",
          "NotifiedCaregiverIds is a denormalised comma-separated list — lets the matching algorithm and Timer track who's already contacted without a join.",
          "CareVisit and Payment hold the Stripe identifiers — PaymentIntentId, TransferId, RefundId — so every transaction is traceable back to Stripe.",
          "The schema directly supports matching, escrow, and audit.",
        ],
      },
      {
        slide: 'Slide 10 — Beyond the Labs',
        speaker: 'Chenchen',
        time: '~1.5 min',
        lines: [
          "Eight ways beyond the labs — four that matter most:",
          "RabbitMQ async pub-sub — request submission and matching are fully decoupled; the family's flow finishes instantly, matching runs on the server.",
          "Stripe payment escrow — payment held at booking, released only on confirmation. A real financial trust mechanism, not a simulated payment.",
          "OpenAI GPT-4o-mini — generates the care summary from raw notes, improving the record without adding caregiver workload, and non-blocking.",
          "Two-pass matching — skill-preferred with care-type fallback, plus round-robin via last-assigned so the same caregiver isn't picked every time.",
          "The others — S3 storage, the three-level Product hierarchy, Party for real identity, and Timer-driven escalation — each map to a genuine need in the caregiving scenario.",
        ],
      },
      {
        slide: 'Slide 11 — Demo & Wrap-up',
        speaker: 'Chenchen / all',
        time: '~3-4 min',
        lines: [
          "What we'll show live: 1) Book a care request — family picks a caregiver and time, pays with the Stripe test card, escrow goes Held. 2) Accept / reject — the caregiver accepts to create the visit; we also reject one to show re-matching. 3) Complete and confirm — the caregiver uploads proof, the family confirms, payment goes Released with the AI summary.",
          "Why it meets the brief: six atomic services each owning their entity, with Caregiver, CareRequest, Payment reused across all three stories; composite services orchestrating multiple atomics; real business exceptions — reject re-matches, no-response escalates, escrow only releases on confirmation; and beyond-the-labs depth in RabbitMQ, S3, Party, OpenAI, Stripe — each justified by the scenario.",
          "Let's switch to the live system.",
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────
  // MY PARTS — Atomic Services + User Story 3
  // ──────────────────────────────────────────────────────────────
  {
    id: 'my-parts',
    title: 'My Parts — Atomic Services + US3',
    subtitle: 'Slides 7, 8, 9 · ~3.5-4 min · speak the why, point at the diagram',
    slides: [
      {
        slide: 'Slide 7 — User Story 3: Visit Completion',
        time: '~1.5 min',
        lines: [
          "Opening (after handover): Thanks [name]. User Story 3 is where care gets delivered and paid — our most complex orchestration. It runs in two phases.",
          "Phase 1 — CompleteVisit (caregiver): after the visit, the caregiver uploads a proof photo (to S3) and writes notes. We mark the visit Completed, then call the OpenAI wrapper to turn raw notes into a structured care summary stored on the visit. This phase doesn't touch money — payment stays held.",
          "Phase 2 — ConfirmAndRelease (family): when the family confirms, this single composite coordinates five atomic services plus Stripe and RabbitMQ — confirms the visit; captures the Stripe payment from held state; flips Payment to Released; closes the parent care request; recomputes the caregiver's rating and increments visit count; publishes visit.confirmed.",
          "KEY INSIGHT (say clearly): the AI summary is in Phase 1, payment release in Phase 2 — deliberate. If OpenAI fails, the caregiver still gets paid. An external AI should never block someone's wages.",
          "[Transition] That ConfirmAndRelease flow touches five atomic services — so let me show you the atomic service design itself.",
        ],
      },
      {
        slide: 'Slide 8 — Service Name & Operations',
        time: '~1.5 min',
        lines: [
          "We built six atomic services, and the rule is one service owns exactly one entity with a clean REST API. Nothing shares a database — that keeps them independently deployable.",
          "Caregiver — registration, profile, photo, rating, and the skills list that drives matching. Family — registration and profile.",
          "AvailabilitySlot — list, create, delete, and the book/unbook pair that enforces double-booking protection right at the service boundary, not in the UI.",
          "CareRequest — create, status transitions, assign caregiver, cancel, and increment-attempts (called by the reassignment Timer).",
          "CareVisit + Payment — the visit lifecycle plus payment operations: create, release, and refund.",
          "SOA takeaway: three of these — Caregiver, CareRequest, Payment — are reused across all three user stories. That reuse is the whole reason we split them this way.",
          "[Transition] And each owns its own database table — here's the schema.",
        ],
      },
      {
        slide: 'Slide 9 — Database Schema',
        time: '~45 sec',
        lines: [
          "Every atomic service owns its own table — six separate databases, no shared tables, which lets each be deployed and scaled independently.",
          "On CareRequest, FamilyUserId stores the platform UserId, not the Family entity's PK — requests are keyed to whoever's logged in.",
          "NotifiedCaregiverIds is a denormalised comma-separated list — lets the matching algorithm and Timer remember who's already contacted, without an extra join.",
          "CareVisit and Payment carry the Stripe identifiers — PaymentIntentId, TransferId, RefundId — so every transaction traces straight back to Stripe for audit.",
          "The schema isn't generic — it's shaped around matching, escrow, and auditability.",
          "[Handover] Next speaker covers what we built beyond the labs.",
        ],
      },
      {
        slide: 'Q&A Prep — likely questions on my parts',
        lines: [
          "Why two phases for visit completion? → So payment release requires explicit family confirmation. The caregiver completing holds the money; only the family confirming releases it. It's the escrow trust mechanism in action.",
          "Why is the AI summary not in ConfirmAndRelease? → To keep an external dependency off the payment path. If OpenAI is down, the caregiver must still be paid — summary at completion, payment at confirmation, independent of AI.",
          "Why is Payment in the same module as CareVisit? → They share a tight lifecycle — a payment exists per visit and releases on visit confirmation. One atomic service (CareConnect_CareVisit), distinct tables.",
          "How do you prevent double-booking? → The AvailabilitySlot book operation returns 409 if already booked — enforced at the service boundary, so the UI can't bypass it.",
          "What if ConfirmAndRelease fails midway? → Ordered REST calls across services; full saga compensation is a documented future enhancement; the critical guard is payment only captures after the visit-confirm step succeeds.",
        ],
      },
    ],
  },
]
