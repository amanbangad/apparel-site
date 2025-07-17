export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  sizes?: string[]
  colors?: string[]
  rating?: number
  originalPrice?: number
  badge?: string
}

export interface Category {
  id: string
  name: string
  description: string
  image: string
}

export const products: Product[] = [
  {
    id: "1",
    name: "Classic Cotton T-Shirt",
    description: "A comfortable, everyday t-shirt made from 100% organic cotton.",
    price: 24.99,
    category: "t-shirts",
    image: "https://www.american-giant.com/cdn/shop/products/W2-2P-1-WH_0605.jpg?v=1653598909",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White", "Navy", "Gray"],
    rating: 4.6,
    badge: "Bestseller",
  },
  {
    id: "2",
    name: "Slim Fit Jeans",
    description: "Modern slim-fit jeans with a touch of stretch for comfort.",
    price: 59.99,
    category: "pants",
    image: "https://s7d2.scene7.com/is/image/aeo/0116_6494_432_of?$pdp-m-opt$",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Blue", "Black", "Gray"],
    rating: 4.3,
  },
  {
    id: "3",
    name: "Oversized Hoodie",
    description: "Cozy oversized hoodie perfect for lounging or casual outings.",
    price: 49.99,
    category: "hoodies",
    image:
      "https://gwestblanks.com/cdn/shop/files/g-west-classic-comfort-oversized-hoodie-gwpchd430-681485.png?v=1735969093",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Gray", "Beige"],
    rating: 4.8,
    badge: "New",
  },
  {
    id: "4",
    name: "Linen Button-Up Shirt",
    description: "Breathable linen shirt for a casual yet refined look.",
    price: 44.99,
    category: "shirts",
    image: "https://oldnavy.gap.com/webcontent/0054/626/560/cn54626560.jpg",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Blue", "Beige"],
    rating: 4.1,
  },
  {
    id: "5",
    name: "Cargo Pants",
    description: "Functional cargo pants with multiple pockets.",
    price: 64.99,
    category: "pants",
    image: "https://img.abercrombie.com/is/image/anf/KIC_156-4015-0092-340_model2.jpg?policy=product-extra-large",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Olive", "Black", "Khaki"],
  },
  {
    id: "6",
    name: "Graphic Print T-Shirt",
    description: "Bold graphic print t-shirt for making a statement.",
    price: 29.99,
    category: "t-shirts",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJwQkN1_gHY-VLOv3vZIqrwNvbWZP-7m6xBg&s",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White"],
    rating: 3.9,
  },
  {
    id: "7",
    name: "Denim Jacket",
    description: "Classic denim jacket that never goes out of style.",
    price: 79.99,
    category: "jackets",
    image:
      "https://shop.mango.com/assets/rcs/pics/static/T7/fotos/S/77050276_TM.jpg?imwidth=2048&imdensity=1&ts=1713805594272",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Black"],
    rating: 4.7,
    originalPrice: 89.99,
    badge: "Sale",
  },
  {
    id: "8",
    name: "Knit Sweater",
    description: "Warm knit sweater for colder days.",
    price: 54.99,
    category: "sweaters",
    image: "https://www.gap.com/webcontent/0056/150/851/cn56150851.jpg",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Cream", "Gray", "Navy"],
    rating: 4.2,
  },
]

export const categories: Category[] = [
  {
    id: "t-shirts",
    name: "T-Shirts",
    description: "Comfortable everyday tees",
    image: "https://us.sunspel.com/cdn/shop/files/mtsh0001-bkaa-1.jpg?v=1739884034",
  },
  {
    id: "pants",
    name: "Pants",
    description: "Jeans, chinos, and more",
    image: "https://truewerk.com/cdn/shop/files/T3_WerkPant_Brown_Layflat.jpg?v=1738887166&width=2400",
  },
  {
    id: "hoodies",
    name: "Hoodies",
    description: "Stay cozy and stylish",
    image: "https://perplex.store/cdn/shop/files/1000084-ArmorHoodieBlack_01.jpg?v=1738498805",
  },
  {
    id: "shirts",
    name: "Shirts",
    description: "Button-ups and casual shirts",
    image:
      "https://thursdayboots.com/cdn/shop/files/1024x1024-EverydayShirt-Grey-080724-Front-2x.jpg?v=1725660451&width=2048",
  },
  {
    id: "jackets",
    name: "Jackets",
    description: "For all weather conditions",
    image:
      "https://cdni.llbean.net/is/image/wim/520163_699_82?hei=1095&wid=950&resMode=sharp2&defaultImage=llbprod/520163_699_41",
  },
  {
    id: "sweaters",
    name: "Sweaters",
    description: "Warm and fashionable",
    image: "https://cdni.llbean.net/is/image/wim/505183_1155_41",
  },
]

export const getProductById = (id: string) => products.find((p) => p.id === id)
export const getProductsByCategory = (categoryId: string) => products.filter((p) => p.category === categoryId)
