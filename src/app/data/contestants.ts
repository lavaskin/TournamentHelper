import { Contestant } from "../models/contestant";

const contestants: Contestant[] = [
	{
		name: 'Oldboy (2003)',
		thumbnailUrl: 'https://image.tmdb.org/t/p/original/pWDtjs568ZfOTMbURQBYuT4Qxka.jpg',
		weight: 1,
	},
	{
		name: 'Spider-Man: Into the Spider-Verse (2018)',
		thumbnailUrl: 'https://image.tmdb.org/t/p/original/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg',
		weight: 1,
	},
	{
		name: 'X (2022)',
		thumbnailUrl: 'https://image.tmdb.org/t/p/original/woTQx9Q4b8aO13jR9dsj8C9JESy.jpg',
		weight: 1,
	},
	{
		name: 'Perfect Blue (1997)',
		thumbnailUrl: 'https://image.tmdb.org/t/p/original/6WTiOCfDPP8XV4jqfloiVWf7KHq.jpg',
		weight: 1,
	},
	{
		name: 'Moonfall (2022)',
		thumbnailUrl: 'https://image.tmdb.org/t/p/original/odVv1sqVs0KxBXiA8bhIBlPgalx.jpg',
		weight: 1,
	},
	{
		name: 'Heathers (1988)',
		// can't find hq version anymore???
		thumbnailUrl: 'https://media.themoviedb.org/t/p/w220_and_h330_face/pbK7GvYCrkqUevhGLcNuyja3ngm.jpg',
		weight: 1,
	},
	{
		name: 'Skinamarink (2023)',
		thumbnailUrl: 'https://image.tmdb.org/t/p/original/o942912KFh89SGhqWuKXuT0SXzN.jpg',
		weight: 2,
	},
	{
		name: 'Cloverfield (2008)',
		thumbnailUrl: 'https://image.tmdb.org/t/p/original/qIegUGJqyMMCRjkKV1s7A9MqdJ8.jpg',
		weight: 1,
	},
	{
		name: 'Planet Hulk (2010)',
		thumbnailUrl: 'https://image.tmdb.org/t/p/original/5wCzY3sAs6zHIzzHIcTKN2g0pu8.jpg',
		weight: 1,
	},
	{
		name: 'The Day After Tomorrow (2004)',
		thumbnailUrl: 'https://image.tmdb.org/t/p/original/Wr4HeYQRvwVCxzOV5TmGE7UkXq.jpg',
		weight: 1,
	},
	{
		name: 'Blade (1998)',
		thumbnailUrl: 'https://image.tmdb.org/t/p/original/oWT70TvbsmQaqyphCZpsnQR7R32.jpg',
		weight: 1,
	},
	{
		name: 'Logan (2017)',
		thumbnailUrl: 'https://image.tmdb.org/t/p/original/r9utEhMKiaXUj0Bi6iAa3Yr5hrL.jpg',
		weight: 1,
	},
	{
		name: 'Dawn of the Dead (1978)',
		thumbnailUrl: 'https://image.tmdb.org/t/p/original/h6aVbUsiJB3Le1xrhyZXsXZOI3h.jpg',
		weight: 1,
	},
	{
		name: 'Ichi the Killer (2001)',
		thumbnailUrl: 'https://image.tmdb.org/t/p/original/k8j4YLZlda98dqp9ErymKzjYowG.jpg',
		weight: 2,
	},
	{
		name: 'Neon Genesis Evangelion: The End of Evangelion (1997)',
		thumbnailUrl: 'https://image.tmdb.org/t/p/original/j6G24dqI4WgUtChhWjfnI4lnmiK.jpg',
		weight: 1,
	},
	{
		name: 'The Shining (1980)',
		thumbnailUrl: 'https://image.tmdb.org/t/p/original/xazWoLealQwEgqZ89MLZklLZD3k.jpg',
		weight: 1,
	},
	{
		name: '5 Centimeters per Second (2007)',
		thumbnailUrl: 'https://image.tmdb.org/t/p/original/dFipUR6W0y3PPkuVS8gjFd929m2.jpg',
		weight: 1,
	},
	{
		name: 'Cube (1997)',
		thumbnailUrl: 'https://image.tmdb.org/t/p/original/x4BTjxdrOKC27FcSkBh8KPEgnum.jpg',
		weight: 1,
	},
	{
		name: 'Kong: Skull Island (2017)',
		thumbnailUrl: 'https://image.tmdb.org/t/p/original/r2517Vz9EhDhj88qwbDVj8DCRZN.jpg',
		weight: 1,
	},
	{
		name: 'Godzilla (2014)',
		thumbnailUrl: 'https://image.tmdb.org/t/p/original/zokD6uxR2iWfYM3Y84yGJvnNTK7.jpg',
		weight: 1,
	},
	{
		name: 'Godzilla Minus One (2023)',
		thumbnailUrl: 'https://image.tmdb.org/t/p/original/hkxxMIGaiCTmrEArK7J56JTKUlB.jpg',
		weight: 1,
	},
	{
		name: 'Demon Slayer: Mugen Train (2020)',
		thumbnailUrl: 'https://image.tmdb.org/t/p/original/i78pnWKV3VEjJIoSU1td6DVPhqr.jpg',
		weight: 1,
	},
	{
		name: 'Wolf Children (2012)',
		thumbnailUrl: 'https://www.themoviedb.org/t/p/original/9iIVipT06xhlo48qgjwDkqekC7q.jpg',
		weight: 1,
	},
	{
		name: 'Belle (2021)',
		thumbnailUrl: 'https://image.tmdb.org/t/p/original/fYHOD4pxZQk4rsP2tQrZI5uBlZV.jpg',
		weight: 1,
	},
	{
		name: 'I Am Legend (2007)',
		thumbnailUrl: 'https://image.tmdb.org/t/p/original/iPDkaSdKk2jRLTM65UOEoKtsIZ8.jpg',
		weight: 1,
	},
	{
		name: 'Watchmen (2009)',
		thumbnailUrl: 'https://image.tmdb.org/t/p/original/aZzbKNtmGmkHxaGh5xu9tgw65n2.jpg',
		weight: 1,
	},
	{
		name: 'Jojo Rabbit (2019)',
		thumbnailUrl: 'https://image.tmdb.org/t/p/original/7GsM4mtM0worCtIVeiQt28HieeN.jpg',
		weight: 1,
	},
	{
		name: 'The Raid: Redemption (2011)',
		thumbnailUrl: 'https://image.tmdb.org/t/p/original/Abnm1Ws3JH0ReCfEhLMPwPcMcGO.jpg',
		weight: 1,
	},
	{
		name: 'Mad Max: Fury Road (2015)',
		thumbnailUrl: 'https://image.tmdb.org/t/p/original/hA2ple9q4qnwxp3hKVNhroipsir.jpg',
		weight: 1,
	},
	{
		name: 'All My Friends Hate Me (2021)',
		thumbnailUrl: 'https://image.tmdb.org/t/p/original/7j5ZLDGWQ4U3iAD2wLNhs0CjpuQ.jpg',
		weight: 1,
	},
	{
		name: 'RRR (2022)',
		thumbnailUrl: 'https://image.tmdb.org/t/p/original/nQKW2sabIClUsrQl3Y3i5LQgf5l.jpg',
		weight: 1,
	},
	{
		name: 'Pandorum (2009)',
		thumbnailUrl: 'https://www.themoviedb.org/t/p/original/mNMfa6r3pl0EzFIKEkVcxyr6Rc7.jpg',
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
if (contestants.length % 2 !== 0) {
	throw new Error('Odd number of contestants');
}

console.log('Contestants: ', contestants.length);
export default contestants;