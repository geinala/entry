export const isUrlActive = (href: string, path: string, mainNav = false): boolean => {
  if (!path) return false;

  const cleanHref = href.split("?")[0];
  const cleanPath = path.split("?")[0];

  const pattern = "^" + cleanHref.replace(/\$[a-zA-Z0-9_]+/g, "[^/]+") + "$";
  const regex = new RegExp(pattern);

  if (regex.test(cleanPath)) {
    return true;
  }

  if (mainNav) {
    const hrefFirstSegment = cleanHref.split("/")[1];
    const pathFirstSegment = cleanPath.split("/")[1];
    return hrefFirstSegment !== "" && hrefFirstSegment === pathFirstSegment;
  }

  return false;
};
