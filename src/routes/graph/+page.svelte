<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import { defaultStyle } from '$lib/constant';
	import cytoscape from 'cytoscape';
	import { onMount } from 'svelte';
	import Generate from './Generate.svelte';
	import Head from '$lib/components/Head.svelte';
	import ShareButton from '$lib/components/ShareButton.svelte';
	import Visualize from './Visualize.svelte';

	let container: HTMLElement | null = null;
	let cy: cytoscape.Core | null = null;
	let generatedUrl = '';
	let generated = false;
	let disabledShareButton = true;

	onMount(() => {
		container = document.getElementById('cy');
		if (!container) return;
		cy = cytoscape({
			container: container,
			style: defaultStyle
		});
	});
</script>

<Head />

<div class="h-full py-[10vh] lg:flex lg:flex-row lg:justify-evenly">
	<Card.Root class="relative">
		<div id="cy" class="h-[40vh] lg:h-full lg:w-[50vw]" />
		{#if generated}
			<ShareButton url={generatedUrl} disabled={disabledShareButton} />
		{/if}
	</Card.Root>
	<div class="flex flex-col overflow-y-scroll py-3 lg:max-h-full lg:w-[30vw] lg:py-0">
		<Tabs.Root value="generate">
			<Tabs.List class="flex w-full">
				<Tabs.Trigger value="generate" class="grow">Generate</Tabs.Trigger>
				<Tabs.Trigger value="visualize" class="grow">Visualize</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="generate">
				<Generate {cy} bind:generatedUrl bind:disabledShareButton bind:generated />
			</Tabs.Content>
			<Tabs.Content value="visualize"><Visualize {cy} /></Tabs.Content>
		</Tabs.Root>
	</div>
</div>
