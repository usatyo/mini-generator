<script lang="ts">
	const links = [{ name: 'graph', href: '/graph' }];
</script>

<div class="h-[84px]" />
<ul class="px-10 py-5">
	{#each links as link}
		<li>
			<a href={link.href} class="font-mono text-xl">- {link.name}</a>
		</li>
	{/each}
</ul>
