import type cytoscape from 'cytoscape';

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
export type GraphInfo = {
	mode: GenerateType;
	node: number;
	edge: number;
	offset: number;
	connected: boolean;
	weighted: boolean;
	directed: boolean;
	weight: number[];
	part: number;
	cy: cytoscape.Core | null;
};

export const NODE_MIN = 1;
export const NODE_MAX = 50;
export const WEIGHT_MIN = 0;
export const WEIGHT_MAX = 20;
export const MAX_URL_NODE = 16;

export const defaultStyle: cytoscape.Stylesheet[] = [
	{
		selector: 'node',
		css: {
			content: 'data(id)',
			'text-valign': 'center',
			'text-halign': 'center',
			'background-color': '#F7BD5B',
			'font-size': '10px'
		}
	},
	{
		selector: 'edge',
		css: {
			'text-valign': 'center',
			'text-halign': 'center',
			'line-color': '#ddd',
			width: 2,
			'font-size': '7px',
			'target-arrow-color': '#ddd',
			'curve-style': 'straight'
		}
	}
];
