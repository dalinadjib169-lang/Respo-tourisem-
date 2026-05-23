/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  BookOpen, 
  Briefcase, 
  User as UserIcon, 
  Mail, 
  Settings, 
  Star, 
  ThumbsUp, 
  MessageSquare,
  Heart,
  MessageCircle,
  Plus,
  ArrowRight,
  LogOut,
  Send,
  Loader2,
  Menu,
  X,
  LayoutDashboard,
  Sun,
  Moon,
  Download,
  Upload,
  LogIn,
  Mic,
  Smile,
  Image as ImageIcon,
  Paperclip,
  Trash2,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Camera
} from 'lucide-react';
import { 
  auth, 
  db, 
  testConnection,
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  where,
  signInWithGoogle
} from './lib/firebase';
import { uploadToCloudinary } from './lib/cloudinary';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
import { THEMES, Theme, Article, Work, Message, Profile } from './types';
import { DR_YAI_PUBLICATIONS, type Publication } from './data/publications';
import { fullPapers } from './data/fullPapers';
import { useTranslation } from 'react-i18next';
import './i18n';
import { saveAs } from 'file-saver';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utils ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const isAdminEmail = (email?: string | null) => {
  if (!email) return false;
  const lower = email.toLowerCase().trim();
  return (
    lower === 'ayaichiazaara@gmail.com' ||
    lower === 'zaaraayaichia@gmail.com' ||
    lower === 'dalinadjib1990@gmail.com'
  );
};

// --- Context ---
const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
  lang: string;
  setLang: (l: string) => void;
  isDark: boolean;
  toggleDark: () => void;
}>({ 
  theme: 'sea', 
  setTheme: () => {}, 
  lang: 'ar', 
  setLang: () => {},
  isDark: true,
  toggleDark: () => {}
});

// --- Components ---

const Navbar = ({ currentUser, onNavigate, activeTab, signInWithGoogle }: { 
  currentUser: any; 
  onNavigate: (tab: string) => void;
  activeTab: string;
  signInWithGoogle: () => void;
}) => {
  const { lang, setLang, isDark, toggleDark } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();

  const navItems = [
    { id: 'home', label: t('home'), icon: Home },
    { id: 'articles', label: t('articles'), icon: BookOpen },
    { id: 'works', label: t('works'), icon: Briefcase },
    { id: 'cv', label: t('cv'), icon: UserIcon },
    { id: 'contact', label: t('contact'), icon: Mail },
  ];
  if (isAdminEmail(currentUser?.email)) {
    navItems.push({ id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard });
  }

  const changeLang = (l: string) => {
    i18n.changeLanguage(l);
    setLang(l);
  };

  return (
    <nav className="fixed md:top-0 md:right-0 bottom-0 md:bottom-auto w-full md:w-28 md:h-full z-[60] flex md:flex-col items-center justify-between px-6 md:px-0 py-4 md:py-10 bg-slate-950/80 backdrop-blur-3xl border-t md:border-t-0 md:border-l border-white/10 shadow-2xl transition-all duration-500">
      <div className="hidden md:flex flex-col items-center gap-2 mb-8">
        <div 
          className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-blue-600 flex items-center justify-center shadow-neon ring-4 ring-white/10 hover:scale-105 transition-transform duration-500 cursor-pointer group relative"
          onClick={() => onNavigate('home')}
        >
          <span className="text-2xl font-serif font-black text-white">ZA</span>
          <div className="absolute -top-1 -right-1 text-xs">🇩🇿</div>
        </div>
        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mt-1">Algeria</span>
      </div>
      
      <div className="flex-1 md:flex-none flex md:flex-col items-center justify-around w-full gap-2 lg:gap-8">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "group relative p-4 rounded-2xl transition-all duration-500 flex flex-col items-center gap-1",
              activeTab === item.id 
                ? "bg-white text-slate-950 shadow-neon scale-110" 
                : item.id === 'dashboard'
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                  : "text-white/40 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon size={20} className="relative z-10" />
            <span className="text-[8px] font-bold uppercase tracking-tighter hidden md:block">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="flex md:flex-col items-center gap-4">
        {/* Dark Mode Toggle - Grouped with Profile */}
        <button 
          onClick={toggleDark}
          className="w-12 h-12 md:w-14 md:h-14 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-yellow-400 transition-all flex items-center justify-center shadow-xl group"
          title={isDark ? "Day Mode" : "Night Mode"}
        >
          {isDark ? <Sun size={20} className="group-hover:rotate-45 transition-transform md:size-24" /> : <Moon size={20} className="group-hover:-rotate-12 transition-transform md:size-24" />}
        </button>

        {!currentUser ? (
           <button 
             onClick={signInWithGoogle} 
             className="flex flex-col items-center gap-1 group"
             title="تسجيل الدخول"
           >
             <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl md:rounded-3xl bg-white text-slate-950 flex items-center justify-center shadow-neon hover:scale-110 transition-all border-4 border-emerald-500/20">
               <UserIcon size={20} className="md:size-24" />
             </div>
             <span className="text-[9px] font-black uppercase text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">Login</span>
           </button>
        ) : (
          <button 
            onClick={() => auth.signOut()} 
            className="flex flex-col items-center gap-1 group"
            title="خروج"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl md:rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all">
              <LogOut size={20} className="md:size-24" />
            </div>
            <span className="text-[9px] font-black uppercase text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">Exit</span>
          </button>
        )}
      </div>
    </nav>
  );
};

const MobileNav = ({ onNavigate, activeTab }: { onNavigate: (tab: string) => void; activeTab: string }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { lang, setLang, isDark, toggleDark } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();

  const navItems = [
    { id: 'home', label: t('home'), icon: Home },
    { id: 'articles', label: t('articles'), icon: BookOpen },
    { id: 'works', label: t('works'), icon: Briefcase },
    { id: 'cv', label: t('cv'), icon: UserIcon },
    { id: 'contact', label: t('contact'), icon: Mail },
  ];

  const changeLang = (l: string) => {
    i18n.changeLanguage(l);
    setLang(l);
    setIsMenuOpen(false);
  };

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10 h-16 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <span className="font-serif font-bold text-white text-lg neon-text">ZA</span>
        <span className="text-xs">🇩🇿</span>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={toggleDark} className="text-white/60">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-16 left-0 right-0 bg-slate-950 border-b border-white/10 p-6 flex flex-col gap-6"
          >
             <div className="flex justify-center gap-4 border-b border-white/5 pb-4">
                {['ar', 'fr', 'en'].map(l => (
                  <button 
                    key={l} 
                    onClick={() => changeLang(l)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold uppercase",
                      lang === l ? "bg-white text-slate-950" : "text-white/40"
                    )}
                  >
                    {l}
                  </button>
                ))}
             </div>
            <div className="grid grid-cols-2 gap-3">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); setIsMenuOpen(false); }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-4 rounded-2xl flex-row-reverse justify-between bg-white/5 border border-white/10",
                    activeTab === item.id ? "border-neon-blue text-white shadow-[0_0_10px_rgba(0,243,255,0.2)]" : "text-white/60"
                  )}
                >
                  <span className="text-sm font-bold">{item.label}</span>
                  <item.icon size={20} className={activeTab === item.id ? "text-neon-blue" : ""} />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BackgroundSlider = () => {
  const { theme, isDark } = useContext(ThemeContext);
  
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
           key={theme}
           initial={{ opacity: 0, scale: 1.1 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.95 }}
           transition={{ duration: 2, ease: "easeInOut" }}
           className="absolute inset-0"
        >
           <img 
             src={THEMES[theme].url} 
             alt="Background" 
             className={cn(
               "w-full h-full object-cover transition-all duration-1000",
               isDark ? "brightness-[0.3] contrast-125 saturate-[0.8]" : "brightness-[0.9] saturate-125"
             )}
           />
           
           {/* Overlays */}
           <div className={cn(
             "absolute inset-0 transition-colors duration-1000",
             isDark ? "bg-slate-950/40" : "bg-white/20"
           )} />
           <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-emerald-600/10 mix-blend-overlay" />
           <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 80%)' }} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const ThemeSwitcher = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className="fixed bottom-8 left-8 z-50 flex gap-2">
      {(Object.keys(THEMES) as Theme[]).map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={cn(
            "w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center text-[10px] font-bold text-white backdrop-blur-md overflow-hidden",
            theme === t ? "border-white scale-110 shadow-lg" : "border-white/30 scale-100 hover:border-white/60"
          )}
        >
           <img src={THEMES[t].url} className="absolute inset-0 w-full h-full object-cover opacity-60" />
           <span className="relative z-10 drop-shadow-md">{THEMES[t].label}</span>
        </button>
      ))}
    </div>
  );
};

// --- Floating Chat & Admin UI ---

const FloatingDashboardButton = ({ onNavigate }: { onNavigate: (tab: string) => void }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const qChat = query(collection(db, 'live_chat'), where('isAdmin', '==', false), where('read', '==', false));
    const qMessages = query(collection(db, 'messages'), where('replied', '==', false));
    
    // Combined total tracking
    let chatCount = 0;
    let msgCount = 0;

    const updateAll = () => setUnreadCount(chatCount + msgCount);

    const u1 = onSnapshot(qChat, (snap) => { chatCount = snap.size; updateAll(); });
    const u2 = onSnapshot(qMessages, (snap) => { msgCount = snap.size; updateAll(); });

    return () => { u1(); u2(); };
  }, []);

  return (
    <motion.button
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => {
        // Mark all as read when admin enters dashboard? Or handled in dashboard.
        onNavigate('dashboard');
      }}
      className="fixed top-6 right-6 z-[70] bg-emerald-600 text-white p-4 rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.4)] border border-white/20 flex items-center gap-3 group overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      <div className="relative">
        <LayoutDashboard size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 animate-bounce">
            {unreadCount}
          </span>
        )}
      </div>
      <span className="font-bold text-sm hidden md:block">لوحة التحكم</span>
    </motion.button>
  );
};

const FloatingChat = ({ currentUser, isOpen, onClose }: { currentUser: any, isOpen: boolean, onClose: () => void }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const visitorId = useRef(localStorage.getItem('chat_visitor_id') || Math.random().toString(36).substring(7));
  
  const EMOJIS = ['😊', '😂', '😍', '🤝', '🙌', '✨', '☕', '💡', '📚', '🌍'];

  useEffect(() => {
    localStorage.setItem('chat_visitor_id', visitorId.current);
  }, []);

  const isAdmin = isAdminEmail(currentUser?.email);

  useEffect(() => {
    if (!isOpen) return;
    
    // Unique chatId for each user
    const chatId = isAdmin ? 'admin_global' : visitorId.current;
    
    const q = query(collection(db, 'live_chat'), orderBy('createdAt', 'asc'));
    return onSnapshot(q, (snap) => {
      let msgs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Filter for this user's conversation
      if (!isAdmin) {
        msgs = msgs.filter((m: any) => m.chatId === visitorId.current);
      }
      setMessages(msgs);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
  }, [isOpen, isAdmin]);

  const handleSend = async (mediaUrl?: string, type: 'text' | 'image' | 'audio' = 'text') => {
    if (!currentUser) {
      alert('الرجاء تسجيل الدخول أولاً للمشاركة في المحادثة');
      return;
    }
    if (!text && !mediaUrl) return;
    
    try {
      await addDoc(collection(db, 'live_chat'), {
        chatId: isAdmin ? (messages[messages.length-1]?.chatId || 'admin') : visitorId.current,
        senderId: currentUser?.uid || visitorId.current,
        senderName: isAdmin ? 'د. زعرة عيايشة' : (currentUser?.displayName || 'زائر'),
        isAdmin: isAdmin,
        text: text,
        mediaUrl: mediaUrl || null,
        type: type,
        createdAt: serverTimestamp(),
        read: false,
      });
      setText('');
      setShowEmojis(false);
    } catch (err) {
      console.error(err);
    }
  };

  const startRecording = async () => {
    if (!currentUser) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      
      mediaRecorder.current.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };
      
      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        try {
          const formData = new FormData();
          formData.append('file', audioBlob);
          formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'doctor_zaara_preset');
          
          const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'doaxziqm7'}/auto/upload`, {
            method: 'POST',
            body: formData
          });
          const data = await res.json();
          handleSend(data.secure_url, 'audio');
        } catch (err) {
          console.error('Audio upload failed:', err);
        }
      };
      
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      alert('يرجى السماح بالوصول للميكروفون');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentUser) return;
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadToCloudinary(file);
      handleSend(url, 'image');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Draggable Bubble (Optional: keep or remove if it stays linked to button) */}
            {/* But user wants the BUBBLE to appear smoothly when message button clicked */}
            <motion.div
              drag
              dragConstraints={{ left: -1000, right: 0, top: 0, bottom: 800 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="fixed bottom-10 right-10 z-[80] cursor-pointer"
              onClick={onClose}
            >
              <div className="relative group">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-700 shadow-[0_10px_40px_rgba(16,185,129,1)] border-4 border-white/20 overflow-hidden flex items-center justify-center">
                   <span className="text-white font-black text-xl">ZA</span>
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse" />
                <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-slate-950/90 backdrop-blur-md px-6 py-2 rounded-2xl border border-emerald-500/30 whitespace-nowrap opacity-100 transition-all shadow-2xl">
                  <span className="text-emerald-400 font-black text-[10px] uppercase tracking-widest leading-none">د. زعرة عيايشة</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="fixed bottom-[80px] md:bottom-28 right-4 md:right-10 z-[81] w-[calc(100vw-32px)] md:w-[500px] h-[540px] md:h-[600px] bg-slate-950 border border-white/10 rounded-[2.5rem] md:rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-emerald-600 p-5 md:p-6 flex items-center justify-between">
                 <div className="flex items-center gap-4 cursor-pointer" onClick={onClose}>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/20 flex items-center justify-center font-black text-white shadow-inner">
                      ZA
                    </div>
                    <div className="text-right">
                      <p className="text-white font-black text-xs md:text-sm uppercase tracking-tighter">د. زعرة عيايشة</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        <p className="text-white/60 text-[9px] md:text-[10px]">متصل الآن</p>
                      </div>
                    </div>
                 </div>
                 <button onClick={onClose} className="text-white/60 hover:text-white p-2">
                    <X size={24} />
                 </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                 {messages.length === 0 && (
                   <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-4">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-white/10">
                        <MessageSquare size={40} />
                      </div>
                      <p className="text-white/40 text-xs leading-relaxed">مرحباً بك! يمكنك إرسال استفساراتك للدكتورة هنا. نحن متاحون دائماً للمساعدة.</p>
                   </div>
                 )}
                 {messages.map((m) => (
                   <div key={m.id} className={cn("flex flex-col animate-in slide-in-from-bottom-2 duration-300", m.isAdmin ? "items-start" : "items-end")}>
                      <div className={cn(
                        "max-w-[85%] p-4 rounded-2xl text-sm shadow-xl",
                        m.isAdmin 
                          ? "bg-slate-800 text-white rounded-tl-none border border-white/5" 
                          : "bg-emerald-600 text-white rounded-tr-none shadow-emerald-900/20"
                      )}>
                        {m.type === 'image' ? (
                          <a href={m.mediaUrl} target="_blank" rel="noreferrer">
                            <img src={m.mediaUrl} className="rounded-xl w-full hover:scale-105 transition-transform" alt="image" />
                          </a>
                        ) : m.type === 'audio' ? (
                          <audio src={m.mediaUrl} controls className="w-full max-w-[220px] h-10 filter invert" style={{ WebkitFilter: 'invert(1)' }} />
                        ) : (
                          <p dir="auto" className="leading-relaxed font-arabic">{m.text}</p>
                        )}
                      </div>
                      <span className="text-[9px] text-white/20 mt-1.5 px-2">
                         {m.createdAt?.toDate ? m.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'الآن'}
                      </span>
                   </div>
                 ))}
                 <div ref={chatEndRef} />
              </div>

              {/* Emoji Picker Placeholder */}
              <AnimatePresence>
                {showEmojis && (
                  <motion.div 
                    initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    className="bg-slate-900 border-t border-white/5 p-4 flex flex-wrap gap-2 justify-center"
                  >
                    {EMOJIS.map(e => (
                      <button key={e} onClick={() => setText(prev => prev + e)} className="text-2xl hover:scale-125 transition-transform p-1">
                        {e}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input */}
              {currentUser ? (
                <div className="p-4 bg-slate-950 border-t border-white/5 flex items-center gap-2">
                   <div className="flex items-center gap-0.5 flex-shrink-0">
                     <button onClick={() => setShowEmojis(!showEmojis)} className={cn("p-1.5 md:p-2 transition-colors", showEmojis ? "text-emerald-400" : "text-white/40 hover:text-emerald-400")}>
                       <Smile size={18} />
                     </button>
                     <label className="p-1.5 md:p-2 text-white/40 hover:text-emerald-400 cursor-pointer">
                       <ImageIcon size={18} />
                       <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                     </label>
                     <button 
                       onMouseDown={startRecording}
                       onMouseUp={stopRecording}
                       className={cn("p-1.5 md:p-2 transition-colors", isRecording ? "text-red-500 animate-pulse scale-125" : "text-white/40 hover:text-emerald-400")}
                       title="اضغط مطولاً للتسجيل"
                     >
                       <Mic size={18} />
                     </button>
                   </div>
                   <input 
                     type="text"
                     value={text}
                     onChange={e => setText(e.target.value)}
                     onKeyDown={e => e.key === 'Enter' && handleSend()}
                     placeholder="اكتبي استفسارك الكامل هنا للدكتورة..."
                     className="flex-1 bg-white/5 border border-white/15 rounded-2xl py-3.5 px-5 text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-right placeholder:text-white/30 min-w-0 font-arabic font-semibold"
                   />
                   <button onClick={() => handleSend()} className="bg-emerald-600 text-white p-3 rounded-2xl hover:bg-emerald-500 transition-all shadow-lg active:scale-95 flex items-center justify-center flex-shrink-0">
                      <Send size={18} className="rotate-180" />
                   </button>
                </div>
              ) : (
                <div className="p-6 bg-slate-900 text-center">
                   <p className="text-white/40 text-xs mb-4">يجب تسجيل الدخول لإرسال رسائل</p>
                   <button 
                     onClick={() => { onClose(); window.dispatchEvent(new CustomEvent('openLogin')); }} 
                     className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-bold hover:bg-emerald-500 transition-all"
                   >
                     تسجيل الدخول الآن
                   </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// --- Pages ---

const HomePage = ({ currentUser, signInWithGoogle }: { currentUser: any, signInWithGoogle: () => void }) => {
  const { lang } = useContext(ThemeContext);
  const { t } = useTranslation();

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-600/10 blur-[120px] rounded-full animate-pulse delay-700" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full max-w-7xl relative z-10 flex flex-col items-center text-center"
      >
         {/* Central Hero Card */}
         <div className="w-full bg-slate-950/40 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-10 md:p-24 shadow-3xl text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="flex flex-col items-center mb-12 relative z-10">
               <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 to-blue-600 flex items-center justify-center shadow-neon ring-4 ring-white/10 mb-8 group-hover:rotate-6 transition-all duration-700">
                  <span className="text-4xl font-serif font-black text-white">ZA</span>
               </div>
               <span className="bg-emerald-600/20 text-emerald-400 text-[10px] px-8 py-2 rounded-full uppercase font-black tracking-[0.4em] border border-emerald-500/30">
                  {t('hero_title')}
               </span>
            </div>

            <h1 className="text-5xl md:text-9xl font-serif leading-tight text-white/95 mb-8 tracking-tighter drop-shadow-2xl relative z-10">
              {t('author_name')}
            </h1>
            
            <p className="text-xl md:text-3xl text-white/60 leading-relaxed max-w-6xl mx-auto font-arabic font-medium drop-shadow-xl mb-12 relative z-10">
              {t('hero_subtitle')}
            </p>

            <div className="flex flex-wrap gap-6 justify-center relative z-10">
               <button className="bg-white text-slate-950 px-12 py-5 rounded-3xl font-bold shadow-neon hover:scale-105 transition-all flex items-center gap-4 group text-lg">
                  <span>{t('download_cv')}</span>
                  <Download size={24} className="group-hover:translate-y-1 transition-transform" />
               </button>
               {!currentUser ? (
                 <button 
                   onClick={signInWithGoogle}
                   className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-5 rounded-3xl font-bold shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all text-lg hover:scale-105 flex items-center gap-3"
                 >
                   <LogIn size={22} />
                   <span>تسجيل الدخول للمشاركة</span>
                 </button>
               ) : (
                 <button className="bg-white/5 backdrop-blur-xl border border-white/20 text-white px-12 py-5 rounded-3xl font-bold hover:bg-white/10 transition-all text-lg hover:scale-105">
                    {t('contact_me')}
                 </button>
               )}
            </div>
         </div>
         
         {/* Bottom Quote & Stats */}
         <div className="mt-12 flex flex-col md:flex-row items-center justify-between w-full px-10 gap-8 relative z-10">
            <div className="flex gap-16">
               <div className="text-right">
                  <p className="text-5xl font-serif font-bold text-white neon-text">30+</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">Researches</p>
               </div>
               <div className="text-right">
                  <p className="text-5xl font-serif font-bold text-white neon-text">PhD</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">Candidate</p>
               </div>
            </div>
            
            <div className="bg-slate-950/40 backdrop-blur-lg border border-white/10 px-8 py-5 rounded-3xl flex items-center gap-5 shadow-2xl">
               <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping shadow-[0_0_10px_#10b981]" />
               <span className="text-emerald-400 font-serif italic text-xl">"{t('quote')}"</span>
            </div>
         </div>
      </motion.div>
    </div>
  );
};

const CommentSection = ({ articleId, currentUser, onShowToast }: { articleId: string, currentUser: any, onShowToast?: (msg: string, type?: 'success' | 'error') => void }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // We use a property in the article document instead of subcollection for simplicity and O(1) reads in this context
    const articleRef = doc(db, 'articles', articleId);
    
    // Load local storage comments as immediate fallback
    const cachedComments = localStorage.getItem('comments_' + articleId);
    if (cachedComments) {
      try {
        setComments(JSON.parse(cachedComments));
      } catch (e) {
        console.error("Local comments cache parse error:", e);
      }
    }

    const unsubscribe = onSnapshot(articleRef, (snap) => {
      if (snap.exists() && snap.data()?.comments) {
        const remoteComments = snap.data().comments;
        setComments(remoteComments);
        try {
          localStorage.setItem('comments_' + articleId, JSON.stringify(remoteComments));
        } catch (e) {
          console.warn("Could not save to localStorage cache:", e);
        }
      }
    }, (error) => {
      console.warn("onSnapshot read failed, using offline mode comments:", error);
    });

    return () => unsubscribe();
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      const articleRef = doc(db, 'articles', articleId);
      const guestName = visitorName.trim() || 'زائر كريم';
      const uName = currentUser ? (currentUser.displayName || 'زائر') : guestName;
      const uId = currentUser ? currentUser.uid : 'visitor-' + Math.random().toString(36).substr(2, 9);
      const uPhoto = currentUser ? currentUser.photoURL : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(uName)}`;

      const newComment = {
        id: Math.random().toString(36).substr(2, 9),
        userId: uId,
        userName: uName,
        userPhoto: uPhoto,
        text: text.trim(),
        createdAt: new Date().toISOString()
      };
      
      let existingComments: any[] = [];
      let snapExists = false;
      let articleTitle = 'أطروحة أكاديمية';

      try {
        const snap = await getDoc(articleRef);
        snapExists = snap.exists();
        if (snapExists) {
          existingComments = snap.data()?.comments || [];
          articleTitle = snap.data()?.title || articleTitle;
        } else {
          const pubMatch = DR_YAI_PUBLICATIONS.find(p => p.id === articleId);
          articleTitle = pubMatch?.title || articleTitle;
        }
      } catch (getErr) {
        console.warn("Could not getDoc from Firestore, falling back to local list:", getErr);
        existingComments = comments;
        const pubMatch = DR_YAI_PUBLICATIONS.find(p => p.id === articleId);
        articleTitle = pubMatch?.title || articleTitle;
      }
      
      const updatedComments = [...existingComments, newComment];

      // Optimistically update local state & localStorage immediately
      setComments(updatedComments);
      try {
        localStorage.setItem('comments_' + articleId, JSON.stringify(updatedComments));
      } catch (e) {
        console.warn(e);
      }

      try {
        await setDoc(articleRef, {
          comments: updatedComments
        }, { merge: true });

        // Add Notification for Admin (optional, only if online)
        if (!currentUser || !isAdminEmail(currentUser.email)) {
          await addDoc(collection(db, 'notifications'), {
            type: 'comment',
            from: uName,
            articleTitle: articleTitle,
            text: text.substring(0, 50) + '...',
            createdAt: serverTimestamp(),
            read: false
          }).catch(err => console.warn("Could not send admin notification:", err));
        }
        onShowToast?.('✓ تم نشر تعقيبكِ الأكاديمي بنجاح!', 'success');
      } catch (writeErr) {
        console.warn("Firestore write failed, comments remain saved locally:", writeErr);
        onShowToast?.('✓ تم حفظ تعليقكِ محلياً! سيتم مزامنته تلقائياً عند معاودة الاتصال.', 'success');
      }

      setText('');
      setVisitorName('');
    } catch (err) {
      console.error("Comment submit error:", err);
    }
    setLoading(false);
  };

  return (
    <div className="mt-8 pt-6 border-t border-white/5 space-y-6 text-right">
      <div className="flex items-center justify-between flex-row-reverse pb-2">
        <h4 className="text-xs font-black text-emerald-400 font-arabic">💬 التعليقات والتعقيبات الأكاديمية ({comments.length})</h4>
        <span className="text-[9px] text-white/30 font-mono">COMMENTS SYSTEM</span>
      </div>

      <div className="max-h-72 overflow-y-auto space-y-4 pr-3 custom-scrollbar">
        {comments.length === 0 ? (
          <p className="text-white/20 text-xs italic text-center py-6 font-arabic">لا توجد تعليقات بعد على هذه الدراسة الأكاديمية. شاركي رأيكِ العلمي لتكوني الأولى!</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="flex gap-3 flex-row-reverse text-right items-start">
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-white/10 flex-shrink-0 overflow-hidden shadow-md">
                 <img src={c.userPhoto || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.userName)}`} alt={c.userName} referrerPolicy="no-referrer" />
              </div>
              <div className="bg-white/5 p-4 rounded-2xl rounded-tr-none flex-1 border border-white/5 relative">
                <div className="flex justify-between items-center flex-row-reverse mb-1.5">
                  <p className="text-xs font-bold text-emerald-400 font-arabic">{c.userName}</p>
                  <span className="text-[9px] text-white/30 font-mono">
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString('ar-DZ') : ''}
                  </span>
                </div>
                <p className="text-xs text-white/85 leading-relaxed font-arabic whitespace-pre-line">{c.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {!currentUser && (
          <div className="flex gap-2.5 justify-end items-center flex-row-reverse">
            <span className="text-[10px] text-emerald-400/80 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-arabic">
              التعليق كزائر / Comment as Guest
            </span>
            <input 
              type="text" 
              required
              value={visitorName}
              onChange={e => setVisitorName(e.target.value)}
              placeholder="اكتبي اسمكِ الكريم أو صفتكِ العلمية..."
              className="flex-1 max-w-[280px] bg-slate-950/80 border border-white/15 rounded-xl py-2 px-3 text-xs text-white focus:ring-1 focus:ring-emerald-500 outline-none text-right font-arabic"
            />
          </div>
        )}
        <div className="relative flex flex-col gap-2">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={4}
            required
            placeholder="اكتبي تعقيبكِ الفكري، مرئياتكِ البحثية، أو رأيكِ الأكاديمي المكتمل والمفصل هنا بكل راحة ومقروئية..."
            className="w-full bg-slate-950 border border-white/15 rounded-2xl p-4 text-xs sm:text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none pr-4 text-right font-arabic font-medium leading-relaxed resize-y min-h-[100px] custom-scrollbar"
          />
          <div className="flex justify-start">
            <button 
              type="submit"
              disabled={loading || !text.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 flex-row-reverse font-arabic shadow-md active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>جاري النشر...</span>
                </>
              ) : (
                <>
                  <Send size={13} className="rotate-180" />
                  <span>نشر التعليق / Publish</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const InteractiveItemRating = ({ itemId, itemType, initialRating = 4.8 }: { itemId: string, itemType: 'article' | 'work', initialRating?: number }) => {
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [avgRating, setAvgRating] = useState<number>(initialRating);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    const q = query(collection(db, 'ratings'), where('itemId', '==', itemId));
    return onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => doc.data());
      if (docs.length > 0) {
        const sum = docs.reduce((acc, r: any) => acc + (r.rating || 0), 0);
        const avg = Math.round((sum / docs.length) * 10) / 10;
        setAvgRating(avg);
        setTotalCount(docs.length);
      } else {
        setAvgRating(initialRating);
        setTotalCount(0);
      }
    });
  }, [itemId, initialRating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRating === 0) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'ratings'), {
        itemId,
        itemType,
        rating: userRating,
        reviewerName: name.trim() || 'زائر مجهول',
        comment: comment.trim() || 'تقييم ممتاز وقراءة قيمة للعمل.',
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
      setShowForm(false);
      setName('');
      setComment('');
      setUserRating(0);
    } catch (err) {
      console.error("Error submitting rating: ", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6 bg-slate-950/60 border border-white/5 p-5 rounded-3xl text-right relative">
      <div className="flex items-center justify-between flex-row-reverse gap-4">
        <div className="flex flex-col items-end">
          <p className="text-[10px] text-white/40 block mb-1 font-mono uppercase tracking-wider">تقييم القراء والباحثين / Academic Rating</p>
          <div className="flex items-center gap-2 flex-row-reverse">
            <div className="flex gap-0.5 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <button 
                  type="button"
                  key={s}
                  onClick={() => {
                    setUserRating(s);
                    setShowForm(true);
                    setSubmitted(false);
                  }}
                  className="p-2.5 hover:scale-125 transition-transform active:scale-95 text-amber-400 hover:text-amber-300"
                  title={`اضغطي هنا لتقييم ${s} نجوم`}
                >
                  <Star 
                    size={20} 
                    fill={s <= Math.round(avgRating) ? 'currentColor' : 'none'} 
                    className={cn("transition-all cursor-pointer", s <= Math.round(avgRating) && "drop-shadow-neon")}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs text-white/80 font-extrabold font-mono flex items-center gap-1">
              <span>({totalCount})</span>
              <span className="text-white">{avgRating} / 5</span>
            </span>
          </div>
        </div>
        
        <button 
          type="button"
          onClick={() => { setShowForm(!showForm); setSubmitted(false); }}
          className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2.5 rounded-xl hover:bg-emerald-500/20 active:scale-95 transition-all font-arabic"
        >
          {showForm ? "إلغاء التقييم" : "قيّم هذا العمل بالنجوم ★"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3 pt-4 border-t border-white/5 text-right">
          <p className="text-xs text-white/70 mb-2">حددي تقييمكِ بالنجوم لمعطيات ومجهود الدراسة:</p>
          <div className="flex gap-1 justify-end py-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setUserRating(s)}
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-2 text-amber-400 hover:scale-125 transition-transform"
              >
                <Star 
                  size={24} 
                  fill={s <= (hoverRating || userRating) ? 'currentColor' : 'none'} 
                  className="transition-colors duration-150"
                />
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            <input 
              type="text" 
              placeholder="الاسم الكامل أو الصفة الأكاديمية للزائر الكريم..."
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500 text-right font-arabic"
            />
            <textarea 
              placeholder="اكتبي تعقيباً فكرياً أو رأياً إرشادياً نقدياً حول دراسة الفشل الاستشارية (اختياري)..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={4}
              className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500 text-right resize-y font-arabic"
            />
          </div>

          <button 
            type="submit"
            disabled={submitting || userRating === 0}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-xs py-3 rounded-xl transition-all disabled:opacity-40 shadow-lg font-arabic"
          >
            {submitting ? "جاري تسجيل التقييم في الخادم..." : "إرسال التقييم الأكاديمي الحقيقي للزائر"}
          </button>
        </form>
      )}

      {submitted && (
        <p className="text-[10px] text-green-400 text-center mt-3 bg-green-500/10 p-2.5 rounded-xl border border-green-500/20 font-arabic">
          ✓ تم إرسال تقييمك وحفظه في سجلات الدكتورة بنجاح. شكراً لإبداء رأيك الأكاديمي!
        </p>
      )}

      {totalCount > 0 && (
         <div className="text-[8px] text-white/30 text-left mt-2 italic font-mono flex justify-between items-center">
           <span>{totalCount} real verification ratings registered</span>
           <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-emerald-400 inline-block animate-ping" /> Live Connected Data</span>
         </div>
      )}
    </div>
  );
};

const IndiaStartupsInfographics = () => {
  const [activeTab, setActiveTab] = useState<'failures' | 'growth' | 'global' | 'timeline'>('failures');
  const [selectedFailure, setSelectedFailure] = useState<number>(0);
  const [selectedYearIndex, setSelectedYearIndex] = useState<number>(9); // Default to 2025

  // Tab 1: Failures Data
  const failuresData = [
    { percent: 34, title: "عدم ملاءمة المنتج لمتطلبات السوق (Product-Market Fit)", detail: "السبب الأول والأكثر شيوعاً (34%)؛ غياب حاجة حقيقية بالسوق للمنتج أو الخدمة المسردة، أو بناء ميزات لا تخدم الفئة المستهدفة ولا تجتذبها للدفع الفعلي مسبقاً لرعاية النشاط.", color: "#10b981", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
    { percent: 22, title: "مشكلات استراتيجيات التسويق والترويج (Marketing)", detail: "العجز عن استهداف الشرائح الصحيحة تكراراً (22%)، غياب قنوات الاستجابة الموصى بها للوصول المكتمل، وكذا تدني مستوى ولاء المستخدمين للعلامة أو خدمات التوزيع المباشرة.", color: "#ec4899", bg: "bg-pink-500/10", border: "border-pink-500/30" },
    { percent: 18, title: "عيوب وعدم انسجام الفريق الإداري والتقني (Team)", detail: "عجز أطقم القيادة والشركاء المؤسسين عن سد الثغرات المهارية (18%)، حدوث تصادمات داخلية، غياب تماسك الرؤى الإدارية والعملياتية، أو تشتت الالتزام الكامل بالوقت المطلوب للنشاط.", color: "#f87171", bg: "bg-red-500/10", border: "border-red-500/30" },
    { percent: 16, title: "مشاكل التسيير المالي والسيولة (Finance Problems)", detail: "نشوء عوائد سالبة ونفاد السيولة الاستراتيجية بشكل متسارع (16%)، الإسراف وتجاوز معدل الحرق الآمن (Burn Rate) المتوافق وسوء إدارة نفقات التطوير أو غياب سياسة الإيراد الفوري.", color: "#38bdf8", bg: "bg-sky-500/10", border: "border-sky-500/30" },
    { percent: 6, title: "ثغرات وبنائيات تقنية ضعيفة (Technical Problems)", detail: "عيوب فادحة بالهندسة العامة للمنتج التقني (6%)، حدوث خلل برمجي عريض بالحزم الحيوية، أو استخدام بنية رقمية غير مرنة لإدراج التوسعات المستقبلية للمكاسب الخدمية.", color: "#a78bfa", bg: "bg-violet-500/10", border: "border-violet-500/30" },
    { percent: 2, title: "عقبات بالعمليات اللوجستية والإنتاج (Operational)", detail: "بروز مشكلات حيوية في سلاسل التوريد والقدرة على تلبية الطلبات المتواترة (2%)، خاصة في قطاعات التصدير والتصنيع المادي والخدمات غير الرقمية المحضة.", color: "#fbbf24", bg: "bg-amber-500/10", border: "border-amber-500/30" },
    { percent: 2, title: "تعديلات وتعقيدات الرقابة القانونية والتراخيص (Legal)", detail: "عدم الامتثال للتراخيص البلدية والجمركية الرسمية (2%)، أو النزاعات المتعلقة بالملكية الفكرية والتأسيس مع الجهات الرقابية الحكومية مما يشل نمو الشركة نهائياً.", color: "#94a3b8", bg: "bg-slate-500/10", border: "border-slate-500/30" }
  ];

  // Tab 2: Explosive Indian Startup Environment - DPIIT List
  const recognizedData = [
    { year: 2016, count: 471, comment: "انطلاقة المبادرة التاريخية المنسقة Startup India وتدشين التسهيلات." },
    { year: 2017, count: 5704, comment: "بداية تسجيل القفزات ودخول مئات الحاضنات لتوجيه الطلاب والشباب." },
    { year: 2018, count: 14339, comment: "تقنين الإعفاءات الضريبية الشاملة وتجاوز العقبات للأفكار البسيطة." },
    { year: 2019, count: 25618, comment: "توسع استثمارات رأس المال الجريء ونماء البنية التحتية للمدن الكبرى." },
    { year: 2020, count: 40116, comment: "طفرة التطبيقات الرقمية في ذروة تباعد كوفيد وزيادة خدمات الدفع." },
    { year: 2021, count: 60162, comment: "حقبة 'أحاديات القرن' وتدمر أطواق البيروقراطية مع تدفق التمويل الدولي." },
    { year: 2022, count: 86704, comment: "تنويع الاستثمار في الوعي البيئي والذكاء واللوجستيات الرقمية العصرية." },
    { year: 2023, count: 112718, comment: "الهند تحتل المرتبة الثالثة عالميًا في الحجم والنشاط والتمثيل الاقتصادي." },
    { year: 2024, count: 127433, comment: "تمركز التوسع في المدن الناشئة والصغرى لتفادي تشبع الأقطاب الكلية." },
    { year: 2025, count: 159157, comment: "تسجيل رقم تاريخي يفوق الـ 159 ألف فاشل وصامد مدعوم حكومياً بالهند." }
  ];

  const jobsData = [
    { sector: "خدمات البرمجيات وتكنولوجيا المعلومات (IT Services)", count: "2.10 Lakh", num: 210000, percentage: 100, color: "from-emerald-500 to-teal-400" },
    { sector: "الرعاية الصحية والعلوم الحياتية (Healthcare & Lifesciences)", count: "1.51 Lakh", num: 151000, percentage: 72, color: "from-sky-500 to-blue-400" },
    { sector: "الخدمات المهنية والتجارية المتقدمة (Professional Services)", count: "96,474", num: 96474, percentage: 46, color: "from-amber-400 to-amber-600" },
    { sector: "التعليم التكنولوجي والمعرفة (Education)", count: "92,694", num: 92694, percentage: 44, color: "from-rose-500 to-red-400" }
  ];

  // Tab 3: International Success & Failure comparison
  const countriesData = [
    { country: "سويسرا (Switzerland)", fail: 65, success: 35, desc: "البيئة الأقوى مخرجات في صمود الشركات بفعل الدعم الفدرالي للابتكارات الطبية وتدفق الباحثين وتوفير حوكمة تمويلية صارمة." },
    { country: "سنغافورة (Singapore)", fail: 70, success: 30, desc: "تمركز سياسات الباب المفتوح، وتسهيلات التحصيل المالي، وقوانين الإعفاء الآسيوي لتشجيع العبور للتكتلات الاستهلاكية المجاورة." },
    { country: "المملكة المتحدة (UK)", fail: 70, success: 30, desc: "حاضنات لندنية ركيزية في التكنولوجيا المالية FinTech وقوانين ضريبية مرنة تحابي رواد الأعمال العابرين للحدود." },
    { country: "ألمانيا (Germany)", fail: 75, success: 25, desc: "انضباط مهني وصناعي متين، وتركيز كثيف على الهندسة والأبحاث العميقة مع تباطؤ نسبي بتمويل الخدمات السائبة." },
    { country: "إستونيا (Estonia)", fail: 75, success: 25, desc: "النموذج الفريد للإقامة الإلكترونية وإنجاز تأسيس الشركات سحابياً بدقائق، مرونة عالية حدت كثيراً من تكاليف الاندثار." },
    { country: "الولايات المتحدة (USA)", fail: 80, success: 20, desc: "رغم تربعها على قمة الاستثمار وصناديق السيولة، إلا أن حدة المنافسة والصراع على البقاء يرفع معدلات الموت في المهد." },
    { country: "كندا (Canada)", fail: 80, success: 20, desc: "أنظمة تشريعية وتراخيص متينة للغاية غير أن الحجم الديمغرافي الصغير والاستقطاب الأمريكي الشرس للمواهب يعيق التوسع." },
    { country: "فرنسا (France)", fail: 80, success: 20, desc: "مجهود فرنسي رائع بمبادرات التكنولوجيا الفرنسية إلا أن البيروقراطية تظل ترهق كاهل النفقات التشغيلية المبدئية." },
    { country: "أستراليا (Australia)", fail: 75, success: 25, desc: "صمود جيد بدعم سياحي وخدماتي ميسر غير أن المسافات الجغرافية ومشاكل الاستيراد تزيد من حدة أزمات التوسع البري والبحري." },
    { country: "جنوب أفريقيا (South Africa)", fail: 86, success: 14, desc: "تسجل أعلى معدل فشل (86%) بسب تذبذب شبكات الكهرباء، تعقيد تحصيل الاستحقاقات، وضعف آليات الإقراض للشركات الناشئة." }
  ];

  // Tab 4: Concept Timeline data
  const conceptHistory = [
    { period: "1920s", title: "ولادة اللفظ الأولي بالولايات المتحدة", desc: "أشارت المصطلحات الأمريكية الأولى لكلمة 'Startup' للتعبير عن انطلاق الشركات الشابة الطموحة لغزو فجوات مجهولة بالسوق البرية." },
    { period: "1939", title: "مرحلة مرآب HP في بالو ألتو", desc: "تأسيس هوليت-باكارد بمرآب متواضع من قبل ديفيد بيكارد كحجر أساس وموديل تقليدي لأيقونة الابتكار التكنولوجي بسيلكون فالي." },
    { period: "1976", title: "تأسيس Apple وظهور Forbes", desc: "أول استخدام للكلمة بمصطلح ريادي أكاديمي في مجلة فوربس الشهيرة، مقترناً مع بناء ستيف جوبز وجهاز Apple I في مرآب عائلي متواضع." },
    { period: "1994", title: "ثورة الويب وتأسيس Amazon", desc: "تأسيس جيف بيزوس لأمازون كمكتبة رقمية وتدشينه لعصر البيع اللامركزي للكتب والانفجار الأول لتدفق صفقات شبكة الويب العالمية." },
    { period: "1997", title: "مرحلة Google في مرائب مينلو", desc: "صياغة خوارزمية البحث الفريدة وحوكمة صفحات المعرفة العالمية بجهود لاري بيج وسيرجي برين، إعلان رسمي لانبثاق تكنولوجيا البيانات." },
    { period: "2004", title: "حقبة Facebook والمشاريع الاجتماعية", desc: "تدشين فضاء شبكات التواصل، وانضباط النظرة للنمو المضاعف كبديل للاستثمارات الرتيبة وبدايات تطلع الصناديق للاستقطابات الفلكية." }
  ];

  // Helper variables for curve plotting (DPIIT recognized data)
  const svgWidth = 500;
  const svgHeight = 160;
  const paddingX = 40;
  const paddingY = 20;

  // Map data to SVG points
  const points = recognizedData.map((d, index) => {
    const x = paddingX + (index * (svgWidth - paddingX * 2)) / (recognizedData.length - 1);
    // Max count is 159,157, map to height range
    const maxVal = 160000;
    const y = svgHeight - paddingY - (d.count * (svgHeight - paddingY * 2)) / maxVal;
    return { x, y, ...d };
  });

  const activeYear = points[selectedYearIndex];

  return (
    <div className="bg-slate-950/90 border border-emerald-500/20 rounded-[2.5rem] p-6 md:p-8 mt-6 text-right space-y-6 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/5 blur-[80px] rounded-full" />
      
      <div className="border-b border-white/5 pb-4 flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-4">
        <div className="text-right">
          <h4 className="text-lg md:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-100 to-amber-200 font-serif flex items-center justify-end gap-2 flex-row-reverse">
            <span>📊 محاكاة هندسية وبيانات توضيحية مرافقة لدراسة الفشل (2024–2025)</span>
          </h4>
          <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider font-mono">
            Interactive Ecosystem Simulators, Startup Failure Vectors & Job Creation Metrics
          </p>
        </div>
        
        {/* Real Badge */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3.5 py-1.5 text-xs text-emerald-400 font-black font-arabic">
          مستخرج أكاديمي تفاعلي متميز
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="flex flex-wrap justify-end gap-2 border-b border-white/5 pb-3">
        {[
          { key: 'failures', label: 'أسباب الفشل والانهيار' },
          { key: 'growth', label: 'طفرة الهند وخلق الوظائف' },
          { key: 'global', label: 'مقارنة الفشل بين الدول' },
          { key: 'timeline', label: 'التطور التاريخي للاستثمار' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={cn(
              "px-4 py-2.5 rounded-xl text-xs font-black transition-all font-arabic border",
              activeTab === tab.key 
                ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white border-emerald-500 shadow-[0_4px_20px_rgba(16,185,129,0.3)]" 
                : "bg-white/5 text-white/40 border-white/5 hover:bg-white/10 hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content 1: Failures analysis */}
      {activeTab === 'failures' && (
        <div className="space-y-6">
          <p className="text-xs text-white/60 font-arabic leading-relaxed">
            يظهر الإحصاء البياني أدناه أن 34% من الإخفاقات تعزى مباشراً لغياب الملاءمة الفعلية لمتطلبات الزبائن بالسوق الرقمي أو التقليدي، تليها استراتيجيات الترويج والتسويق الهشة. انقري على السبب لمشاهدة التحليل الأكاديمي الوارد بالبحث:
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* SVG Interactive Rings Segment */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-900/50 p-6 rounded-3xl border border-white/5">
              <div className="relative w-44 h-44 flex items-center justify-center">
                {/* SVG Round Donut for representation */}
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  {/* Outer base ring */}
                  <circle cx="50" cy="50" r="40" className="text-white/5" strokeWidth="8" stroke="currentColor" fill="transparent" />
                  
                  {/* We can programmatically stack circles or draw indicator rings */}
                  {failuresData.map((f, i) => {
                    // Accumulate dashoffsets for realistic slices (simplified here as individual concentric rings for ultra-modern pixel perfect UX)
                    const radius = 40 - i * 4.5;
                    const circumference = 2 * Math.PI * radius;
                    const strokeOffset = circumference - (circumference * f.percent) / 100;
                    const isSelected = selectedFailure === i;

                    return (
                      <circle
                        key={i}
                        cx="50"
                        cy="50"
                        r={radius}
                        stroke={f.color}
                        strokeWidth={isSelected ? "3.5" : "2"}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeOffset}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-500 cursor-pointer hover:stroke-white"
                        style={{ opacity: isSelected ? 1 : 0.4 }}
                        onClick={() => setSelectedFailure(i)}
                      />
                    );
                  })}
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-white font-mono">{failuresData[selectedFailure].percent}%</span>
                  <span className="text-[9px] text-white/40 font-arabic uppercase mt-0.5">النسبة الحرجة</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center mt-4">
                {failuresData.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedFailure(i)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-[8px] font-bold font-mono transition-all",
                      selectedFailure === i ? "text-white" : "text-white/30 hover:text-white"
                    )}
                    style={{ backgroundColor: selectedFailure === i ? f.color : "transparent", border: `1px solid ${f.color}30` }}
                  >
                    {f.percent}%
                  </button>
                ))}
              </div>
            </div>

            {/* Selected cause detailed panel */}
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-mono font-black">السبب المالي والتنظيمي المختار</span>
                <h5 className="text-sm font-black text-white font-arabic flex items-center justify-end gap-2">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: failuresData[selectedFailure].color }} />
                  {failuresData[selectedFailure].title}
                </h5>
              </div>

              <div className={cn("p-5 rounded-2xl border transition-all duration-300 font-arabic text-xs leading-relaxed text-white/80", failuresData[selectedFailure].bg, failuresData[selectedFailure].border)}>
                {failuresData[selectedFailure].detail}
              </div>

              {/* Progress Bar Indicators */}
              <div className="space-y-2.5 bg-slate-900 border border-white/5 p-4 rounded-2xl">
                <span className="text-[9px] text-white/40 font-black block font-arabic mb-1">الترتيب التنازلي لمواطن الضعف:</span>
                {failuresData.map((f, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedFailure(i)}
                    className={cn(
                      "flex flex-col gap-1 cursor-pointer transition-all p-1.5 rounded-lg",
                      selectedFailure === i ? "bg-white/5" : "hover:bg-white/5"
                    )}
                  >
                    <div className="flex justify-between text-[10px] flex-row-reverse text-right">
                      <span className={cn("font-arabic transition-colors", selectedFailure === i ? "text-white font-bold" : "text-white/50")}>{f.title.split("(")[0]}</span>
                      <span className="font-mono font-bold" style={{ color: f.color }}>{f.percent}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${f.percent}%`, backgroundColor: f.color, opacity: selectedFailure === i ? 1 : 0.5 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab content 2: India Growth & Job Creation */}
      {activeTab === 'growth' && (
        <div className="space-y-6">
          <p className="text-xs text-white/60 font-arabic leading-relaxed">
            استعرض التقرير السنوي الصادر عن وزارة الصناعة والتجارة الهندية (DPIIT) قفزات مذهلة في أعداد المشاريع المعتمدة حكومياً، متزامناً مع خلق مئات آلاف من الوظائف ذات المهارات العالية.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Exponential Curve */}
            <div className="lg:col-span-6 bg-slate-900/50 p-5 rounded-3xl border border-white/5 space-y-4">
              <div className="flex flex-col sm:flex-row-reverse justify-between items-start sm:items-center gap-2 border-b border-white/5 pb-2">
                <h5 className="text-[11px] font-black text-white font-arabic">📈 تزايد أعداد الشركات الناشئة المعترف بها (2016-2025)</h5>
                <span className="text-[9px] text-amber-300 font-mono">DPIIT India Recognized Curve</span>
              </div>

              {/* Responsive SVG Chart */}
              <div className="relative pt-2">
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full overflow-visible">
                  {/* Grid Lines */}
                  {[0.25, 0.5, 0.75, 1].map((ratio, i) => (
                    <line
                      key={`RatioLine-${i}`}
                      x1={paddingX}
                      y1={svgHeight - paddingY - ratio * (svgHeight - paddingY * 2)}
                      x2={svgWidth - paddingX}
                      y2={svgHeight - paddingY - ratio * (svgHeight - paddingY * 2)}
                      stroke="rgba(255,255,255,0.03)"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Shaded Area underneath the curve */}
                  <path
                    d={`M ${points[0].x} ${svgHeight - paddingY} ` +
                      points.map(p => `L ${p.x} ${p.y}`).join(' ') +
                      ` L ${points[points.length - 1].x} ${svgHeight - paddingY} Z`}
                    fill="url(#emerald-gradient)"
                    opacity="0.15"
                  />

                  {/* Glowing Line Curve */}
                  <path
                    d={points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-[0_2px_8px_rgba(16,185,129,0.5)]"
                  />

                  {/* Interactive Dot Handles */}
                  {points.map((p, idx) => (
                    <circle
                      key={idx}
                      cx={p.x}
                      cy={p.y}
                      r={selectedYearIndex === idx ? "7" : "4"}
                      fill={selectedYearIndex === idx ? "#fbbf24" : "#10b981"}
                      stroke="#020617"
                      strokeWidth="1.5"
                      className="cursor-pointer transition-all hover:r-8"
                      onClick={() => setSelectedYearIndex(idx)}
                    />
                  ))}

                  {/* Gradient definition for filled path */}
                  <defs>
                    <linearGradient id="emerald-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Slider Controller */}
              <div className="space-y-1.5 bg-slate-950 p-3.5 rounded-2xl border border-white/5 text-right">
                <div className="flex justify-between items-center flex-row-reverse mb-1">
                  <span className="text-xs font-black text-yellow-300 font-mono">سنة {activeYear.year}</span>
                  <span className="text-xs text-white/50 font-mono font-bold">العدد: {activeYear.count.toLocaleString('ar-DZ')} شركة</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={recognizedData.length - 1}
                  value={selectedYearIndex}
                  onChange={e => setSelectedYearIndex(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
                />
                <p className="text-[10px] text-white/70 italic font-arabic mt-1.5 text-right">
                  💡 {activeYear.comment}
                </p>
              </div>
            </div>

            {/* Right: Job creation details */}
            <div className="lg:col-span-6 bg-slate-900/50 p-5 rounded-3xl border border-white/5 space-y-4">
              <div className="flex justify-between items-center flex-row-reverse border-b border-white/5 pb-2">
                <h5 className="text-[11px] font-black text-white font-arabic">🏢 القطاعات المتصدرة في خلق فرص العمل بالهند</h5>
                <span className="text-[9px] text-sky-400 font-mono">Top Sectors (Lakh Jobs)</span>
              </div>

              <div className="space-y-4">
                {jobsData.map((job, idx) => (
                  <div key={idx} className="space-y-1.5 text-right">
                    <div className="flex justify-between text-xs flex-row-reverse text-right">
                      <span className="font-arabic font-extrabold text-white/90">{job.sector}</span>
                      <span className="font-mono text-emerald-400 font-black">{job.count} <span className="text-[10px] text-white/30">وظيفة</span></span>
                    </div>
                    {/* Visual Bar representation */}
                    <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-white/5 relative">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${job.percentage}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className={`h-full bg-gradient-to-r ${job.color} rounded-full`}
                      />
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[8px] text-white/50 font-mono">{job.num.toLocaleString('ar-DZ')}</span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-white/30 italic text-center font-arabic pt-2">
                المصدر: إحصاءات ثورة الشركات الناشئة بالهند (وزارة التجارة والهند الرقمية 2025)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab content 3: Global Comparison of Failure/Success */}
      {activeTab === 'global' && (
        <div className="space-y-6">
          <p className="text-xs text-white/60 font-arabic leading-relaxed text-right">
            تتفاوت نسب صمود ومقاومة الشركات الناشئة تبعاً لقوة النظام القانوني، والسياسات الجبائية التفضيلية وحيوية صناديق رأس المال الجريء في كل اقليم جزيئي:
          </p>

          <div className="bg-slate-900/50 p-5 rounded-3xl border border-white/5 space-y-4">
            <div className="flex justify-between items-center flex-row-reverse border-b border-white/5 pb-2">
              <h5 className="text-[11px] font-black text-white font-arabic">🌍 قائمة مقارنة معدلات فشل وصمود المشاريع بالدول الكبرى</h5>
              <span className="text-[9px] text-emerald-400 font-mono">Global Success vs Failure Benchmarks</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {countriesData.map((cd, index) => (
                <div key={index} className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 text-right space-y-2 group hover:border-emerald-500/20 transition-all">
                  <div className="flex justify-between items-center flex-row-reverse">
                    <span className="text-xs font-black text-white font-arabic">{cd.country}</span>
                    <div className="flex gap-2">
                      <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-md font-mono">فشل {cd.fail}%</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-mono">نجاح {cd.success}%</span>
                    </div>
                  </div>
                  {/* Small Bar visual */}
                  <div className="w-full bg-red-500/20 h-2 rounded-full overflow-hidden flex flex-row-reverse">
                    <div className="h-full bg-emerald-500" style={{ width: `${cd.success}%` }} />
                    <div className="h-full bg-red-500" style={{ width: `${cd.fail}%` }} />
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed font-arabic block pt-1 group-hover:text-white/70 transition-colors">
                    {cd.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab content 4: Concept History Tracing */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <p className="text-xs text-white/60 font-arabic leading-relaxed">
            استقراء تاريخي متميز لمفاهيم الشركات الناشئة، وتجلياتها من مجرد فكرة بسيطة في الكراجات الأهلية الأمريكية إلى تكتلات استثمارية تحكم مصائر الاقتصاد الرقمي المعرفي:
          </p>

          <div className="relative border-r-2 border-emerald-500/20 mr-4 space-y-6 pr-6 text-right">
            {conceptHistory.map((ch, idx) => (
              <div key={idx} className="relative group text-right">
                {/* Visual Circle Indicator */}
                <span className="absolute -right-[31px] top-1 w-4 h-4 rounded-full bg-slate-950 border-2 border-emerald-500 flex items-center justify-center group-hover:bg-emerald-400 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </span>
                
                <div className="bg-slate-900/50 hover:bg-slate-900 border border-white/5 p-4 rounded-2xl space-y-1.5 transition-all">
                  <div className="flex items-center justify-between flex-row-reverse">
                    <span className="text-emerald-400 font-mono text-xs font-black">{ch.period}</span>
                    <h5 className="text-xs font-black text-white font-arabic">{ch.title}</h5>
                  </div>
                  <p className="text-[10px] text-white/50 leading-relaxed font-arabic pr-1 group-hover:text-white/80">
                    {ch.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SaharaTourismInfographics = () => {
  const [selectedPoint, setSelectedPoint] = useState<number>(3); // Default to 2026

  const dataPoints = [
    { year: 2020, tourists: 15, ecological: 82, jobs: 340, ecoLodges: 4 },
    { year: 2022, tourists: 34, ecological: 86, jobs: 620, ecoLodges: 7 },
    { year: 2024, tourists: 58, ecological: 90, jobs: 1200, ecoLodges: 12 },
    { year: 2026, tourists: 76, ecological: 93, jobs: 1850, ecoLodges: 19 },
    { year: 2028, tourists: 89, ecological: 95, jobs: 2400, ecoLodges: 24 },
    { year: 2030, tourists: 98, ecological: 98, jobs: 3100, ecoLodges: 32 }
  ];

  const activeData = dataPoints[selectedPoint];

  return (
    <div className="bg-slate-950/80 border border-emerald-500/20 rounded-3xl p-6 mt-6 text-right space-y-6 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full" />
      <div className="border-b border-white/5 pb-3">
        <h4 className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-400 font-serif flex items-center justify-end gap-2 flex-row-reverse">
          <span>📊 نموذج المحاكاة والمنحنيات البيانية المرفقة بالأطروحة (الصحراء الجزائرية 2020-2030)</span>
        </h4>
        <p className="text-[9px] text-white/40 mt-1 uppercase tracking-wider font-mono">
          Saharan Eco-Tourism Simulation, Multivariable Curves & Oasis Preservation Projections
        </p>
      </div>

      {/* Progress Circles */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="38" className="text-white/5" strokeWidth="6" stroke="currentColor" fill="transparent" />
              <circle cx="48" cy="48" r="38" className="text-emerald-500" strokeWidth="6" strokeDasharray="239" strokeDashoffset="19" strokeLinecap="round" stroke="currentColor" fill="transparent" />
            </svg>
            <span className="absolute text-base font-black text-white font-mono">92%</span>
          </div>
          <p className="text-[11px] font-bold text-emerald-400 mt-2 font-arabic">مؤشر جودة الاستدامة الإيكولوجية</p>
          <p className="text-[8px] text-white/40 mt-0.5 font-arabic">حماية التنوع الحيوي ومجاري الواحات ومصادر المياه</p>
        </div>

        <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="38" className="text-white/5" strokeWidth="6" stroke="currentColor" fill="transparent" />
              <circle cx="48" cy="48" r="38" className="text-amber-500" strokeWidth="6" strokeDasharray="239" strokeDashoffset="36" strokeLinecap="round" stroke="currentColor" fill="transparent" />
            </svg>
            <span className="absolute text-base font-black text-white font-mono">85%</span>
          </div>
          <p className="text-[11px] font-bold text-amber-400 mt-2 font-arabic">معدل إدماج المجتمعات الساكنة محلياً</p>
          <p className="text-[8px] text-white/40 mt-0.5 font-arabic">التوظيف المباشر، الصناعات الحرفية، الخدمات والإرشاد كعوائد ملموسة</p>
        </div>
      </div>

      {/* Multivariable Curved Chart - Custom SVG */}
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 space-y-4">
        <div className="flex flex-col sm:flex-row-reverse justify-between items-start sm:items-center gap-2">
          <h5 className="text-xs font-black text-white font-arabic">📈 المنحنى البياني التفاعلي: تفوق سياسات التنمية المسؤولة</h5>
          <div className="flex gap-4 text-[9px] font-mono text-white/50">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-amber-500 inline-block" /> تدفق السياح</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-emerald-400 border-t border-dashed inline-block" /> مؤشر المحافظة</span>
          </div>
        </div>

        <div className="relative pt-2">
          {/* Custom Responsive SVG Chart Stage */}
          <svg viewBox="0 0 500 150" className="w-full overflow-visible">
            {/* Grid Lines */}
            <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <line x1="0" y1="10" x2="500" y2="10" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

            {/* CURVE A: Tourist Flow (Amber Line) */}
            <path
              d="M 0 110 C 100 110, 100 95, 100 95 C 150 95, 150 70, 200 70 C 250 70, 250 50, 300 50 C 350 50, 350 35, 400 35 C 450 35, 450 20, 500 20"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* CURVE B: Ecological Preservation Index (Emerald Dashed/Dot Line) */}
            <path
              d="M 0 60 C 100 60, 100 55, 100 55 C 150 55, 150 48, 200 48 C 250 48, 250 35, 300 35 C 350 35, 350 22, 400 22 C 450 22, 450 15, 500 15"
              fill="none"
              stroke="#34d399"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* YEAR Interactive Selection Verticals & Interactive Dots */}
            {dataPoints.map((dp, idx) => {
              const x = (idx * 500) / 5;
              const yTourists = 110 - ((dp.tourists - 15) * 90) / 83;
              const yEco = 60 - ((dp.ecological - 82) * 45) / 16;
              const isSelected = selectedPoint === idx;

              return (
                <g key={dp.year} onClick={() => setSelectedPoint(idx)} className="cursor-pointer group/node">
                  <line
                    x1={x}
                    y1="10"
                    x2={x}
                    y2="130"
                    stroke={isSelected ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.03)"}
                    strokeWidth={isSelected ? "1.5" : "1"}
                    className="group-hover/node:stroke-white/10 transition-colors"
                  />

                  <circle
                    cx={x}
                    cy={yTourists}
                    r={isSelected ? 6 : 4}
                    fill="#1e293b"
                    stroke="#f59e0b"
                    strokeWidth={isSelected ? 3 : 1.5}
                    className="hover:scale-150 transition-transform shadow-lg"
                  />

                  <circle
                    cx={x}
                    cy={yEco}
                    r={isSelected ? 6 : 4}
                    fill="#1e293b"
                    stroke="#34d399"
                    strokeWidth={isSelected ? 3 : 1.5}
                    className="hover:scale-150 transition-transform shadow-lg"
                  />

                  <text
                    x={x}
                    y="142"
                    textAnchor="middle"
                    fill={isSelected ? "#34d399" : "rgba(255,255,255,0.3)"}
                    className="text-[9px] font-mono font-black select-none"
                  >
                    {dp.year}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Data Point Tooltip/Detail Indicator Card */}
        <div className="bg-slate-950 border border-emerald-500/10 p-4 rounded-xl flex items-center justify-between flex-row-reverse gap-4">
          <div className="text-right">
            <span className="text-[9px] text-[#00f3ff] bg-[#00f3ff]/10 border border-[#00f3ff]/20 px-2 py-0.5 rounded-md font-mono font-bold">
              النمذجة المحاكية للتوقع: {activeData.year}
            </span>
            <h6 className="text-[11px] text-white/50 mt-1.5 font-arabic">
              النتائج الاستشرافية التراكمية في نطاق الصحراء الجزائرية:
            </h6>
          </div>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <span className="text-[9px] text-white/30 block font-arabic">فرص شغل محلية</span>
              <span className="text-xs text-emerald-400 font-extrabold font-mono">{activeData.jobs} وظيفة</span>
            </div>
            <div>
              <span className="text-[9px] text-white/30 block font-arabic">مؤشر الإقبال السياحي</span>
              <span className="text-xs text-amber-400 font-extrabold font-mono">{activeData.tourists}%</span>
            </div>
            <div>
              <span className="text-[9px] text-white/30 block font-arabic">الفنادق البيئية النشطة</span>
              <span className="text-xs text-sky-400 font-extrabold font-mono">{activeData.ecoLodges} نُزل</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArticleCard = ({ article, currentUser, onEdit, onShowToast }: { article: any, currentUser: any, onEdit?: (article: any) => void, onShowToast?: (msg: string, type?: 'success' | 'error') => void }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAbstractOpen, setIsAbstractOpen] = useState(false);
  const [selectedPaperChapter, setSelectedPaperChapter] = useState<string>("intro");
  const [readingFontSize, setReadingFontSize] = useState<number>(16); // Legible 16px default
  const [isFullscreenReader, setIsFullscreenReader] = useState<boolean>(false);
  const [readingBgTheme, setReadingBgTheme] = useState<'slate' | 'sepia' | 'obsidian'>('slate');
  
  // Translation support cardLang
  const { lang: globalLang } = useContext(ThemeContext);
  const [cardLang, setCardLang] = useState<'ar' | 'en' | 'fr'>('ar');
  const [activeLang, setActiveLang] = useState<'ar' | 'en' | 'fr'>('ar');

  useEffect(() => {
    if (globalLang === 'ar' || globalLang === 'en' || globalLang === 'fr') {
      setCardLang(globalLang as any);
      setActiveLang(globalLang as any);
    }
    if (localStorage.getItem('liked_' + article.id)) {
      setIsLiked(true);
    }
  }, [globalLang, article.id]);

  const isAdmin = isAdminEmail(currentUser?.email);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (localStorage.getItem('liked_' + article.id)) {
      onShowToast?.('لقد سجلتِ إعجابكِ مسبقاً / Already liked', 'success');
      return;
    }
    try {
      const docRef = doc(db, 'articles', article.id);
      await setDoc(docRef, { 
        title: article.title || '',
        likes: (article.likes || 0) + 1 
      }, { merge: true });
      setIsLiked(true);
      localStorage.setItem('liked_' + article.id, 'true');
      onShowToast?.('✓ شكراً لإبداء الإعجاب بالمنهجية الفكرية!', 'success');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      const articleRef = doc(db, 'articles', article.id);
      await deleteDoc(articleRef);
      alert('تم حذف المنشور بنجاح');
      onShowToast?.('تم حذف المنشور بنجاح');
    } catch (err) {
      console.error('Delete error detailed:', err);
      onShowToast?.('فشل الحذف', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownloadWord = () => {
    try {
      const contentText = article.content || article.abstract || '';
      const header = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>${article.title}</title>
        <style>
          body { font-family: 'Arial', sans-serif; direction: rtl; text-align: right; }
          h1 { color: #059669; margin-bottom: 20px; }
          .content { line-height: 1.6; }
        </style>
        </head><body>
      `;
      const footer = "</body></html>";
      const sourceHTML = header + `<h1>${article.title}</h1><div class="content">${contentText}</div>` + footer;
      
      const blob = new Blob(['\ufeff', sourceHTML], {
        type: 'application/msword'
      });
      
      saveAs(blob, `${article.title.replace(/\s+/g, '_')}.doc`);
      onShowToast?.('تم تحميل المقال بصيغة Word بنجاح');
    } catch (err) {
      console.error('Word export error:', err);
      onShowToast?.('فشل تحميل Word', 'error');
    }
  };

  const highlightAuthors = (authorsText: string) => {
    const text = authorsText || "عيايشية زعرة . قادة قدور بن عباد .";
    const words = text.split(/(\s*\.\s*|\s*;\s*)/);
    return (
      <div className="flex flex-wrap items-center justify-start gap-1 flex-row-reverse text-right mb-4">
        {words.map((w, index) => {
          const trimmed = w.trim();
          if (trimmed === '.' || trimmed === ';') {
            return <span key={index} className="text-white/20 mx-1">•</span>;
          }
          if (!trimmed) return null;
          const isDr = trimmed.includes("عيايشية") || trimmed.includes("زعرة") || trimmed.includes("Zaara") || trimmed.includes("Ayaichia");
          if (isDr) {
            return (
              <span key={index} className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-emerald-400 font-extrabold text-xs px-2.5 py-1 rounded-xl bg-amber-500/10 border border-yellow-500/20 shadow-neon inline-flex items-center gap-1">
                ★ {trimmed}
              </span>
            );
          }
          return (
            <span key={index} className="text-white/60 text-[11px] font-semibold">
              {trimmed}
            </span>
          );
        })}
      </div>
    );
  };

  const dateStr = article.date || (article.createdAt?.toDate ? article.createdAt.toDate().toLocaleDateString('ar-DZ') : new Date().toLocaleDateString('ar-DZ'));
  
  const contentAr = article.content || article.abstract;
  const contentEn = article.abstractEn;
  const contentFr = article.abstractFr;

  // Auto-select lang strings if default is empty
  useEffect(() => {
    if (!contentAr && contentEn) {
      setActiveLang('en');
    } else if (!contentAr && contentFr) {
      setActiveLang('fr');
    }
  }, [contentAr, contentEn, contentFr]);

  // Handle translated content fields based on toggle
  const displayTitle = cardLang === 'ar' ? article.title : (cardLang === 'en' ? (article.titleEn || article.title) : (article.titleFr || article.titleEn || article.title));
  
  const displayExcerpt = cardLang === 'ar'
    ? (article.excerpt || article.content?.substring(0, 180) + '...')
    : (cardLang === 'en'
       ? (article.excerptEn || article.abstractEn?.substring(0, 240) + '...' || article.abstract?.substring(0, 240) + '...')
       : (article.excerptFr || article.abstractFr?.substring(0, 240) + '...' || article.abstractEn?.substring(0, 240) + '...' || article.abstract?.substring(0, 240) + '...'));

  const displayAuthors = (cardLang === 'en' || cardLang === 'fr') && article.authorsEn ? article.authorsEn : article.authors;
  const displayCategory = cardLang === 'ar' ? article.category : (cardLang === 'en' ? (article.categoryEn || article.category) : (article.categoryFr || article.categoryEn || article.category));

  return (
    <motion.div 
      layout
      id={`article-content-${article.id}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden group hover:border-emerald-500/30 hover:bg-slate-900/60 transition-all flex flex-col h-full shadow-2xl relative"
    >
      {article.imageUrl && (
        <div className="h-64 overflow-hidden relative">
          <img src={article.imageUrl} alt={displayTitle} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
          <div className="absolute bottom-4 right-4 bg-emerald-600/90 border border-emerald-400/20 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg font-arabic">
            {displayCategory}
          </div>
        </div>
      )}
      
      <div className="p-10 text-right flex-1 flex flex-col relative justify-between">
        {isAdmin && (
          <div className="absolute top-6 left-6 flex gap-2 z-20">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit?.(article); }}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:bg-emerald-500 hover:text-white transition-all shadow-xl"
              title="تعديل"
            >
              <Settings size={16} />
            </button>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:bg-red-500 hover:text-white transition-all shadow-xl disabled:opacity-50"
              title="حذف"
            >
              {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            </button>
          </div>
        )}
        
        <div>
          {/* Card translation bar */}
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
            <span className="text-[9px] text-white/30 uppercase tracking-wider font-mono">🌍 Translation / الترجمة المقالية</span>
            <div className="flex gap-1.5">
              {[
                { key: 'ar', label: 'العربية' },
                { key: 'en', label: 'EN' },
                { key: 'fr', label: 'FR' }
              ].map((langObj) => (
                <button
                  type="button"
                  key={langObj.key}
                  onClick={() => setCardLang(langObj.key as any)}
                  className={cn(
                    "text-[9px] font-extrabold px-2.5 py-1 rounded-lg border transition-all",
                    cardLang === langObj.key 
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm" 
                      : "text-white/40 hover:text-white bg-slate-950 border-white/5"
                  )}
                >
                  {langObj.label}
                </button>
              ))}
            </div>
          </div>

          {/* Glowing Premium Date Badge */}
          <div className="flex items-center justify-end mb-6">
            <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 border border-emerald-500/30 rounded-2xl text-[#00f3ff] text-xs font-mono font-black shadow-lg shadow-emerald-500/5 relative group/date">
              <span className="w-2 h-2 rounded-full bg-[#00f3ff] animate-pulse" />
              <span>{dateStr}</span>
            </div>
          </div>

          {/* Large Title with Gradient Color */}
          <h3 className="text-2xl md:text-3xl font-serif text-white font-black mb-4 leading-snug text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-100 to-teal-300 group-hover:from-white group-hover:to-emerald-400 transition-all duration-500 text-right drop-shadow-md">
            {displayTitle}
          </h3>

          {/* Elegant Doctor / Authors Line */}
          {highlightAuthors(displayAuthors)}

          {/* Excerpt / Summary */}
          <p className={cn(
            "text-white/60 text-sm mb-6 leading-relaxed line-clamp-4",
            cardLang === 'ar' ? "font-arabic text-right text-[13px]" : "font-sans text-left text-[12px] tracking-wide"
          )}>
            {displayExcerpt}
          </p>

          {/* Keywords Badges */}
          {article.keywords && article.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-end mb-6">
              {article.keywords.map((kw: string, i: number) => (
                <span key={i} className="text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 px-2.5 py-1 rounded-lg">
                  #{kw}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Collapsible Abstract Panel */}
        <div className="mt-4 border-t border-white/5 pt-6 space-y-4">
          <button 
            onClick={() => setIsAbstractOpen(!isAbstractOpen)}
            className="w-full flex items-center justify-between bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 border border-white/10 px-5 py-3.5 rounded-2xl text-white font-black text-xs transition-all duration-300 shadow-md group/btn"
          >
            <div className="flex items-center gap-2 text-emerald-400 group-hover/btn:text-emerald-300">
              <BookOpen size={16} />
              <span>{isAbstractOpen ? "إخفاء ملخص الدراسة / Hide Summary" : "قراءة الملخص والبحث / Read Abstract"}</span>
            </div>
            <motion.span animate={{ rotate: isAbstractOpen ? 180 : 0 }} className="text-[10px] text-white/40">
              ▼
            </motion.span>
          </button>

          <AnimatePresence>
            {isAbstractOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden bg-slate-950/70 rounded-2xl border border-white/5 mt-3"
              >
                <div className="p-6 space-y-5">
                  {/* Language Switching Tabs */}
                  <div className="flex gap-2 justify-end border-b border-white/5 pb-3">
                    {contentAr && (
                      <button 
                        onClick={() => setActiveLang('ar')}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                          activeLang === 'ar' ? "bg-emerald-500 text-slate-950 shadow-md" : "text-white/40 bg-white/5 hover:text-white"
                        )}
                      >
                        العربية
                      </button>
                    )}
                    {contentEn && (
                      <button 
                        onClick={() => setActiveLang('en')}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                          activeLang === 'en' ? "bg-emerald-500 text-slate-950 shadow-md" : "text-white/40 bg-white/5 hover:text-white"
                        )}
                      >
                        English
                      </button>
                    )}
                    {contentFr && (
                      <button 
                        onClick={() => setActiveLang('fr')}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                          activeLang === 'fr' ? "bg-emerald-500 text-slate-950 shadow-md" : "text-white/40 bg-white/5 hover:text-white"
                        )}
                      >
                        Français
                      </button>
                    )}
                  </div>

                  {/* Body textual content */}
                  <div className="text-right whitespace-pre-line text-sm leading-relaxed text-white/80 font-arabic">
                    {activeLang === 'ar' && (
                      <p dir="rtl" className="text-right leading-relaxed text-[13px] text-emerald-100/90 bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10">
                        {contentAr}
                      </p>
                    )}
                    {activeLang === 'en' && (
                      <p dir="ltr" className="text-left font-sans leading-relaxed text-[13px] text-emerald-100/90 bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10">
                        {contentEn}
                      </p>
                    )}
                    {activeLang === 'fr' && (
                      <p dir="ltr" className="text-left font-sans leading-relaxed text-[13px] text-emerald-100/90 bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10">
                        {contentFr}
                      </p>
                    )}
                  </div>

                  {/* If item is the Indian Startups study, show PDF infographics */}
                  {article.id === 'pub-6' && (
                    <IndiaStartupsInfographics />
                  )}

                  {/* If item is the Algerian Sahara dissertation, show Sahara infographics */}
                  {article.id === 'pub-7' && (
                    <SaharaTourismInfographics />
                  )}

                  {/* Dynamic Unabridged Document Reader for Detailed Chapters */}
                  {(() => {
                    const fullPaper = fullPapers[article.id];
                    if (!fullPaper) return null;
                    const activeCh = fullPaper.chapters.find(c => c.id === selectedPaperChapter) || fullPaper.chapters[0];

                    const themeClasses = readingBgTheme === 'sepia' 
                      ? "bg-[#251c14] border-amber-900/20 text-[#edd8c4]" 
                      : readingBgTheme === 'obsidian' 
                      ? "bg-black/90 border-neutral-800 text-neutral-100" 
                      : "bg-slate-900/40 border-white/5 text-white/90";

                    return (
                      <div className="border-t border-white/5 pt-6 mt-6 space-y-4">
                        <div className="flex flex-col sm:flex-row-reverse sm:items-center justify-between gap-4">
                          <div className="flex items-center justify-end gap-2 text-right">
                            <h4 className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 font-serif font-arabic">
                              📙 الفصول والأقسام المفصلة للبحث العلمي الأكاديمي (دون اختصار)
                            </h4>
                          </div>

                          {/* Quick Controls above viewport */}
                          <div className="flex items-center gap-3 justify-end flex-wrap">
                            {/* Font Zoom */}
                            <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/5 text-xs text-white font-mono">
                              <button
                                type="button"
                                onClick={() => setReadingFontSize(prev => Math.max(12, prev - 2))}
                                className="p-1.5 px-2.5 hover:bg-white/10 rounded-lg text-[10px] flex items-center gap-1 font-bold text-white/60 hover:text-white"
                                title="تصغير الخط / Zoom Out"
                              >
                                <ZoomOut size={12} />
                              </button>
                              <span className="px-1 text-[10px] text-emerald-400 font-extrabold">{readingFontSize}px</span>
                              <button
                                type="button"
                                onClick={() => setReadingFontSize(prev => Math.min(28, prev + 2))}
                                className="p-1.5 px-2.5 hover:bg-white/10 rounded-lg text-[10px] flex items-center gap-1 font-bold text-white/60 hover:text-white"
                                title="تكبير الخط / Zoom In"
                              >
                                <ZoomIn size={12} />
                              </button>
                            </div>

                            {/* Background Theme Switcher */}
                            <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/5">
                              <button
                                type="button"
                                onClick={() => setReadingBgTheme('slate')}
                                className={cn(
                                  "px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all font-arabic", 
                                  readingBgTheme === 'slate' ? "bg-emerald-500 text-slate-950" : "text-white/40 hover:text-white"
                                )}
                              >
                                داكن
                              </button>
                              <button
                                type="button"
                                onClick={() => setReadingBgTheme('sepia')}
                                className={cn(
                                  "px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all font-arabic", 
                                  readingBgTheme === 'sepia' ? "bg-amber-600/95 text-white font-extrabold shadow-[0_2px_8px_rgba(217,119,6,0.2)]" : "text-white/40 hover:text-white"
                                )}
                              >
                                سيبيا مريحة
                              </button>
                              <button
                                type="button"
                                onClick={() => setReadingBgTheme('obsidian')}
                                className={cn(
                                  "px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all font-arabic", 
                                  readingBgTheme === 'obsidian' ? "bg-white text-black font-extrabold" : "text-white/40 hover:text-white"
                                )}
                              >
                                فحمى
                              </button>
                            </div>

                            {/* Wide / Full Screen toggle */}
                            <button
                              type="button"
                              onClick={() => setIsFullscreenReader(true)}
                              className="p-1.5 px-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl text-emerald-400 transition-all font-arabic text-[10px] font-bold flex items-center gap-1.5 border border-emerald-500/20"
                              title="ملء الشاشة للقراءة المريحة"
                            >
                              <Maximize2 size={12} />
                              <span>توسيع القراءة 🖵</span>
                            </button>
                          </div>
                        </div>

                        <p className="text-[11px] text-white/40 font-arabic text-right mb-4">
                          انقري على الفهرس الجانبي أدناه أو اضغطي على زر "توسيع القراءة" لملء الشاشة واستعراض الفصول بوضوح تام مناسب للعين دون تعب:
                        </p>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                          {/* Right side: Chapters index list */}
                          <div className="lg:col-span-4 flex flex-col gap-2 order-first lg:order-last">
                            {fullPaper.chapters.map((ch) => {
                              const isSelected = selectedPaperChapter === ch.id;
                              const titleStr = activeLang === 'ar' ? ch.titleAr : ch.titleEn;
                              return (
                                <button
                                  key={ch.id}
                                  onClick={() => setSelectedPaperChapter(ch.id)}
                                  className={cn(
                                    "text-right p-3.5 rounded-xl text-xs font-bold transition-all border font-arabic flex flex-row-reverse items-center justify-between gap-2.5",
                                    isSelected
                                      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 font-black shadow-[0_4px_12px_rgba(16,185,129,0.15)]"
                                      : "bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:text-white"
                                  )}
                                >
                                  <span className={cn(
                                    "w-1.5 h-1.5 rounded-full flex-shrink-0",
                                    isSelected ? "bg-emerald-400 animate-pulse" : "bg-white/20"
                                  )} />
                                  <span className="flex-1 truncate">{titleStr}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Left side: Detailed reading viewport */}
                          <div className={cn(
                            "lg:col-span-8 border rounded-2xl p-5 md:p-6 text-right relative min-h-[300px] shadow-inner transition-colors duration-500",
                            themeClasses
                          )}>
                            <div className="absolute top-3 left-4 text-[8px] uppercase tracking-wider text-emerald-400/30 font-mono">
                              LARAFIT LAB • SYSTEMIC RESEARCH ENGINE
                            </div>
                            
                            {activeCh && (
                              <div className="space-y-4">
                                <h5 className={cn(
                                  "text-xs font-black border-b border-white/5 pb-2.5",
                                  readingBgTheme === 'sepia' ? "text-amber-400 border-amber-900/10" : "text-emerald-400",
                                  activeLang === 'ar' ? "text-right font-arabic" : "text-left font-sans text-[11px]"
                                )}>
                                  {activeLang === 'ar' ? activeCh.titleAr : activeCh.titleEn}
                                </h5>
                                <p
                                  dir={activeLang === 'ar' ? "rtl" : "ltr"}
                                  style={{ fontSize: `${readingFontSize}px`, lineHeight: '1.8' }}
                                  className={cn(
                                    "whitespace-pre-line tracking-wide font-medium",
                                    activeLang === 'ar' ? "font-arabic text-right leading-relaxed" : "font-sans text-left leading-relaxed"
                                  )}
                                >
                                  {activeLang === 'ar' ? activeCh.contentAr : activeCh.contentEn}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* --- Immersive Full Screen Reader Modal --- */}
                        <AnimatePresence>
                          {isFullscreenReader && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 backdrop-blur-md p-3 sm:p-4 md:p-8"
                            >
                              <motion.div 
                                initial={{ y: 50, scale: 0.95 }}
                                animate={{ y: 0, scale: 1 }}
                                exit={{ y: 50, scale: 0.95 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 180 }}
                                className={cn(
                                  "w-full max-w-6xl h-[92vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-colors duration-500",
                                  themeClasses
                                )}
                              >
                                {/* Header of Modal */}
                                <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/5 bg-black/30">
                                  {/* Close button on left */}
                                  <button
                                    type="button"
                                    onClick={() => setIsFullscreenReader(false)}
                                    className="p-2 px-3.5 rounded-xl text-xs font-bold text-white/50 bg-white/5 border border-white/10 hover:text-white hover:bg-white/10 transition-all font-arabic flex items-center gap-2"
                                  >
                                    <X size={15} />
                                    <span>إغلاق القارئ</span>
                                  </button>

                                  {/* Right side title and active state indicator */}
                                  <div className="text-right">
                                    <h3 className="text-sm font-black text-emerald-400 font-arabic flex items-center gap-2 justify-end">
                                      <span>وضعية القراءة الأكاديمية الموسعة (دون تشويش)</span>
                                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    </h3>
                                    <p className="text-[10px] text-white/40 font-arabic mt-0.5 truncate max-w-[280px] sm:max-w-none">
                                      أطروحة: {activeLang === 'ar' ? article.title : article.titleEn}
                                    </p>
                                  </div>
                                </div>

                                {/* Modal content split into standard reading and layout index selection */}
                                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-full">
                                  
                                  {/* Lefthand side panel: Complete Chapters Index (Scrollable) */}
                                  <div className="lg:col-span-3 border-r lg:border-r-0 lg:border-l border-white/5 bg-black/30 p-4 overflow-y-auto flex flex-col gap-2">
                                    <p className="text-[10px] text-emerald-400/60 font-bold uppercase tracking-wider text-right mb-2 font-arabic">
                                      فهرس الأقسام والفصول المكتملة / Chapters
                                    </p>
                                    {fullPaper.chapters.map((ch) => {
                                      const isSelected = selectedPaperChapter === ch.id;
                                      const titleStr = activeLang === 'ar' ? ch.titleAr : ch.titleEn;
                                      return (
                                        <button
                                          key={ch.id}
                                          type="button"
                                          onClick={() => setSelectedPaperChapter(ch.id)}
                                          className={cn(
                                            "text-right p-3 rounded-xl text-xs font-bold transition-all border font-arabic flex flex-row-reverse items-center justify-between gap-2.5",
                                            isSelected
                                              ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-black shadow-[0_4px_12px_rgba(16,185,129,0.15)]"
                                              : "bg-white/5 text-white/45 border-white/5 hover:bg-white/10 hover:text-white"
                                          )}
                                        >
                                          <span className={cn(
                                            "w-1.5 h-1.5 rounded-full flex-shrink-0",
                                            isSelected ? "bg-emerald-400 animate-pulse" : "bg-white/20"
                                          )} />
                                          <span className="flex-1 truncate">{titleStr}</span>
                                        </button>
                                      );
                                    })}
                                  </div>

                                  {/* Righthand side panel: Immersive custom scroll reading viewport */}
                                  <div className="lg:col-span-9 p-4 sm:p-6 md:p-10 overflow-y-auto space-y-6 flex-1 text-right custom-scrollbar relative flex flex-col">
                                    {/* Inline Settings within full screen modal */}
                                    <div className="sticky top-0 z-30 flex items-center justify-between bg-black/40 backdrop-blur-md -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 p-3 sm:p-4 border-b border-white/10 mb-6">
                                      
                                      {/* Controls inside full reader */}
                                      <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/5 text-slate-200 font-mono">
                                          <button
                                            type="button"
                                            onClick={() => setReadingFontSize(prev => Math.max(12, prev - 2))}
                                            className="p-1 px-3 hover:bg-white/10 rounded-lg text-xs font-bold text-white/70 hover:text-white"
                                          >
                                            -A
                                          </button>
                                          <span className="px-2 text-xs font-extrabold text-emerald-400">{readingFontSize}px</span>
                                          <button
                                            type="button"
                                            onClick={() => setReadingFontSize(prev => Math.min(32, prev + 2))}
                                            className="p-1 px-3 hover:bg-white/10 rounded-lg text-xs font-bold text-white/70 hover:text-white"
                                          >
                                            +A
                                          </button>
                                        </div>

                                        <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/5 shadow-inner">
                                          <button
                                            type="button"
                                            onClick={() => setReadingBgTheme('slate')}
                                            className={cn("px-2.5 py-1 rounded-lg text-[10px] font-bold font-arabic transition-all", readingBgTheme === 'slate' ? "bg-emerald-500 text-slate-950" : "text-white/40 hover:text-white")}
                                          >
                                            داكن
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setReadingBgTheme('sepia')}
                                            className={cn("px-2.5 py-1 rounded-lg text-[10px] font-bold font-arabic transition-all", readingBgTheme === 'sepia' ? "bg-amber-600 text-white font-extrabold" : "text-white/40 hover:text-white")}
                                          >
                                            سيبيا
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setReadingBgTheme('obsidian')}
                                            className={cn("px-2.5 py-1 rounded-lg text-[10px] font-bold font-arabic transition-all", readingBgTheme === 'obsidian' ? "bg-white text-black font-extrabold" : "text-white/40 hover:text-white")}
                                          >
                                            فحمى
                                          </button>
                                        </div>
                                      </div>

                                      <div className="text-right text-[10px] text-white/40 font-arabic flex items-center gap-2">
                                        <span>حجم مريح: {readingFontSize}px (قابل للتعديل)</span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                                      </div>
                                    </div>

                                    {activeCh && (
                                      <article className="max-w-5xl mx-auto space-y-6 flex-1">
                                        <h2 className={cn(
                                          "text-lg sm:text-xl md:text-2xl font-black border-b border-white/5 pb-4",
                                          readingBgTheme === 'sepia' ? "text-amber-400 border-amber-900/10 font-arabic" : "text-emerald-400 font-arabic",
                                          activeLang === 'ar' ? "text-right" : "text-left font-sans"
                                        )}>
                                          {activeLang === 'ar' ? activeCh.titleAr : activeCh.titleEn}
                                        </h2>
                                        
                                        <p
                                          dir={activeLang === 'ar' ? "rtl" : "ltr"}
                                          style={{ fontSize: `${readingFontSize}px`, lineHeight: '1.9' }}
                                          className={cn(
                                            "whitespace-pre-line tracking-wide font-medium leading-loose",
                                            activeLang === 'ar' ? "text-right font-arabic" : "text-left font-sans"
                                          )}
                                        >
                                          {activeLang === 'ar' ? activeCh.contentAr : activeCh.contentEn}
                                        </p>
                                      </article>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })()}

                  {/* Academic Journal Details Block */}
                  {article.journal && (
                    <div className="border-t border-white/5 pt-4 mt-4 text-[11px] space-y-3 font-mono text-white/50">
                      <div className="flex flex-col md:flex-row-reverse justify-between gap-3 text-right">
                        <span className="flex items-center gap-1.5 md:flex-row-reverse">
                          <span className="text-emerald-400 font-bold">🏫 المجلة والدور النشر:</span>
                          <span className="text-white/80 font-sans">{article.journal}</span>
                        </span>
                        {article.issn && (
                          <span className="flex items-center gap-1.5 md:flex-row-reverse">
                            <span className="text-yellow-400 font-bold">🆔 ISSN:</span>
                            <span className="text-white/80">{article.issn}</span>
                          </span>
                        )}
                      </div>

                      {article.pages && (
                        <div className="flex items-center justify-end gap-1.5 md:flex-row-reverse">
                          <span className="text-sky-400 font-bold">📄 الصفحات ومعدل النشر:</span>
                          <span className="text-white/80">{article.pages}</span>
                        </div>
                      )}

                      {article.submissionDate && (
                        <div className="grid grid-cols-3 gap-2 bg-slate-950 border border-white/5 p-3 rounded-xl text-center mt-3">
                          <div>
                            <div className="text-[8px] uppercase tracking-wider text-white/30 mb-1">تاريخ التقديم</div>
                            <div className="text-amber-400 font-bold text-[10px]">{article.submissionDate}</div>
                          </div>
                          <div>
                            <div className="text-[8px] uppercase tracking-wider text-white/30 mb-1">القبول النهائي</div>
                            <div className="text-emerald-400 font-bold text-[10px]">{article.acceptanceDate}</div>
                          </div>
                          <div>
                            <div className="text-[8px] uppercase tracking-wider text-white/30 mb-1">النشر الفعلي</div>
                            <div className="text-blue-400 font-bold text-[10px]">{article.publicationDate}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Visitor Rating Stars Widget */}
          <InteractiveItemRating itemId={article.id} itemType="article" initialRating={4.8} />

          <div className="flex items-center justify-between border-t border-white/5 pt-6 flex-row-reverse">
            <div className="flex items-center gap-6">
              <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 group/btn">
                <MessageCircle size={18} className={cn("transition-colors", showComments ? "text-emerald-400" : "text-white/30 group-hover/btn:text-emerald-400")} />
                <span className="text-xs font-bold text-white/30 group-hover/btn:text-white/60">{article.comments?.length || 0}</span>
              </button>
              <button onClick={handleLike} className="flex items-center gap-2 group/like">
                <Heart size={18} fill={isLiked ? "#10b981" : "none"} className={cn("transition-all", isLiked ? "text-emerald-500 scale-125" : "text-white/30 group-hover/like:text-red-400")} />
                <span className="text-xs font-bold text-white/30 group-hover/like:text-white/60">{article.likes || 0}</span>
              </button>
              <button onClick={handleDownloadWord} className="flex items-center gap-1 group/dl bg-white/5 px-4 py-2 rounded-2xl border border-emerald-500/10 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all shadow-lg" title="تنزيل Microsoft Word">
                <Download size={15} className="text-white/30 group-hover/dl:text-emerald-400 transition-colors" />
                <span className="text-[10px] font-bold text-white/30 group-hover/dl:text-white/60 uppercase tracking-widest font-arabic">Word</span>
              </button>
            </div>
            <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] font-sans">
              REFERENCE
            </span>
          </div>
        </div>

        <AnimatePresence>
          {showComments && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
              <CommentSection articleId={article.id} currentUser={currentUser} onShowToast={onShowToast} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const ArticlesPage = ({ currentUser, onEditArticle, onShowToast }: { currentUser: any, onEditArticle?: (article: Article) => void, onShowToast?: (msg: string, type?: 'success' | 'error') => void }) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const dbArticles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      
      // Merge live database metrics (likes, comments) with our preloaded scientific publications
      const merged: any[] = DR_YAI_PUBLICATIONS.map(pub => {
        const dbMatch = dbArticles.find(dbArt => dbArt.id === pub.id || dbArt.title.trim().toLowerCase() === pub.title.trim().toLowerCase());
        if (dbMatch) {
          return {
            ...pub,
            ...dbMatch, // This overrides title, content/abstract, imageUrl, category, etc.
            likes: dbMatch.likes !== undefined ? dbMatch.likes : ((pub as any).likes || 0),
            comments: dbMatch.comments || (pub as any).comments || [],
            id: dbMatch.id || pub.id
          };
        }
        return pub;
      });

      // Append entirely custom user articles that are not part of pre-baked publications
      dbArticles.forEach(dbArt => {
        if (!merged.some(m => m.id === dbArt.id || m.title.trim().toLowerCase() === dbArt.title.trim().toLowerCase())) {
          merged.push({
            id: dbArt.id,
            title: dbArt.title,
            excerpt: dbArt.excerpt || '',
            content: dbArt.content || '',
            category: dbArt.category || 'عام',
            imageUrl: dbArt.imageUrl || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800',
            likes: dbArt.likes || 0,
            comments: dbArt.comments || [],
            date: dbArt.createdAt?.toDate ? dbArt.createdAt.toDate().toLocaleDateString('ar-DZ') : new Date().toLocaleDateString('ar-DZ'),
            authors: "الدكتورة زعرة عيايشية .",
            keywords: [],
            categoryEn: "Articles",
            categoryFr: "Articles"
          });
        }
      });

      setArticles(merged);
      setLoading(false);
    }, (err) => {
      console.error("Firestore loading articles failed, showing local fallback", err);
      setArticles(DR_YAI_PUBLICATIONS);
      setLoading(false);
    });
  }, []);

  return (
    <div className="pt-32 pb-20 max-w-[1500px] mx-auto px-4">
      <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
        {isAdminEmail(currentUser?.email) && (
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('switchTab', { detail: 'dashboard' }))}
            className="order-2 md:order-1 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold shadow-neon flex items-center gap-3 transition-all group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            <span>نشر مقال جديد</span>
          </button>
        )}
        <div className="text-center md:text-right order-1 md:order-2">
          {/* Main big styled headings with beautiful accent */}
          <h2 className="text-5xl md:text-6xl font-serif text-white/95 font-black mb-4 tracking-tight drop-shadow-lg text-right flex items-center justify-end gap-3 flex-row-reverse">
            <span className="w-4 h-12 bg-gradient-to-b from-yellow-400 to-emerald-500 rounded-full inline-block" />
            <span>{t('articles')}</span>
          </h2>
          <p className="text-white/50 text-base uppercase tracking-[0.3em] font-sans text-right">
            أبحاث ودراسات علمية محكّمة في السياحة المستدامة والاقتصاد الرقمي
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-white/50" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <ArticleCard key={article.id || index} article={article} currentUser={currentUser} onEdit={onEditArticle} onShowToast={onShowToast} />
          ))}
        </div>
      )}
    </div>
  );
};

const workTranslations: Record<string, { arTitle: string, arDesc: string, enTitle: string, enDesc: string }> = {
  "work-1": {
    arTitle: "السياحة المسؤولة حل نموذجي لتفشي السياحة المفرطة - برشلونة",
    arDesc: "دراسة استقصائية لسياسات السياحة المستدامة والمسؤولة لمدينة برشلونة من 2018 إلى 2023 كاستجابة وقائية لظاهرة السياحة المفرطة.",
    enTitle: "Responsible Tourism as a Solution to Overtourism: Barcelona Case Study (2018-2023)",
    enDesc: "An investigation of sustainable and responsible tourism policies in Barcelona from 2018 to 2023, serving as a preventative framework against urban tourism pollution."
  },
  "work-2": {
    arTitle: "فندق أدرير أملال والتنمية المستدامة في واحة سيوة",
    arDesc: "دراسة بحثية مكثفة تحلل كيف تساهم مواد البناء والعمالة المحلية وإدارة الموارد في تحقيق تنمية بيئية مستدامة حقيقية بمصر.",
    enTitle: "Adrir Amlal Hotel & Sustainable Development in Siwa Oasis",
    enDesc: "An intensive research study analyzing how native architectural principles, local labor, and ecological resource management create true sustainable growth in Egypt's Siwa Oasis."
  },
  "work-3": {
    arTitle: "رقمنة إدارة الموارد البشرية ببلدية سوق أهراس",
    arDesc: "دراسة تبحث في مؤشرات الانتقال الإداري الرقمي، وتطوير أطر الاتصالات التنظيمية بمصالح البلديات في سوق أهراس بالجزائر.",
    enTitle: "Digitization of Human Resources at Souk Ahras Municipality",
    enDesc: "Examining transitional administrative parameters, digital communication enhancements, and organizational transparency as results of HR digitization in Souk Ahras, Algeria."
  },
  "work-4": {
    arTitle: "أمن الحدود الأمريكية مقابل تدفق السياحة الدولية",
    arDesc: "تحليل الارتباط المباشر بين القرارات الجيوسياسية للحدود، طلبات التأشيرات، والنزاعات التجارية الإحصائية لأسواق السفر.",
    enTitle: "U.S. Border Security vs. International Tourism Influx",
    enDesc: "Analytical research of the direct correlation between geopolitical border decisions, visa requirements, trade wars, and the decline of transatlantic travel metrics in 2024-2025."
  },
  "work-5": {
    arTitle: "الاقتصادات الريفية الفرنسية ومنصات تأجير السكن الرقمية",
    arDesc: "دراسة إحصائية ومالية تقيم أثر منصات التأجير السكني Airbnb على تنشيط الأرياف وبرامج تحفيز الهياكل المحلية عام 2023.",
    enTitle: "Rural French Economies and Digital Rental Platforms",
    enDesc: "Statistical and financial analysis evaluating French countrysides, funded region programs, and rural stimulation brought by Airbnb rentals in 2023."
  },
  "work-6": {
    arTitle: "أسباب فشل المشاريع الناشئة حول العالم: دراسة حالة الهند",
    arDesc: "دراسة بنيوية وإحصائية تكشف العوامل التنظيمية، السيولة التمويلية، وغياب تلاؤم المنتج مع رغبات الأسواق بالهند.",
    enTitle: "Causes of Startups Failure Globally: India Case Study",
    enDesc: "Étude statistique et structurelle sur les raisons d'échec des start-ups en Inde, y compris le produit-marché, le capital financier, la gestion opérationnelle et le design marketing."
  },
  "work-7": {
    arTitle: "السياحة المسؤولة لتحقيق التنمية المستدامة في الجزائر: دراسة حالة صحراء الجزائر (أطروحة دكتوراه)",
    arDesc: "أطروحة دكتوراه أكاديمية تناقش سبل ترقية السياحة المسؤولة بيئياً وحماية الثروة الطبيعية ودمج سكان المجتمع المحلي بالتنمية لصحراء الجزائر الشاسعة.",
    enTitle: "Responsible Tourism for Sustainable Development in Algeria: Algerian Sahara Case Study",
    enDesc: "A Doctoral Thesis evaluating sustainable tourism, preserving cultural authenticity, and empowering local oasis communities in southern Algeria."
  }
};

const WorkCardItem = ({ work }: { work: Work }) => {
  const { lang: globalLang } = useContext(ThemeContext);
  const [cardLang, setCardLang] = useState<'ar' | 'en'>(globalLang === 'ar' ? 'ar' : 'en');

  useEffect(() => {
    setCardLang(globalLang === 'ar' ? 'ar' : 'en');
  }, [globalLang]);

  const trans = {
    arTitle: work.arTitle || (work.id && workTranslations[work.id] ? workTranslations[work.id].arTitle : work.title),
    arDesc: work.arDesc || (work.id && workTranslations[work.id] ? workTranslations[work.id].arDesc : work.description),
    enTitle: work.enTitle || (work.id && workTranslations[work.id] ? workTranslations[work.id].enTitle : work.title),
    enDesc: work.enDesc || (work.id && workTranslations[work.id] ? workTranslations[work.id].enDesc : work.description)
  };

  const currentTitle = cardLang === 'ar' ? trans.arTitle : trans.enTitle;
  const currentDesc = cardLang === 'ar' ? trans.arDesc : trans.enDesc;

  return (
    <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 text-right group hover:bg-slate-900/60 hover:border-emerald-500/30 transition-all relative overflow-hidden shadow-2xl flex flex-col justify-between">
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full group-hover:bg-emerald-500/20 transition-all animate-pulse" />
      
      {/* Translation bar at the top */}
      <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-3 relative z-10">
        <span className="text-[9px] text-white/30 uppercase tracking-widest font-mono">🌍 Translation / الترجمة الفورية</span>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setCardLang('ar')}
            className={cn(
              "text-[9px] font-extrabold px-2.5 py-1 rounded-lg border transition-all",
              cardLang === 'ar' ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm" : "text-white/40 bg-slate-950 border-white/5"
            )}
          >
            العربية
          </button>
          <button
            type="button"
            onClick={() => setCardLang('en')}
            className={cn(
              "text-[9px] font-extrabold px-2.5 py-1 rounded-lg border transition-all",
              cardLang === 'en' ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm" : "text-white/40 bg-slate-950 border-white/5"
            )}
          >
            EN
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row-reverse gap-8 relative z-10 flex-1">
        <div className="w-full lg:w-40 aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/5 shrink-0">
          <img src={work.imageUrl} alt={currentTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-xl md:text-2xl font-serif text-white font-extrabold mb-4 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-300 group-hover:from-white group-hover:to-emerald-300 transition-all">
              {currentTitle}
            </h3>
            <p className={cn(
              "text-white/60 leading-relaxed mb-6 block",
              cardLang === 'ar' ? "font-arabic text-right text-[13px]" : "font-sans text-left text-[12px] tracking-wide"
            )}>
              {currentDesc}
            </p>
          </div>
          <InteractiveItemRating itemId={work.id} itemType="work" initialRating={work.rating} />
        </div>
      </div>
    </div>
  );
};

const WorksPage = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    return onSnapshot(collection(db, 'works'), (snapshot) => {
      const dbWorks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Work));
      
      const localWorks = [
        {
          id: "work-1",
          title: "السياحة المسؤولة حل نموذجي لتفشي السياحة المفرطة - برشلونة",
          description: "دراسة استقصائية لسياسات السياحة المستدامة والمسؤولة لمدينة برشلونة من 2018 إلى 2023 كاستجابة وقائية لظاهرة السياحة المفرطة.",
          imageUrl: "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&q=80&w=800",
          rating: 4.9,
          ratingCount: 24,
          category: "دراسة حالة"
        },
        {
          id: "work-2",
          title: "Adrir Amlal Hotel & Sustainable Development in Siwa",
          description: "An intensive research study analyzing how native architectural principles, resource management, and local labor create true sustainable growth in Egypt's Siwa Oasis.",
          imageUrl: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&q=80&w=800",
          rating: 4.7,
          ratingCount: 18,
          category: "سياحة مستدامة"
        },
        {
          id: "work-3",
          title: "Digitization of HR at Souk Ahras Municipality",
          description: "Examining transitional administrative parameters, communication enhancements, and organizational transparency as results of HR digitization in Souk Ahras, Algeria.",
          imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
          rating: 4.8,
          ratingCount: 19,
          category: "الإدارة المحلية"
        },
        {
          id: "work-4",
          title: "U.S. Border Security vs. International Tourism Influx",
          description: "Analytical research of the direct correlation between geopolitical border decisions, visa requirements, trade wars, and the decline of transatlantic travel metrics in 2024-2025.",
          imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80&w=800",
          rating: 4.5,
          ratingCount: 11,
          category: "سياسات اقتصادية"
        },
        {
          id: "work-5",
          title: "Rural French Economies and Digital Rental Platforms",
          description: "Statistical and financial analysis evaluating French countrysides, funded region programs, and rural stimulation brought by Airbnb rentals in 2023.",
          imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800",
          rating: 4.6,
          ratingCount: 15,
          category: "اقتصاد ريفي"
        },
        {
          id: "work-6",
          title: "Causes d'échec des start-ups dans le monde : Cas de l'Inde",
          description: "Étude statistique et structurelle sur les raisons d'échec des start-ups en Inde, y compris le produit-marché, le capital financier, la gestion operational et le design marketing.",
          imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
          rating: 4.9,
          ratingCount: 32,
          category: "ريادة الأعمال"
        },
        {
          id: "work-7",
          title: "السياحة المسؤولة لتحقيق التنمية المستدامة في الجزائر: دراسة حالة صحراء الجزائر (أطروحة دكتوراه)",
          description: "أطروحة دكتوراه أكاديمية تناقش سبل ترقية السياحة المسؤولة بيئياً وحماية الثروة الطبيعية ودمج سكان المجتمع المحلي بالتنمية لصحراء الجزائر الشاسعة.",
          imageUrl: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&q=80&w=800",
          rating: 5.0,
          ratingCount: 45,
          category: "أطروحة دكتوراه"
        }
      ];

      // Replace or merge localWorks with any updates from Firestore
      const merged = localWorks.map(localW => {
        const dbMatch = dbWorks.find(dbW => dbW.id === localW.id || dbW.title.trim().toLowerCase() === localW.title.trim().toLowerCase());
        if (dbMatch) {
          return {
            ...localW,
            ...dbMatch // This overrides description, imageUrl, category, etc. from Firestore!
          };
        }
        return localW;
      });

      // Also append entirely new works from Firestore that are not in localWorks
      dbWorks.forEach(dbW => {
        if (!merged.some(m => m.id === dbW.id || m.title.trim().toLowerCase() === dbW.title.trim().toLowerCase())) {
          merged.push(dbW);
        }
      });

      setWorks(merged);
      setLoading(false);
    }, (err) => {
      console.error("Firestore loading works failed, showing local fallback", err);
      // Fallback works array
      setWorks([
        {
          id: "work-1",
          title: "السياحة المسؤولة حل نموذجي لتفشي السياحة المفرطة - برشلونة",
          description: "دراسة استقصائية لسياسات السياحة المستدامة والمسؤولة لمدينة برشلونة من 2018 إلى 2023 كاستجابة وقائية لظاهرة السياحة المفرطة.",
          imageUrl: "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&q=80&w=800",
          rating: 4.9,
          ratingCount: 24,
          category: "دراسة حالة"
        },
        {
          id: "work-2",
          title: "Adrir Amlal Hotel & Sustainable Development in Siwa",
          description: "An intensive research study analyzing how native architectural principles, resource management, and local labor create true sustainable growth in Egypt's Siwa Oasis.",
          imageUrl: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&q=80&w=800",
          rating: 4.7,
          ratingCount: 18,
          category: "سياحة مستدامة"
        },
        {
          id: "work-3",
          title: "Digitization of HR at Souk Ahras Municipality",
          description: "Examining transitional administrative parameters, communication enhancements, and organizational transparency as results of HR digitization in Souk Ahras, Algeria.",
          imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
          rating: 4.8,
          ratingCount: 19,
          category: "الإدارة المحلية"
        }
      ]);
      setLoading(false);
    });
  }, []);

  return (
    <div className="pt-32 pb-20 max-w-[1500px] mx-auto px-6">
      <div className="mb-16 text-center md:text-right">
        {/* Large, beautiful title heading with neon details */}
        <h2 className="text-5xl md:text-7xl font-serif text-white/95 font-black mb-6 tracking-tight drop-shadow-xl text-right flex items-center justify-end gap-3 flex-row-reverse">
          <span className="w-4 h-14 bg-gradient-to-b from-yellow-400 to-amber-500 rounded-full inline-block" />
          <span>{t('works')}</span>
        </h2>
        <div className="h-px w-32 bg-emerald-500/50 mx-auto md:mr-0 md:ml-auto mb-6" />
        <p className="text-white/40 text-sm md:text-lg lg:max-w-2xl md:mr-0 md:ml-auto uppercase tracking-widest leading-relaxed text-right font-arabic">
          عرض للمشاريع البحثية والمؤلفات العلمية الحاصلة على تقييمات بمجال السياسة الدولية والتنمية المستدامة.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-white" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {works.map(work => (
            <WorkCardItem key={work.id} work={work} />
          ))}
        </div>
      )}
    </div>
  );
};

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await addDoc(collection(db, 'messages'), {
        senderName: formData.name,
        senderEmail: formData.email,
        subject: formData.subject,
        message: formData.message,
        createdAt: serverTimestamp(),
        replied: false
      });
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
    }
    setSending(false);
  };

  return (
    <div className="pt-32 pb-20 max-w-6xl mx-auto px-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10">
        <h2 className="text-4xl font-bold text-white mb-8 text-right">تواصل معي</h2>
        
        {success ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
             <div className="w-20 h-20 bg-green-500/20 border border-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="text-green-500" size={32} />
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">تم الإرسال بنجاح!</h3>
             <p className="text-white/60 mb-8">سأقوم بالرد عليك في أقرب وقت ممكن.</p>
             <button onClick={() => setSuccess(false)} className="bg-white text-emerald-950 font-black px-6 py-2 rounded-xl">رسالة أخرى</button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <input 
                 type="text" 
                 required 
                 placeholder="الاسم الكريم" 
                 value={formData.name} 
                 onChange={e => setFormData({ ...formData, name: e.target.value })} 
                 className="w-full bg-slate-900/60 border border-white/10 rounded-2xl px-6 py-4 text-white text-right focus:ring-1 focus:ring-emerald-500 outline-none"
               />
               <input 
                 type="email" 
                 required 
                 placeholder="البريد الإلكتروني" 
                 value={formData.email} 
                 onChange={e => setFormData({ ...formData, email: e.target.value })} 
                 className="w-full bg-slate-900/60 border border-white/10 rounded-2xl px-6 py-4 text-white text-right focus:ring-1 focus:ring-emerald-500 outline-none"
               />
            </div>
            <input 
              type="text" 
              required 
              placeholder="الموضوع" 
              value={formData.subject} 
              onChange={e => setFormData({ ...formData, subject: e.target.value })} 
              className="w-full bg-slate-900/60 border border-white/10 rounded-2xl px-6 py-4 text-white text-right focus:ring-1 focus:ring-emerald-500 outline-none"
            />
            <textarea 
              rows={6} 
              required 
              placeholder="نص رسالتك" 
              value={formData.message} 
              onChange={e => setFormData({ ...formData, message: e.target.value })} 
              className="w-full bg-slate-900/60 border border-white/10 rounded-2xl px-6 py-4 text-white text-right font-arabic focus:ring-1 focus:ring-emerald-500 outline-none resize-none"
            />
            <button 
              type="submit"
              disabled={sending}
              className="w-full bg-white text-blue-900 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {sending ? <Loader2 className="animate-spin" /> : <Send size={20} />}
              <span>إرسال الرسالة</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const AcademicReviewsList = () => {
  const [ratings, setRatings] = useState<any[]>([]);

  useEffect(() => {
    return onSnapshot(query(collection(db, 'ratings'), orderBy('createdAt', 'desc')), (snap) => {
       setRatings(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  return (
    <div className="mt-12 bg-slate-900 border border-white/10 rounded-[3rem] p-10 shadow-2xl">
       <h3 className="text-2xl font-serif text-white mb-8 text-right flex items-center justify-end gap-3">
          <span className="text-emerald-400 font-black">التقييمات والمراجعات الأكاديمية للمنشورات والمؤلفات</span>
          <Star className="text-yellow-400" fill="currentColor" size={24} />
       </h3>
       <div className="space-y-6">
          {ratings.length === 0 && (
            <p className="text-white/20 text-center py-10 italic">لا توجد تقييمات أو تعليقات أكاديمية حالياً</p>
          )}
          {ratings.map(item => (
            <div key={item.id} className="bg-slate-950/40 border border-white/5 hover:border-emerald-500/20 p-8 rounded-3xl transition-all text-right flex gap-6 items-start flex-row-reverse relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-24 h-24 bg-emerald-500/5 blur-xl group-hover:bg-emerald-500/10 transition-all rounded-full" />
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 shrink-0 shadow-lg flex items-center justify-center text-slate-950 font-extrabold text-lg">
                 {item.reviewerName?.charAt(0) || 'أ'}
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row-reverse md:items-center justify-between gap-4 mb-3">
                  <div>
                    <h4 className="font-extrabold text-white text-base font-sans">{item.reviewerName}</h4>
                    <div className="flex gap-1 text-amber-400 mt-1 justify-end">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={15} fill={i <= item.rating ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                  </div>
                  <div className="text-right md:text-left">
                    <span className="text-[10px] text-white/30 uppercase tracking-widest block font-mono font-sans">
                      {item.itemType === 'work' ? 'مؤلف علمي / كتاب' : 'أطروحة علمية / مقال'}
                    </span>
                    <span className="text-xs text-emerald-400 font-bold block mt-1 font-sans">
                      ID: {item.itemId}
                    </span>
                  </div>
                </div>

                {item.comment ? (
                  <p className="text-white/75 bg-slate-900/60 p-4 rounded-2xl italic font-serif text-[13px] leading-relaxed mb-4 border-r-2 border-emerald-500 font-arabic">
                    "{item.comment}"
                  </p>
                ) : (
                  <p className="text-white/30 text-xs italic mb-4">تم التقييم بالدرجة فقط دون مراجعة كتابية</p>
                )}

                <div className="flex justify-between items-center flex-row-reverse">
                  <span className="text-[10px] text-white/20 font-sans">
                    {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString('ar-DZ') : 'الآن'}
                  </span>
                  <button 
                    onClick={async () => {
                      if (confirm('هل أنتِ متأكدة من حذف هذا التقييم الأكاديمي؟')) {
                        try {
                          await deleteDoc(doc(db, 'ratings', item.id));
                        } catch (err) {
                          console.error(err);
                        }
                      }
                    }} 
                    className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors"
                  >
                    حذف التقييم
                  </button>
                </div>
              </div>
            </div>
          ))}
       </div>
    </div>
  );
};


const Dashboard = ({ currentUser, editingArticle, onFinishEdit, onEditArticle, onExport }: { currentUser: any, editingArticle?: Article | null, onFinishEdit?: () => void, onEditArticle?: (article: Article) => void, onExport?: (stats: any) => void }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState({ visitors: 0, likes: 0, comments: 0 });
  const [notifications, setNotifications] = useState<any[]>([]);
  const [newArticle, setNewArticle] = useState({ title: '', content: '', category: 'Tourism', imageUrl: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [ratings, setRatings] = useState<any[]>([]);

  // Toggle sections between Articles and Scientific Works
  const [activeDashSection, setActiveDashSection] = useState<'articles' | 'works'>('articles');
  const [newWork, setNewWork] = useState({ 
    title: '', 
    description: '', 
    arTitle: '', 
    arDesc: '', 
    enTitle: '', 
    enDesc: '', 
    category: 'دراسة حالة', 
    imageUrl: '' 
  });
  const [dbWorksList, setDbWorksList] = useState<Work[]>([]);
  const [workLoading, setWorkLoading] = useState(false);
  const [editingWorkId, setEditingWorkId] = useState<string | null>(null);

  const localWorksList = [
    {
      id: "work-1",
      title: "السياحة المسؤولة حل نموذجي لتفشي السياحة المفرطة - برشلونة",
      arTitle: "السياحة المسؤولة حل نموذجي لتفشي السياحة المفرطة - برشلونة",
      enTitle: "Responsible Tourism as a Model Solution to Overtourism Influx - Barcelona",
      category: "دراسة حالة",
      arDesc: "دراسة استقصائية لسياسات السياحة المستدامة والمسؤولة لمدينة برشلونة من 2018 إلى 2023 كاستجابة وقائية لظاهرة السياحة المفرطة.",
      enDesc: "An intensive study investigating responsible and sustainable tourism policies in Barcelona from 2018 to 2023 as an active barrier against overtourism."
    },
    {
      id: "work-2",
      title: "Adrir Amlal Hotel & Sustainable Development in Siwa",
      arTitle: "أدرير أملال والتنمية المستدامة في واحة سيوة",
      enTitle: "Adrir Amlal Hotel & Sustainable Development in Siwa",
      category: "سياحة مستدامة",
      arDesc: "دراسة بحثية مكثفة تحلل كيف تساهم مواد البناء والعمالة المحلية وإدارة الموارد في تحقيق تنمية بيئية مستدامة حقيقية بمصر.",
      enDesc: "An intensive research study analyzing how native architectural principles, resource management, and local labor create true sustainable growth in Egypt's Siwa Oasis."
    },
    {
      id: "work-3",
      title: "Digitization of HR at Souk Ahras Municipality",
      arTitle: "رقمنة إدارة الموارد البشرية ببلدية سوق أهراس",
      enTitle: "Digitization of HR at Souk Ahras Municipality",
      category: "الإدارة المحلية",
      arDesc: "بحث استشرافي يتناول معايير التحول الإداري وتحسين منافذ التواصل والشفافية التنظيمية الناتجة عن تفعيل الرقمنة بسوق أهراس.",
      enDesc: "Examining transitional administrative parameters, communication enhancements, and organizational transparency as results of HR digitization in Souk Ahras, Algeria."
    },
    {
      id: "work-4",
      title: "U.S. Border Security vs. International Tourism Influx",
      arTitle: "أمن الحدود الأمريكية مقابل تدفق السياحة الدولية",
      enTitle: "U.S. Border Security vs. International Tourism Influx",
      category: "سياسات اقتصادية",
      arDesc: "دراسة إحصائية تبحث الأثر المباشر لقرارات تشديد الرقابة الحدودية والاتفاقيات الدولية على تراجع نسب ومعدلات تدفق السياح.",
      enDesc: "Analytical research of the direct correlation between geopolitical border decisions, visa requirements, trade wars, and the decline of transatlantic travel metrics in 2024-2025."
    },
    {
      id: "work-5",
      title: "Rural French Economies and Digital Rental Platforms",
      arTitle: "الاقتصاد الريفي الفرنسي ومنصات الإيجار الرقمية",
      enTitle: "Rural French Economies and Digital Rental Platforms",
      category: "اقتصاد ريفي",
      arDesc: "ورقة عمل تقيس وتحلل العوائد المالية لفرنسا وحركة الاستجمام بالقرى الناتجة عن ديناميكية منصات التأجير السكني.",
      enDesc: "Statistical and financial analysis evaluating French countrysides, funded region programs, and rural stimulation brought by Airbnb rentals in 2023."
    },
    {
      id: "work-6",
      title: "Causes d'échec des start-ups dans le monde : Cas de l'Inde",
      arTitle: "أسباب فشل الشركات الناشئة في الدول النامية: الهند نموذجاً",
      enTitle: "Causes d'échec des start-ups dans le monde : Cas de l'Inde",
      category: "ريادة الأعمال",
      arDesc: "دراسة تحليلية وهيكلية لأبرز مسببات تعثر المشاريع الريادية بالهند بما يشمل تنافر الملاءمة السوقية وسوء الإيرادات.",
      enDesc: "Étude statistique et structurelle sur les raisons d'échec des start-ups en Inde, y compris le produit-marché, le capital financier, la gestion opérationnelle et le design marketing."
    },
    {
      id: "work-7",
      title: "السياحة المسؤولة لتحقيق التنمية المستدامة في الجزائر: دراسة حالة صحراء الجزائر (أطروحة دكتوراه)",
      arTitle: "السياحة المسؤولة لتحقيق التنمية المستدامة في الجزائر: دراسة حالة صحراء الجزائر (أطروحة دكتوراه)",
      enTitle: "Responsible Tourism for Sustainable Development in Algerian Dessert (PhD Thesis)",
      category: "أطروحة دكتوراه",
      arDesc: "أطروحة دكتوراه أكاديمية تناقش سبل ترقية السياحة المسؤولة بيئياً وحماية الثروة الطبيعية ودمج سكان المجتمع المحلي بالتنمية لصحراء الجزائر الشاسعة.",
      enDesc: "A Ph.D. dissertation proposing active actionable policies for ecological desert tourism and native Algerian community profit-sharing models."
    }
  ];

  const mergedWorks = (localWorksList as any[]).map(localW => {
    const dbMatch = dbWorksList.find(dbW => dbW.id === localW.id || dbW.title?.trim().toLowerCase() === localW.title?.trim().toLowerCase());
    if (dbMatch) {
      return { ...localW, ...dbMatch };
    }
    return localW;
  }) as Work[];

  dbWorksList.forEach(dbW => {
    if (!mergedWorks.some(m => m.id === dbW.id || m.title?.trim().toLowerCase() === dbW.title?.trim().toLowerCase())) {
      mergedWorks.push(dbW);
    }
  });

  useEffect(() => {
    if (editingArticle) {
       setNewArticle({
         title: editingArticle.title,
         content: editingArticle.content,
         category: editingArticle.category || 'Tourism',
         imageUrl: editingArticle.imageUrl || ''
       });
       setActiveDashSection('articles');
    } else {
       setNewArticle({ title: '', content: '', category: 'Tourism', imageUrl: '' });
    }
  }, [editingArticle]);

  useEffect(() => {
    const qMessages = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unSubMsg = onSnapshot(qMessages, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
    });

    const unSubStats = onSnapshot(doc(db, 'stats', 'global'), (snap) => {
      if (snap.exists()) setStats(prev => ({ ...prev, visitors: snap.data().visitors || 0 }));
    });

    const unSubNotif = onSnapshot(query(collection(db, 'notifications'), orderBy('createdAt', 'desc')), (snap) => {
       setNotifications(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unSubRatings = onSnapshot(query(collection(db, 'ratings'), orderBy('createdAt', 'desc')), (snap) => {
       setRatings(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Realtime works list snapshot query
    const unSubWorks = onSnapshot(query(collection(db, 'works')), (snap) => {
       setDbWorksList(snap.docs.map(d => ({ id: d.id, ...d.data() } as Work)));
    });

    // Calc total likes/comments from articles and get all articles for management
    const unSubArticles = onSnapshot(query(collection(db, 'articles'), orderBy('createdAt', 'desc')), (snap) => {
       let l = 0; let c = 0;
       const docs = snap.docs.map(d => {
         const data = d.data();
         l += (data.likes || 0);
         c += (data.comments?.length || 0);
         return { id: d.id, ...data } as Article;
       });
       setStats(prev => ({ ...prev, likes: l, comments: c }));
       setAllArticles(docs);
    });

    return () => { unSubMsg(); unSubStats(); unSubNotif(); unSubArticles(); unSubRatings(); unSubWorks(); };
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(e.target.files[0]);
      setNewArticle({ ...newArticle, imageUrl: url });
    } catch (err) {
      console.error(err);
    }
    setIsUploading(false);
  };

  const handleWorkImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(e.target.files[0]);
      setNewWork(prev => ({ ...prev, imageUrl: url }));
    } catch (err) {
      console.error(err);
    }
    setIsUploading(false);
  };

  const handleEditWorkButton = (work: Work) => {
    setEditingWorkId(work.id);
    setNewWork({
      title: work.title || work.arTitle || '',
      description: work.description || work.arDesc || '',
      arTitle: work.arTitle || '',
      arDesc: work.arDesc || '',
      enTitle: work.enTitle || '',
      enDesc: work.enDesc || '',
      category: work.category || 'دراسة حالة',
      imageUrl: work.imageUrl || ''
    });
    setActiveDashSection('works');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleClearWorkForm = () => {
    setEditingWorkId(null);
    setNewWork({ title: '', description: '', arTitle: '', arDesc: '', enTitle: '', enDesc: '', category: 'دراسة حالة', imageUrl: '' });
  };

  const handlePostWork = async () => {
    if (!newWork.title && !newWork.arTitle) {
      alert('الرجاء كتابة عنوان للعمل العلمي قبل الحفظ!');
      return;
    }
    setWorkLoading(true);
    try {
      const finalArTitle = newWork.arTitle || newWork.title;
      const finalArDesc = newWork.arDesc || newWork.description;
      const finalEnTitle = newWork.enTitle || newWork.title;
      const finalEnDesc = newWork.enDesc || newWork.description;
      
      const payload = {
        title: finalArTitle,
        description: finalArDesc,
        arTitle: finalArTitle,
        arDesc: finalArDesc,
        enTitle: finalEnTitle,
        enDesc: finalEnDesc,
        category: newWork.category,
        imageUrl: newWork.imageUrl,
        updatedAt: serverTimestamp()
      };

      if (editingWorkId) {
        const docRef = doc(db, 'works', editingWorkId);
        await setDoc(docRef, payload, { merge: true });
        alert('تم تحديث المؤلف العلمي بنجاح!');
      } else {
        await addDoc(collection(db, 'works'), {
          ...payload,
          rating: 5.0,
          ratingCount: 1,
          createdAt: serverTimestamp()
        });
        alert('تم إضافة المؤلف العلمي الجديد بنجاح!');
      }
      handleClearWorkForm();
    } catch (err) {
      console.error("Error saving work:", err);
    }
    setWorkLoading(false);
  };

  const handlePostArticle = async () => {
    if (!newArticle.title || !newArticle.content) {
      alert('الرجاء تعبئة العنوان والمحتوى قبل الحفظ!');
      return;
    }
    setLoading(true);
    try {
      if (editingArticle) {
        const docRef = doc(db, 'articles', editingArticle.id);
        await setDoc(docRef, {
          ...newArticle,
          updatedAt: serverTimestamp()
        }, { merge: true });
        alert('تم تحديث المنشور بنجاح!');
        onFinishEdit?.();
      } else {
        await addDoc(collection(db, 'articles'), {
          ...newArticle,
          authorId: currentUser.uid,
          likes: 0,
          comments: [],
          createdAt: serverTimestamp(),
        });
        alert('تم نشر المنشور بنجاح!');
      }
      setNewArticle({ title: '', content: '', category: 'Tourism', imageUrl: '' });
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حفظ المنشور: ' + (err instanceof Error ? err.message : String(err)));
    }
    setLoading(false);
  };

  const markRead = async (id: string) => {
     try { await deleteDoc(doc(db, 'notifications', id)); } catch(err) { console.error(err); }
  };

  return (
    <div className="pt-24 md:pt-32 pb-20 max-w-7xl mx-auto px-6">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 p-10 rounded-[3rem] text-center">
             <p className="text-emerald-400 text-5xl font-serif font-black mb-2">{stats.visitors}</p>
             <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">إجمالي الزيارات</p>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 p-10 rounded-[3rem] text-center">
             <p className="text-red-400 text-5xl font-serif font-black mb-2">{stats.likes}</p>
             <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">إجمالي الإعجابات</p>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 p-10 rounded-[3rem] text-center">
             <p className="text-blue-400 text-5xl font-serif font-black mb-2">{stats.comments}</p>
             <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">التعليقات</p>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          {/* New Post Form */}
          <div className="lg:col-span-7 bg-slate-950/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[80px] -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-all" />
              
              {/* Form Tab Switchers */}
              <div className="flex justify-end gap-3 border-b border-white/10 pb-6 flex-row-reverse mb-6">
                 <button 
                   onClick={() => {
                     setActiveDashSection('articles');
                     if (onFinishEdit) onFinishEdit();
                   }}
                   className={cn(
                     "px-6 py-3 rounded-2xl text-xs font-bold font-arabic transition-all",
                     activeDashSection === 'articles' ? "bg-emerald-500 text-white shadow-neon" : "bg-white/5 text-white/50 hover:text-white border border-white/5"
                   )}
                 >
                    المقالات والمنشورات
                 </button>
                 <button 
                   onClick={() => setActiveDashSection('works')}
                   className={cn(
                     "px-6 py-3 rounded-2xl text-xs font-bold font-arabic transition-all",
                     activeDashSection === 'works' ? "bg-emerald-500 text-white shadow-neon" : "bg-white/5 text-white/50 hover:text-white border border-white/5"
                   )}
                 >
                    المؤلفات والأعمال العلمية
                 </button>
              </div>
             <h3 className="text-2xl font-serif text-white font-bold text-right flex items-center justify-end gap-3">
                <span className="text-emerald-400"><Plus size={24} /></span>
                {activeDashSection === 'works' ? 'إضافة عمل علمي أو مؤلف جديد للدكتورة' : 'إنشاء منشور جديد (مقال، بحث، أو خاطرة مصورة)'}
             </h3>
             <div className="space-y-6 relative z-10">
                 {activeDashSection === 'works' ? (
                    /* SCIENTIFIC WORKS ENTRY FORM */
                    <div className="space-y-6 animate-fade-in text-right">
                       <div className="flex gap-2 flex-wrap col-span-full justify-end flex-row-reverse mb-4">
                         {['دراسة حالة', 'سياحة مستدامة', 'الإدارة المحلية', 'سياسات اقتصادية', 'اقتصاد ريفي', 'ريادة الأعمال', 'أطروحة دكتوراه'].map(cat => (
                            <button 
                              key={cat} 
                              type="button"
                              onClick={() => setNewWork({...newWork, category: cat})} 
                              className={cn("px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest transition-all font-arabic", newWork.category === cat ? "bg-emerald-500 text-white shadow-neon" : "bg-white/5 text-white/30 border border-white/5")}
                            >
                              {cat}
                            </button>
                         ))}
                       </div>

                       <div className="space-y-4">
                          <div>
                            <label className="text-[10px] font-bold text-white/40 block mb-2 text-right font-arabic">العنوان باللغة العربية</label>
                            <input 
                              type="text" 
                              value={newWork.arTitle}
                              onChange={e => setNewWork({...newWork, arTitle: e.target.value, title: e.target.value})}
                              placeholder="أدخلي عنوان البحث أو الكتاب بالعربية..."
                              className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-1 focus:ring-emerald-500 outline-none text-right font-arabic placeholder:text-white/20 transition-all hover:bg-white/5"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-white/40 block mb-2 text-right font-arabic">الخلاصة والوصف باللغة العربية</label>
                            <textarea 
                              rows={4}
                              value={newWork.arDesc}
                              onChange={e => setNewWork({...newWork, arDesc: e.target.value, description: e.target.value})}
                              placeholder="أدخلي الملخص الأكاديمي والنتائج بالتفصيل..."
                              className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-1 focus:ring-emerald-500 outline-none text-right font-arabic placeholder:text-white/20 transition-all hover:bg-white/5 resize-none leading-relaxed"
                            />
                          </div>

                          <div className="border-t border-white/5 pt-4 my-2" />

                          <div>
                            <label className="text-[10px] font-bold text-white/40 block mb-2 text-right font-arabic">Title in English</label>
                            <input 
                              type="text" 
                              value={newWork.enTitle}
                              onChange={e => setNewWork({...newWork, enTitle: e.target.value})}
                              placeholder="Enter academic paper/work title in English..."
                              className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-1 focus:ring-emerald-500 outline-none text-left font-sans placeholder:text-white/20 transition-all hover:bg-white/5"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-white/40 block mb-2 text-right font-arabic">Abstract/Description in English</label>
                            <textarea 
                              rows={4}
                              value={newWork.enDesc}
                              onChange={e => setNewWork({...newWork, enDesc: e.target.value})}
                              placeholder="Enter academic abstract, methodology, and notes in English..."
                              className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-1 focus:ring-emerald-500 outline-none text-left font-sans placeholder:text-white/20 transition-all hover:bg-white/5 resize-none leading-relaxed"
                            />
                          </div>
                       </div>

                       <div className="flex gap-4 flex-row-reverse items-center justify-end font-arabic">
                          <label className="flex-1 bg-white/5 border-2 border-dashed border-white/10 rounded-3xl p-8 text-center cursor-pointer hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all group/upload relative overflow-hidden">
                             {isUploading ? (
                               <div className="flex flex-col items-center">
                                  <Loader2 className="animate-spin text-emerald-500 mb-2" size={32} />
                                  <span className="text-[10px] text-emerald-500 uppercase tracking-widest font-black">جاري رفع ومعالجة الصورة...</span>
                               </div>
                             ) : (
                               <>
                                  <Upload className="text-white/20 group-hover/upload:text-emerald-400 mx-auto mb-3 transition-colors" size={28} />
                                  <span className="text-xs text-white/40 block group-hover/upload:text-white transition-colors">ارفقي غلاف أو شعار للعمل العلمي</span>
                               </>
                             )}
                             {newWork.imageUrl && (
                               <div className="absolute inset-0 bg-slate-950 p-2">
                                  <img src={newWork.imageUrl} className="w-full h-full object-contain rounded-xl" />
                               </div>
                             )}
                             <input type="file" onChange={handleWorkImageUpload} className="hidden" accept="image/*" />
                          </label>
                          {newWork.imageUrl && <button onClick={() => setNewWork({...newWork, imageUrl: ''})} className="bg-red-500/20 text-red-500 p-4 rounded-xl hover:bg-red-500 hover:text-white transition-all"><X size={20}/></button>}
                       </div>

                       <div className="flex gap-3">
                          {editingWorkId && (
                             <button 
                               type="button"
                               onClick={handleClearWorkForm}
                               className="bg-white/10 hover:bg-white/20 text-white font-arabic font-black px-6 py-4 rounded-2xl transition-all text-sm animate-fade-in"
                             >
                                إلغاء التعديل
                             </button>
                          )}
                          <button 
                            type="button"
                            onClick={handlePostWork}
                            disabled={workLoading || isUploading}
                            className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-white font-black py-4 rounded-2xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 text-sm font-arabic"
                          >
                             {workLoading ? <Loader2 className="animate-spin" /> : editingWorkId ? <Settings size={20} /> : <Plus size={20} />}
                             <span>{editingWorkId ? 'حفظ تعديلات المؤلف العلمي' : 'نشر العمل العلمي الآن'}</span>
                          </button>
                       </div>
                    </div>
                 ) : (
                    /* ORIGINAL ARTICLES ENTRY FORM FIELDS wrapper */
                    <div className="space-y-6 w-full text-right animate-fade-in">
                <div className="flex gap-2 flex-row-reverse mb-4">
                  <button onClick={() => setNewArticle({...newArticle, category: 'Tourism'})} className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", newArticle.category === 'Tourism' ? "bg-emerald-500 text-white shadow-neon" : "bg-white/5 text-white/30 border border-white/5")}>سياحة مسؤولة</button>
                  <button onClick={() => setNewArticle({...newArticle, category: 'Economy'})} className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", newArticle.category === 'Economy' ? "bg-blue-500 text-white shadow-neon" : "bg-white/5 text-white/30 border border-white/5")}>اقتصاد رقمي</button>
                  <button onClick={() => setNewArticle({...newArticle, category: 'Quote'})} className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", newArticle.category === 'Quote' ? "bg-purple-500 text-white shadow-neon" : "bg-white/5 text-white/30 border border-white/5")}>مقولة / خاطرة</button>
                </div>

                <input 
                  type="text" 
                  value={newArticle.title}
                  onChange={e => setNewArticle({...newArticle, title: e.target.value})}
                  placeholder={newArticle.category === 'Quote' ? "عنوان قصير للمقولة (اختياري)" : "عنوان المنشور الأكاديمي..."}
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-5 text-white focus:ring-1 focus:ring-emerald-500 outline-none text-right placeholder:text-white/20 transition-all hover:bg-white/5"
                />
                <textarea 
                  rows={8}
                  value={newArticle.content}
                  onChange={e => setNewArticle({...newArticle, content: e.target.value})}
                  placeholder={newArticle.category === 'Quote' ? "اكتبي مقولتكِ هنا..." : "محتوى المنشور، التحليلات، أو ملخص البحث..."}
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-5 text-white focus:ring-1 focus:ring-emerald-500 outline-none text-right font-arabic placeholder:text-white/20 transition-all hover:bg-white/5 resize-none"
                />
                <div className="flex gap-4 flex-row-reverse items-center">
                   <label className="flex-1 bg-white/5 border-2 border-dashed border-white/10 rounded-3xl p-8 text-center cursor-pointer hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all group/upload relative overflow-hidden">
                      {isUploading ? (
                        <div className="flex flex-col items-center">
                           <Loader2 className="animate-spin text-emerald-500 mb-2" size={32} />
                           <span className="text-[10px] text-emerald-500 uppercase tracking-widest font-black">جاري الرفع السحابي...</span>
                        </div>
                      ) : (
                        <>
                           <Upload className="text-white/20 group-hover/upload:text-emerald-400 mx-auto mb-3 transition-colors" size={28} />
                           <span className="text-xs text-white/40 block group-hover/upload:text-white transition-colors">ارفقي صورة تعبيرية للمنشور</span>
                        </>
                      )}
                      {newArticle.imageUrl && (
                        <div className="absolute inset-0 bg-slate-950 p-2">
                           <img src={newArticle.imageUrl} className="w-full h-full object-contain rounded-xl" />
                        </div>
                      )}
                      <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                   </label>
                   {newArticle.imageUrl && <button onClick={() => setNewArticle({...newArticle, imageUrl: ''})} className="bg-red-500/20 text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-all"><X size={20}/></button>}
                </div>
                <button 
                  onClick={handlePostArticle}
                  disabled={loading || isUploading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-white font-black py-6 rounded-3xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                >
                   {loading ? <Loader2 className="animate-spin" /> : editingArticle ? <Settings size={24} /> : <Plus size={24} />}
                   <span className="text-lg">{editingArticle ? 'حفظ التعديلات' : 'نشر في الموقع الآن'}</span>
                </button>
                    </div>
                 )}
             </div>
          </div>

          {/* Notifications & Activity */}
          <div className="lg:col-span-5 space-y-8">
             <div className="bg-slate-900 border border-white/10 rounded-[3rem] p-10 h-full flex flex-col shadow-2xl">
                <div className="flex items-center justify-between mb-10 flex-row-reverse border-b border-white/5 pb-6">
                   <h3 className="text-2xl font-serif font-black text-white">تفاعل القراء</h3>
                   <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">{notifications.length} جديد</span>
                   </div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
                   {notifications.length === 0 && (
                     <div className="h-full flex flex-col items-center justify-center opacity-20">
                        <MessageSquare size={48} className="mb-4" />
                        <p className="text-center italic">لا نشاط حالياً</p>
                     </div>
                   )}
                   {notifications.map(n => (
                      <div key={n.id} className="bg-white/5 p-6 rounded-3xl border border-white/5 relative group text-right hover:bg-white/10 transition-all cursor-default">
                         <div className="flex items-center gap-3 mb-4 flex-row-reverse">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-[10px] text-white/30 font-bold">{n.createdAt?.toDate ? n.createdAt.toDate().toLocaleTimeString('ar-DZ') : 'الآن'}</span>
                         </div>
                         <p className="text-sm text-white/80 leading-relaxed mb-4">
                            {n.type === 'comment' ? (
                               <>قام القارئ <span className="text-emerald-400 font-bold px-1.5 py-0.5 bg-emerald-500/10 rounded-md">{n.from}</span> بالتعليق على أطروحتك: <span className="text-white font-medium italic">"{n.articleTitle}"</span></>
                            ) : (
                               <>رسالة استفسار علمي جديدة من المهتم <span className="text-blue-400 font-bold">{n.from}</span></>
                            )}
                         </p>
                         <button onClick={() => markRead(n.id)} className="absolute top-4 left-4 text-white/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-125">
                            <X size={16} />
                         </button>
                      </div>
                   ))}
                </div>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
          <div className="lg:col-span-8 space-y-8">
             <h3 className="text-2xl font-serif text-white/80 text-right mb-6">رسائل الزوار الأخيرة</h3>
             <div className="space-y-6">
                {messages.length === 0 && <p className="text-white/20 text-center py-10 italic">لا توجد رسائل حالياً</p>}
                {messages.map(msg => (
                  <div key={msg.id} className="bg-slate-900/50 border border-white/10 p-8 rounded-[2rem] hover:bg-white/5 transition-all text-right flex gap-6 items-start flex-row-reverse">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 shrink-0 shadow-lg flex items-center justify-center text-white font-bold">
                       {msg.senderName?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2 flex-row-reverse">
                        <div>
                          <h4 className="font-bold text-white text-lg">{msg.senderName}</h4>
                          <p className="text-xs text-white/30 uppercase tracking-widest">{msg.senderEmail}</p>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">New Message</span>
                      </div>
                      <p className="text-white/60 leading-relaxed mb-6 font-arabic">{msg.message}</p>
                      <div className="flex justify-end gap-4">
                         <button onClick={() => deleteDoc(doc(db, 'messages', msg.id))} className="text-white/20 text-[10px] font-bold uppercase tracking-widest hover:text-red-400 transition-colors">حذف</button>
                         <a href={`mailto:${msg.senderEmail}`} className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest hover:underline px-4 py-2 bg-emerald-500/10 rounded-lg">الرد عبر البريد</a>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
          
          <div className="lg:col-span-4 space-y-8">
             <div className="bg-gradient-to-br from-emerald-600 to-blue-800 rounded-[2.5rem] p-10 text-center relative overflow-hidden shadow-2xl flex flex-col justify-center h-full min-h-[400px]">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-black/20 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <div className="text-6xl mb-8">📊</div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-4">إحصائيات متقدمة</h3>
                  <p className="text-white/60 text-sm mb-10 leading-relaxed font-arabic">تتبع كل تفاعل حقيقي على الموقع من تعليقات وإعجابات وزوار فريدين.</p>
                  <div className="grid grid-cols-2 gap-3 mb-10">
                    <div className="bg-white/10 p-4 rounded-2xl">
                      <p className="text-2xl font-bold text-white">{stats.visitors}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">زائر</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-2xl">
                      <p className="text-2xl font-bold text-white">{stats.likes}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">إعجاب</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onExport?.(stats)}
                    className="w-full bg-white text-emerald-900 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-transform"
                  >
                    تصدير البيانات بصيغة Word
                  </button>
                </div>
             </div>
          </div>
       </div>

       <AcademicReviewsList />

       {/* Articles Management */}
        <div className="mt-12 bg-slate-900 border border-white/10 rounded-[3rem] p-10 shadow-2xl">
           <h3 className="text-2xl font-serif text-white mb-8 text-right flex items-center justify-end gap-3">
              <span className="text-emerald-400 font-black">إدارة المحتوى</span>
              <BookOpen size={24} />
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeDashSection === 'works' ? (
                 <>
                   {mergedWorks.length === 0 && <p className="text-white/20 text-center py-10 italic col-span-full">لا توجد أعمال علمية حالياً لإدارتها</p>}
                   {mergedWorks.map(wk => (
                      <div key={wk.id} className="flex items-center justify-between bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-emerald-500/30 hover:bg-white/10 transition-all gap-4">
                         <div className="flex items-center gap-1 shrink-0">
                            <button 
                              onClick={async () => {
                                if (wk.id.startsWith('work-')) {
                                  alert('هذا العمل يعتبر من الأعمال الأساسية للموقع، يمكنكِ تعديل محتواه وصورته بدلاً من حذفه!');
                                  return;
                                }
                                if (confirm('هل أنتِ متأكدة من رغبتكِ في حذف هذا العمل العلمي نهائياً؟')) {
                                   try {
                                     await deleteDoc(doc(db, 'works', wk.id));
                                     alert('تم حذف العمل العلمي بنجاح!');
                                   } catch (err) {
                                     console.error("حذف عمل علمي فشل:", err);
                                   }
                                }
                              }} 
                              className="p-2 text-white/20 hover:text-red-500 transition-colors"
                              title="حذف"
                            >
                               <Trash2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleEditWorkButton(wk)} 
                              className="p-2 text-white/20 hover:text-blue-500 transition-colors"
                              title="تعديل"
                            >
                               <Settings size={16} />
                            </button>
                         </div>
                         <div className="text-right flex-1 min-w-0">
                            <p className="text-white font-bold text-[13px] truncate">{wk.arTitle || wk.title}</p>
                            <p className="text-emerald-400 font-bold text-[9px] mt-1 truncate">{wk.category} • عمل علمي</p>
                         </div>
                      </div>
                   ))}
                 </>
              ) : (
                 <>
                   {allArticles.length === 0 && <p className="text-white/20 text-center py-10 italic col-span-full">لا توجد منشورات حالياً لإدارتها</p>}
                   {allArticles.map(art => (
                      <div key={art.id} className="flex items-center justify-between bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-emerald-500/30 hover:bg-white/10 transition-all gap-4">
                         <div className="flex items-center gap-1 shrink-0">
                            <button 
                              onClick={async () => {
                                try {
                                  await deleteDoc(doc(db, 'articles', art.id));
                                } catch (err) {
                                  console.error(err);
                                }
                              }} 
                              className="p-2 text-white/20 hover:text-red-500 transition-colors"
                              title="حذف"
                            >
                               <Trash2 size={16} />
                            </button>
                            <button 
                              onClick={() => onEditArticle?.(art)} 
                              className="p-2 text-white/20 hover:text-blue-500 transition-colors"
                              title="تعديل"
                            >
                               <Settings size={16} />
                            </button>
                         </div>
                         <div className="text-right flex-1 min-w-0">
                            <p className="text-white font-bold text-[13px] truncate">{art.title}</p>
                            <p className="text-white/30 text-[9px] mt-1 truncate">{art.category} • {art.createdAt?.toDate ? art.createdAt.toDate().toLocaleDateString('ar-DZ') : 'الآن'}</p>
                         </div>
                      </div>
                   ))}
                 </>
              )}
           </div>
        </div>
    </div>
  );
};

// Academic Reviews Section Placeholder

const FloatingSettings = () => {
  const { lang, setLang, isDark, toggleDark } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();

  return (
    <div className="fixed top-6 left-6 z-[100] flex flex-col items-start gap-3">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all"
      >
        <Settings size={20} className={cn("transition-transform duration-500", isOpen ? "rotate-90" : "rotate-0")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.9 }}
            className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-2 rounded-3xl shadow-2xl flex flex-col gap-2 min-w-[120px]"
          >
             <div className="p-2 border-b border-white/5 mb-1">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest text-center">Language</p>
             </div>
             <div className="flex flex-col gap-1">
                {['ar', 'en', 'fr'].map(l => (
                  <button 
                    key={l}
                    onClick={() => { 
                      setLang(l); 
                      i18n.changeLanguage(l);
                      setIsOpen(false); 
                    }}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-between",
                      lang === l ? "bg-emerald-500 text-white" : "text-white/40 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <span>{l === 'ar' ? 'العربية' : l === 'en' ? 'English' : 'Français'}</span>
                    <span className="text-[10px] opacity-50">{l.toUpperCase()}</span>
                  </button>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FloatingAdminButton = ({ currentUser, onNavigate, activeTab }: { currentUser: any, onNavigate: (tab: string) => void, activeTab: string }) => {
  if (!isAdminEmail(currentUser?.email) || activeTab === 'dashboard') return null;
  
  return (
    <motion.button
      initial={{ scale: 0, y: 100 }}
      animate={{ scale: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onNavigate('dashboard')}
      className="fixed bottom-28 left-6 md:bottom-10 md:left-40 z-[100] bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.4)] border-2 border-white/20 flex items-center gap-3 group animate-bounce"
    >
      <div className="bg-white/20 p-2 rounded-lg">
        <LayoutDashboard size={20} />
      </div>
      <span className="font-bold text-sm">لوحة الإضافة والنشر (أدمن)</span>
    </motion.button>
  );
};

export default function App() {
  const [theme, setTheme] = useState<Theme>('sea');
  const [lang, setLang] = useState('ar');
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<any>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const cvRef = useRef<HTMLDivElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [profileAvatarUrl, setProfileAvatarUrl] = useState<string>('');
  const [isChangingAvatar, setIsChangingAvatar] = useState(false);

  useEffect(() => {
    const unSubProfile = onSnapshot(doc(db, 'settings', 'profile'), (snap) => {
      if (snap.exists() && snap.data().avatarUrl) {
        setProfileAvatarUrl(snap.data().avatarUrl);
      } else {
        setProfileAvatarUrl('/src/assets/images/hijabi_profile_avatar_1779539854837.png');
      }
    }, (err) => {
      console.warn("Could not register settings onSnapshot:", err);
      setProfileAvatarUrl('/src/assets/images/hijabi_profile_avatar_1779539854837.png');
    });
    return () => unSubProfile();
  }, []);

  // Auto-rotate scenic natural backgrounds every 20 seconds
  useEffect(() => {
    const themesList: Theme[] = ['sea', 'desert', 'snow', 'forest'];
    const interval = setInterval(() => {
      setTheme((prev) => {
        const nextIndex = (themesList.indexOf(prev) + 1) % themesList.length;
        return themesList[nextIndex];
      });
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigate = (tab: string) => {
    if (tab === 'contact') {
      setIsChatOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setActiveTab('dashboard');
  };

  const finishEdit = () => {
    setEditingArticle(null);
    setActiveTab('articles');
  };

  useEffect(() => {
    testConnection();

    const handleSwitchTab = (e: any) => setActiveTab(e.detail);
    const handleOpenLogin = () => signInWithGoogle();
    window.addEventListener('switchTab', handleSwitchTab);
    window.addEventListener('openLogin', handleOpenLogin);

    // Record visit if first time in session
    const recordVisit = async () => {
      try {
        if (!sessionStorage.getItem('dr_zaara_visited')) {
          const statsRef = doc(db, 'stats', 'global');
          // Use updateDoc which might fail if doc doesn't exist, so we catch and set if needed
          try {
            await updateDoc(statsRef, { visitors: increment(1) });
          } catch (e: any) {
             // If document doesn't exist, initialize it
             if (e.code === 'not-found' || (e.message && e.message.includes('not found'))) {
                await setDoc(statsRef, { visitors: 1 });
             } else {
                throw e;
             }
          }
          sessionStorage.setItem('dr_zaara_visited', 'true');
        }
      } catch (err) {
        console.error('Visit tracking error:', err);
      }
    };
    recordVisit();

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const downloadWord = () => {
    console.log('Starting Professional CV Word download');
    if (!cvRef.current) {
      console.error('cvRef element not found');
      return;
    }
    try {
      const header = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>السيرة الذاتية - الدكتورة عائشية زهرة</title>
        <style>
          body { font-family: 'Arial', sans-serif; direction: rtl; text-align: right; background-color: #ffffff; color: #000000; }
          h1, h2, h3 { color: #059669; }
          .section { margin-bottom: 20px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px; }
        </style>
        </head><body>
      `;
      const footer = "</body></html>";
      
      // Create a simplified version of the CV content for Word
      const content = cvRef.current.innerHTML;
      const sourceHTML = header + content + footer;
      
      const blob = new Blob(['\ufeff', sourceHTML], {
        type: 'application/msword'
      });
      
      saveAs(blob, 'Dr_Zaara_Ayaichia_Professional_CV.doc');
      showToast('تم تحميل السيرة الذاتية بصيغة Word بنجاح');
      console.log('CV Word saved successfully');
    } catch (err) {
      console.error('CV Word generation error:', err);
      showToast('فشل تحميل Word', 'error');
    }
  };

  const downloadStatsWord = (stats: any) => {
    try {
      const header = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>تقرير الإحصائيات</title>
        <style>
          body { font-family: 'Arial', sans-serif; direction: rtl; text-align: right; }
          h1 { color: #059669; }
          .stat-item { margin: 10px 0; font-size: 14pt; }
        </style>
        </head><body>
      `;
      const footer = "</body></html>";
      
      const content = `
        <h1>تقرير إحصائيات المنصة</h1>
        <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-DZ')}</p>
        <hr/>
        <div class="stat-item">إجمالي الزيارات: ${stats.visitors}</div>
        <div class="stat-item">إجمالي الإعجابات: ${stats.likes}</div>
        <div class="stat-item">إجمالي التعليقات: ${stats.comments}</div>
      `;
      
      const sourceHTML = header + content + footer;
      const blob = new Blob(['\ufeff', sourceHTML], {
        type: 'application/msword'
      });
      
      saveAs(blob, 'Platform_Stats_Report.doc');
      showToast('تم تصدير الإحصائيات بصيغة Word بنجاح');
    } catch (err) {
      console.error('Stats Word export error:', err);
      showToast('فشل تصدير الإحصائيات', 'error');
    }
  };

  const handleProfileImageUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    try {
      const url = await uploadToCloudinary(e.target.files[0]);
      await setDoc(doc(db, 'settings', 'profile'), { avatarUrl: url }, { merge: true });
      alert(t('upload_success') || 'تم تحديد وتحديث صورة الملف الشخصي للدكتورة بنجاح!');
    } catch (err) {
      console.error(err);
      alert('خطأ أثناء رفع وتحديث الصورة، يرجى المحاولة مجدداً');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomePage currentUser={user} signInWithGoogle={signInWithGoogle} />;
      case 'articles': return <ArticlesPage currentUser={user} onEditArticle={handleEditArticle} onShowToast={showToast} />;
      case 'works': return <WorksPage />;
      case 'contact': return <ContactPage />;
      case 'dashboard': return isAdminEmail(user?.email) ? <Dashboard currentUser={user} editingArticle={editingArticle} onEditArticle={handleEditArticle} onFinishEdit={finishEdit} onExport={(stats) => downloadStatsWord(stats)} /> : <HomePage currentUser={user} signInWithGoogle={signInWithGoogle} />;
      case 'cv': return (
        <div className="pt-24 md:pt-32 pb-20 max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                <div className="text-right">
                    <h2 className="text-5xl font-serif font-bold text-white mb-2">{t('cv')}</h2>
                    <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs">{t('author_name')}</p>
                </div>
                <button 
                  onClick={downloadWord}
                  className="bg-white text-slate-950 px-10 py-4 rounded-2xl font-bold shadow-neon flex items-center gap-3 hover:scale-105 transition-transform"
                >
                  <Download size={24} />
                  <span>{t('download_cv')}</span>
                </button>
            </div>

            <div ref={cvRef} className="bg-slate-950 border border-white/10 rounded-[3rem] p-10 md:p-20 overflow-hidden relative shadow-2xl text-white text-right" dir="rtl">
               <div className="absolute top-0 right-0 w-96 h-96 bg-[#2563eb1a] blur-[150px] rounded-full" />
               <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0596690d] blur-[150px] rounded-full" />
               
               <div className="relative z-10">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row-reverse items-center justify-center gap-10 mb-20 pb-4">
                     <div className="relative w-48 h-48 md:w-56 md:h-56 shrink-0 aspect-square">
                        <div className="absolute inset-0 rounded-full neon-border shadow-[0_0_30px_rgba(0,243,255,0.3)] animate-pulse" />
                        <div className="absolute inset-2 rounded-full overflow-hidden border-2 border-white/20 bg-slate-800 group">
                           <img 
                             src={profileAvatarUrl || '/src/assets/images/hijabi_profile_avatar_1779539854837.png'} 
                             alt="Dr Zaara" 
                             className="w-full h-full object-cover transition-all duration-700 cursor-pointer animate-fade-in"
                             referrerPolicy="no-referrer"
                             onClick={() => { if (isAdminEmail(user?.email)) avatarInputRef.current?.click(); }}
                           />
                           {isAdminEmail(user?.email) && (
                             <div 
                               onClick={() => avatarInputRef.current?.click()}
                               className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity duration-300 gap-1 text-[11px] hidden md:flex"
                             >
                               <Camera size={18} />
                               <span>تغيير الصورة</span>
                             </div>
                           )}
                           <input 
                             type="file" 
                             ref={avatarInputRef} 
                             onChange={handleProfileImageUpdate} 
                             className="hidden" 
                             accept="image/*" 
                           />
                        </div>
                        {isAdminEmail(user?.email) && (
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              avatarInputRef.current?.click();
                            }}
                            className="absolute bottom-2 left-2 bg-emerald-500 hover:bg-emerald-400 text-white w-12 h-12 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.8)] border-3 border-slate-950 active:scale-95 hover:scale-110 transition-all z-30 cursor-pointer flex items-center justify-center"
                            title="تغيير صورة البروفيل"
                          >
                             <Camera size={20} className="stroke-white" />
                          </button>
                        )}
                     </div>
                     <div className="flex-1 text-center md:text-right">
                        <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight leading-tight">{t('author_name')}</h2>
                        <p className="text-emerald-400 font-bold mb-8 uppercase tracking-[0.2em] sm:tracking-[0.4em] text-xs sm:text-sm">{t('hero_title')}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 flex-row-reverse">
                           <div className="bg-white/5 px-6 py-3 rounded-xl border border-white/10 text-xs flex items-center gap-2">
                              <Mail size={14} className="text-blue-400" />
                              <span>zaaraayaichia@gmail.com</span>
                           </div>
                           <div className="bg-white/5 px-6 py-3 rounded-xl border border-white/10 text-xs flex items-center gap-2">
                              <span>🇩🇿 وهران، الجزائر</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Sections */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-sm font-arabic leading-relaxed">
                     <div className="space-y-12">
                        <section>
                           <h3 className="text-2xl font-bold mb-6 flex items-center justify-end gap-3 text-emerald-400 border-r-4 border-emerald-500 pr-4">
                              <BookOpen size={24} /> التكوين الأكاديمي
                           </h3>
                           <ul className="space-y-6">
                              <li className="relative pr-6 before:absolute before:right-0 before:top-2 before:w-2 before:h-2 before:bg-blue-500 before:rounded-full">
                                 <p className="font-bold text-white text-lg">شهادة الدكتوراه في الاقتصاد الدولي</p>
                                 <p className="text-white/50 italic mb-2">جامعة وهران 2 محمد بن أحمد</p>
                                 <p className="text-white/70">موضوع الأطروحة: "السياحة المسؤولة لتحقيق التنمية المستدامة في الجزائر: دراسة حالة صحراء الجزائر".</p>
                              </li>
                              <li className="relative pr-6 before:absolute before:right-0 before:top-2 before:w-2 before:h-2 before:bg-blue-500 before:rounded-full text-white/60">
                                 <p className="font-bold text-white">شهادة الماجستير في العلوم الاقتصادية</p>
                                 <p>متخصصة في استراتيجيات التنمية المستدامة.</p>
                              </li>
                           </ul>
                        </section>

                        <section>
                           <h3 className="text-2xl font-bold mb-6 flex items-center justify-end gap-3 text-emerald-400 border-r-4 border-emerald-500 pr-4">
                              <Briefcase size={24} /> الخبرة المهنية
                           </h3>
                           <ul className="space-y-6">
                              <li className="relative pr-6 before:absolute before:right-0 before:top-2 before:w-2 before:h-2 before:bg-blue-500 before:rounded-full">
                                 <p className="font-bold text-white text-lg">أستاذة جامعية متعاقدة</p>
                                 <p className="text-white/50">جامعة وهران 2 | 2022 - حالياً</p>
                                 <p className="text-white/70">تدريس مقاييس الاقتصاد الكلي، السياحة، والتنمية المستدامة.</p>
                              </li>
                              <li className="relative pr-6 before:absolute before:right-0 before:top-2 before:w-2 before:h-2 before:bg-blue-500 before:rounded-full">
                                 <p className="font-bold text-white text-lg">متصرف رئيسي</p>
                                 <p className="text-white/50">مديرية الشؤون الدينية والأوقاف</p>
                                 <p className="text-white/70">الإشراف على التسيير الإداري والمالي والمشاريع الوقفية.</p>
                              </li>
                           </ul>
                        </section>
                     </div>

                     <div className="space-y-12">
                        <section>
                           <h3 className="text-2xl font-bold mb-6 flex items-center justify-end gap-3 text-emerald-400 border-r-4 border-emerald-500 pr-4">
                              <Star size={24} /> المؤلفات والملتقيات العلمية
                           </h3>
                           <div className="space-y-4 text-white/70">
                              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                                 <p className="font-bold text-white">كتاب: Smart Tourisme in Saudi Arabia</p>
                                 <p className="text-xs mt-1">دراسة معمقة في تطبيقات الذكاء الاصطناعي والتكنولوجيا في قطاع السياحة.</p>
                              </div>
                              <p>• المشاركة في أكثر من <span className="text-xl font-bold text-white">30</span> ملتقى علمي دولي ووطني.</p>
                              <p>• باحثة معتمدة في البوابة الوطنية للمجلات العلمية <span className="text-blue-400 font-bold">ASJP</span>.</p>
                              <p>• متخصصة في آداب السائح المسؤول وسلوكيات الاستهلاك المستدام.</p>
                           </div>
                        </section>

                        <section>
                           <h3 className="text-2xl font-bold mb-6 flex items-center justify-end gap-3 text-emerald-400 border-r-4 border-emerald-500 pr-4">
                              <Settings size={24} /> اللغات والمهارات
                           </h3>
                           <div className="flex flex-wrap gap-3 justify-end mb-6">
                              {['تحليل البيانات', 'السياحة الإلكترونية', 'إدارة المشاريع', 'التنمية المستدامة', 'التحليل الإحصائي', 'SPSS'].map(skill => (
                                 <span key={skill} className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 font-bold text-xs">
                                    {skill}
                                 </span>
                              ))}
                           </div>
                           <div className="space-y-2">
                              <div className="flex justify-between flex-row-reverse text-xs">
                                 <span>العربية (اللغة الأم)</span>
                                 <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="w-full h-full bg-emerald-500"></div>
                                 </div>
                              </div>
                              <div className="flex justify-between flex-row-reverse text-xs">
                                 <span>الفرنسية (ممتاز)</span>
                                 <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="w-[90%] h-full bg-emerald-500"></div>
                                 </div>
                              </div>
                              <div className="flex justify-between flex-row-reverse text-xs">
                                 <span>الإنجليزي (جيد جداً)</span>
                                 <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="w-3/4 h-full bg-emerald-500"></div>
                                 </div>
                              </div>
                           </div>
                        </section>
                     </div>
                  </div>
                  
                  <div className="mt-20 pt-10 border-t border-white/5 text-center text-white/30 italic">
                     تم إنشاء هذه السيرة الذاتية لخدمة أغراض البحث العلمي والتواصل المهني
                  </div>
               </div>
            </div>
        </div>
      );
      default: return <HomePage currentUser={user} signInWithGoogle={signInWithGoogle} />;
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-white" size={40} />
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      lang, 
      setLang: (l) => { setLang(l); i18n.changeLanguage(l); }, 
      isDark, 
      toggleDark: () => setIsDark(!isDark) 
    }}>
      <div className={cn(
        "relative min-h-screen font-sans selection:bg-emerald-500 selection:text-white flex flex-col md:flex-row-reverse overflow-hidden transition-all duration-700",
        isDark ? "bg-black" : "bg-slate-50"
      )} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <BackgroundSlider />
        <Navbar currentUser={user} onNavigate={handleNavigate} activeTab={activeTab} signInWithGoogle={signInWithGoogle} />
        
        {isAdminEmail(user?.email) && activeTab !== 'dashboard' && (
          <FloatingDashboardButton onNavigate={setActiveTab} />
        )}

        <FloatingChat currentUser={user} isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        
        <main className="relative z-10 flex-1 overflow-y-auto pt-16 md:pt-0">
          <FloatingSettings />
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${lang}`}
              initial={{ opacity: 0, scale: 0.98, x: lang === 'ar' ? 20 : -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.98, x: lang === 'ar' ? -20 : 20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
        <ThemeSwitcher />

        <AnimatePresence>
          {toast && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={cn(
                "fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 text-white font-bold backdrop-blur-xl border border-white/20",
                toast.type === 'success' ? "bg-emerald-600/90" : "bg-red-600/90"
              )}
            >
              {toast.type === 'success' ? <Star size={20} /> : <X size={20} />}
              <span className="font-arabic">{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ThemeContext.Provider>
  );
}
