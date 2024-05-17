<script lang="ts">
	import '../app.css';
</script>

<div class="flex-col h-[100vh] p-3 lg:p-0">
	<header class="absolute p-6 opacity-50 w-[100vw]">
		<a href="/" class="text-3xl font-mono">mini generator</a>
	</header>

	<slot />
</div>
