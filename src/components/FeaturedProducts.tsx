import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Olma Ko'chati 'Granny Smith'",
    price: 45000,
    originalPrice: 55000,
    rating: 4.8,
    reviews: 24,
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=400&fit=crop",
    badge: "Mashhur",
    description: "Yuqori sifatli olma ko'chati, 2 yillik",
    stock: "Mavjud"
  },
  {
    id: 2,
    name: "Qarag'ay Ko'chati",
    price: 35000,
    rating: 4.9,
    reviews: 18,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    badge: "Yangi",
    description: "Bog' uchun ideal qarag'ay ko'chati",
    stock: "Mavjud"
  },
  {
    id: 3,
    name: "Gilos Ko'chati",
    price: 50000,
    originalPrice: 60000,
    rating: 4.7,
    reviews: 31,
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=400&fit=crop",
    badge: "Chegirma",
    description: "Shirin gilos ko'chati, 1.5 yillik",
    stock: "Kam qoldi"
  },
  {
    id: 4,
    name: "Eman Ko'chati",
    price: 40000,
    rating: 4.9,
    reviews: 15,
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400&h=400&fit=crop",
    description: "Mustahkam eman ko'chati, uzoq umr",
    stock: "Mavjud"
  }
];

const FeaturedProducts = () => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Mashhur Ko'chatlar
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mijozlarimiz tomonidan eng ko'p tanlanadigan va yuqori baholangan ko'chatlar
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden border-0 shadow-card hover:shadow-nature transition-all duration-500 transform hover:-translate-y-1 bg-card">
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Badge */}
                {product.badge && (
                  <Badge 
                    className={`absolute top-3 left-3 ${
                      product.badge === 'Mashhur' ? 'bg-gold text-earth' :
                      product.badge === 'Yangi' ? 'bg-forest text-primary-foreground' :
                      'bg-destructive text-destructive-foreground'
                    }`}
                  >
                    {product.badge}
                  </Badge>
                )}

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="icon" variant="secondary" className="h-8 w-8 bg-card/90 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                {/* Stock Status */}
                <div className="absolute bottom-3 left-3">
                  <Badge 
                    variant={product.stock === 'Kam qoldi' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {product.stock}
                  </Badge>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-gold text-gold" />
                    <span className="text-sm font-medium ml-1">{product.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">({product.reviews} baho)</span>
                </div>

                {/* Product Info */}
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-forest transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {product.description}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-forest text-lg">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <Button className="w-full bg-gradient-to-r from-forest to-moss hover:from-primary-hover hover:to-forest transition-all duration-300 group-hover:shadow-nature">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Savatga Qo'shish
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg" 
            className="px-8 py-4 border-forest text-forest hover:bg-forest hover:text-primary-foreground transition-all duration-300"
          >
            Barcha Mahsulotlarni Ko'rish
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;