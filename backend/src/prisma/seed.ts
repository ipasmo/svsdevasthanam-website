import { PrismaClient, UserRole, PageStatus, PoojaType, DayType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Admin Users ──────────────────────────────────────────────────────────
  // A cloud database must never get the well-known local default password.
  const seedPassword = process.env.SEED_ADMIN_PASSWORD?.trim();
  if (!seedPassword && process.env.NODE_ENV === 'production') {
    throw new Error('SEED_ADMIN_PASSWORD must be set when seeding with NODE_ENV=production');
  }
  if (seedPassword && seedPassword.length < 12) {
    throw new Error('SEED_ADMIN_PASSWORD must be at least 12 characters');
  }
  const passwordHash = await bcrypt.hash(seedPassword || 'Admin@123', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@srivenkatasai.org' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@srivenkatasai.org',
      password: passwordHash,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  const contentEditor = await prisma.user.upsert({
    where: { email: 'editor@srivenkatasai.org' },
    update: {},
    create: {
      name: 'Content Editor',
      email: 'editor@srivenkatasai.org',
      password: passwordHash,
      role: UserRole.CONTENT_EDITOR,
      isActive: true,
    },
  });

  const financeAdmin = await prisma.user.upsert({
    where: { email: 'finance@srivenkatasai.org' },
    update: {},
    create: {
      name: 'Finance Admin',
      email: 'finance@srivenkatasai.org',
      password: passwordHash,
      role: UserRole.FINANCE_ADMIN,
      isActive: true,
    },
  });

  console.log(`✅ Users created: ${superAdmin.email}, ${contentEditor.email}, ${financeAdmin.email}`);

  // ─── Pages ────────────────────────────────────────────────────────────────
  const pages = [
    { slug: 'home', titleEn: 'Home', content: 'Welcome to Sri Venkata Sai Devasthanam.' },
    { slug: 'about', titleEn: 'About', content: 'Sri Venkata Sai Devasthanam is located in Yemmiganur, Kurnool District, Andhra Pradesh.' },
    { slug: 'poojas', titleEn: 'Poojas & Sevas', content: 'Daily poojas and special sevas performed at the temple.' },
    { slug: 'festivals', titleEn: 'Festivals', content: 'Annual festivals and celebrations at the temple.' },
    { slug: 'gallery', titleEn: 'Gallery', content: 'Photo gallery of the temple and events.' },
    { slug: 'live', titleEn: 'Live Darshan', content: 'Watch live darshan from the temple.' },
    { slug: 'annadanam', titleEn: 'Annadanam', content: 'Free food service for devotees and pilgrims.' },
    { slug: 'timings', titleEn: 'Temple Timings', content: 'Daily temple opening and closing timings.' },
    { slug: 'news', titleEn: 'News & Updates', content: 'Latest news and announcements from the temple.' },
    { slug: 'contact', titleEn: 'Contact Us', content: 'Get in touch with the temple administration.' },
    { slug: 'donate', titleEn: 'Donate', content: 'Support the temple through donations.' },
  ];

  for (const p of pages) {
    const page = await prisma.page.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        status: PageStatus.ACTIVE,
        translations: {
          create: {
            locale: 'en',
            title: p.titleEn,
            content: p.content,
          },
        },
      },
    });
    console.log(`✅ Page: ${page.slug}`);
  }

  // ─── Deities ──────────────────────────────────────────────────────────────
  // Same data as database/scripts/v1.5_website_content_data.sql (website / prompt.md spec).
  const deities = [
    {
      slug: 'vigneshwara',
      nameEn: 'Sri Vigneshwara Swamy',
      nameTe: 'శ్రీ విఘ్నేశ్వర స్వామి',
      nameHi: 'श्री विघ्नेश्वर स्वामी',
      shortDescriptionEn: 'Lord of Beginnings, Remover of Obstacles',
      descriptionEn: 'Sri Vigneshwara Swamy (Lord Ganesha) is the son of Lord Shiva and Goddess Parvati. He is worshipped as the god of beginnings, the remover of obstacles, and the patron of arts, sciences, and intellect. Before any important undertaking, devotees seek his blessings.',
      significance: 'Worshipped first before any religious ceremony or auspicious beginning. His presence ensures the removal of all hurdles and obstacles.',
      rituals: ['Modak offering', 'Durva grass archana', 'Ganesh Chaturthi celebrations', 'Monday special poojas'],
      imageUrl: '/images/deities/vigneshwara.jpg',
      orderIndex: 1,
    },
    {
      slug: 'hanuman',
      nameEn: 'Lord Sri Hanuman',
      nameTe: 'శ్రీ హనుమంతుడు',
      nameHi: 'श्री हनुमान',
      shortDescriptionEn: 'Devoted Servant of Lord Rama, Symbol of Strength',
      descriptionEn: 'Lord Hanuman is the epitome of devotion, strength, and selfless service. He is the greatest devotee of Lord Rama and is believed to be ever-present wherever the name of Rama is chanted. He bestows courage, physical strength, and spiritual wisdom.',
      significance: 'Protector from evil spirits and negative energies. Grants strength, courage, and unwavering devotion.',
      rituals: ['Tuesday and Saturday special poojas', 'Hanuman Chalisa recitation', 'Sundara Kanda parayanam'],
      imageUrl: '/images/deities/hanuman.jpg',
      orderIndex: 2,
    },
    {
      slug: 'sai-baba',
      nameEn: 'Sai Baba',
      nameTe: 'సాయి బాబా',
      nameHi: 'साईं बाबा',
      shortDescriptionEn: 'Universal Saint, Embodiment of Love and Unity',
      descriptionEn: "Shirdi Sai Baba was a spiritual master and saint revered by both Hindus and Muslims. His teachings centered on love, forgiveness, helping others, charity, contentment, inner peace, and devotion to God and guru. He is known for his message 'Sabka Malik Ek' (One God for All).",
      significance: "Transcends religious boundaries, embraced by all. Known for healing the sick and fulfilling devotees' wishes.",
      rituals: ['Thursday special pooja with Udi (sacred ash)', 'Sai Satcharitra parayanam', 'Sai Aradhana celebrations'],
      imageUrl: '/images/deities/sai-baba.jpg',
      orderIndex: 3,
    },
    {
      slug: 'venkateshwara',
      nameEn: 'Lord Sri Venkateshwara Swamy',
      nameTe: 'శ్రీ వేంకటేశ్వర స్వామి',
      nameHi: 'श्री वेंकटेश्वर स्वामी',
      shortDescriptionEn: 'Lord of Seven Hills, Provider of Blessings',
      descriptionEn: 'Lord Sri Venkateshwara Swamy, also known as Balaji or Srinivasa, is a form of Lord Vishnu. He is the presiding deity of the Tirumala Venkateswara Temple and is one of the most widely worshipped deities in India. He is believed to fulfill the wishes of his devotees.',
      significance: 'Grants material and spiritual prosperity. The main deity of this temple, representing divine grace and compassion.',
      rituals: ['Daily Suprabhatam', 'Archana with Tulasi', 'Saturdays special seva', 'Brahmotsavam celebrations'],
      imageUrl: '/images/deities/venkateshwara.jpg',
      orderIndex: 4,
    },
    {
      slug: 'shiva',
      nameEn: 'Lord Shiva',
      nameTe: 'శ్రీ శివుడు',
      nameHi: 'श्री शिव',
      shortDescriptionEn: 'The Auspicious One, Destroyer and Transformer',
      descriptionEn: 'Lord Shiva is one of the principal deities of Hinduism — the Supreme Being in Shaivism. He is the Destroyer within the Trimurti, the three aspects of the divine in Hinduism. Shiva is also worshipped as the patron deity of yoga, meditation, and the arts.',
      significance: 'Represents destruction of evil and transformation. Worshipped for liberation (moksha), peace, and spiritual awakening.',
      rituals: ['Monday special abhishekam', 'Maha Shivaratri celebrations', 'Pradosha pooja', 'Rudrabhishekam'],
      imageUrl: '/images/deities/shiva.jpg',
      orderIndex: 5,
    },
    {
      slug: 'nava-graha',
      nameEn: 'Nava Graha',
      nameTe: 'నవగ్రహాలు',
      nameHi: 'नवग्रह',
      shortDescriptionEn: 'Nine Celestial Planets, Cosmic Influences',
      descriptionEn: 'Nava Graha refers to the nine celestial bodies in Hindu astrology — Surya (Sun), Chandra (Moon), Mangal (Mars), Budha (Mercury), Brihaspati (Jupiter), Shukra (Venus), Shani (Saturn), Rahu, and Ketu. They are said to influence every aspect of human life.',
      significance: "Worshipping Nava Graha neutralizes negative planetary influences and enhances positive ones in one's horoscope.",
      rituals: ['Nava Graha homa', 'Saturday Shani pooja', 'Sunday Surya namaskar', 'Rahu-Ketu shanti puja'],
      imageUrl: '/images/deities/nava-graha.jpg',
      orderIndex: 6,
    },
  ];

  for (const d of deities) {
    const deity = await prisma.deity.upsert({
      where: { slug: d.slug },
      update: {},
      create: d,
    });
    console.log(`✅ Deity: ${deity.nameEn}`);
  }

  // ─── Temple Timings ───────────────────────────────────────────────────────
  const timings = [
    { activity: 'Temple Opens', startTime: '05:30 AM', dayType: DayType.ALL, sortOrder: 1 },
    { activity: 'Suprabhatam & Abhishekam', activityTe: 'సుప్రభాతం & అభిషేకం', startTime: '05:30 AM', endTime: '07:00 AM', dayType: DayType.ALL, sortOrder: 2 },
    { activity: 'Morning Darshan', activityTe: 'ఉదయం దర్శనం', startTime: '07:00 AM', endTime: '12:00 PM', dayType: DayType.ALL, sortOrder: 3 },
    { activity: 'Noon Naivedyam', startTime: '12:00 PM', dayType: DayType.ALL, sortOrder: 4 },
    { activity: 'Annadanam (Lunch Prasadam)', startTime: '12:30 PM', endTime: '01:30 PM', dayType: DayType.ALL, sortOrder: 5 },
    { activity: 'Afternoon Break (Temple Closed)', activityTe: 'మధ్యాహ్నం విరామం', startTime: '01:30 PM', endTime: '04:00 PM', dayType: DayType.ALL, sortOrder: 6 },
    { activity: 'Evening Darshan Opens', startTime: '04:00 PM', dayType: DayType.ALL, sortOrder: 7 },
    { activity: 'Sandhya Archana', startTime: '06:00 PM', dayType: DayType.ALL, sortOrder: 8 },
    { activity: 'Evening Naivedyam', startTime: '07:30 PM', dayType: DayType.ALL, sortOrder: 9 },
    { activity: 'Ekanta Seva (Closing Prayers)', startTime: '08:00 PM', dayType: DayType.ALL, sortOrder: 10 },
    { activity: 'Temple Closes', startTime: '08:30 PM', dayType: DayType.ALL, sortOrder: 11 },
    { activity: 'Extended Darshan', startTime: '04:00 PM', endTime: '10:00 PM', dayType: DayType.WEEKEND, sortOrder: 12 },
  ];

  for (const t of timings) {
    await prisma.templeTiming.create({ data: t });
  }
  console.log(`✅ Temple timings: ${timings.length} entries created`);

  // ─── Poojas ───────────────────────────────────────────────────────────────
  const poojas = [
    { nameEn: 'Suprabhatam', nameTe: 'సుప్రభాతం', descriptionEn: 'Morning awakening prayer offering to the Lord', type: PoojaType.DAILY, timeEn: '5:30 AM', notes: "Daily, begins the day's worship", sortOrder: 1 },
    { nameEn: 'Abhishekam', nameTe: 'అభిషేకం', descriptionEn: 'Ritual bathing of the deity with sacred substances including milk, honey, yoghurt, and rosewater', type: PoojaType.DAILY, timeEn: '6:00 AM', notes: 'Daily ritual with 16 sacred items', sortOrder: 2 },
    { nameEn: 'Naivedyam', descriptionEn: 'Offering of prasadam (sacred food) to the deities', type: PoojaType.DAILY, timeEn: '8:00 AM & 12:00 PM & 7:00 PM', notes: 'Three times daily', sortOrder: 3 },
    { nameEn: 'Maha Archana', descriptionEn: 'Complete archana with 108 names of the deity', type: PoojaType.DAILY, timeEn: '9:00 AM', notes: 'Book in advance', cost: 116, sortOrder: 4 },
    { nameEn: 'Sahasranama Archana', nameTe: 'సహస్ర నామార్చన', descriptionEn: 'Archana with 1008 names of the Lord', type: PoojaType.SPECIAL, timeEn: 'On Request', notes: 'Special seva, advance booking required', cost: 501, sortOrder: 5 },
    { nameEn: 'Kalyanam (Celestial Wedding)', nameTe: 'కళ్యాణం', descriptionEn: 'Ritual depicting the divine wedding of the Lord', type: PoojaType.WEEKLY, timeEn: 'Sunday 10:00 AM', notes: 'Weekly special seva', cost: 1116, sortOrder: 6 },
    { nameEn: 'Annadanam', descriptionEn: 'Community meal offering blessed by the temple', type: PoojaType.DAILY, timeEn: '12:30 PM', notes: 'Sponsorship available, contact temple office', cost: 5000, sortOrder: 7 },
    { nameEn: 'Maha Rudrabhishekam', descriptionEn: 'Grand abhishekam with Rudra mantras for Lord Shiva', type: PoojaType.SPECIAL, timeEn: 'On Request', notes: 'Special occasion seva, 3 hours duration', cost: 2116, sortOrder: 8 },
  ];

  for (const p of poojas) {
    await prisma.pooja.create({ data: p });
  }
  console.log(`✅ Poojas: ${poojas.length} entries created`);

  // ─── Announcements ────────────────────────────────────────────────────────
  await prisma.announcement.create({
    data: {
      titleEn: 'Brahmotsavam 2026 – Registration Open',
      titleTe: 'బ్రహ్మోత్సవం 2026 – నమోదు ప్రారంభమైంది',
      titleHi: 'ब्रह्मोत्सव 2026 – पंजीकरण खुला है',
      isImportant: true,
      isActive: true,
      expiresAt: new Date('2026-06-30'),
    },
  });

  await prisma.announcement.create({
    data: {
      titleEn: 'Online Archana & Seva Booking Now Available',
      titleTe: 'ఆన్‌లైన్ అర్చన & సేవ బుకింగ్ ఇప్పుడు అందుబాటులో ఉంది',
      isImportant: false,
      isActive: true,
    },
  });

  console.log('✅ Announcements: 2 entries created');

  // ─── Gallery Category ─────────────────────────────────────────────────────
  await prisma.galleryCategory.upsert({
    where: { slug: 'temple' },
    update: {},
    create: { slug: 'temple', label: 'Temple' },
  });

  await prisma.galleryCategory.upsert({
    where: { slug: 'festivals' },
    update: {},
    create: { slug: 'festivals', label: 'Festivals' },
  });

  await prisma.galleryCategory.upsert({
    where: { slug: 'seva' },
    update: {},
    create: { slug: 'seva', label: 'Seva & Poojas' },
  });

  console.log('✅ Gallery categories: 3 entries created');

  // ─── Festivals ────────────────────────────────────────────────────────────
  // Recurring annual festivals; month is approximate and the exact date is optional.
  const festivals = [
    { slug: 'brahmotsavam', nameEn: 'Brahmotsavam', nameTe: 'బ్రహ్మోత్సవం', nameHi: 'ब्रह्मोत्सव', month: 'March / April', icon: '🎺', isHighlighted: true, descriptionEn: 'The grandest annual festival of Sri Venkata Sai Devasthanam, celebrated over 9 days with special poojas, processions, cultural programs, and mass annadanam.' },
    { slug: 'rama-navami', nameEn: 'Rama Navami', month: 'March / April', icon: '🏹', descriptionEn: 'Birth anniversary of Lord Rama celebrated with special poojas, Ramayana parayanam, and cultural programs.' },
    { slug: 'hanuman-jayanti', nameEn: 'Hanuman Jayanti', month: 'April', icon: '🙏', descriptionEn: 'Birthday of Lord Hanuman celebrated with Sundara Kanda parayanam, special abhishekam, and devotional songs.' },
    { slug: 'sai-baba-aradhana', nameEn: 'Sai Baba Aradhana', month: 'October', icon: '⭐', isHighlighted: true, descriptionEn: 'The divine mahanirvana day of Shirdi Sai Baba observed with special poojas, bhajans, and Sai Satcharitra parayanam.' },
    { slug: 'maha-shivaratri', nameEn: 'Maha Shivaratri', month: 'February / March', icon: '🌙', descriptionEn: 'The great night of Lord Shiva celebrated with all-night vigil, rudrabhishekam, and special poojas.' },
    { slug: 'guru-purnima', nameEn: 'Guru Purnima', month: 'July', icon: '✨', descriptionEn: 'Day of gratitude to all gurus, observed with special poojas, discourses, and devotees seeking blessings.' },
    { slug: 'ganesh-chaturthi', nameEn: 'Ganesh Chaturthi', month: 'August / September', icon: '🐘', descriptionEn: '10-day celebration of Lord Ganesha with daily poojas, cultural programs, and grand immersion on the final day.' },
    { slug: 'navaratri', nameEn: 'Navaratri', month: 'September / October', icon: '🌺', descriptionEn: 'Nine auspicious nights dedicated to Goddess Durga, Lakshmi, and Saraswati with special daily poojas.' },
    { slug: 'deepavali', nameEn: 'Deepavali', month: 'October / November', icon: '🪔', descriptionEn: 'Festival of lights celebrated with special temple illumination, fireworks, and midnight lakshmi pooja.' },
    { slug: 'vaikunta-ekadashi', nameEn: 'Vaikunta Ekadashi', month: 'December / January', icon: '🚪', descriptionEn: 'Sacred ekadashi dedicated to Lord Vishnu with special midnight darshan and door of liberation open for devotees.' },
    { slug: 'ugadi', nameEn: 'Ugadi', nameTe: 'ఉగాది', month: 'March / April', icon: '🌟', descriptionEn: 'Telugu New Year celebrated with special poojas, panchangam reading, and community celebrations.' },
    { slug: 'karthika-masa', nameEn: 'Karthika Masa', month: 'November', icon: '🕯️', descriptionEn: 'Holy month dedicated to Lord Shiva and Vishnu, with daily diya lighting, special poojas throughout the month.' },
  ];

  for (const [index, f] of festivals.entries()) {
    await prisma.festival.upsert({
      where: { slug: f.slug },
      update: {},
      create: { ...f, orderIndex: index + 1 },
    });
  }
  console.log(`✅ Festivals: ${festivals.length} entries`);

  console.log('\n🎉 Seeding complete!');
  console.log('\n📋 Admin Credentials:');
  console.log('   Email    : admin@srivenkatasai.org');
  console.log(`   Password : ${seedPassword ? '(value of SEED_ADMIN_PASSWORD)' : 'Admin@123 (local default)'}`);
  console.log('   Role     : SUPER_ADMIN\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
