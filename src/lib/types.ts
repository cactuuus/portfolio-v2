/**
 * Profile defines the data used to render the profile card on the home page.
 * - name: The name of the person.
 * - title: The title of the person.
 * - description: A short description of the person.
 * - skills: An array of skills to be displayed (e.g., Python, CI/CD, etc.).
 * - image: The path to the profile image.
 * - links: An array of links to be displayed (e.g., GitHub, LinkedIn, Twitter, etc.).
 */
export interface Profile {
	name: string;
	title: string;
	description: string[];
	skills: string[];
	image: string;
	links: Link[];
}

/**
 * Link defines a link to be displayed.
 * - label: The label to display (e.g. "GitHub").
 * - url: The URL to link to.
 * - ownAsset: Determines if the url should be processed using asset().
 * - newTab: Determines if the link should open in a new tab.
 */
export interface Link {
	label: string;
	url: string;
	ownAsset: boolean;
	newTab: boolean;
}

/**
 * ProjectAccess defines the data used to represent how to access a project.
 * It can be either a link or a command.
 */
export type ProjectAccess = LinkAccess | CommandAccess;

/**
 * LinkAccess defines the data used to represent a link to access a project.
 * Used websites-like projects, if applicable.
 * - kind: The kind of access (strictly set to ProjectAccessKind.LINK).
 * - label: The label to display for the link (e.g., "Visit Website").
 * - value: The URL to link to.
 */
export interface LinkAccess {
	kind: typeof ProjectAccessKind.LINK;
	label: string;
	value: string;
}
/**
 * CommandAccess defines the data used to represent a command to access a project.
 * Used for terminal-like projects, if applicable.
 * - kind: The kind of access (strictly set to ProjectAccessKind.COMMAND).
 * - value: The command to execute.
 */
export interface CommandAccess {
	kind: typeof ProjectAccessKind.COMMAND;
	value: string;
}

/**
 * Types of access to a project, either a link or a command. Simply used to avoid magic strings in the codebase.
 */
export const ProjectAccessKind = {
	LINK: 'link',
	COMMAND: 'command'
} as const;
export type ProjectAccessKind = (typeof ProjectAccessKind)[keyof typeof ProjectAccessKind];

/**
 * Project defines the data used to render a project card on the projects page.
 * - slug: The slug of the project.
 * - title: The title of the project.
 * - previewImage: The path to the preview image, if any.
 * - description: A short description of the project.
 * - tags: An array of tags associated with the project.
 * - access?: The main way to access the project, if applicable.
 * - apiwatchId?: An optional ID for ApiWatch integration.
 * - ghRepoName?: An optional name for GitHub repository integration.
 */
export interface Project {
	slug: string;
	title: string;
	previewImage?: string;
	description: string;
	tags: string[];
	access?: ProjectAccess;
	// Optional properties for integration with external services
	apiwatchId?: string;
	ghRepoName?: string;
}

/**
 * GithubRepoStats defines the data used to represent the statistics of a GitHub repository.
 * TODO -- I yet have to figure out what data I want to display here, so this is just a placeholder for now.
 * - stars: The number of stars the repository has.
 * - forks: The number of forks the repository has.
 * - watchers: The number of watchers the repository has.
 */
export interface GithubRepoStats {
	stars: number;
	forks: number;
	pushedAt: string;
	archived: boolean;
	//...
}

/**
 * UptimeStatus defines the data used to represent the uptime status of a service.
 * TODO -- I yet have to figure out what data I want to display here, so this is just a placeholder for now.
 * - up: A boolean indicating if the service is up.
 * - uptime: The uptime percentage of the service.
 */
export interface UptimeStatus {
	up: boolean;
	uptime: number;
	//...
}

/**
 * LeetcodeStats defines the data used to represent the LeetCode statistic for the user.
 * - solved: The total number of problems solved by the user, broken down by difficulty (easy, medium, hard) and total.
 * - total: The total number of problems available on LeetCode.
 * - badges: An array of badges (e.g., "Problem Solver", "April Challenge") earned by the user.
 * - streak: The current streak of consecutive days the user has submitted solutions (any submission counts, not just accepted ones).
 * - activity: An array of objects representing the user's activity, each containing a date and the number of submissions made on that date (again any submission counts).
 */
export interface LeetcodeStats {
	solved: {
		easy: number;
		medium: number;
		hard: number;
		total: number;
	};
	total: number;
	badges: string[];
	streak: number;
	activity: {
		date: string;
		submissions: number;
	}[];
}
