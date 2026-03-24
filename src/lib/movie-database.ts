import { Movie } from './types';

// Curated list of popular movies with TMDB data
// This allows the app to work without a TMDB API key
export const CURATED_MOVIES: Movie[] = [
  { id: 278, title: "The Shawshank Redemption", poster_path: "/9cjIGRiQoJdBj0mSNPoFsQiKjiq.jpg", release_date: "1994-09-23", overview: "Imprisoned in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison.", vote_average: 8.7 },
  { id: 238, title: "The Godfather", poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", release_date: "1972-03-14", overview: "The aging patriarch of an organized crime dynasty transfers control to his reluctant son.", vote_average: 8.7 },
  { id: 240, title: "The Godfather Part II", poster_path: "/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg", release_date: "1974-12-20", overview: "The early life and career of Vito Corleone in 1920s New York City is portrayed, while his son Michael expands and tightens his grip on the family crime syndicate.", vote_average: 8.6 },
  { id: 424, title: "Schindler's List", poster_path: "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg", release_date: "1993-12-15", overview: "The true story of how businessman Oskar Schindler saved over a thousand Jewish lives during the Holocaust.", vote_average: 8.6 },
  { id: 389, title: "12 Angry Men", poster_path: "/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg", release_date: "1957-04-10", overview: "The defense and the prosecution have rested, and the jury is filing into the jury room to decide if a young man is guilty or innocent of murdering his father.", vote_average: 8.5 },
  { id: 129, title: "Spirited Away", poster_path: "/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg", release_date: "2001-07-20", overview: "A young girl finds herself in a strange world of spirits and must find a way to free herself and her parents.", vote_average: 8.5 },
  { id: 19404, title: "Dilwale Dulhania Le Jayenge", poster_path: "/ktejodbcdCPXbMMdnpI9BUxW6O8.jpg", release_date: "1995-10-20", overview: "Raj is a rich, carefree, happy-go-lucky second generation NRI. Simran is the daughter of Chaudhary Baldev Singh.", vote_average: 8.5 },
  { id: 155, title: "The Dark Knight", poster_path: "/qJ2tW6WMUDux911BTUgMe1e4got.jpg", release_date: "2008-07-16", overview: "Batman raises the stakes in his war on crime, and the Joker emerges to wreak havoc on Gotham.", vote_average: 8.5 },
  { id: 680, title: "Pulp Fiction", poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", release_date: "1994-09-10", overview: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.", vote_average: 8.5 },
  { id: 497, title: "The Green Mile", poster_path: "/8VG8fDNiy50H4FedGwdSVUPoaJe.jpg", release_date: "1999-12-10", overview: "A tale set on death row where gentle giant John Coffey possesses the mysterious power to heal.", vote_average: 8.5 },
  { id: 122, title: "The Lord of the Rings: The Return of the King", poster_path: "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg", release_date: "2003-12-01", overview: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam.", vote_average: 8.5 },
  { id: 13, title: "Forrest Gump", poster_path: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg", release_date: "1994-06-23", overview: "A man with a low IQ accomplishes great things and was present during several historic moments.", vote_average: 8.5 },
  { id: 550, title: "Fight Club", poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg", release_date: "1999-10-15", overview: "An insomniac office worker and a devil-may-care soap maker form an underground fight club.", vote_average: 8.4 },
  { id: 429, title: "The Good, the Bad and the Ugly", poster_path: "/bX2xnavhMYjWDoZp1VM6VnU1xwe.jpg", release_date: "1966-12-23", overview: "While the Civil War rages, three men compete for a fortune in stolen Confederate gold.", vote_average: 8.5 },
  { id: 120, title: "The Lord of the Rings: The Fellowship of the Ring", poster_path: "/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg", release_date: "2001-12-18", overview: "Young hobbit Frodo Baggins must destroy the One Ring and end the Dark Lord Sauron's reign.", vote_average: 8.4 },
  { id: 769, title: "GoodFellas", poster_path: "/aKuFiU82s5ISJDx97KWLqBbGArp.jpg", release_date: "1990-09-19", overview: "The true story of Henry Hill and his life in the mob.", vote_average: 8.5 },
  { id: 346, title: "Seven Samurai", poster_path: "/8OKmBV5BUFzmozIC3pCWb1VcWCt.jpg", release_date: "1954-04-26", overview: "A poor village under attack by bandits recruits seven unemployed samurai to help them defend themselves.", vote_average: 8.5 },
  { id: 637, title: "Life Is Beautiful", poster_path: "/74hLDKjD5aGYOotO6esUVaeISa2.jpg", release_date: "1997-12-20", overview: "A Jewish man uses humor to shield his son from the horrors of a Nazi concentration camp.", vote_average: 8.5 },
  { id: 157336, title: "Interstellar", poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", release_date: "2014-11-05", overview: "Explorers travel through a wormhole in space to ensure humanity's survival.", vote_average: 8.4 },
  { id: 372058, title: "Your Name.", poster_path: "/q719jXXEhI1THrNvOCqGGrTVhbg.jpg", release_date: "2016-08-26", overview: "Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?", vote_average: 8.5 },
  { id: 27205, title: "Inception", poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg", release_date: "2010-07-15", overview: "A thief who enters the dreams of others to steal secrets is offered a chance to regain his old life.", vote_average: 8.4 },
  { id: 121, title: "The Lord of the Rings: The Two Towers", poster_path: "/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg", release_date: "2002-12-18", overview: "Frodo and Sam continue their journey to Mordor while Aragorn, Legolas, and Gimli pursue the Uruk-hai.", vote_average: 8.4 },
  { id: 324857, title: "Spider-Man: Into the Spider-Verse", poster_path: "/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg", release_date: "2018-12-07", overview: "Miles Morales becomes the Spider-Man of his reality and crosses paths with his counterparts from other dimensions.", vote_average: 8.4 },
  { id: 603, title: "The Matrix", poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", release_date: "1999-03-30", overview: "A computer hacker learns the truth about his reality and his role in the war against its controllers.", vote_average: 8.2 },
  { id: 11, title: "Star Wars", poster_path: "/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg", release_date: "1977-05-25", overview: "Princess Leia is captured by the Empire, and Luke Skywalker must save her with the help of Han Solo.", vote_average: 8.2 },
  { id: 1891, title: "The Empire Strikes Back", poster_path: "/nNAeTmF4CtdSgMDplXTDPOpYzsX.jpg", release_date: "1980-05-20", overview: "The Rebel Alliance suffers defeat at the hands of the Empire while Luke trains with Yoda.", vote_average: 8.4 },
  { id: 539, title: "Psycho", poster_path: "/81d8oyEFgj7FlxJqSDXWr8JH8kV.jpg", release_date: "1960-06-16", overview: "A young woman steals money and encounters a disturbed motel proprietor.", vote_average: 8.4 },
  { id: 807, title: "Se7en", poster_path: "/6yoghtyTpznpBik8EngEmJskVUO.jpg", release_date: "1995-09-22", overview: "Two detectives hunt a serial killer who uses the seven deadly sins as motifs.", vote_average: 8.3 },
  { id: 496243, title: "Parasite", poster_path: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", release_date: "2019-05-30", overview: "All unemployed, Ki-taek's family takes a peculiar interest in the wealthy Park family.", vote_average: 8.5 },
  { id: 78, title: "Blade Runner", poster_path: "/63N9uy8nd9j7Eog2axPQ8lbr3Wj.jpg", release_date: "1982-06-25", overview: "In a dystopian future, a blade runner must pursue replicants who have escaped to Earth.", vote_average: 7.9 },
  { id: 335984, title: "Blade Runner 2049", poster_path: "/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg", release_date: "2017-10-04", overview: "A young blade runner discovers a long-buried secret that leads him to find Rick Deckard.", vote_average: 7.5 },
  { id: 244786, title: "Whiplash", poster_path: "/7fn624j544nwdf4vDHlYbWGMFbU.jpg", release_date: "2014-10-10", overview: "A promising young drummer enrolls at a cut-throat music conservatory under the tutelage of a ruthless instructor.", vote_average: 8.4 },
  { id: 568332, title: "Everything Everywhere All at Once", poster_path: "/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg", release_date: "2022-03-24", overview: "An aging Chinese immigrant is swept up in an insane adventure involving alternate universes.", vote_average: 7.8 },
  { id: 11216, title: "Cinema Paradiso", poster_path: "/gCI2AeMV4IHSewhJOdVqJoGzRhi.jpg", release_date: "1988-11-17", overview: "A filmmaker recalls his childhood, when he fell in love with the movies at his village's theater.", vote_average: 8.4 },
  { id: 510, title: "One Flew Over the Cuckoo's Nest", poster_path: "/3jcbDmRFiQ83drXNOvRDeKHxS0C.jpg", release_date: "1975-11-19", overview: "A criminal pleads insanity and is admitted to a mental institution, where he rebels against the tyrannical nurse.", vote_average: 8.4 },
  { id: 1422, title: "The Departed", poster_path: "/nT97ifVT2J1yMQmeq20Qblg61T4.jpg", release_date: "2006-10-05", overview: "An undercover cop and a mole in the police try to identify each other while infiltrating an Irish gang.", vote_average: 8.2 },
  { id: 274, title: "The Silence of the Lambs", poster_path: "/uS9m8OBk1RVFDUGEeKbiDVpBSSQ.jpg", release_date: "1991-02-01", overview: "A young FBI agent seeks the help of an incarcerated cannibal killer to catch another serial killer.", vote_average: 8.3 },
  { id: 550988, title: "Free Guy", poster_path: "/xmbU4JTUm8rsdtn7Y3Fcm52GCQy.jpg", release_date: "2021-08-11", overview: "A bank teller discovers he is actually a background player in an open-world video game.", vote_average: 7.6 },
  { id: 299534, title: "Avengers: Endgame", poster_path: "/or06FN3Dka5tukK1e9TlQp321V2.jpg", release_date: "2019-04-24", overview: "The Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.", vote_average: 8.3 },
  { id: 299536, title: "Avengers: Infinity War", poster_path: "/7WsyChQLEftFiDhRhUg0Hbm56L.jpg", release_date: "2018-04-25", overview: "The Avengers must stop Thanos from collecting all six Infinity Stones.", vote_average: 8.3 },
  { id: 76341, title: "Mad Max: Fury Road", poster_path: "/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg", release_date: "2015-05-13", overview: "In a post-apocalyptic wasteland, Max teams up with Furiosa to flee from cult leader Immortan Joe.", vote_average: 7.6 },
  { id: 68718, title: "Django Unchained", poster_path: "/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg", release_date: "2012-12-25", overview: "A freed slave sets out to rescue his wife from a brutal plantation owner with the help of a bounty hunter.", vote_average: 8.2 },
  { id: 329, title: "Jurassic Park", poster_path: "/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg", release_date: "1993-06-11", overview: "A pragmatic paleontologist visits an almost complete theme park of cloned dinosaurs.", vote_average: 7.9 },
  { id: 694, title: "The Shining", poster_path: "/nRj5511mZdTl4saWwgt6efSPqEZ.jpg", release_date: "1980-05-23", overview: "A family heads to an isolated hotel where an evil presence drives the father into violent insanity.", vote_average: 8.2 },
  { id: 297762, title: "Wonder Woman", poster_path: "/gfJGlDaHuWimErCr5Ql0I8x9QSy.jpg", release_date: "2017-05-30", overview: "An Amazon princess leaves her island home to explore the world and becomes a hero in World War I.", vote_average: 7.3 },
  { id: 798286, title: "Dune: Part Two", poster_path: "/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg", release_date: "2024-02-27", overview: "Paul Atreides unites with the Fremen to take revenge against the conspirators who destroyed his family.", vote_average: 8.2 },
  { id: 438631, title: "Dune", poster_path: "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg", release_date: "2021-09-15", overview: "Paul Atreides must travel to the most dangerous planet in the universe to ensure the future of his family.", vote_average: 7.8 },
  { id: 872585, title: "Oppenheimer", poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", release_date: "2023-07-19", overview: "The story of J. Robert Oppenheimer and his role in the development of the atomic bomb.", vote_average: 8.1 },
  { id: 346698, title: "Barbie", poster_path: "/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg", release_date: "2023-07-19", overview: "Barbie and Ken leave Barbieland and discover the real world.", vote_average: 7.0 },
  { id: 572802, title: "Aquaman and the Lost Kingdom", poster_path: "/7lTnXOy0iNtBAdRP3TZvaKJ77F6.jpg", release_date: "2023-12-20", overview: "Black Manta seeks revenge on Aquaman for his father's death.", vote_average: 6.3 },
  { id: 671, title: "Harry Potter and the Philosopher's Stone", poster_path: "/wuMc08IPKEatf9rnMNXvIDIkZiV.jpg", release_date: "2001-11-16", overview: "An orphaned boy discovers he's a wizard and attends Hogwarts School of Witchcraft and Wizardry.", vote_average: 7.9 },
  { id: 672, title: "Harry Potter and the Chamber of Secrets", poster_path: "/sdEOH0992YZ0QSxgXNIGLq1ToUi.jpg", release_date: "2002-11-13", overview: "Harry returns to Hogwarts where a mysterious force is petrifying students.", vote_average: 7.7 },
  { id: 767, title: "Harry Potter and the Half-Blood Prince", poster_path: "/z7uo3D012DOMINAX4MU5nCEpXIn.jpg", release_date: "2009-07-07", overview: "Harry discovers an old potions book with powerful annotations.", vote_average: 7.7 },
  { id: 12444, title: "Harry Potter and the Deathly Hallows: Part 1", poster_path: "/iGoXIpQb7Pot00EEdwpwPajheZ5.jpg", release_date: "2010-11-17", overview: "Harry, Ron, and Hermione search for Horcruxes to destroy Voldemort.", vote_average: 7.8 },
  { id: 12445, title: "Harry Potter and the Deathly Hallows: Part 2", poster_path: "/c54HpQmuwXjHq2C9wmoACjxoomZ.jpg", release_date: "2011-07-07", overview: "The final battle between Harry and Voldemort.", vote_average: 8.1 },
  { id: 862, title: "Toy Story", poster_path: "/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg", release_date: "1995-10-30", overview: "A cowboy doll is profoundly threatened when a new spaceman figure supplants him.", vote_average: 8.0 },
  { id: 585, title: "Monsters, Inc.", poster_path: "/sgheSKxZkttIe8ONsf2sWXPgip3.jpg", release_date: "2001-11-01", overview: "Monsters generate their city's power by scaring children, but one little girl changes everything.", vote_average: 7.8 },
  { id: 150540, title: "Inside Out", poster_path: "/2H1TmgdfNtsKlU9jKdeNyYL5y8T.jpg", release_date: "2015-06-09", overview: "A girl's emotions guide her through a difficult move to a new city.", vote_average: 7.9 },
  { id: 508947, title: "Turning Red", poster_path: "/qsdjk9oAKSQMWs0Vt5Pyfh6O4GZ.jpg", release_date: "2022-03-10", overview: "A 13-year-old girl transforms into a giant red panda when she gets excited.", vote_average: 7.4 },
  { id: 1726, title: "Iron Man", poster_path: "/78lPtwv72eTNqFW9COBYI0dWDJa.jpg", release_date: "2008-04-30", overview: "Tony Stark builds a high-tech suit of armor to escape captivity and becomes Iron Man.", vote_average: 7.6 },
  { id: 634649, title: "Spider-Man: No Way Home", poster_path: "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg", release_date: "2021-12-15", overview: "Peter Parker seeks help from Doctor Strange to make the world forget he is Spider-Man.", vote_average: 8.0 },
  { id: 745, title: "The Sixth Sense", poster_path: "/fIssD3w3SvIhPPmVo4WMgZDVLID.jpg", release_date: "1999-08-06", overview: "A boy who communicates with spirits seeks the help of a child psychologist.", vote_average: 8.1 },
  { id: 640, title: "Catch Me If You Can", poster_path: "/ctjEj2xM32OvBXCq8zAdK3ZrsAj.jpg", release_date: "2002-12-25", overview: "A true story about Frank Abagnale Jr. who successfully conned millions of dollars worth of checks.", vote_average: 8.0 },
  { id: 272, title: "Batman Begins", poster_path: "/8RW2runSEc34IwKN2D1aPcJd2UL.jpg", release_date: "2005-06-10", overview: "Bruce Wayne becomes the Dark Knight to fight crime in Gotham City.", vote_average: 7.7 },
  { id: 475557, title: "Joker", poster_path: "/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg", release_date: "2019-10-01", overview: "A socially inept clown entertains sick children. As he slips into madness, he transforms into a criminal mastermind.", vote_average: 8.2 },
  { id: 315162, title: "Puss in Boots: The Last Wish", poster_path: "/kuf6dutpsT0vSVehic3EZIqkOBt.jpg", release_date: "2022-12-07", overview: "Puss in Boots discovers his passion for adventure has taken its toll when he uses up eight of his nine lives.", vote_average: 8.3 },
  { id: 423, title: "The Pianist", poster_path: "/2hFvxCCWrTmCYwfy7yum0GKRi3Y.jpg", release_date: "2002-09-17", overview: "A Polish Jewish musician struggles to survive the destruction of the Warsaw ghetto of World War II.", vote_average: 8.4 },
  { id: 489, title: "Good Will Hunting", poster_path: "/bABCBKYBK7A5G1x0FzmJIeQKtwt.jpg", release_date: "1997-12-05", overview: "A janitor at MIT is secretly a mathematical genius.", vote_average: 8.3 },
  { id: 500, title: "Reservoir Dogs", poster_path: "/xi8Iu6qyTfyZVDVy60raIOYJJmk.jpg", release_date: "1992-09-02", overview: "After a failed diamond heist, surviving criminals begin to suspect that one of them is a police informant.", vote_average: 8.1 },
  { id: 578, title: "Jaws", poster_path: "/lxM6kqilAdpdhqUl2biYp5frUxE.jpg", release_date: "1975-06-18", overview: "A great white shark terrorizes a New England resort town.", vote_average: 7.7 },
  { id: 599, title: "Taxi Driver", poster_path: "/ekstpH614fwDX8DUln1a2Opz0N8.jpg", release_date: "1976-02-08", overview: "A Vietnam War veteran becomes a taxi driver and grows increasingly disturbed by the sleaze he sees.", vote_average: 8.2 },
  { id: 620, title: "Ghostbusters", poster_path: "/6PrsIg0GeEqJMhNqNwkEKzm7RxA.jpg", release_date: "1984-06-08", overview: "Three parapsychologists start a ghost-catching business in New York City.", vote_average: 7.5 },
  { id: 644, title: "A.I. Artificial Intelligence", poster_path: "/qMi1GUzRMBuGwMvMBKPQCePgNbG.jpg", release_date: "2001-06-29", overview: "A robotic boy who was programmed to love seeks to become real.", vote_average: 7.1 },
  { id: 667, title: "Kill Bill: Vol. 1", poster_path: "/v7TaX8kXMXs5yFFGR41guUDNcnB.jpg", release_date: "2003-10-10", overview: "The Bride awakens from a coma and embarks on a mission of vengeance against her former associates.", vote_average: 8.0 },
  { id: 673, title: "Harry Potter and the Prisoner of Azkaban", poster_path: "/796oezzzFTIb98fYHkfmEmvufIt.jpg", release_date: "2004-05-31", overview: "Harry learns that a prisoner has escaped who is believed to be after him.", vote_average: 8.0 },
  { id: 1124, title: "The Prestige", poster_path: "/tRNlZbgNCNOpLpbPEz5L8G8A0JN.jpg", release_date: "2006-10-19", overview: "Two rival stage magicians engage in a battle of wits and technology.", vote_average: 8.2 },
  { id: 4935, title: "Howl's Moving Castle", poster_path: "/TkTPELv4kC3u1lkloush8skOjE.jpg", release_date: "2004-11-19", overview: "A young woman is cursed and must seek help from a wizard in his magical moving castle.", vote_average: 8.4 },
  { id: 128, title: "Princess Mononoke", poster_path: "/jHWmNr7m544fJ8eItsfNk8fs2Ed.jpg", release_date: "1997-07-12", overview: "A prince infected with a deadly curse seeks a cure in the ancient forests of Japan.", vote_average: 8.3 },
  { id: 704264, title: "Primal: Tales of Savagery", poster_path: "/tAyJl8pRwK3MFQADGshpOaGz1oF.jpg", release_date: "2019-11-21", overview: "A caveman and a dinosaur form an unlikely friendship.", vote_average: 7.3 },
  { id: 16869, title: "Inglourious Basterds", poster_path: "/7sfbEnaARXDDhKm0CZ7D7uc2sbo.jpg", release_date: "2009-08-19", overview: "A group of Jewish-American soldiers known as The Basterds plan to assassinate Nazi leaders.", vote_average: 8.2 },
  { id: 11036, title: "The Notebook", poster_path: "/rNzQyW4f8B8cQeg7Dgj3n6eT5k9.jpg", release_date: "2004-06-25", overview: "A poor yet passionate young man falls in love with a rich young woman.", vote_average: 7.9 },
  { id: 773, title: "Little Miss Sunshine", poster_path: "/wKn7AJw730emlmzLSmJtzquwaeW.jpg", release_date: "2006-07-26", overview: "A dysfunctional family takes a cross-country road trip to get their daughter to a beauty pageant.", vote_average: 7.7 },
  { id: 194662, title: "Birdman", poster_path: "/rSZs93P0LLxqlk1GGEMsOhHIuJW.jpg", release_date: "2014-10-17", overview: "A fading actor tries to reclaim his fame by writing, directing, and starring in a Broadway play.", vote_average: 7.5 },
  { id: 240832, title: "The Grand Budapest Hotel", poster_path: "/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg", release_date: "2014-02-26", overview: "A hotel concierge and his lobby boy become entangled in theft, murder, and the theft of a Renaissance painting.", vote_average: 8.1 },
  { id: 398818, title: "Call Me by Your Name", poster_path: "/nPTjj6ZfBXXBzOhm7ZgJKEiXeDK.jpg", release_date: "2017-01-26", overview: "In 1980s Italy, a romance blossoms between a 17-year-old student and his father's research assistant.", vote_average: 7.9 },
  { id: 4348, title: "The Truman Show", poster_path: "/vuza0WqY239yBXOadKlGwJsZJFE.jpg", release_date: "1998-06-04", overview: "A man discovers his entire life has been a TV show broadcast to the world.", vote_average: 8.1 },
  { id: 597, title: "Titanic", poster_path: "/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg", release_date: "1997-11-18", overview: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the ill-fated R.M.S. Titanic.", vote_average: 7.9 },
  { id: 637920, title: "Wolfwalkers", poster_path: "/ehAKuE48okTuonq6TpsNQYWrXyg.jpg", release_date: "2020-10-26", overview: "A young apprentice hunter and her father journey to Ireland to help wipe out wolves.", vote_average: 8.2 },
  { id: 98, title: "Gladiator", poster_path: "/ty8TGRuvJLPUmAR1H1nRIsgpmvI.jpg", release_date: "2000-05-01", overview: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family.", vote_average: 8.2 },
  { id: 503736, title: "Army of the Dead", poster_path: "/z8CExJekGrEThbpMXAmCFvvMJEi.jpg", release_date: "2021-05-14", overview: "A group of mercenaries venture into a quarantine zone in Las Vegas to pull off the greatest heist ever.", vote_average: 6.4 },
  { id: 118340, title: "Guardians of the Galaxy", poster_path: "/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg", release_date: "2014-07-30", overview: "A group of misfits bands together to stop a fanatical warrior from taking over the universe.", vote_average: 7.9 },
  { id: 438148, title: "Minions: The Rise of Gru", poster_path: "/wKiOkZTN9lUUUNZLmtnwubZYONg.jpg", release_date: "2022-06-29", overview: "The untold story of one twelve-year-old's dream to become the world's greatest supervillain.", vote_average: 7.0 },
  { id: 14160, title: "Up", poster_path: "/vpbaStTMt8qqXaEgnOR2EE4DNJk.jpg", release_date: "2009-05-28", overview: "An elderly widower ties thousands of balloons to his house, flying away to fulfill a lifelong dream.", vote_average: 8.0 },
  { id: 920, title: "Cars", poster_path: "/qa6HCwP4Z15l3hpsASz3auugEW6.jpg", release_date: "2006-06-08", overview: "A hot-shot race car gets stranded in a small town and discovers what's really important in life.", vote_average: 6.9 },
  { id: 10681, title: "WALL·E", poster_path: "/hbhFnRzzg6ZDmm8YAmxBnQpQIPh.jpg", release_date: "2008-06-22", overview: "In the distant future, a small waste-collecting robot embarks on a space journey that will change the fate of mankind.", vote_average: 8.1 },
  { id: 301528, title: "Toy Story 4", poster_path: "/w9kR8qbmQ01HwnivK4cHnpIIBS8.jpg", release_date: "2019-06-19", overview: "Woody has always been confident about his place in the world as Andy's favorite toy.", vote_average: 7.5 },
  { id: 508442, title: "Soul", poster_path: "/hm58Jw2Sz9qWnGV2fha019JD3Ph.jpg", release_date: "2020-12-25", overview: "A music teacher falls into the Great Before, where souls develop personalities before being sent to Earth.", vote_average: 8.0 },
];

// Categories for filtering
export const MOVIE_CATEGORIES = {
  'All Time Classics': [278, 238, 240, 424, 389, 429, 346, 510, 539],
  'Modern Masterpieces': [155, 680, 550, 157336, 27205, 496243, 244786, 568332, 872585],
  'Sci-Fi & Fantasy': [603, 78, 335984, 27205, 157336, 438631, 798286, 644],
  'Animation': [129, 862, 585, 150540, 4935, 128, 324857, 14160, 10681, 508442, 508947, 315162],
  'Superhero': [155, 272, 299534, 299536, 1726, 634649, 324857, 118340, 475557, 297762],
  'Drama': [13, 497, 637, 423, 489, 11036, 597, 398818, 4348, 773],
  'Thriller & Horror': [274, 807, 694, 745, 599, 500, 667],
  'Adventure': [120, 121, 122, 11, 1891, 329, 76341, 68718, 98],
  'Harry Potter': [671, 672, 673, 767, 12444, 12445],
  'Recent Hits': [872585, 346698, 798286, 568332, 315162, 634649],
} as const;

export function searchCuratedMovies(query: string): Movie[] {
  const lower = query.toLowerCase();
  return CURATED_MOVIES.filter(m =>
    m.title.toLowerCase().includes(lower) ||
    m.overview.toLowerCase().includes(lower) ||
    m.release_date?.includes(lower)
  );
}

export function getMoviesByCategory(category: string): Movie[] {
  const ids = MOVIE_CATEGORIES[category as keyof typeof MOVIE_CATEGORIES];
  if (!ids) return [];
  return ids.map(id => CURATED_MOVIES.find(m => m.id === id)).filter(Boolean) as Movie[];
}

export function getRandomMovies(count: number): Movie[] {
  const shuffled = [...CURATED_MOVIES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
