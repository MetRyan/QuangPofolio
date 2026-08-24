import { motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import { projectGalleryImages, useSiteContent } from "./data/useSiteContent";

const ProjectImageCard = ({ img, title, i, delay }: { img: string; title: string; i: number; delay: number; key?: React.Key }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={cn(
        "liquid-glass rounded-[2rem] overflow-hidden",
        i === 0 ? "aspect-[16/10]" : "aspect-[16/11]",
        i === 0 && "md:col-span-2"
      )}
    >
      <img
        src={img}
        alt={`${title} - ${i}`}
        className="w-full h-full object-cover transition-all duration-1000 transform hover:scale-105"
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
      />
    </motion.div>
  );
};

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { content, ready } = useSiteContent();

  const project = id
    ? content.projects.find((p) => String(p.id) === id && !p.hidden) ??
      content.projects.find((p) => String(p.id) === id)
    : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Đang tải...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-display text-white/40 italic">Dự án không tồn tại</h2>
          <button
            onClick={() => navigate("/")}
            className="text-white hover:underline underline-offset-4 cursor-pointer"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  const images = projectGalleryImages(project.imageFolder, project.maxImages);

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 inset-x-0 z-50 p-8 flex justify-between items-center pointer-events-none">
        <button
          onClick={() => navigate("/")}
          className="pointer-events-auto liquid-glass w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="pointer-events-auto hidden md:block">
          <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase">
            Project Details / {id}
          </span>
        </div>
      </nav>

      <section className="pt-40 pb-20 px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-end">
          <div className="space-y-6">
            <div className="flex items-center gap-4 animate-fade-rise">
              <span className="text-[10px] font-body tracking-[0.3em] uppercase text-white/40 px-3 py-1 border border-white/10 rounded-full">
                {project.role}
              </span>
            </div>
            <h1 className="font-display text-6xl md:text-8xl leading-[0.95] tracking-tight animate-fade-rise">
              {project.title}
            </h1>
          </div>
          <div className="animate-fade-rise-delay space-y-8 pb-4">
            <div className="flex flex-wrap gap-8 text-white/40 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{project.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{project.date}</span>
              </div>
            </div>
            <p className="text-white/60 text-xl leading-relaxed font-light whitespace-pre-line">
              {project.longDescription}
            </p>
          </div>
        </div>
      </section>

      <section className="px-8 pb-32 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {images.map((img, i) => (
            <ProjectImageCard key={img} img={img} title={project.title} i={i} delay={i * 0.05} />
          ))}
        </div>
      </section>

      <section className="px-8 pb-40 max-w-7xl mx-auto text-center">
        <h3 className="font-display text-4xl text-white/40 italic">
          "Xây dựng hành trình từ những cảm xúc thực tế."
        </h3>
      </section>
    </div>
  );
}
