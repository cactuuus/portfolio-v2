import { defineEnvVars } from '@sveltejs/kit/hooks';
import * as v from 'valibot';

// NOTE: some of these are set to optional since they won't be available at build time. (aka via Dockerfile build args).

export const variables = defineEnvVars({
	GITHUB_TOKEN: {
		description: 'GitHub personal access token, for authentication with the GitHub API. Nullable.',
		schema: v.optional(v.string())
	},

	SONAR_API_KEY: {
		description:
			'Sonar Uptime API key. Necessary to use the Sonar Uptime API. If omitted, calls to the API will fail.',
		schema: v.optional(v.string())
	},

	APIWATCH_MONITORS_WIDGET_ID: {
		description:
			'The widget ID for the ApiWatch monitor used to track uptime for the portfolio projects.',
		schema: v.optional(v.string())
	},

	// Public IDs for the monitored services.

	SONAR_UPTIME_ID: {
		description: 'ID for the Sonar monitor.',
		schema: v.string(),
		static: true,
		public: true
	},
	FSA_UPTIME_ID: {
		description: 'ID for the FSA Toolkit monitor.',
		schema: v.string(),
		static: true,
		public: true
	},
	CHESS_SH_UPTIME_ID: {
		description: 'ID for the Chess-sh monitor.',
		schema: v.string(),
		static: true,
		public: true
	},
	DRIP_UPTIME_ID: {
		description: 'ID for the Drip monitor.',
		schema: v.string(),
		static: true,
		public: true
	},
	MISE_UPTIME_ID: {
		description: 'ID for the Mise monitor.',
		schema: v.string(),
		static: true,
		public: true
	}
});
