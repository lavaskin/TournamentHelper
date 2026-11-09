import { Contestant } from './contestant.model';

export interface Tournament {
	// Unique, URL-safe id (lowercase letters, numbers and dashes)
	slug: string,
	title: string,
	contestants: Contestant[],
	thumbnailPath: string,
	shuffle?: boolean,
	imageBg?: boolean,
}
