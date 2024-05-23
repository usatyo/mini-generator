<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import cytoscape from 'cytoscape';
	import { onMount } from 'svelte';
	import Generate from './Generate.svelte';
	import Visualize from './Visualize.svelte';

	let container: HTMLElement | null = null;
	let cy: cytoscape.Core | null = null;

	onMount(() => {
		container = document.getElementById('cy');
		if (!container) return;
		cy = cytoscape({
			container: container,
			style: [
				{
					selector: 'node',
					css: {
						content: 'data(id)',
						'text-valign': 'center',
						'text-halign': 'center',
						'background-color': '#F7BD5B',
						'font-size': '10px'
					}
				},
				{
					selector: 'edge',
					css: {
						'text-valign': 'center',
						'text-halign': 'center',
						'line-color': '#ddd',
						width: 2,
						'font-size': '7px',
						'target-arrow-color': '#ddd',
						'curve-style': 'straight'
					}
				}
			],
			layout: {
				name: 'cose',
				animate: false
			}
		});
	});
</script>

<div class="h-full justify-evenly py-[10vh] lg:flex lg:flex-row">
	<Card.Root>
		<div id="cy" class="h-[40vh] lg:h-full lg:w-[50vw]" />
	</Card.Root>
	<div class="lg:w-[30vw] flex flex-col lg:max-h-full overflow-y-scroll py-3 lg:py-0">
		<Tabs.Root value="generate">
			<Tabs.List class="w-full flex">
				<Tabs.Trigger value="generate" class="grow">Generate</Tabs.Trigger>
				<Tabs.Trigger value="visualize" class="grow">Visualize</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="generate"><Generate {cy} /></Tabs.Content>
			<Tabs.Content value="visualize"><Visualize /></Tabs.Content>
		</Tabs.Root>
	</div>
</div>
