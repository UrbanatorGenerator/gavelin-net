export interface Article {
  url: string;
  title: string;
  description: string;
  date: string;
  category: string;
}

export const articles: Article[] = [
  {
    url: "/en/insights/revenue-architecture-reset/",
    title: "The Revenue Architecture Reset: Why Tactical Fixes Fail When the Foundation Is Broken",
    description: "If your B2B revenue growth feels like a hamster wheel — lots of effort, little forward motion — it's not because you need a new CRM or more sales hires. It's because your revenue architecture is broken.",
    date: "June 25, 2026",
    category: "Sales Systems & Revenue Operations",
  },
  {
    url: "/en/insights/velocity-trap/",
    title: "The Velocity Trap: Why Pushing for Speed Is Killing Your B2B Sales Momentum",
    description: "Most B2B sales leaders are obsessed with speed. Shorter cycles, faster closes, push reps to move it along. Here's the inconvenient truth: pushing for speed often backfires.",
    date: "June 16, 2026",
    category: "Pipeline & Sales Leadership",
  },
  {
    url: "/en/insights/deal-framework/",
    title: "The D.E.A.L. Framework: Scale Revenue Without Adding People",
    description: "A simple but powerful approach to build a revenue system that scales cleanly — without adding headcount or relying on miracle workers.",
    date: "June 10, 2026",
    category: "Sales Systems & AI",
  },
  {
    url: "/en/insights/deals-stalled-at-80/",
    title: "Deals Stalled at 80% — What Do You Do Now?",
    description: "The \"internal discussion\" stall is the most common deal-killer in B2B sales. Here's why it happens and three concrete tactics to break free.",
    date: "June 2, 2026",
    category: "Pipeline & Stakeholder Management",
  },
  {
    url: "/en/insights/hidden-reason-buyers-stall/",
    title: "The Hidden Reason Buyers Stall — and How to Fix It Fast",
    description: "Your sales process is probably designed for sellers, not buyers. That's why deals stall, cycles stretch, and prospects slip away quietly.",
    date: "May 13, 2026",
    category: "Sales Process & Buyer Psychology",
  },
  {
    url: "/en/insights/invisible-quota/",
    title: "The Invisible Quota: How Leaders Cap Their Own Revenue Growth",
    description: "Twelve straight quarters of quota attainment sounds like success. But what if it's actually a ceiling — made invisible by cautious leadership choices?",
    date: "May 7, 2026",
    category: "Sales Leadership & Commercial Governance",
  },
  {
    url: "/en/insights/from-hours-to-minutes/",
    title: "From Hours to Minutes: Meet Your New AI Sales Assistant",
    description: "AI isn't just improving sales — it's redesigning it. Not someday. This year. Here's what that actually looks like in practice.",
    date: "April 21, 2026",
    category: "AI in Sales",
  },
  {
    url: "/en/insights/control-vs-enablement/",
    title: "Control vs. Enablement: How to Lead Sales Teams Without Killing Their Fire",
    description: "The Sales Leader's Dilemma: too much control kills initiative, too little creates chaos. Here's how to find the balance using the D.E.A.L. framework.",
    date: "April 1, 2026",
    category: "Sales Leadership",
  },
  {
    url: "/en/insights/revenue-ops-blind-spot/",
    title: "The Revenue Ops Blind Spot: When Process Becomes Paralysis",
    description: "Revenue Operations was supposed to streamline sales. For many B2B companies it has done the opposite — creating bureaucracy that frustrates reps, slows deals, and kills momentum.",
    date: "March 26, 2026",
    category: "Revenue Operations & Sales Management",
  },
  {
    url: "/en/insights/from-firefighting-to-forecasting/",
    title: "From Firefighting to Forecasting: Reclaim Your Time as a Sales Leader",
    description: "Most sales leaders spend 80% of their time firefighting. Here's how to flip that ratio — and what one Stockholm SaaS company achieved in three months using the D.E.A.L. framework.",
    date: "March 17, 2026",
    category: "Sales Leadership & Pipeline Management",
  },
  {
    url: "/en/insights/precision-prospecting/",
    title: "The Art of Precision Prospecting: How Signal Detection Changes the Sales Game",
    description: "Most sales teams think their problem is too few leads. The real problem is too many low-probability opportunities clogging the pipeline. Here's how signal-based prospecting fixes that.",
    date: "March 5, 2026",
    category: "Prospecting & Pipeline Strategy",
  },
  {
    url: "/en/insights/meet-uno/",
    title: "Meet Uno: My $8 Digital Colleague Changing the Game of Business",
    description: "I built a digital coworker equipped with my knowledge in sales, leadership, and business strategy — for roughly $8. Here's what it signals about the shift already underway.",
    date: "February 28, 2026",
    category: "AI in Business & Sales",
  },
  {
    url: "/en/insights/stop-loving-your-solution/",
    title: "Stop Loving Your Solution. Start Solving the Problem.",
    description: "The quiet trap that kills more companies than bad strategy: falling in love with your product instead of your customer's problem. Here's how to make the shift.",
    date: "January 27, 2026",
    category: "Sales Strategy & Commercial Clarity",
  },
  {
    url: "/en/insights/scaling-chaos/",
    title: "Scaling Chaos: The Silent Cost of AI in Sales",
    description: "Most sales teams are stuck at Level 1 AI — accelerating chaos rather than transforming it. Here's how to diagnose which level you're really at, and what it takes to reach Level 3.",
    date: "January 20, 2026",
    category: "AI in Sales & Sales Leadership",
  },
  {
    url: "/en/insights/likeability-beats-trust/",
    title: "Why Likeability Beats Trust in Today's Business Landscape",
    description: "In low-trust environments, likeability becomes the golden currency. Lessons from South America on how to lead with warmth, presence, and human resonance — before you earn trust.",
    date: "January 13, 2026",
    category: "Sales Psychology & Commercial Presence",
  },
  {
    url: "/en/insights/when-ai-starts-selling/",
    title: "When AI Starts Selling Without You — And Stops Asking for Permission",
    description: "AI is already pre-qualifying, pre-judging, and pre-selecting B2B sellers before buyers ever reach out. Whoever shows up best in the AI's pre-meeting research wins — even before the first call.",
    date: "October 30, 2025",
    category: "AI in Sales & Future of Selling",
  },
  {
    url: "/en/insights/selling-to-ai-savvy-buyers/",
    title: "When Selling to the AI-Savvy Buyer: The Tables Have Turned",
    description: "Buyers now arrive armed with AI-researched data, competitor comparisons, and your customer reviews. They don't need more information — they need better judgement.",
    date: "October 22, 2025",
    category: "AI in Sales & Buyer Psychology",
  },
  {
    url: "/en/insights/ai-agents-death-of-b-player/",
    title: "AI Agents Will Be the Death of the B Player",
    description: "AI agents won't kill your sales team — but they will expose it. The more predictable your process, the faster AI automates it. Here's the mental model shift that separates the winners from the rest.",
    date: "October 10, 2025",
    category: "AI in Sales & Sales Leadership",
  },
  {
    url: "/en/insights/buyers-avoid-your-sales-team/",
    title: "Buyers Avoid Your Sales Team on Purpose — and That Changes Everything",
    description: "71% of B2B buyers don't want to talk to your sales team. They're buying from your competitor without you knowing. Here's what LinkedIn's 2025 data reveals — and what to do about it.",
    date: "October 8, 2025",
    category: "B2B Sales Strategy & Thought Leadership",
  },
  {
    url: "/en/insights/revolutionize-your-sales-day-with-ai/",
    title: "How Simply You Can Revolutionise Your Sales Day with AI",
    description: "A packed full day of AI for salespeople — and the response was electric. Here's why getting started with AI is simpler than most people think, and what it looks like in practice.",
    date: "September 9, 2025",
    category: "AI in Sales & Sales Training",
  },
];
