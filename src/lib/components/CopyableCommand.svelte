<script lang="ts">
	import CopyIcon from '~icons/lucide/copy';
	import CheckIcon from '~icons/lucide/check';

	let { command, classes = '' }: { command: string; classes?: string } = $props();
	let copied = $state(false);

	function copyCommand() {
		navigator.clipboard.writeText(command);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
</script>

<button
	onclick={copyCommand}
	class="tooltip tooltip-info flex gap-1.5 font-mono items-center bg-base-300 px-2 rounded-tiny hover:bg-base-content/10 hover:text-secondary transition-colors cursor-pointer {classes}"
	class:tooltip-success={copied}
	aria-label="Copy command {command} to clipboard"
>
	<div class="tooltip-content">
		<span class="flex items-center gap-1">
			{#if copied}
				<CheckIcon class="h-3 w-3" />
				Copied!
			{:else}
				<CopyIcon class="h-3 w-3" />
				Click to copy
			{/if}
		</span>
	</div>
	<CopyIcon class="h-3 w-3" />
	{command}
</button>
