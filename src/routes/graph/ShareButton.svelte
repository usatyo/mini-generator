<script lang="ts">
	import logo from '$lib/assets/logo-white.png';
	import { Button } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { afterUpdate } from 'svelte';
	import { fade } from 'svelte/transition';

	export let disabled;
	export let text = '';
	export let url: string = '';
	let href = 'https://twitter.com/intent/tweet';

	afterUpdate(() => {
		href = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
	});
</script>

<div class="absolute z-10 right-3 top-3 shadow-lg h-11" transition:fade>
	<Tooltip.Root openDelay={200}>
		<Tooltip.Trigger class="h-11">
			<a target="_blank" {href}>
				<Button class="w-fit h-11 p-0" {disabled}>
					<div class="p-3 w-fit rounded-md"><img src={logo} alt="X logo" class="w-5" /></div>
				</Button>
			</a>
		</Tooltip.Trigger>
		<Tooltip.Content>
			{#if disabled}
				<span>Max 16 node</span>
			{:else}
				<span>Share on X</span>
			{/if}
		</Tooltip.Content>
	</Tooltip.Root>
</div>
