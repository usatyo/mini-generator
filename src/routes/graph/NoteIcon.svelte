<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { type CarouselAPI } from '$lib/components/ui/carousel/context';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import * as Popover from '$lib/components/ui/popover';
	import type { FormatModeType } from '$lib/constant';

	export let weighted: boolean = false;
	export let formatMode: FormatModeType = 'column';

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
			text: 'n m\nu1 v1 w1\nu2 v2 w2\nu3 v3 w3\n...',
			val: 'column'
		},
		{
			text: 'n m\nw1 w2 ...\nu1 v1\nu2 v2\n...',
			val: 'weight-row'
		},
		{
			text: 'n m\nw1 w2 ...\nu1 u2 ...\nv1 v2 ...',
			val: 'row'
		}
	];
	const unweightedlegendText: { text: string; val: FormatModeType }[] = [
		{
			text: 'n m\nu1 v1\nu2 v2\nu3 v3\n...',
			val: 'column'
		},
		{
			text: 'n m\nu1 u2 ...\nv1 v2 ...',
			val: 'row'
		}
	];
</script>

<div class="absolute top-16 right-3 h-10 w-10">
	<Popover.Root>
		<Popover.Trigger>
			<Button variant="ghost" class="p-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-circle-help hover:opacity-50 h-full w-full"
				>
					<circle cx="12" cy="12" r="10" />
					<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
					<path d="M12 17h.01" />
				</svg>
			</Button>
		</Popover.Trigger>
		<Popover.Content side="top" class="w-60 p-3">
			<Carousel.Root class="relative" opts={{ loop: true }} bind:api>
				<Carousel.Previous class="absolute left-0 z-10" />
				<Carousel.Content>
					{#if weighted}
						{#each weightedlegendText as { text }}
							<Carousel.Item>
								<p class="font-mono whitespace-pre-line bg-gray-100 p-3 mx-10 rounded-md h-full">
									{text}
								</p>
							</Carousel.Item>
						{/each}
					{:else}
						{#each unweightedlegendText as { text }}
							<Carousel.Item>
								<p class="font-mono whitespace-pre-line bg-gray-100 p-3 mx-10 rounded-md h-full">
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
