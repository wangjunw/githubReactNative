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
}
