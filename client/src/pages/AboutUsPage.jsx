import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const STATS = [
  { n: 20, suffix: '+', label: 'Flavors in Stock' },
  { n: 100, suffix: '%', label: 'Authentic Checks' },
  { n: 500, suffix: '+', label: 'KTM Deliveries' },
  { n: 0, suffix: '', label: 'Fake Pods Sold' }
]

const TIMELINE = [
  {
    year: '2021',
    title: 'Fed Up.',
    body: 'Tired of paying Rs. 3000 for burnt, fake disposables in KTM. Tired of ghosting sellers. Something had to change.',
    highlight: 'Started tracking authentic suppliers.'
  },
  {
    year: '2022',
    title: 'Testing source.',
    body: 'Flew test batches in directly from manufacturers. Tested every device ourselves before sale. If we wouldn\'t vape it, it was trashed.',
    highlight: 'First 50 orders: 100% satisfaction.'
  },
  {
    year: '2023',
    title: 'Going Live.',
    body: 'Word spread fast. Launched same-day dispatch in KTM & Dhangadhi. Began wholesaling to trusted local shops.',
    highlight: 'Still verifying every single box.'
  }
]

const TEAM_FACTS = [
  { q: 'Favourite flavour?', a: 'Mango Ice. Every single time. No competition.' },
  { q: 'How do you verify products?', a: 'Serial security checks, direct supplier logs, and double-testing our inventory.' },
  { q: 'What if I receive a dud?', a: 'We replace it. Message us on WhatsApp or email, and we\'ll send a new one. No hassle.' }
]

function CountUp({ target, suffix }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        if (target === 0) { setCount(0); return }
        const steps = 30
        const increment = target / steps
        let current = 0
        const timer = setInterval(() => {
          current += increment
          if (current >= target) {
            setCount(target)
            clearInterval(timer)
          } else {
            setCount(Math.floor(current))
          }
        }, 1200 / steps)
      }
    }, { threshold: 0.1 })
    
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])
  
  return <span ref={ref}>{count}{suffix}</span>
}

export default function AboutUs() {
  const navigate = useNavigate()
  const [activeTimeline, setActiveTimeline] = useState(0)
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
      <Navbar />

      <div style={{ flex: 1, padding: '20px 16px', overflowY: 'auto', paddingBottom: '30px' }}>
        
        {/* Story Intro */}
        <div style={{ marginBottom: '24px' }}>
          <span style={{
            fontSize: '0.65rem', fontWeight: '750', letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--primary)',
            background: 'var(--primary-light)', padding: '4px 10px', borderRadius: '12px'
          }}>
            Our Story
          </span>
          <h1 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--dark)', marginTop: '12px', lineHeight: '1.25' }}>
            We got tired of buying fakes. <span style={{ color: 'var(--primary)' }}>So we fixed it.</span>
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--mid)', marginTop: '8px', lineHeight: '1.5' }}>
            Two vapers in Kathmandu who couldn't find a single reliable shop to buy authentic disposables. We spent months checking suppliers to launch Puff Diaries.
          </p>
        </div>

        {/* Stats Grid (2x2) */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px',
          marginBottom: '28px'
        }}>
          {STATS.map((s, i) => (
            <div
              key={i}
              style={{
                background: 'var(--white)', borderRadius: '16px', padding: '14px 10px',
                textAlign: 'center', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)'
              }}
            >
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)', lineHeight: '1' }}>
                <CountUp target={s.n} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--mid)', fontWeight: '600', marginTop: '4px' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Vertical Timeline */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: '750', color: 'var(--dark)', marginBottom: '14px' }}>How We Got Here</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative', paddingLeft: '8px' }}>
            {/* Dashed background line */}
            <div style={{
              position: 'absolute', top: '10px', bottom: '10px', left: '19px',
              width: '2px', borderLeft: '2px dashed var(--border)', zIndex: 1
            }} />

            {TIMELINE.map((t, i) => {
              const active = activeTimeline === i
              return (
                <div
                  key={i}
                  onClick={() => setActiveTimeline(active ? null : i)}
                  style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', cursor: 'pointer', position: 'relative', zIndex: 2, marginBottom: '16px' }}
                >
                  {/* Step bubble */}
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: active ? 'var(--primary)' : 'var(--white)',
                    border: active ? '2px solid var(--primary)' : '2px solid var(--light)',
                    color: 'var(--white)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold', flexShrink: 0
                  }}>
                    {active ? '✓' : ''}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h4 style={{ fontSize: '0.82rem', fontWeight: '750', color: active ? 'var(--primary)' : 'var(--dark)' }}>
                        {t.title}
                      </h4>
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--light)' }}>{t.year}</span>
                    </div>

                    {active && (
                      <div style={{ marginTop: '6px', animation: 'fadeIn 0.2s ease' }}>
                        <p style={{ fontSize: '0.78rem', color: 'var(--mid)', lineHeight: '1.4' }}>{t.body}</p>
                        <span style={{
                          display: 'inline-block', marginTop: '6px', background: 'var(--primary-light)',
                          color: 'var(--primary)', fontSize: '0.65rem', fontWeight: '700',
                          padding: '2px 8px', borderRadius: '8px'
                        }}>
                          {t.highlight}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Q&A Accordion */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: '750', color: 'var(--dark)', marginBottom: '14px' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {TEAM_FACTS.map((f, i) => {
              const active = openFaq === i
              return (
                <div
                  key={i}
                  onClick={() => setOpenFaq(active ? null : i)}
                  style={{
                    background: 'var(--white)', border: active ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                    borderRadius: '16px', padding: '12px 14px', cursor: 'pointer', transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: '750', color: 'var(--dark)', lineHeight: '1.3' }}>{f.q}</h4>
                    <span style={{
                      color: active ? 'var(--primary)' : 'var(--light)', fontSize: '1.1rem',
                      transform: active ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0
                    }}>+</span>
                  </div>
                  {active && (
                    <p style={{
                      fontSize: '0.75rem', color: 'var(--mid)', lineHeight: '1.4',
                      marginTop: '8px', borderTop: '1px solid var(--border)', paddingTop: '8px',
                      animation: 'fadeIn 0.2s ease'
                    }}>{f.a}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: 'var(--dark)', borderRadius: '24px', padding: '20px',
          color: 'var(--white)', textAlign: 'center', marginTop: '12px'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Come see what the fuss is about</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--light)', marginTop: '6px', marginBottom: '16px', lineHeight: '1.4' }}>
            20+ authentic flavors. Same day KTM dispatch. Secure payment wallet integrations.
          </p>
          <button onClick={() => navigate('/products')} className="primary-btn">
            Browse Flavors
          </button>
        </div>

      </div>
    </div>
  )
}