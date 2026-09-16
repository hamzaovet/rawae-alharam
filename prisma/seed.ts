import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 بدء إضافة البيانات...')

  // ==================== USERS ====================
  const superAdminPass = await bcrypt.hash('Godfather@2026', 10)
  const adminPass = await bcrypt.hash('Rawae@2026', 10)

  const superAdmin = await prisma.user.upsert({
    where: { username: 'maestro' },
    update: { password: superAdminPass, role: Role.SUPER_ADMIN, isActive: true },
    create: { username: 'maestro', password: superAdminPass, role: Role.SUPER_ADMIN, isActive: true },
  })

  const admin = await prisma.user.upsert({
    where: { username: 'rawaeadmin' },
    update: { password: adminPass, role: Role.ADMIN, isActive: true },
    create: { username: 'rawaeadmin', password: adminPass, role: Role.ADMIN, isActive: true },
  })

  console.log('✅ Users:', superAdmin.username, '|', admin.username)

  // ==================== THEMES ====================
  const themes = [
    {
      name: 'Spiritual',
      nameAr: 'الثيم الروحاني',
      layoutType: 'spiritual',
      primaryColor: '#15803d',
      secondaryColor: '#eab308',
      bgColor: '#fffbeb',
      textColor: '#1c1917',
      accentColor: '#d97706',
      fontFamily: 'Cairo',
      borderRadius: '0.75rem',
      isActive: true,
    },
    {
      name: 'Royal',
      nameAr: 'الثيم الملكي',
      layoutType: 'royal',
      primaryColor: '#92400e',
      secondaryColor: '#d4af37',
      bgColor: '#1c1917',
      textColor: '#fef3c7',
      accentColor: '#b45309',
      fontFamily: 'Cairo',
      borderRadius: '0.25rem',
      isActive: false,
    },
    {
      name: 'Modern',
      nameAr: 'الثيم العصري',
      layoutType: 'modern',
      primaryColor: '#1d4ed8',
      secondaryColor: '#0ea5e9',
      bgColor: '#f8fafc',
      textColor: '#0f172a',
      accentColor: '#6366f1',
      fontFamily: 'Cairo',
      borderRadius: '0.5rem',
      isActive: false,
    },
    {
      name: 'Classic',
      nameAr: 'الثيم الكلاسيكي',
      layoutType: 'classic',
      primaryColor: '#78350f',
      secondaryColor: '#a16207',
      bgColor: '#fdf8f0',
      textColor: '#292524',
      accentColor: '#92400e',
      fontFamily: 'Cairo',
      borderRadius: '0.125rem',
      isActive: false,
    },
  ]

  for (const theme of themes) {
    const existing = await prisma.themeSetting.findFirst({ where: { name: theme.name } })
    if (existing) {
      await prisma.themeSetting.update({
        where: { id: existing.id },
        data: theme,
      })
    } else {
      await prisma.themeSetting.create({
        data: theme,
      })
    }
  }
  console.log('✅ Themes: 4 ثيمات')

  // ==================== CATEGORIES ====================
  const categories = [
    { name: 'عبايات رجالي', slug: 'abayas-men', icon: '👘', image: '/images/categories/abayas-men.jpg' },
    { name: 'عبايات حريمي', slug: 'abayas-women', icon: '🌸', image: '/images/categories/abayas-women.jpg' },
    { name: 'مصاحف وكتب إسلامية', slug: 'quran-books', icon: '📖', image: '/images/categories/quran-books.jpg' },
    { name: 'عطور وسواك وبخور', slug: 'perfumes-oud', icon: '🌹', image: '/images/categories/perfumes-oud.jpg' },
    { name: 'سجاد صلاة وسبح', slug: 'prayer-rugs', icon: '🕌', image: '/images/categories/prayer-rugs.jpg' },
    { name: 'تحف وهدايا إسلامية', slug: 'gifts', icon: '🎁', image: '/images/categories/gifts.jpg' },
  ]

  const createdCategories: Record<string, string> = {}
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, icon: cat.icon, image: cat.image },
      create: cat,
    })
    createdCategories[cat.slug] = created.id
  }
  console.log('✅ Categories: 6 أقسام')

  // ==================== PRODUCTS ====================
  const products = [
    // عبايات رجالي
    { title: 'عباءة رجالي كلوش فاخرة', slug: 'abaya-men-classic', description: 'عباءة رجالية مصنوعة من أجود أنواع القماش، تتميز بتطريز دقيق على الأطراف وخياطة عالية الجودة. مثالية للمناسبات الرسمية والصلاة.', price: 450, stock: 30, isFeatured: true, categorySlug: 'abayas-men', images: ['/images/products/abaya-men-classic.jpg'] },
    { title: 'عباءة رجالي تركية مطرزة', slug: 'abaya-men-turkish', description: 'عباءة رجالية بطراز تركي أصيل مع تطريز ذهبي على الأكمام والأطراف. قماش ثقيل الوزن مناسب لكل المناخات.', price: 580, stock: 20, isFeatured: false, categorySlug: 'abayas-men', images: ['/images/products/abaya-men-turkish.jpg'] },
    // عبايات حريمي
    { title: 'عباءة حريمي شيفون فاخرة', slug: 'abaya-women-chiffon', description: 'عباءة نسائية من الشيفون الفاخر بتصميم أنيق وعصري. تتميز بالخفة والنعومة مع تطريز لؤلؤي على الأطراف.', price: 380, stock: 45, isFeatured: true, categorySlug: 'abayas-women', images: ['/images/products/abaya-women-chiffon.jpg'] },
    { title: 'عباءة حريمي كريب مزخرف', slug: 'abaya-women-crepe', description: 'عباءة نسائية من قماش الكريب الراقي مزينة بزخارف إسلامية هندسية. تجمع بين الأصالة والعصرية في تصميم واحد متكامل.', price: 420, stock: 35, isFeatured: true, categorySlug: 'abayas-women', images: ['/images/products/abaya-women-crepe.jpg'] },
    { title: 'عباءة حريمي مطرزة للمناسبات', slug: 'abaya-women-occasion', description: 'عباءة فاخرة للمناسبات الخاصة والأفراح مزينة بتطريز حريري ملون. تصميم استثنائي يجعلك محط الأنظار.', price: 650, stock: 15, isFeatured: false, categorySlug: 'abayas-women', images: ['/images/products/abaya-women-occasion.jpg'] },
    // مصاحف
    { title: 'مصحف تلاوة بروايتي حفص وورش', slug: 'quran-hafs-warsh', description: 'مصحف شريف مطبوع بخط النسخ الواضح، جمع بين روايتي حفص وورش عن عاصم. غلاف جلدي فاخر ومزين بنقوش إسلامية ذهبية.', price: 150, stock: 60, isFeatured: true, categorySlug: 'quran-books', images: ['/images/products/quran-hafs-warsh.jpg'] },
    { title: 'مصحف تجويد ملون للحافظين', slug: 'quran-tajweed', description: 'مصحف تجويد ملون يساعد القارئ على تطبيق أحكام التجويد بسهولة ويسر. مطبوع بألوان واضحة تميز بين الأحكام المختلفة.', price: 120, stock: 80, isFeatured: false, categorySlug: 'quran-books', images: ['/images/products/quran-tajweed.jpg'] },
    // عطور وسواك
    { title: 'عطر عود الكمبودي الأصيل', slug: 'oud-cambodian', description: 'عطر عود كمبودي نادر معتق لأكثر من 10 سنوات، يتميز بعمق ريحته وثباتها الطويل. قطعة فنية نادرة لعشاق العود الأصيل.', price: 850, stock: 10, isFeatured: true, categorySlug: 'perfumes-oud', images: ['/images/products/oud-cambodian.jpg'] },
    { title: 'سواك أراك طبيعي معطر', slug: 'miswak-natural', description: 'سواك أراك طبيعي 100% من أشجار الأراك الأصيلة. يتميز بنكهته الطبيعية ومفعوله التنظيفي القوي. الحجم المثالي لحمله في كل مكان.', price: 25, stock: 200, isFeatured: false, categorySlug: 'perfumes-oud', images: ['/images/products/miswak-natural.jpg'] },
    { title: 'بخور الحرمين المعطر', slug: 'bukhoor-haramain', description: 'بخور فاخر بعبق الحرمين الشريفين، يملأ المكان بأريج روحاني هادئ. تركيبة خاصة من أجود أنواع العود والمسك والعنبر.', price: 180, stock: 40, isFeatured: true, categorySlug: 'perfumes-oud', images: ['/images/products/bukhoor-haramain.jpg'] },
    // سجاد صلاة
    { title: 'سجادة صلاة تركية مخملية', slug: 'prayer-rug-turkish', description: 'سجادة صلاة تركية الصنع من المخمل الفاخر. تصميم إسلامي أنيق بألوان هادئة ومريحة للعين. خيوط متينة تضمن عمراً طويلاً.', price: 220, stock: 50, isFeatured: true, categorySlug: 'prayer-rugs', images: ['/images/products/prayer-rug-turkish.jpg'] },
    { title: 'سبحة كريستال مضيئة', slug: 'sebha-crystal', description: 'سبحة من الكريستال الشفاف تعكس الضوء بجمال ساحر. 99 حبة بحجم مريح للإمساك. خيط حرير متين مع شراشب ذهبية اللون.', price: 95, stock: 75, isFeatured: false, categorySlug: 'prayer-rugs', images: ['/images/products/sebha-crystal.jpg'] },
    // هدايا
    { title: 'لوحة خط عربي "بسم الله"', slug: 'calligraphy-bismillah', description: 'لوحة فنية بخط عربي أصيل تجسّد "بسم الله الرحمن الرحيم" بخط الثلث الجميل. إطار خشبي فاخر مناسبة هدية راقية لكل المناسبات.', price: 320, stock: 25, isFeatured: true, categorySlug: 'gifts', images: ['/images/products/calligraphy-bismillah.jpg'] },
    { title: 'طقم هدايا إسلامية فاخرة', slug: 'gift-set-islamic', description: 'طقم هدايا متكامل يضم: مصحف صغير + سبحة كريستال + عطر مسك + حامل البخور. مقدم في علبة هدايا فاخرة. الاختيار المثالي للمناسبات والأعياد.', price: 480, stock: 20, isFeatured: true, categorySlug: 'gifts', images: ['/images/products/gift-set-islamic.jpg'] },
    { title: 'إبريق شاي عربي تراثي', slug: 'arabic-teapot', description: 'إبريق شاي تراثي من النحاس المطلي بالذهب، يحمل نقوشاً إسلامية جميلة. قطعة تراثية فريدة تجمع بين الأصالة والاستخدام اليومي.', price: 275, stock: 30, isFeatured: false, categorySlug: 'gifts', images: ['/images/products/arabic-teapot.jpg'] },
  ]

  const createdProducts: string[] = []
  for (const p of products) {
    const { categorySlug, ...productData } = p
    const created = await prisma.product.upsert({
      where: { slug: p.slug },
      update: { ...productData, categoryId: createdCategories[categorySlug] },
      create: { ...productData, categoryId: createdCategories[categorySlug] },
    })
    createdProducts.push(created.id)
  }
  console.log('✅ Products: 15 منتج')

  // ==================== WEEKLY DEAL ====================
  // Get IDs for products we want in the deal
  const dealProductSlugs = ['abaya-men-classic', 'abaya-women-chiffon', 'quran-hafs-warsh', 'sebha-crystal']
  const dealProducts = await prisma.product.findMany({ where: { slug: { in: dealProductSlugs } } })
  const originalTotal = dealProducts.reduce((sum, p) => sum + p.price, 0)

  const existingDeal = await prisma.weeklyDeal.findFirst()
  if (!existingDeal) {
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)

    const deal = await prisma.weeklyDeal.create({
      data: {
        title: 'باقة الحاج والمعتمر',
        description: 'كل ما تحتاجه لرحلة روحانية مميزة في باقة واحدة بسعر خاص! عباءة رجالي + عباءة حريمي + مصحف تجويد + سبحة كريستال.',
        dealPrice: 899,
        originalPrice: originalTotal,
        isActive: true,
        expiresAt: nextWeek,
        items: {
          create: dealProducts.map(p => ({ productId: p.id, quantity: 1 }))
        }
      }
    })
    console.log('✅ Weekly Deal:', deal.title)
  } else {
    console.log('ℹ️ Weekly Deal موجود مسبقاً')
  }

  console.log('\n🎉 تم إضافة جميع البيانات بنجاح!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('👤 Super Admin: maestro / Godfather@2026')
  console.log('👤 Admin: rawaeadmin / Rawae@2026')
  console.log('🎨 Themes: 4 ثيمات جاهزة (Spiritual مفعل)')
  console.log('📁 Categories: 6 أقسام')
  console.log('🛍️  Products: 15 منتج')
  console.log('🎯 Weekly Deal: باقة الحاج والمعتمر')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

