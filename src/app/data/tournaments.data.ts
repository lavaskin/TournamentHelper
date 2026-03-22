import { Tournament } from "../models/tournament.model";
import albumCoverContestants from "./album-covers.data";
import animalContestants from "./animals.data";
import dinnerContestants from "./dinner.data";
import posterContestants from "./posters.data";
import waifuContestants from "./waifus.data";
import gatmPeopleHumanContestants from "./gatm-people-humans.data";
import bandNameContestants from "./band-names.data";
import gatmPeopleMonsterContestants from "./gatm-people-monsters.data";

const posterTournament: Tournament = {
	title: "Movie Posters",
	contestants: posterContestants,
	thumbnailPath: 'poster',
	shuffle: true,
}

const animalTournament: Tournament = {
	title: "Animal Battle Royale",
	contestants: animalContestants,
	thumbnailPath: 'animals',
	shuffle: true,
}

const dinnerTournament: Tournament = {
	title: "Dinner Meals",
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

const albumCoverTournament: Tournament = {
	title: "Album Covers",
	contestants: albumCoverContestants,
	thumbnailPath: 'album-covers',
	shuffle: true,
}

const gatmPeopleHumanTournament: Tournament = {
	title: "GatM Death Battle (Humans)",
	contestants: gatmPeopleHumanContestants,
	thumbnailPath: 'gatm_people',
	shuffle: true,
}

const gatmPeopleMonsterTournament: Tournament = {
	title: "GatM Death Battle (Monsters)",
	contestants: gatmPeopleMonsterContestants,
	thumbnailPath: 'gatm_people',
	shuffle: true,
}

const bandNameTournament: Tournament = {
	title: "Band Names",
	contestants: bandNameContestants,
	thumbnailPath: 'band_names',
	shuffle: true,
	imageBg: true,
}

export {
	posterTournament,
	animalTournament,
	dinnerTournament,
	waifuTournament,
	albumCoverTournament,
	gatmPeopleHumanTournament,
	gatmPeopleMonsterTournament,
	bandNameTournament,
};
