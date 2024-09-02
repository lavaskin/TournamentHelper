import { Contestant } from "../models/contestant";

const dinnerContestants: Contestant[] = [
	{
		name: 'Lasagna',
		thumbnailUrl: '',
		weight: 1,
	},
	{
		name: 'Mac & Cheese',
		thumbnailUrl: '',
		weight: 1,
	},
	{
		name: 'Meatloaf',
		thumbnailUrl: '',
		weight: 1,
	},
	{
		name: 'Pad Thai',
		thumbnailUrl: '',
		weight: 1,
	},
	{
		name: 'Pizza',
		thumbnailUrl: '',
		weight: 1,
	},
	{
		name: 'Fettachini Alfredo',
		thumbnailUrl: '',
		weight: 1,
	},
	{
		name: 'Burrito',
		thumbnailUrl: '',
		weight: 1,
	},
	{
		name: 'Mashed Potatoes',
		thumbnailUrl: '',
		weight: 1,
	},

	/*
	{
		name: '',
		thumbnailUrl: '',
		weight: 1,
	},
	*/
];

// Check for even number of contestants
if (dinnerContestants.length % 2 !== 0) {
	throw new Error('Odd number of dinner contestants');
}

console.log('Dinner Contestants: ', dinnerContestants.length);
export default dinnerContestants;