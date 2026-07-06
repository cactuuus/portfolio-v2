# Core idea

- Single page portfolio website.
- Small profile section and links up top.
- List of projects, with links and uptime status.
- Simple footer as dump for whatever is left over.
- DaisyUI for styling and components, and adaptible color scheme matching system.
- Data stored separately, for easy editing and to keep it separate from the code.
- server-side, IF POSSIBLE:
  - Fetch project status data from a apiwatch public API.
  - Fetch Github profile data from the GitHub API, to be used in the profile section.
  - Fetch status data from leetcode (solved/total, streak, activity, etc.), to be displayed in or below the profile.

## Components

- [x] Profile
- [x] ProjectCard
- [x] Footer
- [x] ProjectList
- [x] LeetcodeStats
- [] GithubStats
- [] UptimeStatus

## Interfaces

- [x] Link {
      icon: string,
      name: string,
      url: string
      openInNewTab: boolean,
      }
- [x] Profile {
      name: string,
      bio: string,
      links: Link[]
      }
- [x] LeetcodeStats {
      solved: number,
      total: number,
      streak: number,
      thisYearSolved: number,
      activity: {
      date: Date,
      solved: number
      }[]
      }
- [] GithubStats {
  // not sure yet, depends on what I can actually fetch (activity, language stats, etc.)
  }
- [] UptimeStatus {
  status: "up" | "down" | "unknown",
  uptime: number
  // not sure yet, depends on what I can actually fetch (uptime, response time, etc.)
  }
- [x] Project {
      slug: string,
      name: string,
      previewImage?: string,
      description: string, // using markdown formatting
      links: Link[]
      tags: string[],
      apiwatchId?: string
      }
