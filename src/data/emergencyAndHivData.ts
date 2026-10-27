/**
 * ============================================================================
 * MAM-to-MAM AI: HIV, STI, Pregnancy & Emergency Dedicated Clinical Dataset
 * ============================================================================
 * Educational content based on WHO and Ministry of Health materials, pending clinical review.
 *
 * Grounding References:
 * 1. World Health Organization (WHO) Consolidated Guidelines on HIV Prevention, Testing, Treatment, and Care
 * 2. WHO Sexually Transmitted Infections Treatment & Prevention Guidelines
 * 3. Ethiopian Federal Ministry of Health (FMoH) National Comprehensive HIV/AIDS Prevention and Care Guidelines
 * 4. Ethiopian National Reproductive Health Strategy & ANC 8-Contact Model
 * 5. Ethiopian National Standard for One-Stop Centers for Survivors of Sexual and Gender-Based Violence
 *
 * SAFETY PRINCIPLES:
 * - No diagnosis, no medication dosages, non-judgmental, stigma-free language.
 * - Every claim tagged with verified source or pending verification.
 * ============================================================================
 */

export interface SourceCitation {
  organization: string;
  document: string;
  isVerified: boolean;
}

export interface EducationalSection {
  id: string;
  category: 'hiv' | 'stis' | 'pregnancy' | 'emergencies';
  title: string;
  titleAm: string;
  titleOm: string;
  titleTi: string;
  summary: string;
  sourceTag: string;
  keyPoints: string[];
  detailedContent: string[];
  stigmaFreeNote?: string;
  adolescentNote?: string;
  confidentialityNote?: string;
  suggestedPrompt: string;
}

export interface TimeSensitiveEmergency {
  id: string;
  type: 'hiv_pep' | 'emergency_contraception' | 'sexual_violence' | 'obstetric_danger';
  title: string;
  urgencyLevel: 'CRITICAL_HOURS' | 'IMMEDIATE_EMERGENCY' | 'WITHIN_DAYS';
  windowHours: number; // e.g. 72 for PEP, 72-120 for EC
  headline: string;
  explanation: string;
  immediateActions: string[];
  clinicalReferral: string;
  confidentialHotlines: { name: string; number: string; verified: boolean }[];
  source: string;
}

export interface GuidedQuestionnaireQuestion {
  id: string;
  text: string;
  options: {
    label: string;
    score: 'red' | 'amber' | 'green';
    reason: string;
  }[];
}

export interface GuidedQuestionnaire {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  questions: GuidedQuestionnaireQuestion[];
}

/**
 * ----------------------------------------------------------------------------
 * 1. TIME-SENSITIVE EMERGENCY GUIDANCE CARDS
 * ----------------------------------------------------------------------------
 */
export const TIME_SENSITIVE_EMERGENCIES: TimeSensitiveEmergency[] = [
  {
    id: 'pep_72h',
    type: 'hiv_pep',
    title: 'Possible HIV Exposure — Post-Exposure Prophylaxis (PEP)',
    urgencyLevel: 'CRITICAL_HOURS',
    windowHours: 72,
    headline: 'PEP works best when started within hours and is strictly time-limited to 72 hours.',
    explanation:
      'If you may have been exposed to HIV through unprotected intercourse, a broken condom, a shared needle, or sexual assault, emergency medication (PEP) can stop HIV from establishing in your body. It is a 28-day course of antiretrovirals that must be prescribed by a healthcare provider.',
    immediateActions: [
      'Seek care as soon as possible. The sooner PEP is started (ideally within 2 to 24 hours), the more effective it is.',
      'Do not wait for symptoms. HIV tests immediately after exposure will not detect the new virus, but a clinician will test your baseline status and begin PEP immediately.',
      'Go to the nearest Health Center, General Hospital emergency triage, or hospital One-Stop Center.',
      'PEP is provided confidentially and free in Ethiopian public health facilities.',
    ],
    clinicalReferral:
      'Visit any public Hospital Emergency Department or Kebele/Woreda Health Center immediately and request urgent PEP evaluation.',
    confidentialHotlines: [
      { name: 'FMoH National Health Helpline', number: '8335', verified: true },
      { name: 'Marie Stopes SRH Confidential Helpline', number: '8044', verified: true },
      { name: 'Red Cross Ambulance Emergency', number: '907', verified: true },
      { name: 'Regional Emergency Service', number: '[Verify with Ministry of Health: emergency number]', verified: false },
    ],
    source: 'WHO Guidelines on Post-Exposure Prophylaxis (PEP) & Ethiopian FMoH National HIV Care Guidelines [VERIFIED]',
  },
  {
    id: 'emergency_contraception',
    type: 'emergency_contraception',
    title: 'Emergency Contraception (EC) Timing',
    urgencyLevel: 'CRITICAL_HOURS',
    windowHours: 120,
    headline: 'Emergency contraception is time-sensitive: most effective within 24 hours, works up to 72 to 120 hours.',
    explanation:
      'Emergency contraceptive pills (such as levonorgestrel / Postinor-2) or a Copper IUD can prevent pregnancy after unprotected sex, missed pills, or condom slippage. Timing is critical: every hour counts. It does NOT cause an abortion and will not interrupt an already implanted pregnancy.',
    immediateActions: [
      'Take oral emergency contraceptive pills as soon as possible (highest efficacy within the first 24 hours, effective up to 72–120 hours depending on the brand).',
      'Consult a licensed pharmacist or health center nurse on the proper formulation for you.',
      'A Copper IUD inserted by a trained clinician within 5 days (120 hours) of unprotected intercourse is over 99% effective and provides long-term contraception.',
      'Remember: Emergency contraception does NOT protect against HIV or other STIs. Use condoms or consider PEP if there is HIV exposure risk.',
    ],
    clinicalReferral:
      'Available over-the-counter at licensed community pharmacies and free or low-cost at Health Centers and Marie Stopes / FGAE clinics.',
    confidentialHotlines: [
      { name: 'Marie Stopes Helpline', number: '8044', verified: true },
      { name: 'FMoH Health Line', number: '8335', verified: true },
    ],
    source: 'WHO Family Planning: A Global Handbook for Providers & Ethiopian FMoH Reproductive Health Guidelines [VERIFIED]',
  },
  {
    id: 'sexual_violence_support',
    type: 'sexual_violence',
    title: 'Trauma-Informed Sexual Violence & Assault Care',
    urgencyLevel: 'CRITICAL_HOURS',
    windowHours: 72,
    headline: 'You are safe, supported, and not to blame. Immediate confidential care is available within 72 hours.',
    explanation:
      'Sexual assault or coerced intercourse is never your fault. Receiving comprehensive medical care within 72 hours is vital to protect your health, prevent HIV and unintended pregnancy, and treat physical injuries in a confidential, safe environment.',
    immediateActions: [
      'Prioritize your physical safety first. If you are in immediate physical danger, move to a secure location.',
      'Visit a hospital **One-Stop Center** (available at major public hospitals across Ethiopia), which provides free emergency medical treatment, PEP, emergency contraception, wound care, psychological counseling, and legal support in a single private room.',
      'Try not to shower, bathe, comb hair, or change clothes before going to the clinic if you wish to preserve forensic evidence, but your medical care and comfort always come first.',
      'Receive emergency PEP within 72 hours to prevent HIV, emergency contraception to prevent pregnancy, and preventative STI antibiotics.',
    ],
    clinicalReferral:
      'Go to the Emergency Department of the nearest public hospital and request their One-Stop GBV Center, or contact AWSAD safe shelter.',
    confidentialHotlines: [
      { name: 'AWSAD Women Crisis & Shelter Helpline', number: '6226', verified: true },
      { name: 'FMoH Health Line', number: '8335', verified: true },
      { name: 'Red Cross Emergency Ambulance', number: '907', verified: true },
      { name: 'Police Emergency Line', number: '991', verified: true },
      { name: 'Regional GBV Rapid Response', number: '[Verify with Ministry of Health: emergency number]', verified: false },
    ],
    source: 'National Standard for One-Stop Centers for Survivors of SGBV in Ethiopia & WHO Clinical Care for Survivors [VERIFIED]',
  },
  {
    id: 'obstetric_danger_signs',
    type: 'obstetric_danger',
    title: 'Pregnancy & Postpartum Danger Signs',
    urgencyLevel: 'IMMEDIATE_EMERGENCY',
    windowHours: 0,
    headline: 'Red alert symptoms require immediate hospital triage without delay. Lie down and arrange transport immediately.',
    explanation:
      'Severe obstetric complications such as heavy hemorrhage, severe pre-eclampsia, uterine sepsis, or placental abruption can rapidly progress. Do not wait for symptoms to go away.',
    immediateActions: [
      'Call Red Cross Ambulance 907 or local health transport immediately.',
      'Lie on your left side to maintain optimal blood and oxygen flow to the placenta and baby.',
      'Bring your ANC booklet (Maternal Health Card) if available.',
      'Do NOT consume traditional unprescribed herbal medicines or drinks.',
    ],
    clinicalReferral:
      'Go immediately to the nearest Maternity Emergency Hospital or Primary Hospital with 24/7 delivery services.',
    confidentialHotlines: [
      { name: 'Red Cross Ambulance Emergency', number: '907', verified: true },
      { name: 'Addis Ababa Emergency Dispatch', number: '952', verified: true },
      { name: 'FMoH Health Guidance', number: '8335', verified: true },
    ],
    source: 'WHO Managing Complications in Pregnancy and Childbirth (MCPC) & Ethiopian FMoH Emergency Obstetric Care Protocol [VERIFIED]',
  },
];

/**
 * ----------------------------------------------------------------------------
 * 2. COMPREHENSIVE EDUCATIONAL TOPICS (HIV, STIs, PREGNANCY, EMERGENCIES)
 * ----------------------------------------------------------------------------
 */
export const COMPREHENSIVE_HEALTH_SECTIONS: EducationalSection[] = [
  // 1. HIV COMPREHENSIVE
  {
    id: 'hiv_transmission_facts',
    category: 'hiv',
    title: 'HIV Transmission: Facts vs Myths',
    titleAm: 'የኤችአይቪ መተላለፊያ መንገዶች፡ እውነታዎችና የተሳሳቱ አመለካከቶች',
    titleOm: 'Karaalee Daddarba HIV: Dhugaa fi Yaada Dogoggoraa',
    titleTi: 'ናይ ኤች.ኣይ.ቪ መተሓላለፊ መገድታት፡ ሓቅታትን ግጉይ ኣመለኻኽታታትን',
    summary: 'Clear clinical facts on how HIV is transmitted, and reassuring clarity on how it is impossible to catch through daily contact.',
    sourceTag: 'Source: WHO HIV Factsheets & Ethiopian FMoH HIV Guidelines [VERIFIED]',
    keyPoints: [
      'HIV is transmitted through unprotected sex, sharing sharp unsterilized needles/syringes, and from mother to child during pregnancy, childbirth, or breastfeeding without treatment.',
      'HIV CANNOT be transmitted through hugging, handshakes, kissing, sharing meals, cups, spoons, toilet seats, or mosquito/insect bites.',
      'Saliva, sweat, tears, and urine do not transmit HIV.',
    ],
    detailedContent: [
      'Human Immunodeficiency Virus (HIV) targets the immune system, specifically CD4 white blood cells that fight infection.',
      'The virus exists in sufficient concentrations for transmission only in specific bodily fluids: blood, semen, pre-seminal fluid, rectal fluids, vaginal fluids, and breast milk.',
      'Casual contact: Sharing utensils, drinking glasses, swimming pools, working in the same room, coughing, or sneezing CANNOT spread HIV because the virus cannot survive exposed in the external environment.',
      'Combatting Stigma: There is zero risk in living, eating, studying, or hugging someone living with HIV. Stigma hurts health seeking behavior and has no clinical basis.',
    ],
    stigmaFreeNote: 'Living with HIV is a manageable chronic health condition. Fear and stigma are based on misinformation, not medical facts.',
    adolescentNote: 'Young people have the right to confidential, non-judgmental information and testing services at all Youth-Friendly Service (YFS) clinics.',
    suggestedPrompt: 'Can you explain the exact ways HIV is and is not transmitted, and how casual contact is completely safe?',
  },
  {
    id: 'hiv_prevention_prep_pep',
    category: 'hiv',
    title: 'HIV Prevention: Condoms, PrEP, PEP & U=U',
    titleAm: 'የኤችአይቪ መከላከያ መንገዶች፡ ኮንዶም፣ PrEP፣ PEP እና U=U',
    titleOm: 'Mala Ittisa HIV: Koondomii, PrEP, PEP fi U=U',
    titleTi: 'ናይ ኤች.ኣይ.ቪ መከላኸሊ ሜላታት፡ ኮንዶም፣ PrEP፣ PEP ከምኡ’ውን U=U',
    summary: 'Modern evidence-based prevention options: dual protection condoms, daily PrEP, emergency PEP within 72 hours, and Treatment as Prevention (U=U).',
    sourceTag: 'Source: WHO Guidelines on HIV Prevention & Treatment [VERIFIED]',
    keyPoints: [
      'Condoms provide dual protection: preventing both HIV/STIs and unintended pregnancy when used consistently.',
      'PrEP (Pre-Exposure Prophylaxis) is a daily pill for HIV-negative people at ongoing risk, reducing sexual HIV risk by over 99%.',
      'PEP (Post-Exposure Prophylaxis) is an emergency 28-day medication taken strictly within 72 hours of potential HIV exposure.',
      'Undetectable = Untransmittable (U=U): People on ART with undetectable viral load cannot transmit HIV sexually.',
    ],
    detailedContent: [
      'Post-Exposure Prophylaxis (PEP): When started within hours (up to 72 hours) after unprotected sex or trauma, antiretroviral medicine stops HIV from replicating and permanently establishing in your body.',
      'Pre-Exposure Prophylaxis (PrEP): Available for key populations and individuals with partners living with HIV who are not yet virally suppressed.',
      'Treatment as Prevention (TasP): When someone living with HIV takes ART consistently, their viral count drops so low that laboratory tests cannot detect it ("undetectable"). Global clinical trials (PARTNER 1 & 2) proved that undetectable means untransmittable.',
      'Dual Protection: While PrEP and ART protect against HIV, they do NOT protect against other STIs (like Syphilis or Gonorrhea) or pregnancy. Using condoms alongside provides full dual protection.',
    ],
    suggestedPrompt: 'What is the difference between PrEP and PEP, and how does PEP work within 72 hours in Ethiopia?',
  },
  {
    id: 'hiv_testing_and_results',
    category: 'hiv',
    title: 'HIV Testing Options, Self-Testing & Window Periods',
    titleAm: 'የኤችአይቪ ምርመራ አማራጮች፣ ራስን መመርመር እና የመጠባበቂያ ጊዜ (Window Period)',
    titleOm: 'Filannoowwan Qorannoo HIV, Of-qorachuu fi Yeroo Eeggannoo',
    titleTi: 'ናይ ኤች.ኣይ.ቪ መርመራ ኣማራጺታት፡ ባዕልኻ ምምርማርን ናይ ምጽባይ ግዜን',
    summary: 'How rapid tests and HIV self-tests (HIVST) work, interpreting non-reactive vs reactive results, and understanding window periods.',
    sourceTag: 'Source: WHO Guidelines on HIV Self-Testing & Ethiopian National HIV Testing Protocol [VERIFIED]',
    keyPoints: [
      'HIV testing in Ethiopia is free, confidential, and voluntary at all public health facilities and Youth-Friendly Clinics.',
      'HIV Self-Testing (HIVST) uses an oral mouth swab or finger-prick blood drop to give private results in 15–20 minutes.',
      'A reactive (positive) self-test is preliminary and MUST be confirmed by a healthcare provider at a clinic.',
      'Window Period: Antibodies take 3 to 12 weeks to develop after exposure. A negative test during this period should be repeated after 3 months.',
    ],
    detailedContent: [
      'What Test Results Mean:',
      '• Non-Reactive (Negative): No HIV antibodies/antigens were detected. If no exposure occurred in the last 12 weeks, you are HIV-negative. If you had a recent exposure within 12 weeks, repeat the test at the end of the 3-month window period.',
      '• Reactive (Preliminary Positive): Two lines or a positive reading means antibodies were found. You must visit a health center for a second confirmatory test using the national validated algorithm before a diagnosis is established.',
      '• Invalid: Test did not work correctly; repeat with a new test kit.',
      'Confidentiality: You do not need parental consent or your partner\'s presence to get tested. Counseling is private and voluntary.',
    ],
    confidentialityNote: 'Ethiopian national guidelines protect your right to confidential voluntary testing. Test results cannot be shared with family, schools, or employers.',
    suggestedPrompt: 'How do HIV self-tests work in Ethiopia, what is the window period, and what should I do if a self-test is reactive?',
  },
  {
    id: 'hiv_living_pmtct',
    category: 'hiv',
    title: 'Living Healthy with HIV & PMTCT (Mother-to-Child Prevention)',
    titleAm: 'ከኤችአይቪ ጋር ጤናማ ኑሮ እና ከእናት ወደ ልጅ እንዳይተላለፍ መከላከል (PMTCT)',
    titleOm: 'Fayyaa Eeggachuun HIV Wajjin Jiraachuu fi PMTCT',
    titleTi: 'ምስ ኤች.ኣይ.ቪ ጥዑይ ናብራ ምንባርን ካብ ኣደ ናብ ህጻን ከይመሓላለፍ ምክልኻልን (PMTCT)',
    summary: 'Antiretroviral Therapy (ART) adherence, viral suppression, healthy pregnancy, and preventing mother-to-child transmission.',
    sourceTag: 'Source: WHO Guidelines on PMTCT & Ethiopian FMoH National PMTCT Guidelines [VERIFIED]',
    keyPoints: [
      'With modern ART, individuals living with HIV live long, fulfilling, healthy lives, pursue careers, and have HIV-negative children.',
      'Adherence is key: Taking your antiretroviral medication once daily at the same time prevents viral rebound and drug resistance.',
      'PMTCT works: Pregnant women on continuous ART reduce mother-to-child transmission risk to less than 1–2%.',
      'Infant prophylaxis: Newborns receive syrup medication and routine testing at birth, 6 weeks, and after breastfeeding stops.',
    ],
    detailedContent: [
      'Free Access in Ethiopia: All ART medicines, routine viral load testing, and pediatric formulations are completely free in Ethiopian public hospitals and health centers.',
      'Preventing Mother-to-Child Transmission (PMTCT): Every pregnant mother attending ANC is offered routine HIV screening. If positive, ART is initiated immediately. When viral load is suppressed, the baby is born virus-free.',
      'Safe Infant Feeding: In Ethiopia, exclusive breastfeeding for the first 6 months is recommended while the mother stays on continuous ART, followed by complementary foods with continued breastfeeding up to 12–24 months.',
      'Peer Support: Join community Mother-to-Mother support groups (MAM) at local health centers for emotional and nutritional peer guidance.',
    ],
    stigmaFreeNote: 'A positive HIV diagnosis is no longer a life sentence. With early ART, life expectancy equals that of the general population.',
    suggestedPrompt: 'How does PMTCT prevent HIV transmission from a pregnant mother to her baby in Ethiopia?',
  },

  // 2. STIs COMPREHENSIVE
  {
    id: 'stis_common_and_asymptomatic',
    category: 'stis',
    title: 'Common STIs & Why Many Have Zero Symptoms',
    titleAm: 'የተለመዱ የአባላዘር በሽታዎች እና ምንም ምልክት የማያሳዩበት ምክንያት',
    titleOm: 'Dhibee Daddarboo Wal-qunnamtii fi Maaliif Mallattoo Malee Mul’ata?',
    titleTi: 'ዝውቱራት ሕማማት ርክብ-ስጋን ስለምንታይ ምልክት ከየርእዩ ከምዝኽእሉን',
    summary: 'Signs of Syphilis, Gonorrhea, Chlamydia, Trichomoniasis, and HPV, plus the critical danger of silent (asymptomatic) infections.',
    sourceTag: 'Source: WHO Global STI Surveillance & Ethiopian FMoH Syndromic Management Guidelines [VERIFIED]',
    keyPoints: [
      'Common STIs include Syphilis, Gonorrhea, Chlamydia, Trichomoniasis, Genital Herpes (HSV), HPV, and Hepatitis B.',
      'Up to 70% of women and 50% of men with Chlamydia or Gonorrhea experience NO noticeable early symptoms.',
      'Untreated asymptomatic STIs can lead to Pelvic Inflammatory Disease (PID), chronic pelvic pain, ectopic pregnancy, and permanent infertility.',
      'Regular screening and dual protection condoms protect against silent transmission.',
    ],
    detailedContent: [
      'Common STI Symptoms when present:',
      '• Abnormal vaginal or penile discharge (thick, yellow/green, frothy, or unpleasant odor)',
      '• Pain, burning, or stinging sensation during urination',
      '• Genital sores, blisters, painless firm ulcers (chancre in primary syphilis), or genital warts',
      '• Bleeding between menstrual periods or after intercourse',
      '• Lower abdominal pain or swelling in the groin lymph nodes',
      'The Asymptomatic Trap: Because bacterial STIs often colonize the cervix without causing pain, many women never realize they are infected until complications develop. This is why testing after unprotected sex is essential.',
    ],
    suggestedPrompt: 'What are the main STIs in Ethiopia, and why can someone have an STI without knowing it?',
  },
  {
    id: 'stis_partner_and_treatment_completion',
    category: 'stis',
    title: 'STI Treatment Rules: Complete the Course & Treat Partners',
    titleAm: 'የአባላዘር በሽታ ህክምና ህጎች፡ መድሃኒትን መጨረስና አጋርን በአንድ ላይ ማከም',
    titleOm: 'Qajeelfama Yaala Dhibee Wal-qunnamtii: Qoricha Xumuruu fi Hiriyaa Yaaluu',
    titleTi: 'ሕግታት ሕክምና ሕማማት ርክብ-ስጋ፡ ፈውሲ ምውዳእን ንመጻምድትኻ ብሓባር ምሕካምን',
    summary: 'Why incomplete antibiotics create superbugs, and why simultaneous partner treatment is non-negotiable to prevent ping-pong reinfection.',
    sourceTag: 'Source: WHO STI Guidelines & Ethiopian Syndromic Case Management Protocol [VERIFIED]',
    keyPoints: [
      'Both sexual partners MUST receive treatment at the exact same time, even if one partner has zero symptoms.',
      'Complete the full course of prescribed antibiotics under clinical guidance; never stop early when feeling better.',
      'Abstain from sexual intercourse until both partners have completed treatment and all sores or symptoms have cleared for at least 7 days.',
      'Never take leftover antibiotics or unverified street medications; correct prescription depends on the exact diagnosis.',
    ],
    detailedContent: [
      'The "Ping-Pong" Reinfection Cycle: If only one person takes medicine, the untreated partner will re-infect them during their next sexual encounter. Ethiopian health centers provide "Partner Notification Slips" so your partner can receive confidential medication.',
      'Antimicrobial Resistance (AMR): Gonorrhea has developed high resistance to common antibiotics worldwide. Taking improper dosages or stopping after 2 days breeds resistant bacteria that may become incurable.',
      'Youth-Friendly Clinics: In Ethiopia, YFS centers treat teenagers and unmarried young adults confidentially, with no judgment and free/subsidized care.',
    ],
    adolescentNote: 'Do not be embarrassed to visit a Youth-Friendly clinic. Healthcare professionals are trained to provide supportive, confidential treatment without notifying parents or partners without consent.',
    suggestedPrompt: 'Why is it critical that both partners are treated for an STI at the same time, and why must antibiotics be finished completely?',
  },

  // 3. PREGNANCY COMPREHENSIVE
  {
    id: 'pregnancy_signs_tests_anc',
    category: 'pregnancy',
    title: 'Pregnancy Signs, Urine Tests & The 8 ANC Contacts',
    titleAm: 'የእርግዝና ምልክቶች፣ የሽንት ምርመራ እና የ 8ቱ የቅድመ ወሊድ (ANC) ክትትሎች',
    titleOm: 'Mallattoolee Ulfaa, Qorannoo Fincaanii fi Hordoffii ANC 8',
    titleTi: 'ምልክታት ጥንሲ፡ ናይ ሽንቲ መርመራን ናይተን 8ተ ናይ ቅድመ-ወሊድ (ANC) ክትትላትን',
    summary: 'Early physiological signs, urine hCG test accuracy and limitations, and the Ethiopian FMoH 8-contact ANC schedule.',
    sourceTag: 'Source: WHO Recommendations on Antenatal Care & Ethiopian FMoH ANC 8-Contact Model [VERIFIED]',
    keyPoints: [
      'Early signs: Missed period, nausea/vomiting (morning sickness), breast tenderness, fatigue, and frequent urination.',
      'Home urine tests detect hCG from the first day of a missed period, but CANNOT rule out ectopic pregnancy or check fetal viability.',
      'Ethiopia follows the WHO 8-Contact ANC Model: Contact 1 before 12 weeks, followed by 20, 26, 30, 34, 36, 38, and 40 weeks.',
      'Daily Iron and Folic Acid (IFA) supplements prevent maternal anemia and serious birth defects of the brain and spine.',
    ],
    detailedContent: [
      'What a Urine Test Can and Cannot Tell You:',
      '• Can Tell: Whether the hCG hormone is present in your urine, indicating conception.',
      '• Cannot Tell: Whether the pregnancy is developing safely inside the uterus (intrauterine) or dangerously inside a fallopian tube (ectopic). Only a clinical ultrasound examination can verify this.',
      'The 8 ANC Contacts in Ethiopia:',
      '1. Contact 1 (<12 weeks): Confirm gestational age, screening for anemia, syphilis, HIV, blood group/Rh factor, initiate daily IFA.',
      '2. Contact 2 (20 weeks): Ultrasound scan for anatomy, assess fetal heartbeat and growth.',
      '3. Contact 3 (26 weeks): Screen for gestational diabetes, maternal anemia, high blood pressure.',
      '4. Contact 4 (30 weeks): Review maternal wellbeing, tetanus toxoid vaccination.',
      '5. Contact 5 (34 weeks): Screen for pre-eclampsia (blood pressure + urine protein), fetal position.',
      '6. Contact 6 (36 weeks): Finalize Individual Birth Preparedness and Complication Readiness Plan.',
      '7. Contact 7 (38 weeks): Monitor fetal movement and labor signs.',
      '8. Contact 8 (40 weeks): Post-dates assessment and delivery scheduling at health center/hospital.',
    ],
    suggestedPrompt: 'What happens during each of the 8 Antenatal Care (ANC) visits in Ethiopia, and why is the first visit before 12 weeks so important?',
  },
  {
    id: 'pregnancy_birth_preparedness_unintended',
    category: 'pregnancy',
    title: 'Birth Readiness, Postnatal Care & Unintended Pregnancy Options',
    titleAm: 'የወሊድ ዝግጁነት፣ ከወሊድ በኋላ እንክብካቤ እና ያልታቀደ እርግዝና አማራጮች',
    titleOm: 'Qophii Da’umsaa, Fayyaa Da’umsa Boodaa fi Filannoowwan Ulfa Hin Yaadaminii',
    titleTi: 'ድልውነት ወሊድ፡ ድሕሪ ወሊድ ዘሎ ክንክንን ዘይተሓስበ ጥንሲ እንተጋጢሙ ዘለዉ ኣማራጺታትን',
    summary: 'Birth preparedness planning, essential newborn care, and neutral, respectful information on options for unintended pregnancy.',
    sourceTag: 'Source: Ethiopian FMoH National Maternal & Newborn Health Guidelines & Proclamation on Reproductive Health [VERIFIED]',
    keyPoints: [
      'Birth Preparedness Plan: Identify delivery facility, arrange emergency transport, designate a birth companion, save emergency funds, and prepare clean clothes/supplies.',
      'Essential Newborn Care: Skin-to-skin warmth, early exclusive breastfeeding within 1 hour, chlorhexidine 7.1% umbilical cord gel, and newborn vaccines (BCG, Polio).',
      'Postnatal checkups are essential within 24 hours, at day 3, days 7–14, and 6 weeks after delivery.',
      'Unintended Pregnancy: Receive compassionate, confidential counseling at certified health centers, Marie Stopes, or FGAE clinics regarding safe, legal reproductive care under Ethiopian law.',
    ],
    detailedContent: [
      'Unintended Pregnancy Options in Ethiopia:',
      'If you face an unintended or crisis pregnancy, you are not alone. Seeking qualified, certified clinical care protects your life and future fertility.',
      '• Continuing the pregnancy: Supported with early ANC, nutritional guidance, and social counseling.',
      '• Safe Legal Services: Under Ethiopian Criminal Code Article 551, safe termination of pregnancy by qualified clinicians is legally permitted in cases of rape, incest, danger to maternal health or life, fetal abnormality, or if the woman is physically or mentally unprepared (including adolescents and students).',
      '• Warning on unsafe practices: NEVER insert foreign objects, consume toxic chemicals, or purchase unprescribed pills from unregulated black-market brokers. Visit certified public facilities, Marie Stopes clinics (Helpline 8044), or FGAE centers for safe, confidential care.',
    ],
    stigmaFreeNote: 'Healthcare providers in Youth-Friendly and certified clinics are bound by medical ethics to offer confidential, non-judgmental care to all women and adolescents.',
    suggestedPrompt: 'What should be included in an Ethiopian Birth Preparedness Plan, and what confidential services exist for unintended pregnancy?',
  },

  // 4. EMERGENCIES COMPREHENSIVE
  {
    id: 'emergencies_danger_signs_master',
    category: 'emergencies',
    title: 'Life-Threatening Maternal & Obstetric Danger Signs',
    titleAm: 'ለህይወት አስጊ የሆኑ የእናቶችና የእርግዝና አደገኛ ምልክቶች',
    titleOm: 'Mallattoolee Balaa Ulfaa fi Da’umsaa Lubbuu Galaafatan',
    titleTi: 'ህይወት ኣብ ሓደጋ ዘእትዉ ናይ ጥንስን ወሊድን ሓደገኛታት ምልክታት',
    summary: 'Immediate RED emergency triage signs during pregnancy, delivery, and postpartum that require instant hospital evaluation.',
    sourceTag: 'Source: WHO Emergency Triage Assessment and Treatment & Ethiopian National EmONC Protocol [VERIFIED]',
    keyPoints: [
      'Severe Vaginal Bleeding (soaking >1 pad/hour or large clots) is an extreme emergency: rush to hospital immediately.',
      'Severe headache, blurred vision, seeing flashes of light, or facial swelling are signs of Pre-eclampsia; risk of maternal seizures (Eclampsia).',
      'High fever with chills and foul-smelling vaginal discharge indicates Puerperal Sepsis (severe uterine infection).',
      'Reduced or absent baby kicks after 28 weeks (<10 movements in 2 hours of resting) requires immediate fetal heartbeat monitoring.',
      'Waters breaking early (PPROM) or sudden fluid gush before 37 weeks requires urgent hospital admission to prevent infection and cord prolapse.',
    ],
    detailedContent: [
      'What to do during an emergency transit:',
      '1. Call Red Cross Ambulance 907 or local ambulance dispatch 952 immediately.',
      '2. If bleeding or feeling faint: Lie down on your side with legs slightly elevated to prevent shock.',
      '3. If having a severe headache or visual aura: Keep environment quiet and dim while transporting to prevent seizure triggers.',
      '4. Never give oral fluids or solid foods to a patient who is convulsing or unconscious.',
      '5. Do NOT take unprescribed herbal medicines or wait until morning.',
    ],
    suggestedPrompt: 'What are the top 6 red-flag obstetric danger signs that mean a woman in Ethiopia must go to a hospital immediately?',
  },
];

/**
 * ----------------------------------------------------------------------------
 * 3. THREE GUIDED OFFLINE-CAPABLE QUESTIONNAIRES (DEVICE-ONLY TRIAGE)
 * ----------------------------------------------------------------------------
 */
export const GUIDED_QUESTIONNAIRES: GuidedQuestionnaire[] = [
  // 1. Pregnancy Danger Signs Checker
  {
    id: 'quest_pregnancy_danger',
    title: 'Pregnancy & Postpartum Danger Signs Checker',
    subtitle: '100% Offline Rule-Based Triage (Evaluated solely on your device)',
    description:
      'Answer these 5 quick questions about your symptoms. If any danger sign is present, the app will instantly show a RED emergency card with immediate actions.',
    questions: [
      {
        id: 'q_bleeding',
        text: 'Are you experiencing any vaginal bleeding or spotting right now?',
        options: [
          {
            label: 'Heavy bleeding: Soaking 1 or more pads in an hour, passing large clots',
            score: 'red',
            reason: 'Heavy vaginal bleeding is an obstetric emergency requiring immediate hospital resuscitation.',
          },
          {
            label: 'Light brown spotting or very mild occasional spotting',
            score: 'amber',
            reason: 'Mild spotting warrants a clinical evaluation within 24 to 48 hours to confirm placental and cervical health.',
          },
          {
            label: 'No bleeding or spotting at all',
            score: 'green',
            reason: 'Normal physiological state.',
          },
        ],
      },
      {
        id: 'q_headache_vision',
        text: 'Do you have a severe pounding headache, blurred vision, or facial/hand swelling?',
        options: [
          {
            label: 'Yes: Severe persistent headache, blurred vision, or seeing flashing spots',
            score: 'red',
            reason: 'Classic danger signs of severe Pre-eclampsia. Urgent blood pressure check and magnesium sulfate evaluation required.',
          },
          {
            label: 'Mild headache relieved by rest, hydration, or cool compress',
            score: 'green',
            reason: 'Common mild tension headache; stay hydrated and rest.',
          },
          {
            label: 'No headache, normal vision',
            score: 'green',
            reason: 'Normal physiological state.',
          },
        ],
      },
      {
        id: 'q_fetal_movement',
        text: 'If you are 28 weeks or more pregnant: How are your baby’s kicks and movements today?',
        options: [
          {
            label: 'Baby has stopped moving or moving significantly less than usual (<10 kicks in 2 hours)',
            score: 'red',
            reason: 'Reduced fetal movement is a critical red flag for fetal distress. Maternity triage must listen to heartbeat immediately.',
          },
          {
            label: 'Baby is moving normally and actively (10 or more movements within 2 hours of rest)',
            score: 'green',
            reason: 'Healthy active fetal movements.',
          },
          {
            label: 'I am less than 28 weeks pregnant / haven’t felt kicks yet',
            score: 'green',
            reason: 'Regular kick counting begins at 28 weeks gestational age.',
          },
        ],
      },
      {
        id: 'q_fever_discharge',
        text: 'Do you have a high fever, chills, or foul-smelling vaginal fluid/discharge?',
        options: [
          {
            label: 'Yes: High fever (>38°C) with shivering, chills, or smelly discharge',
            score: 'red',
            reason: 'High suspicion of uterine sepsis or acute infection; requires immediate hospital evaluation and antibiotics.',
          },
          {
            label: 'Mild warm sensation without fever or bad smell',
            score: 'amber',
            reason: 'Monitor temperature with a thermometer; see a clinic if it climbs above 37.5°C.',
          },
          {
            label: 'No fever, normal clear or whitish discharge with no odor',
            score: 'green',
            reason: 'Normal physiological leukorrhea.',
          },
        ],
      },
      {
        id: 'q_fluid_leakage',
        text: 'Have your waters broken, or do you feel a sudden warm fluid gush or continuous leaking?',
        options: [
          {
            label: 'Yes: Sudden gush of fluid or continuous leaking before 37 weeks or without contractions',
            score: 'red',
            reason: 'Premature rupture of membranes (PPROM). Hospital admission required to prevent cord prolapse and neonatal sepsis.',
          },
          {
            label: 'No fluid leakage, normal moisture only',
            score: 'green',
            reason: 'Normal intact amniotic sac.',
          },
        ],
      },
    ],
  },

  // 2. HIV & STI Exposure and Symptoms Assessment
  {
    id: 'quest_hiv_sti_exposure',
    title: 'HIV & STI Exposure & Symptoms Assessment',
    subtitle: 'Confidential Risk Evaluation with Instant 72-Hour PEP Alert',
    description:
      'Check whether you require emergency PEP within 72 hours, immediate STI syndromic care, or routine screening. No names or data are transmitted.',
    questions: [
      {
        id: 'q_exposure_time',
        text: 'Did you experience possible HIV exposure (unprotected sex, broken condom, or sexual violence) recently?',
        options: [
          {
            label: 'Yes, within the last 72 hours (Hours 1 to 72)',
            score: 'red',
            reason: 'TIME-CRITICAL EMERGENCY: You are within the 72-hour window for PEP. Seek emergency healthcare immediately.',
          },
          {
            label: 'Yes, but more than 72 hours ago (>3 days ago)',
            score: 'amber',
            reason: 'Too late for emergency PEP, but you should schedule an HIV test and baseline clinical screening soon.',
          },
          {
            label: 'No recent potential exposure in the past months',
            score: 'green',
            reason: 'No immediate emergency exposure noted.',
          },
        ],
      },
      {
        id: 'q_genital_sores',
        text: 'Do you have any genital sores, ulcers, blisters, or painful swellings in your groin?',
        options: [
          {
            label: 'Yes: Genital sores, blisters, or painful open ulcers',
            score: 'amber',
            reason: 'Indicates potential Syphilis, Herpes, or Chancroid. Requires clinical evaluation and dual partner treatment.',
          },
          {
            label: 'No sores, blisters, or ulcers',
            score: 'green',
            reason: 'Normal intact genital epithelium.',
          },
        ],
      },
      {
        id: 'q_unusual_discharge',
        text: 'Are you experiencing unusual discharge (yellow/green, thick, foul-smelling) or severe burning when urinating?',
        options: [
          {
            label: 'Yes: Abnormal yellow/greenish smelly discharge or severe burning',
            score: 'amber',
            reason: 'Possible Gonorrhea, Chlamydia, or Trichomoniasis. See a clinic soon for syndromic treatment for you and your partner.',
          },
          {
            label: 'Mild whitish odorless discharge with no itch or burning',
            score: 'green',
            reason: 'Normal physiological discharge.',
          },
          {
            label: 'No abnormal discharge or urinary pain',
            score: 'green',
            reason: 'Normal urinary and genital status.',
          },
        ],
      },
      {
        id: 'q_pelvic_pain',
        text: 'Do you have acute severe lower abdominal pelvic pain during intercourse or walking?',
        options: [
          {
            label: 'Yes: Severe lower abdominal pain with fever or chills',
            score: 'red',
            reason: 'Possible severe Pelvic Inflammatory Disease (PID) or ectopic pregnancy. Immediate clinical evaluation needed.',
          },
          {
            label: 'Mild intermittent cramping around period time',
            score: 'green',
            reason: 'Common cyclical discomfort; monitor with rest.',
          },
          {
            label: 'No lower abdominal pain',
            score: 'green',
            reason: 'Normal abdominal status.',
          },
        ],
      },
    ],
  },

  // 3. "When Should I Get Tested?" Navigator
  {
    id: 'quest_when_to_test',
    title: '"When Should I Get Tested?" Navigator',
    subtitle: 'Personalized Window Periods & Testing Recommendations',
    description:
      'Find out the optimal time to test for HIV, STIs, or pregnancy based on biological window periods and personal milestones.',
    questions: [
      {
        id: 'q_test_reason',
        text: 'What is your primary reason for considering testing right now?',
        options: [
          {
            label: 'I missed my period and might be pregnant',
            score: 'amber',
            reason: 'Take a urine pregnancy test today (accurate from day 1 of missed period). If positive, register for ANC before 12 weeks.',
          },
          {
            label: 'I had a new sexual partner or condom broke recently',
            score: 'amber',
            reason: 'If within 72 hours, seek PEP immediately. Otherwise, test for STIs now and test for HIV at 4–12 weeks.',
          },
          {
            label: 'Routine healthy checkup (it has been >6 months since my last test)',
            score: 'green',
            reason: 'Great proactive practice! Visit any Youth-Friendly Clinic or health center for a free confidential checkup.',
          },
          {
            label: 'I am pregnant and need routine antenatal testing',
            score: 'green',
            reason: 'Essential: Routine screening for HIV, Syphilis, Hepatitis B, and Anemia protects you and your developing baby.',
          },
        ],
      },
      {
        id: 'q_last_exposure_weeks',
        text: 'How long ago was your most recent possible exposure?',
        options: [
          {
            label: 'Less than 72 hours ago',
            score: 'red',
            reason: 'CRITICAL: Go to a health center or emergency room today for emergency PEP consultation.',
          },
          {
            label: 'Between 3 weeks and 12 weeks ago',
            score: 'amber',
            reason: 'Ideal testing window: Modern 4th generation antibody/antigen tests are highly accurate at this stage.',
          },
          {
            label: 'More than 3 months (12 weeks) ago',
            score: 'green',
            reason: 'Beyond standard window period: An HIV antibody test performed now provides definitive, conclusive results.',
          },
        ],
      },
      {
        id: 'q_self_test_interest',
        text: 'Would you prefer an oral self-test in private at home, or testing with a health worker at a clinic?',
        options: [
          {
            label: 'Private home self-test (HIVST oral swab or finger-prick)',
            score: 'green',
            reason: 'HIV self-test kits are available at participating pharmacies and health centers in Ethiopia with simple instructions.',
          },
          {
            label: 'Clinic testing with a counselor and comprehensive screening',
            score: 'green',
            reason: 'Recommended for comprehensive care: includes immediate confirmatory testing, STI screening, and family planning.',
          },
        ],
      },
    ],
  },
];

/**
 * ----------------------------------------------------------------------------
 * 4. PLACEHOLDER TESTING & CARE LOCATOR (VERIFIED HOTLINES & LABELED MOCK SITES)
 * ----------------------------------------------------------------------------
 */
export interface CareFacilityEntry {
  id: string;
  name: string;
  region: string;
  townOrSubcity: string;
  type: string;
  services: string[];
  phone: string;
  address: string;
  isYouthFriendly: boolean;
  hasOneStopCenter: boolean;
  hasEmergencyDelivery: boolean;
  hasHivPep: boolean;
  verifiedStatus: 'VERIFIED_HOTLINE' | 'PLACEHOLDER_VERIFY_BEFORE_VISIT';
}

export const REGIONAL_CARE_FACILITIES: CareFacilityEntry[] = [
  {
    id: 'fac_addis_yfs_bole',
    name: 'Bole 17 Health Center & Youth-Friendly Services [PLACEHOLDER - Verify before visiting]',
    region: 'Addis Ababa',
    townOrSubcity: 'Bole Subcity',
    type: 'Health Center (YFS)',
    services: ['Youth-Friendly SRH Clinic', 'HIV Testing & PEP', 'Syndromic STI Care', 'ANC & PNC', 'Contraception & Implants'],
    phone: '[Verify with Ministry of Health: local health center number]',
    address: 'Near 22 Mazoria, Bole, Addis Ababa',
    isYouthFriendly: true,
    hasOneStopCenter: false,
    hasEmergencyDelivery: true,
    hasHivPep: true,
    verifiedStatus: 'PLACEHOLDER_VERIFY_BEFORE_VISIT',
  },
  {
    id: 'fac_addis_gandhi',
    name: 'Gandhi Memorial Maternity Hospital & One-Stop Center [PLACEHOLDER - Verify before visiting]',
    region: 'Addis Ababa',
    townOrSubcity: 'Kirkos Subcity',
    type: 'Specialized Maternity Hospital',
    services: ['24/7 Emergency Maternity (CEmONC)', 'One-Stop GBV Center', 'PEP & Emergency Contraception', 'Pre-eclampsia ICU', 'Blood Transfusion'],
    phone: '[Verify with Ministry of Health: hospital emergency number]',
    address: 'Ras Desta Damtew Ave, Stadium Area, Addis Ababa',
    isYouthFriendly: true,
    hasOneStopCenter: true,
    hasEmergencyDelivery: true,
    hasHivPep: true,
    verifiedStatus: 'PLACEHOLDER_VERIFY_BEFORE_VISIT',
  },
  {
    id: 'fac_marie_stopes_mexico',
    name: 'Marie Stopes International Ethiopia SRH Center [PLACEHOLDER - Verify before visiting]',
    region: 'Addis Ababa',
    townOrSubcity: 'Kirkos Subcity',
    type: 'Certified NGO SRH Clinic',
    services: ['Confidential SRH & Family Planning', 'Youth-Friendly Counseling', 'STI Screening & Treatment', 'Post-Abortion Care'],
    phone: '8044 (Toll-Free Helpline [VERIFIED]) / [Verify with Ministry of Health: clinic direct number]',
    address: 'Near Mexico Square, Addis Ababa',
    isYouthFriendly: true,
    hasOneStopCenter: false,
    hasEmergencyDelivery: false,
    hasHivPep: true,
    verifiedStatus: 'VERIFIED_HOTLINE',
  },
  {
    id: 'fac_oromia_adama',
    name: 'Adama Hospital Medical College & One-Stop Center [PLACEHOLDER - Verify before visiting]',
    region: 'Oromia',
    townOrSubcity: 'Adama City',
    type: 'Referral & Teaching Hospital',
    services: ['24/7 Comprehensive Emergency Obstetric Care', 'One-Stop GBV Center', 'HIV ART & PEP Unit', 'Youth-Friendly SRH', 'Surgical Maternity'],
    phone: '[Verify with Ministry of Health: hospital emergency number]',
    address: 'Main Highway, Adama, East Shewa Zone',
    isYouthFriendly: true,
    hasOneStopCenter: true,
    hasEmergencyDelivery: true,
    hasHivPep: true,
    verifiedStatus: 'PLACEHOLDER_VERIFY_BEFORE_VISIT',
  },
  {
    id: 'fac_amhara_felege_hiwot',
    name: 'Felege Hiwot Comprehensive Specialized Hospital [PLACEHOLDER - Verify before visiting]',
    region: 'Amhara',
    townOrSubcity: 'Bahir Dar City',
    type: 'Specialized Referral Hospital',
    services: ['One-Stop GBV Center', '24/7 Emergency Delivery', 'Emergency PEP & HIV Care', 'Neonatal Intensive Care', 'Blood Bank'],
    phone: '[Verify with Ministry of Health: hospital emergency number]',
    address: 'Hospital Road, Bahir Dar',
    isYouthFriendly: true,
    hasOneStopCenter: true,
    hasEmergencyDelivery: true,
    hasHivPep: true,
    verifiedStatus: 'PLACEHOLDER_VERIFY_BEFORE_VISIT',
  },
  {
    id: 'fac_sidama_hawassa',
    name: 'Hawassa University Comprehensive Specialized Hospital [PLACEHOLDER - Verify before visiting]',
    region: 'Sidama',
    townOrSubcity: 'Hawassa City',
    type: 'University Referral Hospital',
    services: ['24/7 Maternity Emergency', 'One-Stop Crisis Center', 'Youth-Friendly Health Center', 'PMTCT & Pediatric HIV', 'Blood Bank'],
    phone: '[Verify with Ministry of Health: hospital emergency number]',
    address: 'Near Lake Hawassa, Hawassa City',
    isYouthFriendly: true,
    hasOneStopCenter: true,
    hasEmergencyDelivery: true,
    hasHivPep: true,
    verifiedStatus: 'PLACEHOLDER_VERIFY_BEFORE_VISIT',
  },
  {
    id: 'fac_tigray_ayder',
    name: 'Ayder Comprehensive Specialized Hospital [PLACEHOLDER - Verify before visiting]',
    region: 'Tigray',
    townOrSubcity: 'Mekelle City',
    type: 'Specialized Referral Hospital',
    services: ['24/7 Obstetric Triage', 'One-Stop Center for GBV', 'Free HIV Testing & PEP', 'Youth Counseling', 'Blood Transfusion'],
    phone: '[Verify with Ministry of Health: hospital emergency number]',
    address: 'Ayder Subcity, Mekelle',
    isYouthFriendly: true,
    hasOneStopCenter: true,
    hasEmergencyDelivery: true,
    hasHivPep: true,
    verifiedStatus: 'PLACEHOLDER_VERIFY_BEFORE_VISIT',
  },
  {
    id: 'fac_diredawa_dilchora',
    name: 'Dilchora Referral Hospital [PLACEHOLDER - Verify before visiting]',
    region: 'Dire Dawa',
    townOrSubcity: 'Dire Dawa City',
    type: 'Referral Hospital',
    services: ['Emergency Maternity Delivery', 'One-Stop Center', 'HIV PEP & ART Clinic', 'Youth-Friendly Clinic'],
    phone: '[Verify with Ministry of Health: hospital emergency number]',
    address: 'Kebele 02, Dire Dawa',
    isYouthFriendly: true,
    hasOneStopCenter: true,
    hasEmergencyDelivery: true,
    hasHivPep: true,
    verifiedStatus: 'PLACEHOLDER_VERIFY_BEFORE_VISIT',
  },
];
