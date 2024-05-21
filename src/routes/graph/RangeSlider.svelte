<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Slider } from '$lib/components/ui/slider';
	import { slide } from 'svelte/transition';

	export let title: string;
	export let value: number[];
	export let min: number;
	export let max: number;

	const intLog = (x: number) => {
		return Math.round(Math.log2(x + 1) * 1000);
	};

	const intPow = (x: number) => {
		return Math.round(Math.pow(2, x / 1000) - 1);
	};

	const label1: string = crypto.randomUUID();
	const label2: string = crypto.randomUUID();

	$: logMin = intLog(min);
	$: logMax = intLog(max);
	$: logVal = [intLog(value[0]), intLog(value[1])];

	const changeHandler = (minMax: number[]) => {
		value = [intPow(minMax[0]), intPow(minMax[1])];
	};
</script>

<div class="flex space-x-2" transition:slide>
	<div class="grow">
		<span class="text-md">{title}</span>
		<div class="h-10 flex justify-center px-4 mt-1">
			<Slider
				onValueChange={(v) => {
					changeHandler(v);
				}}
				value={logVal}
				min={logMin}
				max={logMax}
			/>
		</div>
	</div>
	<div class="w-20">
		<label for={label1} class="text-md">min</label>
		<Input type="number" name={label1} bind:value={value[0]} {min} {max} class="mt-1 font-mono" />
	</div>
	<div class="w-20">
		<label for={label2} class="text-md">max</label>
		<Input type="number" name={label2} bind:value={value[1]} {min} {max} class="mt-1 font-mono" />
	</div>
</div>
