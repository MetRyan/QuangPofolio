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

export interface SiteContent {
  projects: ProjectContent[];
  curatedMoments: CuratedMomentsContent;
  activities: ActivityContent[];
}

export const CONTENT_STORAGE_KEY = "quang_portfolio_content_v1";
export const ADMIN_AUTH_KEY = "quang_portfolio_admin_auth";
