<script lang="ts">
	import { afterUpdate } from 'svelte';

	export let text = '';
	export let url: string = '';
	let href = '';

	afterUpdate(() => {
		href = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
	});
</script>

<a target="_blank" {href}> Tweet this </a>
