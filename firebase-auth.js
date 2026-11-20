(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const config = window.PINGUI_FIREBASE_CONFIG || {};
  const languages = ["no", "ru", "uk"];
  let auth, db, currentMode = "signup", selectedLanguage = "no", busy = false;

  const authText = {
    en: {
      authEyebrow:"YOUR ENGLISH JOURNEY STARTS HERE",authTitle:"A little English, a lot of progress.",authSub:"Your friendly place to learn English, one small step at a time.",
      authSignup:"Create account",authLogin:"Log in",authEmail:"Email address",authPassword:"Password",authConfirm:"Confirm password",authGoogle:"Continue with Google",authOr:"or continue with email",authHave:"Already have an account?",authNeed:"New to PINGUI?",authCreate:"Create my account",authEnter:"Log in",authForgot:"Forgot password?",authProfileTitle:"Make it yours",authProfileSub:"Choose how other learners will see you in PINGUI.",authNickname:"Nickname",authUsername:"Username",authLanguage:"Interface language",authFinish:"Finish setup",authSignout:"Sign out",authLoading:"Connecting to PINGUI…",authWorking:"Please wait…",authPasswordHint:"At least 6 characters",authUsernameHint:"3–20 letters, numbers or underscores",authErrEmail:"Enter a valid email address.",authErrPassword:"Password must contain at least 6 characters.",authErrConfirm:"Passwords do not match.",authErrNickname:"Nickname must be 2–24 characters.",authErrUsername:"Username must be 3–20 characters and use only letters, numbers or underscores.",authErrTaken:"That username is already taken. Try another one.",authErrConfig:"Firebase settings are missing. Check firebase-config.js.",authErrGeneric:"Something went wrong. Please try again.",authResetSent:"Password reset email sent. Check your inbox.",authProfileSaved:"Your profile is ready!",authWelcome:"Welcome to PINGUI!",authGooglePopup:"Google sign-in was closed or blocked. Try again.",authEmailExists:"An account with this email already exists.",authWrongPassword:"Email or password is incorrect.",authWeakPassword:"Choose a stronger password (at least 6 characters).",authNoUser:"No account was found with this email.",authProfileRequired:"Complete your profile to continue."
    },
    ru: {
      authEyebrow:"ТВОЁ ПУТЕШЕСТВИЕ В АНГЛИЙСКИЙ НАЧИНАЕТСЯ ЗДЕСЬ",authTitle:"Немного английского. Большой прогресс.",authSub:"Уютное место для изучения английского шаг за шагом.",
      authSignup:"Создать аккаунт",authLogin:"Войти",authEmail:"Адрес электронной почты",authPassword:"Пароль",authConfirm:"Повторите пароль",authGoogle:"Продолжить с Google",authOr:"или продолжить по почте",authHave:"Уже есть аккаунт?",authNeed:"Впервые в PINGUI?",authCreate:"Создать аккаунт",authEnter:"Войти",authForgot:"Забыли пароль?",authProfileTitle:"Давайте познакомимся",authProfileSub:"Выберите, как другие пользователи будут видеть вас в PINGUI.",authNickname:"Никнейм",authUsername:"Имя пользователя",authLanguage:"Язык интерфейса",authFinish:"Завершить настройку",authSignout:"Выйти",authLoading:"Подключаемся к PINGUI…",authWorking:"Подождите…",authPasswordHint:"Минимум 6 символов",authUsernameHint:"3–20 букв, цифр или подчёркиваний",authErrEmail:"Введите корректный адрес электронной почты.",authErrPassword:"Пароль должен содержать минимум 6 символов.",authErrConfirm:"Пароли не совпадают.",authErrNickname:"Никнейм должен содержать от 2 до 24 символов.",authErrUsername:"Имя должно содержать 3–20 символов: только латинские буквы, цифры и подчёркивание.",authErrTaken:"Это имя пользователя уже занято. Попробуйте другое.",authErrConfig:"Не найдены настройки Firebase. Проверьте firebase-config.js.",authErrGeneric:"Что-то пошло не так. Попробуйте ещё раз.",authResetSent:"Письмо для сброса пароля отправлено. Проверьте почту.",authProfileSaved:"Профиль готов!",authWelcome:"Добро пожаловать в PINGUI!",authGooglePopup:"Окно Google закрыто или заблокировано. Попробуйте ещё раз.",authEmailExists:"Аккаунт с такой почтой уже существует.",authWrongPassword:"Неверная почта или пароль.",authWeakPassword:"Выберите более надёжный пароль (минимум 6 символов).",authNoUser:"Аккаунт с такой почтой не найден.",authProfileRequired:"Заполните профиль, чтобы продолжить."
    },
    no: {
      authEyebrow:"DIN ENGELSKEISE STARTER HER",authTitle:"Litt engelsk. Stor framgang.",authSub:"Et hyggelig sted for å lære engelsk, ett lite steg om gangen.",
      authSignup:"Opprett konto",authLogin:"Logg inn",authEmail:"E-postadresse",authPassword:"Passord",authConfirm:"Bekreft passord",authGoogle:"Fortsett med Google",authOr:"eller fortsett med e-post",authHave:"Har du allerede en konto?",authNeed:"Ny på PINGUI?",authCreate:"Opprett konto",authEnter:"Logg inn",authForgot:"Glemt passord?",authProfileTitle:"Gjør profilen din personlig",authProfileSub:"Velg hvordan andre elever skal se deg i PINGUI.",authNickname:"Kallenavn",authUsername:"Brukernavn",authLanguage:"Språk i grensesnittet",authFinish:"Fullfør oppsett",authSignout:"Logg ut",authLoading:"Kobler til PINGUI…",authWorking:"Vent litt…",authPasswordHint:"Minst 6 tegn",authUsernameHint:"3–20 bokstaver, tall eller understreker",authErrEmail:"Skriv inn en gyldig e-postadresse.",authErrPassword:"Passordet må inneholde minst 6 tegn.",authErrConfirm:"Passordene er ikke like.",authErrNickname:"Kallenavnet må være 2–24 tegn.",authErrUsername:"Brukernavnet må være 3–20 tegn og bare bruke bokstaver, tall og understrek.",authErrTaken:"Dette brukernavnet er allerede opptatt. Prøv et annet.",authErrConfig:"Firebase-innstillingene mangler. Sjekk firebase-config.js.",authErrGeneric:"Noe gikk galt. Prøv igjen.",authResetSent:"E-post for tilbakestilling av passord er sendt. Sjekk innboksen.",authProfileSaved:"Profilen din er klar!",authWelcome:"Velkommen til PINGUI!",authGooglePopup:"Google-vinduet ble lukket eller blokkert. Prøv igjen.",authEmailExists:"Det finnes allerede en konto med denne e-postadressen.",authWrongPassword:"E-post eller passord er feil.",authWeakPassword:"Velg et sterkere passord (minst 6 tegn).",authNoUser:"Fant ingen konto med denne e-postadressen.",authProfileRequired:"Fullfør profilen for å fortsette."
    },
    uk: {
      authEyebrow:"ТВОЯ ПОДОРОЖ АНГЛІЙСЬКОЮ ПОЧИНАЄТЬСЯ ТУТ",authTitle:"Трохи англійської. Великий прогрес.",authSub:"Затишне місце для вивчення англійської крок за кроком.",
      authSignup:"Створити акаунт",authLogin:"Увійти",authEmail:"Електронна пошта",authPassword:"Пароль",authConfirm:"Повторіть пароль",authGoogle:"Продовжити з Google",authOr:"або продовжити з поштою",authHave:"Вже маєш акаунт?",authNeed:"Вперше в PINGUI?",authCreate:"Створити акаунт",authEnter:"Увійти",authForgot:"Забули пароль?",authProfileTitle:"Давай знайомитися",authProfileSub:"Обери, як інші користувачі бачитимуть тебе в PINGUI.",authNickname:"Нікнейм",authUsername:"Ім’я користувача",authLanguage:"Мова інтерфейсу",authFinish:"Завершити налаштування",authSignout:"Вийти",authLoading:"Підключаємося до PINGUI…",authWorking:"Зачекай…",authPasswordHint:"Щонайменше 6 символів",authUsernameHint:"3–20 літер, цифр або підкреслень",authErrEmail:"Введи коректну адресу електронної пошти.",authErrPassword:"Пароль має містити щонайменше 6 символів.",authErrConfirm:"Паролі не збігаються.",authErrNickname:"Нікнейм має містити від 2 до 24 символів.",authErrUsername:"Ім’я має містити 3–20 символів: лише латинські літери, цифри та підкреслення.",authErrTaken:"Це ім’я користувача вже зайняте. Спробуй інше.",authErrConfig:"Налаштування Firebase не знайдено. Перевір firebase-config.js.",authErrGeneric:"Щось пішло не так. Спробуй ще раз.",authResetSent:"Лист для скидання пароля надіслано. Перевір пошту.",authProfileSaved:"Твій профіль готовий!",authWelcome:"Ласкаво просимо до PINGUI!",authGooglePopup:"Вікно Google закрито або заблоковано. Спробуй ще раз.",authEmailExists:"Акаунт із цією поштою вже існує.",authWrongPassword:"Неправильна пошта або пароль.",authWeakPassword:"Обери надійніший пароль (щонайменше 6 символів).",authNoUser:"Акаунт із цією поштою не знайдено.",authProfileRequired:"Заповни профіль, щоб продовжити."
    }
  };

  const locale = () => languages.includes(selectedLanguage) ? selectedLanguage : "no";
  const tr = (key) => (authText[locale()] && authText[locale()][key]) || authText.no[key] || key;
  const show = (id, visible) => { const el=$(id); if(el) el.hidden=!visible; };
  const setError = (id, msg="") => { const el=$(id); if(el) el.textContent=msg; };
  const configReady = () => config.apiKey && !String(config.apiKey).includes("PASTE_") &&
    config.projectId && !String(config.projectId).includes("YOUR_") &&
    config.appId && !String(config.appId).includes("PASTE_");
  const currentLangFromState = () => {
    try { const s=JSON.parse(localStorage.getItem("pingui_state")||"{}"); return languages.includes(s.lang)?s.lang:"no"; }
    catch { return "no"; }
  };

  function paintAuth() {
    const keys = ["authEyebrow","authTitle","authSub","authSignupTab","authLoginTab","authEmailLabel","authPasswordLabel","authConfirmLabel","authGoogleLabel","authOr","authForgot","authNickname","authUsername","authLanguage","authFinish","authSignout"];
    const map = {authSignupTab:"authSignup",authLoginTab:"authLogin",authEmailLabel:"authEmail",authPasswordLabel:"authPassword",authConfirmLabel:"authConfirm",authGoogleLabel:"authGoogle",authNickname:"authNickname",authUsername:"authUsername",authLanguage:"authLanguage",authFinish:"authFinish"};
    keys.forEach(id=>{const el=$(id);if(el)el.textContent=tr(map[id]||id);});
    $("authBrandTag").textContent=tr("authEyebrow");
    const loadingText=$("authLoading").querySelector("p"); if(loadingText) loadingText.textContent=tr("authLoading");
    $("authSubmit").firstChild.textContent=tr(currentMode==="signup"?"authCreate":"authEnter")+" ";
    $("authSwitchText").textContent=tr(currentMode==="signup"?"authHave":"authNeed");
    $("authSwitch").textContent=tr(currentMode==="signup"?"authLogin":"authSignup");
    $("authForgot").textContent=tr("authForgot");
    $("authOr").textContent=tr("authOr");
    $("profileEyebrow").textContent=tr("authEyebrow");
    $("profileTitle").textContent=tr("authProfileTitle");
    $("profileSub").textContent=tr("authProfileSub");
    $("nicknameLabel").textContent=tr("authNickname");
    $("usernameLabel").textContent=tr("authUsername");
    $("languageLabel").textContent=tr("authLanguage");
    $("usernameHint").textContent=tr("authUsernameHint");
    $("profileSubmit").firstChild.textContent=tr("authFinish")+" ";
    $("authPassword").placeholder=tr("authPasswordHint");
    document.querySelectorAll("[data-profile-lang]").forEach(b=>b.classList.toggle("selected",b.dataset.profileLang===selectedLanguage));
    $("authConfirmWrap").hidden=currentMode!=="signup";
    $("authForgot").hidden=currentMode!=="login";
    $("authSignupTab").classList.toggle("active",currentMode==="signup");
    $("authLoginTab").classList.toggle("active",currentMode==="login");
    $("authSubmit").disabled=busy;
    $("authGoogle").disabled=busy;
    $("profileSubmit").disabled=busy;
  }

  function setMode(mode) {
    currentMode=mode;
    show("authForms",true); show("profileSetup",false);
    setError("authError","");
    paintAuth();
  }
  function setBusy(value) {
    busy=value; paintAuth();
    const submit=$("authSubmit"), profile=$("profileSubmit");
    if(submit && value) submit.textContent=tr("authWorking");
    if(profile && value) profile.textContent=tr("authWorking");
  }
  function friendlyError(error) {
    const code=error && error.code || "";
    const map={
      "auth/email-already-in-use":"authEmailExists",
      "auth/invalid-email":"authErrEmail",
      "auth/weak-password":"authWeakPassword",
      "auth/invalid-credential":"authWrongPassword",
      "auth/wrong-password":"authWrongPassword",
      "auth/user-not-found":"authNoUser",
      "auth/popup-closed-by-user":"authGooglePopup",
      "auth/popup-blocked":"authGooglePopup",
      "auth/cancelled-popup-request":"authGooglePopup",
      "permission-denied":"authErrGeneric"
    };
    return tr(map[code]||"authErrGeneric");
  }
  function saveAppState(lang, nickname) {
    let state={};
    try { state=JSON.parse(localStorage.getItem("pingui_state")||"{}")||{}; } catch {}
    state.lang=lang;
    state.onboarded=true;
    state.level=state.level||"A1";
    localStorage.setItem("pingui_state",JSON.stringify(state));
    const avatar=$("profileButton");
    if(avatar){avatar.textContent=(nickname||"P").trim().charAt(0).toUpperCase();avatar.title=nickname||"";}
  }
  function enterApp(profile) {
    selectedLanguage=languages.includes(profile.language)?profile.language:"no";
    let oldState={};
    try { oldState=JSON.parse(localStorage.getItem("pingui_state")||"{}")||{}; } catch {}
    const needsReload=oldState.lang!==selectedLanguage || oldState.onboarded!==true || !oldState.level;
    saveAppState(selectedLanguage,profile.nickname);
    const avatar=$("profileButton");
    if(avatar) avatar.title=`${profile.nickname||""} · @${profile.username||""}`;
    if(needsReload) { location.reload(); return; }
    document.body.classList.remove("auth-locked");
    show("authGate",false);
    if(window.PINGUI_AUTH_READY) window.PINGUI_AUTH_READY(profile);
  }
  async function showProfileFor(user) {
    const ref=db.collection("users").doc(user.uid);
    const snap=await ref.get();
    if(snap.exists && snap.data().username) {
      const profile=snap.data();
      enterApp(profile);
      return;
    }
    selectedLanguage=currentLangFromState();
    $("profileNickname").value=user.displayName||"";
    $("profileUsername").value="";
    setError("profileError","");
    show("authLoading",false);show("authForms",false);show("profileSetup",true);
    paintAuth();
  }
  async function saveProfile(event) {
    event.preventDefault();
    if(busy || !auth.currentUser) return;
    const nickname=$("profileNickname").value.trim();
    const username=$("profileUsername").value.trim().toLowerCase();
    const valid=/^[a-z0-9_]{3,20}$/.test(username);
    if(nickname.length<2||nickname.length>24){setError("profileError",tr("authErrNickname"));return;}
    if(!valid){setError("profileError",tr("authErrUsername"));return;}
    setBusy(true);setError("profileError","");
    const user=auth.currentUser, userRef=db.collection("users").doc(user.uid), nameRef=db.collection("usernames").doc(username);
    try {
      await db.runTransaction(async tx=>{
        const existing=await tx.get(nameRef);
        // A username claim already owned by this account can be safely reused during profile recovery.
        if(existing.exists && existing.data().uid!==user.uid) throw new Error("USERNAME_TAKEN");
        if(!existing.exists) tx.set(nameRef,{uid:user.uid,createdAt:firebase.firestore.FieldValue.serverTimestamp()});
        tx.set(userRef,{
          uid:user.uid,email:user.email||null,nickname,username,language:selectedLanguage,
          provider:(user.providerData[0]&&user.providerData[0].providerId)||"password",
          createdAt:firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt:firebase.firestore.FieldValue.serverTimestamp()
        },{merge:true});
      });
      if(user.updateProfile) await user.updateProfile({displayName:nickname});
      $("profileTitle").textContent=tr("authProfileSaved");
      enterApp({nickname,username,language:selectedLanguage});
    } catch(error) {
      setError("profileError",error.message==="USERNAME_TAKEN"?tr("authErrTaken"):friendlyError(error));
    } finally {setBusy(false);}
  }

  async function submitAuth(event) {
    event.preventDefault();
    if(busy||!auth) return;
    const email=$("authEmail").value.trim();
    const password=$("authPassword").value;
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setError("authError",tr("authErrEmail"));return;}
    if(password.length<6){setError("authError",tr("authErrPassword"));return;}
    if(currentMode==="signup" && password!==$("authConfirm").value){setError("authError",tr("authErrConfirm"));return;}
    setBusy(true);setError("authError","");
    try {
      if(currentMode==="signup") await auth.createUserWithEmailAndPassword(email,password);
      else await auth.signInWithEmailAndPassword(email,password);
    } catch(error) { setError("authError",friendlyError(error)); }
    finally { setBusy(false); }
  }

  async function googleSignIn() {
    if(busy||!auth)return;
    setBusy(true);setError("authError","");
    try {
      const provider=new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({prompt:"select_account"});
      await auth.signInWithPopup(provider);
    } catch(error) { setError("authError",friendlyError(error)); }
    finally { setBusy(false); }
  }

  async function resetPassword() {
    const email=$("authEmail").value.trim();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setError("authError",tr("authErrEmail"));return;}
    try { await auth.sendPasswordResetEmail(email); setError("authError",tr("authResetSent")); }
    catch(error) { setError("authError",friendlyError(error)); }
  }

  async function signOut() {
    if(!auth)return;
    try { await auth.signOut(); location.reload(); }
    catch(error) { alert(friendlyError(error)); }
  }

  function init() {
    selectedLanguage=currentLangFromState();
    if(!configReady() || !window.firebase) {
      show("authLoading",false);show("authForms",false);show("authConfigWarning",true);
      $("authConfigWarning").textContent=tr("authErrConfig");
      $("authConfigWarning").insertAdjacentHTML("beforeend","<p>"+tr("authConfig")+"</p>");
      return;
    }
    try {
      if(!firebase.apps.length) firebase.initializeApp(config);
      auth=firebase.auth(); db=firebase.firestore();
      auth.useDeviceLanguage();
      $("authForm").addEventListener("submit",submitAuth);
      $("profileForm").addEventListener("submit",saveProfile);
      $("authSignupTab").addEventListener("click",()=>setMode("signup"));
      $("authLoginTab").addEventListener("click",()=>setMode("login"));
      $("authSwitch").addEventListener("click",()=>setMode(currentMode==="signup"?"login":"signup"));
      $("authGoogle").addEventListener("click",googleSignIn);
      $("authForgot").addEventListener("click",resetPassword);
      document.querySelectorAll("[data-profile-lang]").forEach(b=>b.addEventListener("click",()=>{selectedLanguage=b.dataset.profileLang;paintAuth();}));
      $("profileUsername").addEventListener("input",()=>{$("profileUsername").value=$("profileUsername").value.toLowerCase().replace(/[^a-z0-9_]/g,"");});
      document.addEventListener("click",e=>{
        if(e.target.closest("[data-auth-signout]")) signOut();
      });
      setMode("signup");
      auth.onAuthStateChanged(async user=>{
        if(!user) {
          document.body.classList.add("auth-locked");
          show("authGate",true);show("authLoading",false);show("authForms",true);show("profileSetup",false);
          return;
        }
        document.body.classList.add("auth-locked");
        show("authGate",true);show("authLoading",true);show("authForms",false);show("profileSetup",false);
        try { await showProfileFor(user); }
        catch(error) {
          show("authLoading",false);show("authForms",true);
          setError("authError",friendlyError(error));
        }
      });
    } catch(error) {
      show("authLoading",false);show("authConfigWarning",true);
      $("authConfigWarning").textContent=tr("authErrConfig");
    }
  }

  document.addEventListener("DOMContentLoaded",init);
})();
