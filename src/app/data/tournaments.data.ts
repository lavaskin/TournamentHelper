import { Tournament } from "../models/tournament.model";
import animalContestants from "./animals.data";
import dinnerContestants from "./dinner.data";
import posterContestants from "./posters.data";
import waifuContestants from "./waifus.data";

const posterTournament: Tournament = {
	title: "Movie Poster Tournament",
	contestants: posterContestants,
	thumbnailPath: 'poster',
	shuffle: true,
}

const animalTournamnent: Tournament = {
	title: "Animal Battle Royale",
	contestants: animalContestants,
	thumbnailPath: 'animals',
	shuffle: true,
}

const dinnerTournament: Tournament = {
	title: "Dinner Tournament",
	contestants: dinnerContestants,
	thumbnailPath: 'dinner',
	shuffle: true,
}

const waifuTournament: Tournament = {
	title: "Ultimate Waifu Tournament",
	contestants: waifuContestants,
	thumbnailPath: 'waifus',
	shuffle: true,
}

export {
	posterTournament,
	animalTournamnent,
	dinnerTournament,
	waifuTournament,
};