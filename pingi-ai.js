// Keep a working offline tutor available while the optional Firebase AI module loads.
window.PINGUI_AI_STATUS = "initializing";

const languageNames = {
  en: "English",
  no: "Norwegian",
  ru: "Russian",
  uk: "Ukrainian"
};

function requestedLanguage(prompt) {
  const explicit = String(prompt).match(/(?:reply|answer|explain)[^.!\n]{0,50}\b(English|Norwegian|Russian|Ukrainian)\b/i)
    || String(prompt).match(/\bin (English|Norwegian|Russian|Ukrainian)\b/i);
  if (explicit) {
    const found = Object.keys(languageNames).find(key => languageNames[key].toLowerCase() === explicit[1].toLowerCase());
    if (found) return found;
  }
  const text = String(prompt).toLowerCase();
  if (/[іїєґ]/i.test(text)) return "uk";
  if (/[а-яё]/i.test(text)) return "ru";
  if (/\b(hva|hvordan|hvorfor|når|jeg|ikke|og|er|det|på)\b|[æøå]/i.test(text)) return "no";
  return "en";
}

function topicFor(text) {
  const q = String(text).toLowerCase();
  if (/present\s+continuous|present\s+progressive|am\s*\/\s*is\s*\/\s*are|verb.?ing|зараз|теперішн.{0,10}трив|pågår|akkurat nå/.test(q)) return "continuous";
  if (/\ba\s*,?\s*an\b.*\bthe\b|\barticles?\b|\barticle\b|артикл|артикль|artikler|bestemt|ubestemt/.test(q)) return "articles";
  if (/present\s+simple|simple\s+present|do\s+and\s+does|he.?she.?it|звич|регулярн|vaner|presens/.test(q)) return "simple";
  if (/sentence\s+structure|word\s+order|sentence\s+order|build\s+a\s+sentence|\u043f\u043e\u0440\u044f\u0434\u043e\u043a\s+\u0441\u043b\u043e\u0432|\u043f\u043e\u0440\u044f\u0434\u043e\u043a\s+\u0441\u043b\u0456\u0432|setningsstruktur/.test(q)) return "structure";
  if (/explain this learner|my mistake|my answer|correct answer|exercise explanation/.test(q)) return "mistake";
  if (/what does|what do .* mean|meaning of|define|translate|значит|означ|перевод|переклад|betyr|oversett|ordet/.test(q)) return "vocabulary";
  return "general";
}

const lessons = {
  en: {
    simple: "Present Simple is for habits and facts. Use the base verb with I/you/we/they; add -s or -es with he/she/it. Example: “I read every day.” / “She reads every day.” Questions use do/does + the base verb: “Does she read?”",
    continuous: "Present Continuous is for something happening now or around now. Use am/is/are + verb-ing. Example: “I am reading now.” / “They are learning English.”",
    articles: "Use a before a consonant sound and an before a vowel sound when you mean one, non-specific thing: “a book”, “an apple”. Use the when the listener knows which thing: “the book on the table”.",
    structure: "A common English sentence order is subject + verb + object: “Mia reads books.” Put describing adjectives before the noun: “a small house”.",
    vocabulary: "I can help with that word. Look for its meaning in the sentence around it. Send me the word and the full sentence, and I’ll explain it simply.",
    mistake: "Let’s look at the grammar clue in the sentence. Check who is doing the action and whether it is a habit or happening now. Similar example: “He walks to school every day.” Try using the same clue on your answer.",
    general: "I can help with Present Simple, Present Continuous, a/an/the, sentence order, or vocabulary. Ask about one of those, or send me an English sentence and I’ll explain it."
  },
  no: {
    simple: "Present Simple bruker vi om vaner og fakta. Bruk grunnformen med I/you/we/they; legg til -s eller -es med he/she/it. Eksempel: “I read every day.” / “She reads every day.” I spørsmål bruker vi do/does + grunnform: “Does she read?”",
    continuous: "Present Continuous beskriver noe som skjer nå eller i denne perioden. Bruk am/is/are + verb-ing. Eksempel: “I am reading now.” / “They are learning English.”",
    articles: "Bruk a foran en konsonantlyd og an foran en vokallyd når du mener én uspesifikk ting: “a book”, “an apple”. Bruk the når vi vet hvilken ting det er: “the book on the table”.",
    structure: "Vanlig engelsk ordstilling er subjekt + verb + objekt: “Mia reads books.” Beskrivende adjektiv står foran substantivet: “a small house”.",
    vocabulary: "Jeg kan hjelpe med ordet. Se på betydningen i setningen rundt ordet. Send ordet og hele setningen, så forklarer jeg det enkelt.",
    mistake: "Se etter grammatikkhintet i setningen. Hvem gjør handlingen, og er det en vane eller noe som skjer nå? Lignende eksempel: “He walks to school every day.” Bruk samme hint når du ser på svaret ditt.",
    general: "Jeg kan hjelpe med Present Simple, Present Continuous, a/an/the, engelsk ordstilling eller ordforråd. Spør om ett av temaene, eller send en engelsk setning."
  },
  ru: {
    simple: "Present Simple используют для привычек и фактов. С I/you/we/they ставим обычную форму глагола; с he/she/it добавляем -s или -es. Пример: “I read every day.” / “She reads every day.” В вопросе: do/does + обычная форма: “Does she read?”",
    continuous: "Present Continuous описывает действие, которое происходит сейчас или в этот период. Формула: am/is/are + глагол-ing. Пример: “I am reading now.” / “They are learning English.”",
    articles: "A ставим перед согласным звуком, an — перед гласным, когда говорим об одном неизвестном предмете: “a book”, “an apple”. The используем, когда понятно, о каком предмете речь: “the book on the table”.",
    structure: "Обычный порядок слов в английском: кто + действие + объект: “Mia reads books.” Прилагательное ставим перед существительным: “a small house”.",
    vocabulary: "Я помогу с этим словом. Значение часто зависит от предложения вокруг него. Пришли слово и всё предложение — объясню просто.",
    mistake: "Найди грамматическую подсказку в предложении: кто выполняет действие и это привычка или действие сейчас? Похожий пример: “He walks to school every day.” Используй такую же подсказку для своего ответа.",
    general: "Я могу объяснить Present Simple, Present Continuous, a/an/the, порядок слов или словарное слово. Спроси об одной теме или пришли английское предложение."
  },
  uk: {
    simple: "Present Simple вживаємо для звичок і фактів. З I/you/we/they ставимо звичайну форму дієслова; з he/she/it додаємо -s або -es. Приклад: “I read every day.” / “She reads every day.” У питанні: do/does + звичайна форма: “Does she read?”",
    continuous: "Present Continuous описує дію, яка відбувається зараз або в цей період. Формула: am/is/are + дієслово-ing. Приклад: “I am reading now.” / “They are learning English.”",
    articles: "A ставимо перед приголосним звуком, an — перед голосним, коли йдеться про один невідомий предмет: “a book”, “an apple”. The вживаємо, коли зрозуміло, про який саме предмет ідеться: “the book on the table”.",
    structure: "Звичайний порядок слів в англійській: хто + дія + об’єкт: “Mia reads books.” Прикметник ставимо перед іменником: “a small house”.",
    vocabulary: "Я допоможу з цим словом. Значення часто залежить від речення навколо нього. Надішли слово й повне речення — поясню просто.",
    mistake: "Знайди граматичну підказку в реченні: хто виконує дію і це звичка чи дія зараз? Схожий приклад: “He walks to school every day.” Використай таку саму підказку для своєї відповіді.",
    general: "Я можу пояснити Present Simple, Present Continuous, a/an/the, порядок слів або слово. Запитай про одну тему чи надішли англійське речення."
  }
};

function vocabularyReply(prompt, language) {
  const q = String(prompt).toLowerCase();
  const known = [
    [/\bactually\b/, {en:"Actually usually means “in fact” or “really”; it does not mean “currently”. Example: “I thought it was closed, but actually it is open.”",no:"Actually betyr vanligvis «faktisk» eller «egentlig», ikke «for øyeblikket». Eksempel: “Actually, it is open.”",ru:"Actually обычно значит «на самом деле», а не «сейчас». Пример: “Actually, it is open.”",uk:"Actually зазвичай означає «насправді», а не «зараз». Приклад: “Actually, it is open.”"}],
    [/\bborrow\b/, {en:"Borrow means to take something for a short time and return it. Example: “Can I borrow your pen?”",no:"Borrow betyr å låne noe og levere det tilbake. Eksempel: “Can I borrow your pen?”",ru:"Borrow — взять что-то на время и вернуть. Пример: “Can I borrow your pen?”",uk:"Borrow — взяти щось на певний час і повернути. Приклад: “Can I borrow your pen?”"}],
    [/\blend\b/, {en:"Lend means to give something to someone for a short time. Example: “Can you lend me a pen?”",no:"Lend betyr å låne bort noe for en stund. Eksempel: “Can you lend me a pen?”",ru:"Lend — дать кому-то что-то на время. Пример: “Can you lend me a pen?”",uk:"Lend — дати комусь щось на певний час. Приклад: “Can you lend me a pen?”"}],
    [/\blibrary\b/, {en:"A library is a place where you can read or borrow books. Example: “I study at the library.”",no:"A library er et bibliotek. Eksempel: “I study at the library.”",ru:"Library — это библиотека. Пример: “I study at the library.”",uk:"Library — це бібліотека. Приклад: “I study at the library.”"}]
  ];
  for (const [pattern, replies] of known) if (pattern.test(q)) return replies[language];
  return lessons[language].vocabulary;
}

function localReply(prompt) {
  const language = requestedLanguage(prompt);
  const topic = topicFor(prompt);
  if (topic === "vocabulary") return vocabularyReply(prompt, language);
  return lessons[language][topic] || lessons[language].general;
}

const localTutor = {
  async sendMessage(prompt) {
    await new Promise(resolve => setTimeout(resolve, 220));
    return localReply(prompt);
  }
};

function logGeminiError(stage, error, privateText = "") {
  const code = typeof error?.code === "string" ? error.code.slice(0, 120) : "unknown";
  let message = typeof error?.message === "string" ? error.message : String(error || "Unknown Firebase AI Logic error.");
  if (privateText) message = message.split(privateText).join("[learner prompt redacted]");
  message = message
    .replace(/AIza[\w-]{20,}/g, "[API key redacted]")
    .replace(/((?:key|api_key|access_token|id_token|token)=)[^&\s]+/gi, "$1[redacted]")
    .replace(/((?:app check )?debug token\s*[:=]\s*)[\w.-]{12,}/gi, "$1[redacted]")
    .replace(/Bearer\s+[^\s"']+/gi, "Bearer [redacted]")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email redacted]")
    .slice(0, 600);
  console.error(`[Pingi AI] ${stage} failed`, { code, message });
}

function useOfflineTutor(stage, error, privateText = "") {
  if (error) logGeminiError(stage, error, privateText);
  window.PINGUI_AI = localTutor;
  window.PINGUI_AI_STATUS = "fallback";
  window.dispatchEvent(new CustomEvent("pingui-ai-ready"));
  return localTutor;
}

async function initializeGeminiTutor() {
  try {
    if (!window.PINGUI_FIREBASE_READY) throw new Error("Firebase initialization readiness is unavailable.");
    const compatApp = await window.PINGUI_FIREBASE_READY;
    if (!compatApp || compatApp !== window.PINGUI_FIREBASE_APP) {
      throw new Error("The existing initialized Firebase App was not exported by firebase-auth.js.");
    }

    // Dynamic imports let the offline tutor survive a CDN/module loading failure.
    const [appSdk, aiSdk] = await Promise.all([
      import("firebase/app"),
      import("firebase/ai")
    ]);
    const app = appSdk.getApp(compatApp.name);
    const ai = aiSdk.getAI(app, { backend: new aiSdk.GoogleAIBackend() });
    const model = aiSdk.getGenerativeModel(ai, {
      model: "gemini-3.8-flash",
      systemInstruction: `You are Pingi, a friendly English tutor. Explain grammar and vocabulary simply at the learner's level. The learner may write in English, Norwegian, Russian, or Ukrainian. Follow the requested reply language; otherwise reply in the language they used. Be concise, encouraging, and educational. For mistakes, explain the reason and offer a similar example without answering the next exercise.`,
      generationConfig: { temperature: 0.55, maxOutputTokens: 420 }
    });
    const chat = model.startChat();

    const geminiTutor = {
      async sendMessage(prompt) {
        try {
          const result = await chat.sendMessage(prompt);
          const answer = result.response.text();
          if (!answer || !answer.trim()) throw new Error("Gemini returned an empty response.");
          return answer;
        } catch (error) {
          useOfflineTutor("Gemini request", error, prompt);
          return localTutor.sendMessage(prompt);
        }
      }
    };
    window.PINGUI_AI = geminiTutor;
    window.PINGUI_AI_STATUS = "ready";
    window.dispatchEvent(new CustomEvent("pingui-ai-ready"));
    return geminiTutor;
  } catch (error) {
    return useOfflineTutor("Firebase AI Logic initialization", error);
  }
}

window.PINGUI_AI = localTutor;
window.PINGUI_AI_READY = initializeGeminiTutor();
