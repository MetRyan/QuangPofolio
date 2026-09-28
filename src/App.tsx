/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Mail, MapPin } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import ProjectDetailsPage from "./ProjectDetails";
import AdminPage from "./Admin";
import { ChatAssistant } from "./components/ChatAssistant";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { LanguageProvider, useI18n } from "./i18n/LanguageContext";
import type {
  ActivityContent,
  BeyondWorkspaceContent,
  CuratedMomentsContent,
  AboutContent,
  ProjectContent,
} from "./data/types";
import { curatedImageList, useSiteContent } from "./data/useSiteContent";

// --- Types ---
interface Project {
  id: number;
  title: string;
  subtitle: string;
  role: string;
  category: string;
  description: string;
  imageUrl: string;
}

// --- Components ---

const VoyagerGallery = ({ curated }: { curated: CuratedMomentsContent }) => {
  const { tx } = useI18n();
  const allImages = curatedImageList(curated.folder, curated.maxImages, curated.hiddenImages);
  const [errorSet, setErrorSet] = useState<Set<number>>(new Set());
  const images = allImages.filter((_, i) => !errorSet.has(i));

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [step, setStep] = useState(300);

  useEffect(() => {
    const handleResize = () => {
      setStep(window.innerWidth < 768 ? 150 : 300);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = () => {
    if (images.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    if (images.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (activeIndex >= images.length) setActiveIndex(0);
  }, [images.length, activeIndex]);

  useEffect(() => {
    if (isHovered || images.length === 0) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  return (
    <section 
      className="py-24 bg-black/40 border-t border-white/5 relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
        <div className="space-y-2 text-left">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-white/30">{curated.label}</span>
          <h3 className="font-display text-2xl md:text-4xl text-white">{curated.title}</h3>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handlePrev}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-white/30 text-white transition-all cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={handleNext}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-white/30 text-white transition-all cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* 3D Perspective Card Container */}
      <div className="relative h-[480px] md:h-[560px] w-full flex items-center justify-center overflow-hidden" style={{ perspective: "1200px" }}>
        <div className="relative w-full max-w-[280px] md:max-w-[340px] h-[380px] md:h-[460px] flex items-center justify-center">
          {images.map((imgUrl, idx) => {
            let offset = idx - activeIndex;
            const halfLength = images.length / 2;
            
            if (offset > halfLength) offset -= images.length;
            if (offset < -halfLength) offset += images.length;

            const isCenter = offset === 0;
            const isVisible = Math.abs(offset) <= 3;

            if (!isVisible) return null;

            // Compute 3D values based on offset distance to look majestic and fanned out beautifully
            const rotateY = offset * -18;
            const translateZ = Math.abs(offset) * -120;
            const translateX = offset * step;
            const scale = 1 - Math.abs(offset) * 0.12;
            const opacity = 1 - Math.abs(offset) * 0.22;
            const zIndex = 10 - Math.abs(offset);

            return (
              <motion.div
                key={idx}
                style={{
                  transformStyle: "preserve-3d",
                }}
                animate={{
                  x: translateX,
                  scale: scale,
                  rotateY: rotateY,
                  z: translateZ,
                  opacity: opacity,
                  zIndex: zIndex,
                }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 18,
                }}
                onClick={() => {
                  if (!isCenter) setActiveIndex(idx);
                }}
                className={cn(
                  "absolute inset-0 w-full h-full rounded-[2.5rem] overflow-hidden border border-white/10 cursor-pointer shadow-2xl transition-all duration-300",
                  isCenter ? "shadow-white/[0.05]" : "hover:border-white/20"
                )}
              >
                <img
                  src={imgUrl}
                  alt={`Highlight moment ${idx + 1}`}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  referrerPolicy="no-referrer"
                  onError={() => {
                    setErrorSet((prev) => new Set(prev).add(allImages.indexOf(imgUrl)));
                  }}
                />
                <div className={cn(
                  "absolute inset-0 transition-opacity duration-500",
                  isCenter 
                    ? "bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100" 
                    : "bg-black/50 hover:bg-black/40 opacity-100"
                )} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const AwakenedLeadersCard = ({ imgUrl, idx, rot, yOff }: { imgUrl: string; idx: number; rot: number; yOff: number; key?: React.Key }) => {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  return (
    <motion.div
      className="flex-shrink-0 w-[190px] md:w-[280px] h-[260px] md:h-[400px] rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.75)] snap-center bg-zinc-950 relative cursor-pointer"
      animate={{ rotate: rot, y: yOff }}
      whileHover={{ scale: 1.05, rotate: 0, y: yOff - 15, borderColor: "rgba(255,255,255,0.3)", zIndex: 30 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <img
        src={imgUrl}
        alt={`Awakened Leaders ${idx + 1}`}
        className="w-full h-full object-cover select-none pointer-events-none opacity-85 hover:opacity-100 transition-opacity duration-300"
        referrerPolicy="no-referrer"
        onError={() => setHidden(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
    </motion.div>
  );
};

const AwakenedLeadersGallery = ({
  folder,
  maxImages,
  hiddenImages,
  galleryLabel,
}: {
  folder: string;
  maxImages: number;
  hiddenImages: number[];
  galleryLabel: string;
}) => {
  const images = curatedImageList(folder, maxImages, hiddenImages);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Nghệ thuật xoay lệch và độ lệch trục Y so le (staggered) tạo cảm giác cực kỳ sang trọng và tự nhiên như tạp chí thời trang
  const rotations = [-5, 4, -2, 3, -4, 2, -3, 5, -1, 4];
  const yOffsets = [16, -12, 22, -14, 10, -18, 14, -8, 18, -12];

  const handleNext = () => {
    if (containerRef.current) {
      const cardWidth = window.innerWidth < 768 ? 214 : 320; // card width + gap
      containerRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (containerRef.current) {
      const cardWidth = window.innerWidth < 768 ? 214 : 320; // card width + gap
      containerRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
  };

  // Tự động lướt trôi nhẹ nhàng (smooth automatic drift)
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        if (scrollLeft >= scrollWidth - clientWidth - 20) {
          containerRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          const stepWidth = window.innerWidth < 768 ? 214 : 320;
          containerRef.current.scrollBy({ left: stepWidth, behavior: "smooth" });
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div 
      className="space-y-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="flex justify-between items-center relative z-10">
        <h4 className="text-xs font-mono uppercase tracking-widest text-white/40 pl-4">{galleryLabel}</h4>
        <div className="flex gap-2">
          <button 
            onClick={handlePrev}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-white/30 text-white transition-all cursor-pointer bg-black/30 backdrop-blur-sm"
            aria-label="Previous image"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={handleNext}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-white/30 text-white transition-all cursor-pointer bg-black/30 backdrop-blur-sm"
            aria-label="Next image"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Container mở rộng tràn viền (dàn rộng ra ngoài viền lề màn hình một chút) */}
      <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] px-4 md:px-12 overflow-visible">
        <div 
          ref={containerRef}
          className="flex gap-6 md:gap-10 overflow-x-auto py-12 px-12 scroll-smooth no-scrollbar snap-x snap-mandatory"
        >
          {images.map((imgUrl, idx) => {
            const rot = rotations[idx % rotations.length];
            const yOff = yOffsets[idx % yOffsets.length];

            return (
              <AwakenedLeadersCard key={idx} imgUrl={imgUrl} idx={idx} rot={rot} yOff={yOff} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const RetreatCard = ({ imgUrl, idx, rot, yOff }: { imgUrl: string; idx: number; rot: number; yOff: number; key?: React.Key }) => {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  return (
    <motion.div
      className="flex-shrink-0 w-[190px] md:w-[280px] h-[260px] md:h-[400px] rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.75)] snap-center bg-zinc-950 relative cursor-pointer"
      animate={{ rotate: rot, y: yOff }}
      whileHover={{ scale: 1.05, rotate: 0, y: yOff - 15, borderColor: "rgba(255,255,255,0.3)", zIndex: 30 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <img
        src={imgUrl}
        alt={`Activity ${idx + 1}`}
        className="w-full h-full object-cover select-none pointer-events-none opacity-85 hover:opacity-100 transition-opacity duration-300"
        referrerPolicy="no-referrer"
        onError={() => setHidden(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
    </motion.div>
  );
};

const ActivityGallery = ({
  folder,
  maxImages,
  galleryLabel,
}: {
  folder: string;
  maxImages: number;
  galleryLabel: string;
}) => {
  const images = Array.from({ length: maxImages }, (_, i) => `/assets/projects/${folder}/${i + 1}.jpg`);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const rotations = [-4, 3, -1, 5, -3, 2, -5, 4, -2, 3];
  const yOffsets = [12, -10, 18, -14, 8, -16, 14, -6, 16, -10];

  const handleNext = () => {
    if (containerRef.current) {
      const cardWidth = window.innerWidth < 768 ? 214 : 320;
      containerRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (containerRef.current) {
      const cardWidth = window.innerWidth < 768 ? 214 : 320;
      containerRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        if (scrollLeft >= scrollWidth - clientWidth - 20) {
          containerRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          const stepWidth = window.innerWidth < 768 ? 214 : 320;
          containerRef.current.scrollBy({ left: stepWidth, behavior: "smooth" });
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div 
      className="space-y-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="flex justify-between items-center relative z-10">
        <h4 className="text-xs font-mono uppercase tracking-widest text-white/40 pl-4">{galleryLabel}</h4>
        <div className="flex gap-2">
          <button 
            onClick={handlePrev}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-white/30 text-white transition-all cursor-pointer bg-black/30 backdrop-blur-sm"
            aria-label="Previous image"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={handleNext}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-white/30 text-white transition-all cursor-pointer bg-black/30 backdrop-blur-sm"
            aria-label="Next image"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] px-4 md:px-12 overflow-visible">
        <div 
          ref={containerRef}
          className="flex gap-6 md:gap-10 overflow-x-auto py-12 px-12 scroll-smooth no-scrollbar snap-x snap-mandatory"
        >
          {images.map((imgUrl, idx) => {
            const rot = rotations[idx % rotations.length];
            const yOff = yOffsets[idx % yOffsets.length];

            return (
              <RetreatCard key={idx} imgUrl={imgUrl} idx={idx} rot={rot} yOff={yOff} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const GlassButton = ({ 
  children, 
  className, 
  variant = 'large',
  onClick
}: { 
  children: React.ReactNode; 
  className?: string; 
  variant?: 'small' | 'large';
  onClick?: () => void;
}) => (
  <button 
    onClick={onClick}
    className={cn(
    "liquid-glass rounded-full text-white transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer",
    variant === 'small' ? "px-6 py-2.5 text-sm" : "px-14 py-5 text-base",
    className
  )}>
    {children}
  </button>
);

const TiltCard = ({ children, className, image, title }: { children?: React.ReactNode; className?: string; image?: string; title?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["20deg", "-20deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-20deg", "20deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
      className={cn("relative liquid-glass rounded-[2rem] overflow-visible group", className)}
    >
      <div 
        style={{ transform: "translateZ(-20px)" }}
        className="absolute inset-0 bg-white/5 blur-xl rounded-full"
      />

      <div style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }} className="w-full h-full relative z-10">
        {image ? (
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={image} 
              alt={title || "Portfolio Image"} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <motion.div 
               style={{ 
                 background: "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
                 transform: useTransform(mouseXSpring, [-0.5, 0.5], ["translateX(-100%)", "translateX(100%)"])
               }}
               className="absolute inset-0 pointer-events-none"
            />
          </div>
        ) : children}
      </div>

      <motion.div 
        style={{ 
          transform: "translateZ(100px)",
          x: useTransform(mouseXSpring, [-0.5, 0.5], ["10px", "-10px"]),
          y: useTransform(mouseYSpring, [-0.5, 0.5], ["10px", "-10px"])
        }}
        className="absolute -top-10 -right-10 w-24 h-24 liquid-glass rounded-2xl backdrop-blur-3xl border border-white/20 flex items-center justify-center z-20 pointer-events-none"
      >
         <div className="w-10 h-10 rounded-full border-2 border-white/40 border-dashed animate-spin-slow" />
      </motion.div>

      <motion.div 
        style={{ 
          transform: "translateZ(40px)",
          x: useTransform(mouseXSpring, [-0.5, 0.5], ["-20px", "20px"]),
          y: useTransform(mouseYSpring, [-0.5, 0.5], ["-20px", "20px"])
        }}
        className="absolute -bottom-8 -left-8 px-6 py-4 liquid-glass rounded-xl backdrop-blur-2xl border border-white/10 z-20 pointer-events-none"
      >
         <p className="text-[10px] uppercase tracking-widest text-white/40">Active Project</p>
         <p className="text-sm font-display">Fintech Hub 2026</p>
      </motion.div>
    </motion.div>
  );
};

const Home = ({
  projects,
  curated,
  activities,
  about,
  beyondWorkspace,
}: {
  projects: Project[];
  curated: CuratedMomentsContent;
  activities: ActivityContent[];
  about: AboutContent;
  beyondWorkspace: BeyondWorkspaceContent;
}) => {
  const navigate = useNavigate();
  const { t, tx } = useI18n();
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const activeProject = projects[activeProjectIndex] ?? projects[0];

  // Auto-advance logic: Every 5 seconds
  useEffect(() => {
    if (projects.length === 0) return;
    const timer = setInterval(() => {
      setActiveProjectIndex((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeProjectIndex, projects.length]);

  useEffect(() => {
    if (activeProjectIndex >= projects.length) setActiveProjectIndex(0);
  }, [projects.length, activeProjectIndex]);

  if (!activeProject) {
    return (
      <div className="relative min-h-screen bg-[hsl(var(--background))] text-white flex items-center justify-center">
        <p className="text-white/40">{t("projects.empty")}</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[hsl(var(--background))] text-left">
      {/* Video Background */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-40 scale-[1.02]">
          <source src="https://d8j0nticm91z4.cloudfront.net/user_38xzZboKVIGWJOttw/XH07IWA1P/hf_20260314_131748_12ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[hsl(var(--background))]" />
      </div>

      <div className="relative z-10">
        <nav className="flex flex-row justify-between items-center px-8 py-6 max-w-7xl mx-auto gap-4">
          <div className="font-display text-3xl tracking-tight text-white flex items-baseline gap-1 shrink-0">
            Nhật Quang <sup className="text-[10px] font-body opacity-60 tracking-wider">SVF</sup>
          </div>
          <div className="hidden lg:flex items-center gap-8">
            {[
              { label: t("nav.home"), href: "#home" },
              { label: t("nav.projects"), href: "#projects" },
              { label: t("nav.beyond"), href: "#gallery" },
              { label: t("nav.about"), href: "#about" },
            ].map((item) => (
              <a key={item.href} href={item.href} className="text-sm text-white/50 hover:text-white transition-colors duration-300 tracking-wide">{item.label}</a>
            ))}
            <a href="/docs/cv.pdf" target="_blank" className="text-xs font-body tracking-[0.2em] uppercase text-white/30 hover:text-white border border-white/10 px-4 py-2 rounded-lg transition-all">{t("nav.resume")}</a>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <LanguageSwitcher />
            <GlassButton variant="small" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
              {t("nav.connect")}
            </GlassButton>
          </div>
        </nav>

        <section id="home" className="px-6 pt-32 pb-32 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_400px] gap-16 items-start w-full mb-32">
            <div className="text-left space-y-8 pt-8">
              <h1 className="font-display text-5xl sm:text-7xl lg:text-[100px] leading-[0.95] tracking-[-0.03em] font-normal animate-fade-rise">Trần Nhật Quang</h1>
              <p className="text-white/60 text-lg sm:text-xl max-w-xl leading-relaxed animate-fade-rise-delay">"{t("hero.quote")}"</p>
              <div className="animate-fade-rise-delay-2 pt-4">
                <GlassButton onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>{t("hero.cta")}</GlassButton>
              </div>
            </div>
            <div className="relative animate-fade-rise-delay-2 group/hero">
              <TiltCard className="aspect-[3/4] w-full max-w-[400px] mx-auto" title="Nhật Quang" image="/assets/avatar.jpg" />
              <div className="absolute -bottom-6 -right-6 liquid-glass p-6 rounded-2xl hidden lg:block backdrop-blur-2xl border border-white/10 shadow-2xl z-30 min-w-[200px]">
                 <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{t("hero.dob")}</p>
                 <p className="text-xl font-display">08/04/2003</p>
              </div>
            </div>
          </div>

          <div id="about" className="grid md:grid-cols-2 gap-24 items-start border-t border-white/5 pt-32 text-left">
              <div className="space-y-12">
                <div className="animate-fade-rise">
                  <h2 className="font-display text-5xl text-white mb-8">
                    {tx(about.educationTitleMain) || t("about.educationMain")}{" "}
                    <em className="not-italic text-white/40">{tx(about.educationTitleEm) || t("about.educationEm")}</em>
                  </h2>
                  <div className="space-y-8">
                    {about.education.filter((e) => !e.hidden).map((item, index) => (
                      <div
                        key={item.id}
                        className={cn("group", index > 0 && "border-t border-white/5 pt-8")}
                      >
                        <p className="text-xs text-white/30 mb-1 tracking-widest">{tx(item.period)}</p>
                        <h4 className="text-xl font-display text-white">{tx(item.institution)}</h4>
                        <p className="text-white/50 text-sm">{tx(item.detail)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-12 animate-fade-rise">
                <div>
                  <h2 className="font-display text-5xl text-white mb-8">
                    {tx(about.experienceTitleMain) || t("about.experienceMain")}{" "}
                    <em className="not-italic text-white/40">{tx(about.experienceTitleEm) || t("about.experienceEm")}</em>
                  </h2>
                  <div className="space-y-8">
                    {about.experience.filter((e) => !e.hidden).map((item) => (
                      <div
                        key={item.id}
                        className="liquid-glass p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group"
                      >
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                          <MapPin className="w-12 h-12" />
                        </div>
                        <p className="text-xs text-white/30 mb-1 tracking-widest">{tx(item.period)}</p>
                        <h4 className="text-2xl font-display text-white">{tx(item.company)}</h4>
                        <p className="text-white/60 mt-4 leading-relaxed">{tx(item.description)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
        </section>

        <section id="projects" className="py-32 bg-black/40 backdrop-blur-md border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8 text-left">
              <div className="space-y-4">
                <h2 className="font-display text-5xl md:text-7xl text-white">{t("projects.titleMain")} <em className="not-italic text-white/40">{t("projects.titleEm")}</em></h2>
                <div className="h-1 w-24 bg-white/20" />
              </div>
              <p className="text-white/50 max-w-sm text-lg leading-relaxed">{t("projects.intro")}</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-24 items-start">
              {/* Project Navigation List */}
              <div className="space-y-4 text-left max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                {projects.map((project, index) => (
                  <button
                    key={project.id}
                    onClick={() => setActiveProjectIndex(index)}
                    className={cn(
                      "w-full text-left p-6 rounded-2xl transition-all duration-300 border group relative overflow-hidden",
                      activeProjectIndex === index 
                        ? "bg-white/10 border-white/20" 
                        : "bg-transparent border-transparent hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <span className={cn(
                        "text-[10px] font-mono opacity-40 transition-colors",
                        activeProjectIndex === index ? "text-white" : "text-white/20"
                      )}>
                        0{index + 1}
                      </span>
                      <div className="flex-1">
                        <p className={cn(
                          "text-[9px] tracking-[0.3em] uppercase mb-1",
                          activeProjectIndex === index ? "text-white/60" : "text-white/20"
                        )}>
                          {tx(project.category)}
                        </p>
                        <h4 className={cn(
                          "font-display text-lg transition-colors leading-tight",
                          activeProjectIndex === index ? "text-white" : "text-white/40"
                        )}>
                          {tx(project.title)}
                        </h4>
                      </div>
                    </div>
                    {activeProjectIndex === index && (
                      <motion.div 
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 5, ease: "linear" }}
                        className="absolute bottom-0 left-0 h-0.5 bg-white origin-left w-full pointer-events-none opacity-20"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Active Project Card Display */}
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeProject.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="space-y-8 text-left"
                  >
                    <div 
                      onClick={() => navigate(`/project/${activeProject.id}`)} 
                      className="cursor-pointer"
                    >
                      <TiltCard 
                        image={activeProject.imageUrl} 
                        className="aspect-[16/10] w-full" 
                      />
                    </div>
                    
                    <div className="space-y-6 max-w-2xl">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-body tracking-[0.3em] uppercase text-white/40 px-3 py-1 border border-white/10 rounded-full">
                          {tx(activeProject.role)}
                        </span>
                      </div>
                      <h3 className="font-display text-4xl md:text-5xl text-white leading-[1.1]">
                        {tx(activeProject.title)}
                      </h3>
                      <p className="text-white/60 text-lg leading-relaxed font-light">
                        {tx(activeProject.description)}
                      </p>
                      <GlassButton variant="small" onClick={() => navigate(`/project/${activeProject.id}`)}>
                        {t("projects.viewDetails")}
                      </GlassButton>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        <VoyagerGallery curated={curated} />

        <section id="gallery" className="py-32 bg-black/60 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-24 space-y-6">
              <h2 className="font-display text-5xl md:text-7xl text-white">
                {beyondWorkspace.titleMain}{" "}
                <em className="not-italic text-white/40">{beyondWorkspace.titleEm}</em>
              </h2>
              <p className="text-white/50 text-lg max-w-2xl mx-auto">{beyondWorkspace.subtitle}</p>
            </div>

            {!beyondWorkspace.leadership.hidden && (
            <div className="mb-32 space-y-16">
              <div className="border-l-4 border-white/20 pl-6 space-y-4">
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-white/40">
                  {beyondWorkspace.leadership.label}
                </span>
                <h3 className="font-display text-3xl md:text-5xl text-white leading-tight">
                  {beyondWorkspace.leadership.title}
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-stretch">
                <div className="flex flex-col gap-6 h-full justify-between">
                  <div className="liquid-glass p-8 rounded-[2rem] border border-white/10 space-y-4 flex-grow">
                    <h4 className="text-sm font-mono uppercase tracking-widest text-white/60">
                      {beyondWorkspace.leadership.missionTitle}
                    </h4>
                    <p className="text-white/80 text-lg leading-relaxed font-light whitespace-pre-line">
                      {beyondWorkspace.leadership.missionText}
                    </p>
                  </div>

                  <div className="liquid-glass p-8 rounded-[2rem] border border-white/10 space-y-4 flex-shrink-0">
                    <h4 className="text-sm font-mono uppercase tracking-widest text-white/60">
                      {beyondWorkspace.leadership.rolesTitle}
                    </h4>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {beyondWorkspace.leadership.roles.map((role, i) => (
                        <span
                          key={`${role}-${i}`}
                          className="text-xs bg-white/10 hover:bg-white/20 text-white/90 px-4 py-2 rounded-full border border-white/5 transition-all"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6 flex flex-col h-[460px] md:h-[480px]">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-2 pl-4 flex-shrink-0">
                    {beyondWorkspace.leadership.programsTitle}
                  </h4>
                  <div className="space-y-4 overflow-y-auto pr-2 flex-grow custom-scrollbar">
                    {beyondWorkspace.leadership.programs
                      .filter((prog) => !prog.hidden)
                      .map((prog) => (
                        <div
                          key={prog.id}
                          className="liquid-glass p-6 rounded-2xl border border-white/5 hover:border-white/25 transition-all space-y-2"
                        >
                          <h5 className="font-display text-lg text-white font-medium">{prog.title}</h5>
                          <p className="text-white/60 text-sm leading-relaxed font-light">{prog.desc}</p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <AwakenedLeadersGallery
                folder={beyondWorkspace.leadership.folder}
                maxImages={beyondWorkspace.leadership.maxImages}
                hiddenImages={beyondWorkspace.leadership.hiddenImages}
                galleryLabel={beyondWorkspace.leadership.galleryLabel}
              />
            </div>
            )}
  <div className="border-l-4 border-white/20 pl-6 space-y-4">
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-white/40">Hoạt động khác</span>
                <h3 className="font-display text-3xl md:text-5xl text-white leading-tight">
Chạy bộ, Trekking và Flag football không chỉ là thể thao - đó là cách tôi rèn luyện sự bền bỉ và tinh thần kỷ luật và tinh thần lãnh đạo

                </h3>
              </div>
            {/* Layer 2: Thể Thao & Phong Cách Sống */}
            <div className="space-y-12 border-t border-white/5 pt-16">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">
                <div className="md:col-span-2 md:row-span-2">
                  <TiltCard image="/assets/gallery/rugby3.jpg" className="w-full h-full">
                    <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-xs uppercase tracking-widest text-white/60">Sport</p>
                      <p className="text-2xl font-display text-white">Rugby Enthusiast</p>
                    </div>
                  </TiltCard>
                </div>
                <div className="md:col-span-2 md:row-span-1"><TiltCard image="/assets/gallery/trekking4.jpg" className="w-full h-full" /></div>
                <div className="md:col-span-1 md:row-span-1"><TiltCard image="/assets/gallery/running1.jpg" className="w-full h-full" /></div>
                <div className="md:col-span-1 md:row-span-1"><TiltCard image="/assets/gallery/running2.jpg" className="w-full h-full" /></div>
                <div className="md:col-span-2 md:row-span-1"><TiltCard image="/assets/gallery/activity5.jpg" className="w-full h-full" /></div>
                <div className="md:col-span-2 md:row-span-1">
                   <div className="liquid-glass w-full h-full rounded-[2rem] flex flex-col items-center justify-center p-8 text-center border border-white/5">
                      <p className="font-display text-3xl text-white mb-2 italic">Life in Motion</p>
                      <p className="text-white/40 text-sm">Chạy bộ, Trekking và Rugby không chỉ là thể thao - đó là cách tôi rèn luyện sự bền bỉ và tinh thần kỷ luật.</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Dynamic activities (format: Hành Trình Về Nguồn & Tu Tập) */}
            {activities.filter((a) => !a.hidden).map((activity) => (
              <div key={activity.id} className="space-y-16 border-t border-white/5 pt-24 mt-24">
                <div className="border-l-4 border-white/20 pl-6 space-y-4">
                  <span className="text-xs font-mono uppercase tracking-[0.3em] text-white/40">{activity.label}</span>
                  <h3 className="font-display text-3xl md:text-5xl text-white leading-tight">
                    {activity.title}
                  </h3>
                  <p className="text-white/50 text-base max-w-4xl font-light leading-relaxed">
                    {activity.description}
                  </p>
                </div>
                <ActivityGallery
                  folder={activity.folder}
                  maxImages={activity.maxImages}
                  galleryLabel={activity.galleryLabel}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="py-32 bg-black border-t border-white/5 relative">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
              <h2 className="font-display text-6xl md:text-8xl text-white leading-[0.9]">Let's Build <br/> <em className="not-italic text-white/40">Together.</em></h2>
              <p className="text-white/50 text-xl max-w-md">Luôn sẵn lòng cho những ý tưởng mới, những dự án đột phá và những cơ hội hợp tác ý nghĩa.</p>
              <div className="flex flex-col gap-4 text-white/80">
                <div className="flex items-center gap-4 group"><div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all"><Mail className="w-5 h-5" /></div><span>quangtnh.asi@gmail.com</span></div>
                <div className="flex items-center gap-4 group"><div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all"><MapPin className="w-5 h-5" /></div><span>Ho Chi Minh City, Vietnam</span></div>
              </div>
            </div>
            <div className="liquid-glass p-12 rounded-[2rem] space-y-8">
               <h4 className="text-2xl font-display">Gửi thông điệp</h4>
               <div className="space-y-4">
                  <input type="text" placeholder="Họ và tên" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-white/30 transition-colors" />
                  <input type="email" placeholder="Email liên hệ" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-white/30 transition-colors" />
                  <textarea placeholder="Nội dung" rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-white/30 transition-colors" />
                  <button className="w-full bg-white text-black font-medium py-5 rounded-xl hover:bg-white/90 transition-all cursor-pointer">Gửi ngay</button>
               </div>
            </div>
          </div>
          <footer className="mt-32 pt-12 border-t border-white/5 max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 pb-12">
            <div className="font-display text-2xl">Nhật Quang</div>
            <div className="text-xs tracking-[0.2em] uppercase text-white/30 flex items-center justify-center gap-2">
          © 2026 Xây dựng sự bền vững từ những hệ thống logic
          <div className="w-1 h-1 rounded-full bg-green-500/40 animate-pulse" />
        </div>
            <div className="flex gap-8 text-white/40 text-xs tracking-widest uppercase">
              <a href="https://www.facebook.com/trannhat.quang.311/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a>
              <a href="https://www.instagram.com/sapios_error/?hl=en" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
              <a href="https://www.linkedin.com/in/quang-tr%E1%BA%A7n-nh%E1%BA%ADt-67351b36b/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
};

export default function App() {
  const [mounted, setMounted] = useState(false);
  const { content, ready } = useSiteContent();

  useEffect(() => {
    setMounted(true);
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const projects: Project[] = content.projects
    .filter((p: ProjectContent) => !p.hidden)
    .map((p: ProjectContent) => ({
      id: p.id,
      title: p.title,
      subtitle: p.subtitle,
      role: p.role,
      category: p.category,
      description: p.description,
      imageUrl: p.imageUrl,
    }));

  if (!mounted || !ready) return null;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              projects={projects}
              curated={content.curatedMoments}
              activities={content.activities}
              about={content.about}
              beyondWorkspace={content.beyondWorkspace}
            />
          }
        />
        <Route path="/project/:id" element={<ProjectDetailsPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <ChatAssistant />
    </Router>
  );
}
