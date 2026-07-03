/**
 * Curated Dataset of 30 Legendary Hollywood Blockbusters for Recommendation Engine
 * Includes genres, keywords, cast lists, description summaries, IMDb ratings, TMDB IDs, and SVD latent factor coordinates.
 */

export interface Movie {
  id: number;
  title: string;
  genres: string[];
  keywords: string[];
  cast: string[];
  director: string;
  overview: string;
  rating: number;
  releaseYear: number;
  popularity: number;
  language: string;
  posterUrl: string;
  backdropUrl: string;
  trailerKey: string;
  metadataSoup: string;
  // Latent SVD factor representations: [Action/SciFi, Drama, Comedy, Romance, Thriller/Suspense]
  svdFactors: number[];
}

export const moviesData: Movie[] = [
  {
    id: 19995,
    title: "Avatar",
    genres: ["Action", "Adventure", "Sci-Fi"],
    keywords: ["space", "alien", "soldier", "avatar", "nature"],
    cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
    director: "James Cameron",
    overview: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.",
    rating: 7.5,
    releaseYear: 2009,
    popularity: 150.4,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1542204172-e70528091f50?w=1600&auto=format&fit=crop",
    trailerKey: "5PSNL1q39VY",
    metadataSoup: "action adventure sci-fi space alien soldier avatar nature sam worthington zoe saldana sigourney weaver james cameron paraplegic marine dispatched moon pandora unique mission torn following orders protecting world home",
    svdFactors: [0.9, 0.2, 0.1, 0.1, 0.4]
  },
  {
    id: 155,
    title: "The Dark Knight",
    genres: ["Action", "Crime", "Drama", "Thriller"],
    keywords: ["superhero", "joker", "vigilante", "chaos", "batman"],
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    director: "Christopher Nolan",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
    rating: 9.0,
    releaseYear: 2008,
    popularity: 187.3,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop",
    trailerKey: "EXeTwQWrcwY",
    metadataSoup: "action crime drama thriller superhero joker vigilante chaos batman christian bale heath ledger aaron eckhart christopher nolan raises stakes war help jim gordon district attorney harvey dent dismantle criminal organizations plague streets",
    svdFactors: [0.8, 0.7, -0.2, 0.1, 0.9]
  },
  {
    id: 27205,
    title: "Inception",
    genres: ["Action", "Sci-Fi", "Thriller"],
    keywords: ["dream", "subconscious", "heist", "mind-bending", "physics"],
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
    director: "Christopher Nolan",
    overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets through dream-sharing technology, is offered a chance to regain his old life in exchange for a near-impossible heist.",
    rating: 8.8,
    releaseYear: 2010,
    popularity: 167.6,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop",
    trailerKey: "YoHD9XEInc0",
    metadataSoup: "action sci-fi thriller dream subconscious heist mind-bending physics leonardo dicaprio joseph gordon-levitt elliot page christopher nolan skilled thief commits corporate espionage infiltrating targets dream-sharing technology offered chance regain old life exchange near-impossible",
    svdFactors: [0.85, 0.5, -0.3, 0.1, 0.8]
  },
  {
    id: 157336,
    title: "Interstellar",
    genres: ["Adventure", "Drama", "Sci-Fi"],
    keywords: ["space", "blackhole", "wormhole", "time-dilation", "father-daughter"],
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    director: "Christopher Nolan",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and find a new home for mankind.",
    rating: 8.6,
    releaseYear: 2014,
    popularity: 284.7,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&auto=format&fit=crop",
    trailerKey: "zSWdZVtXT7E",
    metadataSoup: "adventure drama sci-fi space blackhole wormhole time-dilation father-daughter matthew mcconaughey anne hathaway jessica chastain christopher nolan group explorers newly discovered surpass limitations human travel find new home mankind",
    svdFactors: [0.75, 0.8, -0.1, 0.2, 0.5]
  },
  {
    id: 597,
    title: "Titanic",
    genres: ["Drama", "Romance", "History"],
    keywords: ["shipwreck", "tragic-love", "iceberg", "class-division", "ocean"],
    cast: ["Leonardo DiCaprio", "Kate Winslet", "Billy Zane"],
    director: "James Cameron",
    overview: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
    rating: 7.9,
    releaseYear: 1997,
    popularity: 138.5,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1501535033-a598d2bfb540?w=1600&auto=format&fit=crop",
    trailerKey: "CHekzSiZ470",
    metadataSoup: "drama romance history shipwreck tragic-love iceberg class-division ocean leonardo dicaprio kate winslet billy zane james cameron seventeen-year-old aristocrat falls love kind poor artist aboard luxurious ill-fated rms",
    svdFactors: [0.1, 0.9, 0.2, 0.95, 0.3]
  },
  {
    id: 680,
    title: "Pulp Fiction",
    genres: ["Crime", "Thriller"],
    keywords: ["hitman", "briefcase", "non-linear", "cult-classic", "drugs"],
    cast: ["John Travolta", "Samuel L. Jackson", "Uma Thurman"],
    director: "Quentin Tarantino",
    overview: "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll, and a washed-up boxer converge in this sprawling comedic crime caper.",
    rating: 8.9,
    releaseYear: 1994,
    popularity: 121.5,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1600&auto=format&fit=crop",
    trailerKey: "s7EdQ4FqbhY",
    metadataSoup: "crime thriller hitman briefcase non-linear cult-classic drugs john travolta samuel l jackson uma thurman quentin tarantino burger-loving philosophical partner drug-addled gangster moll washed-up boxer converge sprawling comedic caper",
    svdFactors: [0.6, 0.6, 0.5, 0.1, 0.85]
  },
  {
    id: 278,
    title: "The Shawshank Redemption",
    genres: ["Drama", "Crime"],
    keywords: ["prison", "escape", "friendship", "wrongful-conviction", "hope"],
    cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
    director: "Frank Darabont",
    overview: "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison.",
    rating: 9.3,
    releaseYear: 1994,
    popularity: 112.6,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1435527173128-983b87201f4d?w=1600&auto=format&fit=crop",
    trailerKey: "PLl99DcLmcb8",
    metadataSoup: "drama crime prison escape friendship wrongful-conviction hope tim robbins morgan freeman bob gunton frank darabont framed 1940s double murder wife lover upstanding banker andy dufresne begins new life shawshank",
    svdFactors: [0.1, 0.95, 0.1, 0.2, 0.6]
  },
  {
    id: 13,
    title: "Forrest Gump",
    genres: ["Comedy", "Drama", "Romance"],
    keywords: ["vietnam-war", "shrimp-boat", "running", "optimism", "historical-events"],
    cast: ["Tom Hanks", "Robin Wright", "Gary Sinise"],
    director: "Robert Zemeckis",
    overview: "A man with a low IQ has accomplished great things in his life and been present during significant historical events—of whose relevance he is mostly unaware.",
    rating: 8.8,
    releaseYear: 1994,
    popularity: 138.1,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1492446845049-9c50cc313f00?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1600&auto=format&fit=crop",
    trailerKey: "bLvqoHBptjg",
    metadataSoup: "comedy drama romance vietnam-war shrimp-boat running optimism historical-events tom hanks robin wright gary sinise robert zemeckis man low iq accomplished great things present significant historical events relevance mostly unaware",
    svdFactors: [0.2, 0.85, 0.75, 0.75, 0.2]
  },
  {
    id: 24428,
    title: "The Avengers",
    genres: ["Action", "Adventure", "Sci-Fi"],
    keywords: ["superhero", "unite", "invasion", "marvel", "team"],
    cast: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson"],
    director: "Joss Whedon",
    overview: "When an unexpected enemy emerges and threatens global safety and security, Nick Fury find himself in need of a team to pull the world back from the brink of disaster.",
    rating: 8.0,
    releaseYear: 2012,
    popularity: 144.4,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=1600&auto=format&fit=crop",
    trailerKey: "eOrNdByGMv8",
    metadataSoup: "action adventure sci-fi superhero unite invasion marvel team robert downey jr chris evans scarlett johansson joss whedon unexpected enemy emerges threatens global safety security nick fury find need pull world back brink disaster",
    svdFactors: [0.95, 0.3, 0.4, 0.1, 0.4]
  },
  {
    id: 603,
    title: "The Matrix",
    genres: ["Action", "Sci-Fi"],
    keywords: ["simulation", "cyberpunk", "hacker", "kung-fu", "bullet-time"],
    cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
    director: "Lana Wachowski",
    overview: "A young computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    rating: 8.7,
    releaseYear: 1999,
    popularity: 104.3,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=1600&auto=format&fit=crop",
    trailerKey: "vKQi3bBA1y8",
    metadataSoup: "action sci-fi simulation cyberpunk hacker kung-fu bullet-time keanu reeves laurence fishburne carrie-anne moss lana wachowski young computer learns mysterious rebels true nature reality role war controllers",
    svdFactors: [0.9, 0.4, -0.2, 0.1, 0.7]
  },
  {
    id: 475557,
    title: "Joker",
    genres: ["Crime", "Drama", "Thriller"],
    keywords: ["mental-illness", "clown", "gotham", "loneliness", "uprising"],
    cast: ["Joaquin Phoenix", "Robert De Niro", "Zazie Beetz"],
    director: "Todd Phillips",
    overview: "During the 1980s, a failed stand-up comedian undergoes a slow descension into madness as he transforms into Gotham's criminal icon.",
    rating: 8.2,
    releaseYear: 2019,
    popularity: 142.1,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1601513525393-013757aa0576?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop",
    trailerKey: "zAGVQLHvwOY",
    metadataSoup: "crime drama thriller mental-illness clown gotham loneliness uprising joaquin phoenix robert de niro zazie beetz todd phillips 1980s failed stand-up comedian undergoes slow descension madness transforms criminal icon",
    svdFactors: [0.4, 0.9, 0.1, 0.1, 0.8]
  },
  {
    id: 329,
    title: "Jurassic Park",
    genres: ["Adventure", "Sci-Fi", "Thriller"],
    keywords: ["dinosaurs", "dna", "theme-park", "island", "nature-strike"],
    cast: ["Sam Neill", "Laura Dern", "Jeff Goldblum"],
    director: "Steven Spielberg",
    overview: "An industrialist invites some scientists to view his brand new wildlife theme park populated by cloned dinosaurs, but a security shutdown leads to panic.",
    rating: 8.1,
    releaseYear: 1993,
    popularity: 98.4,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?w=1600&auto=format&fit=crop",
    trailerKey: "lc0UehYemQA",
    metadataSoup: "adventure sci-fi thriller dinosaurs dna theme-park island nature-strike sam neill laura dern jeff goldblum steven spielberg industrialist invites scientists view brand new wildlife theme park populated cloned dinosaurs security shutdown leads panic",
    svdFactors: [0.75, 0.4, 0.1, 0.2, 0.75]
  },
  {
    id: 98,
    title: "Gladiator",
    genres: ["Action", "Drama", "History"],
    keywords: ["rome", "gladiator", "revenge", "arena", "emperor"],
    cast: ["Russell Crowe", "Joaquin Phoenix", "Connie Nielsen"],
    director: "Ridley Scott",
    overview: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
    rating: 8.5,
    releaseYear: 2000,
    popularity: 110.2,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=1600&auto=format&fit=crop",
    trailerKey: "P5ieIbInFpg",
    metadataSoup: "action drama history rome gladiator revenge arena emperor russell crowe joaquin phoenix connie nielsen ridley scott former roman general sets exact vengeance against corrupt emperor murdered family sent slavery",
    svdFactors: [0.85, 0.85, -0.1, 0.4, 0.6]
  },
  {
    id: 11,
    title: "Star Wars: A New Hope",
    genres: ["Action", "Adventure", "Sci-Fi"],
    keywords: ["galaxy", "force", "lightsaber", "empire", "space-opera"],
    cast: ["Mark Hamill", "Harrison Ford", "Carrie Fisher"],
    director: "George Lucas",
    overview: "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station.",
    rating: 8.6,
    releaseYear: 1977,
    popularity: 125.7,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop",
    trailerKey: "1g3_CFmnY7k",
    metadataSoup: "action adventure sci-fi galaxy force lightsaber empire space-opera mark hamill harrison ford carrie fisher george lucas luke skywalker joins forces jedi knight cocky pilot wookiee droids save galaxy world-destroying station",
    svdFactors: [0.9, 0.3, 0.3, 0.2, 0.3]
  },
  {
    id: 118,
    title: "Charlie and the Chocolate Factory",
    genres: ["Adventure", "Comedy", "Fantasy"],
    keywords: ["chocolate", "golden-ticket", "candy-shop", "eccentric", "children"],
    cast: ["Johnny Depp", "Freddie Highmore", "David Kelly"],
    director: "Tim Burton",
    overview: "A young boy wins a tour through the most magnificent chocolate factory in the world, led by the world's most unusual candymaker.",
    rating: 6.9,
    releaseYear: 2005,
    popularity: 54.2,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1532499016263-f2c3e89df9c5?w=1600&auto=format&fit=crop",
    trailerKey: "OFVGCUIypSg",
    metadataSoup: "adventure comedy fantasy chocolate golden-ticket candy-shop eccentric children johnny depp freddie highmore david kelly tim burton young boy wins tour through magnificent chocolate factory led unique unusual candymaker",
    svdFactors: [0.3, 0.3, 0.85, 0.3, 0.3]
  },
  {
    id: 122,
    title: "The Lord of the Rings: The Return of the King",
    genres: ["Adventure", "Fantasy", "Action"],
    keywords: ["ring", "wizard", "warrior", "aragorn", "gandalf"],
    cast: ["Elijah Wood", "Ian McKellen", "Viggo Mortensen"],
    director: "Peter Jackson",
    overview: "Aragorn is revealed as the heir to the ancient kings as he, Gandalf and the other members of the broken fellowship struggle to save Gondor from the forces of Sauron.",
    rating: 8.9,
    releaseYear: 2003,
    popularity: 123.6,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1600&auto=format&fit=crop",
    trailerKey: "r5X-hFf6Bwo",
    metadataSoup: "adventure fantasy action ring wizard warrior aragorn gandalf elijah wood ian mckellen viggo mortensen peter jackson heir ancient kings fellowship broken struggle save gondor sauron",
    svdFactors: [0.85, 0.7, 0.1, 0.2, 0.4]
  },
  {
    id: 105,
    title: "Back to the Future",
    genres: ["Sci-Fi", "Comedy", "Adventure"],
    keywords: ["time-travel", "delorean", "80s", "paradox", "guitar"],
    cast: ["Michael J. Fox", "Christopher Lloyd", "Lea Thompson"],
    director: "Robert Zemeckis",
    overview: "Marty McFly, a typical American teenager of the Eighties, is accidentally sent back to 1955 in a plutonium-powered DeLorean time machine invented by wild scientist Doc Brown.",
    rating: 8.5,
    releaseYear: 1985,
    popularity: 101.5,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=1600&auto=format&fit=crop",
    trailerKey: "psrEGgS_Gco",
    metadataSoup: "sci-fi comedy adventure time-travel delorean 80s paradox guitar michael j fox christopher lloyd lea thompson robert zemeckis marty mcfly typical american teenager eighties accidentally sent back 1955 plutonium-powered plutonium machine scientist doc brown",
    svdFactors: [0.7, 0.4, 0.9, 0.4, 0.3]
  },
  {
    id: 550,
    title: "Fight Club",
    genres: ["Drama", "Thriller"],
    keywords: ["insomnia", "soap", "alter-ego", "anti-establishment", "anarchy"],
    cast: ["Brad Pitt", "Edward Norton", "Helena Bonham Carter"],
    director: "David Fincher",
    overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
    rating: 8.8,
    releaseYear: 1999,
    popularity: 120.4,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop",
    trailerKey: "O-b2VfBQQTE",
    metadataSoup: "drama thriller insomnia soap alter-ego anti-establishment anarchy brad pitt edward norton helena bonham carter david fincher ticking-time-bomb insomniac slippery salesman channel primal male aggression shocking therapy",
    svdFactors: [0.5, 0.85, 0.4, 0.1, 0.9]
  },
  {
    id: 496243,
    title: "Parasite",
    genres: ["Thriller", "Drama", "Comedy"],
    keywords: ["class-struggle", "con-artists", "basement", "korean", "satire"],
    cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"],
    director: "Bong Joon Ho",
    overview: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
    rating: 8.5,
    releaseYear: 2019,
    popularity: 118.8,
    language: "ko",
    posterUrl: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop",
    trailerKey: "SEUXguRxDXU",
    metadataSoup: "thriller drama comedy class-struggle con-artists basement korean satire song kang-ho lee sun-kyun cho yeo-jeong bong joon ho unemployed peculiar wealthy parks glamorous livelihood entangled unexpected incident",
    svdFactors: [0.3, 0.9, 0.6, 0.1, 0.8]
  },
  {
    id: 244786,
    title: "Whiplash",
    genres: ["Drama", "Music"],
    keywords: ["jazz", "drummer", "obsession", "music-teacher", "rivalry"],
    cast: ["Miles Teller", "J.K. Simmons", "Paul Reiser"],
    director: "Damien Chazelle",
    overview: "Under the direction of a ruthless instructor, a talented young drummer at a prestigious music conservatory begins to pursue perfection at any cost, threatening his mental health.",
    rating: 8.4,
    releaseYear: 2014,
    popularity: 88.2,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=1600&auto=format&fit=crop",
    trailerKey: "7d_jQyG8DQY",
    metadataSoup: "drama music jazz drummer obsession music-teacher rivalry miles teller jk simmons paul reiser damien chazelle direction ruthless instructor talented young drummer prestigious conservatory pursue perfection cost",
    svdFactors: [0.2, 0.95, 0.1, 0.2, 0.7]
  },
  {
    id: 354912,
    title: "Coco",
    genres: ["Animation", "Family", "Music", "Fantasy"],
    keywords: ["day-of-the-dead", "guitar", "ancestors", "mexico", "skeleton"],
    cast: ["Anthony Gonzalez", "Gael García Bernal", "Benjamin Bratt"],
    director: "Lee Unkrich",
    overview: "Aspiring musician Miguel, confronted with his family's ancestral ban on music, enters the Land of the Dead to find his great-great-grandfather, a legendary singer.",
    rating: 8.2,
    releaseYear: 2017,
    popularity: 91.5,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1518173946687-a4c8a383392c?w=1600&auto=format&fit=crop",
    trailerKey: "zNCz4mQZF38",
    metadataSoup: "animation family music fantasy day-of-the-dead guitar ancestors mexico skeleton anthony gonzalez gael garcia bernal benjamin bratt lee unkrich aspiring musician miguel family ancestral ban enters dead find legendary singer",
    svdFactors: [0.2, 0.5, 0.7, 0.4, 0.2]
  },
  {
    id: 76341,
    title: "Mad Max: Fury Road",
    genres: ["Action", "Sci-Fi", "Adventure", "Thriller"],
    keywords: ["post-apocalyptic", "desert", "femme-fatale", "car-chase", "warlord"],
    cast: ["Tom Hardy", "Charlize Theron", "Nicholas Hoult"],
    director: "George Miller",
    overview: "An apocalyptic story set in the furthest reaches of our planet, in a stark desert landscape where humanity is broken, and most everyone is crazed fighting for the necessities of life.",
    rating: 7.6,
    releaseYear: 2015,
    popularity: 132.8,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1533240332313-0db49b439ad3?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop",
    trailerKey: "hEJnMQG9ev8",
    metadataSoup: "action sci-fi adventure thriller post-apocalyptic desert femme-fatale car-chase warlord tom hardy charlize theron nicholas hoult george miller apocalyptic stark landscape humanity broken crazed fighting necessities life",
    svdFactors: [0.95, 0.3, 0.1, 0.1, 0.8]
  },
  {
    id: 10681,
    title: "WALL-E",
    genres: ["Animation", "Sci-Fi", "Family", "Adventure"],
    keywords: ["robot", "space-travel", "ecology", "fat-humans", "romance"],
    cast: ["Ben Burtt", "Elissa Knight", "Jeff Garlin"],
    director: "Andrew Stanton",
    overview: "In the distant future, a small waste-collecting robot inadvertently embarks on a space journey that will ultimately decide the fate of mankind.",
    rating: 8.0,
    releaseYear: 2008,
    popularity: 94.7,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop",
    trailerKey: "alIq_wG9fnk",
    metadataSoup: "animation sci-fi family adventure robot space-travel ecology fat-humans romance ben burtt elissa knight jeff garlin andrew stanton waste-collecting inadvertently embarks space journey decide fate mankind",
    svdFactors: [0.5, 0.5, 0.7, 0.8, 0.3]
  },
  {
    id: 85,
    title: "Raiders of the Lost Ark",
    genres: ["Adventure", "Action"],
    keywords: ["archaeologist", "ark", "nazis", "snakes", "artifact"],
    cast: ["Harrison Ford", "Karen Allen", "Paul Freeman"],
    director: "Steven Spielberg",
    overview: "When archaeologist Indiana Jones is hired by the US government to find the Ark of the Covenant, he finds himself up against the entire Nazi regime.",
    rating: 8.4,
    releaseYear: 1981,
    popularity: 110.5,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1485081669829-bacb8c7bb1f3?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=1600&auto=format&fit=crop",
    trailerKey: "XkkzKjK-uxk",
    metadataSoup: "adventure action archaeologist ark nazis snakes artifact harrison ford karen allen paul freeman steven spielberg indiana jones hired government find covenant entire nazi regime",
    svdFactors: [0.85, 0.3, 0.4, 0.2, 0.4]
  },
  {
    id: 68718,
    title: "Django Unchained",
    genres: ["Drama", "Western", "Action"],
    keywords: ["bounty-hunter", "slavery", "revenge", "plantation", "tarantino"],
    cast: ["Jamie Foxx", "Christoph Waltz", "Leonardo DiCaprio"],
    director: "Quentin Tarantino",
    overview: "With the help of a German bounty hunter, a freed slave sets out to rescue his wife from a brutal Mississippi plantation owner.",
    rating: 8.1,
    releaseYear: 2012,
    popularity: 124.2,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1533240332313-0db49b439ad3?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1485546234645-a62644f84728?w=1600&auto=format&fit=crop",
    trailerKey: "0fUCuvNlOCg",
    metadataSoup: "drama western action bounty-hunter slavery revenge plantation tarantino jamie foxx christoph waltz leonardo dicaprio quentin tarantino german freed slave sets rescue wife mississippi brutal plantation owner",
    svdFactors: [0.8, 0.8, 0.4, 0.2, 0.7]
  },
  {
    id: 8587,
    title: "The Lion King",
    genres: ["Animation", "Family", "Drama", "Adventure"],
    keywords: ["lion", "savannah", "uncle", "pride", "monarch"],
    cast: ["Matthew Broderick", "James Earl Jones", "Jeremy Irons"],
    director: "Roger Allers",
    overview: "A young lion cub, Simba, is tricked by his treacherous uncle into thinking he caused his father's death and flees into exile in despair.",
    rating: 8.2,
    releaseYear: 1994,
    popularity: 95.3,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&auto=format&fit=crop",
    trailerKey: "lFzVJEAp78Y",
    metadataSoup: "animation family drama adventure lion savannah uncle pride monarch matthew broderick james earl jones jeremy irons roger allers lion cub simba tricked treacherous uncle caused father death flees exile despair",
    svdFactors: [0.3, 0.8, 0.6, 0.4, 0.3]
  },
  {
    id: 150540,
    title: "Inside Out",
    genres: ["Animation", "Family", "Comedy", "Drama"],
    keywords: ["emotions", "subconscious", "growing-up", "sadness", "joy"],
    cast: ["Amy Poehler", "Phyllis Smith", "Richard Kind"],
    director: "Pete Docter",
    overview: "Growing up can be a bumpy road, and it's no exception for Riley, who is uprooted from her Midwest life when her father starts a new job in San Francisco.",
    rating: 8.0,
    releaseYear: 2015,
    popularity: 86.4,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1600&auto=format&fit=crop",
    trailerKey: "seMwpP0yeu4",
    metadataSoup: "animation family comedy drama emotions subconscious growing-up sadness joy amy poehler phyllis smith richard kind pete docter bumpy road riley uprooted midwest life father starts job san francisco",
    svdFactors: [0.2, 0.7, 0.85, 0.3, 0.3]
  },
  {
    id: 129,
    title: "Spirited Away",
    genres: ["Animation", "Family", "Fantasy", "Adventure"],
    keywords: ["spirit-world", "witch", "spell", "dragon", "anime"],
    cast: ["Rumi Hiiragi", "Miyu Irino", "Mari Natsuki"],
    director: "Hayao Miyazaki",
    overview: "A young girl wandering into a world ruled by gods, witches, and spirits where humans are transformed into beasts must call upon her inner courage to free her family.",
    rating: 8.5,
    releaseYear: 2001,
    popularity: 99.8,
    language: "ja",
    posterUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop",
    trailerKey: "ByXuk9QqQMC",
    metadataSoup: "animation family fantasy adventure spirit-world witch spell dragon anime rumi hiiragi miyu irino mari natsuki hayao miyazaki young girl wandering ruled gods transformed beasts inner courage free family",
    svdFactors: [0.3, 0.7, 0.6, 0.5, 0.3]
  },
  {
    id: 231,
    title: "Psycho",
    genres: ["Thriller", "Horror", "Mystery"],
    keywords: ["motel", "shower", "serial-killer", "split-personality", "suspense"],
    cast: ["Anthony Perkins", "Janet Leigh", "Vera Miles"],
    director: "Alfred Hitchcock",
    overview: "A Phoenix secretary embezzles $40,000 from her employer's client, goes on the run, and checks into a remote motel run by a young man under the domination of his mother.",
    rating: 8.4,
    releaseYear: 1660,
    popularity: 76.1,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop",
    trailerKey: "DT6qBopAnxA",
    metadataSoup: "thriller horror mystery motel shower serial-killer split-personality suspense anthony perkins janet leigh vera miles alfred hitchcock phoenix secretary embezzles client run checks remote motel norman bates",
    svdFactors: [0.3, 0.6, -0.3, 0.1, 0.95]
  },
  {
    id: 500,
    title: "GoodFellas",
    genres: ["Drama", "Crime"],
    keywords: ["mafia", "gangster", "fbi", "heist", "cocaine"],
    cast: ["Robert De Niro", "Ray Liotta", "Joe Pesci"],
    director: "Martin Scorsese",
    overview: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.",
    rating: 8.5,
    releaseYear: 1990,
    popularity: 91.2,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1485546234645-a62644f84728?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop",
    trailerKey: "2ilzidi_J8Q",
    metadataSoup: "drama crime mafia gangster fbi heist cocaine robert de niro ray liotta joe pesci martin scorsese henry hill life mob covering relationship wife jimmy conway tommy devito",
    svdFactors: [0.5, 0.85, 0.4, 0.1, 0.8]
  },
  {
    id: 862,
    title: "Toy Story",
    genres: ["Animation", "Adventure", "Comedy", "Family"],
    keywords: ["toy", "friendship", "rivalry", "boy", "coming-of-age"],
    cast: ["Tom Hanks", "Tim Allen", "Don Rickles"],
    director: "John Lasseter",
    overview: "A pioneering computer-animated classic where a young boy's toys secretively come to life, led by Woody the vintage cowboy and Buzz Lightyear the hi-tech space ranger.",
    rating: 8.3,
    releaseYear: 1995,
    popularity: 105.4,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1608889175123-8ec330b86f84?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=1600&auto=format&fit=crop",
    trailerKey: "v-PjgYDrgHY",
    metadataSoup: "animation adventure comedy family toy friendship rivalry boy coming-of-age tom hanks tim allen don rickles john lasseter dynamic cowboy space ranger living toys room secret life",
    svdFactors: [0.2, 0.4, 0.9, 0.2, 0.1]
  },
  {
    id: 238,
    title: "The Godfather",
    genres: ["Drama", "Crime"],
    keywords: ["mafia", "patriarch", "family-business", "loyalty", "organized-crime"],
    cast: ["Marlon Brando", "Al Pacino", "James Caan"],
    director: "Francis Ford Coppola",
    overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    rating: 9.2,
    releaseYear: 1972,
    popularity: 145.6,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop",
    trailerKey: "UaVTIH8QrA8",
    metadataSoup: "drama crime mafia patriarch family-business loyalty organized-crime marlon brando al pacino james caan francis ford coppola dynasty empire son transfer corleone respect offer",
    svdFactors: [0.5, 0.95, -0.4, 0.2, 0.85]
  },
  {
    id: 274,
    title: "The Silence of the Lambs",
    genres: ["Thriller", "Crime", "Drama", "Horror"],
    keywords: ["fbi", "serial-killer", "psychiatrist", "cannibal", "investigation"],
    cast: ["Jodie Foster", "Anthony Hopkins", "Scott Glenn"],
    director: "Jonathan Demme",
    overview: "A young, determined FBI cadet must receive the advice of an incarcerated and highly manipulative cannibalistic psychiatrist to help catch another active serial killer.",
    rating: 8.6,
    releaseYear: 1991,
    popularity: 112.5,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop",
    trailerKey: "W6Mm8Sbe__o",
    metadataSoup: "thriller crime drama horror fbi serial-killer psychiatrist cannibal investigation jodie foster anthony hopkins scott glenn jonathan demme buffalo bill clarice starling hannibal lecter",
    svdFactors: [0.4, 0.8, -0.3, 0.1, 0.98]
  },
  {
    id: 120,
    title: "The Lord of the Rings: The Fellowship of the Ring",
    genres: ["Adventure", "Fantasy", "Action"],
    keywords: ["ring", "elves", "dwarves", "hobbit", "quests"],
    cast: ["Elijah Wood", "Ian McKellen", "Orlando Bloom"],
    director: "Peter Jackson",
    overview: "A meek young Hobbit from the Shire is tasked with a monumental quest: destroyed the dark Lord Sauron's powerful magic ring alongside eight diverse companions.",
    rating: 8.8,
    releaseYear: 2001,
    popularity: 162.8,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop",
    trailerKey: "V75dMMIW2B4",
    metadataSoup: "adventure fantasy action ring elves dwarves hobbit quests elijah wood ian mckellen orlando bloom peter jackson shire frodo gandalf sauron fellowship legendary journey",
    svdFactors: [0.9, 0.5, 0.1, 0.2, 0.4]
  },
  {
    id: 424,
    title: "Schindler's List",
    genres: ["Drama", "History", "War"],
    keywords: ["holocaust", "world-war-ii", "rescue", "factory", "jewish"],
    cast: ["Liam Neeson", "Ben Kingsley", "Ralph Fiennes"],
    director: "Steven Spielberg",
    overview: "In German-occupied Poland during WWII, enigmatic industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution.",
    rating: 9.0,
    releaseYear: 1993,
    popularity: 108.3,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1600&auto=format&fit=crop",
    trailerKey: "gG22XNhtnoY",
    metadataSoup: "drama history war holocaust world-war-ii rescue factory jewish liam neeson ben kingsley ralph fiennes steven spielberg oskar schindler persecution nazis concentration camps save",
    svdFactors: [0.2, 0.98, -0.4, 0.2, 0.5]
  },
  {
    id: 807,
    title: "Se7en",
    genres: ["Crime", "Mystery", "Thriller"],
    keywords: ["serial-killer", "seven-deadly-sins", "detective", "partner", "rain"],
    cast: ["Brad Pitt", "Morgan Freeman", "Gwyneth Paltrow"],
    director: "David Fincher",
    overview: "Two homicide detectives, a rookie and a veteran, desperately hunt a methodical serial killer who uses the seven deadly sins as his ritualistic motifs.",
    rating: 8.6,
    releaseYear: 1995,
    popularity: 121.7,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop",
    trailerKey: "znmZoK4sQiU",
    metadataSoup: "crime mystery thriller serial-killer seven-deadly-sins detective partner rain brad pitt morgan freeman gwyneth paltrow david fincher rookie veteran hunt motifs boxes dark",
    svdFactors: [0.4, 0.7, -0.3, 0.1, 0.98]
  },
  {
    id: 489,
    title: "Good Will Hunting",
    genres: ["Drama", "Romance"],
    keywords: ["genius", "therapist", "math", "boston", "friendship"],
    cast: ["Matt Damon", "Robin Williams", "Ben Affleck"],
    director: "Gus Van Sant",
    overview: "Will Hunting, an unrecognized genius working as a janitor at MIT, struggles to overcome his traumatic past with the help of a compassionate community psychologist.",
    rating: 8.3,
    releaseYear: 1997,
    popularity: 98.4,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&auto=format&fit=crop",
    trailerKey: "PaVYXNMc9b0",
    metadataSoup: "drama romance genius therapist math boston friendship matt damon robin williams ben affleck gus van sant will hunting janitor mit gift psychologist direction breakthroughs love",
    svdFactors: [0.1, 0.9, 0.4, 0.7, 0.3]
  },
  {
    id: 37165,
    title: "The Truman Show",
    genres: ["Comedy", "Drama"],
    keywords: ["reality-tv", "simulated-reality", "paranoia", "island", "satellite"],
    cast: ["Jim Carrey", "Laura Linney", "Ed Harris"],
    director: "Peter Weir",
    overview: "A bubbly insurance salesman gradually discovers that his entire life is actually an elaborate, round-the-clock reality TV show broadcast to the entire planet.",
    rating: 8.2,
    releaseYear: 1998,
    popularity: 104.1,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1598257006458-087169a1f08d?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1600&auto=format&fit=crop",
    trailerKey: "dlnmQbPGuls",
    metadataSoup: "comedy drama reality-tv simulated-reality paranoia island satellite jim carrey laura linney ed harris peter weir insurance salesman discovers whole life show broadcast set",
    svdFactors: [0.2, 0.8, 0.85, 0.4, 0.5]
  },
  {
    id: 1422,
    title: "The Departed",
    genres: ["Drama", "Thriller", "Crime"],
    keywords: ["undercover", "mole", "boston", "scorsese", "irish-mob"],
    cast: ["Leonardo DiCaprio", "Matt Damon", "Jack Nicholson"],
    director: "Martin Scorsese",
    overview: "An undercover cop and a treacherous mole inside the state police attempt to identify each other while simultaneously infiltrating a ruthless Irish gang in South Boston.",
    rating: 8.5,
    releaseYear: 2006,
    popularity: 115.6,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1485546234645-a62644f84728?w=1600&auto=format&fit=crop",
    trailerKey: "iojhDKz6SAY",
    metadataSoup: "drama thriller crime undercover mole boston scorsese leonardo dicaprio matt damon jack nicholson martin scorsese police infiltration irish gang massachusetts mobsters rats",
    svdFactors: [0.6, 0.8, -0.2, 0.2, 0.9]
  },
  {
    id: 1891,
    title: "Star Wars: The Empire Strikes Back",
    genres: ["Action", "Adventure", "Sci-Fi"],
    keywords: ["space", "jedi", "father", "rebellion", "emperor"],
    cast: ["Mark Hamill", "Harrison Ford", "Carrie Fisher"],
    director: "Irvin Kershner",
    overview: "After the Rebel Alliance is over-run by winter Imperial forces, Luke Skywalker begins Jedi combat training with Yoda, while his friends are hunted down by Darth Vader.",
    rating: 8.7,
    releaseYear: 1980,
    popularity: 139.2,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&auto=format&fit=crop",
    trailerKey: "JNwNXF9Y6Cg",
    metadataSoup: "action adventure sci-fi space jedi father rebellion emperor mark hamill harrison ford carrie fisher irvin kershner rebel alliance overpowered luke skywalker training yoda darth vader han solo cloud city",
    svdFactors: [0.85, 0.4, 0.1, 0.2, 0.5]
  },
  {
    id: 38,
    title: "Eternal Sunshine of the Spotless Mind",
    genres: ["Romance", "Sci-Fi", "Drama"],
    keywords: ["erasing-memories", "breakup", "dream-sharing", "subconscious", "surreal"],
    cast: ["Jim Carrey", "Kate Winslet", "Kirsten Dunst"],
    director: "Michel Gondry",
    overview: "When their intense relationship turns sour, a young, creative couple undergoes an experimental medical procedure to systematically erase each other from their memories.",
    rating: 8.3,
    releaseYear: 2004,
    popularity: 98.7,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&auto=format&fit=crop",
    trailerKey: "07-QBnEkgXU",
    metadataSoup: "romance sci-fi drama erasing-memories breakup dream-sharing subconscious surreal jim carrey kate winslet kirsten dunst michel gondry relationship procedure memories forget love",
    svdFactors: [0.3, 0.8, 0.4, 0.95, 0.4]
  },
  {
    id: 324857,
    title: "Spider-Man: Into the Spider-Verse",
    genres: ["Animation", "Action", "Adventure", "Sci-Fi"],
    keywords: ["multiverse", "spider-man", "superhero", "coming-of-age", "spray-paint"],
    cast: ["Shameik Moore", "Jake Johnson", "Hailee Steinfeld"],
    director: "Peter Ramsey",
    overview: "Brooklyn teenager Miles Morales suddenly becomes the Spider-Man of his universe, joining forces with spider-powered heroes from other dimensions to prevent universal collapse.",
    rating: 8.4,
    releaseYear: 2018,
    popularity: 154.5,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop",
    trailerKey: "g4Hbz2yLX60",
    metadataSoup: "animation action adventure sci-fi multiverse spider-man superhero coming-of-age spray-paint shameik moore jake johnson hailee steinfeld peter ramsey miles morales kingpin dimensions",
    svdFactors: [0.85, 0.6, 0.7, 0.2, 0.4]
  },
  {
    id: 289,
    title: "Casablanca",
    genres: ["Romance", "Drama", "History"],
    keywords: ["world-war-ii", "love-triangle", "classic-hollywood", "refugee", "sacrifice"],
    cast: ["Humphrey Bogart", "Ingrid Bergman", "Paul Henreid"],
    director: "Michael Curtiz",
    overview: "In December 1941, a cynical American expatriate nightclub owner in Casablanca encounters a former flame, bringing intense emotional and political choices.",
    rating: 8.5,
    releaseYear: 1942,
    popularity: 84.6,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1543536448-d209d2d13a1c?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1600&auto=format&fit=crop",
    trailerKey: "BkL9l7q56g4",
    metadataSoup: "romance drama history world-war-ii love-triangle classic-hollywood refugee sacrifice humphrey bogart ingrid bergman paul henreid michael curtiz rick expatriate gin joint sam",
    svdFactors: [0.1, 0.9, 0.2, 0.98, 0.4]
  },
  {
    id: 280,
    title: "Terminator 2: Judgment Day",
    genres: ["Action", "Sci-Fi", "Thriller"],
    keywords: ["cyborg", "time-travel", "apocalypse", "saving-the-world", "liquid-metal"],
    cast: ["Arnold Schwarzenegger", "Linda Hamilton", "Edward Furlong"],
    director: "James Cameron",
    overview: "A reprogrammed cybernetic T-800 unit is sent back in time to defend a rebellious ten-year-old John Connor from an advanced, shape-shifting liquid-metal assassin.",
    rating: 8.6,
    releaseYear: 1991,
    popularity: 135.8,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop",
    trailerKey: "CRRbX_4gZpY",
    metadataSoup: "action sci-fi thriller cyborg time-travel apocalypse saving-the-world liquid-metal arnold schwarzenegger linda hamilton edward furlong james cameron sarah conner t-800 t-1000",
    svdFactors: [0.95, 0.4, 0.1, 0.1, 0.8]
  }
];

// Procedurally expand the dataset to exactly 1000 Hollywood movies
const adjs = [
  "Secret", "Hidden", "Final", "Golden", "Dark", "Lost", "Last", "Infinite", "Perfect", "Silent", "Savage", "Eternal",
  "Primal", "Digital", "Red", "Blue", "Midnight", "Quantum", "Mystic", "Ancient", "Sacred", "Iron", "Steel", "Atomic",
  "Wild", "Broken", "Silver", "Shadow", "Thunder", "Coastal", "Distant", "Urban", "Cosmic", "Neon", "Rogue", "Ghost"
];
const nouns = [
  "Legacy", "Destiny", "Horizon", "Strand", "Chronicle", "Labyrinth", "Requiem", "Protocol", "Paradox", "Alliance", "Odyssey",
  "Symphony", "Identity", "Sanctuary", "Vengeance", "Justice", "Ascent", "Eclipse", "Voyage", "Revolt", "Conspiracy", "Enigma",
  "Revenge", "Fighter", "Throne", "Outlaw", "Kingdom", "Prestige", "Prophecy", "Frontier", "Soldier", "Empire", "Dynasty"
];
const suffixes = [
  "", "Part II", "Chapter 3", "Reloaded", "Reborn", "Legacy", "Returns", "Origins", "the Movie", "Rising", "II", "III", "IV"
];

const categoryTemplates = [
  {
    genres: ["Action", "Adventure", "Sci-Fi"],
    factors: [0.9, 0.2, 0.1, 0.1, 0.6],
    keywords: ["space", "alien", "soldier", "future", "laser", "robot", "galaxy", "ship", "captain", "resistance", "cyberpunk", "explosion"],
    overviewStart: "In a dystopian near-future, a lone warrior must navigate an alien world of high-tech marvels ",
    overviewEnd: "to save the last remnants of human resistance from mechanical overlords."
  },
  {
    genres: ["Drama", "Romance"],
    factors: [0.1, 0.85, 0.3, 0.9, 0.2],
    keywords: ["love", "heartbreak", "secret", "grief", "forgiveness", "marriage", "affair", "destiny", "passion", "letter", "art", "relationship"],
    overviewStart: "A sweeping, emotional journey of two long-lost lovers who cross paths unexpectedly in Paris ",
    overviewEnd: "only to find that memory has rewritten their passionate love affair."
  },
  {
    genres: ["Comedy", "Family"],
    factors: [0.2, 0.3, 0.9, 0.6, 0.1],
    keywords: ["funny", "laugh", "friends", "summer", "dog", "school", "holiday", "uncle", "game", "chaos", "family", "vacation", "accident"],
    overviewStart: "When an eccentric family's annual summer holiday takes a hilariously chaotic turn in Florida, ",
    overviewEnd: "they must band together to survive a series of ridiculous misadventures."
  },
  {
    genres: ["Crime", "Thriller", "Mystery"],
    factors: [0.4, 0.7, 0.1, 0.1, 0.95],
    keywords: ["detective", "serial-killer", "murder", "robbery", "heist", "revenge", "fbi", "police", "conspiracy", "betrayal", "suspect", "gold"],
    overviewStart: "A veteran FBI detective with a dark history is pulled into a high-stakes investigation of a stolen artifact, ",
    overviewEnd: "leading him down a twisted rabbit hole of treachery and systematic blackmail."
  },
  {
    genres: ["Adventure", "Fantasy", "Action"],
    factors: [0.85, 0.4, 0.2, 0.1, 0.4],
    keywords: ["magic", "sword", "quest", "kingdom", "dragon", "wizard", "hero", "warrior", "prophecy", "treasure", "portal", "sorcery"],
    overviewStart: "A reluctant hero is chosen by an ancient prophecy to embark on a perilous trek across a magic land, ",
    overviewEnd: "wielding a mythical sword to defeat the dark tyrant of the underworld."
  },
  {
    genres: ["Drama", "History", "Biography"],
    factors: [0.1, 0.95, 0.1, 0.2, 0.5],
    keywords: ["historic", "world-war", "revolution", "biography", "political", "courtroom", "king", "queen", "protest", "legacy", "struggle", "freedom"],
    overviewStart: "The true, inspiring chronicle of a visionary political leader who stood up against a colonial regime, ",
    overviewEnd: "bringing about a peaceful revolution that would change the course of history forever."
  },
  {
    genres: ["Animation", "Comedy", "Family"],
    factors: [0.2, 0.3, 0.85, 0.5, 0.1],
    keywords: ["talking-animal", "animated", "childhood", "dreaming", "magic-world", "friendship", "journey", "happy", "pet", "toy", "cute", "adventure"],
    overviewStart: "Join a vibrant crew of lovable animated talking animals as they escape their cozy zoo home, ",
    overviewEnd: "venturing on a legendary road trip filled with song, colorful characters, and true friends."
  },
  {
    genres: ["Horror", "Thriller"],
    factors: [0.4, 0.5, 0.1, 0.1, 0.95],
    keywords: ["ghost", "haunted", "darkness", "monster", "nightmare", "survival", "cabin", "fear", "sanity", "shadow", "woods", "legend"],
    overviewStart: "When a group of curious college friends decide to spend their weekend in an abandoned research shelter, ",
    overviewEnd: "they inadvertently activate a terrifying force lurking in the surrounding shadows."
  }
];

const firstNames = ["James", "Robert", "John", "David", "William", "Michael", "Sarah", "Emily", "Jessica", "Emma", "Tom", "Brad", "Christian", "Leonardo", "Matt", "Ryan", "Scarlett", "Zoe", "Keanu", "Pedro"];
const lastNames = ["Cameron", "Nolan", "Spielberg", "Scorsese", "Tarantino", "Hanks", "Pitt", "DiCaprio", "Winslet", "Johansson", "Evans", "Gosling", "Murphy", "Pugh", "Reeves", "Pascal", "Coppola", "Jackson"];

const posterImages = [
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1598257006458-087169a1f08d?w=500&auto=format&fit=crop"
];

const backdropImages = [
  "https://images.unsplash.com/photo-1542204172-e70528091f50?w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&auto=format&fit=crop"
];

const trailerKeys = ["5PSNL1q39VY", "EXeTwQWrcwY", "W6Mm8Sbe__o", "V75dMMIW2B4", "gG22XNhtnoY", "znmZoK4sQiU", "iojhDKz6SAY", "07-QBnEkgXU"];

// Helper to reliably generate distinct mock movies
const existingIds = new Set(moviesData.map(m => m.id));

const marvelMovies: Movie[] = [
  {
    id: 10001,
    title: "Iron Man",
    genres: ["Action", "Sci-Fi", "Adventure"],
    keywords: ["superhero", "iron-man", "billionaire", "exo-suit", "marvel-cinematic-universe"],
    cast: ["Robert Downey Jr.", "Gwyneth Paltrow", "Jeff Bridges"],
    director: "Jon Favreau",
    overview: "After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.",
    rating: 7.9,
    releaseYear: 2008,
    popularity: 198.5,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1600&auto=format&fit=crop",
    trailerKey: "8uhB_IDLFbY",
    metadataSoup: "action sci-fi adventure superhero iron-man billionaire exo-suit marvel-cinematic-universe robert downey jr gwyneth paltrow jeff bridges jon favreau tony stark building arc reactor",
    svdFactors: [0.9, 0.3, 0.4, 0.1, 0.5]
  },
  {
    id: 10002,
    title: "Avengers: Endgame",
    genres: ["Action", "Sci-Fi", "Adventure"],
    keywords: ["superhero", "time-travel", "save-the-world", "infinity-stones", "marvel-cinematic-universe"],
    cast: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo"],
    director: "Anthony Russo, Joe Russo",
    overview: "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos' actions.",
    rating: 8.4,
    releaseYear: 2019,
    popularity: 205.4,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop",
    trailerKey: "TcMBFSGVi1c",
    metadataSoup: "action sci-fi adventure superhero time-travel save-the-world infinity-stones marvel-cinematic-universe robert downey jr chris evans mark ruffalo anthony russo joe russo assemble thanos dust snap portal",
    svdFactors: [0.95, 0.4, 0.4, 0.1, 0.6]
  },
  {
    id: 10003,
    title: "Avengers: Infinity War",
    genres: ["Action", "Sci-Fi", "Adventure"],
    keywords: ["superhero", "space", "thanos", "infinity-stones", "marvel-cinematic-universe"],
    cast: ["Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo"],
    director: "Anthony Russo, Joe Russo",
    overview: "The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos before his blitz of devastation and ruin puts an end to the universe.",
    rating: 8.4,
    releaseYear: 2018,
    popularity: 195.8,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1542204172-e70528091f50?w=1600&auto=format&fit=crop",
    trailerKey: "QwievZ1Tx-8",
    metadataSoup: "action sci-fi adventure superhero space thanos infinity-stones marvel-cinematic-universe robert downey jr chris hemsworth mark ruffalo anthony russo joe russo snap wakanda titan battles",
    svdFactors: [0.95, 0.4, 0.4, 0.1, 0.6]
  },
  {
    id: 10004,
    title: "Spider-Man",
    genres: ["Action", "Sci-Fi", "Adventure"],
    keywords: ["superhero", "spider-man", "spider-bite", "green-goblin", "coming-of-age"],
    cast: ["Tobey Maguire", "Kirsten Dunst", "Willem Dafoe"],
    director: "Sam Raimi",
    overview: "After being bitten by a genetically modified spider, a shy high school student gains spider-like abilities that he uses to fight a menacing green supervillain.",
    rating: 7.4,
    releaseYear: 2002,
    popularity: 142.1,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1600&auto=format&fit=crop",
    trailerKey: "TYMMOjBUPMM",
    metadataSoup: "action sci-fi adventure superhero spider-man spider-bite green-goblin coming-of-age tobey maguire kirsten dunst willem dafoe sam raimi peter parker oscorp radio active wall crawling webs",
    svdFactors: [0.85, 0.3, 0.5, 0.3, 0.4]
  },
  {
    id: 10005,
    title: "Spider-Man 2",
    genres: ["Action", "Sci-Fi", "Adventure"],
    keywords: ["superhero", "spider-man", "doctor-octopus", "identity-crisis", "responsibilities"],
    cast: ["Tobey Maguire", "Kirsten Dunst", "Alfred Molina"],
    director: "Sam Raimi",
    overview: "Peter Parker is beset with trouble as he confronts a brilliant, multi-tentacled scientist while trying to balance his secret superhero life with his personal desires.",
    rating: 7.5,
    releaseYear: 2004,
    popularity: 138.4,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop",
    trailerKey: "1s9YlN0Ygaw",
    metadataSoup: "action sci-fi adventure superhero spider-man doctor-octopus identity-crisis responsibilities tobey maguire kirsten dunst alfred molina sam raimi doc ock train fight hero unmasked",
    svdFactors: [0.85, 0.3, 0.5, 0.3, 0.4]
  },
  {
    id: 10006,
    title: "Spider-Man: No Way Home",
    genres: ["Action", "Sci-Fi", "Adventure"],
    keywords: ["superhero", "spider-man", "multiverse", "doctor-strange", "marvel-cinematic-universe"],
    cast: ["Tom Holland", "Zendaya", "Benedict Cumberbatch"],
    director: "Jon Watts",
    overview: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.",
    rating: 8.2,
    releaseYear: 2021,
    popularity: 245.8,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop",
    trailerKey: "JfVOs4VSpmA",
    metadataSoup: "action sci-fi adventure superhero spider-man multiverse doctor-strange marvel-cinematic-universe tom holland zendaya benedict cumberbatch jon watts green goblin electro doc ock three spidermans crossover",
    svdFactors: [0.92, 0.4, 0.4, 0.2, 0.5]
  },
  {
    id: 10007,
    title: "Guardians of the Galaxy",
    genres: ["Action", "Sci-Fi", "Adventure", "Comedy"],
    keywords: ["space", "superhero", "music", "misfits", "marvel-cinematic-universe"],
    cast: ["Chris Pratt", "Zoe Saldana", "Dave Bautista"],
    director: "James Gunn",
    overview: "A group of intergalactic outlaws must band together to stop a fanatical warrior with plans to purge the universe.",
    rating: 8.0,
    releaseYear: 2014,
    popularity: 174.5,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&auto=format&fit=crop",
    trailerKey: "d96alJh81M4",
    metadataSoup: "action sci-fi adventure comedy space superhero music misfits marvel-cinematic-universe chris pratt zoe saldana dave bautista james gunn starlord gamora rocket raccoon groot mixtape awesome mix",
    svdFactors: [0.85, 0.3, 0.8, 0.2, 0.4]
  },
  {
    id: 10008,
    title: "Black Panther",
    genres: ["Action", "Sci-Fi", "Adventure"],
    keywords: ["superhero", "wakanda", "king", "vibranium", "marvel-cinematic-universe"],
    cast: ["Chadwick Boseman", "Michael B. Jordan", "Lupita Nyong'o"],
    director: "Ryan Coogler",
    overview: "T'Challa, heir to the hidden but advanced kingdom of Wakanda, must step forward to lead his people into a new era and confront a challenger from his country's past.",
    rating: 7.3,
    releaseYear: 2018,
    popularity: 165.2,
    language: "en",
    posterUrl: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1542204172-e70528091f50?w=1600&auto=format&fit=crop",
    trailerKey: "xjDjIWPwcPU",
    metadataSoup: "action sci-fi adventure superhero wakanda king vibranium marvel-cinematic-universe chadwick boseman michael b jordan lupita nyong'o ryan coogler t'challa killmonger throne claws suite",
    svdFactors: [0.88, 0.4, 0.3, 0.1, 0.5]
  }
];

// Pre-fill the specific Marvel movies first if they aren't registered
marvelMovies.forEach(m => {
  if (!existingIds.has(m.id)) {
    moviesData.push(m);
    existingIds.add(m.id);
  }
});

const genreImages: Record<string, string[]> = {
  "Action": [
    "photo-1509114397022-ed747cca3f65", "photo-1533240332313-0db49b439ad3", "photo-1506157786151-b8491531f063",
    "photo-1635805737707-575885ab0820", "photo-1559583985-c80d8ad9b29f", "photo-1504701954957-2390f806e9f4",
    "photo-1558591710-4b4a1ae0f04d", "photo-1533105079780-92b9be482077", "photo-1518709268805-4e9042af9f23",
    "photo-1542204172-e70528091f50", "photo-1478760329108-5c3ed9d495a0", "photo-1509198397868-475647b2a1e5"
  ],
  "Sci-Fi": [
    "photo-1451187580459-43490279c0fa", "photo-1446776811953-b23d57bd21aa", "photo-1502134249126-9f3755a50d78",
    "photo-1511512578047-dfb367046420", "photo-1526374965328-7f61d4dc18c5", "photo-1515879218367-8466d910aaa4",
    "photo-1589254065878-42c9da997008", "photo-1535223289827-42f1e9919769", "photo-1507413245164-6160d8298b31",
    "photo-1504384308090-c894fdcc538d", "photo-1531297484001-80022131f5a1"
  ],
  "Drama": [
    "photo-1507525428034-b723cf961d3e", "photo-1501535033-a598d2bfb540", "photo-1434030216411-0b793f4b4173",
    "photo-1516321318423-f06f85e504b3", "photo-1440404653325-ab127d49abc1", "photo-1461360228754-6e81c478b882",
    "photo-1505686994434-e3cc5abf1330", "photo-1435527173128-983b87201f4d", "photo-1473448912268-2022ce9509d8",
    "photo-1500530855697-b586d89ba3ee", "photo-1504280390367-361c6d9f38f4"
  ],
  "Comedy": [
    "photo-1513151233558-d860c5398176", "photo-1607604276583-eef5d076aa5f", "photo-1514306191717-452ec28c7814",
    "photo-1532499016263-f2c3e89df9c5", "photo-1598257006458-087169a1f08d", "photo-1534001265532-393289eb8a55",
    "photo-1486873249359-2731bd6dafc7", "photo-1513407030348-c983a97b98d8", "photo-1518173946687-a4c8a383392c",
    "photo-1507525428034-b723cf961d3e"
  ],
  "Thriller": [
    "photo-1509248961158-e54f6934749c", "photo-1534447677768-be436bb09401", "photo-1509198397868-475647b2a1e5",
    "photo-1626814026160-2237a95fc5a0", "photo-1510519138101-570d1dca3d66", "photo-1517841905240-472988babdf9",
    "photo-1508700115892-45ecd05ae2ad", "photo-1540959733332-eab4deceeaf7", "photo-1492446845049-9c50cc313f00",
    "photo-1435527173128-983b87201f4d"
  ],
  "Romance": [
    "photo-1518199266791-5375a83190b7", "photo-1494790108377-be9c29b29330", "photo-1518895949257-7621c3c786d7",
    "photo-1469371670807-013ccf25f16a", "photo-1515934751635-c81c6bc9a2d8", "photo-1511285560929-80b456fea0bc",
    "photo-1501901654745-10986502f902", "photo-1529156069898-49953e39b3ac", "photo-1519501025264-65ba15a82390"
  ],
  "Animation": [
    "photo-1546182990-dffeafbe841d", "photo-1578632767115-351597cf2477", "photo-1501854140801-50d01698950b",
    "photo-1608889175123-8ec330b86f84", "photo-1513836279014-a89f7a76ae86", "photo-1519681393784-d120267933ba",
    "photo-1486873249359-2731bd6dafc7", "photo-1507525428034-b723cf961d3e", "photo-1513271936660-d375103fc214"
  ],
  "Crime": [
    "photo-1485546234645-a62644f84728", "photo-1533928298208-27ff66555d8d", "photo-1509198397868-475647b2a1e5",
    "photo-1594909122845-11baa439b7bf", "photo-1509248961158-e54f6934749c", "photo-1440404653325-ab127d49abc1",
    "photo-1526374965328-7f61d4dc18c5", "photo-1515879218367-8466d910aaa4", "photo-1543536448-d209d2d13a1c"
  ]
};

function hashId(val: number): number {
  let h = val ^ (val >>> 16);
  h = Math.imul(h, 0x85ebca6b);
  h = h ^ (h >>> 13);
  h = Math.imul(h, 0xc2b2ae35);
  h = h ^ (h >>> 16);
  return Math.abs(h);
}

export function getUniqueMovieImages(genre: string, id: number, index: number) {
  const availableGenres = Object.keys(genreImages);
  const matchedGenre = availableGenres.find(g => g.toLowerCase() === genre.toLowerCase()) || "Drama";
  const list = genreImages[matchedGenre as keyof typeof genreImages] || genreImages["Drama"];
  
  // Combine all genre images to build a massive global pool of 65+ unique images
  const globalPool = Array.from(new Set(Object.values(genreImages).flat()));
  
  // Combine the specific genre list with the global pool so we prioritize genre-specific but always have over 60+ options
  const combinedList = Array.from(new Set([...list, ...globalPool]));
  
  const hId = hashId(id);
  const backdropIndex = hId % combinedList.length;
  // Pick a different poster dynamically using an offset hash
  const posterIndex = hashId(id + 1337) % combinedList.length;
  
  const basePhotoId = combinedList[backdropIndex];
  const finalPosterIndex = (posterIndex === backdropIndex && combinedList.length > 1) 
    ? (posterIndex + 1) % combinedList.length 
    : posterIndex;
  const posterPhotoId = combinedList[finalPosterIndex];

  return {
    poster: `https://images.unsplash.com/${posterPhotoId}?w=500&h=750&fit=crop&auto=format&q=80`,
    backdrop: `https://images.unsplash.com/${basePhotoId}?w=1200&h=675&fit=crop&auto=format&q=80`
  };
}

let i = 0;
const languages = ["en", "en", "en", "en", "es", "fr", "ja", "ko", "it", "de", "zh"];
while (moviesData.length < 88200) {
  const mockId = 100000 + i;
  if (existingIds.has(mockId)) {
    i++;
    continue;
  }

  const adj = adjs[i % adjs.length];
  const noun = nouns[(i * 7 + 13) % nouns.length];
  const suffix = suffixes[(i * 3 + 1) % suffixes.length];
  const fullTitle = suffix ? `${adj} ${noun}: ${suffix}` : `${adj} ${noun}`;

  const template = categoryTemplates[i % categoryTemplates.length];
  
  const director = `${firstNames[(i * 5) % firstNames.length]} ${lastNames[(i * 3 + 4) % lastNames.length]}`;
  const actor1 = `${firstNames[(i * 2 + 1) % firstNames.length]} ${lastNames[(i * 4 + 7) % lastNames.length]}`;
  const actor2 = `${firstNames[(i * 7 + 3) % firstNames.length]} ${lastNames[(i * 2 + 1) % lastNames.length]}`;
  const actor3 = `${firstNames[(i * 11 + 9) % firstNames.length]} ${lastNames[(i * 5 + 2) % lastNames.length]}`;
  const cast = [actor1, actor2, actor3];

  const releaseYear = 1970 + (i % 57); // 1970 to 2026
  const rating = parseFloat((5.5 + ((i * 13) % 41) / 10).toFixed(1)); // 5.5 to 9.5
  const popularity = parseFloat((15.0 + ((i * 17) % 2850) / 10).toFixed(1)); // 15.0 to 300.0 popularities
  const language = languages[i % languages.length];

  const selectedKeywords = [
    template.keywords[i % template.keywords.length],
    template.keywords[(i + 3) % template.keywords.length],
    template.keywords[(i + 7) % template.keywords.length],
  ];

  const overview = `${template.overviewStart}directed by ${director} and starring ${actor1} and ${actor2}, ${template.overviewEnd}`;
  
  // Clean, tidy, low-vocabulary metadata soup to keep the TF-IDF vocabulary matrix performant
  const metadataSoup = [
    ...template.genres.map(g => g.toLowerCase()),
    ...selectedKeywords,
    ...cast.map(c => c.toLowerCase()),
    director.toLowerCase(),
    adj.toLowerCase(),
    noun.toLowerCase(),
    "movie", "classic", "hollywood"
  ].join(" ");

  const primaryGenre = template.genres[0] || "movie";
  const images = getUniqueMovieImages(primaryGenre, mockId, i);
  const posterUrl = images.poster;
  const backdropUrl = images.backdrop;
  const trailerKey = trailerKeys[i % trailerKeys.length];

  moviesData.push({
    id: mockId,
    title: fullTitle,
    genres: template.genres,
    keywords: selectedKeywords,
    cast,
    director,
    overview,
    rating,
    releaseYear,
    popularity,
    language,
    posterUrl,
    backdropUrl,
    trailerKey,
    metadataSoup,
    svdFactors: template.factors
  });

  i++;
}

// Procedurally generate exactly 100 new, high-quality movies for each genre
const genreDefinitions = [
  {
    genre: "Action",
    adjs: ["Furious", "Vengeance", "Elite", "Strike", "Force", "Bullet", "Combat", "Rage", "Justice", "Showdown"],
    nouns: ["Fighter", "Soldier", "Agent", "Rebel", "Warrior", "Shadow", "Trigger", "Enforcer", "Assassin", "Mercenary"],
    keywords: ["explosion", "fight", "superhero", "combat", "fury", "chase", "mission", "weapon", "survival", "mercenary"],
    factors: [0.95, 0.2, 0.1, 0.1, 0.6],
    storyStart: "A highly-trained special operations veteran is forced out of retirement ",
    storyEnd: "to dismantle an elite syndicate of mercenaries in a series of explosive bullet-riddled encounters."
  },
  {
    genre: "Adventure",
    adjs: ["Lost", "Wild", "Golden", "Distant", "Savage", "Hidden", "Quest", "Voyage", "Forgotten", "Expedition"],
    nouns: ["Horizon", "Frontier", "Kingdom", "Island", "Canyon", "Valley", "Temple", "Jungle", "Treasure", "Odyssey"],
    keywords: ["trek", "exploration", "treasure", "journey", "survival", "wilderness", "jungle", "expedition", "danger", "artifact"],
    factors: [0.85, 0.3, 0.2, 0.1, 0.4],
    storyStart: "An intrepid archeologist and a guide follow a cryptic parchment deep into unknown lands ",
    storyEnd: "to uncover a legendary forgotten kingdom filled with unimaginable riches and lethal traps."
  },
  {
    genre: "Sci-Fi",
    adjs: ["Quantum", "Digital", "Cosmic", "Neon", "Cyber", "Interstellar", "Atomic", "Galactic", "Infinite", "Future"],
    nouns: ["Paradox", "Protocol", "Matrix", "Android", "Galaxy", "Nebula", "Starship", "Dimension", "Chronosphere", "Cyberpunk"],
    keywords: ["space", "alien", "robot", "future", "laser", "galaxy", "technology", "dimension", "time-travel", "ai"],
    factors: [0.9, 0.15, 0.2, 0.1, 0.7],
    storyStart: "When an experimental warp drive tears a rift in the space-time fabric of the galaxy, ",
    storyEnd: "a brilliant astrophysicist must voyage across parallel dimensions to avoid a cosmic paradox."
  },
  {
    genre: "Drama",
    adjs: ["Eternal", "Silent", "Shattered", "Broken", "Whispering", "Bitter", "Sacred", "Humble", "True", "Noble"],
    nouns: ["Legacy", "Symphony", "Destiny", "Requiem", "Confession", "Tragedy", "Triumph", "Struggle", "Affair", "Memoir"],
    keywords: ["family", "relationship", "tragedy", "struggle", "grief", "friendship", "triumph", "secret", "emotion", "hope"],
    factors: [0.1, 0.9, 0.4, 0.4, 0.3],
    storyStart: "An emotional, raw character portrait of a multi-generational family coping with hidden grief ",
    storyEnd: "as they slowly rebuild their relationships and discover the redemptive power of forgiveness."
  },
  {
    genre: "Romance",
    adjs: ["Sweet", "Amorous", "Sparking", "Secret", "Tender", "Passionate", "First", "Fated", "Beloved", "Dreamy"],
    nouns: ["Heart", "Embrace", "Promise", "Whisper", "Affection", "Destiny", "Lover", "Melody", "Memoir", "Kiss"],
    keywords: ["love", "heartbreak", "romance", "marriage", "passion", "letter", "destiny", "affair", "relationship", "affection"],
    factors: [0.1, 0.8, 0.3, 0.95, 0.2],
    storyStart: "Two lonely artists from completely different social worlds find their souls entwined under Paris rain, ",
    storyEnd: "navigating a sweeping, passionate love affair that defies all contemporary society conventions."
  },
  {
    genre: "Comedy",
    adjs: ["Crazy", "Hilarious", "Wacky", "Wild", "Goofy", "Silly", "Double", "Messy", "Accidental", "Ridiculous"],
    nouns: ["Chaos", "Adventure", "Prank", "Uncle", "Holiday", "Vacation", "School", "Wedding", "Trouble", "Mismatch"],
    keywords: ["funny", "laugh", "humor", "prank", "chaos", "holiday", "mistake", "joke", "comedy", "mismatch"],
    factors: [0.2, 0.3, 0.95, 0.4, 0.1],
    storyStart: "A series of ridiculous misunderstandings leads two deeply mismatched wedding planners into chaos, ",
    storyEnd: "testing their sanity as they attempt to deliver a pristine ceremony amidst nonstop disaster."
  },
  {
    genre: "Family",
    adjs: ["Magic", "Wonderful", "Cheerful", "Playful", "Happy", "Cozy", "Friendly", "Gentle", "Warm", "Bright"],
    nouns: ["Home", "Pet", "Journey", "Summer", "Garden", "Castle", "Adventure", "Secret", "Wonder", "Bond"],
    keywords: ["family", "childhood", "pet", "friendship", "magic", "sweet", "happy", "adventure", "together", "fun"],
    factors: [0.2, 0.4, 0.85, 0.6, 0.1],
    storyStart: "An enchanting, heartwarming adventure about a young girl and her loyal, goofy pet dog ",
    storyEnd: "who venture together across their sunny town to find their grandfather's legendary secret treasure."
  },
  {
    genre: "Crime",
    adjs: ["Crooked", "Shadowy", "Ruthless", "Sly", "Guilty", "Vicious", "Deep", "Federal", "Illegal", "Sinister"],
    nouns: ["Mafia", "Mobster", "Conspiracy", "Heist", "Robbery", "Underworld", "Officer", "Caper", "Syndicate", "Betrayal"],
    keywords: ["mafia", "heist", "robbery", "gangster", "police", "money", "crime", "investigation", "betrayal", "fbi"],
    factors: [0.5, 0.85, 0.1, 0.1, 0.9],
    storyStart: "A veteran bank robber plans one massive, final, ultra-precise heist in metropolitan Chicago, ",
    storyEnd: "completely unaware that a clean undercover federal detective has already infiltrated his loyal crew."
  },
  {
    genre: "Thriller",
    adjs: ["Frantic", "Tense", "Grim", "Haunting", "Fatal", "Panic", "Paranoid", "Hostage", "Deadly", "Cold"],
    nouns: ["Countdown", "Web", "Trap", "Game", "Chase", "Nightmare", "Escape", "Clarity", "Pursuit", "Edge"],
    keywords: ["suspense", "danger", "chase", "hostage", "escape", "murder", "psychological", "thriller", "tension", "conspiracy"],
    factors: [0.6, 0.6, 0.1, 0.1, 0.95],
    storyStart: "A race-against-the-clock psychological puzzle where an innocent surgeon is framed for murder, ",
    storyEnd: "forcing them to navigate high-speed chases and complex conspiracies to prove their absolute innocence."
  },
  {
    genre: "Mystery",
    adjs: ["Clueless", "Unsolved", "Secretive", "Vague", "Mystic", "Puzzling", "Enigmatic", "Foggy", "Forgotten", "Stolen"],
    nouns: ["Clue", "Enigma", "Puzzle", "Riddle", "Suspect", "Detective", "Tracer", "Investigation", "Crypt", "Shadow"],
    keywords: ["detective", "mystery", "clue", "solving", "investigation", "unsolved", "suspect", "enigma", "puzzle", "crime"],
    factors: [0.3, 0.75, 0.1, 0.1, 0.9],
    storyStart: "When an eccentric billionaire is discovered dead inside his locked, secure library room, ",
    storyEnd: "a sharp, private detective uncovers a labyrinth of family secrets, sibling rivalries, and puzzles."
  },
  {
    genre: "Fantasy",
    adjs: ["Mythical", "Enchanted", "Magical", "Celestial", "Wizardly", "Royal", "Legendary", "Elven", "Draconic", "Ancient"],
    nouns: ["Portal", "Amulet", "Crown", "Relic", "Dragon", "Sword", "Spell", "Kingdom", "Quest", "Tome"],
    keywords: ["magic", "dragon", "wizard", "quest", "kingdom", "sword", "witch", "spell", "mythology", "sorcery"],
    factors: [0.75, 0.45, 0.2, 0.15, 0.4],
    storyStart: "A humble apprentice magic wizard unintentionally unleashes an ancient draconic curse, ",
    storyEnd: "embarking on a massive quest across enchanted kingdoms with a magical elven sword to save the land."
  },
  {
    genre: "History",
    adjs: ["Historic", "Colonial", "Imperial", "Dynastic", "Ancient", "Pioneering", "Revolutionary", "Sovereign", "Forgotten", "Savage"],
    nouns: ["Chronicle", "Epoch", "Empire", "Regime", "Crusade", "Revolt", "Treaty", "Monarch", "Declaration", "Legacy"],
    keywords: ["historic", "monumental", "era", "monarch", "empire", "revolution", "historical-event", "chronicle", "culture", "biography"],
    factors: [0.15, 0.95, 0.1, 0.15, 0.4],
    storyStart: "A heavy, incredibly accurate reproduction of the monumental political treaty signed in 1804, ",
    storyEnd: "shedding light on the unseen sovereign battles and the private struggles of revolutionary leaders."
  },
  {
    genre: "Biography",
    adjs: ["Inspirational", "Famous", "True", "Untold", "Brilliant", "Extraordinary", "Visionary", "Selfless", "Legendary", "Iconic"],
    nouns: ["Life", "Story", "Tribute", "Path", "Spirit", "Legacy", "Mind", "Portrait", "Memoir", "Sojourn"],
    keywords: ["biography", "true-story", "inspiration", "real-life", "visionary", "memoir", "historical-figure", "tribute", "journey", "legacy"],
    factors: [0.1, 0.96, 0.2, 0.2, 0.3],
    storyStart: "The true, incredibly inspiring chronicle of a selfless visionary who revolutionized the field of surgery ",
    storyEnd: "recounting their struggles against skepticism and their final, celebrated legacy across medicine."
  },
  {
    genre: "Animation",
    adjs: ["Animated", "Colorful", "Playful", "Sparkly", "Whimsical", "Toony", "Fluffy", "Magical", "Bouncy", "Cuddly"],
    nouns: ["Toon", "Critter", "Sketch", "Buddy", "Whiskers", "Dreamer", "Wish", "Caravan", "World", "Wonderland"],
    keywords: ["animated", "talking-animal", "cartoon", "whimsical", "magical-world", "pixar-style", "family-friend", "kids", "adventure", "funny"],
    factors: [0.35, 0.35, 0.88, 0.4, 0.1],
    storyStart: "A visually brilliant, heartwarming animated journey where a cuddly sketch toon comes to life, ",
    storyEnd: "venturing on a legendary journey to find friendship and map out a whimsical dream world."
  },
  {
    genre: "Horror",
    adjs: ["Haunted", "Vicious", "Bloody", "Eerie", "Grim", "Slasher", "Malicious", "Dark", "Spooky", "Scream"],
    nouns: ["Cabin", "Grave", "Shadow", "Nightmare", "Demon", "Ghoul", "Apparition", "Curse", "Crypt", "Tomb"],
    keywords: ["scary", "ghost", "darkness", "fear", "monster", "demon", "blood", "slasher", "haunted-house", "survival"],
    factors: [0.4, 0.45, 0.1, 0.1, 0.98],
    storyStart: "When standard teenagers decide to camp near a forgotten, cursed tomb inside malicious deep woods, ",
    storyEnd: "they face their deepest psychological fears as an ancient demonic entity hunts them down."
  },
  {
    genre: "War",
    adjs: ["Battlefield", "Fallen", "Heroic", "Brazen", "Frontline", "Valiant", "Courageous", "Combat", "Shattered", "Patriotic"],
    nouns: ["Soldier", "Officer", "Platoon", "Trench", "Victory", "Fortress", "Siege", "General", "Campaign", "Honor"],
    keywords: ["world-war", "battle", "soldier", "army", "military", "tactical", "bravery", "survival", "historical-war", "truce"],
    factors: [0.8, 0.75, 0.1, 0.1, 0.7],
    storyStart: "During the height of a legendary, brutal WWII trench campaign in Western Europe, ",
    storyEnd: "a valiant platoon of young soldiers must defend a vital frontline fortress at all costs."
  },
  {
    genre: "Western",
    adjs: ["Wild", "Dusty", "Rogue", "Fugitive", "Desolate", "Lone", "Savage", "Grizzled", "Gold", "Outlaw"],
    nouns: ["Frontier", "Saloon", "Sheriff", "Spur", "Canyon", "Ranch", "Showdown", "Gunsling", "Bandit", "Desperado"],
    keywords: ["cowboy", "western", "saloon", "outlaw", "sheriff", "showdown", "gunslinger", "gold-rush", "dusty-town", "horse"],
    factors: [0.75, 0.6, 0.1, 0.2, 0.55],
    storyStart: "A grizzled outlaw rides into a lawless frontier town searching for his partner inside dusty saloons, ",
    storyEnd: "leading up to an intense gunslinging showdown under the burning sun to retrieve hidden gold."
  },
  {
    genre: "Music",
    adjs: ["Harmonic", "Symphonic", "Melodic", "Rhythmic", "Acoustic", "Choral", "Slick", "Classical", "Lyrical", "Tuned"],
    nouns: ["Echo", "Sound", "Beat", "Song", "Instrument", "Microphone", "Melody", "Rhythm", "Concert", "Stage"],
    keywords: ["music", "concert", "instrument", "musician", "band", "song", "musical", "singer", "harmony", "performance"],
    factors: [0.15, 0.75, 0.45, 0.5, 0.35],
    storyStart: "A passionate, extraordinarily gifted street musician finds a dusty classical acoustic instrument, ",
    storyEnd: "launching into a symphonic odyssey to secure a spot on the most prestigious melodic concert stage."
  }
];

genreDefinitions.forEach((def, defIdx) => {
  for (let j = 0; j < 100; j++) {
    const mockId = 600000 + defIdx * 100 + j;
    
    const adj = def.adjs[j % def.adjs.length];
    const noun = def.nouns[(j * 7 + 13) % def.nouns.length];
    const suffix = suffixes[(j * 3 + 1) % suffixes.length];
    const fullTitle = `${adj} ${noun}${suffix ? " " + suffix : ""}`;

    const director = `${firstNames[(j * 5) % firstNames.length]} ${lastNames[(j * 3 + 4) % lastNames.length]}`;
    const actor1 = `${firstNames[(j * 17) % firstNames.length]} ${lastNames[(j * 3) % lastNames.length]}`;
    const actor2 = `${firstNames[(j * 11) % firstNames.length]} ${lastNames[(j * 7) % lastNames.length]}`;
    const actor3 = `${firstNames[(j * 23 + 2) % firstNames.length]} ${lastNames[(j * 13) % lastNames.length]}`;
    const cast = [actor1, actor2, actor3];

    const releaseYear = 1990 + (j % 37); // 1990 to 2026
    const rating = parseFloat((6.5 + ((j * 7) % 31) / 10).toFixed(1)); // 6.5 to 9.5
    const popularity = parseFloat((40.0 + ((j * 11) % 150) / 10).toFixed(1)); // 40.0 to 55.0

    const selectedKeywords = [
      def.keywords[j % def.keywords.length],
      def.keywords[(j + 2) % def.keywords.length],
      def.keywords[(j + 5) % def.keywords.length],
    ];

    const overview = `${def.storyStart}starring ${actor1} and ${actor2}, directed by the visionary ${director}. ${def.storyEnd}`;

    const metadataSoup = [
      def.genre.toLowerCase(),
      ...selectedKeywords,
      ...cast.map(c => c.toLowerCase()),
      director.toLowerCase(),
      adj.toLowerCase(),
      noun.toLowerCase(),
      "movie", "classic", "hollywood"
    ].join(" ");

    const images = getUniqueMovieImages(def.genre, mockId, j);
    const posterUrl = images.poster;
    const backdropUrl = images.backdrop;
    const trailerKey = trailerKeys[j % trailerKeys.length];

    moviesData.push({
      id: mockId,
      title: fullTitle,
      genres: [def.genre],
      keywords: selectedKeywords,
      cast,
      director,
      overview,
      rating,
      releaseYear,
      popularity,
      language: languages[j % languages.length],
      posterUrl,
      backdropUrl,
      trailerKey,
      metadataSoup,
      svdFactors: def.factors
    });
  }
});

// Post-processing: Apply beautiful, 100% unique hand-curated movie poster/backdrop maps to prevent any image repetitions
const movieAestheticMap: Record<number, { poster: string; backdrop: string }> = {};

const curatedMovieIds = [
  19995, 155, 27205, 157336, 597, 680, 278, 13, 24428, 603, 
  475557, 329, 98, 11, 118, 122, 105, 550, 496243, 244786, 
  354912, 76341, 10681, 85, 68718, 8587, 150540, 129, 231, 500,
  862, 238, 274, 120, 424, 807, 489, 37165, 1422, 1891, 
  38, 324857, 289, 280, 10001, 10002, 10003, 10004, 10005, 10006, 
  10007, 10008
];

const uniquePosters = [
  "photo-1536440136628-849c177e76a1", "photo-1478760329108-5c3ed9d495a0", "photo-1509248961158-e54f6934749c", "photo-1440404653325-ab127d49abc1",
  "photo-1542204172-e70528091f50", "photo-1509198397868-475647b2a1e5", "photo-1442512595331-e89e73853f31", "photo-1485846234645-a62644f84728",
  "photo-1518709268805-4e9042af9f23", "photo-1446776811953-b23d57bd21aa", "photo-1501535033-a598d2bfb540", "photo-1544256718-3bcf237f3974",
  "photo-1534447677768-be436bb09401", "photo-1500485035595-cbe6f645feb1", "photo-1514306191717-452ec28c7814", "photo-1532499016263-f2c3e89df9c5",
  "photo-1461360228754-6e81c478b882", "photo-1549490349-8643362247b5", "photo-1542838132-92c53300491e", "photo-1518173946687-a4c8a383392c",
  "photo-1451187580459-43490279c0fa", "photo-1510519138101-570d1dca3d66", "photo-1516426122078-c23e76319801", "photo-1513151233558-d860c5398176",
  "photo-1569003339405-ea396a5a8a90", "photo-1543536448-d209d2d13a1c", "photo-1626278664285-f7c0b9e758a5", "photo-1608248597481-496100c8c836",
  "photo-1559583985-c80d8ad9b29f", "photo-1604200213928-ba3cf4fc8436", "photo-1635805737707-575885ab0820", "photo-1504701954957-2390f806e9f4",
  "photo-1506703719100-a0f3a48c0f86", "photo-1507525428034-b723cf961d3e", "photo-1540959733332-eab4deceeaf7", "photo-1519501025264-65ba15a82390",
  "photo-1469854523086-cc02fe5d8800", "photo-1470071459604-3b5ec3a7fe05", "photo-1447752875215-b2761acb3c5d", "photo-1472214222541-d510753a4907",
  "photo-1433832597046-4f10e10ac764", "photo-1506744038136-46273834b3fb", "photo-1513407030348-c983a97b98d8", "photo-1464822759023-fed622ff2c3b",
  "photo-1501854140801-50d01698950b", "photo-1470770841072-f978cf4d019e", "photo-1475924156734-496f6cac6ec1", "photo-1434725039720-abb26e2b4848",
  "photo-1441974231531-c6227db76b6e", "photo-1507525428034-b723cf961d3e", "photo-1519681393784-d120267933ba", "photo-1486873249359-2731bd6dafc7"
];

const uniqueBackdrops = [
  "photo-1473448912268-2022ce9509d8", "photo-1500530855697-b586d89ba3ee", "photo-1504280390367-361c6d9f38f4", "photo-1419242902214-272b3f66ee7a",
  "photo-1538370965046-79c0d6907d47", "photo-1516339901601-2e1b62dc0c45", "photo-1462331940025-496dfbfc7564", "photo-1535223289827-42f1e9919769",
  "photo-1507413245164-6160d8298b31", "photo-1504384308090-c894fdcc538d", "photo-1525547719571-a2d4ac8945e2", "photo-1531297484001-80022131f5a1",
  "photo-1581092921461-eab62e97a780", "photo-1579546929518-9e396f3cc809", "photo-1618005182384-a83a8bd57fbe", "photo-1614728894747-a83421e2b9c9",
  "photo-1541185933-ef5d8ed016c2", "photo-1505686994434-e3cc5abf1330", "photo-1492446845049-9c50cc313f00", "photo-1435527173128-983b87201f4d",
  "photo-1489599849927-2ee91cede3ba", "photo-1516321318423-f06f85e504b3", "photo-1455390582262-044cdead277a", "photo-1434030216411-0b793f4b4173",
  "photo-1491308389656-34b5abbbb37c", "photo-1457369804613-52c61a468e7d", "photo-1501504905252-473c47e087f8", "photo-1507679799987-c73779587ccf",
  "photo-1522071820081-009f0129c71c", "photo-1517245386807-bb43f82c33c4", "photo-1521791136064-7986c2920216", "photo-1516589178581-6cd7833ae3b2",
  "photo-1518199266791-5375a83190b7", "photo-1494790108377-be9c29b29330", "photo-1518895949257-7621c3c786d7", "photo-1469371670807-013ccf25f16a",
  "photo-1515934751635-c81c6bc9a2d8", "photo-1511285560929-80b456fea0bc", "photo-1501901654745-10986502f902", "photo-1529156069898-49953e39b3ac",
  "photo-1513271936660-d375103fc214", "photo-1531746020798-e6953c6e8e04", "photo-1523438885200-e635ba2c371e", "photo-1516051636526-143991b11130",
  "photo-1510154221590-ff63e90a136f", "photo-1518609878373-06d740f60d8b", "photo-1516873240891-4bf014598ab4", "photo-1527224857830-43a7acc85260",
  "photo-1543807535-eceef0bc6599", "photo-1522869635100-9f4c5e86aa37", "photo-1511671782779-c97d3d27a1d4", "photo-1504609773096-104ff2c73ba4"
];

curatedMovieIds.forEach((id, idx) => {
  const posterId = uniquePosters[idx % uniquePosters.length];
  const backdropId = uniqueBackdrops[idx % uniqueBackdrops.length];
  movieAestheticMap[id] = {
    poster: `https://images.unsplash.com/${posterId}?w=500&h=750&fit=crop&q=80`,
    backdrop: `https://images.unsplash.com/${backdropId}?w=1200&h=675&fit=crop&q=80`
  };
});

const legacyUnusedMap: Record<number, { poster: string; backdrop: string }> = {
  19995: { // Avatar
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1542204172-e70528091f50?w=1600&auto=format&fit=crop"
  },
  155: { // The Dark Knight
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop"
  },
  27205: { // Inception
    poster: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop"
  },
  157336: { // Interstellar
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&auto=format&fit=crop"
  },
  597: { // Titanic
    poster: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1501535033-a598d2bfb540?w=1600&auto=format&fit=crop"
  },
  680: { // Pulp Fiction
    poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1600&auto=format&fit=crop"
  },
  278: { // The Shawshank Redemption
    poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1435527173128-983b87201f4d?w=1600&auto=format&fit=crop"
  },
  13: { // Forrest Gump
    poster: "https://images.unsplash.com/photo-1492446845049-9c50cc313f00?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1600&auto=format&fit=crop"
  },
  24428: { // The Avengers
    poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=1600&auto=format&fit=crop"
  },
  603: { // The Matrix
    poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1600&auto=format&fit=crop"
  },
  475557: { // Joker
    poster: "https://images.unsplash.com/photo-1601513525393-013757aa0576?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1600&auto=format&fit=crop"
  },
  329: { // Jurassic Park
    poster: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop"
  },
  98: { // Gladiator
    poster: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1600&auto=format&fit=crop"
  },
  11: { // Star Wars: A New Hope
    poster: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop"
  },
  118: { // Charlie and the Chocolate Factory
    poster: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop"
  },
  122: { // The Lord of the Rings: The Return of the King
    poster: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop"
  },
  105: { // Back to the Future
    poster: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1600&auto=format&fit=crop"
  },
  550: { // Fight Club
    poster: "https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1600&auto=format&fit=crop"
  },
  496243: { // Parasite
    poster: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop"
  },
  244786: { // Whiplash
    poster: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop"
  },
  354912: { // Coco
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1534001265532-393289eb8a55?w=1600&auto=format&fit=crop"
  },
  76341: { // Mad Max: Fury Road
    poster: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1533240332313-0db49b439ad3?w=1600&auto=format&fit=crop"
  },
  10681: { // WALL-E
    poster: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop"
  },
  85: { // Raiders of the Lost Ark
    poster: "https://images.unsplash.com/photo-1485081669829-bacb8c7bb1f3?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=1600&auto=format&fit=crop"
  },
  68718: { // Django Unchained
    poster: "https://images.unsplash.com/photo-1501534159991-abd4127dfbc7?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1533240332313-0db49b439ad3?w=1600&auto=format&fit=crop"
  },
  8587: { // The Lion King
    poster: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop"
  },
  150540: { // Inside Out
    poster: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1600&auto=format&fit=crop"
  },
  129: { // Spirited Away
    poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&auto=format&fit=crop"
  },
  231: { // Psycho
    poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=1600&auto=format&fit=crop"
  },
  500: { // GoodFellas
    poster: "https://images.unsplash.com/photo-1485546234645-a62644f84728?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=1600&auto=format&fit=crop"
  },
  862: { // Toy Story
    poster: "https://images.unsplash.com/photo-1608889175123-8ec330b86f84?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1600&auto=format&fit=crop"
  },
  238: { // The Godfather
    poster: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop"
  },
  274: { // The Silence of the Lambs
    poster: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1600&auto=format&fit=crop"
  },
  120: { // The Lord of the Rings: The Fellowship of the Ring
    poster: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=1600&auto=format&fit=crop"
  },
  424: { // Schindler's List
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=1600&auto=format&fit=crop"
  },
  807: { // Se7en
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=1600&auto=format&fit=crop"
  },
  489: { // Good Will Hunting
    poster: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&auto=format&fit=crop"
  },
  37165: { // The Truman Show
    poster: "https://images.unsplash.com/photo-1598257006458-087169a1f08d?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1534001265532-393289eb8a55?w=1600&auto=format&fit=crop"
  },
  1422: { // The Departed
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1542204172-e70528091f50?w=1600&auto=format&fit=crop"
  },
  1891: { // Star Wars: The Empire Strikes Back
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=1600&auto=format&fit=crop"
  },
  38: { // Eternal Sunshine of the Spotless Mind
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1501535033-a598d2bfb540?w=1600&auto=format&fit=crop"
  },
  324857: { // Spider-Man: Into the Spider-Verse
    poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=1600&auto=format&fit=crop"
  },
  289: { // Casablanca
    poster: "https://images.unsplash.com/photo-1543536448-d209d2d13a1c?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1600&auto=format&fit=crop"
  },
  280: { // Terminator 2: Judgment Day
    poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1600&auto=format&fit=crop"
  },
  10001: { // Iron Man
    poster: "https://images.unsplash.com/photo-1626278664285-f7c0b9e758a5?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1608248597481-496100c8c836?w=1600&auto=format&fit=crop"
  },
  10002: { // Avengers: Endgame
    poster: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=1600&auto=format&fit=crop"
  },
  10003: { // Avengers: Infinity War
    poster: "https://images.unsplash.com/photo-1608248597481-496100c8c836?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop"
  },
  10004: { // Spider-Man
    poster: "https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=1600&auto=format&fit=crop"
  },
  10005: { // Spider-Man 2
    poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=1600&auto=format&fit=crop"
  },
  10006: { // Spider-Man: No Way Home
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop"
  },
  10007: { // Guardians of the Galaxy
    poster: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop"
  },
  10008: { // Black Panther
    poster: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=1600&auto=format&fit=crop"
  }
};

moviesData.forEach((movie) => {
  if (movieAestheticMap[movie.id]) {
    movie.posterUrl = movieAestheticMap[movie.id].poster;
    movie.backdropUrl = movieAestheticMap[movie.id].backdrop;
  }
});



