import type { TMenuItem } from "../types/menu";
import { isUrlActive } from "../utils/url";

/**
Method ini digunakan untuk melakukan pengecekan apakah
sebuah menu sedang aktif atau tidak
*/
export const checkIsActive = (href: string, item: TMenuItem, mainNav = false) => {
  if (!item.to) return false;
  return isUrlActive(href, item.to, mainNav);
};
