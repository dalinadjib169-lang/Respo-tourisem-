import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      "app_name": "السياحة المسؤولة",
      "author_name": "الدكتورة زعرة عيايشية",
      "home": "الرئيسية",
      "articles": "منشورات وأبحاث",
      "works": "أعمال علمية",
      "cv": "السيرة الذاتية",
      "contact": "اتصل بنا",
      "dashboard": "لوحة التحكم",
      "hero_title": "باحثة الاقتصاد الرقمي والسياحة المسؤولة",
      "hero_subtitle": "متخصصة في استراتيجيات التنمية المستدامة، دمج التكنولوجيا في السياحة، وأخلاقيات السلوك السياحي المسؤول. طالبة دكتوراه بجامعة وهران 2 محمد بن أحمد.",
      "download_cv": "تحميل السيرة الذاتية (Word)",
      "read_more": "اقرأ المزيد",
      "contact_me": "تواصل معي",
      "send_message": "إرسال الرسالة",
      "name": "الاسم",
      "email": "البريد الإلكتروني",
      "subject": "الموضوع",
      "message": "الرسالة",
      "quote": "السياحة هي الجسر الثقافي بين الشعوب، والمسؤولية هي مفتاح استدامتها",
      "language": "اللغة",
      "login": "تسجيل الدخول",
      "logout": "خروج",
      "upload_image": "رفع صورة",
      "upload_success": "تم النشر بنجاح",
      "add_article": "إضافة منشور",
      "add_work": "إضافة عمل"
    }
  },
  en: {
    translation: {
      "app_name": "Responsible Tourism",
      "author_name": "Dr. Zaara Ayaichia",
      "home": "Home",
      "articles": "Articles",
      "works": "Works",
      "cv": "CV",
      "contact": "Contact",
      "dashboard": "Dashboard",
      "hero_title": "Towards Sustainable & Responsible Tourism",
      "hero_subtitle": "PhD student in International Economics, specialized in responsible tourism and sustainable development in Algeria.",
      "download_cv": "Download CV (Word)",
      "read_more": "Read More",
      "contact_me": "Contact Me",
      "send_message": "Send Message",
      "name": "Name",
      "email": "Email",
      "subject": "Subject",
      "message": "Message",
      "quote": "And do not cause corruption on the earth after its reformation",
      "language": "Language",
      "login": "Login",
      "logout": "Logout",
      "upload_image": "Upload Image",
      "add_article": "Add Article",
      "add_work": "Add Work"
    }
  },
  fr: {
    translation: {
      "app_name": "Tourisme Responsable",
      "author_name": "Dr. Zaara Ayaichia",
      "home": "Accueil",
      "articles": "Articles",
      "works": "Travaux",
      "cv": "CV",
      "contact": "Contact",
      "dashboard": "Tableau de Bord",
      "hero_title": "Vers un Tourisme Durable et Responsable",
      "hero_subtitle": "Doctorante en Économie Internationale, spécialisée dans le tourisme responsable et le développement durable en Algérie.",
      "download_cv": "Télécharger CV (Word)",
      "read_more": "Lire la Suite",
      "contact_me": "Contactez-moi",
      "send_message": "Envoyer le Message",
      "name": "Nom",
      "email": "Email",
      "subject": "Sujet",
      "message": "Message",
      "quote": "Et ne semez pas la corruption sur la terre après qu'elle a été réformée",
      "language": "Langue",
      "login": "Connexion",
      "logout": "Déconnexion",
      "upload_image": "Télécharger une image",
      "add_article": "Ajouter un article",
      "add_work": "Ajouter un travail"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ar",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
