import { Contestant } from "../models/contestant";

const contestants: Contestant[] = [
	{
		name: 'Oldboy (2003)',
		thumbnailUrl: 'https://media.themoviedb.org/t/p/w220_and_h330_face/pWDtjs568ZfOTMbURQBYuT4Qxka.jpg',
		weight: 1,
	},
	{
		name: 'Spider-Man: Into the Spider-Verse (2018)',
		thumbnailUrl: 'https://media.themoviedb.org/t/p/w220_and_h330_face/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg',
		weight: 1,
	},
	{
		name: 'X (2022)',
		thumbnailUrl: 'https://media.themoviedb.org/t/p/w220_and_h330_face/woTQx9Q4b8aO13jR9dsj8C9JESy.jpg',
		weight: 1,
	},
	{
		name: 'Perfect Blue (1997)',
		thumbnailUrl: 'https://www.themoviedb.org/t/p/w220_and_h330_face/kG4AZLcWilPYIixowm8pnE3DqfI.jpg',
		weight: 1,
	},
	{
		name: 'Moonfall (2022)',
		thumbnailUrl: 'https://www.themoviedb.org/t/p/w220_and_h330_face/odVv1sqVs0KxBXiA8bhIBlPgalx.jpg',
		weight: 1,
	},
	{
		name: 'Heathers (1988)',
		thumbnailUrl: 'https://media.themoviedb.org/t/p/w220_and_h330_face/pbK7GvYCrkqUevhGLcNuyja3ngm.jpg',
		weight: 1,
	},
	{
		name: 'Skinamarink (2023)',
		thumbnailUrl: 'https://www.themoviedb.org/t/p/w220_and_h330_face/o942912KFh89SGhqWuKXuT0SXzN.jpg',
		weight: 2,
	},
	{
		name: 'Cloverfield (2008)',
		thumbnailUrl: 'https://media.themoviedb.org/t/p/w220_and_h330_face/qIegUGJqyMMCRjkKV1s7A9MqdJ8.jpg',
		weight: 1,
	},
	{
		name: 'Planet Hulk (2010)',
		thumbnailUrl: 'https://media.themoviedb.org/t/p/w220_and_h330_face/5wCzY3sAs6zHIzzHIcTKN2g0pu8.jpg',
		weight: 1,
	},
	{
		name: 'The Day After Tomorrow (2004)',
		thumbnailUrl: 'https://www.themoviedb.org/t/p/w220_and_h330_face/xKlRPO4lOBrLGdvCTnVttexYnpl.jpg',
		weight: 1,
	},
	{
		name: 'Blade (1998)',
		thumbnailUrl: 'https://media.themoviedb.org/t/p/w220_and_h330_face/hx0sdduAsr4rq03RZKZzglR25z7.jpg',
		weight: 1,
	},
	{
		name: 'Logan (2017)',
		thumbnailUrl: 'https://media.themoviedb.org/t/p/w220_and_h330_face/r9utEhMKiaXUj0Bi6iAa3Yr5hrL.jpg',
		weight: 1,
	},
	{
		name: 'Dawn of the Dead (1978)',
		thumbnailUrl: 'https://www.themoviedb.org/t/p/w220_and_h330_face/h6aVbUsiJB3Le1xrhyZXsXZOI3h.jpg',
		weight: 1,
	},
	{
		name: 'Ichi the Killer (2001)',
		thumbnailUrl: 'https://media.themoviedb.org/t/p/w220_and_h330_face/k8j4YLZlda98dqp9ErymKzjYowG.jpg',
		weight: 2,
	},
	{
		name: 'Neon Genesis Evangelion: The End of Evangelion (1997)',
		thumbnailUrl: 'https://media.themoviedb.org/t/p/w220_and_h330_face/j6G24dqI4WgUtChhWjfnI4lnmiK.jpg',
		weight: 1,
	},
	{
		name: 'The Shining (1980)',
		thumbnailUrl: 'https://www.themoviedb.org/t/p/w220_and_h330_face/xazWoLealQwEgqZ89MLZklLZD3k.jpg',
		weight: 1,
	},
	{
		name: '5 Centimeters per Second (2007)',
		thumbnailUrl: 'https://media.themoviedb.org/t/p/w220_and_h330_face/dFipUR6W0y3PPkuVS8gjFd929m2.jpg',
		weight: 1,
	},
	{
		name: 'Cube (1997)',
		thumbnailUrl: 'https://media.themoviedb.org/t/p/w220_and_h330_face/cEfftNuyt6Do2tLg0jWk3QhUlnM.jpg',
		weight: 1,
	},
	// {
	// 	name: 'Kong: Skull Island (2017)',
	// 	thumbnailUrl: 'https://media.themoviedb.org/t/p/w220_and_h330_face/r2517Vz9EhDhj88qwbDVj8DCRZN.jpg',
	// 	weight: 1,
	// },
		
	/*
	{
		name: '',
		thumbnailUrl: '',
		weight: 1,
	},
	*/
];

// Check for even number of contestants
if (contestants.length % 2 !== 0) {
	throw new Error('Odd number of contestants');
}

export default contestants;