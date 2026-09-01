export interface ProductVariant {
  name: string;
  hex: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  model: string;
  price: number;
  badge?: string;
  category: string;
  tags: string[];
  image: string; // Default primary image
  variants: ProductVariant[];
}

export const HEADPHONES: Product[] = [
  {
    id: "SK101",
    name: "1000X THE COLLEXION",
    model: "WH-1000XX/W",
    price: 34990,
    badge: "Limited",
    category: "Wireless Noise Cancelling",
    tags: ["Sony", "Premium", "Audio"],
    image: "https://d1ncau8tqf99kp.cloudfront.net/converted/154280_original_local_1200x1050_v3_converted.webp",
    variants: [
      { name: "White", hex: "#F5F5F5", image: "https://d1ncau8tqf99kp.cloudfront.net/converted/154280_original_local_1200x1050_v3_converted.webp" },
      { name: "Black", hex: "#1A1A1A", image: "https://d1ncau8tqf99kp.cloudfront.net/converted/154266_original_local_1200x1050_v3_converted.webp" }
    ]
  },
  {
    id: "SK102",
    name: "WH-1000XM6",
    model: "WH-1000XM6/B",
    price: 29990,
    badge: "New",
    category: "Wireless Noise Cancelling",
    tags: ["Sony", "Flagship", "ANC"],
    image: "https://d1ncau8tqf99kp.cloudfront.net/converted/152005_original_local_1200x1050_v3_converted.webp",
    variants: [
      { name: "Black", hex: "#1A1A1A", image: "https://d1ncau8tqf99kp.cloudfront.net/converted/152005_original_local_1200x1050_v3_converted.webp" },
      { name: "Midnight Blue", hex: "#191970", image: "https://d1ncau8tqf99kp.cloudfront.net/converted/128962_original_local_1200x1050_v3_converted.webp" },
      { name: "Olive Gray", hex: "#708238", image: "https://d1ncau8tqf99kp.cloudfront.net/converted/156314_original_local_1200x1050_v3_converted.webp" },
      { name: "Platinum Silver", hex: "#E5E4E2", image: "https://d1ncau8tqf99kp.cloudfront.net/converted/128978_original_local_1200x1050_v3_converted.webp" },
      { name: "Sand Pink", hex: "#F4A460", image: "https://d1ncau8tqf99kp.cloudfront.net/converted/152001_original_local_1200x1050_v3_converted.webp" }
    ]
  },
  {
    id: "SK103",
    name: "WH-1000XM4 Premium",
    model: "WH-1000XM4",
    price: 24990,
    badge: "Best Seller",
    category: "Wireless Noise Cancelling",
    tags: ["Sony", "Classic", "ANC"],
    image: "https://d1ncau8tqf99kp.cloudfront.net/converted/74739_original_local_1200x1050_v3_converted.webp",
    variants: [
      { name: "Black", hex: "#1A1A1A", image: "https://d1ncau8tqf99kp.cloudfront.net/converted/74739_original_local_1200x1050_v3_converted.webp" },
      { name: "Midnight Blue", hex: "#191970", image: "https://d1ncau8tqf99kp.cloudfront.net/converted/106682_original_local_1200x1050_v3_converted.webp" },
      { name: "Silver", hex: "#C0C0C0", image: "https://d1ncau8tqf99kp.cloudfront.net/converted/74748_original_local_1200x1050_v3_converted.webp" }
    ]
  },
  {
    id: "SK104",
    name: "ULT WEAR",
    model: "ULT WEAR",
    price: 16990,
    category: "Bass Heavy Wireless",
    tags: ["Sony", "Bass", "Street"],
    image: "https://d1ncau8tqf99kp.cloudfront.net/converted/119266_original_local_1200x1050_v3_converted.webp",
    variants: [
      { name: "Black", hex: "#1A1A1A", image: "https://d1ncau8tqf99kp.cloudfront.net/converted/119266_original_local_1200x1050_v3_converted.webp" },
      { name: "Forest Gray", hex: "#4A5D23", image: "https://d1ncau8tqf99kp.cloudfront.net/converted/119308_original_local_1200x1050_v3_converted.webp" },
      { name: "Off-White", hex: "#FAF9F6", image: "https://d1ncau8tqf99kp.cloudfront.net/converted/119302_original_local_1200x1050_v3_converted.webp" }
    ]
  },
  {
    id: "SK105",
    name: "WH-CH720N",
    model: "WH-CH720N/B",
    price: 9990,
    badge: "15% Off",
    category: "Lightweight ANC",
    tags: ["Sony", "Budget", "Everyday"],
    image: "https://d1ncau8tqf99kp.cloudfront.net/converted/110696_original_local_1200x1050_v3_converted.webp",
    variants: [
      { name: "Black", hex: "#1A1A1A", image: "https://d1ncau8tqf99kp.cloudfront.net/converted/110696_original_local_1200x1050_v3_converted.webp" },
      { name: "Pink", hex: "#FFC0CB", image: "https://d1ncau8tqf99kp.cloudfront.net/converted/124375_original_local_1200x1050_v3_converted.webp" },
      { name: "White", hex: "#FFFFFF", image: "https://d1ncau8tqf99kp.cloudfront.net/converted/110671_original_local_1200x1050_v3_converted.webp" }
    ]
  },
  {
    id: "SK106",
    name: "HDB-630",
    model: "HDB-630",
    price: 22990,
    category: "Audiophile Closed-Back",
    tags: ["Sennheiser", "Studio", "Pro"],
    image: "https://in.sennheiser-hearing.com/cdn/shop/files/hdb_630_isofront_final.jpg?v=1763359039",
    variants: [
      { name: "Black", hex: "#1A1A1A", image: "https://in.sennheiser-hearing.com/cdn/shop/files/hdb_630_isofront_final.jpg?v=1763359039" }
    ]
  },
  {
    id: "SK107",
    name: "Momentum 4 Wireless",
    model: "MOMENTUM 4",
    price: 34990,
    badge: "Top Rated",
    category: "Premium Audiophile ANC",
    tags: ["Sennheiser", "Premium", "Travel"],
    image: "https://in.sennheiser-hearing.com/cdn/shop/files/MOMENTUM_4_Black.jpg?v=1773910405",
    variants: [
      { name: "Black", hex: "#1A1A1A", image: "https://in.sennheiser-hearing.com/cdn/shop/files/MOMENTUM_4_Black.jpg?v=1773910405" },
      { name: "White", hex: "#F5F5F5", image: "https://in.sennheiser-hearing.com/cdn/shop/files/Sennheiser_MOMENTUM_4_Wireless_White.jpg?v=1773910405" },
      { name: "Graphite", hex: "#41424C", image: "https://in.sennheiser-hearing.com/cdn/shop/files/MOMENTUM_4_Wireless_Graphite.jpg?v=1773910405" },
      { name: "Brown", hex: "#8B4513", image: "https://in.sennheiser-hearing.com/cdn/shop/files/MOMENTUM_4_Brown.jpg?v=1773910405" },
      { name: "Denim", hex: "#1560BD", image: "https://in.sennheiser-hearing.com/cdn/shop/files/MOMENTUM_4_Wireless_Denim_Isofront.jpg?v=1782990193" },
      { name: "Copper", hex: "#B87333", image: "https://in.sennheiser-hearing.com/cdn/shop/files/Sennheiser_MOMENTUM_4_Wireless_Copper_Main_Image.jpg?v=1773911038" }
    ]
  },
  {
    id: "SK108",
    name: "Accentum Wireless",
    model: "ACCENTUM",
    price: 14990,
    category: "Everyday ANC",
    tags: ["Sennheiser", "Value", "ANC"],
    image: "https://in.sennheiser-hearing.com/cdn/shop/files/Sennheiser_ACCENTUM_Wireless_Black_Main_Image.jpg?v=1773910411",
    variants: [
      { name: "Black", hex: "#1A1A1A", image: "https://in.sennheiser-hearing.com/cdn/shop/files/Sennheiser_ACCENTUM_Wireless_Black_Main_Image.jpg?v=1773910411" },
      { name: "White", hex: "#F5F5F5", image: "https://in.sennheiser-hearing.com/cdn/shop/files/Sennheiser_ACCENTUM_Wireless_White_Main_Image.jpg?v=1773910411" },
      { name: "Taupe", hex: "#483C32", image: "https://in.sennheiser-hearing.com/cdn/shop/files/eyJwYXRoIjoic29ub3ZhXC9maWxlXC9hbWg5VEdMSmVKbUJkb2tmQnpSNS5qcGcifQ_sonova_lpQ1jhQcg5gKovGMs0XFjmdcyJ0GciBJRC9Fi9Savj4.jpg?v=1773910411" }
    ]
  },
  {
    id: "SK109",
    name: "Nothing Headphone (1)",
    model: "H1",
    price: 12999,
    badge: "Trending",
    category: "Transparent ANC",
    tags: ["Nothing", "Design", "LDAC"],
    image: "https://rukminim2.flixcart.com/image/1680/1680/xif0q/headphone/0/k/4/-original-imahekevgrz9z6rf.jpeg?q=90",
    variants: [
      { name: "White", hex: "#F5F5F5", image: "https://rukminim2.flixcart.com/image/1680/1680/xif0q/headphone/0/k/4/-original-imahekevgrz9z6rf.jpeg?q=90" },
      { name: "Black", hex: "#1A1A1A", image: "https://rukminim2.flixcart.com/image/1680/1680/xif0q/headphone/e/k/q/-original-imahech89szuqsph.jpeg?q=90" }
    ]
  },
  {
    id: "SK110",
    name: "CMF By Nothing Pro",
    model: "CMF-PRO",
    price: 4999,
    category: "Budget ANC",
    tags: ["Nothing", "CMF", "Value"],
    image: "https://m.media-amazon.com/images/I/71BJ97yWYgL._SL1500_.jpg",
    variants: [
      { name: "Dark Grey", hex: "#A9A9A9", image: "https://m.media-amazon.com/images/I/71BJ97yWYgL._SL1500_.jpg" },
      { name: "Light Green", hex: "#90EE90", image: "https://m.media-amazon.com/images/I/81MPd6JPxdL._SL1500_.jpg" },
      { name: "Light Grey", hex: "#D3D3D3", image: "https://m.media-amazon.com/images/I/81YyQ5D95YL._SL1500_.jpg" }
    ]
  }
];
