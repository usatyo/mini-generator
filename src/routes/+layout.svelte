<script lang="ts">
	import '../app.css';
</script>

<div class="flex-col h-[100vh] p-3 md:p-0">
	<header class="absolute p-6 opacity-50 w-[100vw]">
		<a href="/" class="text-3xl font-mono">mini visualizer</a>
	</header>

	<slot />
</div>
