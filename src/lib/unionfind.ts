export class UnionFind {
	private parents: number[];

	public constructor(private n: number) {
		this.parents = new Array<number>(n);
		for (let i = 0; i < n; i++) this.parents[i] = -1;
	}

	public root(a: number): number {
		if (this.parents[a] < 0) {
			return a;
		}
		return (this.parents[a] = this.root(this.parents[a]));
	}

	public size(a: number): number {
		return -this.parents[this.root(a)];
	}

	public merge(a: number, b: number): boolean {
		let ra = this.root(a);
		let rb = this.root(b);
		if (ra === rb) {
			return false;
		}

		if (this.size(ra) < this.size(rb)) {
			const tmp = ra;
			ra = rb;
			rb = tmp;
		}
		this.parents[ra] += this.parents[rb];
		this.parents[rb] = ra;
		return true;
	}

	public isSame(a: number, b: number): boolean {
		const ra = this.root(a);
		const rb = this.root(b);
		return ra === rb;
	}
}
