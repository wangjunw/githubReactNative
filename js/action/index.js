/**
 * 根action，导出所有方法
 */
import {onThemeChange} from './theme';
import {
  onLoadPopularData,
  onLoadMorePopular,
  onFlushPopularFavorite,
} from './popular';
import {
  onLoadMoreTrending,
  onLoadTrendingData,
  onFlushTrendingFavorite,
} from './trending';
import {onLoadFavoriteData} from './favorite';
export default {
  onThemeChange,
  onLoadPopularData,
  onFlushPopularFavorite,
  onLoadMorePopular,
  onLoadMoreTrending,
  onLoadTrendingData,
  onFlushTrendingFavorite,
  onLoadFavoriteData,
};
