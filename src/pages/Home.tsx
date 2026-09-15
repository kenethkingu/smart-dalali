import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Hero } from '../components/home/Hero'
import { PropertyCard } from '../components/properties/PropertyCard'
import { PrimaryButton } from '../components/shared/Bits'
import { properties } from '../data/mockData'

export function Home() {
  const featured = properties.filter(p => p.sponsored)
  const recent = properties.slice(0, 4)

  return (
    <div className="bg-white min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <Hero />
      </motion.div>
      
      {/* Featured Properties */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-end justify-between mb-10 gap-4 text-center sm:text-left"
          >
            <div>
              <h2 className="text-3xl font-heading font-bold text-pl-ink mb-2">Featured Properties</h2>
              <p className="text-pl-muted max-w-2xl">Hand-picked properties from trusted owners across the city.</p>
            </div>
            <Link to="/properties">
              <PrimaryButton className="bg-pl-ink hover:bg-black w-full sm:w-auto">
                View All
              </PrimaryButton>
            </Link>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featured.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <PropertyCard property={p} />
              </motion.div>
            ))}
            {/* Adding extra cards for visual padding in this demo */}
            {recent.map((p, i) => (
              <motion.div key={`${p.id}-extra`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: (featured.length + i) * 0.1 }}>
                <PropertyCard property={{...p, id: p.id + '-extra'}} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Banner */}
      <section className="py-20 bg-pl-ink text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-heading font-bold mb-12"
          >
            How Proland Works
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              { step: 1, title: 'Find a Property', desc: 'Browse our curated list of verified homes and plots.' },
              { step: 2, title: 'Request a Visit', desc: 'Schedule a site visit and communicate directly with the owner.' },
              { step: 3, title: 'Secure Your Deal', desc: 'Pay securely and finalize your next property.' }
            ].map((item, i) => (
              <motion.div 
                key={item.step}
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="space-y-4"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-3xl font-bold font-heading ${item.step === 3 ? 'bg-pl-accent' : 'bg-white/10'}`}>
                  {item.step}
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-white/70">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
