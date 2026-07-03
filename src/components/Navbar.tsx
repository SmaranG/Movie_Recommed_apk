import React, { useState, useRef, useEffect } from "react";
import { Search, User, LogOut, Moon, Sun, ChevronRight, X, Star, Sparkles } from "lucide-react";
import { Movie } from "../moviesData";

interface NavbarProps {
  currentUser: string | null;
  firstName?: string;
  lastName?: string;
  onLogout: () => void;
  onUpdateTastes: () => void;
  theme: string;
  onToggleTheme: () => void;
  moviesList: Movie[];
  onSelectAnchor: (title: string) => void;
  favoritesCount: number;
  activeTab: "home" | "mylist" | "admin";
  onTabChange: (tab: "home" | "mylist" | "admin") => void;
  onSearchHistoryAdd?: (query: string) => void;
  currentUserRole?: "user" | "admin";
  // Matchmaker integration
  aiPromptInput: string;
  setAiPromptInput: (val: string) => void;
  isGeneratingAiRecs: boolean;
  handleGenerateAiRecommendations: (e?: React.FormEvent) => Promise<void> | void;
  aiError: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  firstName,
  lastName,
  onLogout,
  onUpdateTastes,
  theme,
  onToggleTheme,
  moviesList,
  onSelectAnchor,
  favoritesCount,
  activeTab,
  onTabChange,
  onSearchHistoryAdd,
  currentUserRole,
  aiPromptInput,
  setAiPromptInput,
  isGeneratingAiRecs,
  handleGenerateAiRecommendations,
  aiError,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isMatchmakerOpen, setIsMatchmakerOpen] = useState(false);
  const matchmakerRef = useRef<HTMLDivElement>(null);

  // Filter movies matching query with optimized prefix-based and exact matching priorities
  const filteredSearch = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    const matches = moviesList.filter((m) => {
      const titleLower = m.title.toLowerCase();
      const startsWithQuery = titleLower.startsWith(query);
      const wordStartsWithQuery = titleLower.split(/\s+/).some((word) => word.startsWith(query));

      return startsWithQuery || wordStartsWithQuery;
    });

    // Sort to optimize suggestion hierarchy:
    // 1. Exact match (case-insensitive)
    // 2. Title starts with the query
    // 3. Shorter title lengths (places "Spiderman" before "Spiderman 2", "Spiderman 2" before "Spiderman 3")
    // 4. Higher ratings
    matches.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();

      const aExact = aTitle === query;
      const bExact = bTitle === query;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      const aStarts = aTitle.startsWith(query);
      const bStarts = bTitle.startsWith(query);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      if (aTitle.length !== bTitle.length) {
        return aTitle.length - bTitle.length;
      }

      return b.rating - a.rating;
    });

    return matches.slice(0, 10);
  }, [searchQuery, moviesList]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (matchmakerRef.current && !matchmakerRef.current.contains(e.target as Node)) {
        setIsMatchmakerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = firstName
    ? firstName
    : currentUser
      ? currentUser.includes("@")
        ? currentUser.split("@")[0]
        : currentUser
      : "Guest";

  const isLightTheme = theme !== "dark";

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-xl text-[var(--text-main)]"
      style={{
        backgroundColor: isLightTheme ? "rgba(255, 255, 255, 0.96)" : "rgba(0, 0, 0, 0.70)",
        borderColor: isLightTheme ? "rgba(17, 17, 17, 0.08)" : "rgba(255, 255, 255, 0.08)",
        boxShadow: isLightTheme ? "0 8px 30px rgba(2, 6, 23, 0.08)" : "0 12px 40px rgba(0, 0, 0, 0.35)",
      }}
    >
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="shrink-0 text-2xl md:text-3xl font-black tracking-[0.24em] text-red-600 hover:text-red-500 transition-colors cursor-pointer select-none"
            style={{ fontFamily: "var(--font-display)" }}
            onClick={() => {
              setSearchQuery("");
              onSelectAnchor("Inception");
              onTabChange("home");
            }}
          >
            CINEMATCH
          </button>

          <div className="flex items-center gap-4 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.12em] md:tracking-[0.22em]">
            <button
              onClick={() => onTabChange("home")}
              className={`transition-all cursor-pointer pb-0.5 ${
                activeTab === "home"
                  ? isLightTheme
                    ? "text-slate-950 font-black border-b-2 border-red-600"
                    : "text-white font-black border-b-2 border-red-600"
                  : isLightTheme
                    ? "text-slate-500 hover:text-slate-950"
                    : "text-white/55 hover:text-white"
              }`}
            >
              Home
            </button>
            {currentUserRole === "admin" && (
              <button
                onClick={() => onTabChange("admin")}
                className={`transition-all cursor-pointer pb-0.5 ${
                  activeTab === "admin"
                    ? isLightTheme
                      ? "text-slate-950 font-black border-b-2 border-red-600"
                      : "text-white font-black border-b-2 border-red-600"
                    : isLightTheme
                      ? "text-slate-500 hover:text-slate-950"
                      : "text-white/55 hover:text-white"
                }`}
              >
                Admin Panel
              </button>
            )}
          </div>

          <div className="flex-1" />

          <div className="relative w-full max-w-[240px] md:max-w-sm" ref={dropdownRef}>
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-slate-500 dark:text-white/45" />
              <input
                type="text"
                placeholder="Titles, genres, cast"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    if (onSearchHistoryAdd) {
                      onSearchHistoryAdd(searchQuery.trim());
                    }
                    setShowDropdown(false);
                  }
                }}
                className={`w-full text-xs text-[var(--text-input)] pl-9 pr-8 py-2.5 rounded-full outline-none focus:border-red-500/70 transition-all ${isLightTheme ? "bg-white border border-gray-200 focus:bg-white shadow-sm" : "bg-white/6 dark:bg-white/6 border border-white/10 focus:bg-white/10"}`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 p-0.5 text-slate-500 dark:text-white/50 hover:text-red-500 rounded-md cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {showDropdown && filteredSearch.length > 0 && (
              <div className={`absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-2xl max-h-72 overflow-y-auto overflow-x-hidden z-50 divide-y ${isLightTheme ? "border border-gray-200 bg-white divide-gray-100" : "border border-white/10 bg-[#0c0c11]/98 divide-white/6"}`}>
                {filteredSearch.map((movie) => (
                  <button
                    key={movie.id}
                    onClick={() => {
                      onSelectAnchor(movie.title);
                      if (onSearchHistoryAdd) {
                        onSearchHistoryAdd(movie.title);
                      }
                      setSearchQuery("");
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/6 transition-colors flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-red-500 truncate block">
                        {movie.title}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-white/45 block truncate">
                        {movie.genres.join(" / ")} • {movie.releaseYear}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 text-[10px] font-bold text-slate-500 dark:text-white/55">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{movie.rating.toFixed(1)}</span>
                      <ChevronRight className="w-3 h-3 text-slate-400 dark:text-white/35 group-hover:translate-x-0.5 transition-transform ml-1" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onToggleTheme}
            className={`hidden sm:inline-flex p-2.5 rounded-full transition-all cursor-pointer items-center justify-center ${isLightTheme ? "bg-white border border-gray-200 text-slate-500 hover:text-slate-900 shadow-sm" : "bg-white/6 border border-white/10 text-white/65 hover:text-white"}`}
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* AI Movie Matchmaker Panel */}
          <div className="relative" ref={matchmakerRef}>
            <button
              onClick={() => setIsMatchmakerOpen(!isMatchmakerOpen)}
              className={`inline-flex p-2.5 rounded-full transition-all cursor-pointer items-center justify-center relative ${
                isMatchmakerOpen
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                  : isLightTheme
                    ? "bg-white border border-gray-200 text-amber-600 hover:text-amber-750 hover:bg-amber-50/50 shadow-sm"
                    : "bg-white/6 border border-white/10 text-amber-500 hover:text-amber-400 hover:bg-white/10"
              }`}
              title="AI Movie Matchmaker"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
            </button>

            {isMatchmakerOpen && (
              <div
                className={`absolute right-0 mt-3 w-80 rounded-2xl p-4 shadow-2xl z-50 border transition-all animate-fade-in ${
                  isLightTheme
                    ? "bg-white border-gray-200 text-slate-800"
                    : "bg-[#0f0f16] border-white/10 text-white"
                }`}
                style={{
                  boxShadow: isLightTheme
                    ? "0 20px 50px rgba(0,0,0,0.12)"
                    : "0 25px 60px rgba(0,0,0,0.45)",
                }}
              >
                <h3 className="text-xs font-black tracking-wider uppercase text-amber-600 dark:text-amber-500 flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  AI Movie Matchmaker
                </h3>
                <p className={`text-[11px] leading-normal mb-3 ${isLightTheme ? "text-slate-500" : "text-gray-400"}`}>
                  Describe the specific mood, scenario, or theme you want. CineMatch AI will curate matching recommendations.
                </p>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await handleGenerateAiRecommendations(e);
                  }}
                  className="space-y-3"
                >
                  <textarea
                    value={aiPromptInput}
                    onChange={(e) => setAiPromptInput(e.target.value)}
                    placeholder="e.g. A cyberpunk neo-noir mystery with mind-bending plots."
                    rows={3}
                    className={`w-full text-xs px-3 py-2 rounded-xl outline-none resize-none focus:ring-1 focus:ring-amber-500 font-medium transition-all ${
                      isLightTheme
                        ? "bg-slate-50 border border-gray-300 text-slate-900 placeholder:text-gray-400"
                        : "bg-slate-950 border border-white/10 text-white placeholder:text-gray-600"
                    }`}
                  />

                  {aiError && (
                    <p className="text-[10px] text-red-500 font-bold bg-red-50 dark:bg-red-950/30 p-2 rounded-lg border border-red-200 dark:border-red-900/50">
                      {aiError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isGeneratingAiRecs || !aiPromptInput.trim()}
                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 disabled:text-slate-500 text-xs font-black py-2.5 px-4 rounded-xl shadow-md hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isGeneratingAiRecs ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                        <span>Curating with AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Get AI Picks</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Standalone Library Section */}
          <button
            onClick={() => onTabChange("mylist")}
            className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
              activeTab === "mylist"
                ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-600/20"
                : isLightTheme
                  ? "bg-white border-gray-200 text-slate-700 hover:bg-gray-50 hover:text-slate-950 shadow-sm"
                  : "bg-white/6 border-white/10 text-white/80 hover:bg-white/10 hover:text-white"
            }`}
            title="Library Favorites & Watch History"
          >
            <span className="uppercase tracking-wider text-[10px]">Library</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-black min-w-[20px] text-center shadow-sm ${
              activeTab === "mylist" ? "bg-white text-red-600" : "bg-red-600 text-white"
            }`}>
              {favoritesCount}
            </span>
          </button>

          {/* Standalone Profile Section */}
          <button
            onClick={onUpdateTastes}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
              isLightTheme
                ? "bg-white border-gray-200 text-slate-700 hover:bg-gray-50 hover:text-slate-950 shadow-sm"
                : "bg-white/6 border-white/10 text-white/80 hover:bg-white/10 hover:text-white"
            }`}
            title="Edit profile and taste profile"
          >
            <User className="w-3.5 h-3.5 text-red-500" />
            <span className="truncate max-w-[90px]" title={currentUser ? `${firstName || ""} ${lastName || ""}`.trim() || currentUser : "Guest"}>
              {displayName}
            </span>
          </button>

          {/* Standalone Logout Section */}
          <button
            onClick={onLogout}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
              isLightTheme
                ? "bg-white border-gray-200 text-slate-500 hover:border-red-600/30 hover:bg-red-50/50 hover:text-red-600 shadow-sm"
                : "bg-white/6 border-white/10 text-white/65 hover:border-red-500/30 hover:bg-red-950/20 hover:text-red-400"
            }`}
            title="Sign out & reset session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline uppercase tracking-wider text-[10px]">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
