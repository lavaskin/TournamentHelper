import { Contestant } from "./contestant.model";

export interface Tournament {
	title: string,
	contestants: Contestant[],
	thumbnailPath: string,
	shuffle?: boolean,
}