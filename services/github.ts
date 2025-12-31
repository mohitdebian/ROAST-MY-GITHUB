
import { GithubUser, GithubRepo, ActivityStats, LanguageStats } from '../types';

const BASE_URL = 'https://api.github.com';

export const fetchGithubUser = async (username: string): Promise<GithubUser> => {
  const response = await fetch(`${BASE_URL}/users/${username}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('User not found. Are you sure they exist?');
    }
    throw new Error(`GitHub API Error: ${response.statusText}`);
  }
  return response.json();
};

export const fetchGithubRepos = async (username: string): Promise<GithubRepo[]> => {
  // Sort by updated to get what they are currently working (or failing) on
  const response = await fetch(`${BASE_URL}/users/${username}/repos?sort=updated&per_page=20`);
  if (!response.ok) {
    throw new Error(`GitHub API Error: ${response.statusText}`);
  }
  return response.json();
};

export const fetchGithubActivity = async (username: string): Promise<ActivityStats> => {
  // Fetch public events (limit 30 is default, up to 100 max per page)
  const response = await fetch(`${BASE_URL}/users/${username}/events?per_page=50`);
  
  const stats: ActivityStats = {
    totalEvents: 0,
    pushEvents: 0,
    prOpened: 0,
    prMerged: 0,
    issuesOpened: 0,
    lastActive: new Date(0).toISOString(),
  };

  if (!response.ok) {
    // If events fail (sometimes due to privacy settings), return empty stats rather than breaking the app
    console.warn('Could not fetch activity events');
    return stats;
  }

  const events: any[] = await response.json();

  if (events.length > 0) {
    stats.lastActive = events[0].created_at;
    stats.totalEvents = events.length;

    events.forEach(event => {
      if (event.type === 'PushEvent') {
        stats.pushEvents++;
      } else if (event.type === 'PullRequestEvent') {
        if (event.payload.action === 'opened') stats.prOpened++;
        // Checking for merged is tricky in events api, usually 'closed' + merged=true in payload
        // Simplification for the roast:
        if (event.payload.action === 'closed' && event.payload.pull_request?.merged) stats.prMerged++;
      } else if (event.type === 'IssuesEvent' && event.payload.action === 'opened') {
        stats.issuesOpened++;
      }
    });
  }

  return stats;
};

export const calculateLanguageStats = (repos: GithubRepo[]): LanguageStats => {
  const stats: LanguageStats = {};
  
  repos.forEach(repo => {
    if (repo.language) {
      stats[repo.language] = (stats[repo.language] || 0) + 1;
    }
  });
  
  return stats;
};
