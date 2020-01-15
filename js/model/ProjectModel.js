/**
 * 将要展示的仓库信息封装成待收藏状态的
 * @param {any} item
 * @param {boolean} isFavorite
 */
export default function ProjectModel(item, isFavorite) {
  this.item = item;
  this.isFavorite = isFavorite;
}
