export const getCategoryPath = (cat: any, allCats: any[]): string => {
  const path = [cat.name];
  let current = cat;
  while (current.parentId || current.parent?.id) {
    const pid = current.parentId || current.parent?.id;
    const parent = allCats.find((c: any) => c.id === pid);
    if (parent) {
      path.unshift(parent.name);
      current = parent;
    } else {
      break;
    }
  }
  return path.join(" > ");
};
