<script>
	import { page } from '$app/stores';
	import { commonUrl } from '$lib/constant';
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="viewport" content="width=device-width,initial-scale=1" />
	<title>Mini Generator</title>
	<meta name="description" content="グラフのテストケース作成・共有ができます" />
	<meta property="og:url" content={commonUrl} />
	<meta property="og:title" content="Mini Generator" />
	<meta property="og:type" content="website" />
	<meta property="og:description" content="グラフのテストケース作成・共有ができます" />
	<meta property="og:image" content="{$page.url.origin}/ogp.png" />
	<meta name="twitter:card" content="summary" />
	<meta property="og:site_name" content="Mini Generator" />
	<meta property="og:locale" content="ja_JP" />
</svelte:head>
