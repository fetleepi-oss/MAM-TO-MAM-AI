import { LanguageCode } from '../types/srmh';

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
}

export const translations: Record<LanguageCode, TranslationStrings> = {
  en: {
    appName: 'MAM-to-MAM AI',
    tagline: 'AI-Enabled Sexual, Reproductive & Maternal Health',
    footerNote: 'Early MVP / Proof of Concept. Not a substitute for professional care.',
    badgeMvp: 'Early MVP Proof of Concept',
    badgePrivacy: '100% Private & Device-Only Tracking',
    privacyModalTitle: 'Your Privacy & Data Processing',
    privacyModalIntro: 'MAM-to-MAM AI is an anonymous, confidential health companion designed for Ethiopia.',
    privacyModalBullets: [
      'No personal identifiers (no names, phone numbers, email, or exact addresses) are ever requested, collected, or stored.',
      'Cycle dates, pregnancy tracking weeks, questionnaire answers, and symptom logs stay stored strictly on this device only (in your browser).',
      'When you chat with Ask MAM, your question text is sent securely to Google Gemini AI to generate the health explanation. No names, phone numbers, or identifiers are attached, transmitted, or logged.',
      'Educational content based on WHO and Ministry of Health materials, pending clinical review.',
      'MAM-to-MAM AI does not diagnose or prescribe medications. In an emergency, always seek immediate clinical care.',
    ],
    privacyModalButton: 'I Understand & Continue',
    journeyTitle: 'SRMH Care Continuum',
    askMamButton: 'Ask MAM',
    askMamTitle: 'Ask MAM AI Companion',
    dangerAlertBanner: 'Emergency Danger Sign Detected: Seek Immediate Clinical Care',
    dangerModalTitle: 'Go to a Health Facility Now',
    dangerModalSubtitle: 'Your symptoms require immediate in-person clinical evaluation to protect your life and health.',
    stages: {
      learn: {
        title: 'LEARN',
        subtitle: 'SRH Education',
        desc: 'Puberty, periods, contraception, STIs, fertility & maternal health',
      },
      prevent: {
        title: 'PREVENT',
        subtitle: 'Personalized Options',
        desc: 'Anonymous questionnaire for tailored family planning & protection',
      },
      monitor: {
        title: 'MONITOR',
        subtitle: 'Symptom & Cycle Log',
        desc: 'Private device-only tracker with danger-sign safety alerts',
      },
      seek_care: {
        title: 'SEEK CARE',
        subtitle: 'Triage & Facilities',
        desc: 'Clinical triage, provider checklist & regional Ethiopian health centers',
      },
      emergency: {
        title: 'EMERGENCY & HIV',
        subtitle: 'Time-Critical Care',
        desc: 'HIV PEP in 72h, emergency contraception, GBV support & danger signs',
      },
    },
    chatPlaceholder: 'Ask a private question about periods, pregnancy, contraception, or symptoms...',
    chatSend: 'Send Question',
    disclaimer: "I'm an AI guide, not a doctor. I do not diagnose or prescribe.",
    whenToSeeClinician: 'When to see a clinician:',
    emergencyHotlines: 'Ethiopian Emergency Hotlines',
    callNow: 'Call Now',
    quickRepliesTitle: 'Quick Questions:',
    quickReplies: [
      { label: 'How does contraception work?', query: 'How does contraception work in Ethiopia, and what are the main reversible methods available?' },
      { label: 'I missed my period', query: 'I missed my period. What are common causes besides pregnancy and when should I see a clinician?' },
      { label: 'Pregnancy danger signs', query: 'What are the critical danger signs in pregnancy where I should rush to a health facility immediately?' },
      { label: 'Emergency contraception (Postinor)', query: 'How does emergency contraception (Postinor-2) work and what is the timeframe to take it after unprotected sex?' },
      { label: 'Safe family planning for youth', query: 'What are safe, private family planning options for adolescents and young adults in Ethiopia?' },
      { label: 'Severe menstrual cramps', query: 'Are severe menstrual cramps normal, and what treatments can a clinician offer?' },
    ],
    feedbackHelpful: 'Was this helpful?',
    feedbackYes: 'Yes, helpful',
    feedbackNo: 'Not quite',
    feedbackThanksYes: 'Thank you! Glad this was helpful.',
    feedbackThanksNo: 'Thank you for your feedback. Feel free to ask for a simpler explanation or specific details.',
    dangerPrecheckNotice: 'Emergency Symptom Alert: Severe symptoms detected. Please do not wait—go to the nearest health facility or call 907 / 8335 immediately.',
    typingIndicator: 'MAM-to-MAM AI is reviewing clinical guidelines...',
  },
  am: {
    appName: 'ማም-ቱ-ማም AI',
    tagline: 'በ AI የተደገፈ የስነ-ተዋልዶና የእናቶች ጤና አጋዥ',
    footerNote: 'የመጀመሪያ ደረጃ የሙከራ ፕሮጀክት (Early MVP). የባለሙያ ህክምና ምትክ አይደለም።',
    badgeMvp: 'የመጀመሪያ ደረጃ ሙከራ (MVP)',
    badgePrivacy: '100% ሚስጥራዊ እና በስልክዎ ላይ ብቻ የሚቀመጥ',
    privacyModalTitle: 'የእርስዎ ሚስጥርና የመረጃ አያያዝ የተጠበቀ ነው',
    privacyModalIntro: 'ማም-ቱ-ማም AI ለኢትዮጵያ ማህበረሰብ የተዘጋጀ ስም የማይጠየቅበት ሚስጥራዊ የጤና ረዳት ነው።',
    privacyModalBullets: [
      'የግል መረጃዎ (ስምዎ፣ ስልክ ቁጥርዎ፣ ኢሜይልዎ ወይም አድራሻዎ) በፍጹም አይጠየቅም፣ አይሰበሰብም ወይም አይቀመጥም።',
      'የወር አበባዎ ቀናት፣ የእርግዝና ክትትልዎ እና የህመም ስሜቶችዎ የሚቀመጡት በስልክዎ ማህደረ-ትውስታ ላይ ብቻ ነው።',
      'ከ MAM AI ጋር በሚወያዩበት ወቅት፣ መልስ ለመስጠት ጥያቄዎ በ Google Gemini AI በኩል በደህንነት የሚስተናገድ ሲሆን፣ ምንም ዓይነት የግል መለያ አብሮ አይላክም ወይም አይመዘገብም።',
      'Educational content based on WHO and Ministry of Health materials, pending clinical review. (ትምህርታዊ ይዘቱ በዓለም ጤና ድርጅትና በጤና ሚኒስቴር መረጃዎች ላይ የተመሰረተ ሲሆን፣ የህክምና ባለሙያ ግምገማ በመጠባበቅ ላይ ነው።)',
      'ማም-ቱ-ማም AI የህክምና ምርመራ አያደርግም፤ መድሃኒትም አያዝም። በአስቸኳይ ሁኔታ ሁልጊዜ ወደ ጤና ተቋም ይሂዱ።',
    ],
    privacyModalButton: 'ተረድቻለሁ፤ ቀጥል',
    journeyTitle: 'የስነ-ተዋልዶና የእናቶች ጤና ጉዞ',
    askMamButton: 'MAMን ጠይቁ',
    askMamTitle: 'የ MAM AI አማካሪ',
    dangerAlertBanner: 'አስቸኳይ የአደጋ ምልክት ተገኝቷል፡ አሁኑኑ ህክምና ያግኙ',
    dangerModalTitle: 'አሁኑኑ ወደ ጤና ተቋም ይሂዱ',
    dangerModalSubtitle: 'የገጠመዎት የህመም ምልክት ህይወትዎን ለመጠበቅ አስቸኳይ የባለሙያ ህክምና ክትትል ያስፈልገዋል።',
    stages: {
      learn: {
        title: 'እወቅ (LEARN)',
        subtitle: 'የስነ-ተዋልዶ እውቀት',
        desc: 'የአካላዊ ለውጦች፣ የወር አበባ፣ የወሊድ መከላከያ፣ ኤችአይቪ እና የእርግዝና እንክብካቤ',
      },
      prevent: {
        title: 'ተከላከል (PREVENT)',
        subtitle: 'የቤተሰብ ምጣኔ ምርጫ',
        desc: 'ለእርስዎ የሚስማማውን የወሊድ መከላከያ የሚጠቁም ሚስጥራዊ መጠይቅ',
      },
      monitor: {
        title: 'ተከታተል (MONITOR)',
        subtitle: 'የዑደትና ምልክቶች መከታተያ',
        desc: 'የወር አበባና እርግዝና መከታተያ ከአደጋ ምልክቶች ማስጠንቀቂያ ጋር',
      },
      seek_care: {
        title: 'ህክምና ፈልግ (SEEK CARE)',
        subtitle: 'የህክምና ተቋማትና ደረጃዎች',
        desc: 'የህመም ደረጃ መለያ፣ ለሀኪም የሚነገሩ ነጥቦች እና የጤና ጣቢያዎች መረጃ',
      },
      emergency: {
        title: 'አስቸኳይና ኤችአይቪ (EMERGENCY)',
        subtitle: 'የአደጋ ጊዜ እንክብካቤ',
        desc: 'የኤችአይቪ PEP በ 72 ሰዓት ውስጥ፣ የአደጋ ጊዜ ኪኒንና የአደጋ ምልክቶች',
      },
    },
    chatPlaceholder: 'ስለ ወር አበባ፣ እርግዝና፣ የወሊድ መከላከያ ወይም የህመም ስሜት በነፃነት ይጠይቁ...',
    chatSend: 'ላክ',
    disclaimer: 'እኔ የ AI መመሪያ ረዳት እንጂ ሀኪም አይደለሁም። መድኃኒት አላዝምም፤ አልመረምርም።',
    whenToSeeClinician: 'ሀኪም ማየት ያለብዎት መቼ ነው፡',
    emergencyHotlines: 'የኢትዮጵያ ነፃ የድንገተኛ ስልኮች',
    callNow: 'ደውል',
    quickRepliesTitle: 'ፈጣን ጥያቄዎች፡',
    quickReplies: [
      { label: 'የወሊድ መከላከያ እንዴት ይሰራል?', query: 'የወሊድ መከላከያ እንዴት ይሰራል? በኢትዮጵያ ጤና ጣቢያዎች በነፃ የሚገኙት ዋና ዋና አማራጮች ምንድናቸው?' },
      { label: 'የወር አበባዬ ቀርቷል / ዘግይቷል', query: 'የወር አበባዬ ዘግይቷል፤ ከእርግዝና ውጪ ሌሎች ምን ምክንያቶች ሊኖሩ ይችላሉ? መቼ ነው ሀኪም ማየት ያለብኝ?' },
      { label: 'የእርግዝና አስቸኳይ የአደጋ ምልክቶች', query: 'በእርግዝና ወቅት ወዲያውኑ ወደ ጤና ተቋም መሄድ የሚያስፈልጋቸው አስቸኳይ የአደጋ ምልክቶች የትኞቹ ናቸው?' },
      { label: 'የአደጋ ጊዜ ኪኒን (ፖስቲኖር-2)', query: 'የአደጋ ጊዜ ኪኒን (ፖስቲኖር) እንዴት ይሰራል? ግንኙነት ከተደረገ በኋላ እስከ ስንት ሰዓት ውስጥ መወሰድ አለበት?' },
      { label: 'ለወጣቶች የወሊድ መከላከያ', query: 'ለወጣቶችና ላላገቡ ሴቶች በኢትዮጵያ የሚመከሩ አስተማማኝና ሚስጥራዊ የወሊድ መከላከያዎች የትኞቹ ናቸው?' },
      { label: 'ከባድ የወር አበባ ህመም', query: 'ከፍተኛ የወር አበባ ህመም (ቁርጠት) መቼ ነው የህክምና ምርመራ የሚያስፈልገው?' },
    ],
    feedbackHelpful: 'ይህ መልስ ረድቶዎታል?',
    feedbackYes: 'አዎ፤ ረድቶኛል',
    feedbackNo: 'በደንብ አልገባኝም',
    feedbackThanksYes: 'እናመሰግናለን! ጠቃሚ ሆኖ በማግኘቱ ደስ ብሎናል።',
    feedbackThanksNo: 'ለአስተያየትዎ እናመሰግናለን። ጥያቄዎን በቀላል ቃላት ደግመው መጠየቅ ይችላሉ።',
    dangerPrecheckNotice: 'አስቸኳይ የአደጋ ምልክት ማስጠንቀቂያ፡ የከባድ ህመም ወይም የደም መፍሰስ ምልክት ታይቷል። ሳያመነቱ አሁኑኑ ወደ ጤና ጣቢያ ይሂዱ ወይም በ 907 / 8335 ይደውሉ።',
    typingIndicator: 'ማም-ቱ-ማም AI የህክምና መመሪያዎችን በማጣራት ላይ ነው...',
  },
  om: {
    appName: 'MAM-to-MAM AI',
    tagline: 'Fayyaa Wal-hormaataa fi Haadholii AI-n Deeggarame',
    footerNote: 'Yaalii Jalqabaa (Early MVP). Bakka bu’aa ogeessa fayyaa miti.',
    badgeMvp: 'Yaalii Jalqabaa (MVP)',
    badgePrivacy: '100% Iccitii fi Bilbila Keessan Qofa Irratti',
    privacyModalTitle: 'Iccitiin Keessan Kan Eegameedha',
    privacyModalIntro: 'MAM-to-MAM AI gargaaraa fayyaa iccitii Itoophiyaa keessatti eenyummaan hin gaafatamneedha.',
    privacyModalBullets: [
      'Eenyummaan keessan (maqaan, lakkoofsi bilbilaa, teessoon) hin gaafatamu ykn hin kuufamu.',
      'Guyyoota laguu, hordoffii ulfaa fi mallattooleen fayyaa bilbila keessan qofa irratti kuufamu.',
      'Yeroo MAM AI waliin haasoftan, gaaffiin keessan AI Google Gemini tiin deebii argata; garuu odeeffannoon eenyummaa hin qabamu.',
      'Educational content based on WHO and Ministry of Health materials, pending clinical review.',
      'MAM-to-MAM AI qoricha hin ajaju. Yeroo balaa hatattamaan gara buufata fayyaa deemaa.',
    ],
    privacyModalButton: 'Hubadheera; Itti Fufi',
    journeyTitle: 'Adeemsa Wal-tarkaanfii Fayyaa',
    askMamButton: 'MAM Gaafadhaa',
    askMamTitle: 'Gorsa AI MAM',
    dangerAlertBanner: 'Mallattoon Balaa Hatattamaa Mul’ateera: Yaala Hatattamaa Barbaadaa',
    dangerModalTitle: 'Hatattamaan Gara Buufata Fayyaa Deemaa',
    dangerModalSubtitle: 'Mallattooleen keessan lubbuu keessan oolchuuf hatattamaan yaala ogeessaa barbaadu.',
    stages: {
      learn: {
        title: 'BARADHU',
        subtitle: 'Hubannoo Fayyaa',
        desc: 'Dargaggummaa, laguu, ittisa da’umsaa, HIV fi fayyaa haadholii',
      },
      prevent: {
        title: 'ITTISI',
        subtitle: 'Filannoowwan Ittisaa',
        desc: 'Gaaffannoo iccitii karoora maatii fi eegumsa dhibee',
      },
      monitor: {
        title: 'HORDOFI',
        subtitle: 'Hordoffii Mallattoolee',
        desc: 'Hordoffii laguu fi ulfaa mallattoo balaa of keessaa qabu',
      },
      seek_care: {
        title: 'YAALA BARBAADI',
        subtitle: 'Buufataalee Fayyaa',
        desc: 'Sadarkaa dhibee, qabxii ogeessatti himamu fi buufataalee fayyaa',
      },
      emergency: {
        title: 'BALAA FI HIV',
        subtitle: 'Yaala Hatattamaa',
        desc: 'Qoricha PEP sa’aatii 72 keessatti, kiniinii hatattamaa fi mallattoolee balaa',
      },
    },
    chatPlaceholder: 'Waa’ee laguu, ulfaa, ittisa da’umsaa ykn mallattoolee fayyaa gaafadhaa...',
    chatSend: 'Ergi',
    disclaimer: 'Ani qajeelchaa AI qofa, ogeessa fayyaa miti. Qoricha hin ajaju.',
    whenToSeeClinician: 'Yoom ogeessa fayyaa arguun barbaachisa:',
    emergencyHotlines: 'Bilbiloota Balaa Hatattamaa Itoophiyaa',
    callNow: 'Bilbili',
    quickRepliesTitle: 'Gaaffilee Hatattamaa:',
    quickReplies: [
      { label: "Malli ittisa da'umsaa akkamitti hojjata?", query: "Malli ittisa da'umsaa akkamitti hojjata? Buufata fayyaa Itoophiyaatti filannoowwan jiran maal fa'i?" },
      { label: 'Laguun koo na dhabameera', query: 'Laguun koo yoo dhabame ulfaan alatti sababoonni biroo maali? Yoom ogeessa arguun qaba?' },
      { label: 'Mallattoolee balaa ulfaa', query: 'Yeroo ulfaa mallattooleen balaa hatattamaan gara buufata fayyaa nama deemsisan kami?' },
      { label: 'Kiniinii hatattamaa (Postinor)', query: 'Kiniiniin balaa hatattamaa (Postinor) akkamitti hojjata? Yeroo hangamii keessatti fudhatamuu qaba?' },
    ],
    feedbackHelpful: 'Gorsi kun isin fayyadeeraa?',
    feedbackYes: 'Eeyyee, na gargaare',
    feedbackNo: 'Miti, ifa miti',
    feedbackThanksYes: 'Galatoomaa! Isin gargaaruu keenyatti gammanneerra.',
    feedbackThanksNo: 'Yaada keessaniif galatoomaa. Irra deebitanii gaafachuu dandeessu.',
    dangerPrecheckNotice: 'Akeekkachiisa Balaa: Mallattoon cimaan mul’ateera. Hatattamaan gara buufata fayyaa deemaa ykn 907 / 8335 irratti bilbilaa.',
    typingIndicator: 'MAM-to-MAM AI qajeelfama fayyaa sakatta’aa jira...',
  },
  ti: {
    appName: 'MAM-to-MAM AI',
    tagline: 'ብ AI ዝተደገፈ ናይ ስነ-ተዋልዶን ጥዕና ኣደታትን',
    footerNote: 'ናይ መጀመርታ ደረጃ ፈተነ (Early MVP). ናይ ሞያዊ ሕክምና መተካእታ ኣይኮነን።',
    badgeMvp: 'ናይ መጀመርታ ፈተነ (MVP)',
    badgePrivacy: '100% ምስጢራውን ኣብ ሞባይልኩም ጥራይ ዝቕመጥን',
    privacyModalTitle: 'ምስጢርኩም ሕሉው እዩ',
    privacyModalIntro: 'MAM-to-MAM AI ኣብ ኢትዮጵያ ስም ዘይሕተተሉ ናይ ስነ-ተዋልዶ ጥዕና መሻርኽቲ እዩ።',
    privacyModalBullets: [
      'ናይ ብሕቲ መረዳእታ (ስም፣ ስልኪ፣ ኢመይል ወይ ኣድራሻ) ኣይሕተትን፣ ኣይእከብን ወይ ኣይዕቀብን።',
      'ናይ ጽግያት ዕለታት፣ ናይ ጥንሲ ክትትልን ምልክት ቃንዛን ኣብ ናትኩም ሞባይል ጥራይ ይቕመጥ።',
      'ምስ MAM AI ክትዛተዩ ከለኹም፣ መልሲ ንምሃብ ሕቶኹም ብደሕንነት ብ Google Gemini AI ይስራሕ፤ ግን ዝኾነ ናይ ብሕቲ መፍለዪ ኣይመሓላለፍን።',
      'Educational content based on WHO and Ministry of Health materials, pending clinical review.',
      'MAM-to-MAM AI ፈውሲ ኣይእዝዝን። ኣብ ናይ ሓደጋ ግዜ ቀልጢፍኩም ናብ ጥዕና ትካል ኪዱ።',
    ],
    privacyModalButton: 'ተረዲአ ኣለኹ፤ ቀጽል',
    journeyTitle: 'ናይ ጥዕናኹም ቀጻሊ ጉዕዞ',
    askMamButton: 'ን MAM ሕተቱ',
    askMamTitle: 'ናይ MAM AI መማኸሪ',
    dangerAlertBanner: 'ናይ ሓደጋ ምልክት ተራእዩ ኣሎ፡ ቀልጢፍኩም ሕክምና ርኸቡ',
    dangerModalTitle: 'ሕጂ ቀልጢፍኩም ናብ ጥዕና ትካል ኪዱ',
    dangerModalSubtitle: 'ዝተራእየኩም ምልክት ቃንዛ ህይወትኩም ንምድሓን ህጹጽ ናይ ሓኪም ክትትል የድልዮ።',
    stages: {
      learn: {
        title: 'ፍለጥ',
        subtitle: 'ናይ ስነ-ተዋልዶ ፍልጠት',
        desc: 'ጉርዝውና፣ ጽግያት፣ መከላኸሊ ጥንሲ፣ ኤች.ኣይ.ቪን ጥዕና ኣደታትን',
      },
      prevent: {
        title: 'ተኸላኸል',
        subtitle: 'ምርጫታት ምድላው ስድራ',
        desc: 'ንዓኹም ዝሰማማዕ መከላኸሊ ጥንሲ ዝሕብር ናይ ሕቶታት መመልከቲ',
      },
      monitor: {
        title: 'ተኸታተል',
        subtitle: 'ናይ ጽግያትን ምልክታትን መከታተሊ',
        desc: 'ናይ ጽግያትን ጥንስን መከታተሊ ምስ ናይ ሓደጋ ምልክታት መጠንቀቕታ',
      },
      seek_care: {
        title: 'ሕክምና ድለ',
        subtitle: 'ናይ ጥዕና ትካላት',
        desc: 'ደረጃ ሕማም፣ ንሓኪም ዝንገሩ ነጥብታትን ናይ ጥዕና ጣብያታትን',
      },
      emergency: {
        title: 'ሓደጋን ኤች.ኣይ.ቪን',
        subtitle: 'ህጹጽ ናይ ሓደጋ ግዜ ክንክን',
        desc: 'ናይ ኤች.ኣይ.ቪ PEP ኣብ 72 ሰዓታት፣ ናይ ሓደጋ ከኒናን ናይ ሓደጋ ምልክታትን',
      },
    },
    chatPlaceholder: 'ብዛዕባ ጽግያት፣ ጥንሲ፣ መከላኸሊ ጥንሲ ወይ ናይ ቃንዛ ምልክት ብናጻ ሕተቱ...',
    chatSend: 'ስደድ',
    disclaimer: 'ኣነ ናይ AI መምርሒ እየ እምበር ሓኪም ኣይኮንኩን። ፈውሲ ኣይእዝዝን።',
    whenToSeeClinician: 'ሓኪም ክትርእዩ ዝግባእ መዓስ እዩ፡',
    emergencyHotlines: 'ናይ ኢትዮጵያ ናጻ ናይ ሓደጋ ስልክታት',
    callNow: 'ደውል',
    quickRepliesTitle: 'ቅልጡፍ ሕቶታት፡',
    quickReplies: [
      { label: 'መከላኸሊ ጥንሲ ከመይ ይሰርሕ?', query: 'መከላኸሊ ጥንሲ ከመይ ይሰርሕ? ኣብ ኢትዮጵያ ብቐሊሉ ዝርከቡ ምርጫታት እንታይ እዮም?' },
      { label: 'ጽግያተይ ደንጒዩ / ተሪፉ', query: 'ጽግያተይ ካብ ጥንሲ ወጻኢ እንተደንጒዩ እንታይ ምኽንያት ክኸውን ይኽእል? መዓስ እየ ናብ ሓኪም ክኸይድ ዝግባእ?' },
      { label: 'ናይ ጥንሲ ሓደጋ ምልክታት', query: 'ኣብ ግዜ ጥንሲ ብህጹጽ ናብ ጥዕና ትካል ከብጽሑ ዝግበኦም ምልክታት ሓደጋ ኣየኖት እዮም?' },
      { label: 'ናይ ሓደጋ ግዜ ከኒና', query: 'ናይ ሓደጋ ግዜ ከኒና (ፖስቲኖር) ከመይ ይሰርሕ? ኣብ ውሽጢ ክንደይ ሰዓት ክውሰድ ኣለዎ?' },
    ],
    feedbackHelpful: 'እዚ መልሲ ሓጊዙኩም ዶ?',
    feedbackYes: 'እወ፤ ሓጊዙኒ',
    feedbackNo: 'ኣይበርሀለይን',
    feedbackThanksYes: 'የቐንየልና! ጠቓሚ ብምዃኑ ሕጉሳት ኢና።',
    feedbackThanksNo: 'ንርእይቶኹም የቐንየልና። ብኻልእ ኣዘራርባ ደጊምኩም ክትሓቱ ትኽእሉ ኢኹም።',
    dangerPrecheckNotice: 'ናይ ሓደጋ ምልክት መጠንቀቕታ፡ ከቢድ ደም ምፍሳስ ወይ ቃንዛ ተራእዩ ኣሎ። ከይደንጎኹም ናብ ጥዕና ትካል ኪዱ ወይ ብ 907 / 8335 ደውሉ።',
    typingIndicator: 'MAM-to-MAM AI ናይ ሕክምና መምርሒታት የጻሪ ኣሎ...',
  },
};
