export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm animate-pulse flex flex-col">
      <div className="aspect-square w-full rounded-2xl bg-beige mb-4"></div>
      <div className="h-6 bg-beige rounded-md w-3/4 mb-2"></div>
      <div className="h-4 bg-beige rounded-md w-1/4 mb-6"></div>
      <div className="flex justify-between items-center mt-auto">
        <div className="h-6 bg-beige rounded-md w-1/3"></div>
      </div>
      <div className="w-full h-10 bg-beige rounded-full mt-4"></div>
    </div>
  );
}