<script lang="ts">
	import '../app.css';
</script>

<div class="h-[100vh] flex-col p-3 lg:p-0">
	<header class="absolute w-[100vw] px-6 py-6 opacity-50 md:px-12">
		<a href="/">
			<p
				class="inline-block bg-gradient-to-br from-[#95a8b5] to-[#3d484e] bg-clip-text text-3xl font-black text-transparent md:text-4xl"
			>
				MINI GENERATOR
			</p>
		</a>
	</header>

	<slot />
</div>
