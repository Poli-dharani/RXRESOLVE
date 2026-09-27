import React, { useState, useEffect, useRef } from 'react';
import { ClayButton } from '../clay/ClayButton';
import { ClayCard, ClayCardBody } from '../clay/ClayCard';
import { ClayBadge } from '../clay/ClayBadge';
import { ChevronDown, Pill, Zap, Users, Shield, TrendingUp } from 'lucide-react';

interface LandingPageNewProps {
  onEnterDemo: () => void;
}

export const LandingPageNew: React.FC<LandingPageNewProps> = ({ onEnterDemo }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => [...new Set([...prev, entry.target.id])]);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Interactive mouse tracking effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const tracker = document.getElementById('mouseTracker');
      if (!tracker) return;

      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      // Create a subtle light gradient that follows the mouse
      const bgColor = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(107, 158, 255, 0.05) 0%, transparent 50%)`;
      tracker.style.background = bgColor;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll-triggered video zoom effect
  useEffect(() => {
    const handleScroll = () => {
      const video = document.querySelector('video');
      if (!video) return;

      const scrollPercent = (window.scrollY / window.innerHeight) * 100;
      const zoomLevel = 1 + (scrollPercent / 200); // Zoom from 1 to ~1.5 as user scrolls

      video.style.transform = `scale(${zoomLevel})`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="bg-[#F6F8FC] min-h-screen w-full overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* Navigation */}
      <nav className="fixed top-6 left-6 right-6 z-50 flex justify-between items-center">
        <div className="text-2xl font-bold text-[#6B9EFF]">RXRESOLVE</div>
        <button
          onClick={onEnterDemo}
          className="px-6 py-2 bg-[#6B9EFF] text-white rounded-full font-semibold hover:shadow-lg transition-all"
        >
          Enter Demo
        </button>
      </nav>

      {/* HERO SECTION */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: 'brightness(0.6) blur(2px)',
            zIndex: 0
          }}
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F6F8FC]/40 via-[#F6F8FC]/30 to-[#EEF3F9]/50 z-1" />
        {/* Animated gradient orbs - ENHANCED VISIBILITY */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          {/* Large floating blur orb - top left */}
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-gradient-to-br from-[#6B9EFF] to-[#DCEBFF] rounded-full opacity-35 blur-2xl animate-float" style={{ animationDuration: '20s' }} />

          {/* Large floating blur orb - bottom right */}
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-gradient-to-tl from-[#77CFC1] to-[#E0F5F2] rounded-full opacity-35 blur-2xl animate-float-slow" style={{ animationDuration: '25s' }} />

          {/* Medium clay sphere - top right */}
          <div className="absolute top-10 right-20 w-48 h-48 bg-gradient-to-br from-[#DCD7FF] to-[#AFA7FF] rounded-full opacity-40 shadow-[0_20px_50px_rgba(175,167,255,0.3)] animate-float" style={{ animationDelay: '1s', animationDuration: '8s' }} />

          {/* Small clay pill shape - left side */}
          <div className="absolute top-1/4 left-16 w-40 h-20 bg-gradient-to-r from-[#DCEBFF] to-[#6B9EFF] rounded-full opacity-38 shadow-[0_15px_40px_rgba(107,158,255,0.25)] animate-float-slow" style={{ animationDelay: '0.5s', animationDuration: '12s' }} />

          {/* Mini sphere - bottom left */}
          <div className="absolute bottom-20 left-32 w-32 h-32 bg-[#CDEEDB] rounded-full opacity-35 shadow-[0_10px_30px_rgba(77,171,100,0.2)] animate-float" style={{ animationDelay: '2.5s', animationDuration: '10s' }} />

          {/* Cube shape animation - right center */}
          <div className="absolute right-10 top-1/2 w-36 h-36 bg-[#FFE5B5] rounded-3xl opacity-32 shadow-[0_15px_35px_rgba(255,181,181,0.2)] animate-float" style={{ animationDelay: '1.5s', animationDuration: '15s' }} />

          {/* Animated gradient line effect - top to bottom */}
          <div className="absolute left-1/2 top-0 w-1 h-full bg-gradient-to-b from-transparent via-[#6B9EFF] to-transparent opacity-25" />
        </div>

        {/* Interactive mouse tracking background */}
        <div className="absolute inset-0 opacity-30 pointer-events-none" id="mouseTracker" />

        {/* Floating background shapes */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-[#DCEBFF] rounded-full opacity-40 animate-float" />
        <div className="absolute bottom-32 right-20 w-52 h-52 bg-[#DCD7FF] rounded-full opacity-38 animate-float-slow" />
        <div className="absolute top-1/3 right-1/4 w-36 h-36 bg-[#E0F5F2] rounded-full opacity-40 animate-float" style={{ animationDelay: '2s' }} />

        <div className="relative z-20 max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-black leading-tight mb-4 text-[#1F2937]">
            Every stuck refill
            <br />
            <span className="bg-gradient-to-r from-[#6B9EFF] to-[#77CFC1] bg-clip-text text-transparent">
              has a reason.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-[#64748B] mb-12 font-light">
            RXRESOLVE finds it.
          </p>

          <p className="text-lg text-[#64748B] mb-12 max-w-2xl mx-auto">
            AI-powered refill orchestration for pharmacies and physician groups.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <ClayButton size="lg" onClick={onEnterDemo}>
              ENTER DEMO
            </ClayButton>
            <ClayButton size="lg" variant="secondary">
              EXPLORE HOW IT WORKS
            </ClayButton>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-[#6B9EFF]" />
          </div>
        </div>
      </section>

      {/* HERO WORKFLOW OBJECT */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20" data-animate id="workflow">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${visibleSections.includes('workflow') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-5xl font-bold mb-16 text-[#1F2937]">
            The Orchestration Layer
          </h2>

          {/* Workflow Diagram */}
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <ClayCard className="px-8 py-4 w-40 animate-scale-in">
                <div className="font-semibold text-[#1F2937]">PHARMACY</div>
              </ClayCard>
              <div className="text-3xl text-[#6B9EFF]">↓</div>

              <ClayCard className="px-8 py-6 w-48 bg-gradient-to-br from-[#6B9EFF] to-[#77CFC1] text-white shadow-lg animate-glow" style={{ animationDelay: '0.2s' }}>
                <div className="text-xl font-bold">RXRESOLVE</div>
                <div className="text-sm opacity-90">AI Orchestration</div>
              </ClayCard>

              <div className="text-3xl text-[#77CFC1]">↓</div>

              <ClayCard className="px-8 py-4 w-40 animate-scale-in" style={{ animationDelay: '0.4s' }}>
                <div className="font-semibold text-[#1F2937]">PROVIDER</div>
              </ClayCard>

              <div className="text-3xl text-[#6B9EFF]">↓</div>

              <ClayCard className="px-8 py-4 w-40 animate-scale-in" style={{ animationDelay: '0.6s' }}>
                <div className="font-semibold text-[#1F2937]">RESOLVED</div>
              </ClayCard>
            </div>
          </div>

          <p className="text-xl text-[#64748B] mt-16 max-w-2xl mx-auto">
            One workflow. Every hand-off. One source of truth.
          </p>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20 bg-[#EEF3F9]" data-animate id="problem">
        <div className={`max-w-4xl mx-auto transition-all duration-1000 ${visibleSections.includes('problem') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-5xl font-bold mb-12 text-[#1F2937] text-center">
            A refill isn't a single transaction
          </h2>

          <div className="space-y-8">
            <p className="text-xl text-[#64748B] text-center max-w-2xl mx-auto">
              Multiple stakeholders. Disconnected systems. Invisible bottlenecks.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <ClayCard className="p-6 transform hover:scale-105 transition-transform">
                <ClayCardBody>
                  <Pill className="w-12 h-12 text-[#6B9EFF] mb-4" />
                  <h3 className="font-bold text-lg mb-2 text-[#1F2937]">PATIENT</h3>
                  <p className="text-[#64748B]">Requests refill</p>
                </ClayCardBody>
              </ClayCard>

              <ClayCard className="p-6 transform hover:scale-105 transition-transform">
                <ClayCardBody>
                  <Users className="w-12 h-12 text-[#77CFC1] mb-4" />
                  <h3 className="font-bold text-lg mb-2 text-[#1F2937]">PHARMACY</h3>
                  <p className="text-[#64748B]">Receives request</p>
                </ClayCardBody>
              </ClayCard>

              <ClayCard className="p-6 transform hover:scale-105 transition-transform">
                <ClayCardBody>
                  <Shield className="w-12 h-12 text-[#AFA7FF] mb-4" />
                  <h3 className="font-bold text-lg mb-2 text-[#1F2937]">PROVIDER</h3>
                  <p className="text-[#64748B]">Must authorize</p>
                </ClayCardBody>
              </ClayCard>

              <ClayCard className="p-6 transform hover:scale-105 transition-transform">
                <ClayCardBody>
                  <TrendingUp className="w-12 h-12 text-[#FFB55B] mb-4" />
                  <h3 className="font-bold text-lg mb-2 text-[#1F2937]">INSURANCE</h3>
                  <p className="text-[#64748B]">Must approve</p>
                </ClayCardBody>
              </ClayCard>
            </div>

            <p className="text-lg text-[#64748B] text-center max-w-3xl mx-auto mt-12">
              Without coordination, refills get stuck. Providers don't know what the pharmacy needs. Pharmacies don't know why authorization failed. Patients are left waiting.
            </p>
          </div>
        </div>
      </section>

      {/* AI INTELLIGENCE */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20" data-animate id="ai">
        <div className={`max-w-4xl mx-auto transition-all duration-1000 ${visibleSections.includes('ai') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-5xl font-bold mb-12 text-[#1F2937] text-center">
            Intelligence Meets Orchestration
          </h2>

          <ClayCard className="p-12 mb-12 bg-gradient-to-br from-white to-[#DCEBFF] shadow-lg">
            <ClayCardBody>
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-[#1F2937] mb-4">
                    RXRESOLVE ANALYZES
                  </h3>
                  <p className="text-[#64748B]">Reading prescription context...</p>
                </div>

                <div className="space-y-3">
                  {['Checking refill history...', 'Reviewing encounters...', 'Identifying blockers...', 'Preparing recommendations...'].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#6B9EFF] rounded-full" />
                      <span className="text-[#64748B]">{step}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-white rounded-2xl border-2 border-[#DCEBFF]">
                  <div className="text-center mb-4">
                    <ClayBadge variant="blue">BLOCKER FOUND</ClayBadge>
                  </div>
                  <h4 className="text-xl font-bold text-[#1F2937] mb-2">
                    No refills remaining
                  </h4>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-[#64748B]">Confidence</span>
                    <span className="text-2xl font-bold text-[#6B9EFF]">96%</span>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-2xl border-2 border-[#CDEEDB]">
                  <h4 className="font-bold text-[#1F2937] mb-2">Next Action</h4>
                  <p className="text-lg text-[#77CFC1] font-semibold">Provider Review</p>
                </div>

                <p className="text-sm text-[#64748B] text-center italic mt-6">
                  AI recommendation — human approval required.
                </p>
              </div>
            </ClayCardBody>
          </ClayCard>

          <p className="text-center text-xl text-[#64748B] max-w-2xl mx-auto">
            Every recommendation surfaces the why, the evidence, and the next action.
          </p>
        </div>
      </section>

      {/* PATIENT 360 */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20 bg-[#EEF3F9]" data-animate id="patient360">
        <div className={`max-w-4xl mx-auto transition-all duration-1000 ${visibleSections.includes('patient360') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-5xl font-bold mb-12 text-[#1F2937] text-center">
            Patient 360
          </h2>

          <ClayCard className="p-12 mb-12 shadow-lg">
            <ClayCardBody>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#6B9EFF] to-[#77CFC1] rounded-full flex items-center justify-center text-white font-bold text-xl">
                    SM
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#1F2937]">Sarah Mitchell</h3>
                    <p className="text-[#64748B]">58 years old • MRN: 4521947</p>
                  </div>
                </div>

                <div className="border-t border-[#E2E8F0] pt-6 mt-6">
                  <h4 className="font-bold text-[#1F2937] mb-4">Active Medications</h4>
                  <div className="space-y-3">
                    {['Atorvastatin 20 mg', 'Lisinopril 10 mg', 'Amlodipine 5 mg'].map((med, i) => (
                      <ClayBadge key={i} variant="blue" className="block text-left">
                        {med}
                      </ClayBadge>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#E2E8F0] pt-6">
                  <h4 className="font-bold text-[#1F2937] mb-4">Recent Activity</h4>
                  <div className="space-y-2 text-sm text-[#64748B]">
                    <p>✓ Last encounter: 2 weeks ago</p>
                    <p>✓ Last labs: 1 month ago (normal)</p>
                    <p>✓ Refill history: 12 resolved, 1 pending</p>
                  </div>
                </div>
              </div>
            </ClayCardBody>
          </ClayCard>

          <p className="text-center text-xl text-[#64748B] max-w-2xl mx-auto">
            All the context you need, in one place. No toggling between systems.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20" data-animate id="features">
        <div className={`max-w-6xl mx-auto transition-all duration-1000 ${visibleSections.includes('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-5xl font-bold mb-16 text-[#1F2937] text-center">
            Designed for Everyone
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'REFILL INTELLIGENCE', desc: 'Understand why refills are stuck.' },
              { title: 'PATIENT 360', desc: 'Complete context at a glance.' },
              { title: 'AI COPILOT', desc: 'Smart recommendations.' },
              { title: 'WORKFLOW ORCHESTRATION', desc: 'Coordinate every hand-off.' },
              { title: 'ROLE-BASED ACCESS', desc: 'Right information, right person.' },
              { title: 'AUDIT TRAIL', desc: 'Complete accountability.' }
            ].map((feature, i) => (
              <ClayCard
                key={i}
                className="p-8 hover:scale-105 transition-transform"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <ClayCardBody>
                  <h3 className="font-bold text-lg text-[#1F2937] mb-2">{feature.title}</h3>
                  <p className="text-[#64748B]">{feature.desc}</p>
                </ClayCardBody>
              </ClayCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-br from-[#6B9EFF] to-[#77CFC1] text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -translate-y-1/2" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-6xl font-bold mb-6">
            Turn stuck refills into resolved workflows.
          </h2>

          <p className="text-2xl font-light mb-12 opacity-90">
            Understand. Coordinate. Resolve.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={onEnterDemo}
              className="px-8 py-4 bg-white text-[#6B9EFF] rounded-full font-bold text-lg hover:shadow-2xl transition-all"
            >
              ENTER DEMO WORKSPACE
            </button>
            <button className="px-8 py-4 bg-white bg-opacity-20 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-opacity-30 transition-all">
              RUN LIVE DEMO
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
