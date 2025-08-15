

interface Product {
  image_url?: string | null; // Optional image URL
  title: string;
  description?: string;
  price: number | string;  // Accepts both number and string representations

}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      {product.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img 
          src={product.image_url} 
          alt={product.title} 
          className="w-full h-48 object-cover rounded" 
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 rounded" />
      )}

      <div className="mt-4 flex-1">
        <h3 className="font-semibold">{product.title}</h3>
        {product.description && (
          <p className="text-sm text-gray-500 mt-1">{product.description}</p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="font-bold">
          ${Number(product.price).toFixed(2)}
        </div>
        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
          Buy
        </button>
      </div>
    </div>
  );
}