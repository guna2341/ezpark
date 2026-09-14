import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MOCK_BLOG_POSTS } from '../data/mockData';

export default function BlogGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="py-24" style={{ background: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              className="text-xs font-semibold text-[#3B5BFF] tracking-[0.2em] uppercase mb-3"
            >
              From the ParkEZ Journal
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="font-display font-bold text-[clamp(28px,3.5vw,40px)] text-[#111827] leading-tight"
            >
              Insights on
              <br />
              urban mobility.
            </motion.h2>
          </div>
          <motion.a
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            href="#"
            className="text-sm font-semibold text-[#3B5BFF] border-b border-[#3B5BFF]/30 pb-0.5 hover:border-[#3B5BFF] transition-colors whitespace-nowrap"
          >
            All Articles →
          </motion.a>
        </div>

        {/* Asymmetric blog layout: big + two small */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Big card */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white border border-[#E5E7EB] shadow-sm rounded-2xl overflow-hidden cursor-pointer group hover:shadow-md transition-shadow"
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={MOCK_BLOG_POSTS[0].image}
                alt={MOCK_BLOG_POSTS[0].title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-24"
                style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.8), transparent)' }}
              />
              <span
                className="absolute top-4 left-4 text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(59,91,255,0.1)', border: '1px solid rgba(59,91,255,0.25)', color: '#3B5BFF', backdropFilter: 'blur(8px)' }}
              >
                {MOCK_BLOG_POSTS[0].category}
              </span>
            </div>
            <div className="p-6">
              <h3 className="font-display font-bold text-xl text-[#111827] mb-3 leading-snug">{MOCK_BLOG_POSTS[0].title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed mb-4">{MOCK_BLOG_POSTS[0].excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                <span>{MOCK_BLOG_POSTS[0].date}</span>
                <span className="w-1 h-1 rounded-full bg-[#E5E7EB]" />
                <span>{MOCK_BLOG_POSTS[0].readTime}</span>
              </div>
            </div>
          </motion.article>

          {/* Two small cards */}
          <div className="flex flex-col gap-6">
            {MOCK_BLOG_POSTS.slice(1).map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-white border border-[#E5E7EB] shadow-sm rounded-xl overflow-hidden cursor-pointer group flex flex-col hover:shadow-md transition-shadow"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span
                    className="absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(59,91,255,0.1)', border: '1px solid rgba(59,91,255,0.25)', color: '#3B5BFF', backdropFilter: 'blur(8px)' }}
                  >
                    {post.category}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-display font-semibold text-sm text-[#111827] mb-2 leading-snug line-clamp-2">{post.title}</h3>
                  <div className="mt-auto flex items-center gap-2 text-[11px] text-[#6B7280]">
                    <span>{post.date}</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-[#E5E7EB]" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
