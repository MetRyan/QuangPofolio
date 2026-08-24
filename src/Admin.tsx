import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  CloudUpload,
  Download,
  Eye,
  EyeOff,
  FolderPlus,
  ImagePlus,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import type {
  AboutContent,
  ActivityContent,
  BeyondWorkspaceContent,
  EducationItem,
  ExperienceItem,
  LeadershipProgramItem,
  ProjectContent,
  SiteContent,
} from "./data/types";
import {
  loadGitHubSettings,
  loadGitHubToken,
  publishContentToGitHub,
  saveGitHubSettings,
  saveGitHubToken,
  type GitHubPublishSettings,
} from "./data/githubPublish";
import {
  ADMIN_PASSWORD,
  isAdminAuthenticated,
  projectGalleryImages,
  setAdminAuthenticated,
  useSiteContent,
} from "./data/useSiteContent";

type Tab = "projects" | "curated" | "activities" | "about" | "beyond";

function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length || from === to) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

const emptyProject = (): ProjectContent => ({
  id: Date.now(),
  title: "Dự án mới",
  subtitle: "",
  role: "PROJECT MANAGER",
  category: "Hợp tác quốc tế",
  description: "",
  longDescription: "",
  location: "",
  date: "",
  imageUrl: "/assets/projects/new_project/1.jpg",
  imageFolder: "new_project",
  maxImages: 20,
  hidden: false,
});

const emptyActivity = (): ActivityContent => ({
  id: `activity-${Date.now()}`,
  label: "Hoạt động mới",
  title: "Tiêu đề hoạt động",
  description: "Mô tả ngắn về hoạt động...",
  galleryLabel: "Khoảnh khắc",
  folder: `activity_${Date.now()}`,
  maxImages: 20,
  hidden: false,
});

export default function AdminPage() {
  const navigate = useNavigate();
  const { content, ready, updateContent, resetToDefault } = useSiteContent();
  const [authed, setAuthed] = useState(isAdminAuthenticated());
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("projects");
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [message, setMessage] = useState("");
  const [githubToken, setGithubToken] = useState(loadGitHubToken());
  const [githubSettings, setGithubSettings] = useState<GitHubPublishSettings>(loadGitHubSettings());
  const [publishing, setPublishing] = useState(false);
  const [showPublishPanel, setShowPublishPanel] = useState(false);

  const visibleProjects = useMemo(() => content.projects, [content.projects]);

  const flash = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 4000);
  };

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAdminAuthenticated(true);
      setAuthed(true);
    } else {
      flash("Sai mật khẩu");
    }
  };

  const logout = () => {
    setAdminAuthenticated(false);
    setAuthed(false);
  };

  const patch = (next: SiteContent) => {
    updateContent(next);
    flash("Đã lưu (localStorage) — xem ngay trên trang chủ");
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "content.json";
    a.click();
    URL.revokeObjectURL(url);
    flash("Đã tải content.json — thay file public/content.json rồi deploy");
  };

  const importJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as SiteContent;
        updateContent(parsed);
        flash("Đã nhập content.json");
      } catch {
        flash("File JSON không hợp lệ");
      }
    };
    reader.readAsText(file);
  };

  const publishToGitHub = async () => {
    if (!githubToken.trim()) {
      setShowPublishPanel(true);
      flash("Dán GitHub Personal Access Token rồi bấm Publish");
      return;
    }
    setPublishing(true);
    try {
      saveGitHubToken(githubToken);
      saveGitHubSettings(githubSettings);
      const result = await publishContentToGitHub(content, githubToken, githubSettings);
      flash(
        `Đã publish lên GitHub! Commit ${result.commitSha.slice(0, 7) || "ok"}. Đợi site rebuild ~1–2 phút rồi soft-refresh trang chủ (không dùng bản localStorage cũ trên máy khác).`
      );
    } catch (err) {
      flash(err instanceof Error ? err.message : "Publish thất bại");
    } finally {
      setPublishing(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Đang tải...
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <form onSubmit={login} className="w-full max-w-md space-y-6 liquid-glass p-10 rounded-[2rem]">
          <h1 className="font-display text-3xl">Admin Portfolio</h1>
          <p className="text-white/50 text-sm">Nhập mật khẩu để chỉnh sửa nội dung website.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-white/30"
          />
          <button type="submit" className="w-full bg-white text-black py-3 rounded-xl font-medium cursor-pointer">
            Đăng nhập
          </button>
          {message && <p className="text-red-400 text-sm">{message}</p>}
          <button type="button" onClick={() => navigate("/")} className="text-white/40 text-sm hover:text-white cursor-pointer">
            ← Về trang chủ
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 cursor-pointer"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 className="font-display text-xl">Quản lý nội dung</h1>
              <p className="text-xs text-white/40">Thêm · Sửa · Ẩn · Xóa · Xuất file</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowPublishPanel((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 text-emerald-100 text-sm hover:bg-emerald-500/20 cursor-pointer"
            >
              <CloudUpload size={14} /> Publish lên GitHub
            </button>
            <button
              onClick={downloadJson}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 text-sm hover:bg-white/5 cursor-pointer"
            >
              <Download size={14} /> Xuất content.json
            </button>
            <label className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 text-sm hover:bg-white/5 cursor-pointer">
              <Upload size={14} /> Nhập JSON
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])}
              />
            </label>
            <button
              onClick={() => {
                if (confirm("Xóa bản chỉnh sửa local và về mặc định?")) {
                  resetToDefault();
                  flash("Đã reset");
                }
              }}
              className="px-4 py-2 rounded-full border border-white/15 text-sm hover:bg-white/5 cursor-pointer"
            >
              Reset
            </button>
            <button onClick={logout} className="px-4 py-2 rounded-full bg-white text-black text-sm cursor-pointer">
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {message && (
        <div className="bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-200 text-sm text-center py-2 px-4">
          {message}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {showPublishPanel && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-xl text-emerald-50">Publish trực tiếp lên GitHub</h2>
                <p className="text-sm text-emerald-100/70 mt-1">
                  Bấm Publish → cập nhật <code className="text-emerald-200">public/content.json</code> trên repo → hosting tự deploy.
                  Token chỉ lưu tạm trong session trình duyệt (không commit vào code).
                </p>
              </div>
              <button
                onClick={() => setShowPublishPanel(false)}
                className="text-emerald-100/50 hover:text-white text-sm cursor-pointer"
              >
                Đóng
              </button>
            </div>

            <label className="block space-y-1.5">
              <span className="text-[10px] uppercase tracking-widest text-emerald-100/50">
                GitHub Personal Access Token (classic: repo, hoặc fine-grained: Contents Read/Write)
              </span>
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_... hoặc github_pat_..."
                className="w-full bg-black/40 border border-emerald-500/20 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-400/50 text-sm"
              />
            </label>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
              <label className="block space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-emerald-100/50">Owner</span>
                <input
                  value={githubSettings.owner}
                  onChange={(e) => setGithubSettings({ ...githubSettings, owner: e.target.value })}
                  className="w-full bg-black/40 border border-emerald-500/20 rounded-xl px-3 py-2 outline-none text-sm"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-emerald-100/50">Repo</span>
                <input
                  value={githubSettings.repo}
                  onChange={(e) => setGithubSettings({ ...githubSettings, repo: e.target.value })}
                  className="w-full bg-black/40 border border-emerald-500/20 rounded-xl px-3 py-2 outline-none text-sm"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-emerald-100/50">Branch</span>
                <input
                  value={githubSettings.branch}
                  onChange={(e) => setGithubSettings({ ...githubSettings, branch: e.target.value })}
                  className="w-full bg-black/40 border border-emerald-500/20 rounded-xl px-3 py-2 outline-none text-sm"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-emerald-100/50">Path</span>
                <input
                  value={githubSettings.path}
                  onChange={(e) => setGithubSettings({ ...githubSettings, path: e.target.value })}
                  className="w-full bg-black/40 border border-emerald-500/20 rounded-xl px-3 py-2 outline-none text-sm"
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={publishToGitHub}
                disabled={publishing}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-400 text-black text-sm font-medium hover:bg-emerald-300 disabled:opacity-50 cursor-pointer"
              >
                <CloudUpload size={14} />
                {publishing ? "Đang publish..." : "Publish ngay"}
              </button>
              <a
                href="https://github.com/settings/tokens?type=beta"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-emerald-200/70 underline underline-offset-2 hover:text-emerald-100"
              >
                Tạo Fine-grained token →
              </a>
              <p className="text-xs text-emerald-100/50">
                Quyền: Repository <strong>QuangPofolio</strong> · Contents: Read and write
              </p>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-100/80 space-y-1">
          <p>
            <strong>Cách nhanh nhất:</strong> Sửa nội dung → bấm <em>Publish lên GitHub</em> → đợi hosting rebuild (~1–2 phút) → web công khai cập nhật.
          </p>
          <p>
            Ảnh vẫn bỏ tay vào <code className="text-amber-200">public/assets/projects/&lt;folder&gt;/1.jpg, 2.jpg...</code> rồi commit ảnh (hoặc upload qua GitHub web).
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {(
            [
              ["projects", "1. Dự án Nổi bật"],
              ["curated", "2. Curated Moments"],
              ["activities", "3. Hoạt động khác"],
              ["about", "4. Học vấn & KN"],
              ["beyond", "5. Beyond Workspace"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                setTab(key);
                setEditingId(null);
              }}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm border cursor-pointer transition-all",
                tab === key ? "bg-white text-black border-white" : "border-white/15 text-white/60 hover:text-white"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "projects" && (
          <ProjectsAdmin
            projects={visibleProjects}
            editingId={editingId}
            setEditingId={setEditingId}
            onChange={(projects) => patch({ ...content, projects })}
          />
        )}

        {tab === "curated" && (
          <CuratedAdmin
            curated={content.curatedMoments}
            onChange={(curatedMoments) => patch({ ...content, curatedMoments })}
          />
        )}

        {tab === "activities" && (
          <ActivitiesAdmin
            activities={content.activities}
            editingId={editingId}
            setEditingId={setEditingId}
            onChange={(activities) => patch({ ...content, activities })}
          />
        )}

        {tab === "about" && (
          <AboutAdmin about={content.about} onChange={(about) => patch({ ...content, about })} />
        )}

        {tab === "beyond" && (
          <BeyondAdmin
            beyond={content.beyondWorkspace}
            onChange={(beyondWorkspace) => patch({ ...content, beyondWorkspace })}
          />
        )}
      </div>
    </div>
  );
}

function ProjectsAdmin({
  projects,
  editingId,
  setEditingId,
  onChange,
}: {
  projects: ProjectContent[];
  editingId: number | string | null;
  setEditingId: (id: number | string | null) => void;
  onChange: (projects: ProjectContent[]) => void;
}) {
  const editing = projects.find((p) => p.id === editingId) ?? null;

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-display text-2xl">Danh sách dự án</h2>
          <button
            onClick={() => {
              const p = emptyProject();
              onChange([p, ...projects]);
              setEditingId(p.id);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-sm cursor-pointer"
          >
            <Plus size={14} /> Thêm dự án
          </button>
        </div>
        <div className="space-y-2">
          {projects.map((p, index) => (
            <div
              key={p.id}
              className={cn(
                "rounded-2xl border p-4 flex gap-3 items-start",
                p.hidden ? "border-white/5 opacity-50" : "border-white/10",
                editingId === p.id && "ring-1 ring-white/40"
              )}
            >
              <span className="text-white/30 font-mono text-xs pt-1">{String(index + 1).padStart(2, "0")}</span>
              <div className="flex flex-col gap-0.5">
                <button
                  title="Đưa lên"
                  disabled={index === 0}
                  onClick={() => onChange(moveItem(projects, index, index - 1))}
                  className="w-7 h-7 rounded-md border border-white/10 flex items-center justify-center hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  title="Đưa xuống"
                  disabled={index === projects.length - 1}
                  onClick={() => onChange(moveItem(projects, index, index + 1))}
                  className="w-7 h-7 rounded-md border border-white/10 flex items-center justify-center hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronDown size={14} />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-white/30">{p.category}</p>
                <p className="font-display text-lg truncate">{p.title}</p>
                <p className="text-xs text-white/40 truncate">{p.imageFolder}/ · max {p.maxImages} ảnh</p>
              </div>
              <div className="flex gap-1">
                <button
                  title={p.hidden ? "Hiện" : "Ẩn"}
                  onClick={() =>
                    onChange(projects.map((x) => (x.id === p.id ? { ...x, hidden: !x.hidden } : x)))
                  }
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 cursor-pointer"
                >
                  {p.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  onClick={() => setEditingId(p.id)}
                  className="px-3 h-9 rounded-full border border-white/10 text-xs hover:bg-white/5 cursor-pointer"
                >
                  Sửa
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Xóa "${p.title}"?`)) {
                      onChange(projects.filter((x) => x.id !== p.id));
                      if (editingId === p.id) setEditingId(null);
                    }
                  }}
                  className="w-9 h-9 rounded-full border border-red-500/30 text-red-300 flex items-center justify-center hover:bg-red-500/10 cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="liquid-glass rounded-[2rem] border border-white/10 p-6 space-y-4 sticky top-24 self-start">
        {editing ? (
          <>
            <h3 className="font-display text-xl">Chỉnh sửa dự án</h3>
            <Field label="Tiêu đề" value={editing.title} onChange={(v) => onChange(projects.map((p) => (p.id === editing.id ? { ...p, title: v } : p)))} />
            <Field label="Subtitle" value={editing.subtitle} onChange={(v) => onChange(projects.map((p) => (p.id === editing.id ? { ...p, subtitle: v } : p)))} />
            <Field label="Role" value={editing.role} onChange={(v) => onChange(projects.map((p) => (p.id === editing.id ? { ...p, role: v } : p)))} />
            <Field label="Category" value={editing.category} onChange={(v) => onChange(projects.map((p) => (p.id === editing.id ? { ...p, category: v } : p)))} />
            <Field label="Mô tả ngắn (trang chủ)" value={editing.description} onChange={(v) => onChange(projects.map((p) => (p.id === editing.id ? { ...p, description: v } : p)))} textarea />
            <Field label="Mô tả dài (trang chi tiết)" value={editing.longDescription} onChange={(v) => onChange(projects.map((p) => (p.id === editing.id ? { ...p, longDescription: v } : p)))} textarea />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Location" value={editing.location} onChange={(v) => onChange(projects.map((p) => (p.id === editing.id ? { ...p, location: v } : p)))} />
              <Field label="Date" value={editing.date} onChange={(v) => onChange(projects.map((p) => (p.id === editing.id ? { ...p, date: v } : p)))} />
            </div>
            <Field
              label="Folder ảnh (public/assets/projects/...)"
              value={editing.imageFolder}
              onChange={(v) =>
                onChange(
                  projects.map((p) =>
                    p.id === editing.id
                      ? { ...p, imageFolder: v, imageUrl: `/assets/projects/${v}/1.jpg` }
                      : p
                  )
                )
              }
            />
            <Field
              label="Số ảnh tối đa (1.jpg → N.jpg)"
              value={String(editing.maxImages)}
              onChange={(v) =>
                onChange(
                  projects.map((p) =>
                    p.id === editing.id ? { ...p, maxImages: Math.max(1, Number(v) || 1) } : p
                  )
                )
              }
            />
            <p className="text-xs text-white/40">
              Cover: <code>{editing.imageUrl}</code>
              <br />
              Gallery: {projectGalleryImages(editing.imageFolder, editing.maxImages).length} slot
            </p>
          </>
        ) : (
          <p className="text-white/40 text-sm">Chọn một dự án bên trái để sửa, hoặc thêm dự án mới.</p>
        )}
      </div>
    </div>
  );
}

function CuratedAdmin({
  curated,
  onChange,
}: {
  curated: SiteContent["curatedMoments"];
  onChange: (c: SiteContent["curatedMoments"]) => void;
}) {
  const numbers = Array.from({ length: curated.maxImages }, (_, i) => i + 1);
  const hidden = new Set(curated.hiddenImages);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-end justify-between">
        <div>
          <h2 className="font-display text-2xl">Curated Moments</h2>
          <p className="text-sm text-white/40">
            Folder: <code>public/assets/projects/{curated.folder}/</code>
          </p>
        </div>
        <button
          onClick={() => onChange({ ...curated, maxImages: curated.maxImages + 1 })}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-sm cursor-pointer"
        >
          <ImagePlus size={14} /> Thêm slot ảnh (+1)
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Label" value={curated.label} onChange={(v) => onChange({ ...curated, label: v })} />
        <Field label="Tiêu đề" value={curated.title} onChange={(v) => onChange({ ...curated, title: v })} />
        <Field label="Folder" value={curated.folder} onChange={(v) => onChange({ ...curated, folder: v })} />
        <Field
          label="Max images"
          value={String(curated.maxImages)}
          onChange={(v) => onChange({ ...curated, maxImages: Math.max(1, Number(v) || 1) })}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {numbers.map((n) => {
          const src = `/assets/projects/${curated.folder}/${n}.jpg`;
          const isHidden = hidden.has(n);
          return (
            <div
              key={n}
              className={cn(
                "relative rounded-2xl overflow-hidden border aspect-[3/4] bg-zinc-900",
                isHidden ? "border-white/5 opacity-40" : "border-white/10"
              )}
            >
              <img
                src={src}
                alt={`${n}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-center">
                <span className="text-xs font-mono">{n}.jpg</span>
                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      onChange({
                        ...curated,
                        hiddenImages: isHidden
                          ? curated.hiddenImages.filter((x) => x !== n)
                          : [...curated.hiddenImages, n],
                      })
                    }
                    className="w-7 h-7 rounded-full bg-black/50 border border-white/20 flex items-center justify-center cursor-pointer"
                    title={isHidden ? "Hiện" : "Ẩn"}
                  >
                    {isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                  {n === curated.maxImages && (
                    <button
                      onClick={() =>
                        onChange({
                          ...curated,
                          maxImages: Math.max(1, curated.maxImages - 1),
                          hiddenImages: curated.hiddenImages.filter((x) => x !== n),
                        })
                      }
                      className="w-7 h-7 rounded-full bg-red-500/30 border border-red-400/40 flex items-center justify-center cursor-pointer"
                      title="Xóa slot cuối"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-white/40">
        Thêm ảnh thật: bỏ file vào folder với tên số tiếp theo (vd: {curated.maxImages}.jpg). Bấm “Thêm slot ảnh” nếu cần tăng max.
      </p>
    </div>
  );
}

function ActivitiesAdmin({
  activities,
  editingId,
  setEditingId,
  onChange,
}: {
  activities: ActivityContent[];
  editingId: number | string | null;
  setEditingId: (id: number | string | null) => void;
  onChange: (activities: ActivityContent[]) => void;
}) {
  const editing = activities.find((a) => a.id === editingId) ?? null;

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-display text-2xl">Hoạt động khác</h2>
          <button
            onClick={() => {
              const a = emptyActivity();
              onChange([...activities, a]);
              setEditingId(a.id);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-sm cursor-pointer"
          >
            <FolderPlus size={14} /> Thêm hoạt động
          </button>
        </div>
        <p className="text-sm text-white/40">
          Format giống “Hành Trình Về Nguồn &amp; Tu Tập”: label + tiêu đề + mô tả + gallery ảnh ngang.
        </p>
        <div className="space-y-2">
          {activities.map((a, index) => (
            <div
              key={a.id}
              className={cn(
                "rounded-2xl border p-4 space-y-2",
                a.hidden ? "opacity-50 border-white/5" : "border-white/10",
                editingId === a.id && "ring-1 ring-white/40"
              )}
            >
              <div className="flex justify-between gap-3">
                <div className="flex gap-3 min-w-0">
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <button
                      title="Đưa lên"
                      disabled={index === 0}
                      onClick={() => onChange(moveItem(activities, index, index - 1))}
                      className="w-7 h-7 rounded-md border border-white/10 flex items-center justify-center hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      title="Đưa xuống"
                      disabled={index === activities.length - 1}
                      onClick={() => onChange(moveItem(activities, index, index + 1))}
                      className="w-7 h-7 rounded-md border border-white/10 flex items-center justify-center hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-white/30">{a.label}</p>
                    <p className="font-display text-lg">{a.title}</p>
                    <p className="text-xs text-white/40">
                      {a.folder}/ · max {a.maxImages}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() =>
                      onChange(activities.map((x) => (x.id === a.id ? { ...x, hidden: !x.hidden } : x)))
                    }
                    className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center cursor-pointer"
                  >
                    {a.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    onClick={() => setEditingId(a.id)}
                    className="px-3 h-9 rounded-full border border-white/10 text-xs cursor-pointer"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Xóa "${a.title}"?`)) {
                        onChange(activities.filter((x) => x.id !== a.id));
                        if (editingId === a.id) setEditingId(null);
                      }
                    }}
                    className="w-9 h-9 rounded-full border border-red-500/30 text-red-300 flex items-center justify-center cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="liquid-glass rounded-[2rem] border border-white/10 p-6 space-y-4 sticky top-24 self-start">
        {editing ? (
          <>
            <h3 className="font-display text-xl">Chỉnh sửa hoạt động</h3>
            <Field label="Label (chữ nhỏ phía trên)" value={editing.label} onChange={(v) => onChange(activities.map((a) => (a.id === editing.id ? { ...a, label: v } : a)))} />
            <Field label="Tiêu đề" value={editing.title} onChange={(v) => onChange(activities.map((a) => (a.id === editing.id ? { ...a, title: v } : a)))} />
            <Field label="Mô tả" value={editing.description} onChange={(v) => onChange(activities.map((a) => (a.id === editing.id ? { ...a, description: v } : a)))} textarea />
            <Field label="Nhãn gallery" value={editing.galleryLabel} onChange={(v) => onChange(activities.map((a) => (a.id === editing.id ? { ...a, galleryLabel: v } : a)))} />
            <Field
              label="Folder ảnh"
              value={editing.folder}
              onChange={(v) => onChange(activities.map((a) => (a.id === editing.id ? { ...a, folder: v } : a)))}
            />
            <Field
              label="Số ảnh tối đa"
              value={String(editing.maxImages)}
              onChange={(v) =>
                onChange(
                  activities.map((a) =>
                    a.id === editing.id ? { ...a, maxImages: Math.max(1, Number(v) || 1) } : a
                  )
                )
              }
            />
            <div className="rounded-xl border border-white/10 p-3 text-xs text-white/50 space-y-1">
              <p>
                Tạo folder: <code className="text-white/80">public/assets/projects/{editing.folder}/</code>
              </p>
              <p>
                Thêm ảnh: <code className="text-white/80">1.jpg, 2.jpg, ...</code>
              </p>
            </div>
            <ActivityImagePreview folder={editing.folder} maxImages={editing.maxImages} />
          </>
        ) : (
          <p className="text-white/40 text-sm">Chọn hoạt động để sửa hoặc thêm mới.</p>
        )}
      </div>
    </div>
  );
}

function AboutAdmin({
  about,
  onChange,
}: {
  about: AboutContent;
  onChange: (about: AboutContent) => void;
}) {
  const [eduId, setEduId] = useState<string | null>(about.education[0]?.id ?? null);
  const [expId, setExpId] = useState<string | null>(about.experience[0]?.id ?? null);
  const editingEdu = about.education.find((e) => e.id === eduId) ?? null;
  const editingExp = about.experience.find((e) => e.id === expId) ?? null;

  return (
    <div className="space-y-12">
      <div className="grid md:grid-cols-2 gap-4">
        <Field
          label="Tiêu đề học vấn (phần 1)"
          value={about.educationTitleMain}
          onChange={(v) => onChange({ ...about, educationTitleMain: v })}
        />
        <Field
          label="Tiêu đề học vấn (phần mờ)"
          value={about.educationTitleEm}
          onChange={(v) => onChange({ ...about, educationTitleEm: v })}
        />
        <Field
          label="Tiêu đề kinh nghiệm (phần 1)"
          value={about.experienceTitleMain}
          onChange={(v) => onChange({ ...about, experienceTitleMain: v })}
        />
        <Field
          label="Tiêu đề kinh nghiệm (phần mờ)"
          value={about.experienceTitleEm}
          onChange={(v) => onChange({ ...about, experienceTitleEm: v })}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display text-xl">Học vấn</h3>
            <button
              onClick={() => {
                const item: EducationItem = {
                  id: `edu-${Date.now()}`,
                  period: "2025 — 2026",
                  institution: "Trường / Tổ chức",
                  detail: "Chuyên ngành / chứng chỉ",
                  hidden: false,
                };
                onChange({ ...about, education: [...about.education, item] });
                setEduId(item.id);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-sm cursor-pointer"
            >
              <Plus size={14} /> Thêm
            </button>
          </div>
          {about.education.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "rounded-2xl border p-4 flex gap-3 items-start",
                item.hidden ? "opacity-50 border-white/5" : "border-white/10",
                eduId === item.id && "ring-1 ring-white/40"
              )}
            >
              <div className="flex flex-col gap-0.5">
                <button
                  disabled={index === 0}
                  onClick={() =>
                    onChange({ ...about, education: moveItem(about.education, index, index - 1) })
                  }
                  className="w-7 h-7 rounded-md border border-white/10 flex items-center justify-center disabled:opacity-20 cursor-pointer"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  disabled={index === about.education.length - 1}
                  onClick={() =>
                    onChange({ ...about, education: moveItem(about.education, index, index + 1) })
                  }
                  className="w-7 h-7 rounded-md border border-white/10 flex items-center justify-center disabled:opacity-20 cursor-pointer"
                >
                  <ChevronDown size={14} />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/40">{item.period}</p>
                <p className="font-display truncate">{item.institution}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() =>
                    onChange({
                      ...about,
                      education: about.education.map((x) =>
                        x.id === item.id ? { ...x, hidden: !x.hidden } : x
                      ),
                    })
                  }
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center cursor-pointer"
                >
                  {item.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  onClick={() => setEduId(item.id)}
                  className="px-3 h-9 rounded-full border border-white/10 text-xs cursor-pointer"
                >
                  Sửa
                </button>
                <button
                  onClick={() => {
                    if (!confirm("Xóa mục này?")) return;
                    onChange({
                      ...about,
                      education: about.education.filter((x) => x.id !== item.id),
                    });
                    if (eduId === item.id) setEduId(null);
                  }}
                  className="w-9 h-9 rounded-full border border-red-500/30 text-red-300 flex items-center justify-center cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {editingEdu && (
            <div className="liquid-glass rounded-2xl border border-white/10 p-4 space-y-3">
              <Field
                label="Thời gian / nhãn"
                value={editingEdu.period}
                onChange={(v) =>
                  onChange({
                    ...about,
                    education: about.education.map((x) =>
                      x.id === editingEdu.id ? { ...x, period: v } : x
                    ),
                  })
                }
              />
              <Field
                label="Trường / tổ chức"
                value={editingEdu.institution}
                onChange={(v) =>
                  onChange({
                    ...about,
                    education: about.education.map((x) =>
                      x.id === editingEdu.id ? { ...x, institution: v } : x
                    ),
                  })
                }
              />
              <Field
                label="Chi tiết"
                value={editingEdu.detail}
                onChange={(v) =>
                  onChange({
                    ...about,
                    education: about.education.map((x) =>
                      x.id === editingEdu.id ? { ...x, detail: v } : x
                    ),
                  })
                }
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display text-xl">Kinh nghiệm</h3>
            <button
              onClick={() => {
                const item: ExperienceItem = {
                  id: `exp-${Date.now()}`,
                  period: "2025 — Hiện tại",
                  company: "Công ty / Tổ chức",
                  description: "Mô tả công việc...",
                  hidden: false,
                };
                onChange({ ...about, experience: [...about.experience, item] });
                setExpId(item.id);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-sm cursor-pointer"
            >
              <Plus size={14} /> Thêm
            </button>
          </div>
          {about.experience.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "rounded-2xl border p-4 flex gap-3 items-start",
                item.hidden ? "opacity-50 border-white/5" : "border-white/10",
                expId === item.id && "ring-1 ring-white/40"
              )}
            >
              <div className="flex flex-col gap-0.5">
                <button
                  disabled={index === 0}
                  onClick={() =>
                    onChange({ ...about, experience: moveItem(about.experience, index, index - 1) })
                  }
                  className="w-7 h-7 rounded-md border border-white/10 flex items-center justify-center disabled:opacity-20 cursor-pointer"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  disabled={index === about.experience.length - 1}
                  onClick={() =>
                    onChange({ ...about, experience: moveItem(about.experience, index, index + 1) })
                  }
                  className="w-7 h-7 rounded-md border border-white/10 flex items-center justify-center disabled:opacity-20 cursor-pointer"
                >
                  <ChevronDown size={14} />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/40">{item.period}</p>
                <p className="font-display truncate">{item.company}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() =>
                    onChange({
                      ...about,
                      experience: about.experience.map((x) =>
                        x.id === item.id ? { ...x, hidden: !x.hidden } : x
                      ),
                    })
                  }
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center cursor-pointer"
                >
                  {item.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  onClick={() => setExpId(item.id)}
                  className="px-3 h-9 rounded-full border border-white/10 text-xs cursor-pointer"
                >
                  Sửa
                </button>
                <button
                  onClick={() => {
                    if (!confirm("Xóa mục này?")) return;
                    onChange({
                      ...about,
                      experience: about.experience.filter((x) => x.id !== item.id),
                    });
                    if (expId === item.id) setExpId(null);
                  }}
                  className="w-9 h-9 rounded-full border border-red-500/30 text-red-300 flex items-center justify-center cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {editingExp && (
            <div className="liquid-glass rounded-2xl border border-white/10 p-4 space-y-3">
              <Field
                label="Thời gian"
                value={editingExp.period}
                onChange={(v) =>
                  onChange({
                    ...about,
                    experience: about.experience.map((x) =>
                      x.id === editingExp.id ? { ...x, period: v } : x
                    ),
                  })
                }
              />
              <Field
                label="Công ty / tổ chức"
                value={editingExp.company}
                onChange={(v) =>
                  onChange({
                    ...about,
                    experience: about.experience.map((x) =>
                      x.id === editingExp.id ? { ...x, company: v } : x
                    ),
                  })
                }
              />
              <Field
                label="Mô tả"
                value={editingExp.description}
                textarea
                onChange={(v) =>
                  onChange({
                    ...about,
                    experience: about.experience.map((x) =>
                      x.id === editingExp.id ? { ...x, description: v } : x
                    ),
                  })
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BeyondAdmin({
  beyond,
  onChange,
}: {
  beyond: BeyondWorkspaceContent;
  onChange: (beyond: BeyondWorkspaceContent) => void;
}) {
  const L = beyond.leadership;
  const [progId, setProgId] = useState<string | null>(L.programs[0]?.id ?? null);
  const editingProg = L.programs.find((p) => p.id === progId) ?? null;
  const patchLeadership = (partial: Partial<typeof L>) =>
    onChange({ ...beyond, leadership: { ...L, ...partial } });

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Tiêu đề (phần 1)" value={beyond.titleMain} onChange={(v) => onChange({ ...beyond, titleMain: v })} />
        <Field label="Tiêu đề (phần mờ)" value={beyond.titleEm} onChange={(v) => onChange({ ...beyond, titleEm: v })} />
      </div>
      <Field label="Subtitle section" value={beyond.subtitle} textarea onChange={(v) => onChange({ ...beyond, subtitle: v })} />

      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl">Khối Leadership (Awakened Leaders)</h3>
        <button
          onClick={() => patchLeadership({ hidden: !L.hidden })}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 text-sm cursor-pointer"
        >
          {L.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
          {L.hidden ? "Đang ẩn" : "Đang hiện"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Label" value={L.label} onChange={(v) => patchLeadership({ label: v })} />
        <Field label="Tiêu đề chương trình" value={L.title} onChange={(v) => patchLeadership({ title: v })} />
        <Field label="Tiêu đề sứ mệnh" value={L.missionTitle} onChange={(v) => patchLeadership({ missionTitle: v })} />
        <Field label="Tiêu đề vai trò" value={L.rolesTitle} onChange={(v) => patchLeadership({ rolesTitle: v })} />
      </div>
      <Field label="Nội dung sứ mệnh" value={L.missionText} textarea onChange={(v) => patchLeadership({ missionText: v })} />
      <Field
        label="Vai trò (mỗi dòng 1 pill)"
        value={L.roles.join("\n")}
        textarea
        onChange={(v) =>
          patchLeadership({
            roles: v
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
          })
        }
      />
      <Field label="Tiêu đề danh sách chương trình" value={L.programsTitle} onChange={(v) => patchLeadership({ programsTitle: v })} />

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-display text-lg">Chương trình đặc sắc</h4>
            <button
              onClick={() => {
                const item: LeadershipProgramItem = {
                  id: `prog-${Date.now()}`,
                  title: `${L.programs.length + 1}. Chương trình mới`,
                  desc: "Mô tả...",
                  hidden: false,
                };
                patchLeadership({ programs: [...L.programs, item] });
                setProgId(item.id);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-black text-xs cursor-pointer"
            >
              <Plus size={12} /> Thêm
            </button>
          </div>
          {L.programs.map((p, index) => (
            <div
              key={p.id}
              className={cn(
                "rounded-xl border p-3 flex gap-2 items-start",
                p.hidden ? "opacity-50 border-white/5" : "border-white/10",
                progId === p.id && "ring-1 ring-white/40"
              )}
            >
              <div className="flex flex-col gap-0.5">
                <button
                  disabled={index === 0}
                  onClick={() => patchLeadership({ programs: moveItem(L.programs, index, index - 1) })}
                  className="w-6 h-6 rounded border border-white/10 flex items-center justify-center disabled:opacity-20 cursor-pointer"
                >
                  <ChevronUp size={12} />
                </button>
                <button
                  disabled={index === L.programs.length - 1}
                  onClick={() => patchLeadership({ programs: moveItem(L.programs, index, index + 1) })}
                  className="w-6 h-6 rounded border border-white/10 flex items-center justify-center disabled:opacity-20 cursor-pointer"
                >
                  <ChevronDown size={12} />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm truncate">{p.title}</p>
              </div>
              <button
                onClick={() =>
                  patchLeadership({
                    programs: L.programs.map((x) => (x.id === p.id ? { ...x, hidden: !x.hidden } : x)),
                  })
                }
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center cursor-pointer"
              >
                {p.hidden ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
              <button
                onClick={() => setProgId(p.id)}
                className="px-2 h-8 rounded-full border border-white/10 text-[10px] cursor-pointer"
              >
                Sửa
              </button>
              <button
                onClick={() => {
                  if (!confirm("Xóa chương trình?")) return;
                  patchLeadership({ programs: L.programs.filter((x) => x.id !== p.id) });
                  if (progId === p.id) setProgId(null);
                }}
                className="w-8 h-8 rounded-full border border-red-500/30 text-red-300 flex items-center justify-center cursor-pointer"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          {editingProg && (
            <div className="space-y-3 border border-white/10 rounded-2xl p-4">
              <Field
                label="Tiêu đề"
                value={editingProg.title}
                onChange={(v) =>
                  patchLeadership({
                    programs: L.programs.map((x) => (x.id === editingProg.id ? { ...x, title: v } : x)),
                  })
                }
              />
              <Field
                label="Mô tả"
                value={editingProg.desc}
                textarea
                onChange={(v) =>
                  patchLeadership({
                    programs: L.programs.map((x) => (x.id === editingProg.id ? { ...x, desc: v } : x)),
                  })
                }
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="font-display text-lg">Gallery ảnh</h4>
          <Field label="Nhãn gallery" value={L.galleryLabel} onChange={(v) => patchLeadership({ galleryLabel: v })} />
          <Field label="Folder" value={L.folder} onChange={(v) => patchLeadership({ folder: v })} />
          <Field
            label="Max images"
            value={String(L.maxImages)}
            onChange={(v) => patchLeadership({ maxImages: Math.max(1, Number(v) || 1) })}
          />
          <button
            onClick={() => patchLeadership({ maxImages: L.maxImages + 1 })}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 text-sm cursor-pointer"
          >
            <ImagePlus size={14} /> Thêm slot ảnh
          </button>
          <p className="text-xs text-white/40">
            Ảnh: <code>public/assets/projects/{L.folder}/1.jpg...</code>
          </p>
          <ActivityImagePreview folder={L.folder} maxImages={L.maxImages} />
        </div>
      </div>
    </div>
  );
}

function ActivityImagePreview({ folder, maxImages }: { folder: string; maxImages: number }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {Array.from({ length: Math.min(maxImages, 8) }, (_, i) => i + 1).map((n) => (
        <div key={n} className="aspect-[3/4] rounded-xl overflow-hidden bg-zinc-900 border border-white/10 relative">
          <img
            src={`/assets/projects/${folder}/${n}.jpg`}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.opacity = "0.15";
            }}
          />
          <span className="absolute bottom-1 left-1 text-[10px] font-mono bg-black/60 px-1 rounded">{n}</span>
        </div>
      ))}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  const cls =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-white/30 text-sm";
  return (
    <label className="block space-y-1.5">
      <span className="text-[10px] uppercase tracking-widest text-white/40">{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={5} className={cls} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </label>
  );
}
