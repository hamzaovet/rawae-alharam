import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { AddToCartBtn } from "@/components/AddToCartBtn";
import { Countdown } from "@/components/Countdown";
import { ImageCarousel } from "@/components/ImageCarousel";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [categories, featuredProducts, activeDeal, allProductsCount] = await Promise.all([
    prisma.category.findMany({ take: 6, orderBy: { createdAt: "asc" } }),
    prisma.product.findMany({ where: { isFeatured: true }, take: 8, include: { category: true } }),
    prisma.weeklyDeal.findFirst({ where: { isActive: true }, include: { items: { include: { product: { include: { category: true } } } } } }),
    prisma.product.count(),
  ]);

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--theme-bg)", color: "var(--theme-text)" }}>
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/hero-bg.jpg" alt="Ø±ÙˆØ§Ø¦Ø¹ Ø§Ù„Ø­Ø±Ù…" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto pt-40 pb-24">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--theme-secondary)]" />
            <span className="text-[var(--theme-secondary)] text-2xl">ðŸ•Œ</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--theme-secondary)]" />
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold mb-4 drop-shadow-2xl leading-tight tracking-tight"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.8)" }}>
            Ø±ÙˆØ§Ø¦Ø¹ Ø§Ù„Ø­Ø±Ù…
          </h1>
          <p className="text-sm md:text-base tracking-[0.3em] font-light text-white/60 mb-6 uppercase">
            Islamic Luxury &middot; Est. 2019
          </p>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px flex-1 max-w-24 bg-[var(--theme-secondary)]/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--theme-secondary)]" />
            <div className="h-px flex-1 max-w-24 bg-[var(--theme-secondary)]/40" />
          </div>
          <p className="text-lg md:text-xl mb-10 text-gray-200 max-w-2xl mx-auto leading-relaxed font-light">
            ÙˆØ¬Ù‡ØªÙƒ Ø§Ù„Ø£ÙˆÙ„Ù‰ Ù„Ø§Ù‚ØªÙ†Ø§Ø¡ Ø£Ø±Ù‚Ù‰ Ø§Ù„Ø¹Ø¨Ø§ÙŠØ§ØªØŒ Ø§Ù„Ù…ØµØ§Ø­Ù Ø§Ù„ÙØ§Ø®Ø±Ø©ØŒ Ø§Ù„Ø³Ø¨Ø­ØŒ ÙˆØ§Ù„Ø¹Ø·ÙˆØ± Ø§Ù„Ø´Ø±Ù‚ÙŠØ©
            <br /><span style={{ color: "var(--theme-secondary)" }}>Ø¨Ù„Ù…Ø³Ø© Ø±ÙˆØ­Ø§Ù†ÙŠØ© Ø£ØµÙŠÙ„Ø© Ù…Ù† Ù‚Ù„Ø¨ Ø§Ù„Ø­Ø±Ù…ÙŠÙ†</span>
          </p>
          <div className="flex gap-4 justify-center flex-wrap mb-16">
            <Link href="/products"
              className="px-6 sm:px-10 py-3 sm:py-4 text-white font-bold rounded-full text-base sm:text-lg transition-all hover:scale-105 hover:shadow-2xl shadow-lg"
              style={{ backgroundColor: "var(--theme-primary)", boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }}>
              ðŸ›ï¸ ØªØµÙØ­ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª
            </Link>
            <a href="#categories"
              className="px-6 sm:px-10 py-3 sm:py-4 font-bold rounded-full text-base sm:text-lg border-2 border-white/60 text-white backdrop-blur-sm hover:bg-white hover:text-black transition-all">
              Ø§Ù„Ø£Ù‚Ø³Ø§Ù…
            </a>
          </div>
          {/* Mini stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 max-w-2xl mx-auto">
            {[["ðŸ…","Ù¥+","Ø³Ù†ÙˆØ§Øª Ø®Ø¨Ø±Ø©"],["ðŸ›ï¸",allProductsCount+"+","Ù…Ù†ØªØ¬ ÙØ§Ø®Ø±"],["â­","Ù¡Ù¥Ù Ù +","Ø¹Ù…ÙŠÙ„ Ø±Ø§Ø¶Ù"],["âœ…","Ù¡Ù Ù Ùª","Ø¬ÙˆØ¯Ø© Ù…Ø¶Ù…ÙˆÙ†Ø©"]].map(([icon,num,label]) => (
              <div key={String(label)} className="backdrop-blur-md rounded-2xl p-3 text-center border border-white/10" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                <div className="text-xl mb-1">{icon}</div>
                <div className="font-extrabold text-lg text-[var(--theme-secondary)]">{num}</div>
                <div className="text-white/60 text-[10px] mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10 flex flex-col items-center gap-1">
          <span className="text-white/40 text-xs tracking-widest">Ø§ÙƒØªØ´Ù</span>
          <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* WHY US STRIP */}
      <section className="py-10 px-4" style={{ background: "linear-gradient(135deg, var(--theme-primary) 0%, #1a5c35 100%)" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-center">
          {[["ðŸšš","ØªÙˆØµÙŠÙ„ Ø³Ø±ÙŠØ¹","Ø¯Ø§Ø®Ù„ Ø§Ù„Ù‚Ø§Ù‡Ø±Ø© Ø§Ù„ÙƒØ¨Ø±Ù‰"],["ðŸ’Ž","Ø¬ÙˆØ¯Ø© Ù…Ø¶Ù…ÙˆÙ†Ø©","Ù…Ù†ØªØ¬Ø§Øª Ø£ØµÙŠÙ„Ø© 100%"],["ðŸ”„","Ø§Ø³ØªØ¨Ø¯Ø§Ù„ Ù…Ø¬Ø§Ù†ÙŠ","Ø®Ù„Ø§Ù„ 14 ÙŠÙˆÙ…"],["ðŸ“ž","Ø¯Ø¹Ù… Ø¹Ù„Ù‰ Ù…Ø¯Ø§Ø± Ø§Ù„Ø³Ø§Ø¹Ø©","01127968425"]].map(([icon,title,desc]) => (
            <div key={String(title)} className="flex flex-col items-center gap-2">
              <span className="text-3xl">{icon}</span>
              <h3 className="font-bold text-sm">{title}</h3>
              <p className="text-white/60 text-xs">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-bold tracking-[0.3em] uppercase" style={{ color: "var(--theme-secondary)" }}>ØªØ´ÙƒÙŠÙ„ØªÙ†Ø§</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-2 mb-3" style={{ color: "var(--theme-primary)" }}>Ø£Ù‚Ø³Ø§Ù…Ù†Ø§</h2>
            <p className="text-gray-500">Ø§ÙƒØªØ´Ù ØªØ´ÙƒÙŠÙ„ØªÙ†Ø§ Ø§Ù„ÙˆØ§Ø³Ø¹Ø© Ù…Ù† Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„Ø¥Ø³Ù„Ø§Ù…ÙŠØ© Ø§Ù„ÙØ§Ø®Ø±Ø©</p>
            <div className="w-20 h-1 mx-auto mt-4 rounded-full" style={{ backgroundColor: "var(--theme-secondary)" }} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/products?category=${cat.slug}`}
                className="group relative h-52 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[var(--theme-secondary)] flex flex-col justify-end">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-5xl">{cat.icon}</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-[var(--theme-primary)]/80 transition-all duration-300" />
                <div className="relative z-10 p-3 text-center">
                  <span className="text-2xl mb-1 block drop-shadow">{cat.icon}</span>
                  <p className="font-bold text-white text-sm drop-shadow-md leading-tight">{cat.name}</p>
                  <p className="text-white/50 text-[10px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity tracking-wider">ØªØµÙØ­ â—€</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WEEKLY DEAL */}
      {activeDeal && (
        <section className="py-16 px-4 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0b3d1f 0%, var(--theme-primary) 50%, #0b3d1f 100%)" }}>
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/30 text-red-300 text-sm font-bold px-5 py-2 rounded-full mb-4">
                ðŸ”¥ Ø¹Ø±Ø¶ Ù…Ø­Ø¯ÙˆØ¯ Ø§Ù„Ù…Ø¯Ø© Â· Ø§Ù†ØªÙ‡Ø² Ø§Ù„ÙØ±ØµØ© Ø§Ù„Ø¢Ù†
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-2">{activeDeal.title}</h2>
              {activeDeal.description && <p className="text-white/70 max-w-xl mx-auto">{activeDeal.description}</p>}
            </div>
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div className="bg-white/5 backdrop-blur rounded-3xl p-5 sm:p-8 border border-white/10">
                <div className="flex items-end gap-4 mb-5 flex-wrap">
                  <span className="text-4xl sm:text-6xl font-extrabold text-[var(--theme-secondary)]">{activeDeal.dealPrice}</span>
                  <div>
                    <p className="text-white/40 text-sm">Ø¬.Ù…</p>
                    <p className="text-white/50 line-through text-2xl">{activeDeal.originalPrice} Ø¬.Ù…</p>
                  </div>
                  <span className="bg-red-500 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                    ÙˆÙØ± {Math.round(activeDeal.originalPrice - activeDeal.dealPrice)} Ø¬.Ù…
                  </span>
                </div>
                {activeDeal.expiresAt && (
                  <div className="mb-6 p-4 rounded-2xl border border-white/10 bg-black/20">
                    <p className="text-white/50 text-xs mb-2 tracking-wider">â³ ÙŠÙ†ØªÙ‡ÙŠ Ø§Ù„Ø¹Ø±Ø¶ Ø®Ù„Ø§Ù„</p>
                    <Countdown expiresAt={activeDeal.expiresAt.toISOString()} />
                  </div>
                )}
                <div className="space-y-3 mb-8">
                  {activeDeal.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 text-white border-b border-white/5 pb-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-black text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: "var(--theme-secondary)" }}>âœ“</span>
                      <span className="flex-1">{item.product.title}</span>
                      <span className="text-white/40 text-sm">{item.product.price} Ø¬.Ù…</span>
                    </div>
                  ))}
                </div>
                <Link href="/cart"
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 font-extrabold rounded-2xl text-lg transition-all hover:scale-105 hover:shadow-2xl"
                  style={{ backgroundColor: "var(--theme-secondary)", color: "#000" }}>
                  Ø§Ø·Ù„Ø¨ Ø§Ù„Ø¹Ø±Ø¶ Ø§Ù„Ø¢Ù† ðŸ›’
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {activeDeal.items.slice(0, 4).map((item) => (
                  <div key={item.id} className="rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                    {item.product.images.length > 0 ? (
                      <ImageCarousel images={item.product.images} alt={item.product.title} className="w-full h-40 relative" autoPlayInterval={2500} />
                    ) : (
                      <div className="w-full h-40 flex items-center justify-center text-4xl text-white/20">ðŸ›ï¸</div>
                    )}
                    <p className="text-white text-xs font-medium p-2.5 text-center leading-tight">{item.product.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FEATURED PRODUCTS */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-bold tracking-[0.3em] uppercase" style={{ color: "var(--theme-secondary)" }}>Ø§Ù„Ù…Ø®ØªØ§Ø±Ø© Ø¨Ø¹Ù†Ø§ÙŠØ©</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-2 mb-3" style={{ color: "var(--theme-primary)" }}>Ù…Ù†ØªØ¬Ø§Øª Ù…Ù…ÙŠØ²Ø©</h2>
            <p className="text-gray-500">Ø§Ø®ØªØ§Ø±Ù‡Ø§ Ù„Ùƒ ÙØ±ÙŠÙ‚Ù†Ø§ Ø¨Ø¹Ù†Ø§ÙŠØ© ÙØ§Ø¦Ù‚Ø©</p>
            <div className="w-20 h-1 mx-auto mt-4 rounded-full" style={{ backgroundColor: "var(--theme-secondary)" }} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featuredProducts.map((p) => (
              <div key={p.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col hover:-translate-y-1">
                <Link href={`/products/${p.slug}`} className="block relative h-52 overflow-hidden bg-gray-50">
                  {p.images.length > 0 ? (
                    <ImageCarousel images={p.images} alt={p.title} className="w-full h-full relative" autoPlayInterval={3500} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">ðŸ›ï¸</div>
                  )}
                  {p.images.length > 1 && (
                    <span className="absolute top-2 right-2 z-20 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full pointer-events-none backdrop-blur-sm">
                      ðŸ“¸ {p.images.length}
                    </span>
                  )}
                </Link>
                <div className="p-4 flex flex-col flex-1">
                  <span className="text-[10px] text-[var(--theme-secondary)] font-bold tracking-wider uppercase mb-1">{p.category.name}</span>
                  <Link href={`/products/${p.slug}`}>
                    <h3 className="font-bold text-sm leading-snug mb-3 hover:text-[var(--theme-primary)] line-clamp-2 transition-colors">{p.title}</h3>
                  </Link>
                  <div className="flex items-center justify-between mt-auto mb-3">
                    <p className="font-extrabold text-xl" style={{ color: "var(--theme-primary)" }}>{p.price} <span className="text-sm font-normal text-gray-400">Ø¬.Ù…</span></p>
                    {p.stock > 0 && p.stock < 5 && <span className="text-[10px] text-red-500 font-bold">Ø¢Ø®Ø± {p.stock} Ù‚Ø·Ø¹!</span>}
                    {p.stock === 0 && <span className="text-[10px] text-red-500 font-bold">Ù†ÙØ°Øª Ø§Ù„ÙƒÙ…ÙŠØ©</span>}
                  </div>
                  <AddToCartBtn id={p.id} title={p.title} price={p.price} image={p.images[0] || ""} />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/products"
              className="inline-flex items-center gap-2 px-10 py-4 font-bold rounded-full border-2 border-[var(--theme-primary)] text-[var(--theme-primary)] hover:bg-[var(--theme-primary)] hover:text-white transition-all hover:shadow-xl hover:scale-105">
              Ø¹Ø±Ø¶ Ø¬Ù…ÙŠØ¹ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª â—€
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-sm font-bold tracking-[0.3em] uppercase" style={{ color: "var(--theme-secondary)" }}>Ø¢Ø±Ø§Ø¡ Ø¹Ù…Ù„Ø§Ø¦Ù†Ø§</span>
            <h2 className="text-3xl font-extrabold mt-1" style={{ color: "var(--theme-primary)" }}>Ù…Ø§Ø°Ø§ ÙŠÙ‚ÙˆÙ„ÙˆÙ† Ø¹Ù†Ø§</h2>
            <div className="w-16 h-1 mx-auto mt-3 rounded-full" style={{ backgroundColor: "var(--theme-secondary)" }} />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Ø£Ø­Ù…Ø¯ Ù…Ø­Ù…ÙˆØ¯", review: "Ù…Ù†ØªØ¬Ø§Øª Ø±Ø§Ù‚ÙŠØ© Ø¬Ø¯Ø§Ù‹ ÙˆØ£ØµÙŠÙ„Ø©ØŒ Ø§Ø´ØªØ±ÙŠØª Ù…ØµØ­ÙØ§Ù‹ ÙˆØ¹Ø¨Ø§Ø¡Ø© ÙˆÙƒØ§Ù†Ø§ ÙÙˆÙ‚ Ø§Ù„ØªÙˆÙ‚Ø¹Ø§Øª!", stars: 5, city: "Ø§Ù„Ù‚Ø§Ù‡Ø±Ø©" },
              { name: "ÙØ§Ø·Ù…Ø© Ø§Ù„Ø²Ù‡Ø±Ø§Ø¡", review: "Ø¹Ø¨Ø§Ø¡Ø© Ø§Ù„Ù…Ù†Ø§Ø³Ø¨Ø§Øª Ø¬Ø§Ø¡Øª Ø¨Ø¬ÙˆØ¯Ø© Ù…Ù…ØªØ§Ø²Ø© ÙˆØ§Ù„ØªÙˆØµÙŠÙ„ ÙƒØ§Ù† Ø³Ø±ÙŠØ¹ Ø¬Ø¯Ø§Ù‹. Ø´ÙƒØ±Ø§Ù‹ Ø¬Ø²ÙŠÙ„Ø§Ù‹!", stars: 5, city: "Ø§Ù„Ø¬ÙŠØ²Ø©" },
              { name: "Ø¹Ø¨Ø¯ Ø§Ù„Ø±Ø­Ù…Ù† Ø³Ø§Ù„Ù…", review: "Ù…Ù† Ø£Ø¬ÙˆØ¯ Ø§Ù„Ù…ØªØ§Ø¬Ø± Ø§Ù„Ø¥Ø³Ù„Ø§Ù…ÙŠØ© ÙÙŠ Ù…ØµØ±ØŒ Ø³Ø¹Ø± Ù…Ù†Ø§Ø³Ø¨ ÙˆÙ…Ù†ØªØ¬Ø§Øª ÙØ§Ø®Ø±Ø© ÙˆØµØ§Ø¯Ù‚Ø©.", stars: 5, city: "Ø§Ù„Ù…Ù†ØµÙˆØ±Ø©" },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex gap-0.5 mb-3">{Array.from({ length: t.stars }).map((_, i) => <span key={i} className="text-yellow-400">â˜…</span>)}</div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{t.review}"</p>
                <div className="flex items-center gap-2 border-t pt-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: "var(--theme-primary)" }}>{t.name[0]}</div>
                  <div>
                    <p className="font-bold text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 px-4 relative overflow-hidden" style={{ backgroundColor: "var(--theme-primary)" }}>
        <div className="max-w-5xl mx-auto text-center text-white relative z-10">
          <span className="text-sm font-bold tracking-[0.3em] uppercase text-[var(--theme-secondary)]">Ù‚ØµØªÙ†Ø§</span>
          <h2 className="text-4xl font-extrabold mt-2 mb-6">Ù…Ù† Ù†Ø­Ù†</h2>
          <p className="text-white/80 text-lg leading-relaxed mb-10 max-w-3xl mx-auto">
            Ø±ÙˆØ§Ø¦Ø¹ Ø§Ù„Ø­Ø±Ù… Ù…ØªØ¬Ø± Ù…ØªØ®ØµØµ ÙÙŠ Ø¨ÙŠØ¹ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„Ø¥Ø³Ù„Ø§Ù…ÙŠØ© Ø§Ù„ÙØ§Ø®Ø±Ø© Ø¨Ø§Ù„Ù‚Ø§Ù‡Ø±Ø©. Ù†ÙÙ‚Ø¯Ù… Ù„ÙƒÙ… Ø£Ø¬ÙˆØ¯ Ø£Ù†ÙˆØ§Ø¹ Ø§Ù„Ø¹Ø¨Ø§ÙŠØ§Øª Ø§Ù„Ø±Ø¬Ø§Ù„ÙŠØ© ÙˆØ§Ù„Ù†Ø³Ø§Ø¦ÙŠØ©ØŒ Ø§Ù„Ù…ØµØ§Ø­ÙØŒ Ø§Ù„Ø³ÙˆØ§ÙƒØŒ Ø§Ù„Ø¹Ø·ÙˆØ± Ø§Ù„Ø´Ø±Ù‚ÙŠØ©ØŒ ÙˆØ§Ù„Ù‡Ø¯Ø§ÙŠØ§ Ø§Ù„Ø¥Ø³Ù„Ø§Ù…ÙŠØ© Ø§Ù„Ù…Ù…ÙŠØ²Ø©.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[["Ù¥+","Ø³Ù†ÙˆØ§Øª Ø®Ø¨Ø±Ø©"],["Ù¡Ù¥Ù Ù +","Ø¹Ù…ÙŠÙ„ Ø±Ø§Ø¶Ù"],[allProductsCount+"+","Ù…Ù†ØªØ¬ ÙØ§Ø®Ø±"],["Ù¡Ù Ù Ùª","Ø¬ÙˆØ¯Ø© Ù…Ø¶Ù…ÙˆÙ†Ø©"]].map(([n,l]) => (
              <div key={String(l)} className="bg-white/10 hover:bg-white/15 transition-colors rounded-2xl p-5 border border-white/10">
                <p className="text-4xl font-extrabold text-[var(--theme-secondary)]">{n}</p>
                <p className="text-white/70 text-sm mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-sm font-bold tracking-[0.3em] uppercase" style={{ color: "var(--theme-secondary)" }}>Ù†Ø³Ø¹Ø¯ Ø¨Ø®Ø¯Ù…ØªÙƒÙ…</span>
          <h2 className="text-4xl font-extrabold mt-2 mb-10" style={{ color: "var(--theme-primary)" }}>ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: "ðŸ“", title: "Ø§Ù„Ø¹Ù†ÙˆØ§Ù†", lines: ["Ø§Ù„Ù‚Ø§Ù‡Ø±Ø© - Ø­Ø¯Ø§Ø¦Ù‚ Ø§Ù„Ø²ÙŠØªÙˆÙ†", "Ø´Ø§Ø±Ø¹ Ø§Ù„Ø¹Ø²ÙŠØ² Ø¨Ø§Ù„Ù„Ù‡ Ù†Ø§ØµÙŠØ© Ø´Ø§Ø±Ø¹ Ù…Ø§Ù‡Ø±"] },
              { icon: "ðŸ“ž", title: "Ø§Ù„Ù‡Ø§ØªÙ", lines: ["01127968425", "01515194351"] },
              { icon: "ðŸ•", title: "Ù…ÙˆØ§Ø¹ÙŠØ¯ Ø§Ù„Ø¹Ù…Ù„", lines: ["Ø§Ù„Ø³Ø¨Øª â€” Ø§Ù„Ø®Ù…ÙŠØ³", "Ù¡Ù  ØµØ¨Ø§Ø­Ø§Ù‹ â€” Ù¡Ù  Ù…Ø³Ø§Ø¡Ù‹"] },
            ].map(({ icon, title, lines }) => (
              <div key={title} className="bg-white rounded-2xl p-7 shadow-sm border-2 hover:shadow-lg transition-shadow"
                style={{ borderColor: "var(--theme-secondary)" }}>
                <div className="text-5xl mb-4">{icon}</div>
                <h3 className="font-extrabold text-lg mb-3" style={{ color: "var(--theme-primary)" }}>{title}</h3>
                {lines.map((l, i) => <p key={i} className="text-gray-500 text-sm leading-relaxed">{l}</p>)}
              </div>
            ))}
          </div>
          <div className="p-8 rounded-3xl border-2" style={{ borderColor: "var(--theme-primary)", backgroundColor: "rgba(0,100,40,0.04)" }}>
            <p className="text-lg font-bold mb-2" style={{ color: "var(--theme-primary)" }}>ØªØ­Ø¯Ø« Ù…Ø¹Ù†Ø§ Ø¹Ù„Ù‰ ÙˆØ§ØªØ³Ø§Ø¨ ðŸ“²</p>
            <p className="text-gray-500 text-sm mb-5">Ø§Ø·Ù„Ø¨ Ù…Ù†ØªØ¬Ø§ØªÙƒ Ø£Ùˆ Ø§Ø³ØªÙØ³Ø± Ø¹Ù† Ø£ÙŠ Ø´ÙŠØ¡ â€” Ù†Ø±Ø¯ ÙÙŠ Ø£Ù‚Ù„ Ù…Ù† Ø³Ø§Ø¹Ø©</p>
            <a href="https://wa.me/201127968425" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg">
              Ø§Ø¨Ø¯Ø£ Ø§Ù„Ù…Ø­Ø§Ø¯Ø«Ø© Ø§Ù„Ø¢Ù†
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-white py-12 px-4" style={{ backgroundColor: "#0d0d0d" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">ðŸ•Œ</span>
                <h3 className="text-xl font-extrabold" style={{ color: "var(--theme-secondary)" }}>Ø±ÙˆØ§Ø¦Ø¹ Ø§Ù„Ø­Ø±Ù…</h3>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">Ù…ØªØ¬Ø±Ùƒ Ø§Ù„Ø£ÙˆÙ„ Ù„Ù„Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„Ø¥Ø³Ù„Ø§Ù…ÙŠØ© Ø§Ù„ÙØ§Ø®Ø±Ø© ÙÙŠ Ø§Ù„Ù‚Ø§Ù‡Ø±Ø©ØŒ Ø¨Ø¬ÙˆØ¯Ø© Ù…Ø¶Ù…ÙˆÙ†Ø© ÙˆØ£Ø³Ø¹Ø§Ø± Ù…Ù†Ø§Ø³Ø¨Ø©.</p>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-white/80">Ø±ÙˆØ§Ø¨Ø· Ø³Ø±ÙŠØ¹Ø©</h4>
              <div className="space-y-2">
                {[["Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©","/"],["Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª","/products"],["Ø³Ù„Ø© Ø§Ù„Ø´Ø±Ø§Ø¡","/cart"]].map(([label,href]) => (
                  <Link key={href} href={href} className="block text-gray-500 hover:text-white text-sm transition-colors">{label}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-white/80">ØªÙˆØ§ØµÙ„</h4>
              <p className="text-gray-500 text-sm">ðŸ“ Ø§Ù„Ù‚Ø§Ù‡Ø±Ø© - Ø­Ø¯Ø§Ø¦Ù‚ Ø§Ù„Ø²ÙŠØªÙˆÙ†</p>
              <p className="text-gray-500 text-sm mt-1">ðŸ“ž 01127968425 â€” 01515194351</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-gray-600 text-xs">
            <p>Â© {new Date().getFullYear()} Ø±ÙˆØ§Ø¦Ø¹ Ø§Ù„Ø­Ø±Ù… Â· Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø­Ù‚ÙˆÙ‚ Ù…Ø­ÙÙˆØ¸Ø©</p>
            <p>ØªÙ… Ø§Ù„ØªØ·ÙˆÙŠØ± Ø¨ÙˆØ§Ø³Ø·Ø© <span className="text-white font-bold">Ø£ÙˆØ±ÙƒØ§</span> Â· 01018671000 â€” 01005010395</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

