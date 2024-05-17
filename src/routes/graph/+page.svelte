<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import cytoscape from 'cytoscape';
	import { afterUpdate } from 'svelte';
	import Generate from './Generate.svelte';
	import Visualize from './Visualize.svelte';
	import { generate } from './util';

	let container: HTMLElement | null = null;
	let cy: cytoscape.Core | null = null;

	afterUpdate(() => {
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
						"font-size": "10px"
					}
				},
				{
					selector: 'edge',
					css: {
						'text-valign': 'center',
						'text-halign': 'center',
						'line-color': '#ddd',
						width: 2,
						"font-size": "7px"
					}
				}
			],

			layout: {
				name: 'cose',
				animate: false
			}
		});

		generate('random', 10, 10, 0, true, false, [1, 1], 0, cy);
	});
</script>

<div class="h-full flex justify-evenly py-[10vh]">
	<Card.Root>
		<div id="cy" class="h-full w-[50vw]" />
	</Card.Root>
	<div class="w-[30vw] flex flex-col max-h-full overflow-y-scroll">
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
