import { existsSync } from 'node:fs';
import { join } from 'node:path';
import tournaments from './tournaments.data';

// Tests run from the project root
const CONTESTANT_IMAGE_DIR = join('public', 'contestants');

describe('Tournament data', () => {
	it('has at least one tournament', () => {
		expect(tournaments.length).toBeGreaterThan(0);
	});

	it('has unique slugs', () => {
		const seen = new Set<string>();
		const duplicates = tournaments
			.map(t => t.slug)
			.filter(slug => seen.has(slug) || !seen.add(slug));

		expect(duplicates, 'Duplicate tournament slugs').toEqual([]);
	});

	for (const [index, tournament] of tournaments.entries()) {
		const label = tournament.title.trim() || tournament.slug || `Tournament #${index + 1}`;

		describe(label, () => {
			it('has a URL-safe slug', () => {
				expect(tournament.slug, `"${label}" slug must match ^[a-z0-9-]+$`).toMatch(/^[a-z0-9-]+$/);
			});

			it('has a title', () => {
				expect(tournament.title.trim(), `"${label}" has an empty title`).not.toBe('');
			});

			it('has at least 2 contestants', () => {
				expect(tournament.contestants.length, `"${label}" needs at least 2 contestants`).toBeGreaterThanOrEqual(2);
			});

			it('has unique contestant names', () => {
				const seen = new Set<string>();
				const duplicates = tournament.contestants
					.map(c => c.name)
					.filter(name => seen.has(name) || !seen.add(name));

				expect(duplicates, `"${label}" has duplicate contestant names`).toEqual([]);
			});

			it('has valid seeds', () => {
				const count = tournament.contestants.length;
				const seeded = tournament.contestants.filter(c => c.seed !== undefined);
				const seeds = new Set(seeded.map(c => c.seed!));
				const problems: string[] = [];

				for (const c of seeded) {
					if (!Number.isInteger(c.seed) || c.seed! < 1 || c.seed! > count) {
						problems.push(`${c.name}: seed ${c.seed} must be a whole number from 1 to ${count}`);
					}
				}

				for (const seed of seeds) {
					const holders = seeded.filter(c => c.seed === seed).map(c => c.name);
					if (holders.length > 1) problems.push(`seed ${seed} is used more than once (${holders.join(', ')})`);
				}

				for (let seed = 1; seed <= Math.max(0, ...seeds); seed++) {
					if (!seeds.has(seed)) problems.push(`seed ${seed} is missing (seeds must run 1..K with no gaps)`);
				}

				expect(problems, `"${label}" has invalid seeds`).toEqual([]);
			});

			it('has an image file for every local thumbnail', () => {
				const missing = tournament.contestants
					.filter(c => !c.thumbnailUrl.startsWith('http'))
					.filter(c => !existsSync(join(CONTESTANT_IMAGE_DIR, tournament.thumbnailPath, c.thumbnailUrl)))
					.map(c => `${c.name} (${join(CONTESTANT_IMAGE_DIR, tournament.thumbnailPath, c.thumbnailUrl)})`);

				expect(missing, `"${label}" has contestants with missing images`).toEqual([]);
			});
		});
	}
});
