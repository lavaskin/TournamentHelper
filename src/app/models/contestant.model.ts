export interface Contestant {
	name: string,
	thumbnailUrl: string,

	// Initially, this represents how many people picked this contestant and will grow as the game progresses
	// This can be nullable, but the default should always be 1 if not provided
	weight?: number,
}