export type LanguageCode = 'en' | 'am' | 'om' | 'ti';

export type JourneyStage = 'learn' | 'prevent' | 'monitor' | 'seek_care' | 'emergency';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  dangerSignDetected?: boolean;
}

/**
 * Learn Topic Card item
 * Reviewed for WHO and Ethiopian Federal Ministry of Health (FMoH) alignment
 */
export interface LearnTopic {
  id: string;
  title: string;
  titleAm: string;
  titleOm: string;
  titleTi: string;
  category: 'puberty' | 'menstruation' | 'contraception' | 'stis' | 'fertility' | 'pregnancy' | 'postnatal';
  iconName: string;
  shortSummary: string;
  detailedExplainer: string[];
  keyFacts: string[];
  suggestedPrompt: string;
}

/**
 * Prevent Questionnaire Responses & Recommendation
 */
export interface PreventAnswers {
  ageGroup: string;
  pregnancyIntention: string;
  currentMethod: string;
  preferences: string[];
}

export interface PreventRecommendation {
  primaryOptions: string[];
  emergencyAdvice?: string;
  stiDualProtectionNote: string;
  clinicalConfirmNote: string;
}

/**
 * Monitor Tracker Entry
 */
export interface TrackerEntry {
  id: string;
  date: string;
  type: 'cycle' | 'pregnancy';
  cycleDay?: number;
  pregnancyWeek?: number;
  symptoms: string[];
  mood: string;
  notes?: string;
  isDangerSign: boolean;
  dangerDetails?: string;
}

/**
 * Seek Care Triage Result & Flow Types
 */
export type TriageColor = 'green' | 'amber' | 'red';
export type TriageUrgency = 'self_care' | 'clinic_soon' | 'go_immediately';

export interface TriageSurveyAnswers {
  bleeding: string;
  pain: string;
  fever: string;
  pregnancyStatus: string;
  pregnancySpecific: string;
  safety: string;
  symptomDuration: string;
}

export interface TriageAssessmentResult {
  color: TriageColor;
  title: string;
  headline: string;
  urgencyLevel: string;
  reasons: string[];
  plainLanguageNextSteps: string[];
  recommendedFacilityType: string;
  vitalsToCheck: string[];
  questionsForClinician: string[];
  timestamp: string;
}

export interface TriageCondition {
  id: string;
  label: string;
  urgency: TriageUrgency;
  actionText: string;
  warningNotice?: string;
  suggestedQuestionsForProvider: string[];
}

/**
 * Health Facility in Ethiopia
 */
export interface HealthFacility {
  id: string;
  name: string;
  region: string;
  woreda?: string;
  type: 'Health Post (HEWs)' | 'Health Center (YFS)' | 'Primary Hospital' | 'Referral / General Hospital' | 'Marie Stopes / FGAE Clinic';
  services: string[];
  phone: string;
  address: string;
  isYouthFriendly?: boolean;
}
