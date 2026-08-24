export interface ProjectContent {
  id: number;
  title: string;
  subtitle: string;
  role: string;
  category: string;
  description: string;
  longDescription: string;
  location: string;
  date: string;
  /** Cover image on homepage */
  imageUrl: string;
  /** Folder under /assets/projects/ for gallery (e.g. "greenbio") */
  imageFolder: string;
  /** Max numbered images 1.jpg..N.jpg */
  maxImages: number;
  hidden: boolean;
}

export interface CuratedMomentsContent {
  label: string;
  title: string;
  folder: string;
  maxImages: number;
  /** Image numbers to hide (1-based) */
  hiddenImages: number[];
}

export interface ActivityContent {
  id: string;
  label: string;
  title: string;
  description: string;
  galleryLabel: string;
  folder: string;
  maxImages: number;
  hidden: boolean;
}

export interface EducationItem {
  id: string;
  period: string;
  institution: string;
  detail: string;
  hidden: boolean;
}

export interface ExperienceItem {
  id: string;
  period: string;
  company: string;
  description: string;
  hidden: boolean;
}

export interface AboutContent {
  educationTitleMain: string;
  educationTitleEm: string;
  education: EducationItem[];
  experienceTitleMain: string;
  experienceTitleEm: string;
  experience: ExperienceItem[];
}

export interface LeadershipProgramItem {
  id: string;
  title: string;
  desc: string;
  hidden: boolean;
}

export interface LeadershipContent {
  hidden: boolean;
  label: string;
  title: string;
  missionTitle: string;
  missionText: string;
  rolesTitle: string;
  roles: string[];
  programsTitle: string;
  programs: LeadershipProgramItem[];
  galleryLabel: string;
  folder: string;
  maxImages: number;
  hiddenImages: number[];
}

export interface BeyondWorkspaceContent {
  titleMain: string;
  titleEm: string;
  subtitle: string;
  leadership: LeadershipContent;
}

export interface SiteContent {
  projects: ProjectContent[];
  curatedMoments: CuratedMomentsContent;
  activities: ActivityContent[];
  about: AboutContent;
  beyondWorkspace: BeyondWorkspaceContent;
}

export const CONTENT_STORAGE_KEY = "quang_portfolio_content_v2";
export const ADMIN_AUTH_KEY = "quang_portfolio_admin_auth";
