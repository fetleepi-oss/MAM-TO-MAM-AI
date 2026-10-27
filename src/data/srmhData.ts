/**
 * ============================================================================
 * MAM-to-MAM AI: Clinical Content & Reference Data (Ethiopia)
 * ============================================================================
 * 
 * REVIEW NOTE FOR HEALTHCARE PROFESSIONALS:
 * Educational content based on WHO and Ministry of Health materials, pending clinical review.
 *
 * References:
 * 1. World Health Organization (WHO) Sexual and Reproductive Health guidelines
 * 2. Ethiopian Federal Ministry of Health (FMoH) National Reproductive Health Guidelines
 * 3. Ethiopian Antenatal Care (ANC) 8-Contact Model
 * 4. National Adolescent and Youth Health Strategy (2021-2025)
 *
 * All guidance is non-diagnostic and non-prescriptive.
 * ============================================================================
 */

import { LearnTopic, TriageCondition, HealthFacility } from '../types/srmh';

/**
 * ----------------------------------------------------------------------------
 * 1. LEARN MODULE: TOPIC CARDS WITH SHORT EXPLAINERS & CLINICAL FACTS
 * ----------------------------------------------------------------------------
 */
export const LEARN_TOPICS: LearnTopic[] = [
  {
    id: 'puberty-body-changes',
    title: 'Puberty & Body Changes',
    titleAm: 'የጉርምስና ወቅትና የአካላዊ ለውጦች',
    titleOm: 'Dargaggummaa fi Jijjiirama Qaamaa',
    titleTi: 'ናይ ጉርዝውና ግዜን ኣካላዊ ለውጥን',
    category: 'puberty',
    iconName: 'Sparkles',
    shortSummary: 'Understand normal physical, emotional, and hormonal changes during puberty in girls and boys.',
    detailedExplainer: [
      'Puberty typically begins between ages 9 and 14 as the brain signals the body to produce reproductive hormones (estrogen and progesterone in girls, testosterone in boys).',
      'For young girls, changes include breast budding, growth of pubic and underarm hair, body shape maturation, and the onset of the first menstrual period (menarche), usually within 2 years of breast budding.',
      'For young boys, changes include voice deepening, facial/body hair, testicular enlargement, and spontaneous wet dreams (nocturnal emissions), which are completely normal and involuntary.',
      'Emotional changes like mood swings and desire for privacy are natural parts of growing up.',
    ],
    keyFacts: [
      'Menarche (first period) is a healthy milestone, not an illness or curse.',
      'Every person’s body develops at its own unique pace; early or later onset is usually normal.',
      'Maintaining daily personal hygiene with clean water and mild soap prevents skin irritation.',
    ],
    suggestedPrompt: 'What should a young person in Ethiopia expect during puberty, and how can they maintain good hygiene?',
  },
  {
    id: 'menstrual-health',
    title: 'Menstrual Health & Hygiene',
    titleAm: 'የወር አበባ ጤናና ንፅህና አጠባበቅ',
    titleOm: 'Fayyaa Marsaa Laguu fi Qulqullina',
    titleTi: 'ናይ ጽግያት ጥዕናን ጽሬትን',
    category: 'menstruation',
    iconName: 'Droplet',
    shortSummary: 'Cycle length basics, managing cramps, choosing hygienic materials, and knowing when to see a doctor.',
    detailedExplainer: [
      'A menstrual cycle is measured from the first day of bleeding up to the first day of the next period. A normal cycle lasts between 21 and 35 days (average 28 days), with bleeding lasting 3 to 7 days.',
      'The bleeding is the natural shedding of the inner lining of the uterus (endometrium) when pregnancy has not occurred.',
      'Period cramps (dysmenorrhea) are caused by uterine contractions. Mild cramps can be soothed with a warm water bottle, gentle walking, hydration, and resting.',
      'Use clean, dry cotton pads or reusable washed cloths dried in direct sunlight to prevent pelvic infections.',
    ],
    keyFacts: [
      'Menstrual blood is clean physiological tissue, not toxic or dirty waste.',
      'Sudden severe cramps that interfere with school or work should be evaluated at a health center.',
      'Soaking through more than 1 pad every 1 to 2 hours with large blood clots requires medical evaluation.',
    ],
    suggestedPrompt: 'How can I calculate if my menstrual cycle is regular, and what are safe ways to relieve painful cramps?',
  },
  {
    id: 'contraception-basics',
    title: 'Contraception & Family Planning',
    titleAm: 'የወሊድ መከላከያ መሰረታዊ መረጃዎች',
    titleOm: 'Mala Ittisa Da’umsaa fi Karoora Maatii',
    titleTi: 'ናይ መከላኸሊ ጥንሲ መሰረታዊ ሓበሬታ',
    category: 'contraception',
    iconName: 'Shield',
    shortSummary: 'Modern family planning methods available in Ethiopian public health facilities and private pharmacies.',
    detailedExplainer: [
      'Contraception prevents unintended pregnancies, allows women to space children safely, and protects maternal health.',
      'Long-Acting Reversible Contraception (LARC): Subcutaneous implants (Implanon NXT for 3 years, Jadelle for 5 years) and Copper IUDs (up to 12 years) are highly effective (>99%) and widely provided by Kebele Health Extension Workers and health centers.',
      'Short-Acting Methods: 3-month injectables (Depo-Provera / Sayana Press), daily oral contraceptive pills, and male/female condoms.',
      'Emergency Contraception (e.g. Postinor-2): Can prevent pregnancy if taken within 72 to 120 hours after unprotected sex, but is not intended for regular use.',
    ],
    keyFacts: [
      'Modern contraceptives do NOT cause permanent infertility; fertility returns after discontinuation.',
      'Condoms are the only contraceptive method that also protects against Sexually Transmitted Infections (STIs) and HIV (Dual Protection).',
      'Free or low-cost family planning is guaranteed in Ethiopian public health centers and Kebele Health Posts.',
    ],
    suggestedPrompt: 'What are the most popular, reversible contraceptive methods available at Ethiopian Health Posts, and what are common side effects?',
  },
  {
    id: 'stis-and-hiv',
    title: 'STIs, HIV & Dual Protection',
    titleAm: 'የአባላዘር በሽታዎች፣ ኤችአይቪ እና ድርብ ጥበቃ',
    titleOm: 'Dhibee Daddarboo Wal-qunnamtii fi HIV',
    titleTi: 'ሕማማት ርክብ-ስጋን ኤች.ኣይ.ቪን',
    category: 'stis',
    iconName: 'ShieldAlert',
    shortSummary: 'Signs of common STIs, HIV prevention, condom usage, PrEP, and emergency PEP within 72 hours.',
    detailedExplainer: [
      'Sexually Transmitted Infections (like Syphilis, Gonorrhea, Chlamydia, Trichomoniasis, HPV, and HIV) are passed through unprotected vaginal, anal, or oral sex.',
      'Common symptoms include unusual, foul-smelling vaginal or penile discharge, burning sensation during urination, sores or blisters in the genital area, and lower abdominal pain. However, many STIs show zero early symptoms.',
      'Post-Exposure Prophylaxis (PEP): If you have been exposed to HIV (unprotected sex, broken condom, or sexual violence), taking antiretroviral medications starting strictly within 72 hours can prevent infection.',
      'Pre-Exposure Prophylaxis (PrEP): Daily pill for individuals at ongoing elevated risk of HIV infection.',
    ],
    keyFacts: [
      'Both partners must be treated simultaneously for an STI to prevent reinfection.',
      'HIV testing and Antiretroviral Therapy (ART) are free in Ethiopian government health facilities.',
      'After sexual assault, visit a health facility immediately for emergency contraception and PEP within 72 hours.',
    ],
    suggestedPrompt: 'What are the early warning signs of an STI, and how do I access PEP within 72 hours in Ethiopia?',
  },
  {
    id: 'fertility-ovulation',
    title: 'Fertility, Ovulation & Conception',
    titleAm: 'የማርገዝ እድል፣ እንቁላል ማፍራትና ፅንሰት',
    titleOm: 'Kukkuullaa fi Guyyoota Ulfaaf Mijatoo',
    titleTi: 'ምጥናስን ናይ እንቋቝሖ ምፍራይ ግዜን',
    category: 'fertility',
    iconName: 'Heart',
    shortSummary: 'Understanding your fertile window, ovulation timing, cervical fluid changes, and conception biology.',
    detailedExplainer: [
      'Ovulation is the release of a mature egg from the ovary, which generally occurs roughly 14 days before the next period starts.',
      'The "Fertile Window" spans approximately 6 days: the 5 days leading up to ovulation plus ovulation day itself, because sperm can survive up to 5 days in fertile cervical mucus.',
      'Fertile cervical fluid resembles raw egg whites: clear, slippery, and stretchy between fingers.',
      'For women with regular 26-to-32 day cycles, days 8 through 19 of the cycle are considered high-fertility days (Standard Days Method / CycleBeads).',
    ],
    keyFacts: [
      'Pregnancy can occur even during the first sexual encounter if intercourse coincides with the fertile window.',
      'Teens and young women with irregular cycles cannot reliably use rhythm or calendar methods alone.',
      'Ovulation can be delayed by physical illness, extreme emotional distress, rapid weight change, or rigorous travel.',
    ],
    suggestedPrompt: 'How can I pinpoint my fertile window using calendar tracking and cervical mucus observations?',
  },
  {
    id: 'pregnancy-prenatal-care',
    title: 'Pregnancy & Prenatal Care (ANC)',
    titleAm: 'የእርግዝና ክትትልና እንክብካቤ (ANC)',
    titleOm: 'Ulfaa fi Hordoffii Da’umsa Duraa',
    titleTi: 'ናይ ጥንሲ ክትትልን ጥዕናን',
    category: 'pregnancy',
    iconName: 'Baby',
    shortSummary: 'The WHO and Ethiopian FMoH 8-Contact Antenatal Care model, nutrition, vitamins, and danger signs.',
    detailedExplainer: [
      'Antenatal Care (ANC) saves lives by monitoring the baby’s development, detecting high blood pressure (pre-eclampsia), and providing essential preventative treatments.',
      'The Ethiopian Ministry of Health recommends at least 8 ANC contacts during a healthy pregnancy: Contact 1 before 12 weeks, followed by visits at 20, 26, 30, 34, 36, 38, and 40 weeks.',
      'Essential daily supplement: Iron and Folic Acid (IFA) tablets prevent maternal anemia and neural tube birth defects. They should be taken daily throughout pregnancy.',
      'Tetanus Toxoid (TT) vaccination protects both mother and newborn against fatal neonatal tetanus.',
      'In malaria-prone Ethiopian woredas, sleeping under an Insecticide-Treated Net (ITN) is critical.',
    ],
    keyFacts: [
      'Contact 1 should occur within the first 12 weeks to confirm gestational age and screen for anemia/infections.',
      'Daily kick counts: Starting at 28 weeks, pregnant mothers should notice at least 10 distinct movements within 2 hours of rest.',
      'Never take unprescribed herbal medicines or self-medicate while pregnant.',
    ],
    suggestedPrompt: 'What tests and vaccines are given during the 8 ANC visits in Ethiopia, and what are normal vs dangerous pregnancy symptoms?',
  },
  {
    id: 'postnatal-care-newborn',
    title: 'Postnatal Care & Newborn Health',
    titleAm: 'ከወሊድ በኋላ የእናትና የህፃን ጤና እንክብካቤ',
    titleOm: 'Fayyaa Da’umsa Boodaa fi Daa’ima Haaraa',
    titleTi: 'ድሕሪ ወሊድ ናይ ኣደን ህጻንን ጥዕና',
    category: 'postnatal',
    iconName: 'HeartHandshake',
    shortSummary: 'Postpartum recovery, 6-week clinical checkups, exclusive breastfeeding, and baby blues vs postpartum depression.',
    detailedExplainer: [
      'The first 6 weeks following birth (postpartum period) are critical. The mother’s body is healing, the uterus shrinks back to normal size, and breast milk production establishes.',
      'Postpartum bleeding (lochia) is normal for 2 to 6 weeks, gradually changing from red to pink, brownish, and yellowish-white. It should steadily decrease in volume.',
      'Exclusive breastfeeding for the first 6 months provides complete nutrition and immune antibodies. It also provides natural contraceptive protection (LAM) only if all 3 conditions are met (baby < 6 months, no period returned, exclusive day/night nursing).',
      'Postpartum visits in Ethiopia should happen within 24 hours of birth, at day 3, between days 7–14, and at 6 weeks.',
    ],
    keyFacts: [
      'Soaking more than one large sanitary pad within an hour or passing large blood clots is an emergency (Postpartum Hemorrhage).',
      'High fever with shivering and foul-smelling vaginal discharge indicates uterine sepsis requiring immediate antibiotics.',
      'Feelings of sadness or despair lasting beyond 2 weeks after birth may indicate postpartum depression; ask your HEW for support.',
    ],
    suggestedPrompt: 'What are normal signs of postpartum healing, and what danger signs indicate severe infection or hemorrhage after delivery?',
  },
];

/**
 * ----------------------------------------------------------------------------
 * 2. CRITICAL DANGER SYMPTOMS (GLOBAL CHAT & TRACKER INTERCEPTOR)
 * ----------------------------------------------------------------------------
 */
export const CRITICAL_DANGER_SYMPTOMS = [
  {
    id: 'danger_bleeding',
    keywords: ['heavy bleeding', 'soaking pads', 'blood clots', 'bleeding in pregnancy', 'vaginal hemorrhage', 'ደም መፍሰስ', 'dhiiga baayee', 'ደም ምፍሳስ', 'soaking'],
    title: 'Severe Vaginal Bleeding',
    titleAm: 'ከፍተኛ የደም መፍሰስ',
    urgencyText: 'Go immediately to the nearest health center or emergency hospital. Lie down with legs raised during transit.',
  },
  {
    id: 'danger_preeclampsia',
    keywords: ['severe headache', 'blurry vision', 'blurred vision', 'seeing spots', 'swollen face', 'convulsion', 'fits', 'ራስ ምታት', 'የአይን ብዥታ', 'መንቀጥቀጥ', 'headache and blurred vision', 'pounding headache'],
    title: 'Severe Headache, Vision Loss or Fits (Pre-eclampsia)',
    titleAm: 'ከፍተኛ የራስ ምታትና የአይን ብዥታ',
    urgencyText: 'Immediate medical evaluation required to prevent seizures (eclampsia) and protect mother and fetus.',
  },
  {
    id: 'danger_fever_sepsis',
    keywords: ['high fever', 'chills', 'foul discharge', 'smelly discharge', 'fever after birth', 'fever after abortion', 'ትኩሳት', 'hoo’a qaamaa', 'ረስኒ'],
    title: 'High Fever & Foul Discharge (Sepsis)',
    titleAm: 'ከፍተኛ ትኩሳትና መጥፎ ጠረን ያለው ፈሳሽ',
    urgencyText: 'Urgent intravenous antibiotics required for severe uterine or pelvic infection.',
  },
  {
    id: 'danger_fetal_movement',
    keywords: ['baby stopped moving', 'no kicks', 'reduced fetal movement', 'less kicks', 'not moving', 'የህጻኑ እንቅስቃሴ', 'daa’imni hin sochoone'],
    title: 'Decreased or Absent Baby Kicks (After 28 Weeks)',
    titleAm: 'የህጻኑ እንቅስቃሴ መቀነስ ወይም መቆም',
    urgencyText: 'Do not wait. Go immediately to maternity triage to listen to the fetal heartbeat.',
  },
  {
    id: 'danger_severe_pain',
    keywords: ['severe abdominal pain', 'unbearable stomach pain', 'rigid abdomen', 'ከባድ የሆድ ህመም', 'dhukkubbii garaa cimaa'],
    title: 'Severe Unbearable Abdominal Pain',
    titleAm: 'ከባድ የሆድ ህመም',
    urgencyText: 'Could indicate ectopic pregnancy, placental abruption, or appendicitis. Immediate surgical triage needed.',
  },
  {
    id: 'danger_violence_assault',
    keywords: ['sexual assault', 'forced sex', 'forced to have sex', 'against my will', 'rape', 'raped', 'abused', 'coerced', 'sexual violence', 'molested', 'violated', 'አስገድዶ መድፈር', 'የፆታ ጥቃት', 'ተደፍሬ', 'የተደፈርኩ', 'dirqisiifame', 'dirqisiisa', 'humnaan'],
    title: 'Sexual Assault / Urgent Protection',
    titleAm: 'የፆታ ጥቃት / አስቸኳይ የህክምና ድጋፍ',
    urgencyText: 'Time-critical emergency: Receive HIV PEP and Emergency Contraception within 72 hours. Call AWSAD 6226, FMoH 8335, or [Verify with Ministry of Health: emergency number] and visit a hospital One-Stop Center immediately.',
  },
  {
    id: 'danger_mental_crisis',
    keywords: ['dont want to live', "don't want to live", 'hopeless', 'end my life', 'kill myself', 'suicide', 'self-harm', 'self harm', 'መኖር አልፈልግም', 'ራሴን ላጠፋ', 'lubbuu koo balleessuu'],
    title: 'Emotional Crisis & Urgent Support',
    titleAm: 'የስነ-ልቦና ድጋፍና አስቸኳይ የአዕምሮ ጤና እርዳታ',
    urgencyText: 'You are valuable and not alone. Call toll-free 8335 or [Verify with Ministry of Health: emergency number] right now to speak with a caring, confidential counselor.',
  },
  {
    id: 'danger_abortion_dose',
    keywords: ['abortion pill dose', 'misoprostol dose', 'mifepristone dose', 'exact dosage', 'how many pills to take for abortion', 'abortion at home', 'ኪኒን መጠን', 'qoricha ulfa baasu'],
    title: 'Clinical Safety: Unprescribed Medication Risk',
    titleAm: 'ያለሀኪም ትዕዛዝ መድኃኒት የመውሰድ አደጋ',
    urgencyText: 'Never take abortion pills without clinical evaluation to rule out life-threatening ectopic pregnancy. Call Marie Stopes 8044 for safe, legal care.',
  },
];

/**
 * ----------------------------------------------------------------------------
 * 3. SEEK CARE: TRIAGE ENGINE (SELF-CARE vs CLINIC SOON vs GO IMMEDIATELY)
 * ----------------------------------------------------------------------------
 */
export const TRIAGE_CONDITIONS_LIST: TriageCondition[] = [
  {
    id: 'triage-1',
    label: 'Sudden Heavy Vaginal Bleeding (Soaking >1 pad/hour)',
    urgency: 'go_immediately',
    actionText: 'RUSH TO HOSPITAL EMERGENCY IMMEDIATELY. Call 907 (Red Cross Ambulance) or 952. Do not wait.',
    warningNotice: 'Postpartum hemorrhage or miscarriage bleeding can become life-threatening within hours.',
    suggestedQuestionsForProvider: [
      'How many sanitary pads have I soaked in the past 2 hours?',
      'Do I need an ultrasound, IV fluids, or a blood transfusion?',
      'Could this be related to my pregnancy or family planning device?',
    ],
  },
  {
    id: 'triage-2',
    label: 'Pregnant with Severe Headache & Blurred Vision',
    urgency: 'go_immediately',
    actionText: 'GO TO THE NEAREST HEALTH FACILITY IMMEDIATELY. Danger sign of severe pre-eclampsia.',
    warningNotice: 'Requires immediate blood pressure check and magnesium sulfate if blood pressure is dangerously high.',
    suggestedQuestionsForProvider: [
      'What is my blood pressure reading right now?',
      'Is there protein in my urine test?',
      'Are there any signs of early labor or fetal distress?',
    ],
  },
  {
    id: 'triage-3',
    label: 'High Fever & Chills within 6 Weeks of Childbirth or Miscarriage',
    urgency: 'go_immediately',
    actionText: 'GO IMMEDIATELY TO HEALTH CENTER OR HOSPITAL. High risk of puerperal sepsis.',
    warningNotice: 'Uterine infections require rapid clinical examination and antibiotics.',
    suggestedQuestionsForProvider: [
      'What is my temperature reading?',
      'Do I need blood tests or a pelvic examination?',
      'Are the prescribed antibiotics safe for my breastfeeding infant?',
    ],
  },
  {
    id: 'triage-4',
    label: 'Yellow/Green Vaginal Discharge with Itching or Burning',
    urgency: 'clinic_soon',
    actionText: 'SEE A CLINIC SOON (Within 24 to 48 hours). Visit your Kebele Health Post or Woreda Health Center.',
    warningNotice: 'Likely a common vaginal infection or STI (like Trichomoniasis or Yeast). Avoid sex until treated.',
    suggestedQuestionsForProvider: [
      'Is this discharge caused by a yeast infection, bacterial vaginosis, or an STI?',
      'Does my partner also need to take medication at the same time?',
      'Can I continue using my current contraceptive method during treatment?',
    ],
  },
  {
    id: 'triage-5',
    label: 'Missed Period by 1 to 2 Weeks with Mild Breast Tenderness',
    urgency: 'clinic_soon',
    actionText: 'SEE A CLINIC SOON. Take an over-the-counter urine pregnancy test or visit your Kebele HEW for testing.',
    warningNotice: 'If positive, early ANC registration before 12 weeks ensures the healthiest start.',
    suggestedQuestionsForProvider: [
      'Can you confirm my pregnancy with a urine or blood test?',
      'Can I begin taking Iron and Folic Acid (IFA) tablets today?',
      'When is my first recommended Antenatal Care (ANC) appointment?',
    ],
  },
  {
    id: 'triage-6',
    label: 'Mild Menstrual Cramps on Day 1 or 2 of Period',
    urgency: 'self_care',
    actionText: 'SELF-CARE. Normal primary menstrual discomfort. Rest, stay hydrated, apply warm compress.',
    warningNotice: 'If pain suddenly becomes excruciating or is accompanied by fever, seek clinical care.',
    suggestedQuestionsForProvider: [
      'What safe over-the-counter pain relievers are recommended in Ethiopia?',
      'Could my diet or exercise routine help alleviate cyclical cramps?',
    ],
  },
  {
    id: 'triage-7',
    label: 'Mild Nausea and Morning Sickness in Early Pregnancy (Weeks 6–10)',
    urgency: 'self_care',
    actionText: 'SELF-CARE. Common early pregnancy symptom. Eat small frequent dry meals, sip ginger tea or water.',
    warningNotice: 'If you cannot keep any liquids down for 24 hours or feel dizzy (hyperemesis), visit the health center.',
    suggestedQuestionsForProvider: [
      'How much fluid do I need to prevent dehydration?',
      'When does morning sickness typically subside?',
    ],
  },
];

/**
 * ----------------------------------------------------------------------------
 * 4. ETHIOPIAN HEALTH FACILITIES (MOCK SAMPLE DATA BY REGION)
 * ----------------------------------------------------------------------------
 */
export const ETHIOPIAN_MOCK_FACILITIES: HealthFacility[] = [
  {
    id: 'fac-1',
    name: 'Bole 17 Health Center & Youth-Friendly Clinic',
    region: 'Addis Ababa',
    woreda: 'Bole Subcity, Woreda 03',
    type: 'Health Center (YFS)',
    services: ['Youth-Friendly Services (YFS)', 'ANC / PNC Care', 'Family Planning (Implants, IUDs)', 'HIV Testing & PEP', 'Normal Delivery'],
    phone: '[Verify with Ministry of Health: local health center number]',
    address: 'Near 22 Mazoria, Bole Subcity, Addis Ababa',
    isYouthFriendly: true,
  },
  {
    id: 'fac-2',
    name: 'Gandhi Memorial Gynecological & Maternity Hospital',
    region: 'Addis Ababa',
    woreda: 'Kirkos Subcity',
    type: 'Referral / General Hospital',
    services: ['24/7 Emergency Maternity', 'Cesarean Delivery (CEmONC)', 'Pre-eclampsia ICU', 'Newborn Special Care Unit', 'Blood Transfusion'],
    phone: '[Verify with Ministry of Health: hospital emergency number]',
    address: 'Ras Desta Damtew Avenue, Stadium Area, Addis Ababa',
  },
  {
    id: 'fac-3',
    name: 'Marie Stopes Ethiopia SRH Center (Mexico)',
    region: 'Addis Ababa',
    woreda: 'Kirkos Subcity',
    type: 'Marie Stopes / FGAE Clinic',
    services: ['Confidential Youth SRH', 'Comprehensive Contraceptive Choices', 'Post-Abortion Care', 'STI Screening & Treatment'],
    phone: '8044 (Toll-Free [VERIFIED]) / [Verify with Ministry of Health: clinic direct number]',
    address: 'Near Mexico Square, Addis Ababa',
    isYouthFriendly: true,
  },
  {
    id: 'fac-4',
    name: 'Adama Kebele 04 Health Post [PLACEHOLDER]',
    region: 'Oromia',
    woreda: 'Adama Town',
    type: 'Health Post (HEWs)',
    services: ['Health Extension Worker Consultations', 'Depo-Provera & Implants', 'Oral Pills & Condoms', 'Pregnancy Screening & Referral'],
    phone: '[Verify with Ministry of Health: local health post number]',
    address: 'Kebele 04, Adama, East Shewa Zone',
    isYouthFriendly: true,
  },
  {
    id: 'fac-5',
    name: 'Hawassa Adare Primary Hospital',
    region: 'Sidama',
    woreda: 'Hawassa City',
    type: 'Primary Hospital',
    services: ['Comprehensive Obstetric Care', 'Ambulance Dispatch', 'ANC Ultrasound', 'Postnatal Immunization'],
    phone: '[Verify with Ministry of Health: hospital emergency number]',
    address: 'Adare Subcity, Hawassa',
  },
  {
    id: 'fac-6',
    name: 'Bahir Dar Han Health Center & YFS Unit',
    region: 'Amhara',
    woreda: 'Bahir Dar City',
    type: 'Health Center (YFS)',
    services: ['Youth-Friendly SRH', 'Maternal Health Clinic', 'Family Planning', 'STI Management'],
    phone: '[Verify with Ministry of Health: local health center number]',
    address: 'Shimbit Area, Bahir Dar',
    isYouthFriendly: true,
  },
  {
    id: 'fac-7',
    name: 'Mekelle Quiha Health Center',
    region: 'Tigray',
    woreda: 'Mekelle City',
    type: 'Health Center (YFS)',
    services: ['Maternity Care', 'Post-Exposure Prophylaxis (PEP)', 'Contraception', 'Child Immunization'],
    phone: '[Verify with Ministry of Health: local health center number]',
    address: 'Quiha Subcity, Mekelle',
    isYouthFriendly: true,
  },
  {
    id: 'fac-8',
    name: 'Dire Dawa Sabian General Hospital',
    region: 'Dire Dawa',
    woreda: 'Sabian Area',
    type: 'Referral / General Hospital',
    services: ['Emergency Obstetric Surgical Care', '24/7 Maternity Emergency', 'Blood Bank', 'Neonatal Care'],
    phone: '[Verify with Ministry of Health: hospital emergency number]',
    address: 'Sabian, Dire Dawa',
  },
];

/**
 * ----------------------------------------------------------------------------
 * 5. ETHIOPIAN EMERGENCY & SRH TOLL-FREE HOTLINES (AUDITED)
 * ----------------------------------------------------------------------------
 */
export const EMERGENCY_HOTLINES = [
  {
    number: '907',
    title: 'Ethiopian Red Cross Ambulance [VERIFIED]',
    titleAm: 'የኢትዮጵያ ቀይ መስቀል አምቡላንስ [የተረጋገጠ]',
    desc: 'National 24/7 free ambulance emergency dispatch across regional cities and zones (Source: Ethiopian Red Cross Society).',
    isEmergency: true,
  },
  {
    number: '8335',
    title: 'FMoH National Health Line [VERIFIED]',
    titleAm: 'የጤና ሚኒስቴር ነፃ የጤና ስልክ [የተረጋገጠ]',
    desc: 'Free health consultation, maternal referral, disease surveillance, and clinic guidance (Source: Ethiopian Ministry of Health / EPHI).',
    isEmergency: false,
  },
  {
    number: '952',
    title: 'Addis Ababa Emergency Dispatch (EMS) [VERIFIED]',
    titleAm: 'የአዲስ አበባ አደጋ መከላከልና ድንገተኛ ህክምና [የተረጋገጠ]',
    desc: '24/7 municipal emergency ambulance service for Addis Ababa residents (Source: Addis Ababa Fire & Emergency Prevention & Rescue Authority).',
    isEmergency: true,
  },
  {
    number: '8044',
    title: 'Marie Stopes SRH Confidential Helpline [VERIFIED]',
    titleAm: 'የማሪ ስቶፕስ ሚስጥራዊ የስነ-ተዋልዶ ስልክ [የተረጋገጠ]',
    desc: 'Confidential, youth-friendly SRH counseling and family planning guidance (Source: Marie Stopes International Ethiopia).',
    isEmergency: false,
  },
  {
    number: '6226',
    title: "AWSAD Women's Crisis & Shelter Helpline [VERIFIED]",
    titleAm: 'የአውሳድ (AWSAD) የፆታ ጥቃትና የአደጋ ጊዜ መጠለያ ስልክ [የተረጋገጠ]',
    desc: 'Confidential survivor support, emergency shelter, legal and medical referrals (Source: Association for Women\'s Sanctuary and Development).',
    isEmergency: true,
  },
  {
    number: '[Verify with Ministry of Health: emergency number]',
    title: 'Regional Crisis Support [UNVERIFIED - Verification Required]',
    titleAm: 'የአካባቢ የአደጋ ጊዜ ስልክ [ያልተረጋገጠ]',
    desc: 'Call 8335 to verify your local district ambulance or GBV response team phone number.',
    isEmergency: true,
  },
];
