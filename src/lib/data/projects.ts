import { ProjectAccessKind, UptimeProviders, type Project } from '$lib/types';
import {
	SONAR_UPTIME_ID,
	FSA_UPTIME_ID,
	CHESS_SH_UPTIME_ID,
	DRIP_UPTIME_ID,
	MISE_UPTIME_ID
} from '$app/env/public';

export const projects: Project[] = [
	{
		slug: 'sonar',
		title: 'Sonar [WORK IN PROGRESS]',
		previewImage: '/projects/sonar.avif',
		description:
			'An uptime monitor, built to keep an eye on all of my projects. Currently in private beta. Public release planned once proven reliable.',
		tags: ['Laravel', 'Filament', 'SQLite', 'Uptime Monitor'],
		access: {
			kind: ProjectAccessKind.LINK,
			label: 'sonar.jacopocalvi.com',
			value: 'https://sonar.jacopocalvi.com'
		},
		uptimeData: {
			provider: UptimeProviders.APIWATCH,
			monitorId: SONAR_UPTIME_ID
		}
	},
	{
		slug: 'fsa-toolkit',
		title: 'FSA Toolkit',
		previewImage: '/projects/fsa-toolkit.avif',
		description:
			'A Finite State Automata editor and simulator, with many quality of life features. It is lightweight, fast, and runs entirely in your browser. It supports multiple types of automata, including deterministic, non-deterministic, and pushdown automata.',
		tags: ['Svelte', 'TypeScript', 'DaisyUI', 'Automata', 'Editor'],
		access: {
			kind: ProjectAccessKind.LINK,
			label: 'fsa-toolkit.jacopocalvi.com',
			value: 'https://fsa-toolkit.jacopocalvi.com/'
		},
		uptimeData: {
			provider: UptimeProviders.SONAR,
			monitorId: FSA_UPTIME_ID
		},
		ghRepoName: 'FSA-simulator'
	},
	{
		slug: 'leet',
		title: 'Leet',
		description:
			'A Go CLI for practicing LeetCode problems locally. I built it for myself, as I wanted to use my own IDE to practice and submit LeetCode problems while completely avoid their web interface.',
		tags: ['Go', 'Terminal', 'CLI', 'LeetCode'],
		ghRepoName: 'leet'
	},
	{
		slug: 'chess-sh',
		title: 'Chess-sh',
		description:
			'A multiplayer chess game playable entirely in your terminal. No installation, no sign-up, just SSH in. I thought it would be fun to build something that you can play entirely in the terminal, providing user authentication without the need for an annoying sign-in process.',
		previewImage: '/projects/chess-sh.avif',
		tags: ['Go', 'SSH', 'SQLite', 'Multiplayer', 'Terminal', 'Chess'],
		access: {
			kind: ProjectAccessKind.COMMAND,
			value: 'ssh chess.jacopocalvi.com'
		},
		uptimeData: {
			provider: UptimeProviders.APIWATCH,
			monitorId: CHESS_SH_UPTIME_ID
		},
		ghRepoName: 'chess-sh'
	},
	{
		slug: 'drip',
		title: 'Drip',
		description:
			'A simple website I built as part of a Web 3D module, where we had to build and showcase a series of 3D models using Blender. Being an ex-barista, I themed my submission around coffee.',
		previewImage: '/projects/drip.avif',
		tags: ['TypeScript', 'Blender', '3D Modelling', 'Three.js', 'Coffee'],
		access: {
			kind: ProjectAccessKind.LINK,
			label: 'drip.jacopocalvi.com',
			value: 'https://drip.jacopocalvi.com/'
		},
		uptimeData: {
			provider: UptimeProviders.SONAR,
			monitorId: DRIP_UPTIME_ID
		},
		ghRepoName: 'drip'
	},
	{
		slug: 'mise-en-place',
		title: 'Mise en Place',
		previewImage: '/projects/mise.avif',
		description:
			'A recipe manager for organizing and importing them from other websites. I built it to practice CRUD operations with Laravel and Filament. It saved me from the endless mess of bookmarks I used to have.',
		tags: ['Laravel', 'PHP', 'Filament', 'Vue', 'SQLite', 'CRUD', 'Food'],
		access: {
			kind: ProjectAccessKind.LINK,
			label: 'mise.jacopocalvi.com',
			value: 'https://mise.jacopocalvi.com/'
		},
		uptimeData: {
			provider: UptimeProviders.SONAR,
			monitorId: MISE_UPTIME_ID
		},
		ghRepoName: 'mise-en-place'
	},
	{
		slug: 'ricks-ranch',
		title: "Rick's Ranch",
		previewImage: '/projects/ricks-ranch.avif',
		description:
			'A fun and short retro shooter, with unpredictable controls. Initially developed in Unity (C#) for HackSussex’s GameJam (2023), where it won in two categories: “most unconventional controls” & “best overall”. I later remastered it using Godot.',
		tags: ['Godot', 'GameJam', 'Retro Shooter'],
		access: {
			kind: ProjectAccessKind.LINK,
			label: 'Play on Itch.io',
			value: 'https://cactuuus.itch.io/ricks-ranch-remastered/'
		},
		ghRepoName: 'ricks-ranch-remastered'
	}
];
