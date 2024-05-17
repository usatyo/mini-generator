<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Popover from '$lib/components/ui/popover';

	export let onClick: () => void = () => {};

	let copied = false;

	const clickHandler = () => {
		onClick();
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 1000);
	};
</script>

<div class="absolute top-3 right-3 h-10 w-10">
	<Popover.Root open={copied && false}>
		<Popover.Trigger>
			<Button variant="ghost" on:click={clickHandler} class="p-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-copy hover:opacity-50 h-full w-full"
				>
					<rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path
						d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
					/>
				</svg>
			</Button>
		</Popover.Trigger>
		<Popover.Content side="top" class="w-fit p-2">Copied!</Popover.Content>
	</Popover.Root>
</div>
