<script lang="ts">
	import Annotation from '$lib/components/Annotation.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Textarea } from '$lib/components/ui/textarea';
	import type { Mode } from '$lib/constant';
	import type cytoscape from 'cytoscape';
	import { twMerge } from 'tailwind-merge';
	import { updateGraph } from './visualize';

	export let cy: cytoscape.Core | null = null;

	let directed = false;
	let isValid = true;
	let rawText = '';
	let offset = '0';
	let mode: Mode = 'row';
	let message = '';

	$: updateDirected(directed);
	$: {
		const { valid, errorMessage } = updateGraph(cy, rawText, Number(offset), mode);
		isValid = valid;
		message = errorMessage;
	}

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
		<div class="flex items-center space-x-2">
			<Checkbox id="directed_visualize" bind:checked={directed} />
			<Label for="directed_visualize" class="text-md">directed</Label>
		</div>
		<Tabs.Root bind:value={offset} class="w-full">
			<Tabs.List class="grid w-full grid-cols-2">
				<Tabs.Trigger value="0">0-based</Tabs.Trigger>
				<Tabs.Trigger value="1">1-based</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>
		<Tabs.Root bind:value={mode} class="w-full">
			<span class="text-md">data direction</span>
			<Tabs.List class="mt-1 grid h-fit w-full grid-cols-2">
				<Tabs.Trigger value="row" class="relative">
					Row
					<Annotation mode="row" />
				</Tabs.Trigger>
				<Tabs.Trigger value="column" class="relative">
					Column
					<Annotation mode="column" />
				</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>
		<div>
			<label for="user-graph" class="text-md">your graph</label>
			<Textarea
				id="user-graph"
				class={twMerge('mt-1 h-96 font-mono text-lg', !isValid && 'border-red-500')}
				on:input={(e) => {
					rawText = e.currentTarget.value;
				}}
			></Textarea>
			{#if !isValid}
				<p class="mt-1 text-sm text-red-500">{message}</p>
			{/if}
		</div>
	</Card.Content>
</Card.Root>
