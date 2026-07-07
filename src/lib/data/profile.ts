import type { Profile } from '$lib/types';
import { GITHUB_USERNAME } from '$lib/config';
import { makeGithubUrl } from '$lib/helpers';

export const profile: Profile = {
	name: 'Jacopo Calvi',
	title: 'Software Developer — University of Sussex',
	description: [
		'I build, fix, and occasionally break things. LeetCode enjoyer, Linux enthusiast (Arch btw), and professional cat-holder.'
	],
	skills: [
		'Web Development',
		'CI/CD',
		'Self-Hosting',
		'Database Design',
		'Python',
		'TypeScript',
		'Go'
	],
	image: '/profile.avif',
	links: [
		{
			label: 'GitHub',
			url: makeGithubUrl(GITHUB_USERNAME),
			ownAsset: false,
			newTab: true
		},
		{
			label: 'LinkedIn',
			url: `https://www.linkedin.com/in/jacopocalvi/`,
			ownAsset: false,
			newTab: true
		},
		{
			label: 'Resume.pdf',
			url: '/resume.pdf',
			ownAsset: true,
			newTab: true
		}
	]
};
