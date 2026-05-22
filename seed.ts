import { db } from './src/lib/firebase';
import { collection, addDoc, doc, setDoc, Timestamp } from 'firebase/firestore';

const ARTICLES = [
  {
    title: "السياحة المسؤولة حل نموذجي لتفشي السياحة المفرطة - دراسة حالة مدينة برشلونة خلال الفترة 2018-2023",
    excerpt: "تهدف هذه الورقة البحثية لتناول ظاهرة السياحة المفرطة المتفشية في جملة من الدول الأوروبية ومقارنة تجربة برشلونة في انتهاج السياحة المسؤولة كحل استراتيجي للحد من آثارها السلبية.",
    content: "الملخص:\nتهدف هذه الورقة البحثية لتناول موضوع غاية في الحساسية والأهمية والذي أخذ صدى إعلاميا واسعا في العالم الغربي والعربي على حد السواء، وهو ظاهرة السياحة المفرطة المتفشية في جملة من الدول الأوروبية كالبندقية، وفينيس، وباريس وغيرها، والتي حذرت المنظمة العالمية للسياحة من توسع انتشارها لتطال كافة دول العالم مع اقتراب سنة 2030، واهتمت دراستنا بتناول مدينة برشلونة الإسبانية، التي عادت الظاهرة للاستفحال فيها بقوة مؤخرا، بعد الخروج من أزمة كوفيد-19، كرد فعل عالمي انتقامي على حالة الحجر الصحي، والغلق الكامل للمطارات والموانئ، وفرض مسافات التباعد لتجاوز الأزمة، ما كان سببا في تشجيع المدينة الكتالونية 'برشلونة' على ضرورة انتهاج التوجه السياحي المسؤول كحل نموذجي، واستراتيجي، للتقليل من الآثار السلبية التي خلفتها السياحة المفرطة على هذه الوجهة السياحية الفريدة ذات المعالم الخالدة.\n\nالكلمات المفتاحية:\nالسياحة المفرطة ; كوفيد ; Airbnb ; السياحة المسؤولة ; تجربة برشلونة",
    category: "السياحة المسؤولة",
    imageUrl: "https://images.unsplash.com/photo-1583422409516-2895a77efedd?auto=format&fit=crop&q=80&w=800",
    likes: 54,
    createdAt: Timestamp.fromDate(new Date('2024-11-11')),
    authorId: "dalinadjib1990@gmail.com"
  },
  {
    title: "The Responsible Tourism Orientation Of Adrir Amlal Hotel Creates Sustainable Development In Siwa",
    excerpt: "This paper identifies the experience of the Adrir Amlal Hotel in Siwa Oasis, Egypt, applying responsible tourism ethics through its sustainable design and community integration.",
    content: "Abstract:\nThis paper aims to identify the experience of the Adrir Amlal Hotel, which applies responsible tourism ethics through its sustainable exterior and interior design, food quality, and its keenness to involve the local community in the hotel's tourism activity. Finally, we concluded that the experience of the Adrir Amlal Hotel is able to create sustainable development in an oasis that was isolated from the world by ensuring good communication between locals and tourists, creating permanent job opportunities, returning to local resources, whether labour or building materials, which revived the local economy, and paying attention to preserving the authentic Siamese architectural character.\n\nKeywords:\nsustainable development ; responsible tourism ; Adrir Amlal Hotel ; Siwa Oasis",
    category: "التنمية المستدامة",
    imageUrl: "https://images.unsplash.com/photo-1547984609-44d32d02a90d?auto=format&fit=crop&q=80&w=800",
    likes: 47,
    createdAt: Timestamp.fromDate(new Date('2024-12-20')),
    authorId: "dalinadjib1990@gmail.com"
  },
  {
    title: "The Reality Of Digitization In Local Communities In Algeria - A Case Study Of Digitizing Human Resource Management At Souk Ahras Municipality",
    excerpt: "This study aims to identify the results achieved by the municipality of Souk Ahras in adapting to digital requirements by digitizing its administrative departments, particularly HR.",
    content: "Abstract:\nThis study aims to identify the results achieved by the municipality of Souk Ahras in adapting to current digital requirements by digitizing its administrative departments, particularly human resources management. The study focused on transitioning from traditional to digital management, with the goal of improving and speeding up service quality while reducing paperwork. The research problem addressed how the municipality was able to generalize digitization to improve service quality in various human resources offices. The study adopted a descriptive-analytical approach, interviews, and a case study. The findings revealed that the municipality successfully improved communication between administration, employees, and citizens, increased service efficiency by reducing traditional record-keeping, and enhanced transparency.\n\nKeywords:\nDigitization ; Municipality ; Human Resources Management ; Souk Ahras",
    category: "الإدارة الرقمية",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    likes: 39,
    createdAt: Timestamp.fromDate(new Date('2024-12-15')),
    authorId: "dalinadjib1990@gmail.com"
  },
  {
    title: "The Impact Of U.S. Border And Economic Policies On International Tourism To The United States (2024–2025)",
    excerpt: "This study examines the noticeable decline in international tourist arrivals to the United States in 2024 and 2025 due to shifts in U.S. political and economic policies.",
    content: "Abstract:\nThis study examines the noticeable decline in international tourist arrivals to the United States in 2024 and 2025, despite global economic recovery from the COVID-19 pandemic. The decline is largely attributed to shifts in U.S. political and economic policies, particularly stricter border controls, altered visa issuance criteria, trade tensions, and increased restrictions on specific traveler categories. Using a descriptive-analytical approach, the study relies on official data from recognized institutions, travel advisories from several foreign governments, and a comparative analysis of travel flows between 2024 and 2025. Although these policies aim to protect national security and boost the domestic economy, they have had unintended consequences on international tourism and related sectors such as employment, services, and air transport. The findings suggest that pursuing national interests does not inherently conflict with openness to global tourism. The study recommends adopting a balanced policy approach that considers both security and economic goals while preserving the United States’ status as an attractive global destination.\n\nKeywords:\nInternational tourism ; United States ; border policies ; trade tensions ; visa procedures",
    category: "سياسات سياحية",
    imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80&w=800",
    likes: 42,
    createdAt: Timestamp.fromDate(new Date('2025-12-30')),
    authorId: "dalinadjib1990@gmail.com"
  },
  {
    title: "Digital Platforms Like Airbnb Stimulate The Local Economy In Rural Areas Of France For The Year 2023",
    excerpt: "The research paper examines the economic impact of short-term rentals in rural France via platforms like Airbnb in 2023.",
    content: "Abstract:\nThe research paper examines the economic impact of short-term rentals in rural France via platforms like Airbnb in 2023. Through the analysis of available statistics, it was found that these platforms have contributed to the flourishing of rural areas in France due to their effective strategies and support and funding programs that have benefited French rural regions, leading to positive economic growth for French rural communities.\n\nKeywords:\nDigital Platforms ; Airbnb ; Rural economy ; France",
    category: "اقتصاد ريفي",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800",
    likes: 48,
    createdAt: Timestamp.fromDate(new Date('2024-12-19')),
    authorId: "dalinadjib1990@gmail.com"
  },
  {
    title: "Étude des principales causes d'échec des start-ups dans le monde en 2024-2025 : étude de cas de l'Inde",
    excerpt: "Analyse ciblée des principales causes d'échec des start-ups à l'échelle mondiale au cours de la période 2024-2025, avec un accent particulier sur l'Inde.",
    content: "Résumé (French):\nCet article s'intitule 'Étude des principales causes d'échec des start-ups dans le monde en 2024-2025 : étude de cas de l'Inde'. Il s'agit d'une analyse ciblée des principales causes d'échec des start-ups à l'échelle mondiale au cours de la période 2024-2025, avec un accent particulier sur l'Inde comme étude de cas. Troisième écosystème de start-ups au monde, l'Inde a connu une croissance rapide du nombre de start-ups reconnues, ce qui en fait un modèle approprié pour étudier les défis auxquels sont confrontées les nouvelles entreprises. La recherche s'appuie sur des données quantitatives et qualitatives provenant de sources officielles telles que les rapports de la NASSCOM et du ministère indien du Commerce et de l'Industrie (DPIIT), ainsi que sur des statistiques mondiales sur les taux d'échec des start-ups. L'étude identifie les raisons récurrentes de l'échec, telles que l'inadéquation entre le produit et le marché, le manque de financement, la faiblesse de la gestion et l'inefficacité des stratégies de marketing.\n\nIntroduction:\nAmid rapid economic transformations and successive technological revolutions, startups have emerged as a key engine for innovation and economic growth worldwide. By 2025, the number of startups is estimated to reach around 150 million globally, with approximately 50 million launched annually. However, statistics indicate that nearly 90% of startups fail within their early years due to reasons such as poor product-market fit, lack of funding, weak management, and ineffective marketing strategies.\n\nJournal Specs:\nZAOULI N°10, Vol. 8, Août 2025, pp. 356-382 ISSN : 2788-9343\nSoumission : 13/04/2025 Acceptation : 09/07/2025 Publication : 25/08/2025",
    category: "ريادة الأعمال",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
    likes: 62,
    createdAt: Timestamp.fromDate(new Date('2025-08-25')),
    authorId: "dalinadjib1990@gmail.com"
  }
];

const WORKS = [
  {
    title: "السياحة المسؤولة حل نموذجي لتفشي السياحة المفرطة - برشلونة",
    description: "دراسة استقصائية لسياسات السياحة المستدامة والمسؤولة لمدينة برشلونة من 2018 إلى 2023 كاستجابة وقائية لظاهرة السياحة المفرطة.",
    imageUrl: "https://images.unsplash.com/photo-1583422409516-2895a77efedd?auto=format&fit=crop&q=80&w=800",
    rating: 4.9,
    ratingCount: 24,
    category: "دراسة حالة"
  },
  {
    title: "Adrir Amlal Hotel & Sustainable Development in Siwa",
    description: "An intensive research study analyzing how native architectural principles, resource management, and local labor create true sustainable growth in Egypt's Siwa Oasis.",
    imageUrl: "https://images.unsplash.com/photo-1547984609-44d32d02a90d?auto=format&fit=crop&q=80&w=800",
    rating: 4.7,
    ratingCount: 18,
    category: "سياحة مستدامة"
  },
  {
    title: "Digitization of HR at Souk Ahras Municipality",
    description: "Examining transitional administrative parameters, communication enhancements, and organizational transparency as results of HR digitization in Souk Ahras, Algeria.",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    rating: 4.8,
    ratingCount: 19,
    category: "الإدارة المحلية"
  },
  {
    title: "U.S. Border Security vs. International Tourism Influx",
    description: "Analytical research of the direct correlation between geopolitical border decisions, visa requirements, trade wars, and the decline of transatlantic travel metrics in 2024-2025.",
    imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80&w=800",
    rating: 4.5,
    ratingCount: 11,
    category: "سياسات اقتصادية"
  },
  {
    title: "Rural French Economies and Digital Rental Platforms",
    description: "Statistical and financial analysis evaluating French countrysides, funded region programs, and rural stimulation brought by Airbnb rentals in 2023.",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800",
    rating: 4.6,
    ratingCount: 15,
    category: "اقتصاد ريفي"
  },
  {
    title: "Causes d'échec des start-ups dans le monde : Cas de l'Inde",
    description: "Étude statistique et structurelle sur les raisons d'échec des start-ups en Inde, y compris le produit-marché, le capital financier, la gestion opérationnelle et le design marketing.",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
    rating: 4.9,
    ratingCount: 32,
    category: "ريادة الأعمال"
  }
];

export const seedData = async () => {
  try {
    // Initialize stats
    await setDoc(doc(db, 'stats', 'global'), { visitors: 1420 });

    for (const article of ARTICLES) {
      await addDoc(collection(db, 'articles'), article);
    }
    for (const work of WORKS) {
      await addDoc(collection(db, 'works'), work);
    }
    console.log('Seed data added successfully!');
  } catch (err) {
    console.error('Error seeding data:', err);
  }
};
