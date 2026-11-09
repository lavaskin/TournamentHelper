import { Tournament } from '../models/tournament.model';
import albumCoverContestants from './album-covers.data';
import animalContestants from './animals.data';
import dinnerContestants from './dinner.data';
import posterContestants from './posters.data';
import waifuContestants from './waifus.data';
import gatmPeopleHumanContestants from './gatm-people-humans.data';
import bandNameContestants from './band-names.data';
import gatmPeopleMonsterContestants from './gatm-people-monsters.data';

// Every tournament, in the order they're listed on the home page
const tournaments: Tournament[] = [
	{
		slug: 'movie-posters',
		title: 'Movie Posters',
		contestants: posterContestants,
		thumbnailPath: 'poster',
		shuffle: true,
	},
	{
		slug: 'animals',
		title: 'Animal Battle Royale',
		contestants: animalContestants,
		thumbnailPath: 'animals',
		shuffle: true,
	},
	{
		slug: 'dinner-meals',
		title: 'Dinner Meals',
		contestants: dinnerContestants,
		thumbnailPath: 'dinner',
		shuffle: true,
	},
	{
		slug: 'waifus',
		title: 'Ultimate Waifu Tournament',
		contestants: waifuContestants,
		thumbnailPath: 'waifus',
		shuffle: true,
	},
	{
		slug: 'album-covers',
		title: 'Album Covers',
		contestants: albumCoverContestants,
		thumbnailPath: 'album-covers',
		shuffle: true,
	},
	{
		slug: 'gatm-humans',
		title: 'GatM Death Battle (Humans)',
		contestants: gatmPeopleHumanContestants,
		thumbnailPath: 'gatm_people',
		shuffle: true,
	},
	{
		slug: 'gatm-monsters',
		title: 'GatM Death Battle (Monsters)',
		contestants: gatmPeopleMonsterContestants,
		thumbnailPath: 'gatm_people',
		shuffle: true,
	},
	{
		slug: 'band-names',
		title: 'Band Names',
		contestants: bandNameContestants,
		thumbnailPath: 'band_names',
		shuffle: true,
		imageBg: true,
	},
];

export default tournaments;
