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
  Trash2
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
import { useTranslation } from 'react-i18next';
import './i18n';
import { saveAs } from 'file-saver';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utils ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

  const isAdmin = currentUser?.email === 'dalinadjib1990@gmail.com';

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
              className="fixed bottom-[80px] md:bottom-28 right-4 md:right-10 z-[81] w-[calc(100vw-32px)] md:w-[380px] h-[500px] md:h-[550px] bg-slate-950 border border-white/10 rounded-[2.5rem] md:rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
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
                     placeholder="استفسار؟"
                     className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white text-xs focus:ring-1 focus:ring-emerald-500 outline-none text-right placeholder:text-white/20 min-w-0"
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
        className="w-full max-w-6xl relative z-10 flex flex-col items-center text-center"
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
            
            <p className="text-xl md:text-3xl text-white/60 leading-relaxed max-w-4xl mx-auto font-arabic font-medium drop-shadow-xl mb-12 relative z-10">
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

const CommentSection = ({ articleId, currentUser }: { articleId: string, currentUser: any }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // We use a property in the article document instead of subcollection for simplicity and O(1) reads in this context
    const articleRef = doc(db, 'articles', articleId);
    return onSnapshot(articleRef, (snap) => {
      setComments(snap.data()?.comments || []);
    });
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !text.trim()) return;
    setLoading(true);
    try {
      const articleRef = doc(db, 'articles', articleId);
      const newComment = {
        id: Math.random().toString(36).substr(2, 9),
        userId: currentUser.uid,
        userName: currentUser.displayName || 'زائر',
        userPhoto: currentUser.photoURL,
        text,
        createdAt: new Date().toISOString()
      };
      
      const snap = await getDoc(articleRef);
      const existingComments = snap.data()?.comments || [];
      
      await updateDoc(articleRef, {
        comments: [...existingComments, newComment]
      });

      // Add Notification for Admin
      if (currentUser.email !== 'dalinadjib1990@gmail.com') {
        await addDoc(collection(db, 'notifications'), {
          type: 'comment',
          from: currentUser.displayName || currentUser.email,
          articleTitle: snap.data()?.title,
          text: text.substring(0, 50) + '...',
          createdAt: serverTimestamp(),
          read: false
        });
      }

      setText('');
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="mt-6 pt-6 border-t border-white/5 space-y-6">
      <div className="max-h-60 overflow-y-auto space-y-4 pr-3 custom-scrollbar">
        {comments.length === 0 ? (
          <p className="text-white/20 text-xs italic text-center py-4">لا توجد تعليقات بعد. كن أول من يعلق!</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="flex gap-3 flex-row-reverse text-right">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex-shrink-0 overflow-hidden">
                 <img src={c.userPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.userId}`} alt={c.userName} />
              </div>
              <div className="bg-white/5 p-3 rounded-2xl rounded-tr-none flex-1">
                <p className="text-[10px] font-bold text-emerald-400 mb-1">{c.userName}</p>
                <p className="text-xs text-white/70 leading-relaxed">{c.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="relative">
        <input 
          type="text" 
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="أضف تعليقاً..."
          className="w-full bg-slate-950 border border-white/10 rounded-2xl py-3 px-12 text-xs text-white focus:ring-1 focus:ring-emerald-500 outline-none pr-4 text-right"
        />
        <button 
          disabled={loading || !currentUser}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-emerald-500 p-2 disabled:opacity-30"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} className="rotate-180" />}
        </button>
      </form>
    </div>
  );
};

const ArticleCard = ({ article, currentUser, onEdit, onShowToast }: { article: Article, currentUser: any, onEdit?: (article: Article) => void, onShowToast?: (msg: string, type?: 'success' | 'error') => void }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdmin = currentUser?.email === 'dalinadjib1990@gmail.com';

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      alert('يرجى تسجيل الدخول للإعجاب بالمنشور');
      return;
    }
    try {
      const docRef = doc(db, 'articles', article.id);
      await updateDoc(docRef, { likes: (article.likes || 0) + 1 });
      setIsLiked(true);
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
      console.log('Article deleted successfully:', article.id);
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
      const sourceHTML = header + `<h1>${article.title}</h1><div class="content">${article.content}</div>` + footer;
      
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

  return (
    <motion.div 
      layout
      id={`article-content-${article.id}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden group hover:border-emerald-500/30 transition-all flex flex-col h-full"
    >
      {article.imageUrl && (
        <div className="h-64 overflow-hidden relative">
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-rgba(2,6,23,0)" />
          <div className="absolute bottom-4 right-4 bg-emerald-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
            {article.category}
          </div>
        </div>
      )}
      <div className="p-10 text-right flex-1 flex flex-col relative">
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
        <h3 className="text-3xl font-serif text-white font-bold mb-4 line-clamp-2 leading-tight drop-shadow-md">{article.title}</h3>
        <p className="text-white/50 text-sm mb-8 line-clamp-4 leading-relaxed flex-1 font-arabic">{article.content}</p>
        
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
            <button onClick={handleDownloadWord} className="flex items-center gap-2 group/dl bg-white/5 px-4 py-2 rounded-2xl border border-emerald-500/10 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all shadow-lg" title="Download as Word">
              <Download size={16} className="text-white/30 group-hover/dl:text-emerald-400 transition-colors" />
              <span className="text-[10px] font-bold text-white/30 group-hover/dl:text-white/60 uppercase tracking-widest">تنزيل Word</span>
            </button>
          </div>
          <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] font-sans">
             {article.createdAt?.toDate ? article.createdAt.toDate().toLocaleDateString('ar-DZ') : new Date().toLocaleDateString('ar-DZ')}
          </span>
        </div>
        
        <AnimatePresence>
          {showComments && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
              <CommentSection articleId={article.id} currentUser={currentUser} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const ArticlesPage = ({ currentUser, onEditArticle, onShowToast }: { currentUser: any, onEditArticle?: (article: Article) => void, onShowToast?: (msg: string, type?: 'success' | 'error') => void }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setArticles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article)));
      setLoading(false);
    });
  }, []);

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4">
      <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
        {currentUser?.email === 'dalinadjib1990@gmail.com' && (
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('switchTab', { detail: 'dashboard' }))}
            className="order-2 md:order-1 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold shadow-neon flex items-center gap-3 transition-all group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            <span>نشر مقال جديد</span>
          </button>
        )}
        <div className="text-center md:text-right order-1 md:order-2">
          <h2 className="text-5xl md:text-6xl font-serif text-white mb-4 tracking-tight drop-shadow-lg">{t('articles')}</h2>
          <p className="text-white/50 text-lg uppercase tracking-[0.3em] font-sans">
             {t('hero_title')}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-white/50" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map(article => (
            <ArticleCard key={article.id} article={article} currentUser={currentUser} onEdit={onEditArticle} onShowToast={onShowToast} />
          ))}
        </div>
      )}
    </div>
  );
};

const WorksPage = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    return onSnapshot(collection(db, 'works'), (snapshot) => {
      setWorks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Work)));
      setLoading(false);
    });
  }, []);

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-6">
      <div className="mb-16 text-center md:text-right">
        <h2 className="text-5xl md:text-7xl font-serif text-white/95 mb-6 tracking-tight drop-shadow-xl">{t('works')}</h2>
        <div className="h-px w-32 bg-emerald-500/50 mx-auto md:ml-0 md:mr-auto mb-6" />
        <p className="text-white/40 text-sm md:text-lg lg:max-w-2xl md:ml-auto uppercase tracking-widest leading-relaxed">
           عرض للمشاريع البحثية والمؤلفات العلمية في مجال الاقتصاد الدولي والسياحة المسؤولة.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-white" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {works.map(work => (
            <div key={work.id} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 text-right group hover:bg-white/10 transition-all relative overflow-hidden">
               <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full group-hover:bg-emerald-500/20 transition-all" />
               <div className="flex flex-col lg:flex-row-reverse gap-10 relative z-10">
                  <div className="w-full lg:w-48 aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/5">
                    <img src={work.imageUrl} alt={work.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-3xl font-serif text-white/95 mb-6 leading-tight">{work.title}</h3>
                      <p className="text-white/50 leading-relaxed mb-8 text-lg font-arabic">{work.description}</p>
                    </div>
                    <div className="flex items-center justify-end gap-8 border-t border-white/5 pt-6">
                      <div className="flex flex-col items-end">
                        <div className="flex gap-1 text-yellow-500">
                          {[1,2,3,4,5].map(i => <Star key={i} size={18} fill={i <= Math.round(work.rating) ? 'currentColor' : 'none'} />)}
                        </div>
                        <span className="text-[10px] text-white/30 mt-2 uppercase tracking-widest">{work.ratingCount} تقييم</span>
                      </div>
                      <button className="bg-white/10 hover:bg-emerald-600 text-white p-4 rounded-2xl transition-all shadow-lg hover:scale-110">
                        <ArrowRight size={24} className="rotate-180" />
                      </button>
                    </div>
                  </div>
               </div>
            </div>
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
    <div className="pt-32 pb-20 max-w-4xl mx-auto px-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10">
        <h2 className="text-4xl font-bold text-white mb-8 text-right">تواصل معي</h2>
        
        {success ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
             <div className="w-20 h-20 bg-green-500/20 border border-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="text-green-500" size={32} />
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">تم الإرسال بنجاح!</h3>
             <p className="text-white/60 mb-8">سأقوم بالرد عليك في أقرب وقت ممكن.</p>
             <button onClick={() => setSuccess(false)} className="text-blue-400 border border-blue-400 px-6 py-2 rounded-full">إرسال رسالة أخرى</button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-right">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-white/60 block">البريد الإلكتروني</label>
                <input 
                  type="email" required
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all text-right" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/60 block">الإسم الكامل</label>
                <input 
                  type="text" required
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all text-right" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/60 block">الموضوع</label>
              <input 
                type="text" required
                value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all text-right" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/60 block">الرسالة</label>
              <textarea 
                required rows={5}
                value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all text-right resize-none" 
              />
            </div>
            <button 
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

const Dashboard = ({ currentUser, editingArticle, onFinishEdit, onEditArticle, onExport }: { currentUser: any, editingArticle?: Article | null, onFinishEdit?: () => void, onEditArticle?: (article: Article) => void, onExport?: (stats: any) => void }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState({ visitors: 0, likes: 0, comments: 0 });
  const [notifications, setNotifications] = useState<any[]>([]);
  const [newArticle, setNewArticle] = useState({ title: '', content: '', category: 'Tourism', imageUrl: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allArticles, setAllArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (editingArticle) {
       setNewArticle({
         title: editingArticle.title,
         content: editingArticle.content,
         category: editingArticle.category || 'Tourism',
         imageUrl: editingArticle.imageUrl || ''
       });
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

    return () => { unSubMsg(); unSubStats(); unSubNotif(); unSubArticles(); };
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

  const handlePostArticle = async () => {
    if (!newArticle.title || !newArticle.content) return;
    setLoading(true);
    try {
      if (editingArticle) {
        const docRef = doc(db, 'articles', editingArticle.id);
        await updateDoc(docRef, {
          ...newArticle,
          updatedAt: serverTimestamp()
        });
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
             <h3 className="text-2xl font-serif text-white font-bold text-right flex items-center justify-end gap-3">
                <span className="text-emerald-400"><Plus size={24} /></span>
                إنشاء منشور جديد (مقال، بحث، أو خاطرة مصورة)
             </h3>
             <div className="space-y-6 relative z-10">
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

       {/* Articles Management */}
        <div className="mt-12 bg-slate-900 border border-white/10 rounded-[3rem] p-10 shadow-2xl">
           <h3 className="text-2xl font-serif text-white mb-8 text-right flex items-center justify-end gap-3">
              <span className="text-emerald-400 font-black">إدارة المحتوى</span>
              <BookOpen size={24} />
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
           </div>
        </div>
    </div>
  );
};

const FloatingSettings = () => {
  const { lang, setLang, isDark, toggleDark } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);

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
                    onClick={() => { setLang(l); setIsOpen(false); }}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-between",
                      lang === l ? "bg-emerald-500 text-white" : "text-white/40 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <span>{l === 'ar' ? 'العربية' : l === 'en' ? 'English' : 'Français'}</span>
                    <span className="text-[10px opacity-50">{l.toUpperCase()}</span>
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
  if (currentUser?.email !== 'dalinadjib1990@gmail.com' || activeTab === 'dashboard') return null;
  
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
      alert(t('upload_success') || 'تم الرفع بنجاح');
      console.log('New Profile Image URL:', url);
    } catch (err) {
      console.error(err);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomePage currentUser={user} signInWithGoogle={signInWithGoogle} />;
      case 'articles': return <ArticlesPage currentUser={user} onEditArticle={handleEditArticle} onShowToast={showToast} />;
      case 'works': return <WorksPage />;
      case 'contact': return <ContactPage />;
      case 'dashboard': return user?.email === 'dalinadjib1990@gmail.com' ? <Dashboard currentUser={user} editingArticle={editingArticle} onEditArticle={handleEditArticle} onFinishEdit={finishEdit} onExport={(stats) => downloadStatsWord(stats)} /> : <HomePage currentUser={user} signInWithGoogle={signInWithGoogle} />;
      case 'cv': return (
        <div className="pt-24 md:pt-32 pb-20 max-w-5xl mx-auto px-4">
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
                  <div className="flex flex-col md:flex-row-reverse items-center gap-10 mb-20">
                     <div className="relative w-48 h-48 md:w-56 md:h-56">
                        <div className="absolute inset-0 rounded-full neon-border shadow-[0_0_30px_rgba(0,243,255,0.3)] animate-pulse" />
                        <div className="absolute inset-2 rounded-full overflow-hidden border-2 border-white/20 bg-slate-800">
                           <img 
                             src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop" 
                             alt="Dr Zaara" 
                             className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                           />
                        </div>
                     </div>
                     <div className="flex-1 text-center md:text-right">
                        <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight">{t('author_name')}</h2>
                        <p className="text-emerald-400 font-bold mb-8 uppercase tracking-[0.4em] text-sm">{t('hero_title')}</p>
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
                              {['تحليل البيانات', 'الاقتصاد القياسي', 'إدارة المشاريع', 'التنمية المستدامة', 'EViews', 'SPSS'].map(skill => (
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
        
        {user?.email === 'dalinadjib1990@gmail.com' && activeTab !== 'dashboard' && (
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
