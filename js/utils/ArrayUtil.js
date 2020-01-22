export default class ArrayUtil {
  /**
   * 判断两个数组是否相等
   */
  static isEqual(arr1, arr2) {
    if (!arr1 || !arr2) {
      return false;
    }
    if (arr2.length !== arr1.length) {
      return false;
    }
    for (let i = 0, len = arr1.length; i < len; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }
  /**
   * 更新数组，元素已经存在就删除，不存在就添加
   */
  static updateArray(array, item) {
    for (let i = 0, len = array.length; i < len; i++) {
      let temp = array[i];
      if (item === temp) {
        array.splice(i, 1);
        return;
      }
    }
    array.push(item);
  }
  /**
   * 移除数组中指定元素
   * item:要移除的item
   * id:要对比的属性
   */
  static remove(array, item, id) {
    if (!array) {
      return;
    }
    for (let i = 0, l = array.length; i < l; i++) {
      const val = array[i];
      if (item === val || (val && val[id] && val[id] === item[id])) {
        array.splice(i, 1);
      }
    }
    return array;
  }

  /**
   * 克隆新的数组
   */
  static clone(from) {
    if (!from) {
      return [];
    }
    let newArray = [];
    for (let i = 0, l = from.length; i < l; i++) {
      newArray[i] = from[i];
    }
    return newArray;
  }
}
