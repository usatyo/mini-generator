<script lang="ts">
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
		<div class="mt-1 flex h-10 justify-center px-4">
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
		<p class="text-md">min</p>
		<p class="mt-1 h-10 text-center font-mono leading-10">{value[0]}</p>
		<!-- <label for={label1} class="text-md">min</label> -->
		<!-- <Input type="number" name={label1} bind:value={value[0]} {min} max={value[1]} class="mt-1 font-mono" /> -->
	</div>
	<div class="w-20">
		<p class="text-md">max</p>
		<p class="mt-1 h-10 text-center font-mono leading-10">{value[1]}</p>
		<!-- <label for={label2} class="text-md">max</label> -->
		<!-- <Input type="number" name={label2} bind:value={value[1]} min={value[0]} {max} class="mt-1 font-mono" /> -->
	</div>
</div>
