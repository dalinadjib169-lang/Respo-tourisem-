import { Timestamp } from 'firebase/firestore';

export interface Publication {
  id: string;
  title: string;
  titleEn?: string;
  titleFr?: string;
  authors: string;
  authorsEn?: string;
  date: string;
  abstract: string;
  abstractEn?: string;
  abstractFr?: string;
  keywords: string[];
  category: string;
  categoryEn: string;
  categoryFr: string;
  imageUrl: string;
  likes: number;
  journal?: string;
  pages?: string;
  issn?: string;
  submissionDate?: string;
  acceptanceDate?: string;
  publicationDate?: string;
}

export const DR_YAI_PUBLICATIONS: Publication[] = [
  {
    id: "pub-1",
    title: "السياحة المسؤولة حل نموذجي لتفشي السياحة المفرطة - دراسة حالة مدينة برشلونة خلال الفترة 2018-2023",
    titleEn: "Responsible Tourism as an Exemplary Solution to Excessive Tourism: Case Study of Barcelona (2018-2023)",
    titleFr: "Le Tourisme Responsable comme Solution Exemplaire au Surtourisme : Étude de Cas de Barcelone (2018-2023)",
    authors: "عيايشية زعرة . قادة قدور بن عباد .",
    authorsEn: "Ayaichia Zaara . Kada Kaddour Ben Abbad .",
    date: "2024-11-11",
    category: "السياحة المسؤولة",
    categoryEn: "Responsible Tourism",
    categoryFr: "Tourisme Responsable",
    imageUrl: "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&q=80&w=800",
    likes: 54,
    keywords: ["السياحة المفرطة", "كوفيد", "Airbnb", "السياحة المسؤولة", "تجربة برشلونة"],
    abstract: `تهدف هذه الورقة البحثية لتناول موضوع غاية في الحساسية والأهمية والذي أخذ صدى إعلاميا واسعا في العالم الغربي والعربي على حد السواء، وهو ظاهرة السياحة المفرطة المتفشية في جملة من الدول الأوروبية كالبندقية، وفينيس، وباريس وغيرها، والتي حذرت المنظمة العالمية للسياحة من توسع انتشارها لتطال كافة دول العالم مع اقتراب سنة 2030، واهتمت دراستنا بتناول مدينة برشلونة الإسبانية، التي عادت الظاهرة للاستفحال فيها بقوة مؤخرا، بعد الخروج من أزمة كوفيد-19، كرد فعل عالمي انتقامي على حالة الحجر الصحي، والغلق الكامل للمطارات والموانئ، وفرض مسافات التباعد لتجاوز الأزمة، ما كان سببا في تشجيع المدينة الكتالونية "برشلونة" على ضرورة انتهاج التوجه السياحي المسؤول كحل نموذجي، واستراتيجي، للتقليل من الآثار السلبية التي خلفتها السياحة المفرطة على هذه الوجهة السياحية الفريدة ذات المعالم الخالدة.`,
    abstractEn: `This research paper aims to address a very sensitive and important topic that has received widespread media resonance in the Western and Arab world alike, which is the phenomenon of excessive tourism that is widespread in a number of European countries such as Venice, Paris, and others, and which the World Tourism Organization has warned of expanding its spread to affect all countries of the world as the year 2030 approaches. Our study focused on examining the Spanish city of Barcelona, where the phenomenon has become increasingly widespread recently after emerging from the Covid-19 crisis as a global response to the quarantine, the complete closure of airports and ports, and the imposition of social distancing to overcome the crisis. What was the reason for encouraging the Catalan city "Barcelona" to adopt a responsible tourism approach as an exemplary and strategic solution to reduce the negative effects left by excessive tourism on this unique tourist destination with eternal landmarks.`
  },
  {
    id: "pub-2",
    title: "The Responsible Tourism Orientation Of Adrir Amlal Hotel Creates Sustainable Development In Siwa",
    titleEn: "The Responsible Tourism Orientation Of Adrir Amlal Hotel Creates Sustainable Development In Siwa",
    titleFr: "L'orientation du Tourisme Responsable de l'Hôtel Adrir Amlal Crée un Développement Durable à Siwa",
    authors: "عيايشية زعرة . قادة قدور بن عباد .",
    authorsEn: "Ayaichia Zaara . Kada Kaddour Ben Abbad .",
    date: "2024-12-20",
    category: "التنمية المستدامة",
    categoryEn: "Sustainable Development",
    categoryFr: "Développement Durable",
    imageUrl: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&q=80&w=800",
    likes: 47,
    keywords: ["sustainable development", "responsible tourism", "Adrir Amlal Hotel", "Siwa Oasis"],
    abstract: `This paper aims to identify the experience of the Adrir Amlal Hotel, which applies responsible tourism ethics through its sustainable exterior and interior design, food quality, and its keenness to involve the local community in the hotel's tourism activity. Finally, we concluded that the experience of the Adrir Amlal Hotel is able to create sustainable development in an oasis that was isolated from the world by ensuring good communication between locals and tourists, creating permanent job opportunities, returning to local resources, whether labour or building materials, which revived the local economy, and paying attention to preserving the authentic Siamese architectural character.`,
    abstractFr: `Cet article vise à identifier l'expérience de l'hôtel Adrir Amlal, qui applique l'éthique du tourisme responsable à travers sa conception extérieure et intérieure durable, la qualité de sa nourriture et son souci d'impliquer la communauté locale dans l'activité touristique de l'hôtel. Enfin, nous avons conclu que l'expérience de l'Hôtel Adrir Amlal est capable de créer un développement durable dans une oasis isolée du monde en assurant une bonne communication entre locaux et touristes, en créant des opportunités d'emploi permanentes, en retournant aux ressources locales, qu'il s'agisse de main-d'œuvre ou de matériaux de construction, ce qui a relancé l'économie locale, et en veillant à préserver l'authentique caractère architectural siwi.`
  },
  {
    id: "pub-3",
    title: "The Reality Of Digitization In Local Communities In Algeria - A Case Study Of Digitizing Human Resource Management At Souk Ahras Municipality",
    titleEn: "The Reality Of Digitization In Local Communities In Algeria - A Case Study Of Digitizing Human Resource Management At Souk Ahras Municipality",
    titleFr: "La Réalité de la Numérisation dans les Collectivités Locales en Algérie - Étude de Cas de la Numérisation de la Gestion des Ressources Humaines à la Municipalité de Souk Ahras",
    authors: "عيايشية زعرة . دغرير فتحي .",
    authorsEn: "Ayaichia Zaara . Daghrir Fathi .",
    date: "2024-12-15",
    category: "الإدارة الرقمية",
    categoryEn: "Digital Management",
    categoryFr: "Gestion Numérique",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    likes: 39,
    keywords: ["Digitization", "Municipality", "Human Resources Management", "Souk Ahras"],
    abstract: `This study aims to identify the results achieved by the municipality of Souk Ahras in adapting to current digital requirements by digitizing its administrative departments, particularly human resources management. The study focused on transitioning from traditional to digital management, with the goal of improving and speeding up service quality while reducing paperwork. The research problem addressed how the municipality was able to generalize digitization to improve service quality in various human resources offices. The study adopted a descriptive-analytical approach, interviews, and a case study. The findings revealed that the municipality successfully improved communication between administration, employees, and citizens, increased service efficiency by reducing traditional record-keeping, and enhanced transparency.`,
    abstractFr: `Cette étude vise à identifier les résultats obtenus par la commune de Souk Ahras dans l'adaptation aux exigences numériques actuelles en numérisant ses services administratifs, notamment la gestion des ressources humaines. L'étude s'est concentrée sur la transition d'une gestion traditionnelle vers une gestion numérique, dans le but d'améliorer et d'accélérer la qualité des services tout en réduisant la paperasse. La problématique de recherche portait sur la manière dont la municipalité a pu généraliser la numérisation pour améliorer la qualité du service dans les différents bureaux des ressources humaines. L'étude a adopté une approche descriptive-analytique, des entretiens et une étude de cas. Les résultats ont révélé que la municipalité a réussi à améliorer la communication entre l'administration, les employés et les citoyens, à accroître l'efficacité des services en réduisant la tenue de registres traditionnels et à renforcer la transparence.`
  },
  {
    id: "pub-4",
    title: "The Impact Of U.S. Border And Economic Policies On International Tourism To The United States (2024–2025)",
    titleEn: "The Impact Of U.S. Border And Economic Policies On International Tourism To The United States (2024–2025)",
    titleFr: "L'impact des Politiques Frontalières et Économiques Américaines sur le Tourisme International vers les États-Unis (2024-2025)",
    authors: "عيايشية زعرة .",
    authorsEn: "Ayaichia Zaara .",
    date: "2025-12-30",
    category: "سياسات سياحية",
    categoryEn: "Tourism Policy",
    categoryFr: "Politique du Tourisme",
    imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80&w=800",
    likes: 42,
    keywords: ["International tourism", "United States", "border policies", "trade tensions", "visa procedures"],
    abstract: `This study examines the noticeable decline in international tourist arrivals to the United States in 2024 and 2025, despite global economic recovery from the COVID-19 pandemic. The decline is largely attributed to shifts in U.S. political and economic policies, particularly stricter border controls, altered visa issuance criteria, trade tensions, and increased restrictions on specific traveler categories. Using a descriptive-analytical approach, the study relies on official data from recognized institutions, travel advisories from several foreign governments, and a comparative analysis of travel flows between 2024 and 2025. Although these policies aim to protect national security and boost the domestic economy, they have had unintended consequences on international tourism and related sectors such as employment, services, and air transport. The findings suggest that pursuing national interests does not inherently conflict with openness to global tourism. The study recommends adopting a balanced policy approach that considers both security and economic goals while preserving the United States’ status as an attractive global destination.`
  },
  {
    id: "pub-5",
    title: "Digital Platforms Like Airbnb Stimulate The Local Economy In Rural Areas Of France For The Year 2023.",
    titleEn: "Digital Platforms Like Airbnb Stimulate The Local Economy In Rural Areas Of France For The Year 2023.",
    titleFr: "Les Plateformes Numériques comme Airbnb Stimulent l'Économie Locale dans les Zones Rurales de France pour l'Année 2023.",
    authors: "عيايشية زعرة . دغرير فتحي .",
    authorsEn: "Ayaichia Zaara . Daghrir Fathi .",
    date: "2024-12-19",
    category: "اقتصاد ريفي",
    categoryEn: "Rural Economy",
    categoryFr: "Économie Rurale",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800",
    likes: 48,
    keywords: ["Digital Platforms", "Airbnb", "Rural economy", "France"],
    abstract: `The research paper examines the economic impact of short-term rentals in rural France via platforms like Airbnb in 2023. Through the analysis of available statistics, it was found that these platforms have contributed to the flourishing of rural areas in France due to their effective strategies and support and funding programs that have benefited French rural regions, leading to positive economic growth for French rural communities.`,
    abstractFr: `Cet article examine l'impact économique des locations de courte durée en France rurale via des plateformes comme Airbnb en 2023. Grâce à l'analyse des statistiques disponibles, il s'avère que ces plateformes ont contribué à l'épanouissement des zones rurales en France grâce à leurs stratégies efficaces, ainsi qu'aux programmes de soutien et de financement qui ont bénéficié aux régions rurales françaises, entraînant une croissance économique positive pour les communautés rurales françaises.`
  },
  {
    id: "pub-6",
    title: "Étude des principales causes d'échec des start-ups dans le monde en 2024-2025 : étude de cas de l'Inde",
    titleEn: "Study of the Main Causes of Startup Failure Worldwide in 2024-2025: A Case Study of India",
    titleFr: "Étude des principales causes d'échec des start-ups dans le monde en 2024-2025 : étude de cas de l'Inde",
    authors: "عيايشية زعرة . إيخلف رشيدة . براهمي آسيا .",
    authorsEn: "Ayaichia Zaara . Imekhelaf Rachida . Brahmi Assia .",
    date: "2025-08-25",
    category: "ريادة الأعمال",
    categoryEn: "Entrepreneurship & Startups",
    categoryFr: "Sartups & Entrepreneuriat",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
    likes: 62,
    keywords: ["Startups", "Failure causes", "India", "Innovation", "Success factors", "LARAFIT Lab"],
    journal: "ZAOULI N°10, Vol. 8, Août 2025",
    pages: "pp. 356-382",
    issn: "2788-9343",
    submissionDate: "2025-04-13",
    acceptanceDate: "2025-07-09",
    publicationDate: "2025-08-25",
    abstract: `دراسة تحليلية للاعتراف بظروف وعوامل الفشل والتراجع الأكثر تكراراً للمؤسسات الناشئة عالمياً، مع التركيز المعمق على الهند دراسة حالة لامتلاكها ثالث أكبر نظام بيئي للشركات الناشئة في العالم 2025 بعدة مؤشرات تم الإفصاح عنها من خلال تقارير رسمية صادرة عن NASSCOM ووزارة التجارة والصناعة الهندية DPIIT. يهدف هذا البحث إلى صياغة نموذج تشخيصي لرواد الأعمال والمستثمرين وصناع القرار للتنبؤ بعلامات الفشل مبكراً وتلافيها لبناء بيئة ريادية صلبة ومرنة ومستدامة.`,
    abstractEn: `This study focuses on examining the main causes of startup failure globally during the 2024–2025 period, using India as a prime case study. As the world's third-largest startup ecosystem, India experienced rapid growth in recognized startups, offering an ideal sample for studying the challenges faced by new ventures. Based on official data from NASSCOM and India’s Department for Promotion of Industry and Internal Trade (DPIIT), the study identifies recurring failure reasons, including poor product-market fit, lack of funding, weak management, and ineffective marketing strategies. The paper serves as an actionable guide to help entrepreneurs and investors make resilient decisions.`,
    abstractFr: `Cette recherche consiste en une analyse ciblée des principales causes d'échec des start-ups à l'échelle mondiale au cours de la période 2024-2025, avec un accent particulier sur l'Inde comme étude de cas. Troisième écosystème de start-ups au monde, l'Inde a connu une croissance rapide du nombre de start-ups reconnues, ce qui en fait un modèle approprié pour étudier les défis auxquels sont confrontées les nouvelles entreprises. La recherche s'appuie sur des données quantitatives et qualitatives de sources officielles telles que les rapports de la NASSCOM et du ministère indien du Commerce et de l'Industrie (DPIIT). L'étude identifie les raisons récurrentes de l'échec (marché, finance, management, etc.) et propose un guide pratique pour consolider leur résilience de survie.`
  },
  {
    id: "pub-7",
    title: "السياحة المسؤولة لتحقيق التنمية المستدامة في الجزائر: دراسة حالة صحراء الجزائر (أطروحة دكتوراه)",
    titleEn: "Responsible Tourism for Achieving Sustainable Development in Algeria: Case Study of the Algerian Sahara (Doctoral Thesis)",
    titleFr: "Le Tourisme Responsable pour Réaliser le Développement Durable en Algérie : Étude de Cas du Sahara Algérien (Thèse de Doctorat)",
    authors: "د. عيايشية زعرة",
    authorsEn: "Dr. Zaara Ayaichia",
    date: "2024-05-15",
    category: "أطروحة دكتوراه",
    categoryEn: "Doctoral Thesis",
    categoryFr: "Thèse de Doctorat",
    imageUrl: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&q=80&w=800",
    likes: 78,
    keywords: ["صحراء الجزائر", "السياحة المسؤولة", "التنمية المستدامة", "السياحة الصحراوية", "أطروحة دكتوراه"],
    journal: "جامعة وهران 2 محمد بن أحمد",
    pages: "الصفحات 1-412 (أطروحة كاملة)",
    issn: "N/A",
    submissionDate: "2023-11-10",
    acceptanceDate: "2024-04-02",
    publicationDate: "2024-05-15",
    abstract: `تبحث هذه الأطروحة الأكاديمية لنيل شهادة الدكتوراه في الاقتصاد الدولي في الإمكانيات الكامنة لقطاع السياحة الصحراوية بالجزائر وكيفية توظيفه لتحقيق تنمية مستدامة حقيقية. تتمحور الدراسة حول ركيزتين أساسيتين: أولاً، تقييم الوضع البيئي والاجتماعي والاقتصادي الحالي في واحات وصحراء الجزائر، وثانياً، اقتراح نموذج حركي متكامل لتبني "السياحة المسؤولة". يسلط البحث الضوء على مخرجات ميدانية تؤكد أن دمج السكان المحليين وحماية الهوية الثقافية والمعمارية لواحات مثل تاغيت، وجانت، والوادي، هو الضامن الأوحد لتدفق استثماري مستدام وحماية الثروة الطبيعية الشاسعة للجنوب الجزائري.`,
    abstractEn: `This doctoral dissertation explores the strategic pathways of using responsible tourism in the Algerian Sahara to achieve robust and sustainable economic growth. Focusing on ecological preservation and local community engagement in scenic desert destinations like Taghit, Djanet, and El Oued, the study designs a comprehensive systems-dynamics model indicating how community-based responsible travel policies act as a multiplier for regional GDP, employment, and preservation of natural and cultural resources.`,
    abstractFr: `Cette thèse de doctorat aborde les perspectives d'intégration du tourisme responsable comme levier structurant pour le développement durable du Sahara algérien. En analysant les écosystèmes oasiens et désertiques de Taghit, Djanet et d'El Oued, cette recherche examine l'incidence socio-économique et écologique des flux touristiques. Elle propose un modèle de gestion partenariale qui préserve la biodiversité, valorise le patrimoine saharien et garantit des retombées directes pour les communautés locales.`
  }
];
