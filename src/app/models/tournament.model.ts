import { Contestant } from "./contestant.model";

export interface Tournament {
	contestants: Contestant[],
	thumbnailPath: string,
	shuffle?: boolean,
}