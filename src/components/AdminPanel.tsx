import React, { useState, useMemo, useEffect } from "react";
import { Plus, Trash2, Edit2, Search, Film, Star, Tag, Award, Shield, X, Sliders, Save, FileText, Languages, Users } from "lucide-react";
import { Movie } from "../moviesData";
import { 
  syncAllUsersWithFirestore, 
  saveUserProfileToFirestore, 
  deleteUserProfileFromFirestore,
  db,
  handleFirestoreError,
  OperationType
} from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

interface SafePosterImageProps {
  src: string;
  title: string;
}

const SafePosterImage: React.FC<SafePosterImageProps> = ({ src, title }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError || !src || src.trim() === "") {
    return (
      <div 
        className="w-9 h-12 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded shadow flex flex-col items-center justify-center text-center select-none border border-slate-600/50 shrink-0"
        title={`${title} (No poster)`}
      >
        <Film className="w-4 h-4 text-slate-400 opacity-80" />
        <span className="text-[7px] font-black text-slate-300 tracking-tighter mt-0.5 truncate max-w-full px-0.5">
          {title.substring(0, 2).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      className="w-9 h-12 object-cover rounded shadow shrink-0"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
    />
  );
};

interface AdminPanelProps {
  movies: Movie[];
  onSaveMovie: (movie: Movie) => void;
  onDeleteMovie: (id: number) => void;
  theme: string;
  currentUserUid: string | null;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  movies,
  onSaveMovie,
  onDeleteMovie,
  theme,
  currentUserUid,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"catalog" | "users">("catalog");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Partial<Movie> | null>(null);

  // Pagination State for high scale databases (e.g. 90,000 items)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Reset page when searching or switching sub-tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeSubTab]);

  // Load registered users directly from Firestore
  const [localUsers, setLocalUsers] = useState<Record<string, any>>({});

  // Sync with Firestore on mount and subscribe to real-time changes
  useEffect(() => {
    let unsubscribe: () => void = () => {};
    
    // Auto-seed/sync pre-registered users if the collection is empty
    syncAllUsersWithFirestore().catch((err) => {
      console.error("Failed to seed pre-registered users:", err);
    });
    
    // Subscribe to real-time updates from Firestore users collection
    try {
      const usersCollectionRef = collection(db, "users");
      unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
        const updatedUsers: Record<string, any> = {};
        snapshot.forEach((doc) => {
          updatedUsers[doc.id] = doc.data();
        });
        setLocalUsers(updatedUsers);
      }, (error) => {
        console.error("Firestore user subscription warning (graceful recovery):", error);
      });
    } catch (e) {
      console.error("Failed to initialize real-time users listener:", e);
    }
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const toggleUserRole = async (uid: string) => {
    try {
      const updatedUsers = { ...localUsers };
      if (!updatedUsers[uid]) return;
      
      const newRole = updatedUsers[uid].role === "admin" ? "user" : "admin";
      const updatedRecord = {
        ...updatedUsers[uid],
        role: newRole,
        updatedAt: new Date().toISOString()
      };
      
      updatedUsers[uid] = updatedRecord;
      setLocalUsers(updatedUsers);
      
      // Sync with Firestore using UID
      await saveUserProfileToFirestore(uid, updatedRecord);
    } catch (err) {
      console.error("Failed to toggle user role:", err);
    }
  };

  const deleteUserRecord = async (uid: string) => {
    const user = localUsers[uid];
    const identifier = user ? (user.username ? `@${user.username}` : user.email) : uid;
    if (!window.confirm(`Are you sure you want to permanently remove user "${identifier}" from the database?`)) {
      return;
    }
    try {
      // Delete from Firestore
      await deleteUserProfileFromFirestore(uid);

      // Remove from state
      const updatedUsers = { ...localUsers };
      delete updatedUsers[uid];
      setLocalUsers(updatedUsers);
    } catch (err) {
      console.error("Failed to delete user record:", err);
    }
  };

  // Form Field States
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [genres, setGenres] = useState("");
  const [releaseYear, setReleaseYear] = useState(new Date().getFullYear());
  const [rating, setRating] = useState(7.5);
  const [language, setLanguage] = useState("en");
  const [posterUrl, setPosterUrl] = useState("");
  const [backdropUrl, setBackdropUrl] = useState("");
  const [trailerKey, setTrailerKey] = useState("");
  const [overview, setOverview] = useState("");
  const [cast, setCast] = useState("");
  const [keywords, setKeywords] = useState("");
  const [svdFactors, setSvdFactors] = useState<number[]>([0.5, 0.5, 0.5, 0.5, 0.5]);

  const isLightTheme = theme !== "dark";

  // Compute database metrics - highly optimized O(N) single-pass with zero array copying or sorting
  const stats = useMemo(() => {
    const total = movies.length;
    let sumRating = 0;
    let topMovie: Movie | null = null;
    let maxRating = -1;
    const uniqueGenres = new Set<string>();

    for (let j = 0; j < total; j++) {
      const m = movies[j];
      sumRating += m.rating;
      if (m.rating > maxRating) {
        maxRating = m.rating;
        topMovie = m;
      }
      for (let g = 0; g < m.genres.length; g++) {
        uniqueGenres.add(m.genres[g]);
      }
    }
    const avgRating = total > 0 ? sumRating / total : 0;

    return {
      total,
      avgRating: avgRating.toFixed(1),
      genresCount: uniqueGenres.size,
      topMovieTitle: topMovie ? topMovie.title : "N/A",
    };
  }, [movies]);

  // Filtered movies in the listing
  const filteredMovies = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return movies;
    return movies.filter(
      (m) =>
        m.title.toLowerCase().includes(term) ||
        (m.director && m.director.toLowerCase().includes(term)) ||
        m.genres.some((g) => g.toLowerCase().includes(term))
    );
  }, [movies, searchTerm]);

  // Slice paginated movies to prevent rendering huge DOM tables
  const paginatedMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMovies.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMovies, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredMovies.length / itemsPerPage);
  }, [filteredMovies]);

  // Compute user metrics
  const userStats = useMemo(() => {
    const userUids = Object.keys(localUsers);
    const totalUsers = userUids.length;
    
    let totalRatingsCount = 0;
    let ratingsSum = 0;
    let activeReviewersCount = 0;
    let topRaterUid = "N/A";
    let topRaterCount = 0;
    let topRaterName = "";

    userUids.forEach((uid) => {
      const user = localUsers[uid];
      const userRatings = user.ratings || {};
      const ratingKeys = Object.keys(userRatings);
      const ratingCount = ratingKeys.length;
      if (ratingCount > 0) {
        activeReviewersCount++;
        ratingKeys.forEach((movieTitle) => {
          totalRatingsCount++;
          ratingsSum += userRatings[movieTitle];
        });
        if (ratingCount > topRaterCount) {
          topRaterCount = ratingCount;
          topRaterUid = uid;
          const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
          const dispName = user.username ? `@${user.username}` : (fullName || user.email);
          topRaterName = dispName;
        }
      }
    });

    const avgUserRating = totalRatingsCount > 0 ? (ratingsSum / totalRatingsCount).toFixed(1) : "N/A";

    return {
      totalUsers,
      totalRatingsCount,
      avgUserRating,
      activeReviewers: activeReviewersCount,
      topRaterEmail: topRaterUid,
      topRaterCount,
      topRaterName: topRaterName || "N/A",
    };
  }, [localUsers]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    const term = userSearchTerm.trim().toLowerCase();
    const entries = Object.entries(localUsers) as [string, any][];
    if (!term) return entries;
    return entries.filter(([uid, u]) => {
      const emailMatch = (u.email || "").toLowerCase().includes(term);
      const usernameMatch = (u.username || "").toLowerCase().includes(term);
      const nameMatch = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase().includes(term);
      return emailMatch || usernameMatch || nameMatch;
    });
  }, [localUsers, userSearchTerm]);

  const openCreateForm = () => {
    setEditingMovie(null);
    setTitle("");
    setDirector("");
    setGenres("Drama, Thriller");
    setReleaseYear(2026);
    setRating(7.5);
    setLanguage("en");
    setPosterUrl("https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop");
    setBackdropUrl("https://images.unsplash.com/photo-1542204172-e70528091f50?w=1600&auto=format&fit=crop");
    setTrailerKey("EXeTwQWrcwY");
    setOverview("A dramatic masterpiece showcasing rich visual design and gripping character arcs.");
    setCast("Sam Worthington, Zoe Saldana");
    setKeywords("drama, suspense, classic");
    setSvdFactors([0.5, 0.5, 0.5, 0.5, 0.5]);
    setIsFormOpen(true);
  };

  const openEditForm = (movie: Movie) => {
    setEditingMovie(movie);
    setTitle(movie.title);
    setDirector(movie.director || "");
    setGenres(movie.genres.join(", "));
    setReleaseYear(movie.releaseYear);
    setRating(movie.rating);
    setLanguage(movie.language || "en");
    setPosterUrl(movie.posterUrl || "");
    setBackdropUrl(movie.backdropUrl || "");
    setTrailerKey(movie.trailerKey || "");
    setOverview(movie.overview || "");
    setCast((movie.cast || []).join(", "));
    setKeywords((movie.keywords || []).join(", "));
    setSvdFactors(movie.svdFactors && movie.svdFactors.length === 5 ? [...movie.svdFactors] : [0.5, 0.5, 0.5, 0.5, 0.5]);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert("Movie Title is required!");

    const parsedGenres = genres
      .split(",")
      .map((g) => g.trim())
      .filter((g) => g.length > 0);
    const parsedCast = cast
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);
    const parsedKeywords = keywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const moviePayload: Movie = {
      id: editingMovie ? editingMovie.id! : Date.now(),
      title: title.trim(),
      director: director.trim() || "Unknown Director",
      genres: parsedGenres.length > 0 ? parsedGenres : ["Drama"],
      cast: parsedCast,
      keywords: parsedKeywords,
      releaseYear: Number(releaseYear) || 2026,
      rating: Number(rating) || 7.0,
      language: language.trim() || "en",
      posterUrl: posterUrl.trim() || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop",
      backdropUrl: backdropUrl.trim() || "https://images.unsplash.com/photo-1542204172-e70528091f50?w=1600&auto=format&fit=crop",
      trailerKey: trailerKey.trim() || "EXeTwQWrcwY",
      overview: overview.trim() || "No overview provided.",
      popularity: editingMovie ? editingMovie.popularity || 80 : 80,
      metadataSoup: `${title} ${director} ${parsedGenres.join(" ")} ${parsedCast.join(" ")} ${overview}`.toLowerCase(),
      svdFactors: svdFactors,
    };

    onSaveMovie(moviePayload);
    setIsFormOpen(false);
  };

  const handleSvdSliderChange = (idx: number, val: number) => {
    setSvdFactors((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  return (
    <div className="space-y-8 animate-fade-in" id="admin-panel-container">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-150 dark:border-white/8 pb-6 animate-fade-in">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            <h1 className="text-2xl font-black uppercase tracking-wider text-[var(--text-main)]" style={{ fontFamily: "var(--font-display)" }}>
              Admin Database Workspace
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-gray-400">
            Provision, edit, and audit system catalog titles. Changes immediately update real-time user recommendations.
          </p>
        </div>
        <div>
          <button
            onClick={openCreateForm}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-lg shadow-red-600/10 hover:shadow-red-600/20 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Movie</span>
          </button>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex border-b border-gray-200 dark:border-white/10 gap-6">
        <button
          onClick={() => setActiveSubTab("catalog")}
          className={`pb-3 text-xs uppercase font-black tracking-wider transition-all cursor-pointer relative ${
            activeSubTab === "catalog"
              ? "text-red-600 dark:text-red-500 font-extrabold border-b-2 border-red-600 dark:border-red-500"
              : "text-slate-400 hover:text-slate-600 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          Catalog Management
        </button>
        <button
          onClick={() => setActiveSubTab("users")}
          className={`pb-3 text-xs uppercase font-black tracking-wider transition-all cursor-pointer relative ${
            activeSubTab === "users"
              ? "text-red-600 dark:text-red-500 font-extrabold border-b-2 border-red-600 dark:border-red-500"
              : "text-slate-400 hover:text-slate-600 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          User Accounts & Ratings
        </button>
      </div>

      {activeSubTab === "catalog" && (
        <>
          {/* Bento Stats Panel Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="admin-bento-grid">
            <div className="bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-xl">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 dark:text-gray-500 uppercase tracking-widest font-bold font-mono">Catalog Count</span>
                <h4 className="text-xl font-extrabold text-slate-800 dark:text-white leading-tight">{stats.total} Movies</h4>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-xl">
                <Star className="w-5 h-5 fill-amber-500" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 dark:text-gray-500 uppercase tracking-widest font-bold font-mono">Average Rating</span>
                <h4 className="text-xl font-extrabold text-slate-800 dark:text-white leading-tight">{stats.avgRating} / 10</h4>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-xl">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 dark:text-gray-500 uppercase tracking-widest font-bold font-mono">Genre Taxonomy</span>
                <h4 className="text-xl font-extrabold text-slate-800 dark:text-white leading-tight">{stats.genresCount} Genres</h4>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-50 rounded-xl" style={{ color: "var(--color-accent, #ef4444)" }}>
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 dark:text-gray-500 uppercase tracking-widest font-bold font-mono">Top Rated Item</span>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate leading-tight mt-1">{stats.topMovieTitle}</h4>
              </div>
            </div>
          </div>

          {/* Database Listing section */}
          <div className="bg-white dark:bg-slate-900/25 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-sm space-y-6" id="admin-catalog-listing">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-red-600" />
                  Movie Entries Catalog
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Query records by title, director, or genre. Changes will propagate and synchronize automatically.
                </p>
              </div>

              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search catalog titles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 text-slate-900 dark:text-white rounded-xl border border-gray-200 dark:border-white/10 outline-none focus:border-red-500 transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Database Grid */}
            {filteredMovies.length === 0 ? (
              <div className="text-center py-12 text-gray-400 dark:text-gray-500 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl font-medium">
                No movie records found matching your search term.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto border border-gray-200/60 dark:border-white/5 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-slate-800/40 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-gray-400 border-b border-gray-200/60 dark:border-white/5">
                        <th className="py-3 px-4">Movie Info</th>
                        <th className="py-3 px-4">Genres</th>
                        <th className="py-3 px-4">Director</th>
                        <th className="py-3 px-4 text-center">Year</th>
                        <th className="py-3 px-4 text-center">IMDb</th>
                        <th className="py-3 px-4 text-center">SVD Vector</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-xs text-slate-700 dark:text-slate-300">
                      {paginatedMovies.map((movie) => (
                        <tr key={movie.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <SafePosterImage
                                src={movie.posterUrl}
                                title={movie.title}
                              />
                              <div className="min-w-0">
                                <span className="font-extrabold text-slate-800 dark:text-white block truncate">{movie.title}</span>
                                <span className="text-[10px] text-slate-400 dark:text-gray-500 block">ID: {movie.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1 max-w-[180px]">
                              {movie.genres.map((g) => (
                                <span key={g} className="px-1.5 py-0.5 bg-slate-100 dark:bg-white/5 text-[9px] font-bold rounded text-slate-600 dark:text-gray-300 uppercase">
                                  {g}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-600 dark:text-slate-300">
                            {movie.director}
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono font-semibold">
                            {movie.releaseYear}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-500 dark:text-amber-400 px-2 py-0.5 rounded font-mono font-black text-[10px]">
                              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500 shrink-0" />
                              <span>{movie.rating.toFixed(1)}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="inline-flex flex-wrap justify-center gap-0.5 max-w-[100px] mx-auto font-mono text-[8px] text-gray-500">
                              {movie.svdFactors && movie.svdFactors.length === 5 ? (
                                movie.svdFactors.map((f, i) => (
                                  <span
                                    key={i}
                                    className="px-1 py-0.25 bg-red-600/5 dark:bg-red-500/10 border border-red-500/15 rounded text-red-600 dark:text-red-400 font-bold"
                                    title={`Factor ${i + 1}`}
                                  >
                                    {f.toFixed(1)}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-400">N/A</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => openEditForm(movie)}
                                className="p-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 dark:bg-slate-850 dark:hover:bg-red-950/45 dark:hover:text-red-400 rounded-lg text-slate-500 dark:text-gray-400 cursor-pointer transition-colors"
                                title="Edit movie parameters"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to delete "${movie.title}"? This cannot be undone.`)) {
                                    onDeleteMovie(movie.id);
                                  }
                                }}
                                className="p-1.5 bg-slate-100 hover:bg-rose-150 hover:text-rose-600 dark:bg-slate-850 dark:hover:bg-rose-950/45 dark:hover:text-rose-400 rounded-lg text-slate-500 dark:text-gray-400 cursor-pointer transition-colors"
                                title="Delete movie entries"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-150 dark:border-white/5 text-xs text-slate-500">
                    <div>
                      Showing <span className="font-bold text-slate-700 dark:text-gray-300">{Math.min(filteredMovies.length, (currentPage - 1) * itemsPerPage + 1)}</span> to{" "}
                      <span className="font-bold text-slate-700 dark:text-gray-300">{Math.min(filteredMovies.length, currentPage * itemsPerPage)}</span> of{" "}
                      <span className="font-bold text-slate-700 dark:text-gray-300">{filteredMovies.length}</span> movie records
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:hover:bg-transparent transition-all cursor-pointer font-semibold"
                      >
                        First
                      </button>
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:hover:bg-transparent transition-all cursor-pointer font-semibold"
                      >
                        Prev
                      </button>
                      <span className="px-3 py-1.5 bg-red-600/10 text-red-600 dark:text-red-400 font-extrabold rounded-lg font-mono">
                        {currentPage} / {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:hover:bg-transparent transition-all cursor-pointer font-semibold"
                      >
                        Next
                      </button>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:hover:bg-transparent transition-all cursor-pointer font-semibold"
                      >
                        Last
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {activeSubTab === "users" && (
        <div className="space-y-6 animate-fade-in" id="admin-users-analytics">
          {/* Bento Stats Panel Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="admin-user-bento-grid">
            <div className="bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 dark:text-gray-500 uppercase tracking-widest font-bold font-mono">Registered Users</span>
                <h4 className="text-xl font-extrabold text-slate-800 dark:text-white leading-tight">{userStats.totalUsers} Accounts</h4>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-xl">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 dark:text-gray-500 uppercase tracking-widest font-bold font-mono">Total User Reviews</span>
                <h4 className="text-xl font-extrabold text-slate-800 dark:text-white leading-tight">{userStats.totalRatingsCount} Ratings</h4>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-xl">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 dark:text-gray-500 uppercase tracking-widest font-bold font-mono">Avg User Rating</span>
                <h4 className="text-xl font-extrabold text-slate-800 dark:text-white leading-tight">{userStats.avgUserRating} / 10</h4>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-xl">
                <Award className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 dark:text-gray-500 uppercase tracking-widest font-bold font-mono">Top Rater</span>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate leading-tight mt-1" title={userStats.topRaterEmail}>
                  {userStats.topRaterEmail !== "N/A" ? `${userStats.topRaterName} (${userStats.topRaterCount} ratings)` : "N/A"}
                </h4>
              </div>
            </div>
          </div>

          {/* User Directory Card */}
          <div className="bg-white dark:bg-slate-900/25 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-red-600" />
                  User Accounts Directory & Feedback
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Track registered profiles, libraries, favorites counts, and check their personalized ratings for each title.
                </p>
              </div>

              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 text-slate-900 dark:text-white rounded-xl border border-gray-200 dark:border-white/10 outline-none focus:border-red-500 transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-gray-400 dark:text-gray-500 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl font-medium">
                No registered user records match your search criteria.
              </div>
            ) : (
              <div className="overflow-x-auto border border-gray-200/60 dark:border-white/5 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-slate-800/40 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-gray-400 border-b border-gray-200/60 dark:border-white/5">
                      <th className="py-3 px-4">User Details</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4 text-center">Interests</th>
                      <th className="py-3 px-4">My Ratings & Feedback</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-xs text-slate-700 dark:text-slate-300">
                    {filteredUsers.map(([uid, user]) => {
                      const ratingsList = Object.entries(user.ratings || {});
                      return (
                        <tr key={uid} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-red-600/10 dark:bg-red-500/15 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center font-black text-xs uppercase">
                                {user.firstName ? user.firstName[0] : (user.username ? user.username[0] : (user.email ? user.email[0] : "?"))}
                              </div>
                              <div>
                                <span className="font-extrabold text-slate-800 dark:text-white block">
                                  {user.firstName || ""} {user.lastName || ""}{user.username && <span className="text-[10px] text-red-500 font-bold ml-1.5">@{user.username}</span>}
                                </span>
                                <span className="text-[10px] text-slate-400 dark:text-gray-500 block">{user.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                user.role === "admin" 
                                  ? "bg-red-150 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-500/15" 
                                  : "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-500/15"
                              }`}>
                                {user.role || "user"}
                              </span>
                              {uid !== currentUserUid && (
                                <div className="flex items-center gap-1.5 ml-2">
                                  <button
                                    onClick={() => toggleUserRole(uid)}
                                    className="text-[10px] font-semibold text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 border border-gray-200 dark:border-white/10 rounded-md px-1.5 py-0.5 hover:bg-slate-100 dark:hover:bg-slate-850 transition-all cursor-pointer"
                                    title={user.role === "admin" ? "Change role to Regular User" : "Promote to Admin"}
                                  >
                                    {user.role === "admin" ? "Demote" : "Make Admin"}
                                  </button>
                                  <button
                                    onClick={() => deleteUserRecord(uid)}
                                    className="text-[10px] font-semibold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 border border-red-200 dark:border-red-500/20 rounded-md px-1.5 py-0.5 hover:bg-red-500/10 transition-all cursor-pointer flex items-center gap-1"
                                    title="Permanently remove user from system"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex flex-col gap-0.5 items-center">
                              <span className="text-[11px] font-mono font-semibold text-slate-600 dark:text-gray-300">
                                📚 Library: {user.watchlist?.length || 0}
                              </span>
                              <span className="text-[11px] font-mono font-semibold text-slate-600 dark:text-gray-300">
                                ⭐️ Favorites: {user.favorites?.length || 0}
                              </span>
                              <span className="text-[11px] font-mono text-slate-400 dark:text-gray-500">
                                📂 Genres: {user.selectedGenres?.length || 0}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            {ratingsList.length === 0 ? (
                              <span className="text-gray-400 dark:text-gray-500 italic text-[11px]">No ratings submitted yet</span>
                            ) : (
                              <div className="flex flex-wrap gap-1.5 max-w-md">
                                {ratingsList.map(([movieTitle, ratingVal]) => (
                                  <span key={movieTitle} className="inline-flex items-center gap-1 bg-amber-500/10 dark:bg-amber-500/5 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                                    <span className="truncate max-w-[120px]">{movieTitle}</span>
                                    <span className="font-bold font-mono">({ratingVal}/10)</span>
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Form Slide-over modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" id="admin-form-overlay">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b border-gray-150 dark:border-white/10 bg-gray-50 dark:bg-slate-850">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-red-600" />
                <h3 className="text-xs font-black uppercase text-slate-800 dark:text-white tracking-wider">
                  {editingMovie ? `Edit entry: ${editingMovie.title}` : "Provision New Catalog Entry"}
                </h3>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Movie Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Inception"
                    className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:border-red-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Director</label>
                  <input
                    type="text"
                    value={director}
                    onChange={(e) => setDirector(e.target.value)}
                    placeholder="e.g. Christopher Nolan"
                    className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:border-red-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Release Year</label>
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={releaseYear}
                    onChange={(e) => setReleaseYear(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:border-red-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">IMDb Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:border-red-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Language Code</label>
                  <input
                    type="text"
                    maxLength={3}
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="en"
                    className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:border-red-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Genres (Comma separated)</label>
                <input
                  type="text"
                  value={genres}
                  onChange={(e) => setGenres(e.target.value)}
                  placeholder="Action, Sci-Fi, Thriller"
                  className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:border-red-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Cast (Comma separated)</label>
                  <input
                    type="text"
                    value={cast}
                    onChange={(e) => setCast(e.target.value)}
                    placeholder="Leonardo DiCaprio, Joseph Gordon-Levitt"
                    className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:border-red-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Keywords (Comma separated)</label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="dreams, subconscious, heist"
                    className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:border-red-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Poster Image URL</label>
                  <input
                    type="url"
                    value={posterUrl}
                    onChange={(e) => setPosterUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:border-red-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">YouTube Trailer Key</label>
                  <input
                    type="text"
                    value={trailerKey}
                    onChange={(e) => setTrailerKey(e.target.value)}
                    placeholder="e.g. EXeTwQWrcwY"
                    className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:border-red-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Overview Description</label>
                <textarea
                  rows={3}
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  placeholder="Provide a rich plot outline of the movie entries..."
                  className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:border-red-500 transition-all resize-none"
                />
              </div>

              {/* 5D SVD Coordinates sliders */}
              <div className="p-4 bg-gray-50 dark:bg-slate-850 rounded-xl border border-gray-200 dark:border-white/5 space-y-4">
                <div className="flex items-center gap-1.5 border-b border-gray-200 dark:border-white/5 pb-2">
                  <Sliders className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-600 dark:text-white">Predictive SVD Latent Coordinates</span>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-normal">
                  Define the affinity weight of this movie along the 5 latent taste dimensions. These weights determine matches for collaborative-filtering.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {[
                    "Action/Sci-Fi",
                    "Drama",
                    "Comedy",
                    "Romance",
                    "Thriller"
                  ].map((label, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[9px] font-mono font-bold text-slate-600 dark:text-gray-400">
                        <span className="truncate">{label}</span>
                        <span>{svdFactors[idx].toFixed(1)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={svdFactors[idx]}
                        onChange={(e) => handleSvdSliderChange(idx, Number(e.target.value))}
                        className="w-full h-1 bg-gray-200 dark:bg-slate-950 rounded-lg appearance-none cursor-pointer accent-red-600"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action trigger buttons */}
              <div className="flex gap-3 pt-3 border-t border-gray-150 dark:border-white/5">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase py-3 rounded-xl shadow-lg shadow-red-600/10 hover:shadow-red-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingMovie ? "Save Updates" : "Insert Record"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
