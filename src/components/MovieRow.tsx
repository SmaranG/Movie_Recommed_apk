import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Heart, Star, Compass, Bookmark, Film } from "lucide-react";
import { Movie } from "../moviesData";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  favorites: string[];
  onToggleFavorite: (movieTitle: string) => void;
  onPlayTrailer: (trailerKey: string) => void;
  onSelectAnchor: (movieTitle: string) => void;
  currentAnchorTitle?: string;
  // Optional recommendation scores for recommended list
  recommendationsMetadata?: { [key: string]: { displayScore: string; scoreLabel: string } };
  watchlist?: string[];
  onToggleWatchlist?: (movieTitle: string) => void;
  ratings?: { [key: string]: number };
  onMovieImageError?: (movieId: number) => void;
}

export const MovieRow: React.FC<MovieRowProps> = ({
  title,
  movies,
  favorites,
  onToggleFavorite,
  onPlayTrailer,
  onSelectAnchor,
  currentAnchorTitle,
  recommendationsMetadata,
  watchlist = [],
  onToggleWatchlist,
  ratings,
  onMovieImageError,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const isLightTheme = document.documentElement.classList.contains("light") || !document.documentElement.classList.contains("dark");
  const rowTitleClass = "text-[var(--text-main)] font-black";
  const mutedTextClass = "text-[var(--text-muted)] font-bold";
  const bodyTextClass = "text-[var(--text-main)] font-black";
  const descriptionClass = "text-[var(--text-muted)] font-medium";
  const dividerClass = "border-[var(--border-soft)]";

  const [failedImageIds, setFailedImageIds] = React.useState<number[]>([]);
  const visibleMovies = movies.filter(
    (m) =>
      m.backdropUrl &&
      m.posterUrl &&
      m.backdropUrl.trim() !== "" &&
      m.posterUrl.trim() !== "" &&
      !failedImageIds.includes(m.id)
  );

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth"
      });
    }
  };

  if (visibleMovies.length === 0) return null;

  return (
    <div className="space-y-3 relative group/row text-[var(--text-main)]">
      <div className="flex items-center justify-between px-1">
        <h3 className={`text-sm md:text-base font-black tracking-[0.2em] uppercase flex items-center gap-2 ${rowTitleClass}`}>
          <span className="w-1 h-4 bg-red-600 rounded-full shadow-[0_0_16px_rgba(229,9,20,0.55)]"></span>
          <span>{title}</span>
        </h3>
        
        {/* Carousel buttons */}
        <div className="hidden md:flex items-center gap-1.5 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => scroll("left")}
            className="p-1.5 rounded-full transition-colors cursor-pointer bg-white border border-gray-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:bg-white/6 dark:border-white/10 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/12"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-1.5 rounded-full transition-colors cursor-pointer bg-white border border-gray-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:bg-white/6 dark:border-white/10 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/12"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal List Wrapper */}
      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto scrollbar-none pb-4 px-1 snap-x scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {visibleMovies.map((movie) => {
          const isAnchor = movie.title === currentAnchorTitle;
          const isFavorited = favorites.includes(movie.title);
          const isInWatchlist = watchlist.includes(movie.title);
          const meta = recommendationsMetadata?.[movie.title];

          return (
            <div
              key={movie.id}
              className={`flex-shrink-0 w-[220px] sm:w-[250px] snap-start glass-card rounded-[1.5rem] overflow-hidden border transition-all duration-300 group/card relative ${
                isAnchor 
                  ? "border-red-600 shadow-lg shadow-red-600/15 scale-[0.99]" 
                  : "border-gray-200 dark:border-white/8 hover:border-red-600/35 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(2,6,23,0.18)] dark:hover:shadow-[0_18px_42px_rgba(0,0,0,0.42)]"
              }`}
              style={{
                background: "linear-gradient(180deg, var(--card-bg-start, rgba(255,255,255,0.98)) 0%, var(--card-bg-end, rgba(255,255,255,0.98)) 100%)",
              }}
            >
              <div className="relative h-40 md:h-44 overflow-hidden bg-white dark:bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10"></div>
                
                <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1">
                  {isAnchor && (
                    <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow tracking-[0.18em] uppercase">
                      Current Anchor
                    </span>
                  )}
                  {meta && (
                    <span className="bg-white text-red-500 border border-red-500/25 dark:bg-black/70 dark:text-red-400 dark:border-red-500/20 text-[9px] font-black px-2 py-0.5 rounded-full shadow tracking-[0.18em] uppercase">
                      {meta.displayScore} Score
                    </span>
                  )}
                </div>

                {/* Watchlist button */}
                <button
                  onClick={() => onToggleWatchlist?.(movie.title)}
                  className="absolute top-2.5 right-[46px] z-20 p-2 rounded-full border shadow-md transition-all cursor-pointer hover:scale-110 active:scale-95 bg-white/95 border-gray-300 hover:bg-gray-100 dark:bg-black/90 dark:border-white/20 dark:hover:bg-black/100"
                  title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                >
                  <Bookmark 
                    className={`w-3.5 h-3.5 transition-colors ${isInWatchlist ? "fill-amber-500 !text-amber-500" : "!text-slate-950 dark:!text-white"}`} 
                    strokeWidth={2.5}
                  />
                </button>

                {/* Favorites button */}
                <button
                  onClick={() => onToggleFavorite(movie.title)}
                  className="absolute top-2.5 right-2.5 z-20 p-2 rounded-full border shadow-md transition-all cursor-pointer hover:scale-110 active:scale-95 bg-white/95 border-gray-300 hover:bg-gray-100 dark:bg-black/90 dark:border-white/20 dark:hover:bg-black/100"
                  title={isFavorited ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart 
                    className={`w-3.5 h-3.5 transition-colors ${isFavorited ? "fill-red-500 !text-red-500" : "!text-slate-950 dark:!text-white"}`} 
                    strokeWidth={2.5}
                  />
                </button>

                {failedImageIds.includes(movie.id) ? (
                  <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-red-950/40 flex flex-col items-center justify-center p-4 text-center select-none">
                    <Film className="w-8 h-8 text-red-500 mb-1.5 opacity-85 animate-pulse" />
                    <span className="text-[9px] font-extrabold text-red-500/80 uppercase tracking-widest">{movie.genres[0]}</span>
                    <h5 className="text-[11px] font-black text-white mt-1 px-2 line-clamp-1 select-text">{movie.title}</h5>
                  </div>
                ) : (
                  <img
                    src={movie.backdropUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500 brightness-90 saturate-110"
                    referrerPolicy="no-referrer"
                    onError={() => {
                      if (!failedImageIds.includes(movie.id)) {
                        setFailedImageIds(prev => [...prev, movie.id]);
                      }
                      onMovieImageError?.(movie.id);
                    }}
                  />
                )}
              </div>

              <div className="p-3.5 space-y-2.5">
                <div className={`flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.22em] ${mutedTextClass}`}>
                  <span>{movie.genres[0]} • {movie.releaseYear}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 flex items-center gap-0.5" title="IMDb Rating">
                      <Star className="w-3 h-3 fill-current text-amber-400" />
                      {movie.rating.toFixed(1)}
                    </span>
                    {ratings && ratings[movie.title] !== undefined && (
                      <span className="text-red-500 dark:text-red-400 flex items-center gap-0.5 font-black bg-red-600/10 dark:bg-red-500/15 px-1.5 py-0.5 rounded border border-red-500/15" title="Your Rating">
                        <Star className="w-2.5 h-2.5 fill-current text-red-500" />
                        <span>{ratings[movie.title]}/10</span>
                      </span>
                    )}
                  </div>
                </div>

                <h4 className={`text-xs md:text-sm font-black line-clamp-1 group-hover/card:text-red-500 transition-colors ${bodyTextClass}`}>
                  {movie.title}
                </h4>

                <p className={`text-[10px] line-clamp-2 leading-relaxed min-h-[30px] ${descriptionClass}`}>
                  {movie.overview}
                </p>

                <div className={`flex items-center justify-between pt-2 border-t text-[10px] font-bold ${dividerClass}`}>
                  <button
                    onClick={() => onPlayTrailer(movie.trailerKey)}
                    className="w-full py-1.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-white border border-gray-200 text-slate-500 hover:bg-red-600 hover:text-white dark:bg-white/8 dark:border-white/10 dark:text-white/70 dark:hover:bg-red-600 dark:hover:text-white text-[10px] font-extrabold uppercase tracking-wider"
                    title="Play Video Clip"
                  >
                    <Play className="w-3 h-3 fill-current text-current" />
                    <span>Watch Clip</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
