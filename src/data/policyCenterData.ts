/**
 * Policy Center Data & Review-Ready Templates
 *
 * All policy documents are prepared as plain-language, review-ready legal templates.
 * Every policy includes the mandatory banner: "Draft, pending legal review."
 * Placeholders are provided for organization legal entity, physical address, and contact points.
 */

export interface PolicySection {
  id: string;
  title: string;
  shortLabel: string;
  iconName: string;
  summary: string;
  effectiveDate: string;
  version: string;
  sections: {
    heading: string;
    content: string;
    highlight?: boolean;
    calloutType?: 'info' | 'warning' | 'alert' | 'success';
  }[];
  reviewReadyTemplate: string;
}

export const POLICY_META = {
  statusBanner: 'Draft, pending legal review.',
  statusDescription:
    'This document is a review-ready operational template prepared for institutional, clinical, and legal counsel review prior to formal public deployment.',
  organizationPlaceholder: '[Organization / Implementing Entity Legal Name]',
  addressPlaceholder: '[Physical Address: Sub-City, Woreda, Addis Ababa, Ethiopia]',
  countryPlaceholder: 'Federal Democratic Republic of Ethiopia',
  emailPlaceholder: '[legal-compliance@example.com]',
  dpoEmailPlaceholder: '[data-privacy@example.com]',
  hotlinePlaceholder: '[+251 11 XXX XXXX / Toll-Free 8335]',
  lastUpdated: 'February 2026',
  version: '1.0-draft',
};

export const POLICY_SECTIONS: PolicySection[] = [
  {
    id: 'privacy',
    title: 'Privacy Policy & Sensitive Health Data',
    shortLabel: 'Privacy & Health Data',
    iconName: 'ShieldCheck',
    summary:
      'How your data is protected with on-device storage, zero advertising tracking, and strict isolation of sensitive HIV, STI, and pregnancy records.',
    effectiveDate: 'February 2026',
    version: '1.0-draft',
    sections: [
      {
        heading: '1. Core Data Privacy Philosophy',
        content: `At ${POLICY_META.organizationPlaceholder}, we recognize that reproductive, maternal, and sexual health is deeply personal and confidential. MAM-to-MAM AI is built from the ground up on a **device-first, zero-tracking architecture**. 

Unlike standard commercial web applications, you do NOT need to create an account, provide an email address, enter your phone number, or disclose your government identification to access health guidance. All personal logs remain in your browser's private offline storage.`,
      },
      {
        heading: '2. Dedicated Section: Sensitive Health Data (HIV, STIs, & Pregnancy)',
        highlight: true,
        calloutType: 'warning',
        content: `**CRITICAL HEALTH DATA DISCLOSURE: HIV STATUS, STI RESULTS, AND PREGNANCY INFORMATION**

We treat any information concerning HIV transmission, antiretroviral therapy (ART), STI symptoms or test outcomes, contraception methods, menstrual cycles, and pregnancy milestones as **Special Category Sensitive Health Data**.

Because stigma, social discrimination, or unintended disclosure can carry severe risks, we enforce strict technological boundaries:

### What Stays Exclusively on Your Device:
* **Cycle & Period Logs:** Dates of your last menstrual period, cycle lengths, and estimated ovulation windows.
* **Pregnancy Milestones & Gestational Age:** Estimated due dates, gestational week counter, and trimester logs.
* **Symptom & Mood Notes:** Daily entries regarding nausea, abdominal cramping, discharge observations, or private journal entries.
* **Triage & Danger Sign Self-Assessments:** The specific symptom combinations you select during an emergency triage check.
* **Saved Facilities:** Pinned maternal health centers, clinics, or emergency ambulance numbers you save for quick access.
* **Local Health Reminders:** Scheduled medication reminders (which are displayed with non-stigmatizing, neutral titles such as "Daily Wellness Reminder" to protect your lockscreen privacy).
* **Neutral App Disguise Settings:** Your active camouflage profile (Calculator, Weather, Daily Notes).
* **Offline Clinical Packs:** Downloaded WHO / Ethiopian Ministry of Health guideline modules.

*None of the above items are ever transmitted to our servers or to third-party cloud databases.*

### What is Sent to the AI Provider (When Using Online "Ask MAM" Chat):
When you actively ask a question in the online chat interface, the following minimal data is sent via an encrypted, rate-limited server proxy to Google Gemini:
* **Your typed inquiry text** (e.g., "What are the common symptoms of syphilis during the second trimester?").
* **Recent conversational context** from your current active session so the assistant can understand follow-up questions.
* **Your selected language code** (e.g., 'am' for Amharic, 'om' for Afaan Oromoo, 'ti' for Tigrinya, 'en' for English).
* **Curated clinical guideline snippets** retrieved from our verified Ethiopian Ministry of Health / WHO local reference library to anchor the model to accurate medical protocols.

### What is NEVER Sent to the AI Provider:
* **NO personal identifiers:** No names, national IDs, or contact information.
* **NO device tracking:** No IMEI, MAC address, advertising identifiers, or IP addresses (IP addresses are terminated at our backend proxy and never forwarded to Gemini).
* **NO GPS or real-time location:** We never query or pass your precise GPS coordinates.
* **NO stored health history:** Your offline cycle history, pregnancy week, or past triage results are NEVER bundled into AI prompts.
* **NO server-side chat logs:** Conversations are processed in volatile memory and are not stored in persistent server databases.`,
      },
      {
        heading: '3. Legal Basis and User Consent',
        content: `Processing of user prompts occurs solely based on your explicit request to retrieve health information. Because you retain full control over local storage, you may revoke consent and clear all device history at any time using the "Delete Everything" feature.`,
      },
      {
        heading: '4. Third-Party Disclosures and Commercial Zero-Ad Policy',
        content: `We do NOT sell, rent, monetize, or lease your personal or health data to pharmaceutical companies, insurance providers, advertising brokers, or social media networks. Zero advertising pixels or cross-site telemetry are installed in this application.`,
      },
      {
        heading: '5. Data Controller and Contact Information',
        content: `For legal or privacy queries, contact the appointed Data Protection Representative:
* Organization: ${POLICY_META.organizationPlaceholder}
* Office: ${POLICY_META.addressPlaceholder}
* Privacy Desk: ${POLICY_META.dpoEmailPlaceholder}
* Hotline: ${POLICY_META.hotlinePlaceholder}`,
      },
    ],
    reviewReadyTemplate: `# [DRAFT - PENDING LEGAL REVIEW]
## PRIVACY POLICY & SENSITIVE HEALTH DATA PROTECTION TEMPLATE
**Organization Name:** [Organization / Implementing Entity Legal Name]  
**Registered Address:** [Physical Address: Sub-City, Woreda, Addis Ababa, Ethiopia]  
**Jurisdiction:** Federal Democratic Republic of Ethiopia  
**Effective Date:** [Date, Month, Year]  
**Version:** 1.0 (Draft)  

### 1. SCOPE AND APPLICABILITY
This Privacy Policy governs the processing of data collected through MAM-to-MAM AI (the "Application"), an educational maternal, newborn, and sexual and reproductive health decision-support system.

### 2. PRINCIPLE OF ON-DEVICE LOCAL SOVEREIGNTY
All personalized health metrics—including menstrual tracking, gestational age computations, symptom selections, triage self-evaluations, and saved emergency facilities—are stored exclusively within the User's local browser database (IndexedDB/Web Storage). The Application does not maintain user account registries on centralized servers.

### 3. SENSITIVE HEALTH DATA CLAUSE: HIV, STIs, AND PREGNANCY
(a) Classification: Information relating to HIV status, antiretroviral medication adherence, sexually transmitted infections (STIs), and pregnancy status constitutes Special Category Sensitive Data.
(b) Storage Restriction: No sensitive health data logs are persisted on external cloud servers.
(c) AI Query Transmission: Only user-initiated plain text chat prompts and associated reference guideline fragments are submitted to the AI inference provider (Google Gemini) via a stateless backend proxy. No client IP addresses or hardware identifiers are provided to the model provider.
(d) Notification Discretion: Health reminders generated by the Application must not display clinical or diagnostic wording on device lockscreens.

### 4. THIRD-PARTY DATA TRANSFERS & ADVERTISING
The Application operates with zero third-party advertising cookies, zero behavioral tracking scripts, and zero commercial data partnerships. Data will never be sold, licensed, or shared for marketing purposes.

### 5. USER RIGHTS & IMMEDIATE DATA DESTRUCTION
Users maintain the absolute right to:
1. Export all locally stored records in machine-readable JSON format.
2. Permanently purge all local databases, cached service worker records, and configuration preferences via a single action.

### 6. CONTACT AND SUPERVISORY INQUIRIES
Inquiries regarding this policy may be addressed to:
Data Protection Officer: [data-privacy@example.com]  
Physical Address: [Physical Address: Addis Ababa, Ethiopia]`,
  },
  {
    id: 'terms',
    title: 'Terms of Service',
    shortLabel: 'Terms of Service',
    iconName: 'FileText',
    summary:
      'Rules of engagement, permitted educational uses, user responsibilities, and legal limits of liability under Ethiopian law.',
    effectiveDate: 'February 2026',
    version: '1.0-draft',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        content: `By accessing or using MAM-to-MAM AI ("the Service"), operated by ${POLICY_META.organizationPlaceholder}, you confirm that you have read, understood, and agreed to be bound by these Terms of Service. If you do not agree to these terms, you must discontinue use immediately.`,
      },
      {
        heading: '2. Educational Purpose — Not Clinical Care',
        calloutType: 'alert',
        highlight: true,
        content: `**CRITICAL LIMITATION:** The Service provides automated, AI-assisted health education and triage categorization based on guidelines from the Ethiopian Federal Ministry of Health (FMoH) and the World Health Organization (WHO).

The Service is NOT a hospital, diagnostic laboratory, physician, or emergency dispatch authority. You agree that you will NEVER rely on the Service as a substitute for in-person evaluation, diagnostic testing, or clinical treatment by a licensed health professional.`,
      },
      {
        heading: '3. Emergency Protocols',
        content: `In the event of medical emergencies—such as severe maternal bleeding, acute abdominal pain, unconsciousness, convulsions, or high fever—you must immediately contact local emergency services (Red Cross: 907, National Health Line: 8335) or report directly to the nearest health post, health center, or primary hospital.`,
      },
      {
        heading: '4. Permitted and Prohibited Conduct',
        content: `You may use the Service for personal, educational, and non-commercial health empowerment. You agree NOT to:
* Attempt to reverse-engineer, decompile, or disrupt the Service's infrastructure or rate limits.
* Input fraudulent, abusive, or malicious prompts.
* Rely on AI generated text to make medical determinations for others without qualified professional validation.`,
      },
      {
        heading: '5. Intellectual Property & Source Attribution',
        content: `Guideline summaries, clinical protocols, and educational modules are adapted from public domain publications of the Ethiopian Federal Ministry of Health and the World Health Organization. Application code, user experience design, and software components are the intellectual property of ${POLICY_META.organizationPlaceholder}.`,
      },
      {
        heading: '6. Limitation of Liability & Warranty Disclaimer',
        content: `The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind. To the fullest extent permitted under the laws of the ${POLICY_META.countryPlaceholder}, ${POLICY_META.organizationPlaceholder} shall not be liable for any indirect, incidental, or health-related consequences resulting from use or inability to use the Service.`,
      },
      {
        heading: '7. Governing Law and Dispute Resolution',
        content: `These Terms shall be governed by and construed in accordance with the substantive laws of the ${POLICY_META.countryPlaceholder}. Any legal action arising hereunder shall be submitted to the exclusive jurisdiction of the competent courts in Addis Ababa, Ethiopia.`,
      },
    ],
    reviewReadyTemplate: `# [DRAFT - PENDING LEGAL REVIEW]
## TERMS OF SERVICE AGREEMENT TEMPLATE
**Service Name:** MAM-to-MAM AI Ethiopia  
**Operating Entity:** [Organization / Implementing Entity Legal Name]  
**Corporate Headquarters:** [Physical Address: Sub-City, Woreda, Addis Ababa, Ethiopia]  
**Governing Law:** Laws of the Federal Democratic Republic of Ethiopia  
**Effective Date:** [Date, Month, Year]  

### 1. AGREEMENT TO TERMS
These Terms of Service ("Terms") constitute a legally binding agreement between [Organization Legal Name] and the individual accessing the Application.

### 2. NON-CLINICAL DISCLAIMER
The Application is an informational decision-support and health literacy tool. It does NOT provide clinical diagnoses, prescriptive medical treatments, or emergency dispatch services. Users experiencing obstetric, gynecological, or general emergencies are obligated to seek immediate in-person attention at an accredited medical facility.

### 3. SOURCE GUIDELINES ATTRIBUTION
Medical triage logic and maternal care guidelines referenced in this software are curated from published recommendations of the Ethiopian Ministry of Health and the World Health Organization.

### 4. INDEMNITY AND LIMITATION OF LIABILITY
To the maximum extent permissible by Ethiopian jurisprudence, [Organization Legal Name], its officers, contributors, and technical partners disclaim all liability for any direct, indirect, or consequential harm or injury arising from the interpretation or application of informational outputs generated by the automated system.

### 5. DISPUTE FORUM
Any legal controversy or claim arising under this agreement shall be adjudicated before the competent courts of Addis Ababa, Ethiopia.`,
  },
  {
    id: 'health_disclaimer',
    title: 'Health & Medical Disclaimer',
    shortLabel: 'Health Disclaimer',
    iconName: 'AlertTriangle',
    summary:
      'Clear, non-diagnostic statement regarding informational scope, emergency warning signs, and the role of qualified healthcare workers.',
    effectiveDate: 'February 2026',
    version: '1.0-draft',
    sections: [
      {
        heading: '1. Informational & Triage Decision-Support Only',
        content: `MAM-to-MAM AI is engineered to provide clear, accessible, and culturally attuned maternal, sexual, and reproductive health education. It is NOT a medical device, diagnostic engine, or telemedicine consultation service.`,
      },
      {
        heading: '2. Immediate Obstetric & Neonatal Danger Signs',
        highlight: true,
        calloutType: 'alert',
        content: `**CRITICAL WARNING — SEEK IMMEDIATE HOSPITAL CARE IF YOU EXPERIENCE:**
* **Vaginal Bleeding:** Any bright red bleeding during pregnancy, or heavy postpartum bleeding (soaking more than two sanitary pads in one hour).
* **Severe Headaches & Blurred Vision:** Persistent severe headache, spots before the eyes, or epigastric pain (warning signs of pre-eclampsia / eclampsia).
* **High Fever & Shivering:** Body temperature exceeding 38°C, or foul-smelling vaginal discharge.
* **Loss of Fetal Movements:** Significant reduction or absence of baby kicks in the third trimester.
* **Fluid Leakage:** Water breaking before labor onset or before 37 weeks of pregnancy.
* **Convulsions or Loss of Consciousness:** Immediate medical emergency.

**EMERGENCY ASSISTANCE IN ETHIOPIA:**
* Ethiopian Red Cross Ambulance Service: **Dial 907**
* Federal Ministry of Health Free Hotline: **Dial 8335**
* Police / Emergency Services: **Dial 991**`,
      },
      {
        heading: '3. Medications, Dosages, and Laboratory Diagnostics',
        content: `The Service does NOT prescribe medications, adjust drug dosages, or interpret official laboratory reports. Any recommendations concerning:
* Antiretroviral therapy (ART) for HIV prevention or treatment
* Pre-Exposure Prophylaxis (PrEP) or Post-Exposure Prophylaxis (PEP)
* Antibiotics for sexually transmitted infections (STIs)
* Oral contraceptive pills, implants, or intrauterine devices (IUDs)
* Iron and folic acid supplementation during pregnancy
must be evaluated, prescribed, and monitored by a certified midwife, health extension worker (HEW), nurse, or physician.`,
      },
      {
        heading: '4. Clinical Review Status of Content',
        content: `All educational content in MAM-to-MAM AI is mapped to clinical tiers (Approved, Clinician-Reviewed, or Draft). Where translations are undergoing community review, users are notified with explicit badges. Sensitive emergency, HIV, STI, and pregnancy guidelines are locked to validated English standards whenever target language reviews are in draft stage.`,
      },
    ],
    reviewReadyTemplate: `# [DRAFT - PENDING LEGAL REVIEW]
## HEALTH, OBSTETRIC & MEDICAL DISCLAIMER TEMPLATE
**Prepared by:** [Organization / Clinical Review Advisory Board]  
**Entity:** [Organization / Implementing Entity Legal Name]  
**Location:** Addis Ababa, Ethiopia  

### 1. NATURE OF INFORMATION
MAM-to-MAM AI delivers algorithmic educational content derived from verified maternal health standards. Under no circumstances should information provided herein be construed as formal medical diagnosis, specialized obstetric evaluation, or prescriptive clinical guidance.

### 2. EMERGENCY INTERVENTION DIRECTIVE
The software cannot detect life-threatening maternal complications in real time. In the event of emergency warning signs (including heavy obstetric hemorrhage, severe hypertensive headache, eclamptic seizures, or high maternal fever), users must immediately bypass this application and report to the nearest primary hospital, maternity center, or dial 907 / 8335.

### 3. INDEPENDENT CLINICAL CONSULTATION
Users must consult licensed clinical practitioners for the prescription of medications, HIV screening confirmatory tests, STI syndromic treatment regimens, or antenatal care checkups.`,
  },
  {
    id: 'ai_transparency',
    title: 'AI Transparency & Model Governance',
    shortLabel: 'AI Transparency',
    iconName: 'Sparkles',
    summary:
      'Clear explanation of how artificial intelligence is used, what is sent to the AI provider, and the guardrails preventing hallucinations.',
    effectiveDate: 'February 2026',
    version: '1.0-draft',
    sections: [
      {
        heading: '1. What Powers the AI Assistant?',
        content: `MAM-to-MAM AI uses Google Gemini (a modern large language model) configured via a private, server-side Express proxy. The AI model operates within strict, clinician-designed system boundaries focused on maternal, sexual, and reproductive health in Ethiopia.`,
      },
      {
        heading: '2. Grounded Clinical Retrieval Architecture',
        content: `To prevent medical misinformation or hallucinations, the assistant does NOT rely purely on generative memory. When a question is received:
1. The system matches relevant clinical guidelines from our local repository of Ethiopian Ministry of Health and WHO materials.
2. Verified guideline text is injected alongside the user's prompt into the model's instructions.
3. The model is strictly instructed to cite verified guidelines and immediately direct users to physical health centers if danger signs are present.`,
      },
      {
        heading: '3. Online AI vs. Offline Local Guide',
        calloutType: 'info',
        content: `* **Online Mode (Connected):** The assistant connects through our server proxy to Google Gemini for interactive, empathetic, multi-turn conversational guidance in supported Ethiopian languages.
* **Offline Mode (No Internet):** The assistant switches automatically to our on-device decision tree and curated offline library. In this mode, the system is visibly badged as **"Offline Guide: not live AI"** to guarantee absolute transparency.`,
      },
      {
        heading: '4. Explicit Data Boundaries: What Goes to the AI Provider',
        highlight: true,
        calloutType: 'warning',
        content: `We believe in total transparency regarding what leaves your browser:
* **Sent to AI Provider:** Only the text prompt you type, session context from the active chat window, your language code, and matching guideline excerpts.
* **Sanitized at Server Proxy:** Client IP addresses, HTTP user-agent details, and session cookies are stripped at our backend before calling the Gemini API.
* **NOT Sent to AI Provider:** Your name, phone number, GPS coordinates, device identifiers, offline menstrual dates, pregnancy milestones, or saved clinics.
* **Zero Model Training on Sensitive Chats:** Queries are processed through Google Cloud enterprise APIs governed by data protection policies that do not utilize customer health queries to train foundational public models.`,
      },
      {
        heading: '5. Known Model Limitations',
        content: `Generative language models may occasionally produce imperfect or incomplete phrasing. Users are strongly urged to consult healthcare workers and cross-check information against the source references cited under each answer.`,
      },
    ],
    reviewReadyTemplate: `# [DRAFT - PENDING LEGAL REVIEW]
## ARTIFICIAL INTELLIGENCE TRANSPARENCY & DATA FLOW SPECIFICATION
**Operating Organization:** [Organization / Implementing Entity Legal Name]  
**System Name:** MAM-to-MAM AI Maternal Assistant  
**Inference Engine:** Google Gemini (Server-Proxied API)  

### 1. SYSTEM PURPOSE AND ARCHITECTURE
MAM-to-MAM AI employs an AI language model to translate clinical maternal protocols into accessible, empathetic plain language for Ethiopian mothers and families. The system incorporates Retrieval-Augmented Generation (RAG) tethered to Ethiopian Federal Ministry of Health guidelines.

### 2. DISCLOSURE OF DATA TRANSMISSION TO AI PROVIDER
(a) Transmitted Payloads: The data transferred to the model provider is strictly limited to:
    i. Plain-text prompt formulated by the user;
    ii. Session dialogue context from the immediate unclosed conversation;
    iii. ISO language identifier;
    iv. Excerpted clinical reference literature.
(b) Excluded Payloads: Under no circumstances are user IP addresses, GPS coordinates, biometric metrics, persistent tracking cookies, or offline tracker database records transmitted to the AI provider.

### 3. OFFLINE FALLBACK DISCLOSURE
When an internet connection is unavailable, the Application ceases model inference calls and activates an offline rule-based knowledge engine marked "Offline Guide: not live AI".`,
  },
  {
    id: 'data_retention',
    title: 'Data Retention and Deletion',
    shortLabel: 'Data Retention & Deletion',
    iconName: 'Trash2',
    summary:
      'Detailed schedules for local device storage, zero server-side retention, and one-tap tools to export or purge your information.',
    effectiveDate: 'February 2026',
    version: '1.0-draft',
    sections: [
      {
        heading: '1. Device-First Retention Schedule',
        content: `All personalized tracking data (period dates, pregnancy week, daily symptoms, triage history, and saved facilities) is saved exclusively within client-side IndexedDB on your device.

Because this data resides on your physical hardware, it remains on your device until you choose to delete it, reset your browser cache, or click "Delete Everything."`,
      },
      {
        heading: '2. Zero Server-Side Retention Policy',
        calloutType: 'success',
        content: `Our backend server operates in a stateless mode:
* **No Database of User Chats:** We do NOT maintain a SQL, NoSQL, or cloud database containing your chat messages.
* **Volatile Memory Only:** In-memory request counters used for security and rate limiting are reset automatically every minute and store zero health data.
* **No Telemetry Logs:** We do not log message contents, medical questions, or search terms to disk.`,
      },
      {
        heading: '3. "Export My Data" Functionality',
        content: `You have the right to inspect and download all data stored by this application. In the Privacy Modal, click **"Export My Data"** to download a clean, unencrypted JSON archive of all your saved entries, cycle logs, and offline preferences for your personal records or clinical consultations.`,
      },
      {
        heading: '4. "Delete Everything" (Hard Purge)',
        highlight: true,
        calloutType: 'warning',
        content: `If you wish to remove all traces of your use from this device:
1. Open the Privacy Modal or use the Policy Center.
2. Select **"Delete Everything"** and confirm.
3. The application will instantly execute a full wipe of:
   * All IndexedDB health stores
   * All localStorage items and tokens
   * All cached offline guides and PWA assets
   * The page will immediately reload into a clean, uninitialized state.`,
      },
      {
        heading: '5. Discreet Data Handling on Shared Devices',
        content: `In multi-user households or shared mobile environments, we provide a **Neutral App Disguise** mode (which renames the app tab to "Calculator" or "Daily Notes") and a **Quick Exit** button that immediately switches the screen to Google Search, preventing accidental discovery.`,
      },
    ],
    reviewReadyTemplate: `# [DRAFT - PENDING LEGAL REVIEW]
## DATA RETENTION, EXPORT, AND PURGE POLICY TEMPLATE
**Entity:** [Organization / Implementing Entity Legal Name]  
**Application:** MAM-to-MAM AI  

### 1. RETENTION LIFECYCLE
Personal health logs, menstrual trackers, gestational progress records, and facility bookmarks reside exclusively within the Client Device Storage Layer (IndexedDB). [Organization Legal Name] maintains zero persistent database storage of individual health profiles.

### 2. SERVER-SIDE VOLATILITY
Inference gateway servers operate statelessly. Request payloads are evaluated in volatile memory and immediately discarded post-transmission. No log files capturing chat text or reproductive queries are maintained.

### 3. EXPORT AND PURGE PROTOCOLS
Users possess native, software-enforced rights to:
(a) Export: Generate a machine-readable JSON archive containing all local database entries without administrative intervention.
(b) Purge: Execute an instantaneous cryptographic/storage wipe of all local databases, cookies, cached service worker records, and local configuration objects.`,
  },
  {
    id: 'cookies_tracking',
    title: 'Cookies & Local Storage Policy',
    shortLabel: 'Cookies & Tracking',
    iconName: 'Cookie',
    summary:
      'Zero advertising cookies, zero third-party cross-site trackers, and a transparent breakdown of essential local storage technologies.',
    effectiveDate: 'February 2026',
    version: '1.0-draft',
    sections: [
      {
        heading: '1. Absolute Zero Advertising Cookies',
        calloutType: 'success',
        content: `MAM-to-MAM AI does NOT use advertising cookies, marketing pixels, social media widgets, or cross-site tracking beacons. We do not participate in programmatic advertising networks or behavioral profiling.`,
      },
      {
        heading: '2. Legitimate Local Storage Technologies Used',
        content: `To deliver offline functionality and preserve your privacy settings, the application utilizes three standard, on-device web technologies:

* **IndexedDB (\`mam_indexed_db\`):**
  * Purpose: Stores downloaded maternal health library packs, symptom definitions, danger sign triage tables, and user-recorded cycle/pregnancy dates.
  * Location: Client device only.
* **localStorage:**
  * Keys used:
    * \`mam_selected_lang\`: Remembers your preferred language (e.g., Amharic, Afaan Oromoo).
    * \`mam_privacy_accepted\`: Records your acknowledgement of the privacy notice.
    * \`mam_active_disguise\`: Remembers whether you selected a neutral disguise icon.
    * \`mam_offline_library_downloaded\`: Tracks the offline cache download timestamp.
* **Service Worker Cache:**
  * Purpose: Caches application scripts, stylesheets, and clinical JSON documents so that the app opens instantly when you are completely offline or traveling in areas without cellular coverage.`,
      },
      {
        heading: '3. Managing and Clearing Storage',
        content: `You can view, clear, or block local storage directly within your browser's security settings at any time, or click "Delete Everything" within this app to wipe all storage keys automatically.`,
      },
    ],
    reviewReadyTemplate: `# [DRAFT - PENDING LEGAL REVIEW]
## COOKIES AND CLIENT STORAGE POLICY TEMPLATE
**Entity:** [Organization / Implementing Entity Legal Name]  
**Product:** MAM-to-MAM AI  

### 1. ABSENCE OF COMMERCIAL TRACKING ARTIFACTS
The Application does not deploy tracking cookies, advertising beacons, canvas fingerprinting scripts, or third-party behavioral analytics libraries.

### 2. EXCLUSIVE USE OF FUNCTIONAL CLIENT STORAGE
Client-side web storage (IndexedDB, localStorage, and Cache Storage API) is utilized strictly for technical operability:
(a) To enable full offline execution in environments lacking internet infrastructure;
(b) To preserve user-selected localized interface languages;
(c) To retain user-controlled safety camouflage preferences.`,
  },
  {
    id: 'child_safety',
    title: 'Child Safety & Adolescent Health Guidance',
    shortLabel: 'Child Safety & Youth',
    iconName: 'HeartHandshake',
    summary:
      'Alignment with national youth health strategies, protective access to age-appropriate reproductive health literacy, and zero-stigma access.',
    effectiveDate: 'February 2026',
    version: '1.0-draft',
    sections: [
      {
        heading: '1. National Strategy Alignment',
        content: `This application aligns with the **Ethiopian National Adolescent and Youth Health Strategy (2021–2025)** promulgated by the Federal Ministry of Health, which affirms the universal right of adolescents and young people to receive accurate, scientific, non-judgmental information on puberty, reproductive anatomy, menstrual hygiene, STI prevention, and family planning.`,
      },
      {
        heading: '2. Child Safeguarding and Content Standards',
        content: `MAM-to-MAM AI adheres to strict child safety and protection principles:
* **Zero Adult Exploitation:** The platform contains purely educational, anatomical, and public-health content. Sexually explicit, abusive, or predatory content is strictly prohibited and architecturally blocked.
* **No Peer-to-Peer Chatrooms:** To prevent cyberbullying, grooming, or exploitation, there are NO user-to-user forums, messaging channels, or photo-sharing features.
* **Confidential Health Information:** Adolescents facing puberty questions, menstrual concerns, or reproductive health queries can access verified guidance safely without fear of social ostracization or breach of confidentiality.`,
      },
      {
        heading: '3. Recommendation for Youth-Friendly Health Services (YFHS)',
        calloutType: 'info',
        content: `Whenever an adolescent inquires about contraception, sexual violence, mental health, or STI concerns, the system explicitly advises visiting designated Youth-Friendly Health Service (YFHS) corners available at public health centers across Ethiopia.`,
      },
      {
        heading: '4. Parental & Guardian Advisory',
        content: `We encourage constructive, supportive dialogue between young people, trusted parents, guardians, teachers, and health extension workers on maternal and adolescent health.`,
      },
    ],
    reviewReadyTemplate: `# [DRAFT - PENDING LEGAL REVIEW]
## CHILD SAFEGUARDING & ADOLESCENT HEALTH POLICY TEMPLATE
**Operating Entity:** [Organization / Implementing Entity Legal Name]  
**Framework:** Ethiopian National Adolescent and Youth Health Strategy (2021-2025)  

### 1. INSTITUTIONAL COMMITMENT
[Organization Legal Name] upholds the physical, psychological, and informational safety of children, adolescents, and youth accessing maternal and reproductive health education.

### 2. SAFEGUARDING ARCHITECTURE
(a) The Application restricts functionality to automated decision support; no unmoderated community bulletin boards, direct messaging networks, or user profile directories exist.
(b) Clinical content conforms to age-appropriate public health pedagogical standards.
(c) Systematic linkages to accredited Youth-Friendly Health Service (YFHS) units are incorporated into clinical referral flows.`,
  },
  {
    id: 'accessibility',
    title: 'Accessibility Statement',
    shortLabel: 'Accessibility',
    iconName: 'Eye',
    summary:
      'Commitment to WCAG 2.1 AA standards, high contrast, offline access, screen readers, and multi-language Ethiopic script typography.',
    effectiveDate: 'February 2026',
    version: '1.0-draft',
    sections: [
      {
        heading: '1. Commitment to Universal Access',
        content: `${POLICY_META.organizationPlaceholder} is committed to ensuring digital accessibility for mothers, pregnant women, family caregivers, and health extension workers of all abilities, including those with visual, auditory, cognitive, or motor impairments.`,
      },
      {
        heading: '2. Standards and Technical Conformance',
        content: `This application aims to comply with the **Web Content Accessibility Guidelines (WCAG) 2.1 Level AA** standards through:
* **Ethiopic Script Support:** Native typographic rendering for Amharic and Tigrinya using clean, legible font stacks.
* **High Contrast Colors:** Deep blue (#1F3B8C) and amber (#F59E0B) color palettes carefully calibrated to exceed contrast ratios of 4.5:1 for normal text.
* **Touch Targets:** All interactive buttons and navigation tabs exceed the minimum 44×44 pixel tactile target size for comfortable mobile operation.
* **Keyboard Navigation:** Full support for Tab, Arrow, and Escape key navigation, including double-tap Escape for immediate Quick Exit.
* **Screen Reader Optimization:** Semantic HTML tags, aria-labels, and live region announcements for triage results and offline status badges.`,
      },
      {
        heading: '3. Low-Bandwidth and Rural Offline Accessibility',
        calloutType: 'success',
        content: `Accessibility in Ethiopia includes socio-technical accessibility in areas with intermittent electrical grids and 2G/3G connectivity. MAM-to-MAM AI is built as an offline-first Progressive Web App (PWA) requiring less than 5 MB of cached storage to operate fully without cellular data.`,
      },
      {
        heading: '4. Feedback and Continuous Improvement',
        content: `If you experience any accessibility barrier or have difficulty reading text in your dialect or script, please contact our accessibility coordinator at ${POLICY_META.emailPlaceholder} or report an issue via the "Report a translation or accessibility error" button.`,
      },
    ],
    reviewReadyTemplate: `# [DRAFT - PENDING LEGAL REVIEW]
## ACCESSIBILITY & DIGITAL INCLUSION STATEMENT TEMPLATE
**Organization:** [Organization / Implementing Entity Legal Name]  
**Standards Reference:** W3C Web Content Accessibility Guidelines (WCAG) 2.1 Level AA  

### 1. COMMITMENT TO INCLUSIVITY
[Organization Legal Name] guarantees equitable, dignified access to maternal health literacy for all users, including individuals with disabilities or low digital literacy.

### 2. LOCALIZED TECHNICAL MEASURES
* Native Ethiopic font integration ensuring typographic clarity across screen densities.
* Offline-first local caching to guarantee access in low-connectivity or zero-signal clinical settings.
* Adherence to color contrast minimums, keyboard focus outlines, and semantic accessibility trees.`,
  },
  {
    id: 'complaints_contact',
    title: 'Complaints, Oversight & Contact Information',
    shortLabel: 'Complaints & Contact',
    iconName: 'HelpCircle',
    summary:
      'Formal procedures to lodge clinical accuracy reports, translation errors, privacy grievances, or regulatory inquiries.',
    effectiveDate: 'February 2026',
    version: '1.0-draft',
    sections: [
      {
        heading: '1. How to Submit Inquiries and Feedback',
        content: `We welcome clinical feedback, user complaints, and suggestions from mothers, midwives, clinicians, and community members. You may contact us through the following formal channels:

* **Legal & Regulatory Office:** ${POLICY_META.organizationPlaceholder}
* **Physical Office Address:** ${POLICY_META.addressPlaceholder}
* **General Inquiries:** ${POLICY_META.emailPlaceholder}
* **Data Protection & Privacy Desk:** ${POLICY_META.dpoEmailPlaceholder}
* **Ethiopian Hotline:** ${POLICY_META.hotlinePlaceholder} (Toll-Free Ministry of Health: 8335)`,
      },
      {
        heading: '2. Reporting Clinical and Translation Errors',
        calloutType: 'warning',
        content: `Accurate medical terminology in Amharic, Afaan Oromoo, Tigrinya, Somali, Afar, and Sidama is essential for maternal safety. 
If you observe an inaccurate medical explanation, a misleading translation, or unclear wording:
1. Tap the **"Report error"** button located in the header, footer, or any clinical module.
2. Specify the affected phrase, suggest the clinically accurate wording, and submit.
3. Reports are reviewed by our Clinical Translation Committee.`,
      },
      {
        heading: '3. Complaints Investigation Procedure',
        content: `When a formal complaint regarding data handling or clinical safety is lodged:
1. **Acknowledgment:** We acknowledge receipt within two (2) business days.
2. **Investigation:** A multidisciplinary team consisting of an obstetric/reproductive health specialist and a technical data lead investigates the issue.
3. **Resolution:** A formal written finding and corrective action plan is completed within ten (10) business days.`,
      },
      {
        heading: '4. Regulatory and Institutional Oversight',
        content: `Users retain the right to submit complaints to statutory authorities in the ${POLICY_META.countryPlaceholder}, including the Ethiopian Food and Drug Authority (EFDA) and the Federal Ministry of Health (FMoH).`,
      },
    ],
    reviewReadyTemplate: `# [DRAFT - PENDING LEGAL REVIEW]
## COMPLAINTS HANDLING & REGULATORY CONTACT FRAMEWORK
**Entity:** [Organization / Implementing Entity Legal Name]  
**Physical Address:** [Physical Address: Sub-City, Woreda, Addis Ababa, Ethiopia]  
**Supervisory Oversight:** Federal Ministry of Health (FMoH) / Ethiopian Food and Drug Authority (EFDA)  

### 1. SUBMISSION OF COMPLAINTS
Formal grievances concerning system operation, algorithmic accuracy, or privacy compliance may be filed with:
Compliance Secretariat: [legal-compliance@example.com]  
Direct Line: [+251 11 XXX XXXX]  

### 2. INVESTIGATION BENCHMARK
All reported issues pertaining to clinical advice or translation accuracy shall be triaged within 48 hours by designated clinical advisors. Corrective updates to local guideline knowledge bases shall be deployed immediately upon clinical validation.`,
  },
];
