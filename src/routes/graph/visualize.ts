import type cytoscape from 'cytoscape';

type GraphData = {
	node: number;
	edge: number;
	edgeDatas: Array<Array<number>>;
};

export type Mode = 'row' | 'column';

export const updateGraph = (
	cy: cytoscape.Core | null,
	inputText: string,
	offset: number,
	mode: Mode
): { valid: boolean; errorMessage: string } => {
	if (!cy) return { valid: false, errorMessage: 'Cytoscape not initialized' };
	try {
		const lines = inputText.split('\n').filter((line) => line.trim() !== '');
		if (lines.length == 0) {
			return { valid: true, errorMessage: '' };
		}
		const graphData = mode === 'row' ? readRowGraph(lines, offset) : readColumnGraph(lines, offset);
		writeGraph(cy, graphData, offset);

		return { valid: true, errorMessage: '' };
	} catch (err) {
		if (err instanceof Error) {
			return { valid: false, errorMessage: err.message };
		} else {
			return { valid: false, errorMessage: 'Something went wrong' };
		}
	}
};

const readColumnGraph = (rawLines: Array<string>, offset: number): GraphData => {
	const firstLine = convert(rawLines[0]);
	if (firstLine.length != 2) {
		throw new Error('First line must be "n m"');
	}
	const node = firstLine[0];
	const edge = firstLine[1];

	const edgeLines = rawLines.slice(1);
	if (edgeLines.length != edge) {
		throw new Error('Number of edges does not match');
	}

	const edgeDatas = edgeLines.map((edgeLine) => convert(edgeLine));

	if (edgeDatas.some((edgeData) => edgeData.length != 2)) {
		throw new Error('Each edge must be "u v" format');
	}
	if (
		edgeDatas.some((edgeData) => edgeData.some((val) => val - offset < 0 || val - offset >= node))
	) {
		throw new Error('Node index out of range');
	}
	return { node, edge, edgeDatas };
};

const readRowGraph = (rawLines: Array<string>, offset: number): GraphData => {
	const firstLine = convert(rawLines[0]);
	if (firstLine.length != 2) {
		throw new Error('First line must be "n m"');
	}
	const node = firstLine[0];
	const edge = firstLine[1];

	const edgeLines = rawLines.slice(1);
	if (edgeLines.length != 2) {
		throw new Error('Input must be three lines');
	}

	const transposedEdgeDatas = edgeLines.map((edgeLine) => convert(edgeLine));

	if (transposedEdgeDatas[0].length != edge || transposedEdgeDatas[1].length != edge) {
		throw new Error('Number of edges does not match');
	}

	const edgeDatas = trans(transposedEdgeDatas);

	if (
		edgeDatas.some((edgeData) => edgeData.some((val) => val - offset < 0 || val - offset >= node))
	) {
		throw new Error('Node index out of range');
	}
	return { node, edge, edgeDatas };
};

const writeGraph = (cy: cytoscape.Core, graph: GraphData, offset: number): void => {
	// initialize node/edge
	cy.elements().remove();

	// add nodes
	for (let i = 0; i < graph.node; i++) {
		cy.add({ data: { id: (i + offset).toString() } });
	}

	// add edges
	graph.edgeDatas.map((edgeData, i) =>
		cy.add({
			data: {
				id: `e${i + 1}`,
				source: edgeData[0].toString(),
				target: edgeData[1].toString()
			}
		})
	);

	// update graph
	cy.layout({ name: 'cose', animate: false }).run();
};

const convert = (originalText: string): Array<number> => {
	return originalText
		.split(' ')
		.filter((val) => val.trim() !== '')
		.map(Number)
		.filter((val) => !Number.isNaN(val) && Number.isInteger(val));
};

// Transpose a matrix
const trans = (a: Array<Array<number>>) => {
	return a[0].map((_, c) => a.map((r) => r[c]));
};
