<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Popover from '$lib/components/ui/popover';
	import { Copy } from 'lucide-svelte';

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

<div class="absolute right-3 top-3 h-10 w-10">
	<Popover.Root open={copied && false}>
		<Popover.Trigger>
			<Button variant="ghost" on:click={clickHandler} class="p-2">
				<Copy />
			</Button>
		</Popover.Trigger>
		<Popover.Content side="top" class="w-fit p-2">Copied!</Popover.Content>
	</Popover.Root>
</div>
