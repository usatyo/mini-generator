<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { type CarouselAPI } from '$lib/components/ui/carousel/context';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import * as Popover from '$lib/components/ui/popover';
	import {
		UNWEIGHTED_COLUMN_TEXT,
		UNWEIGHTED_ROW_TEXT,
		WEIGHTED_COLUMN_TEXT,
		WEIGHTED_HALF_ROW_TEXT,
		WEIGHTED_ROW_TEXT,
		type FormatModeType
	} from '$lib/constant';
	import { cn } from '$lib/utils';
	import { CircleHelp } from 'lucide-svelte';

	export let weighted: boolean = false;
	export let formatMode: FormatModeType = 'column';
	export let className: string = '';

	let api: CarouselAPI;

	$: if (api) {
		api.on('select', () => {
			if (weighted) {
				formatMode = weightedlegendText[api.selectedScrollSnap()].val;
			} else {
				formatMode = unweightedlegendText[api.selectedScrollSnap()].val;
			}
		});
	}

	const weightedlegendText: { text: string; val: FormatModeType }[] = [
		{
			text: WEIGHTED_COLUMN_TEXT,
			val: 'column'
		},
		{
			text: WEIGHTED_HALF_ROW_TEXT,
			val: 'weight-row'
		},
		{
			text: WEIGHTED_ROW_TEXT,
			val: 'row'
		}
	];
	const unweightedlegendText: { text: string; val: FormatModeType }[] = [
		{
			text: UNWEIGHTED_COLUMN_TEXT,
			val: 'column'
		},
		{
			text: UNWEIGHTED_ROW_TEXT,
			val: 'row'
		}
	];
</script>

<div class={cn('h-10 w-10', className)}>
	<Popover.Root>
		<Popover.Trigger>
			<Button variant="ghost" class="p-2">
				<CircleHelp />
			</Button>
		</Popover.Trigger>
		<Popover.Content side="top" class="w-60 p-3">
			<Carousel.Root class="relative" opts={{ loop: true }} bind:api>
				<Carousel.Previous class="absolute left-0 z-10" />
				<Carousel.Content>
					{#if weighted}
						{#each weightedlegendText as { text }}
							<Carousel.Item>
								<p class="mx-10 h-full whitespace-pre-line rounded-md bg-gray-100 p-3 font-mono">
									{text}
								</p>
							</Carousel.Item>
						{/each}
					{:else}
						{#each unweightedlegendText as { text }}
							<Carousel.Item>
								<p class="mx-10 h-full whitespace-pre-line rounded-md bg-gray-100 p-3 font-mono">
									{text}
								</p>
							</Carousel.Item>
						{/each}
					{/if}
				</Carousel.Content>
				<Carousel.Next class="absolute right-0 z-10" />
			</Carousel.Root>
		</Popover.Content>
	</Popover.Root>
</div>
