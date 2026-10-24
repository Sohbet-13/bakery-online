export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string;
  ingredients: string;
  price: string; // Laravel отдает decimal как строку
  image_path: string;
  is_available: number;
  is_featured: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface CatalogResponse {
  categories: Category[];
  products: Product[];
}