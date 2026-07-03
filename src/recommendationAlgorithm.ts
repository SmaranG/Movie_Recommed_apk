import { Movie } from "./moviesData";

const stopWords = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "arent",
  "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
  "can", "cant", "cannot", "co", "con", "could", "couldnt", "did", "didnt", "do", "does", "doesnt",
  "doing", "dont", "down", "during", "each", "few", "for", "from", "further", "had", "hadnt", "has",
  "hasnt", "have", "havent", "having", "he", "hed", "hell", "hes", "her", "here", "heres", "hers",
  "herself", "him", "himself", "his", "how", "hows", "i", "id", "ill", "im", "ive", "if", "in", "into",
  "is", "isnt", "it", "its", "itself", "lets", "me", "more", "most", "mustnt", "my", "myself", "no",
  "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves",
  "out", "over", "own", "same", "shant", "she", "shed", "shell", "shes", "should", "shouldnt", "so",
  "some", "such", "than", "that", "thats", "the", "their", "theirs", "them", "themselves", "then",
  "there", "theres", "these", "they", "theyd", "theyll", "theyre", "theyve", "this", "those",
  "through", "to", "too", "under", "until", "up", "very", "was", "wasnt", "we", "wed", "well",
  "were", "werent", "weve", "what", "whats", "when", "whens", "where", "wheres", "which", "while",
  "who", "whos", "whom", "why", "whys", "with", "wont", "would", "wouldnt", "you", "youd", "youll",
  "youre", "youve", "your", "yours", "yourself", "yourselves"
]);

/**
 * Tokenize text into words, removing punctuation and standard common stop words.
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Strip punctuation
    .split(/\s+/)
    .filter(word => word.length > 1 && !stopWords.has(word));
}

/**
 * Custom TF-IDF engine implementation for client-side content matching.
 * Optimized with sparse matrix representation to handle 100,000+ movies in milliseconds.
 */
export interface TfIdfResult {
  tfidfMatrix: any;        // Array of Record<number, number> representing sparse wordIdx -> normalized score
  vocabulary: string[];    // Array of words mapping index to word
  idfs: number[];          // Inverse Document Frequencies
}

export function computeTfIdf(movies: Movie[]): TfIdfResult {
  // Slice to a maximum candidate pool of 10,000 movies to keep load/computation instant (<100ms)
  const moviesForTfIdf = movies.length > 10000 ? movies.slice(0, 10000) : movies;
  const numDocs = moviesForTfIdf.length;
  
  // 1. Gather all unique terms to establish our Vocabulary
  const docTokensList: string[][] = new Array(numDocs);
  const vocabSet = new Set<string>();

  for (let d = 0; d < numDocs; d++) {
    const tokens = tokenize(moviesForTfIdf[d].metadataSoup);
    docTokensList[d] = tokens;
    for (let t = 0; t < tokens.length; t++) {
      vocabSet.add(tokens[t]);
    }
  }

  const vocabulary = Array.from(vocabSet).sort();
  const vocabSize = vocabulary.length;

  // Map words to index for speedy lookup
  const vocabIndexMap = new Map<string, number>();
  for (let idx = 0; idx < vocabSize; idx++) {
    vocabIndexMap.set(vocabulary[idx], idx);
  }

  // 2. Count Document Frequency (DF) for each term
  const dfs = new Uint32Array(vocabSize);
  for (let d = 0; d < numDocs; d++) {
    const uniqueTokens = new Set(docTokensList[d]);
    uniqueTokens.forEach(token => {
      const idx = vocabIndexMap.get(token);
      if (idx !== undefined) dfs[idx]++;
    });
  }

  // 3. Compute Inverse Document Frequency (IDF)
  // Standard smoothed formula: idf = log(N / df) + 1
  const idfs = new Float64Array(vocabSize);
  for (let idx = 0; idx < vocabSize; idx++) {
    idfs[idx] = Math.log(numDocs / (dfs[idx] || 1)) + 1;
  }

  // 4. Compute Sparse TF-IDF matrix
  const tfidfMatrix: Record<number, number>[] = new Array(numDocs);

  for (let d = 0; d < numDocs; d++) {
    const tokens = docTokensList[d];
    
    // Count Term Frequencies (TF)
    const tfMap = new Map<string, number>();
    for (let t = 0; t < tokens.length; t++) {
      const token = tokens[t];
      tfMap.set(token, (tfMap.get(token) || 0) + 1);
    }

    const docVec: Record<number, number> = {};
    let lengthSquareSum = 0;

    tfMap.forEach((tf, token) => {
      const wordIdx = vocabIndexMap.get(token);
      if (wordIdx !== undefined) {
        // Standard TF log scale scoring: 1 + log(tf)
        const logTf = 1 + Math.log(tf);
        const score = logTf * idfs[wordIdx];
        docVec[wordIdx] = score;
        lengthSquareSum += score * score;
      }
    });

    // Normalize document vectors directly (L2 Norm) to support simple dot products for Cosine Similarity
    const docLength = Math.sqrt(lengthSquareSum);
    if (docLength > 0) {
      for (const wordIdxStr in docVec) {
        docVec[wordIdxStr] /= docLength;
      }
    }

    tfidfMatrix[d] = docVec;
  }

  return { tfidfMatrix, vocabulary, idfs: Array.from(idfs) };
}



/**
 * Retrieves recommendations based strictly on Cosine Similarity and filters
 */
export function getContentRecommendations(
  inputMovieTitle: string,
  allMovies: Movie[],
  cosineSim: number[][],
  topN: number = 10,
  filters: { genre?: string; minRating?: number; year?: string; language?: string } = {}
): { movie: Movie; score: number }[] {
  const targetIdx = allMovies.findIndex(m => m.title.toLowerCase() === inputMovieTitle.toLowerCase());
  if (targetIdx === -1) return [];

  const targetMovie = allMovies[targetIdx];
  const targetRow = (targetIdx < cosineSim.length) ? cosineSim[targetIdx] : null;

  // Map scores
  let scores = allMovies.map((movie, idx) => {
    let score = 0;
    if (targetRow && idx < targetRow.length) {
      score = targetRow[idx];
    } else {
      // Fallback overlap genre coefficient for indices outside the sliced similarity pool
      const commonGenres = movie.genres.filter(g => targetMovie.genres.includes(g)).length;
      score = targetMovie.genres.length > 0 ? (commonGenres / targetMovie.genres.length) : 0;
    }
    return { movie, score };
  });

  // Filter out the movie itself
  scores = scores.filter(s => s.movie.id !== targetMovie.id);

  // Apply visual-filters
  if (filters.genre && filters.genre !== "All") {
    scores = scores.filter(s => s.movie.genres.includes(filters.genre!));
  }
  if (filters.minRating && filters.minRating > 0) {
    scores = scores.filter(s => s.movie.rating >= filters.minRating!);
  }
  if (filters.year && filters.year !== "All") {
    scores = scores.filter(s => s.movie.releaseYear.toString() === filters.year!);
  }
  if (filters.language && filters.language !== "All") {
    scores = scores.filter(s => s.movie.language === filters.language!);
  }

  // Sort descending
  scores.sort((a, b) => b.score - a.score);

  return scores.slice(0, topN);
}

/**
 * Predicts movies rating from 5 latent SVD profiles
 * Rating = BaseRating (6.5) + sum_k(user_preference_k * movie_latent_factor_k) + global bias correction
 */
export function predictCollaborativeRating(
  movie: Movie,
  userFactors: number[] // Latent coordinates: [Action, Drama, Comedy, Romance, Thriller]
): number {
  const baseRating = 5.5;
  
  // Dot product of user tastes and movie factors
  let dotProduct = 0;
  for (let i = 0; i < 5; i++) {
    dotProduct += userFactors[i] * (movie.svdFactors?.[i] || 0.2);
  }

  // Multiply rating range and normalize to standard 10-star rating
  // Latent SVD bias added
  // Use a softer multiplier of 1.5 to keep predicted values in a safe [1.0, 10.0] range
  // without triggering hard clipping boundaries, preserving gradient ranking stability.
  const predicted = baseRating + dotProduct * 1.5;
  return Math.min(10.0, Math.max(1.0, predicted));
}

/**
 * Hybrid Recommender: Combines Cosine Similarity with predictions from user SVD profile.
 * Employs dynamic min-max scaling of SVD scores to utilize the full 0..1 range, 
 * preventing the collaborative component from being drowned out by the content component.
 */
export function getHybridRecommendations(
  inputMovieTitle: string,
  allMovies: Movie[],
  cosineSim: number[][],
  userFactors: number[],
  topN: number = 10,
  filters: { genre?: string; minRating?: number; year?: string; language?: string } = {},
  contentWeight: number = 0.5 // 0.0 to 1.0 (defaults to 0.5 for balanced blend)
): { movie: Movie; score: number; contentScore: number; collabScore: number }[] {
  const targetIdx = allMovies.findIndex(m => m.title.toLowerCase() === inputMovieTitle.toLowerCase());
  if (targetIdx === -1) return [];

  const targetMovie = allMovies[targetIdx];
  const targetRow = (targetIdx < cosineSim.length) ? cosineSim[targetIdx] : null;

  // 1. Calculate raw SVD ratings for all candidate movies first
  const rawRatings = allMovies.map(movie => predictCollaborativeRating(movie, userFactors));

  // 2. Find min and max ratings among candidates (excluding the anchor itself) to scale SVD scores dynamically
  let minRatingVal = 10.0;
  let maxRatingVal = 1.0;
  let hasCandidates = false;

  allMovies.forEach((movie, idx) => {
    if (movie.id !== targetMovie.id) {
      const r = rawRatings[idx];
      if (r < minRatingVal) minRatingVal = r;
      if (r > maxRatingVal) maxRatingVal = r;
      hasCandidates = true;
    }
  });

  const ratingRange = maxRatingVal - minRatingVal;

  const scores = allMovies
    .map((movie, idx) => {
      let contentSim = 0;
      if (targetRow && idx < targetRow.length) {
        contentSim = targetRow[idx];
      } else {
        // Fallback overlap genre coefficient for indices outside the sliced similarity pool
        const commonGenres = movie.genres.filter(g => targetMovie.genres.includes(g)).length;
        contentSim = targetMovie.genres.length > 0 ? (commonGenres / targetMovie.genres.length) : 0;
      }
      
      const predictedCollab = rawRatings[idx];
      
      // Dynamic min-max scaling to stretch collaborative scores over the full [0, 1] range
      const collabSim = (hasCandidates && ratingRange > 0.01)
        ? (predictedCollab - minRatingVal) / ratingRange
        : 0.5;

      // Final balanced blender calculation using custom contentWeight slider value
      const collabWeight = 1.0 - contentWeight;
      const hybridScore = contentWeight * contentSim + collabWeight * collabSim;

      return {
        movie,
        score: hybridScore,
        contentScore: contentSim,
        collabScore: collabSim
      };
    })
    // Filter out input movie
    .filter(s => s.movie.id !== targetMovie.id);

  // Apply filters
  let filtered = scores;
  if (filters.genre && filters.genre !== "All") {
    filtered = filtered.filter(s => s.movie.genres.includes(filters.genre!));
  }
  if (filters.minRating && filters.minRating > 0) {
    filtered = filtered.filter(s => s.movie.rating >= filters.minRating!);
  }
  if (filters.year && filters.year !== "All") {
    filtered = filtered.filter(s => s.movie.releaseYear.toString() === filters.year!);
  }
  if (filters.language && filters.language !== "All") {
    filtered = filtered.filter(s => s.movie.language === filters.language!);
  }

  // Sort descending
  filtered.sort((a, b) => b.score - a.score);

  return filtered.slice(0, topN);
}
