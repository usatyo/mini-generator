import { generate } from '../routes/graph/util';
import type { GenerateType, GraphInfo } from './constant';

const MAX_URL_NODE = 16;

export const urlWithParameter = (props: GraphInfo, edges: number[][]): string => {
	const url = 'https://mini-generator.netlify.app/graph';
	const searchParams = new URLSearchParams();
	const data = { ...props, edges: edgesToString(edges) };
	searchParams.set('data', urlSafeEncode(JSON.stringify(data)));

	return url + '?' + searchParams.toString();
};

export const initializeGraph = (searchParams: URLSearchParams, cy: cytoscape.Core): void => {
	const paramObj = searchParams.get('data')
		? (JSON.parse(urlSafeDecode(searchParams.get('data') ?? '')) as GraphInfo & { edges: string })
		: undefined;
	generate(
		{
			mode: (paramObj?.mode ?? 'random') as GenerateType,
			node: Number(paramObj?.node ?? 10),
			edge: Number(paramObj?.edge ?? 10),
			offset: Number(paramObj?.offset ?? 0),
			connected: paramObj?.connected ?? false,
			weighted: paramObj?.weighted ?? false,
			directed: paramObj?.directed ?? false,
			weight: paramObj?.weight ?? [],
			part: Number(searchParams.get('p') ?? 5),
			cy: cy
		},
		paramObj === undefined ? undefined : stringToEdges(paramObj.edges)
	);
	return;
};

const edgesToString = (edges: number[][]): string => {
	const bytes = new Uint8Array(edges.map(([n1, n2]) => n1 * MAX_URL_NODE + n2));
	return btoa(String.fromCharCode(...bytes));
};

const stringToEdges = (str: string): number[][] => {
	const bytes = Uint8Array.from(atob(str), (s) => s.charCodeAt(0));
	return [...bytes].map((v) => [Math.floor(v / MAX_URL_NODE), v % MAX_URL_NODE]);
};

// JSON.stringify() されたデータから URL で使用可能な文字列のみを使用した base64 エンコードを行う
const urlSafeEncode = (data: string): string => {
	return btoa(data).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
};

// base64 エンコードされたデータをデコードし、元のデータを取得する
const urlSafeDecode = (param: string): string => {
	const fixedParam = param.replace('-', '+').replace('_', '/');
	return atob(fixedParam);
};
