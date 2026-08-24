import type { SiteContent } from "./types";

const TOKEN_KEY = "quang_portfolio_github_token";
const SETTINGS_KEY = "quang_portfolio_github_settings";

export interface GitHubPublishSettings {
  owner: string;
  repo: string;
  branch: string;
  path: string;
}

export const defaultGitHubSettings: GitHubPublishSettings = {
  owner: "MetRyan",
  repo: "QuangPofolio",
  branch: "main",
  path: "public/content.json",
};

export function loadGitHubToken(): string {
  return sessionStorage.getItem(TOKEN_KEY) ?? "";
}

export function saveGitHubToken(token: string) {
  if (token.trim()) sessionStorage.setItem(TOKEN_KEY, token.trim());
  else sessionStorage.removeItem(TOKEN_KEY);
}

export function loadGitHubSettings(): GitHubPublishSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultGitHubSettings;
    return { ...defaultGitHubSettings, ...JSON.parse(raw) };
  } catch {
    return defaultGitHubSettings;
  }
}

export function saveGitHubSettings(settings: GitHubPublishSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function toBase64(text: string): string {
  // Unicode-safe base64 for Vietnamese content
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

export async function publishContentToGitHub(
  content: SiteContent,
  token: string,
  settings: GitHubPublishSettings = loadGitHubSettings()
): Promise<{ htmlUrl: string; commitSha: string }> {
  if (!token.trim()) {
    throw new Error("Chưa có GitHub token. Tạo Personal Access Token (contents:write) rồi dán vào Admin.");
  }

  const { owner, repo, branch, path } = settings;
  const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token.trim()}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };

  // Get current file SHA (required for update)
  let sha: string | undefined;
  const getRes = await fetch(`${apiBase}?ref=${encodeURIComponent(branch)}`, { headers });
  if (getRes.ok) {
    const data = (await getRes.json()) as { sha?: string };
    sha = data.sha;
  } else if (getRes.status !== 404) {
    const err = await getRes.json().catch(() => ({}));
    throw new Error(
      `Không đọc được file trên GitHub (${getRes.status}): ${(err as { message?: string }).message ?? getRes.statusText}`
    );
  }

  const body = {
    message: `chore: update portfolio content via admin (${new Date().toISOString()})`,
    content: toBase64(JSON.stringify(content, null, 2) + "\n"),
    branch,
    ...(sha ? { sha } : {}),
  };

  const putRes = await fetch(apiBase, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });

  if (!putRes.ok) {
    const err = await putRes.json().catch(() => ({}));
    throw new Error(
      `Publish thất bại (${putRes.status}): ${(err as { message?: string }).message ?? putRes.statusText}`
    );
  }

  const result = (await putRes.json()) as {
    content?: { html_url?: string };
    commit?: { sha?: string; html_url?: string };
  };

  return {
    htmlUrl: result.commit?.html_url ?? result.content?.html_url ?? `https://github.com/${owner}/${repo}`,
    commitSha: result.commit?.sha ?? "",
  };
}
