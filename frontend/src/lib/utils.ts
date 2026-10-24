export const getProductImage = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("круассан")) return "/images/croissant.jpg";
  if (n.includes("булочка")) return "/images/bun.jpg";
  if (n.includes("багет")) return "/images/baguette.jpg";
  return "/images/bread.jpg";
};