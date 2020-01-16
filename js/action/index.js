/**
 * 根action，导出所有方法
 */
import {onThemeChange} from './theme';
import {onLoadPopularData, onLoadMorePopular} from './popular';
import {onLoadMoreTrending, onLoadTrendingData} from './trending';
import {onLoadFavoriteData} from './favorite';
export default {
  onThemeChange,
  onLoadPopularData,
  onLoadMorePopular,
  onLoadMoreTrending,
  onLoadTrendingData,
  onLoadFavoriteData,
};
