import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Film,
  Filter,
  X,
  ChevronRight,
  Sliders,
  Check,
  RotateCcw,
  User,
  Sparkles,
  History,
  ArrowLeft,
  Bookmark,
  Heart,
  Plus,
  Trash2,
  Edit,
  Save,
  Database,
  BarChart2,
  Users,
  Settings,
  Star,
} from "lucide-react";
import { moviesData, Movie } from "./moviesData";
import {
  computeTfIdf,
  getContentRecommendations,
  predictCollaborativeRating,
  getHybridRecommendations,
} from "./recommendationAlgorithm";

import { 
  saveUserProfileToFirestore,
  deleteUserProfileFromFirestore,
  loadUserProfileFromFirestore,
  updateUserFieldInFirestore,
  isUsernameUnique,
  registerUserProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  auth,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "./firebase";

// Local state-based database and auth to keep application loading instant and 100% responsive without hanging.

// Import custom components
import { Navbar } from "./components/Navbar";
import { SpotlightHero } from "./components/SpotlightHero";
import { MovieRow } from "./components/MovieRow";
import { AdminPanel } from "./components/AdminPanel";

// Helpers
const isValidEmailAddress = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const isPasswordStrong = (password: string): { isValid: boolean; error?: string } => {
  if (password.length < 8) {
    return { isValid: false, error: "Must be at least 8 characters long." };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: "Must contain at least one uppercase letter (A-Z)." };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: "Must contain at least one lowercase letter (a-z)." };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: "Must contain at least one numeric character (0-9)." };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, error: "Must contain at least one special character." };
  }
  return { isValid: true };
};

const computeFactorsFromGenres = (selectedGenres: string[]): number[] => {
  const factors = [0.1, 0.1, 0.1, 0.1, 0.1];
  if (selectedGenres.some((g) => ["Action", "Sci-Fi", "Adventure"].includes(g))) factors[0] = 0.9;
  if (selectedGenres.some((g) => ["Drama", "Crime", "History", "Western"].includes(g))) factors[1] = 0.85;
  if (selectedGenres.some((g) => ["Comedy", "Animation", "Family", "Fantasy"].includes(g))) factors[2] = 0.8;
  if (selectedGenres.some((g) => ["Romance"].includes(g))) factors[3] = 0.95;
  if (selectedGenres.some((g) => ["Thriller", "Mystery", "Horror", "Crime"].includes(g))) factors[4] = 0.9;
  return factors;
};

export default function App() {
  // Theme state: persist across reloads, default to light
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem("cinematch_theme") || "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("cinematch_theme", theme);
  }, [theme]);

  // Dynamic movie list serving as our local database (refreshes if stored list is old/shorter than 90000 movies)
  const [movies, setMovies] = useState<Movie[]>(() => {
    try {
      const saved = localStorage.getItem("cinematch_movies_list");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 90000) {
          return parsed;
        } else {
          // Force clean outdated or shorter lists to ensure the fresh 90,000 list with working thumbnails is loaded
          localStorage.removeItem("cinematch_movies_list");
        }
      }
      return moviesData;
    } catch (e) {
      console.error("Error parsing saved movies, falling back to static moviesData", e);
      return moviesData;
    }
  });

  // Track movies with broken/expired thumbnails
  const [brokenMovieIds, setBrokenMovieIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("cinematch_broken_movie_ids");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const markMovieAsBroken = useCallback((movieId: number) => {
    setBrokenMovieIds((prev) => {
      if (prev.includes(movieId)) return prev;
      const next = [...prev, movieId];
      localStorage.setItem("cinematch_broken_movie_ids", JSON.stringify(next));
      return next;
    });
  }, []);

  const activeMovies = useMemo(() => {
    return movies.filter((movie) => {
      const hasBackdrop = movie.backdropUrl && movie.backdropUrl.trim() !== "";
      const hasPoster = movie.posterUrl && movie.posterUrl.trim() !== "";
      const isBroken = brokenMovieIds.includes(movie.id);
      return hasBackdrop && hasPoster && !isBroken;
    });
  }, [movies, brokenMovieIds]);

  // Preload and compute ML structures on load from the dynamic database
  const tfIdfResult = useMemo(() => computeTfIdf(activeMovies), [activeMovies]);
  const cosineSimMatrix = useMemo(() => {
    const cache: Record<number, number[]> = {};
    const tfIdfMatrix = tfIdfResult.tfidfMatrix;
    const numMovies = tfIdfMatrix.length;

    return new Proxy({} as any, {
      get(target, prop) {
        if (prop === "length") return numMovies;
        if (typeof prop === "symbol") return (target as any)[prop];
        const rowIdx = parseInt(prop as string, 10);
        if (isNaN(rowIdx)) return (target as any)[prop];

        if (cache[rowIdx]) return cache[rowIdx];

        const vecA = tfIdfMatrix[rowIdx];
        const row = new Array(numMovies);
        if (vecA) {
          const entriesA = Object.entries(vecA).map(([k, v]) => [parseInt(k, 10), v] as [number, number]);
          for (let j = 0; j < numMovies; j++) {
            if (rowIdx === j) {
              row[j] = 1.0;
            } else {
              let dotProduct = 0;
              const vecB = tfIdfMatrix[j];
              if (vecB) {
                for (let k = 0; k < entriesA.length; k++) {
                  const [wordIdx, valA] = entriesA[k];
                  const valB = vecB[wordIdx];
                  if (valB !== undefined) {
                    dotProduct += valA * valB;
                  }
                }
              }
              row[j] = dotProduct;
            }
          }
        } else {
          row.fill(0);
        }
        cache[rowIdx] = row;
        return row;
      },
    });
  }, [tfIdfResult]);

  // User and Admin Roles States
  const [currentUserRole, setCurrentUserRole] = useState<"user" | "admin">("user");
  const [loginRole, setLoginRole] = useState<"user" | "admin">("user");
  const [adminMovieForm, setAdminMovieForm] = useState<Partial<Movie> | null>(null);

  // Auth & Onboarding States
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [onboardingStep, setOnboardingStep] = useState<"login" | "genres">("login");
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>(""); // unique username state

  // Profile Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [tempFirstName, setTempFirstName] = useState<string>("");
  const [tempLastName, setTempLastName] = useState<string>("");
  const [tempEmail, setTempEmail] = useState<string>("");
  const [tempGenres, setTempGenres] = useState<string[]>([]);
  const [tempError, setTempError] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>(() => {
    return sessionStorage.getItem("cinematch_user_email") || "";
  });

  useEffect(() => {
    sessionStorage.setItem("cinematch_user_email", userEmail);
  }, [userEmail]);

  const isRegisteringRef = React.useRef<boolean>(false);

  const handleGoogleSignIn = async () => {
    setLoginError(null);
    isRegisteringRef.current = true;
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const uid = result.user.uid;
      const email = result.user.email || "";

      // Pull profile or register a new one if it doesn't exist
      let profile = await loadUserProfileFromFirestore(uid);
      if (!profile) {
        const defaultUsername = (email.split("@")[0] || "user").replace(/[^a-zA-Z0-9_]/g, "") + "_" + Math.floor(Math.random() * 1000);
        try {
          profile = await registerUserProfile(
            uid,
            email,
            defaultUsername,
            result.user.displayName?.split(" ")[0] || "User",
            result.user.displayName?.split(" ").slice(1).join(" ") || ""
          );
        } catch (regErr) {
          console.error("Auto-registration with Google failed:", regErr);
          setLoginError("Your Google authentication was successful, but we could not set up your user profile doc in Firestore.");
          await signOut(auth);
          return;
        }
      }

      if (profile && !profile.email && email) {
        try {
          await saveUserProfileToFirestore(uid, { email });
          profile.email = email;
        } catch (err) {
          console.error("Failed to auto-heal profile email in Firestore:", err);
        }
      }

      // Load fields
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setUsername(profile.username || "");
      setUserEmail(profile.email || email || "");
      const lowerEmail = (profile.email || email || "").toLowerCase();
      const isOwnerAdmin = lowerEmail === "smarangamal2023@gmail.com" || lowerEmail.startsWith("admin@") || lowerEmail.includes("admin");
      const resolvedRole = profile.role || (isOwnerAdmin ? "admin" : "user");
      setCurrentUserRole(resolvedRole);
      setSelectedUserGenres(profile.selectedGenres || []);
      setFavorites(profile.favorites || []);
      setWatchlist(profile.watchlist || []);
      setWatchHistory(profile.watchHistory || []);
      setSearchHistory(profile.searchHistory || []);
      setRatings(profile.ratings || {});
      
      setCurrentUser(uid);
      sessionStorage.setItem("cinematch_user", uid);
      sessionStorage.setItem("cinematch_role", resolvedRole);

      if (resolvedRole === "admin") {
        setIsOnboarded(true);
      } else {
        const savedGenres = profile.selectedGenres || [];
        if (savedGenres.length >= 1) {
          const customFactors = computeFactorsFromGenres(savedGenres);
          setUserFactors(customFactors);
          const matchedMovie = moviesData.find((m) =>
            m.genres.some((g) => savedGenres.includes(g))
          ) || moviesData[0];
          setSelectedMovieTitle(matchedMovie.title);
          setIsOnboarded(true);
        } else {
          setOnboardingStep("genres");
        }
      }
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      setLoginError(err.message || "An error occurred during Google Sign-In.");
    } finally {
      isRegisteringRef.current = false;
    }
  };
  const [selectedUserGenres, setSelectedUserGenres] = useState<string[]>([]);

  const [firstName, setFirstName] = useState<string>(() => {
    return sessionStorage.getItem("cinematch_first_name") || "";
  });
  const [lastName, setLastName] = useState<string>(() => {
    return sessionStorage.getItem("cinematch_last_name") || "";
  });

  useEffect(() => {
    sessionStorage.setItem("cinematch_first_name", firstName);
  }, [firstName]);

  useEffect(() => {
    sessionStorage.setItem("cinematch_last_name", lastName);
  }, [lastName]);

  useEffect(() => {
    if (isProfileModalOpen) {
      setTempFirstName(firstName || "");
      setTempLastName(lastName || "");
      setTempEmail(userEmail || "");
      setTempGenres(selectedUserGenres || []);
      setTempError(null);
    }
  }, [isProfileModalOpen, firstName, lastName, userEmail, selectedUserGenres]);

  // AI recommendations states
  const [aiPromptInput, setAiPromptInput] = useState<string>("");
  const [isGeneratingAiRecs, setIsGeneratingAiRecs] = useState<boolean>(false);
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [aiIntroMessage, setAiIntroMessage] = useState<string>("");
  const [aiError, setAiError] = useState<string | null>(null);

  const handleGenerateAiRecommendations = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiPromptInput.trim()) return;

    setIsGeneratingAiRecs(true);
    setAiError(null);
    setAiRecommendations([]);
    setAiIntroMessage("");

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userPrompt: aiPromptInput,
          selectedGenres: selectedUserGenres,
          favorites: favorites,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate AI recommendations.");
      }

      // Map the recommended movie titles to real movies in moviesData if possible!
      const mappedRecs = (data.recommendations || []).map((rec: any) => {
        const matchedMovie = moviesData.find(m => 
          m.title.toLowerCase().includes(rec.title.toLowerCase()) ||
          rec.title.toLowerCase().includes(m.title.toLowerCase())
        );

        if (matchedMovie) {
          return {
            ...matchedMovie,
            aiReason: rec.reason,
            aiMatchPercentage: rec.matchPercentage,
            aiGenre: rec.genre,
          };
        } else {
          const randomId = 800000 + Math.floor(Math.random() * 100000);
          const pImages = [
            "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=500&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=500&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&auto=format&fit=crop"
          ];
          const bImages = [
            "https://images.unsplash.com/photo-1542204172-e70528091f50?w=1600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1600&auto=format&fit=crop"
          ];
          return {
            id: randomId,
            title: rec.title,
            genres: [rec.genre || "Drama"],
            keywords: ["ai-pick", "matchmaker"],
            cast: ["CineMatch AI Special Choice"],
            director: "CineMatch AI Agent",
            overview: rec.reason,
            rating: parseFloat(((rec.matchPercentage || 90) / 10).toFixed(1)),
            releaseYear: 2026,
            popularity: 85.0,
            language: "en",
            posterUrl: pImages[randomId % pImages.length],
            backdropUrl: bImages[randomId % bImages.length],
            trailerKey: "dQw4w9WgXcQ",
            metadataSoup: `${rec.title.toLowerCase()} ai recommendation`,
            svdFactors: [0.5, 0.5, 0.5, 0.5, 0.5],
            aiReason: rec.reason,
            aiMatchPercentage: rec.matchPercentage,
            aiGenre: rec.genre,
          };
        }
      });

      setAiRecommendations(mappedRecs);
      setAiIntroMessage(data.message || "Here are your custom AI recommendations!");
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Failed to reach AI Recommendation engine.");
    } finally {
      setIsGeneratingAiRecs(false);
    }
  };

  // Filters
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
  const [minRating, setMinRating] = useState<number>(0.0);
  const [selectedYear, setSelectedYear] = useState<string>("All");

  const [hybridContentWeight, setHybridContentWeight] = useState<number>(() => {
    const saved = localStorage.getItem("cinematch_hybrid_content_weight");
    return saved ? parseFloat(saved) : 0.4; // Default to 40% Content / 60% SVD for more active taste response
  });

  const [userFactors, setUserFactors] = useState<number[]>(() => {
    const saved = sessionStorage.getItem("cinematch_factors");
    return saved ? JSON.parse(saved) : [0.5, 0.4, 0.2, 0.1, 0.5];
  });

  const [selectedMovieTitle, setSelectedMovieTitle] = useState<string>(() => {
    const saved = sessionStorage.getItem("cinematch_selected_genres");
    if (saved) {
      try {
        const parsedGenres: string[] = JSON.parse(saved);
        if (parsedGenres.length > 0) {
          const matched = moviesData.find((m) => m.genres.some((g) => parsedGenres.includes(g)));
          if (matched) return matched.title;
        }
      } catch (e) {}
    }
    return "Inception";
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = sessionStorage.getItem("cinematch_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const saved = sessionStorage.getItem("cinematch_watchlist");
    return saved ? JSON.parse(saved) : [];
  });

  const [watchHistory, setWatchHistory] = useState<string[]>(() => {
    const saved = sessionStorage.getItem("cinematch_watch_history");
    return saved ? JSON.parse(saved) : [];
  });

  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = sessionStorage.getItem("cinematch_search_history");
    return saved ? JSON.parse(saved) : [];
  });

  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    const saved = sessionStorage.getItem("cinematch_ratings");
    return saved ? JSON.parse(saved) : {};
  });

  const [activeNavTab, setActiveNavTab] = useState<"home" | "mylist" | "admin">("home");

   const [activeTrailerKey, setActiveTrailerKey] = useState<string | null>(null);
  const [recommendationStrategy, setRecommendationStrategy] = useState<"content" | "collaborative" | "hybrid">("hybrid");
  const [recommendationCount, setRecommendationCount] = useState<number>(12);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Listen to Auth state and load user profile from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          let profile = await loadUserProfileFromFirestore(firebaseUser.uid);
          if (!profile) {
            if (isRegisteringRef.current) {
              // Active registration is in progress. Wait and poll for the Firestore profile document
              for (let i = 0; i < 15; i++) {
                await new Promise((resolve) => setTimeout(resolve, 500));
                profile = await loadUserProfileFromFirestore(firebaseUser.uid);
                if (profile) break;
              }
            } else {
              // Wait 1.5 seconds and retry in case standard registration Firestore write is still finishing
              await new Promise((resolve) => setTimeout(resolve, 1500));
              profile = await loadUserProfileFromFirestore(firebaseUser.uid);
            }
          }

          if (profile) {
            if (!profile.email && firebaseUser.email) {
              try {
                await saveUserProfileToFirestore(firebaseUser.uid, { email: firebaseUser.email });
                profile.email = firebaseUser.email;
              } catch (err) {
                console.error("Failed to auto-heal profile email in Firestore:", err);
              }
            }

            setCurrentUser(firebaseUser.uid);
            setFirstName(profile.firstName || "");
            setLastName(profile.lastName || "");
            setUsername(profile.username || "");
            setUserEmail(profile.email || firebaseUser.email || "");
            const lowerEmail = (profile.email || firebaseUser.email || "").toLowerCase();
            const isOwnerAdmin = lowerEmail === "smarangamal2023@gmail.com" || lowerEmail.startsWith("admin@") || lowerEmail.includes("admin");
            const resolvedRole = profile.role || (isOwnerAdmin ? "admin" : "user");
            setCurrentUserRole(resolvedRole);
            
            const savedGenres = profile.selectedGenres || [];
            setSelectedUserGenres(savedGenres);
            setFavorites(profile.favorites || []);
            setWatchlist(profile.watchlist || []);
            setWatchHistory(profile.watchHistory || []);
            setSearchHistory(profile.searchHistory || []);
            setRatings(profile.ratings || {});
            
            sessionStorage.setItem("cinematch_user", firebaseUser.uid);
            sessionStorage.setItem("cinematch_role", resolvedRole);

            if (resolvedRole === "admin") {
              setIsOnboarded(true);
            } else if (savedGenres.length >= 1) {
              const customFactors = computeFactorsFromGenres(savedGenres);
              setUserFactors(customFactors);
              const matchedMovie = moviesData.find((m) =>
                m.genres.some((g) => savedGenres.includes(g))
              ) || moviesData[0];
              setSelectedMovieTitle(matchedMovie.title);
              setIsOnboarded(true);
            } else {
              setOnboardingStep("genres");
              setIsOnboarded(false);
            }
          } else {
            // Profile doc missing from Firestore, and we are NOT actively registering, auto sign out
            if (!isRegisteringRef.current) {
              await signOut(auth);
              setCurrentUser(null);
              setUserEmail("");
              setIsOnboarded(false);
              setOnboardingStep("login");
              setFirstName("");
              setLastName("");
              setUsername("");
              setLoginEmail("");
              setLoginPassword("");
            }
          }
        } catch (e) {
          console.error("Error loading user profile from Firestore:", e);
        }
      } else {
        const cachedUser = sessionStorage.getItem("cinematch_user");
        if (cachedUser === "Guest User") {
          setCurrentUser("Guest User");
          setIsOnboarded(sessionStorage.getItem("cinematch_onboarded") === "true");
          const savedGenres = sessionStorage.getItem("cinematch_selected_genres");
          if (savedGenres) setSelectedUserGenres(JSON.parse(savedGenres));
          const savedFavorites = sessionStorage.getItem("cinematch_favorites");
          if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
          const savedWatchlist = sessionStorage.getItem("cinematch_watchlist");
          if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
          const savedHistory = sessionStorage.getItem("cinematch_watch_history");
          if (savedHistory) setWatchHistory(JSON.parse(savedHistory));
          const savedSearch = sessionStorage.getItem("cinematch_search_history");
          if (savedSearch) setSearchHistory(JSON.parse(savedSearch));
          const savedRatings = sessionStorage.getItem("cinematch_ratings");
          if (savedRatings) setRatings(JSON.parse(savedRatings));
        } else {
          setCurrentUser(null);
          setUserEmail("");
          setIsOnboarded(false);
          setOnboardingStep("login");
          setFirstName("");
          setLastName("");
          setUsername("");
          setLoginEmail("");
          setLoginPassword("");
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync state changes to local storage/session storage and Firestore
  useEffect(() => {
    if (currentUser === "Guest User") {
      sessionStorage.setItem("cinematch_favorites", JSON.stringify(favorites));
    } else if (currentUser) {
      updateUserFieldInFirestore(currentUser, "favorites", favorites);
    }
  }, [favorites, currentUser]);

  useEffect(() => {
    if (currentUser === "Guest User") {
      sessionStorage.setItem("cinematch_watchlist", JSON.stringify(watchlist));
    } else if (currentUser) {
      updateUserFieldInFirestore(currentUser, "watchlist", watchlist);
    }
  }, [watchlist, currentUser]);

  useEffect(() => {
    if (currentUser === "Guest User") {
      sessionStorage.setItem("cinematch_watch_history", JSON.stringify(watchHistory));
    } else if (currentUser) {
      updateUserFieldInFirestore(currentUser, "watchHistory", watchHistory);
    }
  }, [watchHistory, currentUser]);

  useEffect(() => {
    if (currentUser === "Guest User") {
      sessionStorage.setItem("cinematch_search_history", JSON.stringify(searchHistory));
    } else if (currentUser) {
      updateUserFieldInFirestore(currentUser, "searchHistory", searchHistory);
    }
  }, [searchHistory, currentUser]);

  useEffect(() => {
    if (currentUser === "Guest User") {
      sessionStorage.setItem("cinematch_ratings", JSON.stringify(ratings));
    } else if (currentUser) {
      updateUserFieldInFirestore(currentUser, "ratings", ratings);
    }
  }, [ratings, currentUser]);

  useEffect(() => {
    if (currentUser === "Guest User") {
      sessionStorage.setItem("cinematch_factors", JSON.stringify(userFactors));
    }
  }, [userFactors, currentUser]);

  const genresList = useMemo(() => {
    const set = new Set<string>();
    activeMovies.forEach((m) => m.genres.forEach((g) => set.add(g)));
    return ["All", ...Array.from(set).sort()];
  }, [activeMovies]);

  const yearsList = useMemo(() => {
    const set = new Set<string>();
    activeMovies.forEach((m) => set.add(m.releaseYear.toString()));
    return ["All", ...Array.from(set).sort((a, b) => b.localeCompare(a))];
  }, [activeMovies]);

  const languagesList = useMemo(() => {
    const set = new Set<string>();
    activeMovies.forEach((m) => set.add(m.language));
    return ["All", ...Array.from(set).sort()];
  }, [activeMovies]);

  // Compute recommendations
  const computedRecommendations = useMemo(() => {
    const filters = {
      genre: selectedGenre,
      minRating: minRating,
      year: selectedYear,
      language: selectedLanguage,
    };

    if (recommendationStrategy === "content") {
      return getContentRecommendations(
        selectedMovieTitle,
        activeMovies,
        cosineSimMatrix,
        recommendationCount,
        filters
      ).map((rec) => ({
        ...rec,
        scoreLabel: "Similarity",
        displayScore: `${Math.round(rec.score * 100)}%`,
      }));
    } else if (recommendationStrategy === "collaborative") {
      let scores = activeMovies
        .filter((m) => m.title !== selectedMovieTitle)
        .map((movie) => {
          const predictedRating = predictCollaborativeRating(movie, userFactors);
          const percent = predictedRating / 10.0;
          return {
            movie,
            score: percent,
            contentScore: 0,
            collabScore: percent,
          };
        });

      if (selectedGenre !== "All") {
        scores = scores.filter((s) => s.movie.genres.includes(selectedGenre));
      }
      if (minRating > 0) {
        scores = scores.filter((s) => s.movie.rating >= minRating);
      }
      if (selectedYear !== "All") {
        scores = scores.filter((s) => s.movie.releaseYear.toString() === selectedYear);
      }
      if (selectedLanguage !== "All") {
        scores = scores.filter((s) => s.movie.language === selectedLanguage);
      }

      scores.sort((a, b) => b.score - a.score);
      return scores.slice(0, recommendationCount).map((rec) => ({
        movie: rec.movie,
        score: rec.score,
        scoreLabel: "SVD predicted",
        displayScore: `${(rec.score * 10.0).toFixed(1)} / 10`,
      }));
    } else {
      const recs = getHybridRecommendations(
        selectedMovieTitle,
        activeMovies,
        cosineSimMatrix,
        userFactors,
        recommendationCount,
        filters,
        hybridContentWeight
      );
      return recs.map((rec) => ({
        movie: rec.movie,
        score: rec.score,
        scoreLabel: "Hybrid Match",
        displayScore: `${Math.round(rec.score * 100)}%`,
      }));
    }
  }, [
    selectedMovieTitle,
    recommendationStrategy,
    selectedGenre,
    selectedYear,
    selectedLanguage,
    minRating,
    userFactors,
    hybridContentWeight,
    recommendationCount,
    cosineSimMatrix,
    activeMovies,
  ]);

  const highlightedMovie = useMemo(() => {
    return activeMovies.find((m) => m.title.toLowerCase() === selectedMovieTitle.toLowerCase()) || activeMovies[0];
  }, [selectedMovieTitle, activeMovies]);

  // Map recommended movies lists
  const recommendedMovies = useMemo(() => {
    return computedRecommendations.map((rec) => rec.movie);
  }, [computedRecommendations]);

  const recommendedMetadataMap = useMemo(() => {
    const map: { [key: string]: { displayScore: string; scoreLabel: string } } = {};
    computedRecommendations.forEach((rec) => {
      map[rec.movie.title] = {
        displayScore: rec.displayScore,
        scoreLabel: rec.scoreLabel,
      };
    });
    return map;
  }, [computedRecommendations]);

  // Favorites list mapped
  const favoritesMovies = useMemo(() => {
    return activeMovies.filter((m) => favorites.includes(m.title));
  }, [favorites, activeMovies]);

  // Watchlist list mapped
  const watchlistMovies = useMemo(() => {
    return activeMovies.filter((m) => watchlist.includes(m.title));
  }, [watchlist, activeMovies]);

  // Watch History list mapped in reverse/recency order
  const watchHistoryMovies = useMemo(() => {
    return watchHistory
      .map((title) => activeMovies.find((m) => m.title === title))
      .filter((m): m is Movie => !!m);
  }, [watchHistory, activeMovies]);

  // User rated movies mapped
  const ratedMovies = useMemo(() => {
    return activeMovies.filter((m) => ratings[m.title] !== undefined);
  }, [ratings, activeMovies]);

  // Compute highly personalized recommendations based on all 4 signals: Search History, Watch History, Liked, and Saved to Wishlist
  const personalizedRecommendations = useMemo(() => {
    const numMovies = activeMovies.length;
    
    // Profiles for each signal
    const vecFavorites = new Float64Array(numMovies);
    const vecWatchlist = new Float64Array(numMovies);
    const vecWatchHistory = new Float64Array(numMovies);
    const vecSearchHistory = new Float64Array(numMovies);

    let weightFavorites = 0;
    let weightWatchlist = 0;
    let weightWatchHistory = 0;
    let weightSearchHistory = 0;

    // 1. Liked (favorites) profile accumulation
    favorites.forEach((title) => {
      const idx = activeMovies.findIndex(m => m.title.toLowerCase() === title.toLowerCase());
      if (idx !== -1) {
        const weight = 1.0;
        weightFavorites += weight;
        const row = cosineSimMatrix[idx];
        if (row) {
          for (let j = 0; j < numMovies; j++) {
            vecFavorites[j] += row[j] * weight;
          }
        }
      }
    });

    // 2. Saved to Wishlist (watchlist) profile accumulation
    watchlist.forEach((title) => {
      const idx = activeMovies.findIndex(m => m.title.toLowerCase() === title.toLowerCase());
      if (idx !== -1) {
        const weight = 1.0;
        weightWatchlist += weight;
        const row = cosineSimMatrix[idx];
        if (row) {
          for (let j = 0; j < numMovies; j++) {
            vecWatchlist[j] += row[j] * weight;
          }
        }
      }
    });

    // 3. Watch History profile accumulation (recency-decay weighted)
    const watchCount = Math.min(watchHistory.length, 10);
    for (let i = 0; i < watchCount; i++) {
      const title = watchHistory[i];
      const idx = activeMovies.findIndex(m => m.title.toLowerCase() === title.toLowerCase());
      if (idx !== -1) {
        const weight = Math.max(0.2, 1.0 - i * 0.1); // Linear recency decay
        weightWatchHistory += weight;
        const row = cosineSimMatrix[idx];
        if (row) {
          for (let j = 0; j < numMovies; j++) {
            vecWatchHistory[j] += row[j] * weight;
          }
        }
      }
    }

    // 4. Search History profile accumulation (recency-decay weighted)
    const searchCount = Math.min(searchHistory.length, 10);
    for (let i = 0; i < searchCount; i++) {
      const query = searchHistory[i].trim().toLowerCase();
      if (!query) continue;

      const idx = activeMovies.findIndex(m => m.title.toLowerCase() === query);
      if (idx !== -1) {
        const weight = Math.max(0.2, 1.0 - i * 0.1);
        weightSearchHistory += weight;
        const row = cosineSimMatrix[idx];
        if (row) {
          for (let j = 0; j < numMovies; j++) {
            vecSearchHistory[j] += row[j] * weight;
          }
        }
      } else {
        const queryTokens = query.split(/\s+/).filter(t => t.length > 2);
        if (queryTokens.length > 0) {
          const weight = Math.max(0.15, 0.8 - i * 0.08);
          let matchedCount = 0;
          for (let mIdx = 0; mIdx < numMovies; mIdx++) {
            const m = activeMovies[mIdx];
            const titleMatch = m.title.toLowerCase().includes(query);
            const genreMatch = m.genres.some(g => g.toLowerCase().includes(query));
            const castMatch = m.cast ? m.cast.some(c => c.toLowerCase().includes(query)) : false;

            if (titleMatch || genreMatch || castMatch) {
              vecSearchHistory[mIdx] += weight * 0.5;
              matchedCount++;
              const row = cosineSimMatrix[mIdx];
              if (row && matchedCount < 3) {
                for (let j = 0; j < numMovies; j++) {
                  vecSearchHistory[j] += row[j] * weight * 0.2;
                }
              }
            }
          }
          if (matchedCount > 0) {
            weightSearchHistory += weight;
          }
        }
      }
    }

    // Normalize each active profile to 0..1 scale (dividing by its total accumulated weight)
    if (weightFavorites > 0) {
      for (let j = 0; j < numMovies; j++) {
        vecFavorites[j] /= weightFavorites;
      }
    }
    if (weightWatchlist > 0) {
      for (let j = 0; j < numMovies; j++) {
        vecWatchlist[j] /= weightWatchlist;
      }
    }
    if (weightWatchHistory > 0) {
      for (let j = 0; j < numMovies; j++) {
        vecWatchHistory[j] /= weightWatchHistory;
      }
    }
    if (weightSearchHistory > 0) {
      for (let j = 0; j < numMovies; j++) {
        vecSearchHistory[j] /= weightSearchHistory;
      }
    }

    // Late fusion with static importance coefficients
    const coeffFav = 0.35;
    const coeffWl  = 0.25;
    const coeffWh  = 0.25;
    const coeffSh  = 0.15;

    let totalActiveCoeff = 0;
    if (weightFavorites > 0) totalActiveCoeff += coeffFav;
    if (weightWatchlist > 0) totalActiveCoeff += coeffWl;
    if (weightWatchHistory > 0) totalActiveCoeff += coeffWh;
    if (weightSearchHistory > 0) totalActiveCoeff += coeffSh;

    if (totalActiveCoeff === 0) {
      if (selectedUserGenres.length > 0) {
        return activeMovies
          .filter((m) => m.genres.some((g) => selectedUserGenres.includes(g)))
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 15);
      }
      return [];
    }

    const favoritesSet = new Set(favorites.map(t => t.toLowerCase()));
    const watchlistSet = new Set(watchlist.map(t => t.toLowerCase()));
    const watchHistorySet = new Set(watchHistory.map(t => t.toLowerCase()));

    const scored = activeMovies
      .map((movie, idx) => {
        let similaritySum = 0;
        if (weightFavorites > 0) similaritySum += vecFavorites[idx] * coeffFav;
        if (weightWatchlist > 0) similaritySum += vecWatchlist[idx] * coeffWl;
        if (weightWatchHistory > 0) similaritySum += vecWatchHistory[idx] * coeffWh;
        if (weightSearchHistory > 0) similaritySum += vecSearchHistory[idx] * coeffSh;

        const normalizedSimilarity = similaritySum / totalActiveCoeff;
        
        // Blend normalized similarity with movie rating (popularity/quality filter)
        const ratingFactor = movie.rating / 10.0;
        const score = normalizedSimilarity * 0.8 + ratingFactor * 0.2;

        return { movie, score };
      })
      .filter(s => !favoritesSet.has(s.movie.title.toLowerCase()) && 
                   !watchlistSet.has(s.movie.title.toLowerCase()) && 
                   !watchHistorySet.has(s.movie.title.toLowerCase()))
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, 15).map(s => s.movie);
  }, [favorites, watchlist, watchHistory, searchHistory, cosineSimMatrix, activeMovies]);

  // Popular movies list (filtered and sliced)
  const trendingMovies = useMemo(() => {
    let list = [...activeMovies];
    if (selectedGenre !== "All") {
      list = list.filter((m) => m.genres.includes(selectedGenre));
    }
    if (minRating > 0) {
      list = list.filter((m) => m.rating >= minRating);
    }
    if (selectedYear !== "All") {
      list = list.filter((m) => m.releaseYear.toString() === selectedYear);
    }
    if (selectedLanguage !== "All") {
      list = list.filter((m) => m.language === selectedLanguage);
    }
    return list.sort((a, b) => b.popularity - a.popularity).slice(0, 15);
  }, [selectedGenre, minRating, selectedYear, selectedLanguage, activeMovies]);

  // Top IMDb Rated movies list (filtered and sliced)
  const topRatedMovies = useMemo(() => {
    let list = [...activeMovies];
    if (selectedGenre !== "All") {
      list = list.filter((m) => m.genres.includes(selectedGenre));
    }
    if (minRating > 0) {
      list = list.filter((m) => m.rating >= minRating);
    }
    if (selectedYear !== "All") {
      list = list.filter((m) => m.releaseYear.toString() === selectedYear);
    }
    if (selectedLanguage !== "All") {
      list = list.filter((m) => m.language === selectedLanguage);
    }
    return list.sort((a, b) => b.rating - a.rating).slice(0, 15);
  }, [selectedGenre, minRating, selectedYear, selectedLanguage, activeMovies]);

  const addToWatchHistory = (title: string) => {
    if (!title) return;
    setWatchHistory((prev) => {
      const filtered = prev.filter((t) => t.toLowerCase() !== title.toLowerCase());
      return [title, ...filtered].slice(0, 24);
    });
  };

  const addToSearchHistory = (query: string) => {
    if (!query) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((q) => q.toLowerCase() !== query.toLowerCase());
      return [query, ...filtered].slice(0, 15);
    });
  };

  const selectQueryMovie = (title: string) => {
    setSelectedMovieTitle(title);
    addToWatchHistory(title);
    const container = document.getElementById("main-root");
    if (container) {
      container.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePlayTrailer = (trailerKey: string) => {
    setActiveTrailerKey(trailerKey);
    const matched = movies.find((m) => m.trailerKey === trailerKey);
    if (matched) {
      addToWatchHistory(matched.title);
    }
  };

  const toggleFavorite = (title: string) => {
    if (favorites.includes(title)) {
      setFavorites((prev) => prev.filter((f) => f !== title));
    } else {
      setFavorites((prev) => [...prev, title]);
    }
  };

  const toggleWatchlist = (title: string) => {
    if (watchlist.includes(title)) {
      setWatchlist((prev) => prev.filter((w) => w !== title));
    } else {
      setWatchlist((prev) => [...prev, title]);
    }
  };

  const handleRateMovie = (title: string, ratingValue: number) => {
    setRatings((prev) => {
      const next = { ...prev };
      if (ratingValue === 0) {
        delete next[title];
      } else {
        next[title] = ratingValue;
      }
      return next;
    });
  };

  // Admin CRUD actions
  const handleSaveMovie = (saved: Movie) => {
    setMovies((prevMovies) => {
      let nextMovies;
      const index = prevMovies.findIndex((m) => m.id === saved.id);
      if (index !== -1) {
        nextMovies = [...prevMovies];
        nextMovies[index] = saved;
      } else {
        nextMovies = [saved, ...prevMovies];
      }
      try {
        localStorage.setItem("cinematch_movies_list", JSON.stringify(nextMovies));
      } catch (err) {
        console.warn("Storage limit exceeded (90,000 movies). Keeping changes active in-memory.", err);
      }
      return nextMovies;
    });
    setAdminMovieForm(null);
  };

  const handleDeleteMovie = (id: number) => {
    setMovies((prevMovies) => {
      const nextMovies = prevMovies.filter((m) => m.id !== id);
      try {
        localStorage.setItem("cinematch_movies_list", JSON.stringify(nextMovies));
      } catch (err) {
        console.warn("Storage limit exceeded (90,000 movies). Keeping changes active in-memory.", err);
      }
      return nextMovies;
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Firebase signOut error:", e);
    }
    sessionStorage.clear();
    setCurrentUser(null);
    setUserEmail("");
    setSelectedUserGenres([]);
    setUserFactors([0.5, 0.4, 0.2, 0.1, 0.5]);
    setFavorites([]);
    setWatchlist([]);
    setWatchHistory([]);
    setSearchHistory([]);
    setRatings({});
    setActiveNavTab("home");
    setLoginEmail("");
    setLoginPassword("");
    setUsername("");
    setFirstName("");
    setLastName("");
    setLoginError(null);
    setOnboardingStep("login");
    setIsOnboarded(false);
  };

  const handleUpdateTastes = () => {
    setIsProfileModalOpen(true);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedGenre("All");
    setSelectedLanguage("All");
    setMinRating(0.0);
    setSelectedYear("All");
  };

  // Handle updates to SVD latent tastes dimensions
  const handleSvdFactorChange = (index: number, val: number) => {
    setUserFactors((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  if (!isOnboarded) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0c0c11] text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden" id="onboarding-root">
        {/* Theme toggler */}
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={toggleTheme}
            className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-gray-750 text-slate-900 dark:text-slate-100 rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-semibold shadow-lg shadow-black/10 animate-fade-in"
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>

        {/* Ambient lights */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-red-800/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>

        <div className="w-full max-w-2xl bg-white dark:bg-[#0f0f16]/95 border border-gray-250 dark:border-white/10 backdrop-blur-xl rounded-[1.75rem] p-6 md:p-8 shadow-2xl relative z-10 animate-fade-in flex flex-col items-center justify-center text-slate-900 dark:text-slate-100" id="onboarding-card">
          <div className="flex items-center gap-3 justify-center mb-6">
            <div className="bg-red-600 p-2.5 rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-[0.24em] text-red-600" style={{ fontFamily: "var(--font-display)" }}>
                CINEMATCH
              </h1>
              <p className="text-[9px] text-slate-500 dark:text-white/45 uppercase tracking-widest font-mono">Personalized recommender profile</p>
            </div>
          </div>

          {onboardingStep === "login" && (
            <div className="space-y-6 w-full" id="onboarding-login-step">
              <div className="text-center space-y-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Let's personalize your cinematic journey</h2>
                <p className="text-xs text-slate-500 dark:text-white/50 max-w-md mx-auto leading-relaxed">
                  Sign in or create a profile to configure your custom recommendation parameters, favorite lists, and taste states.
                </p>
              </div>

              <div className="bg-gray-100 dark:bg-slate-800 p-1.5 rounded-xl border border-gray-250 dark:border-white/10 flex gap-1 max-w-xs mx-auto shadow-sm">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setLoginError(null);
                    setLoginEmail("");
                    setLoginPassword("");
                    setUsername("");
                    setFirstName("");
                    setLastName("");
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${!isSignUp ? "bg-red-600 text-white shadow shadow-red-600/20" : "text-slate-500 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white"}`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setLoginError(null);
                    setLoginEmail("");
                    setLoginPassword("");
                    setUsername("");
                    setFirstName("");
                    setLastName("");
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${isSignUp ? "bg-red-600 text-white shadow shadow-red-600/20" : "text-slate-500 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white"}`}
                >
                  Create Account
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoginError(null);

                  const email = loginEmail.trim().toLowerCase();
                  const password = loginPassword;

                  if (!email) {
                    setLoginError("Please enter your email address.");
                    return;
                  }
                  if (!isValidEmailAddress(email)) {
                    setLoginError("Please enter a valid email address.");
                    return;
                  }
                  if (!password) {
                    setLoginError("Please enter a password.");
                    return;
                  }

                  if (isSignUp) {
                    if (!firstName.trim()) {
                      setLoginError("Please enter your First Name.");
                      return;
                    }
                    if (!lastName.trim()) {
                      setLoginError("Please enter your Last Name.");
                      return;
                    }
                    const cleanUsername = username.trim().toLowerCase();
                    if (!cleanUsername) {
                      setLoginError("Please choose a username.");
                      return;
                    }
                    if (!/^[a-zA-Z0-9_]{3,20}$/.test(cleanUsername)) {
                      setLoginError("Username must be between 3 and 20 alphanumeric characters (letters, numbers, or underscores).");
                      return;
                    }

                    const checkResult = isPasswordStrong(password);
                    if (!checkResult.isValid) {
                      setLoginError(`Weak password: ${checkResult.error}`);
                      return;
                    }

                    try {
                      // Check username uniqueness
                      const unique = await isUsernameUnique(cleanUsername);
                      if (!unique) {
                        setLoginError(`The username @${username.trim()} is already taken. Please choose another one.`);
                        return;
                      }

                      isRegisteringRef.current = true;
                      // Create Auth user
                      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                      
                      // Register in Firestore & reserve username
                      await registerUserProfile(
                        userCredential.user.uid, 
                        email, 
                        cleanUsername, 
                        firstName, 
                        lastName
                      );

                      setUserEmail(email);

                      setRatings({});
                      setFavorites([]);
                      setWatchlist([]);
                      setWatchHistory([]);
                      setSearchHistory([]);

                      setOnboardingStep("genres");
                    } catch (err: any) {
                      console.error("Registration error:", err);
                      if (err.code === "auth/email-already-in-use") {
                        setLoginError("This email is already registered in Firebase Authentication! Switched to Sign In.");
                        setIsSignUp(false);
                      } else {
                        setLoginError(err.message || "An error occurred during registration.");
                      }
                    } finally {
                      isRegisteringRef.current = false;
                    }
                  } else {
                    // Sign In
                    try {
                      isRegisteringRef.current = true;
                      const userCredential = await signInWithEmailAndPassword(auth, email, password);
                      const uid = userCredential.user.uid;
                      
                      // Pull profile
                      let profile = await loadUserProfileFromFirestore(uid);
                      if (!profile) {
                        // Auto-create a default profile if missing (e.g., due to database reset, custom project migrations, or VS Code runs)
                        const userEmail = userCredential.user.email || email;
                        const defaultUsername = (userEmail.split("@")[0] || "user").replace(/[^a-zA-Z0-9_]/g, "") + "_" + Math.floor(Math.random() * 1000);
                        try {
                          profile = await registerUserProfile(
                            uid,
                            userEmail,
                            defaultUsername,
                            "User",
                            ""
                          );
                        } catch (regErr) {
                          console.error("Auto-registration failed:", regErr);
                          setLoginError("Your authentication was successful, but we could not find or create your user profile doc. Please register first.");
                          await signOut(auth);
                          return;
                        }
                      }

                      if (profile && !profile.email && (userCredential.user.email || email)) {
                        try {
                          const resolvedEmail = userCredential.user.email || email;
                          await saveUserProfileToFirestore(uid, { email: resolvedEmail });
                          profile.email = resolvedEmail;
                        } catch (err) {
                          console.error("Failed to auto-heal profile email in Firestore:", err);
                        }
                      }

                      // Load fields
                      setFirstName(profile.firstName || "");
                      setLastName(profile.lastName || "");
                      setUsername(profile.username || "");
                      setUserEmail(profile.email || userCredential.user.email || email || "");
                      const lowerEmail = (profile.email || userCredential.user.email || email || "").toLowerCase();
                      const isOwnerAdmin = lowerEmail === "smarangamal2023@gmail.com" || lowerEmail.startsWith("admin@") || lowerEmail.includes("admin");
                      const resolvedRole = profile.role || (isOwnerAdmin ? "admin" : "user");
                      setCurrentUserRole(resolvedRole);
                      setSelectedUserGenres(profile.selectedGenres || []);
                      setFavorites(profile.favorites || []);
                      setWatchlist(profile.watchlist || []);
                      setWatchHistory(profile.watchHistory || []);
                      setSearchHistory(profile.searchHistory || []);
                      setRatings(profile.ratings || {});
                      
                      setCurrentUser(uid);
                      sessionStorage.setItem("cinematch_user", uid);
                      sessionStorage.setItem("cinematch_role", resolvedRole);

                      if (resolvedRole === "admin") {
                        setIsOnboarded(true);
                      } else {
                        const savedGenres = profile.selectedGenres || [];
                        if (savedGenres.length >= 1) {
                          const customFactors = computeFactorsFromGenres(savedGenres);
                          setUserFactors(customFactors);
                          const matchedMovie = moviesData.find((m) =>
                            m.genres.some((g) => savedGenres.includes(g))
                          ) || moviesData[0];
                          setSelectedMovieTitle(matchedMovie.title);
                          setIsOnboarded(true);
                        } else {
                          setOnboardingStep("genres");
                        }
                      }
                    } catch (err: any) {
                      console.error("Login error:", err);
                      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential" || err.code === "auth/user-not-found") {
                        setLoginError("Incorrect credentials. Please try again.");
                      } else {
                        setLoginError(err.message || "An error occurred during sign in.");
                      }
                    } finally {
                      isRegisteringRef.current = false;
                    }
                  }
                }}
                className="space-y-4 max-w-md mx-auto w-full"
              >
                {loginError && (
                  <div className="bg-rose-950/40 border border-rose-900/65 rounded-xl p-3 text-xs text-rose-300 font-semibold leading-relaxed animate-fade-in text-center">
                    {loginError}
                  </div>
                )}

                {isSignUp && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 mb-1.5">First Name</label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="John"
                          className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 mb-1.5">Last Name</label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Doe"
                          className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 mb-1.5">Choose Username</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">@</span>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="username"
                          className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all outline-none"
                        />
                      </div>
                      <span className="text-[10px] text-gray-500 mt-1 block">A unique username to identify your profile (min. 3 characters)</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder={isSignUp ? "Min 8 chars: A-Z, a-z, 123, & special symbol" : "••••••••"}
                    className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all outline-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-3 rounded-xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer font-black"
                  >
                    <span>{isSignUp ? "Register & Continue" : "Sign In & Continue"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentUser("Guest User");
                      setCurrentUserRole("user");
                      sessionStorage.setItem("cinematch_user", "Guest User");
                      sessionStorage.setItem("cinematch_role", "user");
                      setOnboardingStep("genres");
                    }}
                    className="flex-1 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold py-3 rounded-xl border border-gray-200 dark:border-gray-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>Continue as Guest</span>
                  </button>
                </div>

                <div className="relative my-4 flex py-1 items-center">
                  <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                  <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">or</span>
                  <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold py-3 rounded-xl border border-gray-200 dark:border-gray-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.58h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.38C21.68,11.83 21.56,11.41 21.35,11.1z" fill="#4285F4" />
                    <path d="M12,20.88c2.43,0 4.47,-0.8 5.96,-2.18l-2.92,-2.28c-0.81,0.54 -1.85,0.87 -3.04,0.87 -2.34,0 -4.32,-1.58 -5.03,-3.7H3.54v2.36C5.03,18.8 8.24,20.88 12,20.88z" fill="#34A853" />
                    <path d="M6.97,13.67C6.79,13.13 6.7,12.57 6.7,12c0,-0.57 0.09,-1.13 0.27,-1.67V7.97H3.54C2.93,9.18 2.58,10.55 2.58,12c0,1.45 0.35,2.82 0.96,4.03L6.97,13.67z" fill="#FBBC05" />
                    <path d="M12,5.52c1.32,0 2.51,0.45 3.44,1.35l2.58,-2.58C16.46,2.83 14.42,2.02 12,2.02c-3.76,0 -6.97,2.08 -8.46,4.95l3.43,2.67C7.68,7.1 9.66,5.52 12,5.52z" fill="#EA4335" />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </form>
            </div>
          )}

          {onboardingStep === "genres" && (
            <div className="space-y-6 w-full animate-fade-in" id="onboarding-genres-step">
              <div className="text-center space-y-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                  <span>Choose Your Film Flavor</span>
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Select at least <strong>1 genre</strong>. We will align our hybrid engine algorithms to prioritize movies matching your exact taste palette.
                </p>
              </div>

              {/* Grid of options */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mx-auto" id="genre-onboarding-grid">
                {[
                  "Action", "Adventure", "Sci-Fi", "Crime", "Thriller",
                  "Drama", "Romance", "Comedy", "Fantasy", "Animation",
                  "Family", "Music", "Mystery"
                ].map((genre) => {
                  const isSelected = selectedUserGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedUserGenres((prev) => prev.filter((g) => g !== genre));
                        } else {
                          setSelectedUserGenres((prev) => [...prev, genre]);
                        }
                      }}
                      className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all text-center flex items-center justify-between relative overflow-hidden cursor-pointer group ${
                        isSelected
                          ? "bg-red-600 border-red-600 text-white shadow shadow-red-600/20"
                          : "bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-750 border-gray-200 dark:border-gray-700 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <span>{genre}</span>
                      {isSelected ? (
                        <span className="bg-white text-red-600 rounded-full p-0.5 ml-1.5 shrink-0 flex items-center justify-center w-4 h-4">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded-full ml-1.5 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Progress and Continue Button */}
              <div className="space-y-4 max-w-md mx-auto pt-2 text-center w-full">
                <div className="text-xs font-semibold text-gray-400">
                  {selectedUserGenres.length < 1 ? (
                    <span className="text-rose-400">
                      Please select at least 1 genre
                    </span>
                  ) : (
                    <span className="text-green-400">
                      Ready to initialize! ({selectedUserGenres.length} selected)
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOnboardingStep("login")}
                    className="bg-white hover:bg-gray-50 text-slate-700 hover:text-slate-900 text-xs font-bold py-3 px-4 rounded-xl border border-gray-200 transition-colors flex items-center gap-1 cursor-pointer shadow-sm"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    disabled={selectedUserGenres.length < 1}
                    onClick={() => {
                      const customFactors = computeFactorsFromGenres(selectedUserGenres);
                      setUserFactors(customFactors);
                      const matchedMovie = moviesData.find((m) =>
                        m.genres.some((g) => selectedUserGenres.includes(g))
                      ) || moviesData[0];
                      setSelectedMovieTitle(matchedMovie.title);

                      setIsOnboarded(true);

                      if (currentUser && currentUser !== "Guest User") {
                        try {
                          saveUserProfileToFirestore(currentUser, {
                            selectedGenres: selectedUserGenres,
                            firstName,
                            lastName,
                            email: userEmail || auth.currentUser?.email || "",
                            updatedAt: new Date().toISOString()
                          });
                        } catch (err) {
                          console.error("Failed to save genres/profile to Firestore:", err);
                        }
                      } else {
                        sessionStorage.setItem("cinematch_selected_genres", JSON.stringify(selectedUserGenres));
                        sessionStorage.setItem("cinematch_factors", JSON.stringify(customFactors));
                        sessionStorage.setItem("cinematch_onboarded", "true");
                      }
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-750 disabled:opacity-50 disabled:hover:bg-red-600 text-white text-xs font-black py-3 rounded-xl shadow-lg hover:shadow-red-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Initialize Engine
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content after login */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] flex flex-col transition-colors duration-300" id="main-root">
      
      {/* Premium Navbar */}
      <Navbar
        currentUser={currentUser}
        firstName={firstName}
        lastName={lastName}
        username={username}
        userEmail={userEmail}
        onLogout={handleLogout}
        onUpdateTastes={handleUpdateTastes}
        theme={theme}
        onToggleTheme={toggleTheme}
        moviesList={movies}
        onSelectAnchor={selectQueryMovie}
        favoritesCount={favorites.length}
        activeTab={activeNavTab}
        onTabChange={setActiveNavTab}
        onSearchHistoryAdd={addToSearchHistory}
        currentUserRole={currentUserRole}
        aiPromptInput={aiPromptInput}
        setAiPromptInput={setAiPromptInput}
        isGeneratingAiRecs={isGeneratingAiRecs}
        handleGenerateAiRecommendations={handleGenerateAiRecommendations}
        aiError={aiError}
      />

      {/* Main Layout container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6" id="main-sections">
        {activeNavTab === "home" ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Left Column: SVD Taste Control and Filters Panel */}
          <div className="lg:col-span-1 space-y-6" id="sidebar-panel">
            
            {/* Collab SVD Vector Tastes Card */}
            <div className="glass-panel rounded-2xl p-4 border border-gray-200 dark:border-gray-800/80 shadow-md bg-white dark:bg-slate-900/60" id="svd-taste-card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-black tracking-wider uppercase text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-red-500" />
                  Collab SVD Vector Tastes
                </h3>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal mb-4">
                Slide parameters to map your latent tastes. The SVD algorithm predicts movie affinity scores relative to these dimensions.
              </p>

              {/* SVD Dimensions Sliders */}
              <div className="space-y-4">
                {[
                  { index: 0, label: "Action / Sci-Fi", sub: "Lightsabers, blasters, battles" },
                  { index: 1, label: "Drama / Classic", sub: "Complex plots, emotional narrative" },
                  { index: 2, label: "Comedy / Family", sub: "Laughs, animation, light vibe" },
                  { index: 3, label: "Romantic Themes", sub: "Tragic love stories, relationships" },
                  { index: 4, label: "Thriller / Suspense", sub: "Tension, mystery, crime capers" },
                ].map((item) => {
                  const val = userFactors[item.index];
                  const sign = val >= 0 ? "+" : "";
                  return (
                    <div key={item.index} className="flex flex-col gap-0.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 dark:text-slate-200">
                        <span>{item.label}</span>
                        <span className="font-mono text-xs font-black text-red-600 dark:text-red-500">{sign}{val.toFixed(1)}</span>
                      </div>
                      <span className="text-[9.5px] text-gray-400 dark:text-gray-500 leading-none mb-1">{item.sub}</span>
                      <input
                        type="range"
                        min="-1.0"
                        max="1.0"
                        step="0.1"
                        value={val}
                        onChange={(e) => handleSvdFactorChange(item.index, parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-gray-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600 dark:accent-red-500"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Filters Query Card */}
            <div className="glass-panel rounded-2xl p-4 border border-gray-200 dark:border-gray-800/80 shadow-md bg-white dark:bg-slate-900/60" id="filters-query-card">
              <h3 className="text-xs font-black tracking-wider uppercase text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-4">
                <Filter className="w-3.5 h-3.5 text-red-500" />
                Filters Query
              </h3>

              <div className="space-y-4">
                {/* Genres select */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Genres</span>
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-[12px] px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-850 outline-none cursor-pointer focus:ring-1 focus:ring-red-500 font-medium transition-all"
                  >
                    {genresList.map((g) => (
                      <option key={g} value={g} className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Release Year select */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Release Year</span>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-[12px] px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-850 outline-none cursor-pointer focus:ring-1 focus:ring-red-500 font-medium transition-all"
                  >
                    {yearsList.map((y) => (
                      <option key={y} value={y} className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
                        {y === "All" ? "All Years" : y}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Original Language select */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Original Language</span>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-[12px] px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-850 outline-none cursor-pointer focus:ring-1 focus:ring-red-500 font-medium transition-all"
                  >
                    {languagesList.map((l) => (
                      <option key={l} value={l} className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
                        {l === "All" ? "All Languages" : l === "en" ? "English (en)" : l === "ja" ? "Japanese (ja)" : l === "ko" ? "Korean (ko)" : l}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Min IMDb rating slider */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <span>Min IMDb Score</span>
                    <span className="text-red-500 font-mono font-black">{minRating.toFixed(1)} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={minRating}
                    onChange={(e) => setMinRating(parseFloat(e.target.value))}
                    className="w-full cursor-pointer mt-1.5"
                  />
                </div>

                {/* Reset Filters button */}
                <button
                  onClick={handleResetFilters}
                  className="w-full mt-2 p-2.5 text-gray-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl border border-dashed border-gray-350 dark:border-gray-800 transition-all flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Filters
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Spotlight Hero and Shelf Carousels */}
          <div className="lg:col-span-3 space-y-10" id="content-panel">
            {/* Giant Spotlight Hero */}
            <SpotlightHero
              movie={highlightedMovie}
              isFavorited={favorites.includes(highlightedMovie.title)}
              onToggleFavorite={() => toggleFavorite(highlightedMovie.title)}
              onPlayTrailer={() => handlePlayTrailer(highlightedMovie.trailerKey)}
              theme={theme}
              userRating={ratings[highlightedMovie.title]}
              onRateMovie={(val) => handleRateMovie(highlightedMovie.title, val)}
            />

            {/* Carousel Shelves */}
            <div className="space-y-12">
              {/* Recommendation Strategy Header Control */}
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4" id="strategy-tabs-block">
                <div className="space-y-1">
                  <h3 className="text-xs font-black tracking-wider uppercase text-red-600 dark:text-red-500">
                    Recommendation Strategy
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Toggle model weights or select different algorithm layers.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex bg-gray-100 dark:bg-slate-950 p-1 rounded-xl border border-gray-200/50 dark:border-gray-850">
                    {[
                      { id: "hybrid", label: "Hybrid Blend" },
                      { id: "collaborative", label: "Collaborative" },
                      { id: "content", label: "Content-Based" }
                    ].map(btn => (
                      <button
                        key={btn.id}
                        onClick={() => setRecommendationStrategy(btn.id as any)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          recommendationStrategy === btn.id
                            ? "bg-red-600 text-white shadow-md"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block"></div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Show Limit</span>
                    <select
                      value={recommendationCount}
                      onChange={(e) => setRecommendationCount(parseInt(e.target.value))}
                      className="bg-gray-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-[11px] px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-850 outline-none cursor-pointer focus:ring-1 focus:ring-red-500 font-bold transition-all"
                    >
                      {[6, 9, 12, 15, 20].map(cnt => (
                        <option key={cnt} value={cnt}>
                          {cnt} Movies
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 0: Sparkles AI Custom Curation */}
              {aiRecommendations.length > 0 && (
                <div className="space-y-4 p-5 rounded-3xl border border-amber-500/25 dark:border-amber-500/15 bg-gradient-to-br from-amber-500/5 to-red-500/5 dark:from-amber-500/3 dark:to-red-500/3 shadow-xl">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-amber-600 dark:text-amber-500 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                        AI Personal Curation Match
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 italic font-medium max-w-2xl">
                        "{aiIntroMessage}"
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setAiRecommendations([]);
                        setAiPromptInput("");
                      }}
                      className="p-1.5 rounded-full text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all cursor-pointer"
                      title="Clear AI recommendations"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <MovieRow
                    title="Sparkles AI Top Picks"
                    movies={aiRecommendations}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    watchlist={watchlist}
                    onToggleWatchlist={toggleWatchlist}
                    onPlayTrailer={handlePlayTrailer}
                    onSelectAnchor={selectQueryMovie}
                    currentAnchorTitle={selectedMovieTitle}
                    recommendationsMetadata={aiRecommendations.reduce((acc, curr) => {
                      acc[curr.title] = {
                        displayScore: `${curr.aiMatchPercentage || 95}%`,
                        scoreLabel: "AI Match"
                      };
                      return acc;
                    }, {} as any)}
                    ratings={ratings}
                    onMovieImageError={markMovieAsBroken}
                  />
                </div>
              )}

              {/* Row 1: Recommendations based on active model strategy */}
              <MovieRow
                title={`Top Matches for you: Strategy (${recommendationStrategy === "hybrid" ? "Hybrid Blend" : recommendationStrategy === "collaborative" ? "Collaborative" : "Content-Based"})`}
                movies={recommendedMovies}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                watchlist={watchlist}
                onToggleWatchlist={toggleWatchlist}
                onPlayTrailer={handlePlayTrailer}
                onSelectAnchor={selectQueryMovie}
                currentAnchorTitle={selectedMovieTitle}
                recommendationsMetadata={recommendedMetadataMap}
                ratings={ratings}
                onMovieImageError={markMovieAsBroken}
              />

              {/* Row 1.5: Suggested based on activity & preferences */}
              {personalizedRecommendations.length > 0 && (
                <div className="space-y-4 p-5 rounded-3xl border border-emerald-500/25 dark:border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-500/3 dark:to-teal-500/3 shadow-xl">
                  <div className="flex items-center gap-2 px-1">
                    <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-main)]">
                      Suggested for you (Based on Activity & Preferences)
                    </h3>
                  </div>
                  <MovieRow
                    title="Based on Activity & Preferences"
                    movies={personalizedRecommendations}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    watchlist={watchlist}
                    onToggleWatchlist={toggleWatchlist}
                    onPlayTrailer={handlePlayTrailer}
                    onSelectAnchor={selectQueryMovie}
                    currentAnchorTitle={selectedMovieTitle}
                    ratings={ratings}
                    onMovieImageError={markMovieAsBroken}
                  />
                </div>
              )}

              {/* Row 3: Trending Movies (Popularity) */}
              <MovieRow
                title="Popular on CineMatch"
                movies={trendingMovies}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                watchlist={watchlist}
                onToggleWatchlist={toggleWatchlist}
                onPlayTrailer={handlePlayTrailer}
                onSelectAnchor={selectQueryMovie}
                currentAnchorTitle={selectedMovieTitle}
                ratings={ratings}
                onMovieImageError={markMovieAsBroken}
              />

              {/* Row 4: Critically Acclaimed Masterpieces (IMDb Rating sorted) */}
              <MovieRow
                title="Top Rated Masterpieces"
                movies={topRatedMovies}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                watchlist={watchlist}
                onToggleWatchlist={toggleWatchlist}
                onPlayTrailer={handlePlayTrailer}
                onSelectAnchor={selectQueryMovie}
                currentAnchorTitle={selectedMovieTitle}
                ratings={ratings}
                onMovieImageError={markMovieAsBroken}
              />
            </div>
          </div>

        </div>
        ) : activeNavTab === "mylist" ? (
          /* My Personalized Library View Mode */
          <div className="space-y-12 animate-fade-in" id="mylist-view-panel">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-white/8 pb-6 animate-fade-in">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveNavTab("home")}
                    className="p-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/6 cursor-pointer transition-colors"
                    title="Back to Home"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h1 className="text-2xl font-black uppercase tracking-wider text-[var(--text-main)] animate-fade-in" style={{ fontFamily: "var(--font-display)" }}>
                    My Personalized Library
                  </h1>
                </div>
                <p className="text-xs text-slate-500 dark:text-white/45 pl-8">
                  Your curated collection of favorites, saved watchlist items, and interactive playback history.
                </p>
              </div>

              <div className="flex items-center gap-3 pl-8 md:pl-0">
                <div className="px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-white/6 text-center shadow-sm">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Favorites</span>
                  <span className="text-base font-black text-red-600">{favoritesMovies.length}</span>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-white/6 text-center shadow-sm">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Watchlist</span>
                  <span className="text-base font-black text-amber-500">{watchlistMovies.length}</span>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-white/6 text-center shadow-sm">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">History</span>
                  <span className="text-base font-black text-emerald-500">{watchHistoryMovies.length}</span>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-white/6 text-center shadow-sm">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rated</span>
                  <span className="text-base font-black text-red-500">{ratedMovies.length}</span>
                </div>
              </div>
            </div>

            {/* Watch History Row (Most Recent clicked movies) */}
            {watchHistoryMovies.length > 0 ? (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-center gap-2 px-1">
                  <History className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-main)]">
                    Recently Clicked & Played History
                  </h3>
                </div>
                <MovieRow
                  title="Watch History"
                  movies={watchHistoryMovies}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  watchlist={watchlist}
                  onToggleWatchlist={toggleWatchlist}
                  onPlayTrailer={handlePlayTrailer}
                  onSelectAnchor={selectQueryMovie}
                  currentAnchorTitle={selectedMovieTitle}
                  ratings={ratings}
                  onMovieImageError={markMovieAsBroken}
                />
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-gray-100 dark:border-white/5 p-8 text-center max-w-lg mx-auto space-y-3 bg-white/30 dark:bg-slate-900/10 animate-fade-in">
                <History className="w-8 h-8 mx-auto text-gray-300 dark:text-white/10 animate-pulse" />
                <h4 className="text-xs font-black uppercase text-slate-700 dark:text-gray-300">No Watch History Yet</h4>
                <p className="text-[11px] text-gray-400 dark:text-white/35 leading-relaxed">
                  Start exploring movies, recommending similars, or playing video trailers to automatically build your history!
                </p>
                <button
                  onClick={() => setActiveNavTab("home")}
                  className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl cursor-pointer transition-all"
                >
                  Browse Home Feed
                </button>
              </div>
            )}

            {/* Favorites Row */}
            {favoritesMovies.length > 0 && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-center gap-2 px-1">
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-main)]">
                    My Favorites
                  </h3>
                </div>
                <MovieRow
                  title="Favorites"
                  movies={favoritesMovies}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  watchlist={watchlist}
                  onToggleWatchlist={toggleWatchlist}
                  onPlayTrailer={handlePlayTrailer}
                  onSelectAnchor={selectQueryMovie}
                  currentAnchorTitle={selectedMovieTitle}
                  ratings={ratings}
                  onMovieImageError={markMovieAsBroken}
                />
              </div>
            )}

            {/* Watchlist Row */}
            {watchlistMovies.length > 0 && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-center gap-2 px-1">
                  <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-main)]">
                    My Watchlist
                  </h3>
                </div>
                <MovieRow
                  title="Watchlist"
                  movies={watchlistMovies}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  watchlist={watchlist}
                  onToggleWatchlist={toggleWatchlist}
                  onPlayTrailer={handlePlayTrailer}
                  onSelectAnchor={selectQueryMovie}
                  currentAnchorTitle={selectedMovieTitle}
                  ratings={ratings}
                  onMovieImageError={markMovieAsBroken}
                />
              </div>
            )}

            {/* Rated Movies Row */}
            {ratedMovies.length > 0 && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-center gap-2 px-1">
                  <Star className="w-4 h-4 text-red-500 fill-red-500" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-main)]">
                    My Rated Movies
                  </h3>
                </div>
                <MovieRow
                  title="My Ratings"
                  movies={ratedMovies}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  watchlist={watchlist}
                  onToggleWatchlist={toggleWatchlist}
                  onPlayTrailer={handlePlayTrailer}
                  onSelectAnchor={selectQueryMovie}
                  currentAnchorTitle={selectedMovieTitle}
                  ratings={ratings}
                  onMovieImageError={markMovieAsBroken}
                />
              </div>
            )}

            {favoritesMovies.length === 0 && watchlistMovies.length === 0 && watchHistoryMovies.length === 0 && ratedMovies.length === 0 && (
              <div className="rounded-3xl border border-gray-200/50 dark:border-white/5 bg-white/40 dark:bg-black/20 p-12 text-center max-w-xl mx-auto space-y-4 shadow-xl">
                <div className="w-14 h-14 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center mx-auto text-red-500">
                  <Sparkles className="w-7 h-7 animate-pulse" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-main)]">Your Library is Empty</h3>
                <p className="text-xs text-slate-500 dark:text-white/45 max-w-md mx-auto leading-relaxed">
                  Welcome to your personalized space! Mark movies as favorites, add them to your watchlist, or watch trailers to see them listed here instantly.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveNavTab("home")}
                    className="px-6 py-3 bg-red-600 hover:bg-red-750 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-red-600/10 transition-all cursor-pointer"
                  >
                    Start Browsing Movies
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <AdminPanel
            movies={movies}
            onSaveMovie={handleSaveMovie}
            onDeleteMovie={handleDeleteMovie}
            theme={theme}
            currentUserUid={currentUser}
          />
        )}
      </main>

      {/* Footer info label */}
      <footer className="mt-20 py-8 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-500 max-w-7xl mx-auto w-full px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <span>CineMatch — Premium Recommender Platform (React Integration)</span>
      </footer>

      {/* Beautiful High-fidelity Video Trailer Pop-up overlay */}
      {activeTrailerKey && (
        <div className="fixed inset-0 bg-white/85 dark:bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in" id="trailer-overlay">
          <div className="bg-white dark:bg-[#08090d] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden max-w-3xl w-full flex flex-col shadow-2xl">
            <div className="p-4 flex items-center justify-between bg-gray-50 dark:bg-[#14151a] border-b border-gray-200 dark:border-gray-850">
              <span className="text-xs font-black uppercase text-red-500 tracking-wider">CineMatch Movie Preview</span>
              <button
                onClick={() => setActiveTrailerKey(null)}
                className="p-1 text-gray-400 hover:text-slate-900 bg-white dark:bg-[#08090d] hover:bg-slate-100 dark:hover:bg-slate-800 border border-gray-200 dark:border-gray-800 rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative aspect-video bg-white dark:bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeTrailerKey}?autoplay=1&rel=0`}
                title="CineMatch Video Stream"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Beautiful Profile & Preferences Modal Overlay */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-white/75 dark:bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in" id="profile-overlay">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-lg w-full flex flex-col shadow-2xl overflow-hidden max-h-[90vh]">
            {/* Header */}
            <div className="p-4 flex items-center justify-between bg-gray-50 dark:bg-[#14151a] border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <User className="w-4 h-4 text-red-500" />
                <span>Profile Settings</span>
              </h3>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="p-1 text-gray-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-850 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-slate-900 dark:text-slate-100">
              {tempError && (
                <div className="bg-rose-100 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900/65 rounded-xl p-3 text-xs text-rose-700 dark:text-rose-300 font-semibold leading-relaxed text-center animate-shake">
                  {tempError}
                </div>
              )}

              {/* Names */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">First Name</label>
                  <input
                    type="text"
                    value={tempFirstName}
                    onChange={(e) => setTempFirstName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={tempLastName}
                    onChange={(e) => setTempLastName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Username & Email Address */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Username</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser === "Guest User" ? "Guest" : (username ? `@${username}` : "")}
                    className="w-full bg-gray-150 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-sm px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 outline-none cursor-not-allowed opacity-75"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Email Address</label>
                  <input
                    type="text"
                    disabled={currentUser === "Guest User"}
                    value={currentUser === "Guest User" ? "Guest User" : tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                    className={`w-full text-slate-900 dark:text-slate-100 text-sm px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all outline-none ${
                      currentUser === "Guest User"
                        ? "bg-gray-150 dark:bg-slate-900 text-slate-500 dark:text-slate-400 cursor-not-allowed opacity-75"
                        : "bg-gray-50 dark:bg-slate-950"
                    }`}
                  />
                </div>
              </div>

              {/* User Preferences / Genres */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Movie Genre Preferences (Choose at least 1)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[180px] overflow-y-auto p-1 border border-gray-250 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-slate-950/40">
                  {[
                    "Action", "Adventure", "Sci-Fi", "Crime", "Thriller",
                    "Drama", "Romance", "Comedy", "Fantasy", "Animation",
                    "Family", "Music", "Mystery"
                  ].map((genre) => {
                    const isSelected = tempGenres.includes(genre);
                    return (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setTempGenres((prev) => prev.filter((g) => g !== genre));
                          } else {
                            setTempGenres((prev) => [...prev, genre]);
                          }
                        }}
                        className={`py-2.5 px-3 rounded-lg border text-xs font-bold transition-all text-center flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "bg-red-600 border-red-600 text-white shadow shadow-red-600/20"
                            : "bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-750 border-gray-200 dark:border-gray-700 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <span>{genre}</span>
                        {isSelected ? (
                          <span className="bg-white text-red-600 rounded-full p-0.5 ml-1 shrink-0 flex items-center justify-center w-3.5 h-3.5">
                            <Check className="w-2 h-2 stroke-[3]" />
                          </span>
                        ) : (
                          <span className="w-3 h-3 border border-gray-300 dark:border-gray-600 rounded-full ml-1 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-4 bg-gray-50 dark:bg-[#14151a] border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="px-4 py-2 text-xs font-bold bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-350 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-850 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  setTempError(null);
                  if (!tempFirstName.trim()) {
                    setTempError("Please enter your First Name.");
                    return;
                  }
                  if (!tempLastName.trim()) {
                    setTempError("Please enter your Last Name.");
                    return;
                  }
                  if (currentUser !== "Guest User") {
                    if (!tempEmail.trim()) {
                      setTempError("Please enter your Email Address.");
                      return;
                    }
                    if (!isValidEmailAddress(tempEmail)) {
                      setTempError("Please enter a valid Email Address.");
                      return;
                    }
                  }
                  if (tempGenres.length < 1) {
                    setTempError("Please select at least 1 movie genre to keep recommendations tuned.");
                    return;
                  }

                  // Perform actual update
                  if (currentUser && currentUser !== "Guest User") {
                    try {
                      const updatedRecord = {
                        firstName: tempFirstName,
                        lastName: tempLastName,
                        email: tempEmail,
                        selectedGenres: tempGenres,
                        updatedAt: new Date().toISOString()
                      };
                      await saveUserProfileToFirestore(currentUser, updatedRecord);
                    } catch (err) {
                      console.error("Failed to update profile in Firestore:", err);
                    }
                  } else {
                    // Update Guest details in session
                    sessionStorage.setItem("cinematch_selected_genres", JSON.stringify(tempGenres));
                  }

                  // Update application-wide state
                  setFirstName(tempFirstName);
                  setLastName(tempLastName);
                  setUserEmail(tempEmail);
                  setSelectedUserGenres(tempGenres);

                  // Update user factors immediately to refresh predictions
                  const customFactors = computeFactorsFromGenres(tempGenres);
                  setUserFactors(customFactors);

                  setIsProfileModalOpen(false);
                }}
                className="px-4 py-2 text-xs font-black bg-red-600 hover:bg-red-750 text-white rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
