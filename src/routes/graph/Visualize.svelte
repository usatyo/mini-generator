<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import type cytoscape from 'cytoscape';
	import { slide } from 'svelte/transition';

	export let cy: cytoscape.Core | null = null;

	let directed = false;

	$: updateWeighted(directed);

	const updateWeighted = (val: boolean) => {
		if (val) {
			cy?.style().selector('edge').style({ content: 'data(weight)' }).update();
		} else {
			cy?.style().selector('edge').style({ content: '' }).update();
		}
	};
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Visualize graph</Card.Title>
	</Card.Header>
	<Card.Content class="flex flex-col space-y-5">
		<div class="flex items-center space-x-2" transition:slide>
			<Checkbox id="directed" bind:checked={directed} />
			<Label for="directed" class="text-md">directed</Label>
		</div>
		<div>
			<label for="user-graph" class="text-md">your graph</label>
			<Textarea
				id="user-graph"
				class="mt-1 h-96 font-mono text-lg"
				on:input={(e) => {
					console.log(e.currentTarget.value);
				}}
			></Textarea>
		</div>
	</Card.Content>
</Card.Root>
