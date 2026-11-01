import hivContent from './hiv.json';
import stisContent from './stis.json';
import pregnancyContent from './pregnancy.json';
import postnatalContent from './postnatal.json';
import contraceptionContent from './contraception.json';
import emergenciesContent from './emergencies.json';
import menstrualHealthContent from './menstrual_health.json';

export type ReviewStatus = 'draft' | 'clinician-reviewed' | 'approved';

export type ContentTopic =
  | 'HIV'
  | 'STIs'
  | 'Pregnancy'
  | 'Postnatal'
  | 'Contraception'
  | 'Emergencies'
  | 'Menstrual Health';

export interface ContentEntry {
  id: string;
  title: string;
  language: string;
  topic: ContentTopic;
  sourceOrganization: string;
  sourceUrl: string;
  lastReviewedDate: string;
  reviewStatus: ReviewStatus;
  version: string;
  summary: string;
  keyPoints: string[];
  detailedContent: string[];
  whenToSeeClinician: string;
  keywords: string[];
  ethiopiaContext?: string;
}

export const TOPIC_FILES: Record<string, ContentTopic> = {
  hiv: 'HIV',
  stis: 'STIs',
  pregnancy: 'Pregnancy',
  postnatal: 'Postnatal',
  contraception: 'Contraception',
  emergencies: 'Emergencies',
  menstrual_health: 'Menstrual Health',
};

// Combine all 7 topic files into one unified master content library
export const MASTER_CONTENT_LIBRARY: ContentEntry[] = [
  ...(hivContent as ContentEntry[]),
  ...(stisContent as ContentEntry[]),
  ...(pregnancyContent as ContentEntry[]),
  ...(postnatalContent as ContentEntry[]),
  ...(contraceptionContent as ContentEntry[]),
  ...(emergenciesContent as ContentEntry[]),
  ...(menstrualHealthContent as ContentEntry[]),
];

/**
 * Priority weighting for review status:
 * approved (3) > clinician-reviewed (2) > draft (1)
 */
export function getStatusWeight(status: ReviewStatus): number {
  switch (status) {
    case 'approved':
      return 3;
    case 'clinician-reviewed':
      return 2;
    case 'draft':
      return 1;
    default:
      return 0;
  }
}

/**
 * Returns human-readable label for review status
 * Draft content explicitly displays "Not yet reviewed"
 */
export function getReviewStatusLabel(status: ReviewStatus): {
  label: string;
  isDraft: boolean;
  badgeClass: string;
} {
  switch (status) {
    case 'approved':
      return {
        label: 'Approved',
        isDraft: false,
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      };
    case 'clinician-reviewed':
      return {
        label: 'Clinician-Reviewed',
        isDraft: false,
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
      };
    case 'draft':
    default:
      return {
        label: 'Not yet reviewed',
        isDraft: true,
        badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
      };
  }
}

/**
 * Filter library by topic
 */
export function getContentByTopic(topic: ContentTopic): ContentEntry[] {
  return MASTER_CONTENT_LIBRARY.filter((item) => item.topic === topic).sort(
    (a, b) => getStatusWeight(b.reviewStatus) - getStatusWeight(a.reviewStatus)
  );
}

export interface SearchMatch {
  entry: ContentEntry;
  score: number;
}

/**
 * Searches the unified content library:
 * - Scores keyword and text relevance
 * - Multiplies/boosts approved entries first
 * - Falls back to clinician-reviewed, then draft
 */
export function queryContentLibrary(
  query: string,
  preferredLang?: string,
  minScore = 2
): {
  results: ContentEntry[];
  bestMatch: ContentEntry | null;
  nothingFound: boolean;
} {
  const clean = query.toLowerCase().trim();
  if (!clean) {
    return { results: [], bestMatch: null, nothingFound: true };
  }

  const queryTerms = clean
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9\u1200-\u137F]/gi, ''))
    .filter((w) => w.length > 1);

  const isEthiopicQuery = /[\u1200-\u137F]/.test(clean);
  const detectedLang = preferredLang || (isEthiopicQuery ? 'am' : 'en');

  const scored: SearchMatch[] = [];

  for (const entry of MASTER_CONTENT_LIBRARY) {
    let score = 0;
    const titleLower = entry.title.toLowerCase();
    const summaryLower = entry.summary.toLowerCase();
    const topicLower = entry.topic.toLowerCase();

    // Boost matching language entry
    if (entry.language === detectedLang) {
      score += 10;
    }

    // 1. Exact phrase matches
    if (titleLower.includes(clean)) score += 20;
    if (summaryLower.includes(clean)) score += 10;
    if (topicLower.includes(clean)) score += 8;

    // 2. Keyword hits
    for (const kw of entry.keywords) {
      const kwLower = kw.toLowerCase();
      if (clean.includes(kwLower)) {
        score += 15;
      } else if (kwLower.includes(clean)) {
        score += 8;
      }
    }

    // 3. Individual term hits
    for (const term of queryTerms) {
      if (titleLower.includes(term)) score += 4;
      if (summaryLower.includes(term)) score += 2;
      for (const kw of entry.keywords) {
        if (kw.toLowerCase().includes(term)) score += 3;
      }
      for (const kp of entry.keyPoints) {
        if (kp.toLowerCase().includes(term)) score += 2;
      }
    }

    // 4. Boost approved and clinician-reviewed content over draft
    if (score > 0) {
      const statusMultiplier =
        entry.reviewStatus === 'approved'
          ? 1.5
          : entry.reviewStatus === 'clinician-reviewed'
          ? 1.2
          : 0.8;
      const finalScore = score * statusMultiplier;
      if (finalScore >= minScore) {
        scored.push({ entry, score: finalScore });
      }
    }
  }

  // Sort by score descending, breaking ties by reviewStatus weight
  scored.sort((a, b) => {
    if (Math.abs(b.score - a.score) > 0.1) {
      return b.score - a.score;
    }
    return getStatusWeight(b.entry.reviewStatus) - getStatusWeight(a.entry.reviewStatus);
  });

  const results = scored.map((s) => s.entry);
  const bestMatch = results[0] || null;
  const nothingFound = results.length === 0;

  return { results, bestMatch, nothingFound };
}

/**
 * Formats a chatbot response from a library entry, including:
 * - Content points
 * - "When to see a clinician" section
 * - Source organization and URL
 * - Review status (with "Not yet reviewed" label for draft)
 */
export function formatContentAnswer(entry: ContentEntry): string {
  const isAmharic = entry.language === 'am';
  const statusInfo = getReviewStatusLabel(entry.reviewStatus);
  const isEmergency = entry.topic === 'Emergencies' || entry.id.includes('pep') || entry.id.includes('danger');

  let output = '';

  // Top header with status and topic
  output += `📚 **${entry.title}**\n\n`;

  if (statusInfo.isDraft) {
    output += isAmharic
      ? `⚠️ *[ማሳሰቢያ፡ ይህ መረጃ በረቂቅ ደረጃ ላይ ያለ እና በህክምና ቦርድ ገና ያልተገመገመ ነው። እባክዎ ከሀኪም ጋር ያረጋግጡ።]*\n\n`
      : `⚠️ *[Notice: This content is currently a Draft and Not yet reviewed by the medical board. Always verify with a licensed clinician.]*\n\n`;
  }

  output += `${entry.summary}\n\n`;

  // Key takeaways
  output += isAmharic ? `**ዋና ዋና የህክምና መመሪያዎች፡**\n` : `**Key Clinical Guidelines:**\n`;
  for (const kp of entry.keyPoints) {
    output += `• ${kp}\n`;
  }

  // Ethiopia context if present
  if (entry.ethiopiaContext) {
    output += isAmharic
      ? `\n**የኢትዮጵያ ሁኔታ፡** ${entry.ethiopiaContext}\n`
      : `\n**Context in Ethiopia:** ${entry.ethiopiaContext}\n`;
  }

  // Mandatory clinician section
  output += isAmharic
    ? `\n**ሀኪም ማየት ያለብዎት መቼ ነው፡** ${entry.whenToSeeClinician}\n\n`
    : `\n**When to see a clinician:** ${entry.whenToSeeClinician}\n\n`;

  // Source name and review metadata under answer
  output += `---\n`;
  output += isAmharic
    ? `🏷️ **ምንጭ (Source):** ${entry.sourceOrganization}\n`
    : `🏷️ **Source:** ${entry.sourceOrganization}\n`;
  output += isAmharic
    ? `📋 **የክሊኒካል ሁኔታ፡** ${entry.reviewStatus === 'approved' ? 'የፀደቀ (Approved)' : statusInfo.label} (v${entry.version} • የተገመገመበት፡ ${entry.lastReviewedDate})\n`
    : `📋 **Clinical Status:** ${statusInfo.label} (v${entry.version} • Reviewed: ${entry.lastReviewedDate})\n`;
  if (entry.sourceUrl) {
    output += isAmharic
      ? `🔗 **ማጣቀሻ (Reference):** ${entry.sourceUrl}\n`
      : `🔗 **Reference:** ${entry.sourceUrl}\n`;
  }

  if (isEmergency) {
    output += isAmharic
      ? `\n*በኢትዮጵያ ነጻ የድንገተኛ ህክምና ድጋፍ፡ 8335 (የጤና ጥበቃ) ወይም 907 (ቀይ መስቀል አምቡላንስ) ይደውሉ።*`
      : `\n*Free Ethiopian Emergency Support: Dial 8335 (FMoH) or 907 (Red Cross Ambulance).*`;
  }

  if (isAmharic) {
    output += `\n\n*ማስተባበያ፡ እኔ የ AI መመሪያ ረዳት እንጂ ሀኪም አይደለሁም።*`;
  }

  return output;
}

/**
 * Standard message when nothing relevant is found in the approved library.
 * Directs user to a clinician as requested.
 */
export function getNoMatchClinicianFallback(query: string, language?: string): string {
  const isAmharic = language === 'am' || /[\u1200-\u137F]/.test(query);
  if (isAmharic) {
    return `በተፈቀደው የህክምና ይዘት ቤተ-መጽሐፍታችን ውስጥ ከ "${query}" ጋር የሚዛመድ የተረጋገጠ መረጃ ማግኘት አልቻልኩም።

የስነ-ተዋልዶ እና የእናቶች ጤና ውሳኔዎች ለደህንነትዎ ወሳኝ በመሆናቸው፣ ከግምት ይልቅ ትክክለኛ የህክምና መመሪያ እንዲያገኙ እፈልጋለሁ።

**ሀኪም ማየት ያለብዎት መቼ ነው፡** እባክዎ ፈቃድ ያለው ሀኪም፣ አዋላጅ ወይም በአቅራቢያዎ የሚገኝ የጤና ኬላ ወይም ጤና ጣቢያ በመሄድ የባለሙያ ምርመራ ያድርጉ።

**ሚስጥራዊ ነጻ የስልክ መስመሮች በኢትዮጵያ፡**
• **8335 (ነጻ መስመር)፡** የኢትዮጵያ ጤና ጥበቃ ሚኒስቴር ብሄራዊ የጤና መረጃ መስመር
• **8044 (ነጻ መስመር)፡** ማሪ ስቶፕስ ኢትዮጵያ የስነ-ተዋልዶ ጤና ማማከሪያ
• **907 (ነጻ መስመር)፡** የኢትዮጵያ ቀይ መስቀል አምቡላንስ አገልግሎት

*ማስተባበያ፡ እኔ የ AI መመሪያ ረዳት እንጂ ሀኪም አይደለሁም።*`;
  }

  return `I could not find verified clinical information matching "${query}" in our approved medical content library.

Because sexual, reproductive, and maternal health decisions are critical to your safety, I want to ensure you receive accurate medical guidance rather than guesses.

**When to see a clinician:** Please consult a licensed doctor, midwife, or visit your nearest Kebele Health Post or Woreda Health Center for professional assessment and in-person care.

**Confidential Helplines in Ethiopia:**
• **8335 (Toll-Free):** Ethiopian Federal Ministry of Health National Health Information Line
• **8044 (Toll-Free):** Marie Stopes Ethiopia Reproductive Health Helpline
• **907 (Toll-Free):** Ethiopian Red Cross Ambulance Service (for acute emergencies)

*Disclaimer: I'm an AI guide, not a doctor. I provide evidence-based library resources only.*`;
}
