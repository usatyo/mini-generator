<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Slider } from '$lib/components/ui/slider';
	import { slide } from 'svelte/transition';

	export let title: string;
	export let value: number[];
	export let min: number;
	export let max: number;

	const label1: string = crypto.randomUUID();
	const label2: string = crypto.randomUUID();
</script>

<div class="flex space-x-2" transition:slide>
	<div class="grow">
		<span class="text-md">{title}</span>
		<div class="h-10 flex justify-center px-4 mt-1">
			<Slider bind:value {min} {max} />
		</div>
	</div>
	<div class="w-20">
		<label for={label1} class="text-md">min</label>
		<Input type="number" name={label1} bind:value={value[0]} class="mt-1 font-mono" />
	</div>
	<div class="w-20">
		<label for={label2} class="text-md">max</label>
		<Input type="number" name={label2} bind:value={value[1]} class="mt-1 font-mono" />
	</div>
</div>
