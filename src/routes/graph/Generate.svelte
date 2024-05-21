<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import * as Select from '$lib/components/ui/select';
	import * as Tabs from '$lib/components/ui/tabs';
	import { slide } from 'svelte/transition';
	import CopyIcon from './CopyIcon.svelte';
	import NoteIcon from './NoteIcon.svelte';
	import RangeSlider from './RangeSlider.svelte';
	import {
		NODE_MAX,
		NODE_MIN,
		formatEdge,
		generate,
		generateModes,
		maxEdge,
		minEdge,
		modeLabels,
		randInt,
		type FormatModeType,
		type GenerateType
	} from './util';

	export let cy: cytoscape.Core | null = null;

	let mode: { value: GenerateType; label: string } = {
		value: generateModes[0],
		label: modeLabels[0]
	};
	let node: number[] = [5, 15];
	let node1: number[] = [5, 10];
	let node2: number[] = [5, 10];
	let edge: number[] = [20, 30];
	let weight: number[] = [1, 20];
	let connected: boolean = true;
	let weighted: boolean = false;
	let dataWeighted: boolean = false;
	let generated = false;
	let directed = false;
	let offset = '0';
	let formatMode: FormatModeType = 'column';
	let fixNode = 0;
	let fixEdge = 0;
	let fixEdges: number[][] = [];

	$: generatedText = formatEdge([fixNode, fixEdge], fixEdges, dataWeighted, formatMode);

	$: if (weighted) {
		cy?.style().selector('edge').style({ content: 'data(weight)' });
	} else {
		cy?.style().selector('edge').style({ content: '' });
	}

	$: if (directed) {
		cy?.style().selector('edge').style({ 'target-arrow-shape': 'triangle' }).update();
	} else {
		cy?.style().selector('edge').style({ 'target-arrow-shape': 'none' }).update();
	}

	const clickHandler = () => {
		if (!cy) return;
		let part1 = 0;
		let part2 = 0;
		let lowerEdge = 0;
		let upperEdge = 0;
		fixNode = 0;
		if (mode.value === 'bipartite') {
			part1 = randInt(node1[0], node1[1]);
			part2 = randInt(node2[0], node2[1]);
			fixNode = part1 + part2;
			if (connected) {
				lowerEdge = Math.max(fixNode - 1, edge[0]);
			} else {
				lowerEdge = Math.max(0, edge[0]);
			}
			upperEdge = Math.min(part1 * part2, edge[1]);
		} else {
			fixNode = randInt(node[0], node[1]);
			lowerEdge = Math.max(minEdge(fixNode, mode.value, connected), edge[0]);
			upperEdge = Math.min(maxEdge(fixNode, mode.value), edge[1]);
		}
		fixEdge = 0;
		if (mode.value === 'random' || mode.value === 'bipartite') {
			fixEdge = randInt(lowerEdge, upperEdge);
		} else if (mode.value === 'tree') {
			fixEdge = fixNode - 1;
		} else if (mode.value === 'complete') {
			fixEdge = (fixNode * (fixNode - 1)) / 2;
		} else if (mode.value === 'star') {
			fixEdge = fixNode - 1;
		}
		fixEdges = generate(mode.value, fixNode, fixEdge, Number(offset), connected, weight, part1, cy);
		generated = true;
		dataWeighted = weighted;
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(generatedText);
	};
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Generate graph</Card.Title>
	</Card.Header>
	<Card.Content class="flex flex-col space-y-6">
		<div>
			<label for="mode" class="text-md">graph type</label>
			<Select.Root bind:selected={mode} name="mode">
				<Select.Trigger class="text-md mt-1">
					<Select.Value />
				</Select.Trigger>
				<Select.Content>
					{#each generateModes as mode, i}
						<Select.Item value={mode} label={modeLabels[i]} />
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		{#if mode.value === 'bipartite'}
			<RangeSlider title="node(group1)" bind:value={node1} min={NODE_MIN} max={NODE_MAX / 2} />
			<RangeSlider title="node(group2)" bind:value={node2} min={NODE_MIN} max={NODE_MAX / 2} />
		{:else}
			<RangeSlider title="node" bind:value={node} min={NODE_MIN} max={NODE_MAX} />
		{/if}
		{#if mode.value === 'random'}
			<RangeSlider
				title="edge"
				bind:value={edge}
				min={minEdge(node[0], mode.value, connected)}
				max={maxEdge(node[1], mode.value)}
			/>
		{:else if mode.value === 'bipartite'}
			<RangeSlider
				title="edge"
				bind:value={edge}
				min={connected ? node1[0] + node2[0] - 1 : 0}
				max={node1[1] * node2[1]}
			/>
		{/if}
		{#if mode.value === 'random' || mode.value === 'bipartite'}
			<div class="flex items-center space-x-2" transition:slide>
				<Checkbox id="connected" bind:checked={connected} />
				<Label for="connected" class="text-md">connected</Label>
			</div>
		{/if}
		<div class="flex items-center space-x-2" transition:slide>
			<Checkbox id="directed" bind:checked={directed} />
			<Label for="directed" class="text-md">directed</Label>
		</div>
		<div class="flex items-center space-x-2" transition:slide>
			<Checkbox id="weighted" bind:checked={weighted} />
			<Label for="weighted" class="text-md">weighted</Label>
		</div>
		{#if weighted}
			<RangeSlider title="weight" bind:value={weight} min={0} max={100} />
		{/if}
		<Tabs.Root bind:value={offset} class="w-full">
			<Tabs.List class="w-full">
				<Tabs.Trigger value="0" class="grow">0-based</Tabs.Trigger>
				<Tabs.Trigger value="1" class="grow">1-based</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>
	</Card.Content>
	<Card.Footer class="flex flex-col space-y-6 items-start">
		<Button on:click={() => clickHandler()} class="w-full">Generate</Button>
		{#if generated}
			<div class="w-full" transition:slide>
				<ScrollArea
					orientation="vertical"
					class="w-full h-[150px] bg-gray-100 p-5 rounded-md font-mono relative"
				>
					<CopyIcon onClick={copyToClipboard} />
					<NoteIcon weighted={dataWeighted} bind:formatMode />
					<p class="whitespace-pre-line pr-10">
						{generatedText}
					</p>
				</ScrollArea>
			</div>
		{/if}
	</Card.Footer>
</Card.Root>
