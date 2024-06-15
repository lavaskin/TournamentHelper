export interface Contestant {
	name: string,
	thumbnailUrl: string,

	// Initially, this represents how many people picked this contestant and will grow as the game progresses
	weight: number,
}