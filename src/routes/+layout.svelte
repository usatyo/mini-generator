<script lang="ts">
	import '../app.css';
</script>

<div class="flex-col h-[100vh] p-3 lg:p-0">
	<header class="absolute py-6 px-6 md:px-12 opacity-50 w-[100vw]">
		<a href="/">
			<p
				class="inline-block text-3xl md:text-4xl font-black bg-gradient-to-br from-[#95a8b5] to-[#3d484e] text-transparent bg-clip-text"
			>
				MINI GENERATOR
			</p>
		</a>
	</header>

	<slot />
</div>
