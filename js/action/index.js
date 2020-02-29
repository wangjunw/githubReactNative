/**
 * 根action，导出所有方法
 */
import {onThemeChange, onShowCustomThemeView, onThemeInit} from './theme';
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
import {onLoadLanguage} from './language';
import {onSearch, onSearchLoadMore, onSearchCancel} from './search';
export default {
  onThemeChange,
  onShowCustomThemeView,
  onThemeInit,
  onLoadPopularData,
  onFlushPopularFavorite,
  onLoadMorePopular,
  onLoadMoreTrending,
  onLoadTrendingData,
  onFlushTrendingFavorite,
  onLoadFavoriteData,
  onLoadLanguage,
  onSearch,
  onSearchLoadMore,
  onSearchCancel,
};
