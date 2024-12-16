<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Textarea } from '$lib/components/ui/textarea';
	import type cytoscape from 'cytoscape';
	import { slide } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';
	import { readGraph } from './visualize';

	export let cy: cytoscape.Core | null = null;

	let directed = false;
	let isValid = true;
	let offset = '0';
	let message = '';

	$: updateDirected(directed);

	const updateDirected = (val: boolean) => {
		if (val) {
			cy?.style().selector('edge').style({ 'target-arrow-shape': 'triangle' }).update();
		} else {
			cy?.style().selector('edge').style({ 'target-arrow-shape': 'none' }).update();
		}
	};
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Visualize graph</Card.Title>
	</Card.Header>
	<Card.Content class="flex flex-col space-y-5">
		<div class="flex items-center space-x-2" transition:slide>
			<Checkbox id="directed_visualize" bind:checked={directed} />
			<Label for="directed_visualize" class="text-md">directed</Label>
		</div>
		<Tabs.Root bind:value={offset} class="w-full">
			<Tabs.List class="w-full">
				<Tabs.Trigger value="0" class="grow">0-based</Tabs.Trigger>
				<Tabs.Trigger value="1" class="grow">1-based</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>
		<div>
			<label for="user-graph" class="text-md">your graph</label>
			<Textarea
				id="user-graph"
				class={twMerge('mt-1 h-96 font-mono text-lg', !isValid && 'border-red-500')}
				on:input={(e) => {
					const { valid, errorMessage } = readGraph(cy, e.currentTarget.value, Number(offset));
					isValid = valid;
					message = errorMessage;
				}}
			></Textarea>
			{#if !isValid}
				<p class="mt-1 text-sm text-red-500">{message}</p>
			{/if}
		</div>
	</Card.Content>
</Card.Root>
