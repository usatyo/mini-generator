<script lang="ts">
	import { page } from '$app/stores';
</script>

<div
	class="relative flex h-full w-full flex-col items-center justify-center gap-8 font-mono font-bold"
>
	<p class=" text-3xl">Error: {$page.error?.message}</p>
	{#if $page.error?.message === 'Not Found'}
		<p class=" text-xl">
			Go back to the main page from
			<a href="/graph" class="text-blue-400 underline">here</a>
		</p>
	{/if}
	<p class="text-xl">
		Make issue from
		<a href="https://github.com/usatyo/mini-generator/issues" class="text-blue-400 underline">here</a>
	</p>
</div>
