<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import * as Select from '$lib/components/ui/select';
	import * as Tabs from '$lib/components/ui/tabs';
	import {
		MAX_URL_NODE,
		NODE_MAX,
		NODE_MIN,
		WEIGHT_MAX,
		WEIGHT_MIN,
		generateModes,
		modeLabels,
		type FormatModeType,
		type GenerateType,
		type GraphInfo
	} from '$lib/constant';
	import { initializeGraph, urlWithParameter } from '$lib/urlParameter';
	import { slide } from 'svelte/transition';
	import CopyIcon from './CopyIcon.svelte';
	import NoteIcon from './NoteIcon.svelte';
	import RangeSlider from './RangeSlider.svelte';
	import { formatEdge, generate, maxEdge, minEdge, randInt } from './util';

	export let cy: cytoscape.Core | null = null;
	export let generatedUrl = '';
	export let disabledShareButton: boolean;
	export let generated = false;

	let mode: { value: GenerateType; label: string } = {
		value: generateModes[0],
		label: modeLabels[0]
	};
	let nodeRange: number[] = [5, 15];
	let node1Range: number[] = [5, 10];
	let node2Range: number[] = [5, 10];
	let edgeRange: number[] = [20, 30];
	let weightRange: number[] = [1, 20];
	let connected: boolean = false;
	let weighted: boolean = false;
	let directed = false;
	let offset = '0';
	let formatMode: FormatModeType = 'column';
	let fixNode = 0;
	let fixEdge = 0;
	let fixEdges: number[][] = [];

	$: generatedText = formatEdge([fixNode, fixEdge], fixEdges, weighted, formatMode);

	$: updateWeighted(weighted);

	$: updateDirected(directed);

	const updateWeighted = (val: boolean) => {
		if (val) {
			cy?.style().selector('edge').style({ content: 'data(weight)' }).update();
		} else {
			cy?.style().selector('edge').style({ content: '' }).update();
		}
	};

	const updateDirected = (val: boolean) => {
		if (val) {
			cy?.style().selector('edge').style({ 'target-arrow-shape': 'triangle' }).update();
		} else {
			cy?.style().selector('edge').style({ 'target-arrow-shape': 'none' }).update();
		}
	};

	const clickHandler = () => {
		if (!cy) return;
		let part1 = 0;
		let part2 = 0;
		let lowerEdge = 0;
		let upperEdge = 0;
		fixNode = 0;
		if (mode.value === 'bipartite') {
			part1 = randInt(node1Range[0], node1Range[1]);
			part2 = randInt(node2Range[0], node2Range[1]);
			fixNode = part1 + part2;
			if (connected) {
				lowerEdge = Math.max(fixNode - 1, edgeRange[0]);
			} else {
				lowerEdge = Math.max(0, edgeRange[0]);
			}
			upperEdge = Math.min(part1 * part2, edgeRange[1]);
		} else {
			fixNode = randInt(nodeRange[0], nodeRange[1]);
			lowerEdge = Math.max(minEdge(fixNode, mode.value, connected), edgeRange[0]);
			upperEdge = Math.min(maxEdge(fixNode, mode.value), edgeRange[1]);
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

		const weight = Array(fixEdge)
			.fill(0)
			.map(() => randInt(weightRange[0], weightRange[1]));

		const graphInfo: GraphInfo = {
			mode: mode.value,
			node: fixNode,
			edge: fixEdge,
			offset: Number(offset),
			connected,
			weighted,
			directed,
			weight,
			part: part1,
			cy
		};

		fixEdges = generate(graphInfo);
		generated = true;
		generatedUrl = urlWithParameter(graphInfo, fixEdges);
		disabledShareButton = fixNode > MAX_URL_NODE;
	};

	$: {
		if (cy && !generated) {
			const { info: initGraphInfo, edges: initEdges } = initializeGraph($page.url.searchParams, cy);
			initializeGraphParameter(initGraphInfo, initEdges);
			generated = true;
		}
	}

	const copyToClipboard = () => {
		navigator.clipboard.writeText(generatedText);
	};

	const initializeGraphParameter = (info: GraphInfo, initEdges: number[][]) => {
		mode = { value: info.mode, label: modeLabels[generateModes.indexOf(info.mode)] };
		fixNode = info.node;
		fixEdge = info.edge;
		fixEdges = initEdges;
		connected = info.connected;
		weighted = info.weighted;
		directed = info.directed;
		updateWeighted(weighted);
		updateDirected(directed);
		offset = info.offset.toString();
		generatedText = formatEdge([info.node, info.edge], initEdges, info.weighted, formatMode);
		disabledShareButton = fixNode > MAX_URL_NODE;
	};
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Generate graph</Card.Title>
	</Card.Header>
	<Card.Content class="flex flex-col space-y-6">
		<div>
			<label for="mode" class="text-md">graph type</label>
			<Select.Root
				selected={mode}
				name="mode"
				onSelectedChange={(v) => {
					mode = { value: v?.value ?? generateModes[0], label: v?.label ?? modeLabels[0] };
				}}
			>
				<Select.Trigger class="text-md mt-1">
					<Select.Value />
				</Select.Trigger>
				<Select.Content>
					{#each generateModes as md, i}
						<Select.Item value={md} label={modeLabels[i]} />
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		{#if mode.value === 'bipartite'}
			<RangeSlider title="node(group1)" bind:value={node1Range} min={NODE_MIN} max={NODE_MAX / 2} />
			<RangeSlider title="node(group2)" bind:value={node2Range} min={NODE_MIN} max={NODE_MAX / 2} />
		{:else}
			<RangeSlider title="node" bind:value={nodeRange} min={NODE_MIN} max={NODE_MAX} />
		{/if}
		{#if mode.value === 'random'}
			<RangeSlider
				title="edge"
				bind:value={edgeRange}
				min={minEdge(nodeRange[0], mode.value, connected)}
				max={maxEdge(nodeRange[1], mode.value)}
			/>
		{:else if mode.value === 'bipartite'}
			<RangeSlider
				title="edge"
				bind:value={edgeRange}
				min={connected ? node1Range[0] + node2Range[0] - 1 : 0}
				max={node1Range[1] * node2Range[1]}
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
			<RangeSlider title="weight" bind:value={weightRange} min={WEIGHT_MIN} max={WEIGHT_MAX} />
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
		<div class="w-full" transition:slide>
			<ScrollArea
				orientation="vertical"
				class="w-full h-[150px] bg-gray-100 p-5 rounded-md font-mono relative"
			>
				<CopyIcon onClick={copyToClipboard} />
				<NoteIcon {weighted} bind:formatMode />
				<p class="whitespace-pre-line pr-10">
					{generatedText}
				</p>
			</ScrollArea>
		</div>
	</Card.Footer>
</Card.Root>
