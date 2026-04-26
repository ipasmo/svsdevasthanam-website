import { PrismaClient, UserRole, PageStatus, PoojaType, DayType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Admin Users ──────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('Admin@123', 10);

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
  const deities = [
    {
      slug: 'sri-venkata-sai',
      nameEn: 'Sri Venkata Sai',
      nameTe: 'శ్రీ వెంకట సాయి',
      nameHi: 'श्री वेंकट साई',
      descriptionEn: 'The presiding deity of the temple, Sri Venkata Sai is revered by millions of devotees.',
      significance: 'Fulfills the wishes of devotees and blesses them with prosperity and peace.',
      orderIndex: 1,
    },
    {
      slug: 'lord-ganesha',
      nameEn: 'Lord Ganesha',
      nameTe: 'శ్రీ గణేష',
      nameHi: 'श्री गणेश',
      descriptionEn: 'The remover of obstacles, worshipped before beginning any auspicious activity.',
      significance: 'Bestows wisdom, prosperity and removes all obstacles from the path of devotees.',
      orderIndex: 2,
    },
    {
      slug: 'goddess-lakshmi',
      nameEn: 'Goddess Lakshmi',
      nameTe: 'శ్రీ లక్ష్మీ దేవి',
      nameHi: 'श्री लक्ष्मी देवी',
      descriptionEn: 'The goddess of wealth and prosperity, the divine consort of Lord Vishnu.',
      significance: 'Blesses devotees with wealth, fortune, health and prosperity.',
      orderIndex: 3,
    },
    {
      slug: 'lord-shiva',
      nameEn: 'Lord Shiva',
      nameTe: 'శ్రీ శివుడు',
      nameHi: 'श्री शिव',
      descriptionEn: 'The supreme deity of the Shaivite tradition, the destroyer and transformer.',
      significance: 'Grants liberation, destroys evil and blesses devotees with spiritual growth.',
      orderIndex: 4,
    },
    {
      slug: 'goddess-saraswati',
      nameEn: 'Goddess Saraswati',
      nameTe: 'శ్రీ సరస్వతి దేవి',
      nameHi: 'श्री सरस्वती',
      descriptionEn: 'The goddess of knowledge, wisdom, arts and learning.',
      significance: 'Bestows intellect, knowledge and artistic abilities on her devotees.',
      orderIndex: 5,
    },
    {
      slug: 'lord-hanuman',
      nameEn: 'Lord Hanuman',
      nameTe: 'శ్రీ హనుమంతుడు',
      nameHi: 'श्री हनुमान',
      descriptionEn: 'The mighty devotee of Lord Rama, the symbol of strength and devotion.',
      significance: 'Protects devotees from evil, grants strength, courage and devotion.',
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
    { activity: 'Suprabhatam & Abhishekam', activityTe: 'సుప్రభాతం & అభిషేకం', startTime: '05:00 AM', endTime: '06:30 AM', dayType: DayType.ALL, sortOrder: 1 },
    { activity: 'Morning Darshan', activityTe: 'ఉదయం దర్శనం', startTime: '06:30 AM', endTime: '12:00 PM', dayType: DayType.ALL, sortOrder: 2 },
    { activity: 'Afternoon Break', activityTe: 'మధ్యాహ్నం విరామం', startTime: '12:00 PM', endTime: '04:00 PM', dayType: DayType.ALL, sortOrder: 3 },
    { activity: 'Evening Darshan', activityTe: 'సాయంకాలం దర్శనం', startTime: '04:00 PM', endTime: '08:30 PM', dayType: DayType.ALL, sortOrder: 4 },
    { activity: 'Ekanta Seva & Closing', activityTe: 'ఏకాంత సేవ & మూసివేత', startTime: '08:30 PM', endTime: '09:00 PM', dayType: DayType.ALL, sortOrder: 5 },
    { activity: 'Extended Morning Darshan', activityTe: 'పొడిగించిన ఉదయం దర్శనం', startTime: '06:00 AM', endTime: '12:00 PM', dayType: DayType.WEEKEND, sortOrder: 6 },
  ];

  for (const t of timings) {
    await prisma.templeTiming.create({ data: t });
  }
  console.log(`✅ Temple timings: ${timings.length} entries created`);

  // ─── Poojas ───────────────────────────────────────────────────────────────
  const poojas = [
    { nameEn: 'Suprabhatam', nameTe: 'సుప్రభాతం', type: PoojaType.DAILY, timeEn: '05:00 AM', sortOrder: 1 },
    { nameEn: 'Thomala Seva', nameTe: 'తోమాల సేవ', type: PoojaType.DAILY, timeEn: '06:00 AM', cost: 500, sortOrder: 2 },
    { nameEn: 'Archana', nameTe: 'అర్చన', type: PoojaType.DAILY, timeEn: '07:00 AM', cost: 50, sortOrder: 3 },
    { nameEn: 'Nivedana', nameTe: 'నివేదన', type: PoojaType.DAILY, timeEn: '12:00 PM', sortOrder: 4 },
    { nameEn: 'Haarathi', nameTe: 'హారతి', type: PoojaType.DAILY, timeEn: '06:00 PM', sortOrder: 5 },
    { nameEn: 'Ekanta Seva', nameTe: 'ఏకాంత సేవ', type: PoojaType.DAILY, timeEn: '08:30 PM', sortOrder: 6 },
    { nameEn: 'Abhishekam', nameTe: 'అభిషేకం', type: PoojaType.WEEKLY, timeEn: '06:00 AM (Saturdays)', cost: 1000, sortOrder: 7 },
    { nameEn: 'Sahasra Namaarchana', nameTe: 'సహస్ర నామార్చన', type: PoojaType.SPECIAL, timeEn: 'By Appointment', cost: 2500, sortOrder: 8 },
    { nameEn: 'Kalyanam', nameTe: 'కళ్యాణం', type: PoojaType.SPECIAL, timeEn: 'By Appointment', cost: 5000, sortOrder: 9 },
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

  // ─── Events ───────────────────────────────────────────────────────────────
  const now = new Date();

  await prisma.event.create({
    data: {
      titleEn: 'Brahmotsavam 2026',
      titleTe: 'బ్రహ్మోత్సవం 2026',
      titleHi: 'ब्रह्मोत्सव 2026',
      descriptionEn: 'The grand annual Brahmotsavam festival celebrated with great devotion over 9 days.',
      category: 'Festival',
      startDate: new Date('2026-05-10'),
      endDate: new Date('2026-05-18'),
      isActive: true,
    },
  });

  await prisma.event.create({
    data: {
      titleEn: 'Ugadi Celebrations',
      titleTe: 'ఉగాది వేడుకలు',
      category: 'Festival',
      startDate: new Date('2026-03-30'),
      isActive: true,
    },
  });

  console.log('✅ Events: 2 entries created');

  console.log('\n🎉 Seeding complete!');
  console.log('\n📋 Admin Credentials:');
  console.log('   Email    : admin@srivenkatasai.org');
  console.log('   Password : Admin@123');
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
