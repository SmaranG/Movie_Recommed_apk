import React, { useState, useEffect } from "react";
import { Play, Heart, Star, Film, Award } from "lucide-react";
import { Movie } from "../moviesData";

interface SpotlightHeroProps {
  movie: Movie;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  onPlayTrailer: () => void;
  theme: string;
  userRating?: number;
  onRateMovie?: (rating: number) => void;
}

export const SpotlightHero: React.FC<SpotlightHeroProps> = ({
  movie,
  isFavorited,
  onToggleFavorite,
  onPlayTrailer,
  theme,
  userRating,
  onRateMovie,
}) => {
  const isLightTheme = theme !== "dark";
  const [backdropSrc, setBackdropSrc] = useState(movie.backdropUrl);

  useEffect(() => {
    const img = new Image();
    img.src = movie.backdropUrl;
    img.onload = () => {
      setBackdropSrc(movie.backdropUrl);
    };
    img.onerror = () => {
      setBackdropSrc("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&auto=format&fit=crop");
    };
  }, [movie.backdropUrl]);

  const favoriteButtonClass = isLightTheme
    ? "bg-white text-slate-900 border border-gray-200 hover:bg-gray-50"
    : "bg-white/90 dark:bg-black/35 text-slate-900 dark:text-white border-black/10 dark:border-white/15 hover:bg-white dark:hover:bg-white/10";
  const infoChipClass = isLightTheme
    ? "bg-white text-slate-800 border border-gray-200"
    : "bg-white/85 dark:bg-white/8 text-slate-800 dark:text-white/85 border border-black/10 dark:border-white/10";

  return (
    <div 
      className="relative overflow-hidden rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-[0_24px_80px_rgba(2,6,23,0.18)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.5)] min-h-[460px] flex items-end bg-white"
      style={{
        backgroundImage: isLightTheme
          ? `linear-gradient(90deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.90) 34%, rgba(255, 255, 255, 0.40) 58%, rgba(255, 255, 255, 0.10) 100%), linear-gradient(0deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.30) 55%, rgba(255, 255, 255, 0.08) 100%), url(${backdropSrc})`
          : `linear-gradient(90deg, rgba(7, 7, 11, 0.98) 0%, rgba(7, 7, 11, 0.82) 34%, rgba(7, 7, 11, 0.34) 58%, rgba(7, 7, 11, 0.08) 100%), linear-gradient(0deg, rgba(7, 7, 11, 0.96) 0%, rgba(7, 7, 11, 0.12) 55%, rgba(7, 7, 11, 0.04) 100%), url(${backdropSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
    >
      <div className={`absolute inset-0 pointer-events-none ${isLightTheme ? "bg-[radial-gradient(circle_at_top_left,rgba(229,9,20,0.08),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.4),transparent_28%)]" : "bg-[radial-gradient(circle_at_top_left,rgba(229,9,20,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)]"}`} />
      <div className={`absolute inset-x-0 bottom-0 h-40 pointer-events-none ${isLightTheme ? "bg-gradient-to-t from-white to-transparent" : "bg-gradient-to-t from-black to-transparent"}`} />

      <div className="relative p-6 md:p-10 lg:p-12 w-full max-w-4xl z-10 space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-red-600 text-white text-[10px] font-black tracking-[0.28em] px-2.5 py-1 rounded-full uppercase shadow-lg shadow-red-600/20">
            CineMatch Pick
          </span>
          <span className={`${infoChipClass} backdrop-blur-md text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1`}>
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{movie.rating.toFixed(1)} IMDb</span>
          </span>
          <span className={`${infoChipClass} backdrop-blur-md text-[11px] font-bold px-2.5 py-1 rounded-full`}>
            {movie.releaseYear}
          </span>
          <span className={`${infoChipClass} backdrop-blur-md text-[11px] font-bold px-2.5 py-1 rounded-full uppercase`}>
            {movie.language === "en" ? "English" : movie.language}
          </span>
        </div>

        <h1
          className={`max-w-3xl text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-[0.02em] leading-[0.88] ${isLightTheme ? "text-slate-900 drop-shadow-[0_8px_20px_rgba(255,255,255,0.8)]" : "text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)]"}`}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {movie.title}
        </h1>

        <p className={`text-[11px] md:text-xs uppercase tracking-[0.24em] font-bold ${isLightTheme ? "text-red-600" : "text-red-400"}`}>
          Directed by {movie.director}
        </p>

        <p className={`text-sm md:text-base max-w-2xl leading-7 line-clamp-3 ${isLightTheme ? "text-slate-700" : "text-white/78 drop-shadow-sm"}`}>
          {movie.overview}
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onPlayTrailer}
            className="flex items-center gap-2 px-6 py-3.5 bg-white text-black text-xs md:text-sm font-black rounded-full shadow-lg shadow-black/20 hover:bg-gray-50 transition-all cursor-pointer transform hover:scale-[1.03] active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-current text-black" />
            <span>Play Trailer</span>
          </button>

          <button
            onClick={onToggleFavorite}
            className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs md:text-sm font-bold transition-all cursor-pointer ${isFavorited ? "bg-red-600/15 text-red-500 border border-red-500/30 hover:bg-red-600/20" : favoriteButtonClass}`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? "fill-current text-red-500" : "text-slate-900"}`} />
            <span>{isFavorited ? "In Library" : "Add to Favorites"}</span>
          </button>

          <div className="flex flex-wrap gap-1 md:ml-4">
            {movie.genres.map(genre => (
              <span key={genre} className={`${isLightTheme ? "bg-white text-slate-800 border border-gray-200" : "bg-white/85 dark:bg-black/55 text-slate-800 dark:text-white/70 border border-black/10 dark:border-white/10"} backdrop-blur-md px-2 py-0.5 rounded-full font-semibold tracking-[0.2em] uppercase text-[9px] md:text-[10px]`}>
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Interactive Rating Component */}
        <div className={`p-4 rounded-2xl backdrop-blur-md border ${
          isLightTheme 
            ? "bg-white/80 border-gray-250 shadow-sm" 
            : "bg-slate-900/60 border-white/8"
        } max-w-lg transition-all`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse animate-duration-1000" />
              <span className={`text-[11px] font-black uppercase tracking-wider ${isLightTheme ? "text-slate-800" : "text-white"}`}>
                Your Personal Rating
              </span>
            </div>
            
            {userRating !== undefined ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-red-600 bg-red-600/10 dark:bg-red-500/15 px-3 py-1 rounded-full border border-red-500/20">
                  Rated: {userRating}/10
                </span>
                <button
                  onClick={() => onRateMovie && onRateMovie(0)} // Reset rating to trigger edit
                  className={`text-[10px] font-bold underline cursor-pointer hover:text-red-500 transition-colors ${
                    isLightTheme ? "text-slate-500" : "text-gray-400"
                  }`}
                >
                  Change Rating
                </button>
              </div>
            ) : (
              <span className="text-[10px] font-medium text-slate-400 dark:text-gray-400">
                Not rated yet
              </span>
            )}
          </div>

          {/* Render Rating Selection badges if not rated or wanting to change */}
          {userRating === undefined && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => onRateMovie && onRateMovie(num)}
                  className={`w-8 h-8 rounded-full font-black text-xs transition-all cursor-pointer flex items-center justify-center ${
                    isLightTheme
                      ? "bg-gray-150/80 hover:bg-red-600 hover:text-white text-slate-800 border border-gray-200/60 shadow-xs"
                      : "bg-white/5 hover:bg-red-600 hover:text-white text-gray-300 border border-white/5 hover:border-red-600"
                  } hover:scale-110 active:scale-90`}
                >
                  {num}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
