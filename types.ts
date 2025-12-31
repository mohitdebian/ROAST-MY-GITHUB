
export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  topics: string[];
}

export interface ActivityStats {
  totalEvents: number;
  pushEvents: number;
  prOpened: number;
  prMerged: number; // Inferred from events if possible, or just issue closing
  issuesOpened: number;
  lastActive: string;
}

export interface LanguageStats {
  [key: string]: number;
}

export interface AnalysisResult {
  roast: string;
  score: number; // 0 to 100, where 100 is absolutely cooked
  titles: string[]; // e.g. "Spaghetti Chef", "Fork Master"
}

export interface RoastHistoryItem {
  username: string;
  avatar_url: string;
  score: number;
  timestamp: number;
}
