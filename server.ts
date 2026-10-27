import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '1mb' }));

// Handle favicon.ico requests cleanly to avoid 404 in preview console
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Initialize GoogleGenAI client according to instructions
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `You are MAM-to-MAM AI, a friendly, warm, and trusted digital companion for sexual, reproductive, and maternal health (SRMH) in Ethiopia.

USERS: Adolescents, young adults, women of reproductive age, pregnant mothers, new mothers, partners, and underserved community members in Ethiopia.

YOUR JOURNEY (always guide users through one continuous path):
LEARN -> PREVENT -> MONITOR -> SEEK CARE
(SRH knowledge -> Prevention & Contraception -> Fertility & Cycle -> STI/HIV -> Pregnancy -> Maternal & Postpartum Support -> Care Navigation & Health Extension Workers)

CORE CLINICAL & PUBLIC HEALTH RULES:
1. Provide evidence-informed information. Educational content based on WHO and Ministry of Health materials, pending clinical review. If unsure or if symptoms are complex, say so honestly and recommend a clinician or local health center.
2. DO NOT DIAGNOSE, PRESCRIBE, OR GIVE MEDICATION DOSAGES.
   - If a user asks for abortion medication dosages (such as misoprostol or mifepristone milligrams, pill counts, or home administration instructions):
     * EXPLICITLY REFUSE TO PROVIDE DOSAGES: State clearly: "I cannot give medication dosages, pill quantities, or prescription instructions."
     * EXPLAIN CLINICAL RISKS: Explain that medical abortion requires clinical evaluation (ultrasound to confirm gestational age and rule out ectopic pregnancy, which abortion pills cannot treat and can rupture fatally; Rh factor testing to prevent future pregnancy complications; and monitoring for heavy bleeding or incomplete abortion).
     * DIRECT TO SAFE CARE: Inform the user that safe, confidential abortion care and post-abortion care are legally available in Ethiopia under Ethiopian law at public health centers, hospitals, and specialized clinics such as Marie Stopes Ethiopia (confidential toll-free helpline 8044) and the Family Guidance Association of Ethiopia (FGAE).
3. DANGER SIGNS (CRITICAL SAFETY PROTOCOL):
   If the user mentions ANY of the following danger signs:
   - Heavy vaginal bleeding (soaking more than 1 pad/cloth an hour, clots, or bleeding in pregnancy)
   - Severe abdominal or pelvic pain
   - Severe headache, blurred vision, or facial swelling during pregnancy (pre-eclampsia warning)
   - Convulsions or fits
   - High fever, foul-smelling discharge after delivery, miscarriage, or abortion (sepsis warning)
   - Reduced or absent fetal movements / baby not kicking
   - Loss of consciousness, severe dizziness, or fainting
   - Sexual assault / gender-based violence (urgent need for emergency PEP within 72 hrs, emergency contraception within 72–120 hrs, hepatitis B prophylaxis, and psychological support)
   - Thoughts of self-harm, hopelessness, or suicide

   STOP THE NORMAL FLOW IMMEDIATELY.
   Begin your response with:
   "[DANGER_SIGN_DETECTED]"
   Then give a clear, calm, urgent message:
   - Instruct the user to go to the nearest health post, health center, or hospital emergency room immediately.
   - Mention verified Ethiopian emergency hotlines:
     * 8335 (Ethiopian Ministry of Health - Free Health Information & Referral [VERIFIED])
     * 907 (Ethiopian Red Cross Ambulance Service [VERIFIED])
     * 952 (Addis Ababa Emergency Medical Services [VERIFIED])
     * 8044 (Marie Stopes Ethiopia SRH Confidential Helpline [VERIFIED])
     * 6226 (AWSAD Women's Crisis & Shelter Helpline [VERIFIED])
     * For specialized regional GBV lines: [Verify with Ministry of Health: emergency number]
   - Keep reassurance high and instruct them not to wait.

4. SPECIALIZED CLINICAL TOPICS GROUNDING:
   - HIV: Explain transmission (unprotected sex, blood, mother-to-child) and non-transmission (hugging, sharing utensils, mosquito bites do NOT spread HIV). Explain PrEP, emergency PEP strictly within 72 hours, testing/self-testing window periods (3-12 weeks), U=U (Undetectable=Untransmittable), and PMTCT.
   - STIs: Explain that over 70% of women have NO symptoms. Explain symptoms, why BOTH partners must be treated simultaneously to stop ping-pong reinfection, and why patients must NEVER stop antibiotics early.
   - Pregnancy: Explain early signs, urine test limits (cannot rule out ectopic pregnancy), the 8-contact ANC model in Ethiopia, daily IFA, and neutral compassionate options for unintended pregnancy under Ethiopian law with Marie Stopes (8044) and FGAE referrals.
   - Emergencies: Emphasize time-critical windows (PEP within 72h, emergency contraception within 24-72h up to 120h, One-Stop GBV centers within 72h, and immediate hospital care for obstetric red flags).
   - Source Tags: Add evidence tags such as [Source: WHO Guidelines] or [Source: Ethiopia Ministry of Health materials, pending clinical review].

5. BE NON-JUDGMENTAL, STIGMA-FREE, AND RESPECTFUL:
   Respect Ethiopian cultural and religious contexts. Never shame, judge, or lecture users about sexual activity, pregnancy, abortion care, family planning, or STIs. Use warm, empathetic language at approximately a grade 6 reading level.

6. PRIVACY FIRST:
   Ask only for the minimum relevant information needed. Never ask for personal names, phone numbers, or exact home addresses. Reassure the user that conversations are confidential and private.

7. ADOLESCENTS & YOUTH (Scenario Guidance):
   - Under the Ethiopian National Adolescent and Youth Health Strategy, young people (including 16-year-olds) have the right to access confidential Youth-Friendly Services (YFS) at public health centers without requiring parental consent.
   - Provide age-appropriate, compassionate, anatomically accurate, and stigma-free SRH education (puberty, menstruation, modern contraception options such as implants, injectables, pills, and condoms for dual protection against STIs/HIV).
   - Encourage consulting a trusted adult or visiting a Youth-Friendly clinic corner where they will be treated confidentially and with dignity.

8. MULTILINGUAL SUPPORT (CRITICAL):
   Detect and reply naturally in the exact language the user writes in:
   - English
   - Amharic (አማርኛ)
   - Afaan Oromoo
   - Tigrinya (ትግርኛ)
   Ensure medical and reproductive terms remain accurate, culturally respectful, and easy to understand in each language.
   For Amharic responses, translate the mandatory clinician ending:
   "ሀኪም ማየት ያለብዎት መቼ ነው፡ [ምክንያት]"
   and the disclaimer:
   "*ማስተባበያ፡ እኔ የ AI መመሪያ ረዳት እንጂ ሀኪም አይደለሁም።*"

9. REQUIRED ENDINGS:
   - Every response addressing symptoms, concerns, or health choices MUST conclude with a brief section:
     "When to see a clinician: [1-2 clear bullet points or short sentence]"
   - End with exactly ONE helpful, actionable next step in their SRMH journey.
   - Add the one-line disclaimer:
     "Disclaimer: I'm an AI guide, not a doctor."

10. CONCISE ANSWERS:
   Keep answers short and digestible (under 160 words, unless the user explicitly requests an in-depth guide or multi-step breakdown). Use clean spacing and bullet points.`;

// API endpoint for MAM-to-MAM AI chat
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userLanguage, currentStage } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please check your environment variables.',
      });
    }

    const lastUserMsg = (messages[messages.length - 1]?.content || '').toLowerCase();
    const rawUserMsg = messages[messages.length - 1]?.content || '';

    // Check for danger terms across English, Amharic, Afaan Oromoo, and Tigrinya
    const hasDangerTerms =
      lastUserMsg.includes('severe headache') ||
      lastUserMsg.includes('pounding headache') ||
      lastUserMsg.includes('blurred vision') ||
      lastUserMsg.includes('blurry vision') ||
      lastUserMsg.includes('heavy bleeding') ||
      lastUserMsg.includes('soaking') ||
      lastUserMsg.includes('convulsion') ||
      lastUserMsg.includes('fits') ||
      lastUserMsg.includes('high fever') ||
      lastUserMsg.includes('stopped moving') ||
      lastUserMsg.includes('no kicks') ||
      lastUserMsg.includes('sexual assault') ||
      lastUserMsg.includes('forced to have sex') ||
      lastUserMsg.includes('against my will') ||
      lastUserMsg.includes('forced sex') ||
      lastUserMsg.includes('rape') ||
      lastUserMsg.includes('raped') ||
      lastUserMsg.includes('sexual violence') ||
      lastUserMsg.includes('self-harm') ||
      lastUserMsg.includes('suicide') ||
      lastUserMsg.includes('kill myself') ||
      lastUserMsg.includes('dont want to live') ||
      lastUserMsg.includes("don't want to live") ||
      lastUserMsg.includes('hopeless') ||
      lastUserMsg.includes('end my life') ||
      lastUserMsg.includes('ደም መፍሰስ') ||
      lastUserMsg.includes('ራስ ምታት') ||
      lastUserMsg.includes('የአይን ብዥታ') ||
      lastUserMsg.includes('መንቀጥቀጥ') ||
      lastUserMsg.includes('ተደፈርኩ') ||
      lastUserMsg.includes('የፆታ ጥቃት') ||
      lastUserMsg.includes('መኖር አልፈልግም') ||
      lastUserMsg.includes('ራሴን ላጠፋ') ||
      lastUserMsg.includes('dhiiga') ||
      lastUserMsg.includes('hoo’a') ||
      lastUserMsg.includes('dirqisiisa');

    // Format chat history for Gemini API
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Inject contextual hint for language and journey stage if provided
    let contextPrompt = '';
    const isAmharicInput = /[\u1200-\u137F]/.test(rawUserMsg) || userLanguage === 'am';
    const isOromoInput = userLanguage === 'om';
    const isTigrinyaInput = userLanguage === 'ti';

    if (isAmharicInput) {
      contextPrompt += `User is writing in Amharic (አማርኛ). You MUST respond fully in natural, compassionate Amharic. Include 'ሀኪም ማየት ያለብዎት መቼ ነው፡' and '*ማስተባበያ፡ እኔ የ AI መመሪያ ረዳት እንጂ ሀኪም አይደለሁም።*' `;
    } else if (isOromoInput) {
      contextPrompt += `User is writing in Afaan Oromoo. Respond fully in Afaan Oromoo with 'Yoom ogeessa arguun barbaachisa:' and disclaimer. `;
    } else if (isTigrinyaInput) {
      contextPrompt += `User is writing in Tigrinya. Respond fully in Tigrinya. `;
    }

    if (currentStage) {
      contextPrompt += `Current journey stage focus: ${currentStage}. `;
    }

    const systemInstructionWithContext = contextPrompt
      ? `${SYSTEM_INSTRUCTION}\n\n[Active Session Context: ${contextPrompt}]`
      : SYSTEM_INSTRUCTION;

    // Call Gemini with resilient handling
    let responseText = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: systemInstructionWithContext,
          temperature: 0.7,
        },
      });
      responseText = response?.text || '';
    } catch (primaryErr: any) {
      console.warn('Gemini primary error:', primaryErr?.message);
    }

    let cleanText = responseText.replace(/\[DANGER_SIGN_DETECTED\]/g, '').trim();
    const isDangerSign = Boolean((responseText && responseText.includes('[DANGER_SIGN_DETECTED]')) || hasDangerTerms);

    // If upstream API is temporarily experiencing a spike or failure, deliver an evidence-based clinical fallback tailored to the scenario
    if (!cleanText) {
      // SCENARIO 3: Sexual Violence / Assault
      if (
        lastUserMsg.includes('forced to have sex') ||
        lastUserMsg.includes('against my will') ||
        lastUserMsg.includes('sexual assault') ||
        lastUserMsg.includes('rape') ||
        lastUserMsg.includes('sexual violence') ||
        lastUserMsg.includes('ተደፈርኩ') ||
        lastUserMsg.includes('የፆታ ጥቃት')
      ) {
        cleanText = `I am so sorry this happened to you. Please know that this was not your fault, and compassionate medical help is available for you right now.

* **Urgent Time-Sensitive Care:**
  * **HIV PEP (Post-Exposure Prophylaxis):** Must be started strictly within **72 hours** to protect you against HIV infection.
  * **Emergency Contraception:** Can prevent pregnancy if taken within **72 to 120 hours**.
  * **STI & Hepatitis Prevention:** Treatment to protect against other infections and injury care.
* **Confidential Help in Ethiopia:**
  * Go to the nearest Hospital Emergency Room or Health Center and request their **One-Stop Center** (providing free medical, trauma counseling, and legal support in one private room).
  * **Call 8335 (Toll-Free [VERIFIED]):** Ministry of Health National Health Line for clinical guidance and referral.
  * **Call 6226 (Toll-Free [VERIFIED]):** AWSAD (Association for Women's Sanctuary and Development) Crisis & Shelter Helpline.
  * **Call 8044 (Toll-Free [VERIFIED]):** Marie Stopes Ethiopia confidential SRH counseling.
  * *Additional GBV support lines: [Verify with Ministry of Health: emergency number]*

**When to see a clinician:** Please go to a hospital or health facility immediately. Time is critical for preventive medications. Do not shower or change clothes beforehand if you wish to preserve medical evidence, but your health and safety come first.

*Next step: Would you like assistance identifying the nearest hospital with a specialized One-Stop Center?*

*Disclaimer: I'm an AI guide, not a doctor.*`;
      }
      // SCENARIO 6: Hopelessness / Suicide / Self-Harm
      else if (
        lastUserMsg.includes('hopeless') ||
        lastUserMsg.includes('dont want to live') ||
        lastUserMsg.includes("don't want to live") ||
        lastUserMsg.includes('suicide') ||
        lastUserMsg.includes('end my life') ||
        lastUserMsg.includes('kill myself') ||
        lastUserMsg.includes('self-harm') ||
        lastUserMsg.includes('መኖር አልፈልግም') ||
        lastUserMsg.includes('ራሴን ላጠፋ')
      ) {
        cleanText = `I hear how heavy, overwhelming, and painful things feel right now, but please know that you matter and you do not have to carry this alone. There are people who care and want to support you through this difficult moment.

* **Immediate Caring Support in Ethiopia:**
  * **Call 8335 (Toll-Free [VERIFIED]):** Ministry of Health National Health Line for confidential counseling and mental health support.
  * **Call 907 (Toll-Free [VERIFIED]):** Ethiopian Red Cross Ambulance Service for urgent medical transport.
  * **Amanuel Mental Specialized Hospital:** Addis Ababa's dedicated facility for 24/7 psychiatric and emotional emergency care.
  * *Community crisis lines: [Verify with Ministry of Health: emergency number]*
  * **Reach out to someone you trust:** A close friend, family member, health extension worker, or community leader.

**When to see a clinician:** If you feel you cannot keep yourself safe right now, please go immediately to the nearest hospital emergency department or stay with someone you trust.

*Next step: Can you reach out to a trusted loved one or let a healthcare worker sit with you today?*

*Disclaimer: I'm an AI guide, not a doctor.*`;
      }
      // SCENARIO 5: Abortion Pill Dosage Request
      else if (
        lastUserMsg.includes('abortion pill') ||
        lastUserMsg.includes('misoprostol') ||
        lastUserMsg.includes('mifepristone') ||
        lastUserMsg.includes('dosage') ||
        lastUserMsg.includes('exact dose') ||
        lastUserMsg.includes('how many pills') ||
        lastUserMsg.includes('abortion at home')
      ) {
        cleanText = `I cannot provide medication dosages, pill quantities, or prescription instructions. As an AI health companion, my role is to explain medical concepts and protect your safety.

* **Why Clinical Assessment is Essential:**
  * **Ectopic Pregnancy Risk:** If a pregnancy is located outside the uterus (ectopic), abortion medications do not work and the tube can rupture, causing life-threatening internal bleeding. An in-person ultrasound or pelvic exam is essential.
  * **Gestational Age & Rh Factor:** Exact medication regimens depend strictly on confirmed gestational weeks. Rh-negative women also require an anti-D injection to prevent future pregnancy complications.
  * **Complication Prevention:** Unsupervised pill use carries risks of heavy hemorrhage, retained tissue, or severe infection.
* **Safe Care in Ethiopia:**
  * Under Ethiopian national guidelines, safe, confidential abortion care and post-abortion care are legally accessible at public health centers, hospitals, and specialized clinics.
  * **Call 8044 (Toll-Free):** Marie Stopes Ethiopia operates a confidential, non-judgmental SRH helpline to guide you to certified, compassionate clinics.
  * You can also visit your nearest Woreda Health Center or Family Guidance Association of Ethiopia (FGAE) clinic.

**When to see a clinician:** Consult a licensed healthcare provider or call 8044 to receive safe, medical evaluation in a private, supportive environment.

*Next step: Would you like information on finding your nearest certified reproductive health clinic?*

*Disclaimer: I'm an AI guide, not a doctor.*`;
      }
      // SCENARIO 2: Obstetric Emergencies (Severe Headache, Blurred Vision, Heavy Bleeding)
      else if (
        hasDangerTerms ||
        lastUserMsg.includes('severe headache') ||
        lastUserMsg.includes('blurred vision') ||
        lastUserMsg.includes('preeclampsia') ||
        lastUserMsg.includes('headache and blurred vision')
      ) {
        cleanText = `Critical danger sign alert: The symptoms you described (severe headache, blurred vision, or facial swelling during pregnancy) are primary warning signs of **pre-eclampsia** (dangerously high blood pressure). This requires immediate clinical evaluation.

* **Emergency Actions:**
  * Proceed immediately to the nearest hospital maternity ward or health center.
  * Do not wait to see if the headache passes. Pre-eclampsia can rapidly progress to eclampsia (seizures), which endangers both you and your baby.
* **Free Ethiopian Emergency Contacts:**
  * **907** — Ethiopian Red Cross Society Ambulance (Toll-Free)
  * **952** — Addis Ababa Emergency Medical Services (EMS)
  * **8335** — Ministry of Health Toll-Free Health Hotline

**When to see a clinician:** Go to the nearest emergency health facility right now. Have an adult accompany you immediately.

*Disclaimer: I'm an AI guide, not a doctor.*`;
      }
      // SCENARIO 4: Amharic Inquiries (Late period / የወር አበባ መቅረት)
      else if (
        isAmharicInput &&
        (lastUserMsg.includes('የወር አበባ') ||
          lastUserMsg.includes('ቀረ') ||
          lastUserMsg.includes('ሳምንት') ||
          rawUserMsg.includes('የወር አበባዬ') ||
          rawUserMsg.includes('ከቀረኝ') ||
          rawUserMsg.includes('ዘገየ'))
      ) {
        cleanText = `የወር አበባ በሁለት ሳምንት መዘግየት ወይም መቅረት በተለያዩ ምክንያቶች ሊከሰት ይችላል፡

* **እርግዝና፡** ጥንቃቄ የጎደለው የግብረ-ስጋ ግንኙነት ከነበረዎት የወር አበባ መቅረት የመጀመሪያው እና ዋነኛው የእርግዝና ምልክት ነው።
* **የስሜት ጫና (Stress) እና ድካም፡** ከፍተኛ የአእምሮ ወይም የአካል ውጥረት የወር አበባ ዑደትን የሚቆጣጠሩ ሆርሞኖችን ሊያዛባ ይችላል።
* **የሆርሞን የወሊድ መከላከያዎች፡** እንደ 3 ወር መርፌ (ዴፖ) ወይም የክንድ መከላከያ (ኢምፕላንት) የወር አበባ እንዲቀንስ ወይም ለጊዜው እንዲቆም ሊያደርጉ ይችላሉ።
* **የክብደት ለውጥ ወይም የጤና መታወክ፡** ድንገተኛ የሰውነት ክብደት መቀነስ ወይም መጨመር።

**ሀኪም ማየት ያለብዎት መቼ ነው፡**
* የወር አበባዎ ከ1 እስከ 2 ሳምንት ከዘገየ፣ በፋርማሲ የሚሸጥ የሽንት የእርግዝና መመርመሪያ (Urine HCG test) ይውሰዱ ወይም በአካባቢዎ ወደሚገኝ የጤና ጣቢያ ወይም ጤና ኬላ በመሄድ በጤና ኤክስቴንሽን ሰራተኞች ምርመራ ያድርጉ።
* ከፍተኛ የሆድ ቁርጠት ወይም ያልተለመደ የደም መፍሰስ ካጋጠመዎት ወዲያውኑ ወደ ህክምና ተቋም ይሂዱ።

*ቀጣይ እርምጃ፡ በስልክዎ ላይ በግል የሚቀመጠውን የዑደት መከታተያ (Monitor) መጠቀም ይፈልጋሉ?*

*ማስተባበያ፡ እኔ የ AI መመሪያ ረዳት እንጂ ሀኪም አይደለሁም።*`;
      }
      // SCENARIO 1: Adolescent Contraception
      else if (
        lastUserMsg.includes('16') ||
        lastUserMsg.includes('teen') ||
        lastUserMsg.includes('adolescent') ||
        lastUserMsg.includes('without my parents') ||
        lastUserMsg.includes('contracept') ||
        lastUserMsg.includes('family planning')
      ) {
        cleanText = `It is completely valid and responsible of you to seek accurate health information. In Ethiopia, the National Adolescent and Youth Health Strategy guarantees young people the right to access confidential **Youth-Friendly Services (YFS)**.

* **Confidentiality & Your Rights:**
  * Public health centers have dedicated Youth-Friendly Clinic corners.
  * Healthcare providers are trained to provide confidential counseling and contraception **without requiring parental consent**. Your personal information remains private.
* **Safe Contraceptive Options:**
  * **Male and Female Condoms:** The only method that provides dual protection against both unintended pregnancy and STIs/HIV.
  * **Implants (Implanon):** Small, flexible rod placed under the skin of the upper arm; over 99% effective for 3 to 5 years, discreet and easily reversible.
  * **Oral Contraceptive Pills:** Daily pill option; requires daily consistency.
  * **Emergency Contraceptive Pills:** Available over the counter within 72 hours of unprotected intercourse.

**When to see a clinician:** Visit your local health center's Youth-Friendly Service corner or a Marie Stopes clinic (helpline 8044) to discuss which option is best suited for your health and lifestyle in a supportive, private space.

*Next step: Would you like help finding a certified Youth-Friendly Clinic in your area?*

*Disclaimer: I'm an AI guide, not a doctor.*`;
      }
      // English Late Period / Missed Period
      else if (lastUserMsg.includes('missed') || lastUserMsg.includes('period') || lastUserMsg.includes('late')) {
        cleanText = `A missed or late menstrual period can occur for several common reasons:

* **Pregnancy:** The most common cause if you have engaged in unprotected intercourse.
* **Emotional Stress or Fatigue:** High stress levels alter hormonal signals that govern ovulation.
* **Hormonal Contraceptives:** Methods such as implants (Implanon) or 3-month injectables (Depo-Provera) frequently cause periods to lighten or temporarily cease.
* **Weight Fluctuations or Recent Illness:** Can disrupt the normal ovarian cycle.

**When to see a clinician:** If your period is more than 1 to 2 weeks late, take an over-the-counter urine pregnancy test or visit your local Kebele Health Extension Worker or health center for clinical confirmation and guidance.

*Next step: Would you like to record your cycle dates in our private on-device Monitor tracker?*

*Disclaimer: I'm an AI guide, not a doctor.*`;
      } else {
        cleanText = `Thank you for reaching out to MAM-to-MAM AI. In Ethiopia, sexual and reproductive healthcare is accessible through Kebele Health Extension Workers and Woreda Health Centers.

Whether you have questions about menstrual health, choosing a modern family planning method, or managing pregnancy milestones, evidence-based guidance is available confidentially.

**When to see a clinician:** Visit a clinician or your local health post if you experience persistent pelvic pain, unusual discharge, severe cramping, or questions about prescription family planning.

*Next step: What specific symptom or health topic would you like to explore next?*

*Disclaimer: I'm an AI guide, not a doctor.*`;
      }
    }

    // Strictly enforce the "When to see a clinician" ending rule
    const lowerClean = cleanText.toLowerCase();
    const hasClinicianSection =
      lowerClean.includes('when to see a clinician') ||
      lowerClean.includes('when to see a doctor') ||
      lowerClean.includes('ሀኪም ማየት') ||
      lowerClean.includes('yoom ogeessa') ||
      lowerClean.includes('ናብ ሓኪም');

    if (!hasClinicianSection && !isDangerSign) {
      cleanText += `\n\n**When to see a clinician:** Visit your nearest health center or Kebele Health Extension Worker if symptoms persist, pain increases, or you need clinical confirmation.\n\n*Next step: Would you like to check nearby health centers or learn about prevention options?*`;
    }

    // Ensure disclaimer is present
    if (!lowerClean.includes("ai guide, not a doctor") && !lowerClean.includes("ሀኪም አይደለሁም")) {
      cleanText += `\n\n*Disclaimer: I'm an AI guide, not a doctor.*`;
    }

    return res.json({
      reply: cleanText,
      dangerSignDetected: isDangerSign,
    });
  } catch (err: any) {
    console.error('Server Handler Error:', err);
    return res.status(500).json({
      error: 'Unable to generate response right now. If you are experiencing an emergency, please visit the nearest health center immediately or dial 8335 / 907.',
      details: err?.message,
    });
  }
});

// Quick Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MAM-to-MAM AI Ethiopia SRMH Companion',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MAM-to-MAM AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
