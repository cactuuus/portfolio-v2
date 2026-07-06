import { ProjectAccessKind, type Project } from '$lib/types';

export const projects: Project[] = [
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
		apiwatchId: 'fsa-toolkit',
		ghRepoName: 'FSA-simulator'
	},
	{
		slug: 'leet',
		title: 'Leet',
		description:
			'A Go terminal CLI for practicing LeetCode problems locally. I built it for myself, as I wanted to use my own IDE to practice and submit LeetCode problems while completely avoid their web interface.',
		tags: ['Go', 'Terminal', 'LeetCode'],
		ghRepoName: 'leet'
	},
	{
		slug: 'chess-sh',
		title: 'Chess-sh',
		description:
			'A multiplayer chess game playable entirely in your terminal. No installation, no sign-up, just SSH in. I thought it would be fun to build something that you can play entirely in the terminal, providing user authentication without the need for an annoying sign-in process.',
		previewImage: '/projects/chess-sh.avif',
		tags: ['Go', 'SSH', 'Multiplayer', 'Terminal', 'Chess'],
		access: {
			kind: ProjectAccessKind.COMMAND,
			value: 'ssh chess.jacopocalvi.com'
		},
		apiwatchId: 'chess-sh',
		ghRepoName: 'chess-sh'
	},
	{
		slug: 'drip',
		title: 'Drip',
		description:
			'A simple website I built as part of a Web 3D module, where we had to build and showcase a series of 3D models using Blender. Being an ex-barista, I themed my submission around around coffee equipment.',
		previewImage: '/projects/drip.avif',
		tags: ['TypeScript', 'Blender', '3D Modelling', 'Three.js', 'Coffee'],
		access: {
			kind: ProjectAccessKind.LINK,
			label: 'drip.jacopocalvi.com',
			value: 'https://drip.jacopocalvi.com/'
		},
		apiwatchId: 'drip',
		ghRepoName: 'drip'
	},
	{
		slug: 'mise-en-place',
		title: 'Mise en Place',
		previewImage: '/projects/mise.avif',
		description:
			'A recipe manager for organizing and importing them from other websites. I built it to practice CRUD operations with Laravel and Filament. It saved me from the endless mess of bookmarks I used to have.',
		tags: ['Laravel', 'PHP', 'Filament', 'Vue', 'CRUD', 'Food'],
		access: {
			kind: ProjectAccessKind.LINK,
			label: 'mise.jacopocalvi.com',
			value: 'https://mise.jacopocalvi.com/'
		},
		apiwatchId: 'mise-en-place',
		ghRepoName: 'mise-en-place'
	},
	{
		slug: 'ricks-ranch',
		title: "Rick's Ranch",
		previewImage: '/projects/ricks-ranch.avif',
		description:
			'A fun and short retro shooter, with unpredictable controls. Initially developed in Unity (C#) for HackSussex’s GameJam (2023), where it won in two categories: “most unconventional controls” & “best overall”.',
		tags: ['Godot', 'GameJam', 'Retro Shooter'],
		access: {
			kind: ProjectAccessKind.LINK,
			label: 'Play on Itch.io',
			value: 'https://cactuuus.itch.io/ricks-ranch-remastered/'
		},
		ghRepoName: 'ricks-ranch-remastered'
	}
];
