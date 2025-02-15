import { Tournament } from "../models/tournament.model";
import animalContestants from "./animals.data";
import dinnerContestants from "./dinner.data";
import posterContestants from "./posters.data";
import waifuContestants from "./waifus.data";

const animalTournamnent: Tournament = {
	contestants: animalContestants,
	thumbnailPath: 'animals',
	shuffle: true,
}

const dinnerTournament: Tournament = {
	contestants: dinnerContestants,
	thumbnailPath: 'dinner',
	shuffle: true,
}

const posterTournament: Tournament = {
	contestants: posterContestants,
	thumbnailPath: 'poster',
	shuffle: true,
}

const waifuTournament: Tournament = {
	contestants: waifuContestants,
	thumbnailPath: 'waifus',
	shuffle: true,
}

export {
	animalTournamnent,
	dinnerTournament,
	posterTournament,
	waifuTournament,
};