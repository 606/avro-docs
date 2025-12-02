"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface GitHubProfile {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  company: string | null;
  blog: string;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

interface GitHubOrg {
  login: string;
  id: number;
  url: string;
  description: string | null;
  avatar_url: string;
}

interface OrgMembership {
  url: string;
  state: string;
  role: string;
  organization: GitHubOrg;
}

export default function DebugAuthPage() {
  const { data: session, status } = useSession();
  const [githubProfile, setGithubProfile] = useState<GitHubProfile | null>(null);
  const [githubOrgs, setGithubOrgs] = useState<GitHubOrg[] | null>(null);
  const [orgMemberships, setOrgMemberships] = useState<OrgMembership[] | null>(null);
  const [oauthScopes, setOauthScopes] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGitHubData() {
      if (!session?.accessToken) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch user profile
        const profileRes = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        });
        
        if (profileRes.ok) {
          const profile = await profileRes.json();
          setGithubProfile(profile);
        } else {
          console.error("Profile error:", profileRes.status, await profileRes.text());
        }

        // Fetch organizations (спробуємо різні endpoints)
        const orgsRes = await fetch("https://api.github.com/user/orgs", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        });

        console.log("Orgs response status:", orgsRes.status);
        console.log("Orgs response headers:", Object.fromEntries(orgsRes.headers.entries()));
        
        // Перевіримо X-OAuth-Scopes header - показує реальні scopes
        const scopes = orgsRes.headers.get("X-OAuth-Scopes");
        console.log("Granted OAuth Scopes:", scopes);
        setOauthScopes(scopes);

        if (orgsRes.ok) {
          const orgs = await orgsRes.json();
          console.log("Orgs data:", orgs);
          setGithubOrgs(orgs);

          // Fetch membership details for each org
          const memberships = await Promise.all(
            orgs.map(async (org: GitHubOrg) => {
              const membershipRes = await fetch(
                `https://api.github.com/user/memberships/orgs/${org.login}`,
                {
                  headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    Accept: "application/vnd.github.v3+json",
                  },
                }
              );
              if (membershipRes.ok) {
                return membershipRes.json();
              }
              return null;
            })
          );
          setOrgMemberships(memberships.filter(Boolean));
        } else {
          console.error("Orgs error:", orgsRes.status, await orgsRes.text());
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch GitHub data");
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubData();
  }, [session?.accessToken]);

  if (status === "loading") {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Loading session...</h1>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">GitHub Auth Debug</h1>
        <p className="text-muted-foreground">
          Please sign in with GitHub to see the API response.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">GitHub Auth Debug</h1>

      {/* OAuth Scopes */}
      {oauthScopes && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-primary">
            OAuth Scopes (X-OAuth-Scopes header)
          </h2>
          <div className="bg-muted p-4 rounded-lg">
            <code className="text-sm">{oauthScopes}</code>
          </div>
          <p className="text-xs text-muted-foreground">
            Потрібно: <code>read:org</code> для доступу до організацій
          </p>
        </section>
      )}

      {/* NextAuth Session */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">NextAuth Session</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
          <code>{JSON.stringify(session, null, 2)}</code>
        </pre>
      </section>

      {loading && (
        <div className="text-muted-foreground">Loading GitHub data...</div>
      )}

      {error && (
        <div className="text-destructive bg-destructive/10 p-4 rounded-lg">
          Error: {error}
        </div>
      )}

      {/* GitHub User Profile */}
      {githubProfile && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-primary">
            GitHub User Profile
            <span className="text-sm font-normal text-muted-foreground ml-2">
              GET /user
            </span>
          </h2>
          <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
            <code>{JSON.stringify(githubProfile, null, 2)}</code>
          </pre>
        </section>
      )}

      {/* GitHub Organizations */}
      {githubOrgs && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-primary">
            GitHub Organizations
            <span className="text-sm font-normal text-muted-foreground ml-2">
              GET /user/orgs
            </span>
          </h2>
          <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
            <code>{JSON.stringify(githubOrgs, null, 2)}</code>
          </pre>
        </section>
      )}

      {/* Organization Memberships */}
      {orgMemberships && orgMemberships.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-primary">
            Organization Memberships
            <span className="text-sm font-normal text-muted-foreground ml-2">
              GET /user/memberships/orgs/:org
            </span>
          </h2>
          <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
            <code>{JSON.stringify(orgMemberships, null, 2)}</code>
          </pre>
        </section>
      )}

      {/* Summary */}
      {session.user?.orgs && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-primary">Summary (from session)</h2>
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p><strong>Username:</strong> {session.user.login}</p>
            <p><strong>Organizations:</strong></p>
            <ul className="list-disc list-inside ml-4">
              {session.user.orgs.map((org) => (
                <li key={org.login}>
                  <span className="font-mono">{org.login}</span>
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded ${
                    org.role === "admin" 
                      ? "bg-green-500/20 text-green-500" 
                      : "bg-blue-500/20 text-blue-500"
                  }`}>
                    {org.role}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
