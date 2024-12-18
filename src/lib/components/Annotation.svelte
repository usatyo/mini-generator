<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Popover from '$lib/components/ui/popover';
	import { UNWEIGHTED_COLUMN_TEXT, UNWEIGHTED_ROW_TEXT, type Mode } from '$lib/constant';
	import { cn } from '$lib/utils';
	import { CircleHelp } from 'lucide-svelte';

	export let mode: Mode;
	export let className: string = '';
</script>

<div class={cn('h-fit w-fit', className)}>
	<Popover.Root>
		<Popover.Trigger>
			<Button variant="ghost" class="p-2">
				<CircleHelp size="20" />
			</Button>
		</Popover.Trigger>
		<Popover.Content side="top" class="w-60 rounded-xl p-3">
			<Card.Root>
				<Card.Content class="h-full whitespace-pre-line rounded-md bg-gray-100 p-3 font-mono">
					{#if mode === 'row'}
						{UNWEIGHTED_ROW_TEXT}
					{:else}
						{UNWEIGHTED_COLUMN_TEXT}
					{/if}
				</Card.Content>
			</Card.Root>
		</Popover.Content>
	</Popover.Root>
</div>
