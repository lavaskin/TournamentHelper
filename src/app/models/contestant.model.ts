export interface Contestant {
	name: string,
	thumbnailUrl: string,

	// Tournament seed, 1 being the best. Seeds within a tournament must be unique and run 1..K with no gaps.
	// Seeded contestants are placed so higher seeds only meet in later rounds, and get byes first.
	seed?: number,
}
