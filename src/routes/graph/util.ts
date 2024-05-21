import type { FormatModeType, GenerateType } from '$lib/constant';
import { UnionFind } from '$lib/unionfind';
import type cytoscape from 'cytoscape';

export const generate = (
	mode: GenerateType,
	node: number,
	edge: number,
	offset: number,
	connected: boolean,
	weight: number[],
	part: number,
	cy: cytoscape.Core
): number[][] => {
	let edgeData: number[][] = [];
	if (mode === 'random' && !connected) edgeData = edgeFree(node, edge, new Set());
	if (mode === 'random' && connected) {
		const used = edgeTree(node);
		const usedSet = new Set(used.map((e) => e[0] * node + e[1]));

		edgeData = used.concat(edgeFree(node, edge - used.length, usedSet));
	}
	if (mode === 'tree') edgeData = edgeTree(node);
	if (mode === 'complete') edgeData = edgeComplete(node);
	if (mode === 'star') edgeData = edgeStar(node);
	if (mode === 'cycle') edgeData = edgeCycle(node);
	if (mode === 'bipartite' && !connected) edgeData = edgeBipartite(node, edge, part);
	if (mode === 'bipartite' && connected) edgeData = edgeConnectedBipartite(node, edge, part);
	if (mode === 'path') edgeData = edgePath(node);

	// shuffle nodes
	const nodeOrder = shuffle(
		Array(node)
			.fill(0)
			.map((_, i) => i)
	);

	cy.elements().remove();
	for (let i = 0; i < node; i++) {
		cy.add({ data: { id: (i + offset).toString() } });
	}

	// shuffle edges
	for (let i = edgeData.length - 1; i > 0; i--) {
		const j = randInt(0, i);
		if (Math.random() > 0.5) {
			[edgeData[i][0], edgeData[j][0]] = [edgeData[j][0], edgeData[i][0]];
			[edgeData[i][1], edgeData[j][1]] = [edgeData[j][1], edgeData[i][1]];
			[edgeData[i][0], edgeData[i][1]] = [edgeData[i][1], edgeData[i][0]];
		} else {
			[edgeData[i][0], edgeData[j][0]] = [edgeData[j][0], edgeData[i][0]];
			[edgeData[i][1], edgeData[j][1]] = [edgeData[j][1], edgeData[i][1]];
		}
	}

	for (let i = 0; i < edgeData.length; i++) {
		edgeData[i][0] = nodeOrder[edgeData[i][0]] + offset;
		edgeData[i][1] = nodeOrder[edgeData[i][1]] + offset;
		cy.add({
			data: {
				id: `e${i + 1}`,
				source: edgeData[i][0].toString(),
				target: edgeData[i][1].toString()
			}
		});

		const w = randInt(weight[0], weight[1]);
		cy.$id(`e${i + 1}`).data('weight', w);
		edgeData[i].push(w);
	}

	if (mode === 'bipartite') {
		const roots: string[] = [];
		for (let i = 0; i < node; i++) {
			if (i < part) {
				roots.push((nodeOrder[i] + offset).toString());
				cy.$id((nodeOrder[i] + offset).toString()).style('background-color', '#F7BD5B'); // orange
			} else {
				cy.$id((nodeOrder[i] + offset).toString()).style('background-color', '#80B1EB'); // blue
			}
		}
		// cy.layout({ name: 'breadthfirst', roots, directed: true, animate: false }).run();
		cy.layout({ name: 'cose', animate: false }).run();
	} else if (mode === 'complete') {
		cy.layout({ name: 'circle', animate: false }).run();
	} else {
		cy.layout({ name: 'cose', animate: false }).run();
	}

	return edgeData;
};

const edgeFree = (node: number, edge: number, used: Set<number>): number[][] => {
	const ret: number[][] = [];
	const l = [];

	for (let n1 = 0; n1 < node; n1++) {
		for (let n2 = n1 + 1; n2 < node; n2++) {
			if (used.has(n1 * node + n2) || used.has(n2 * node + n1)) continue;
			l.push([n1, n2]);
		}
	}

	for (let i = 0; i < l.length; i++) {
		if (Math.random() > edge / (l.length - i)) {
			continue;
		}
		edge--;
		ret.push([l[i][0], l[i][1]]);
	}

	return ret;
};

const edgeTree = (node: number): number[][] => {
	const ret: number[][] = [];

	if (node <= 1) return [];

	let a: number[] = Array<number>(node - 2).fill(0);
	const degree: number[] = Array<number>(node).fill(1);
	a = a.map(() => {
		const val = randInt(0, node - 1);
		degree[val] += 1;
		return val;
	});
	for (let i = 0; i < node - 2; i++) {
		const pair = degree.indexOf(1);
		degree[a[i]] -= 1;
		degree[pair] -= 1;
		ret.push([a[i], pair]);
	}

	const u = degree.indexOf(1);
	const v = degree.lastIndexOf(1);
	ret.push([u, v]);

	return ret;
};

const edgeComplete = (node: number): number[][] => {
	return edgeFree(node, (node * (node - 1)) / 2, new Set());
};

export const edgeStar = (node: number): number[][] => {
	const ret: number[][] = [];

	for (let i = 0; i < node; i++) {
		if (i === 0) continue;
		ret.push([0, i]);
	}

	return ret;
};

const edgeCycle = (node: number): number[][] => {
	if (node < 2) return [];
	const ret: number[][] = [];

	for (let i = 0; i < node; i++) {
		ret.push([i, (i + 1) % node]);
	}

	return ret;
};

const edgeBipartite = (node: number, edge: number, part: number): number[][] => {
	const used: Set<number> = new Set();

	for (let i = 0; i < part; i++) {
		for (let j = i + 1; j < part; j++) {
			used.add(i * node + j);
		}
	}

	for (let i = part; i < node; i++) {
		for (let j = i + 1; j < node; j++) {
			used.add(i * node + j);
		}
	}

	const ret = edgeFree(node, edge, used);

	return ret;
};

const edgeConnectedBipartite = (node: number, edge: number, part: number): number[][] => {
	const uf = new UnionFind(node);
	const ret: number[][] = [];
	const used: Set<number> = new Set();

	for (let i = 0; i < part; i++) {
		for (let j = i + 1; j < part; j++) {
			used.add(i * node + j);
		}
	}

	for (let i = part; i < node; i++) {
		for (let j = i + 1; j < node; j++) {
			used.add(i * node + j);
		}
	}

	let count = node - 1;
	while (count > 0) {
		const u = randInt(0, part - 1);
		const v = randInt(part, node - 1);
		if (uf.merge(u, v)) {
			used.add(u * node + v);
			ret.push([u, v]);
			count--;
		}
	}

	return ret.concat(edgeFree(node, edge - node + 1, used));
};

const edgePath = (node: number): number[][] => {
	const ret: number[][] = [];

	for (let i = 0; i < node - 1; i++) {
		ret.push([i, i + 1]);
	}

	return ret;
};

export const minEdge = (node: number, mode: GenerateType, connected: boolean): number => {
	if (mode === 'tree') return node - 1;
	if (mode === 'complete') return (node * (node - 1)) / 2;
	if (mode === 'star') return node - 1;
	if (mode === 'cycle') return node;
	if (mode === 'random' && connected) return node - 1;
	if (mode === 'random' && !connected) return 1;
	return 0;
};

export const maxEdge = (node: number, mode: GenerateType): number => {
	if (mode === 'tree') return node - 1;
	if (mode === 'complete') return (node * (node - 1)) / 2;
	if (mode === 'star') return node - 1;
	if (mode === 'cycle') return node;
	if (mode === 'random') return (node * (node - 1)) / 2;
	return 0;
};

const shuffle = (a: number[]): number[] => {
	for (let i = a.length - 1; i > 0; i--) {
		const j = randInt(0, i);
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a.slice();
};

export const randInt = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const formatEdge = (
	nm: number[],
	edgeData: number[][],
	weighted: boolean,
	formatMode: FormatModeType
): string => {
	if (formatMode === 'column' && weighted) {
		return `${nm.join(' ')}\n${edgeData.map((e) => e.join(' ')).join('\n')}`;
	} else if (formatMode === 'column' && !weighted) {
		return `${nm.join(' ')}\n${edgeData.map((e) => `${e[0]} ${e[1]}`).join('\n')}`;
	} else if (formatMode === 'row' && weighted) {
		const u = edgeData.map((e) => e[0]).join(' ');
		const v = edgeData.map((e) => e[1]).join(' ');
		const w = edgeData.map((e) => e[2]).join(' ');
		return `${nm.join(' ')}\n${w}\n${u}\n${v}`;
	} else if ((formatMode === 'row' && !weighted) || (formatMode === 'weight-row' && !weighted)) {
		const u = edgeData.map((e) => e[0]).join(' ');
		const v = edgeData.map((e) => e[1]).join(' ');
		return `${nm.join(' ')}\n${u}\n${v}`;
	} else if (formatMode === 'weight-row' && weighted) {
		const w = edgeData.map((e) => e[2]).join(' ');
		const uv = edgeData.map((e) => e.slice(0, 2).join(' ')).join('\n');
		return `${nm.join(' ')}\n${w}\n${uv}`;
	}
	return '';
};
