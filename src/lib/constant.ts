
export const generateModes = [
	'random',
	'tree',
	'complete',
	'star',
	'cycle',
	'bipartite',
	'path'
] as const;
export const modeLabels = [
	'Random',
	'Tree(木グラフ)',
	'Complete(完全グラフ)',
	'Star(スターグラフ)',
	'Cycle(閉路グラフ)',
	'Bipartite(二部グラフ)',
	'Path(パスグラフ)'
] as const;
export type FormatModeType = 'column' | 'row' | 'weight-row';
export type GenerateType = (typeof generateModes)[number];
export const NODE_MIN = 1;
export const NODE_MAX = 50;
