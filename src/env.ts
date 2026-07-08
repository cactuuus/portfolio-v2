import { defineEnvVars } from '@sveltejs/kit/hooks';
import * as v from 'valibot';

export const variables = defineEnvVars({
	GITHUB_TOKEN: {
		description: 'GitHub personal access token, for authentication with the GitHub API. Nullable.',
		schema: v.optional(v.string())
	}
});
