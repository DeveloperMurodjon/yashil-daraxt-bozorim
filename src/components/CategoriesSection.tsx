import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import fruitTrees from "@/assets/fruit-trees.jpg";
import deciduousTrees from "@/assets/deciduous-trees.jpg";
import evergreenTrees from "@/assets/evergreen-trees.jpg";

const categories = [
  {
    id: 1,
    name: "Mevali Daraxtlar",
    description: "Olma, nok, gilos va boshqa mevali daraxtlar",
    image: fruitTrees,
    count: "25+ tur",
    price: "25,000 so'mdan"
  },
  {
    id: 2,
    name: "Bargli Daraxtlar",
    description: "Eman, chinor, qayin va boshqa bargli daraxtlar",
    image: deciduousTrees,
    count: "30+ tur",
    price: "20,000 so'mdan"
  },
  {
    id: 3,
    name: "Doim Yashil",
    description: "Qarag'ay, archa va boshqa iglali daraxtlar",
    image: evergreenTrees,
    count: "20+ tur",
    price: "30,000 so'mdan"
  }
];

const CategoriesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-sage/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Daraxt Turlari
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Turli xil daraxt ko'chatlarini ko'rib chiqing va o'zingizga mos kelganini toping
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Card key={category.id} className="group overflow-hidden border-0 shadow-card hover:shadow-nature transition-all duration-500 transform hover:-translate-y-2 bg-card/80 backdrop-blur-sm">
              <div className="relative overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-forest">{category.count}</span>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-forest transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {category.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Narx</p>
                    <p className="font-bold text-forest">{category.price}</p>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="group-hover:bg-forest group-hover:text-primary-foreground group-hover:border-forest transition-all duration-300"
                  >
                    Ko'rish
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="px-8 py-4 bg-gradient-to-r from-forest to-moss hover:from-primary-hover hover:to-forest shadow-nature transition-all duration-300 transform hover:scale-105"
          >
            Barcha Kategoriyalarni Ko'rish
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;