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
import { ChatAssistant } from "./components/ChatAssistant";

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

const VoyagerGallery = () => {
  const defaultImages = [
    "/assets/projects/finland/6.jpg",
    "/assets/projects/techfest2024/9.jpg",
    "/assets/projects/startup_trip/7.jpg",
    "/assets/projects/awakened_leaders/5.jpg",
    "/assets/projects/vietnam_market/2.jpg",
    "/assets/projects/greenbio/3.jpg",
    "/assets/projects/innovation_challenge/8.jpg",
    "/assets/projects/sitecatcher/2.jpg",
    "/assets/projects/finland/3.jpg",
    "/assets/projects/techfest2024/5.jpg",
    "/assets/projects/startup_trip/3.jpg",
    "/assets/projects/awakened_leaders/2.jpg",
  ];

  // Thêm ảnh: đặt tên theo số thứ tự tiếp theo vào folder curated_moments (tối đa 40)
  const allImages = Array.from({ length: 40 }, (_, i) => `/assets/projects/curated_moments/${i + 1}.jpg`);
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
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section 
      className="py-24 bg-black/40 border-t border-white/5 relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
        <div className="space-y-2 text-left">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-white/30">Curated Moments</span>
          <h3 className="font-display text-2xl md:text-4xl text-white">Khoảnh khắc Đồng hành</h3>
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
                    setErrorSet(prev => new Set(prev).add(allImages.indexOf(imgUrl)));
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

const AwakenedLeadersCard = ({ imgUrl, idx, rot, yOff }: { imgUrl: string; idx: number; rot: number; yOff: number }) => {
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

const AwakenedLeadersGallery = () => {
  // Thêm ảnh: đặt tên theo số thứ tự tiếp theo vào folder awakened_leaders (tối đa 20)
  // Thêm ảnh: đặt tên theo số thứ tự tiếp theo vào folder awakened_leaders (tối đa 20)
  const images = Array.from({ length: 20 }, (_, i) => `/assets/projects/awakened_leaders/${i + 1}.jpg`);

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
        <h4 className="text-xs font-mono uppercase tracking-widest text-white/40 pl-4">Khoảnh khắc & Hoạt động</h4>
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

const RetreatCard = ({ imgUrl, idx, rot, yOff }: { imgUrl: string; idx: number; rot: number; yOff: number }) => {
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
        alt={`Yên Tử Retreat ${idx + 1}`}
        className="w-full h-full object-cover select-none pointer-events-none opacity-85 hover:opacity-100 transition-opacity duration-300"
        referrerPolicy="no-referrer"
        onError={() => setHidden(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
    </motion.div>
  );
};

const RetreatGallery = () => {
  const defaultImages = [
    "/assets/projects/finland/6.jpg",
    "/assets/projects/finland/3.jpg",
    "/assets/projects/finland/5.jpg",
    "/assets/projects/startup_trip/7.jpg",
    "/assets/projects/startup_trip/3.jpg",
    "/assets/projects/greenbio/3.jpg",
    "/assets/projects/greenbio/4.jpg",
    "/assets/projects/greenbio/7.jpg",
    "/assets/projects/greenbio/8.jpg",
    "/assets/projects/finland/8.jpg"
  ];

  // Thêm ảnh: đặt tên theo số thứ tự tiếp theo vào folder retreat (tối đa 20)
  const images = Array.from({ length: 20 }, (_, i) => `/assets/projects/retreat/${i + 1}.jpg`);

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
        <h4 className="text-xs font-mono uppercase tracking-widest text-white/40 pl-4">Không gian & Khoảnh khắc Tu tập</h4>
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

const Home = ({ projects }: { projects: Project[] }) => {
  const navigate = useNavigate();
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const activeProject = projects[activeProjectIndex];

  // Auto-advance logic: Every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveProjectIndex((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeProjectIndex, projects.length]);

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
        <nav className="flex flex-row justify-between items-center px-8 py-6 max-w-7xl mx-auto">
          <div className="font-display text-3xl tracking-tight text-white flex items-baseline gap-1">
            Nhật Quang <sup className="text-[10px] font-body opacity-60 tracking-wider">SVF</sup>
          </div>
          <div className="hidden md:flex items-center gap-10">
            {[
              { label: 'Home', href: '#home' },
              { label: 'Projects', href: '#projects' },
              { label: 'Beyond Workspace', href: '#gallery' },
              { label: 'About', href: '#about' }
            ].map((item) => (
              <a key={item.label} href={item.href} className="text-sm text-white/50 hover:text-white transition-colors duration-300 tracking-wide">{item.label}</a>
            ))}
            <a href="/docs/cv.pdf" target="_blank" className="text-xs font-body tracking-[0.2em] uppercase text-white/30 hover:text-white border border-white/10 px-4 py-2 rounded-lg transition-all">Resume PDF</a>
          </div>
          <GlassButton variant="small">Kết Nối</GlassButton>
        </nav>

        <section id="home" className="px-6 pt-32 pb-32 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_400px] gap-16 items-start w-full mb-32">
            <div className="text-left space-y-8 pt-8">
              <h1 className="font-display text-5xl sm:text-7xl lg:text-[100px] leading-[0.95] tracking-[-0.03em] font-normal animate-fade-rise">Trần Nhật Quang</h1>
              <p className="text-white/60 text-lg sm:text-xl max-w-xl leading-relaxed animate-fade-rise-delay">"Là bản thể độc nhất, tôi chọn đầu tư vào sự phát triển cá nhân để tỏa sáng theo cách riêng. Thay vì so sánh, tôi trân trọng hành trình cá nhân và không ngừng hoàn thiện để trở thành phiên bản tốt đẹp nhất của chính mình."</p>
              <div className="animate-fade-rise-delay-2 pt-4">
                <GlassButton onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>Khám phá hành trình</GlassButton>
              </div>
            </div>
            <div className="relative animate-fade-rise-delay-2 group/hero">
              <TiltCard className="aspect-[3/4] w-full max-w-[400px] mx-auto" title="Nhật Quang" image="/assets/avatar.jpg" />
              <div className="absolute -bottom-6 -right-6 liquid-glass p-6 rounded-2xl hidden lg:block backdrop-blur-2xl border border-white/10 shadow-2xl z-30 min-w-[200px]">
                 <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">DATE OF BIRTH</p>
                 <p className="text-xl font-display">08/04/2003</p>
              </div>
            </div>
          </div>

          <div id="about" className="grid md:grid-cols-2 gap-24 items-start border-t border-white/5 pt-32 text-left">
              <div className="space-y-12">
                <div className="animate-fade-rise">
                  <h2 className="font-display text-5xl text-white mb-8">Học vấn & <em className="not-italic text-white/40">Chuyên môn</em></h2>
                  <div className="space-y-8">
                    <div className="group">
                      <p className="text-xs text-white/30 mb-1 tracking-widest">2021 — 2025</p>
                      <h4 className="text-xl font-display text-white">FPT University</h4>
                      <p className="text-white/50 text-sm">Bachelor of Software Engineering</p>
                    </div>
                    <div className="group border-t border-white/5 pt-8">
                      <p className="text-xs text-white/30 mb-1 tracking-widest">Professional Certificate</p>
                      <h4 className="text-xl font-display text-white">University of California, Irvine</h4>
                      <p className="text-white/50 text-sm">Project Management Project</p>
                    </div>
                    <div className="group border-t border-white/5 pt-8">
                      <p className="text-xs text-white/30 mb-1 tracking-widest">Professional Certificate</p>
                      <h4 className="text-xl font-display text-white">University of Michigan</h4>
                      <p className="text-white/50 text-sm">Introduction to UX Principles and Processes</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-12 animate-fade-rise">
                <div>
                  <h2 className="font-display text-5xl text-white mb-8">Kinh nghiệm <em className="not-italic text-white/40">Thực thi</em></h2>
                  <div className="space-y-8">
                    <div className="liquid-glass p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                         <MapPin className="w-12 h-12" />
                      </div>
                      <p className="text-xs text-white/30 mb-1 tracking-widest">2024 — Hiện tại</p>
                      <h4 className="text-2xl font-display text-white">Startup Vietnam Foundation (SVF)</h4>
                      <p className="text-white/60 mt-4 leading-relaxed">
                        Tham gia điều phối và quản trị các dự án đổi mới sáng tạo cấp quốc gia, kết nối hệ sinh thái khởi nghiệp Việt Nam với các nguồn lực quốc tế.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </section>

        <section id="projects" className="py-32 bg-black/40 backdrop-blur-md border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8 text-left">
              <div className="space-y-4">
                <h2 className="font-display text-5xl md:text-7xl text-white">Dự án <em className="not-italic text-white/40">Nổi bật</em></h2>
                <div className="h-1 w-24 bg-white/20" />
              </div>
              <p className="text-white/50 max-w-sm text-lg leading-relaxed">Những cột mốc trên hành trình xây dựng hệ sinh thái đổi mới sáng tạo và kết nối tri thức.</p>
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
                          {project.category}
                        </p>
                        <h4 className={cn(
                          "font-display text-lg transition-colors leading-tight",
                          activeProjectIndex === index ? "text-white" : "text-white/40"
                        )}>
                          {project.title}
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
                          {activeProject.role}
                        </span>
                      </div>
                      <h3 className="font-display text-4xl md:text-5xl text-white leading-[1.1]">
                        {activeProject.title}
                      </h3>
                      <p className="text-white/60 text-lg leading-relaxed font-light">
                        {activeProject.description}
                      </p>
                      <GlassButton variant="small" onClick={() => navigate(`/project/${activeProject.id}`)}>
                        Xem chi tiết dự án
                      </GlassButton>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        <VoyagerGallery />

        <section id="gallery" className="py-32 bg-black/60 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            {/* Header */}
            <div className="text-center mb-24 space-y-6">
              <h2 className="font-display text-5xl md:text-7xl text-white">
                Beyond the <em className="not-italic text-white/40">Workspace</em>
              </h2>
              <p className="text-white/50 text-lg max-w-2xl mx-auto">
                Những hoạt động phi lợi nhuận và phong cách sống - Nơi tôi rèn luyện sự bền bỉ, tinh thần kỷ luật và kết nối cộng đồng.
              </p>
            </div>

            {/* Layer 1: Lãnh Đạo Tỉnh Thức & Cộng Đồng */}
            <div className="mb-32 space-y-16">
              <div className="border-l-4 border-white/20 pl-6 space-y-4">
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-white/40">Volunteer Leadership Programs</span>
                <h3 className="font-display text-3xl md:text-5xl text-white leading-tight">
                  Lãnh Đạo Tỉnh Thức (Awakened Leaders), CEO Tỉnh Thức & YTP HCM
                </h3>
              </div>

              {/* Roles & Mission Grid */}
              <div className="grid md:grid-cols-2 gap-12 items-stretch">
                <div className="flex flex-col gap-6 h-full justify-between">
                  <div className="liquid-glass p-8 rounded-[2rem] border border-white/10 space-y-4 flex-grow">
                    <h4 className="text-sm font-mono uppercase tracking-widest text-white/60">Sứ mệnh & Mục tiêu</h4>
                    <p className="text-white/80 text-lg leading-relaxed font-light">
                      <span className="text-white font-medium">"Khai phóng các nhà lãnh đạo"</span>. Chuỗi chương trình được thiết kế nhằm chuyển hóa tâm thức, đánh thức và nâng tầm năng lực cho giới doanh nhân & khởi nghiệp, thành công thu hút hơn <span className="text-white font-medium">1.500+ nhà điều hành cấp cao</span> từ đa dạng các tổ chức lớn tham gia. Qua việc dấn thân phụng sự cộng đồng, tôi có cơ hội làm quen, đồng hành sâu sắc, và học hỏi rất nhiều từ các anh chị CEO, nhà sáng lập cùng các chuyên đề chuyển hóa đặc sắc.
                    </p>
                  </div>

                  <div className="liquid-glass p-8 rounded-[2rem] border border-white/10 space-y-4 flex-shrink-0">
                    <h4 className="text-sm font-mono uppercase tracking-widest text-white/60">Vai trò đóng góp (Tình nguyện viên Core Team)</h4>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {["Thiết kế chương trình và chăm sóc speaker", "Điều phối tổng chương trình", "Quản lý hậu cần", "Quản lý kỹ thuật", "Quản lý khách mời"].map((role, i) => (
                        <span key={i} className="text-xs bg-white/10 hover:bg-white/20 text-white/90 px-4 py-2 rounded-full border border-white/5 transition-all">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* The 5 Key Programs (Scrollable) */}
                <div className="space-y-6 flex flex-col h-[460px] md:h-[480px]">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-2 pl-4 flex-shrink-0">Các chương trình đặc sắc & Bài học đúc kết</h4>
                  <div className="space-y-4 overflow-y-auto pr-2 flex-grow custom-scrollbar">
                    {[
                      {
                        title: "1. Văn hóa Dân tộc & Doanh nghiệp",
                        desc: "Sự kết hợp hài hòa giữa căn tính văn hóa Việt và phương pháp quản trị hiện đại, là chìa khóa kiến tạo nên bản sắc cốt lõi và sự phát triển bền vững cho doanh nghiệp Việt Nam."
                      },
                      {
                        title: "2. Storytelling",
                        desc: "Thầy Nguyễn Trần Quang & Thầy Phạm Duy Hiếu. Chương trình khơi dậy sức mạnh của nghệ thuật kể chuyện chân thành để truyền cảm hứng, kết nối tâm hồn và dẫn dắt tập thể, cùng thông điệp thức tỉnh: \"Sống một cuộc đời đáng kể và kể nó bằng tất cả sự chân thành\"."
                      },
                      {
                        title: "3. Design You – Design Your Business",
                        desc: "Hành trình định hình bản sắc cá nhân độc bản và thiết kế mô hình doanh nghiệp từ chính nội tâm của bạn. Giúp các nhà điều hành gỡ bỏ áp lực vô hình để đạt tới trạng thái \"Tự do nội tâm\" – nền tảng vững chắc của một Lãnh đạo Tỉnh thức."
                      },
                      {
                        title: "4. Tinh hoa Lãnh đạo Phương Đông",
                        desc: "Khảo sát và đúc kết những minh triết sâu sắc của tiền nhân, kết nối các lát cắt lịch sử vào bối cảnh quản trị thời đại mới, khơi dậy niềm tự hào căn tính Việt Nam kiên cường và vững vàng trước mọi biến động."
                      },
                      {
                        title: "5. X10 Kiến tạo hạnh phúc",
                        desc: "Triết lý phát triển toàn diện nơi sự thành công vượt trội luôn đi song hành cùng hạnh phúc chân thật. Giúp các nhà lãnh đạo xây dựng đời sống tinh thần viên mãn bên cạnh sự nghiệp kinh doanh rực rỡ."
                      }
                    ].map((prog, idx) => (
                      <div key={idx} className="liquid-glass p-6 rounded-2xl border border-white/5 hover:border-white/25 transition-all space-y-2">
                        <h5 className="font-display text-lg text-white font-medium">{prog.title}</h5>
                        <p className="text-white/60 text-sm leading-relaxed font-light">{prog.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Photo Grid for Community programs */}
              <AwakenedLeadersGallery />
            </div>
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

            {/* Layer 3: Hành Trình Về Nguồn & Tu Tập */}
            <div className="space-y-16 border-t border-white/5 pt-24 mt-24">
              <div className="border-l-4 border-white/20 pl-6 space-y-4">
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-white/40">Hành Trình Về Nguồn & Tu Tập</span>
                <h3 className="font-display text-3xl md:text-5xl text-white leading-tight">
                  Thầy Pháp Nhật tại Yên Tử
                </h3>
                <p className="text-white/50 text-base max-w-4xl font-light leading-relaxed">
                  Nhận thức sâu sắc triết lý <span className="text-white font-medium">'Tâm lặng mà biết'</span> và bài học <span className="text-white font-medium">'Trong núi vốn không có Phật'</span> để xây dựng sự kiên định nội tại. Không tìm kiếm giải pháp hay bình an từ các yếu tố bên ngoài, mà quay vào bên trong để làm chủ cảm xúc, giữ sự điềm tĩnh và minh mẫn trước áp lực lớn hay biến động thị trường.
                </p>
              </div>

              {/* Photo Grid for Retreat */}
              <RetreatGallery />
            </div>
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

  useEffect(() => {
    setMounted(true);
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const projects: Project[] = [
    {
      id: 8,
      title: "Vietnam Innovation Challenge (ViGen)",
      subtitle: "NIC x Meta x AI for Vietnam",
      role: "PROJECT COORDINATOR",
      category: "Quy mô quốc gia",
      description: "Xây dựng bộ dữ liệu ngôn ngữ tiếng Việt mở và chất lượng cao để thúc đẩy nghiên cứu, ứng dụng AI tại Việt Nam.",
      imageUrl: "/assets/projects/innovation_challenge/1.jpg"
    },
    {
      id: 4,
      title: "TECHFEST VIETNAM 2024",
      subtitle: "Bộ Khoa học và Công nghệ & SVF",
      role: "PROJECT COORDINATOR",
      category: "Quy mô quốc gia",
      description: "Vinh danh Top 3 Cuộc thi Tìm kiếm tài năng Khởi nghiệp Sáng tạo Quốc gia TECHFEST 2024 tại Lễ Khai mạc với sự tham dự của Thủ tướng Chính phủ.",
      imageUrl: "/assets/projects/techfest2024/1.jpg"
    },
    {
      id: 1,
      title: "Vietnam Fintech & Regtech Immersion 2026",
      subtitle: "Australia - Vietnam Financial Immersion",
      role: "PROJECT MANAGER",
      category: "Hợp tác Chính phủ (Australia)",
      description: "Điều phối chuỗi sự kiện tại TP.HCM và Hà Nội, kết nối mạng lưới đối tác chuyên sâu và kiến tạo hạ tầng tài chính hiện đại.",
      imageUrl: "/assets/projects/project1/1.jpg"
    },
    {
      id: 5,
      title: "Vietnam Market Deep-Dive Series",
      subtitle: "Austrade Market Entry Insights",
      role: "PROJECT COORDINATOR",
      category: "Hợp tác Chính phủ (Australia)",
      description: "Cung cấp cái nhìn thực tế về thị trường Việt Nam cho doanh nghiệp Australia, thúc đẩy kết nối giao thương bền vững.",
      imageUrl: "/assets/projects/vietnam_market/1.jpg"
    },
    {
      id: 2,
      title: "GreenBio Global Idea Bridge Lab 2025",
      subtitle: "Vietnam - Korea Bio-Tech Collaboration",
      role: "PROJECT MANAGER",
      category: "Hợp tác quốc tế",
      description: "Chương trình hợp tác quốc tế kéo dài 3 tháng, kết nối sinh viên Việt - Hàn trong các giải pháp công nghệ sinh học xanh và kinh tế tuần hoàn.",
      imageUrl: "/assets/projects/greenbio/1.jpg"
    },
    {
      id: 3,
      title: "Startup Field Trip: Global Mindset - Local Action",
      subtitle: "ChungNam National University x SVF",
      role: "PROJECT MANAGER",
      category: "Hợp tác quốc tế",
      description: "Hành trình 72 giờ thực chiến giúp sinh viên Hàn - Việt bản địa hóa ý tưởng khởi nghiệp thông qua khảo sát thị trường và kết nối chuyên gia.",
      imageUrl: "/assets/projects/startup_trip/1.jpg"
    },
    {
      id: 7,
      title: "Startups Meet Finland",
      subtitle: "SVF x Business Finland x Business Helsinki",
      role: "PROJECT MANAGER",
      category: "Hợp tác quốc tế",
      description: "Kết nối hệ sinh thái đổi mới sáng tạo Việt Nam - Phần Lan, mở ra cơ hội thâm nhập thị trường Bắc Âu và EU cho các startup Việt.",
      imageUrl: "/assets/projects/finland/1.jpg"
    },
    {
      id: 6,
      title: "Vietnam-Japan M&A Matching",
      subtitle: "NIC x SVF x SiteCatcher",
      role: "PROJECT COORDINATOR",
      category: "Kết nối đầu tư",
      description: "Cầu nối chiến lược cho các thương vụ sáp nhập và gọi vốn giữa doanh nghiệp Việt Nam và nhà đầu tư Nhật Bản.",
      imageUrl: "/assets/projects/sitecatcher/1.jpg"
    }
  ];

  if (!mounted) return null;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home projects={projects} />} />
        <Route path="/project/:id" element={<ProjectDetailsPage />} />
      </Routes>
      <ChatAssistant />
    </Router>
  );
}
