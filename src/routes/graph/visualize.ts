import type cytoscape from 'cytoscape';

export const readGraph = (
	cy: cytoscape.Core | null,
	inputText: string,
	offset: number
): { valid: boolean; errorMessage: string } => {
	if (!cy) return { valid: false, errorMessage: 'Cytoscape not initialized' };
	try {
		const lines = inputText.split('\n').filter((line) => line.trim() !== '');
		if (lines.length == 0) {
			return { valid: false, errorMessage: 'Empty input' };
		}
		const firstLine = lines[0]
			.split(' ')
			.filter((val) => val.trim() !== '')
			.map(Number)
			.filter((val) => !Number.isNaN(val) && Number.isInteger(val));
		if (firstLine.length != 2) {
			return { valid: false, errorMessage: 'First line must be "n m"' };
		}
		const node = firstLine[0];
		const edge = firstLine[1];
		console.log(node, edge);

		const edgeLines = lines.slice(1);
		if (edgeLines.length != edge) {
			return { valid: false, errorMessage: 'Number of edges does not match' };
		}

		const edgeDatas = edgeLines.map((edgeLine) => {
			return edgeLine
				.split(' ')
				.filter((val) => val.trim() !== '')
				.map(Number)
				.filter((val) => !Number.isNaN(val) && Number.isInteger(val));
		});

		if (edgeDatas.some((edgeData) => edgeData.length != 2)) {
			return { valid: false, errorMessage: 'Each edge must be "u v"' };
		}
		if (
			edgeDatas.some((edgeData) => edgeData.some((val) => val - offset < 0 || val - offset >= node))
		) {
			return { valid: false, errorMessage: 'Node index out of range' };
		}

		cy.elements().remove();
		for (let i = 0; i < node; i++) {
			cy.add({ data: { id: (i + offset).toString() } });
		}
		edgeDatas.map((edgeData, i) =>
			cy.add({
				data: {
					id: `e${i + 1}`,
					source: edgeData[0].toString(),
					target: edgeData[1].toString()
				}
			})
		);
		cy.layout({ name: 'cose', animate: false }).run();
		return { valid: true, errorMessage: '' };
	} catch {
		return { valid: false, errorMessage: 'Something went wrong' };
	}
};
