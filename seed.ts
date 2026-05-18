import { db } from './src/lib/firebase';
import { collection, addDoc, doc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

const ARTICLES = [
  {
    title: "مستقبل السياحة البيئية في الصحراء الجزائرية",
    excerpt: "دراسة حول كيفية موازنة نمو السياحة مع الحفاظ على التجمعات البيئية الهشة في المناطق الصحراوية.",
    content: "محتوى المقال يتحدث عن التحديات والحلول المقترحة...",
    category: "بيئة",
    imageUrl: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&q=80&w=800",
    likes: 24,
    createdAt: Timestamp.now(),
    authorId: "dalinadjib1990@gmail.com"
  },
  {
    title: "التنمية المستدامة والمجتمعات المحلية",
    excerpt: "كيف يمكن للسياحة أن تكون محركاً للتنمية الاقتصادية والاجتماعية في القرى النائية.",
    content: "السياحة المسؤولة ليست فقط عن البيئة، بل عن الناس أيضاً...",
    category: "تنمية",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
    likes: 18,
    createdAt: Timestamp.now(),
    authorId: "dalinadjib1990@gmail.com"
  }
];

const WORKS = [
  {
    title: "أطروحة الدكتوراه: السياحة المسؤولة في المغرب العربي",
    description: "بحث استقصائي معمق يحلل السياسات السياحية وتأثيرها على المقاصد الطبيعية.",
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800",
    rating: 4.8,
    ratingCount: 15,
    category: "بحث"
  },
  {
    title: "مشروع 'GreenTrails': مسارات مشي صديقة للبيئة",
    description: "مبادرة لتصميم خرائط سياحية تعتمد على المشي لتقليل البصمة الكربونية.",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800",
    rating: 4.5,
    ratingCount: 32,
    category: "مشروع"
  }
];

export const seedData = async () => {
  try {
    // Initialize stats
    await setDoc(doc(db, 'stats', 'global'), { visitors: 0 });

    for (const article of ARTICLES) {
      await addDoc(collection(db, 'articles'), article);
    }
    for (const work of WORKS) {
      await addDoc(collection(db, 'works'), work);
    }
    console.log('Seed data added successfully');
  } catch (err) {
    console.error('Error seeding data:', err);
  }
};
