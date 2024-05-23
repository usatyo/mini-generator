<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import { defaultStyle } from '$lib/constant';
	import cytoscape from 'cytoscape';
	import { onMount } from 'svelte';
	import Generate from './Generate.svelte';
	import ShareButton from './ShareButton.svelte';
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

<div class="h-full justify-evenly py-[10vh] lg:flex lg:flex-row">
	<Card.Root class="relative">
		<div id="cy" class="h-[40vh] lg:h-full lg:w-[50vw]">
			{#if generated}
				<ShareButton url={generatedUrl} disabled={disabledShareButton} />
			{/if}
		</div>
	</Card.Root>
	<div class="lg:w-[30vw] flex flex-col lg:max-h-full overflow-y-scroll py-3 lg:py-0">
		<Tabs.Root value="generate">
			<Tabs.List class="w-full flex">
				<Tabs.Trigger value="generate" class="grow">Generate</Tabs.Trigger>
				<Tabs.Trigger value="visualize" class="grow">Visualize</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="generate">
				<Generate {cy} bind:generatedUrl bind:disabledShareButton bind:generated />
			</Tabs.Content>
			<Tabs.Content value="visualize"><Visualize /></Tabs.Content>
		</Tabs.Root>
	</div>
</div>
