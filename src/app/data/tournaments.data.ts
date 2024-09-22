import { Tournament } from "../models/tournament.model";
import animalContestants from "./animals.data";
import dinnerContestants from "./dinner.data";
import posterContestants from "./posters.data";

const animalTournamnent: Tournament = {
	contestants: animalContestants,
	thumbnailPath: 'animals',
}

const dinnerTournament: Tournament = {
	contestants: dinnerContestants,
	thumbnailPath: 'dinner',
}

const posterTournament: Tournament = {
	contestants: posterContestants,
	thumbnailPath: 'poster',
}

export {
	animalTournamnent,
	dinnerTournament,
	posterTournament,
};