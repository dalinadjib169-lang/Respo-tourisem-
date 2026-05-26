import { Timestamp } from 'firebase/firestore';

export interface Profile {
  name: string;
  title: string;
  bio: string;
  cvUrl?: string;
  email?: string;
  profileImageUrl?: string;
  stats?: {
    visitors: number;
    totalLikes: number;
  };
}

export type Language = 'ar' | 'fr' | 'en';

export const TRANSLATIONS = {
  ar: {
    home: 'الرئيسية',
    articles: 'المقالات',
    works: 'الأعمال',
    cv: 'السيرة الذاتية',
    contact: 'اتصل بنا',
    dashboard: 'لوحة التحكم',
    responsible_tourism: 'السياحة المسؤولة',
    author_name: 'د. عيايشية زعرة',
    quote: '"وَلَا تُفْسِدُوا فِي الْأَرْضِ بَعْدَ إِصْلَاحِهَا"',
    download_cv: 'تحميل السيرة الذاتية',
    read_more: 'اقرأ المزيد',
    send_message: 'إرسال الرسالة',
    upload_image: 'رفع صورة',
    uploading: 'جاري الرفع...',
    night_mode: 'وضع الليل',
    day_mode: 'وضع النهار',
  },
  fr: {
    home: 'Accueil',
    articles: 'Articles',
    works: 'Travaux',
    cv: 'CV',
    contact: 'Contact',
    dashboard: 'Tableau de bord',
    responsible_tourism: 'Tourisme Responsable',
    author_name: 'Dr. Zaara Ayaichia',
    quote: '"Et ne commettez pas de désordre sur terre après qu\'elle a été réformée"',
    download_cv: 'Télécharger le CV',
    read_more: 'Lire la suite',
    send_message: 'Envoyer le message',
    upload_image: 'Télécharger une image',
    uploading: 'Téléchargement...',
    night_mode: 'Mode nuit',
    day_mode: 'Mode jour',
  },
  en: {
    home: 'Home',
    articles: 'Articles',
    works: 'Works',
    cv: 'Curriculum Vitae',
    contact: 'Contact',
    dashboard: 'Dashboard',
    responsible_tourism: 'Responsible Tourism',
    author_name: 'Dr. Zaara Ayaichia',
    quote: '"And do not cause corruption upon the earth after its reformation"',
    download_cv: 'Download CV',
    read_more: 'Read More',
    send_message: 'Send Message',
    upload_image: 'Upload Image',
    uploading: 'Uploading...',
    night_mode: 'Night Mode',
    day_mode: 'Day Mode',
  }
};

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  createdAt: Timestamp;
  authorId: string;
  likes: number;
  comments: any[];
}

export interface Comment {
  id: string;
  articleId: string;
  userName: string;
  content: string;
  createdAt: Timestamp;
  reply?: string;
  replyAt?: Timestamp;
}

export interface Work {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  externalUrl?: string;
  rating: number;
  ratingCount: number;
  category: string;
  pdfUrl?: string;
  arTitle?: string;
  arDesc?: string;
  enTitle?: string;
  enDesc?: string;
}

export interface Message {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  createdAt: Timestamp;
  replied: boolean;
  replyContent?: string;
}

export type Theme = 'sea' | 'desert' | 'snow' | 'forest' | 'space' | 'algeria' | 'hoggar' | 'makam';

export const THEMES: Record<Theme, { url: string; label: string; color: string }> = {
  sea: {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000',
    label: 'البحر',
    color: 'bg-blue-500/20'
  },
  desert: {
    url: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&q=80&w=2000',
    label: 'الصحراء',
    color: 'bg-orange-500/20'
  },
  snow: {
    url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=2000',
    label: 'الثلوج',
    color: 'bg-slate-200/20'
  },
  forest: {
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2000',
    label: 'الغابة',
    color: 'bg-green-500/20'
  },
  space: {
    url: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=2000',
    label: 'الفضاء',
    color: 'bg-purple-500/20'
  },
  algeria: {
    url: '/src/assets/images/algeria_flag_bg_1779741581415.png',
    label: 'العلم الجزائري',
    color: 'bg-emerald-600/20'
  },
  hoggar: {
    url: '/src/assets/images/hoggar_tassili_bg_1779741619469.png',
    label: 'هقار وطاسيلي',
    color: 'bg-amber-600/20'
  },
  makam: {
    url: '/src/assets/images/makam_chahid_bg_1779741600810.png',
    label: 'مقام الشهيد',
    color: 'bg-teal-500/20'
  }
};
