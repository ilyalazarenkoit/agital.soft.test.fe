export type ProductImage = {
  url: string;
  alt: string;
};

export type Review = {
  _id: string;
  productId: string;
  userId?: string;
  name: string;
  stars: number;
  text: string;
  createdAt: string;
};

export type ReviewsResponse = {
  items: Review[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type Product = {
  _id: string;
  name: string;
  version: string;
  images: ProductImage[];
  shortDescription: string;
  longDescription: string;
  price: {
    reseller?: number;
    uvp: number;
    discount: number;
  };
  inStock: boolean;
  avgRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
};
