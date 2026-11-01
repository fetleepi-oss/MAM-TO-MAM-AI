export type LanguageCode = 'en' | 'am' | 'om' | 'ti' | 'so' | 'aa' | 'sid';

export type LanguageStatus = 'reviewed' | 'machine_translated' | 'not_available';

export interface LanguageConfig {
  code: LanguageCode;
  name: string;
  nativeName: string;
  status: LanguageStatus;
  statusLabel: 'Reviewed' | 'Machine-translated, awaiting review' | 'Not yet available';
  isClinicalReviewed: boolean;
  description: string;
}

export interface QuickReplyItem {
  label: string;
  query: string;
}

export interface TranslationStrings {
  appName: string;
  tagline: string;
  footerNote: string;
  badgeMvp: string;
  badgePrivacy: string;
  privacyModalTitle: string;
  privacyModalIntro: string;
  privacyModalBullets: string[];
  privacyModalButton: string;
  journeyTitle: string;
  askMamButton: string;
  askMamTitle: string;
  dangerAlertBanner: string;
  dangerModalTitle: string;
  dangerModalSubtitle: string;
  stages: {
    learn: { title: string; subtitle: string; desc: string };
    prevent: { title: string; subtitle: string; desc: string };
    monitor: { title: string; subtitle: string; desc: string };
    seek_care: { title: string; subtitle: string; desc: string };
    emergency: { title: string; subtitle: string; desc: string };
  };
  chatPlaceholder: string;
  chatSend: string;
  disclaimer: string;
  whenToSeeClinician: string;
  emergencyHotlines: string;
  callNow: string;
  quickReplies: QuickReplyItem[];
  quickRepliesTitle: string;
  feedbackHelpful: string;
  feedbackYes: string;
  feedbackNo: string;
  feedbackThanksYes: string;
  feedbackThanksNo: string;
  dangerPrecheckNotice: string;
  typingIndicator: string;
  // Translation Safety and Error Reporting
  translationPendingNoticeTitle: string;
  translationPendingNoticeBody: string;
  reportTranslationError: string;
  reportModalTitle: string;
  reportModalSubtitle: string;
  reportLanguageLabel: string;
  reportSectionLabel: string;
  reportWordPhraseLabel: string;
  reportSuggestionLabel: string;
  reportSubmit: string;
  reportCancel: string;
  reportSuccessTitle: string;
  reportSuccessMsg: string;
}

export interface TranslationErrorReport {
  id: string;
  language: LanguageCode;
  section: string;
  originalText: string;
  suggestedCorrection: string;
  userNote?: string;
  timestamp: number;
  status: 'saved_locally' | 'queued_for_review';
}
