import { Button } from "@/components/ui/button";
import { Search, Leaf, Truck, Award } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-seedlings.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-sage via-accent to-background overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Tree seedlings nursery"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest/80 via-forest/40 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8 text-center md:text-left">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Daraxt Ko'chatlari
                <span className="block text-forest bg-gradient-to-r from-forest to-moss bg-clip-text text-transparent">
                  Bozori
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                Tabiatni o'zingiz bilan birga o'stirishni boshlang. Sog'lom va chiroyli daraxt ko'chatlarini toping.
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  type="text"
                  placeholder="Daraxt turini qidiring..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-border bg-card/90 backdrop-blur-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                />
              </div>
              <Link to="/buyer-dashboard">
                <Button className="px-8 py-3 bg-gradient-to-r from-forest to-moss hover:from-primary-hover hover:to-forest shadow-nature transition-all duration-300 transform hover:scale-105">
                  Qidirish
                </Button>
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-forest to-moss rounded-full flex items-center justify-center mb-3 shadow-card">
                  <Leaf className="h-6 w-6 text-primary-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">Sog'lom Ko'chatlar</p>
              </div>
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-forest to-moss rounded-full flex items-center justify-center mb-3 shadow-card">
                  <Truck className="h-6 w-6 text-primary-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">To'g'ridan-to'g'ri Sotuvchi</p>
              </div>
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-forest to-moss rounded-full flex items-center justify-center mb-3 shadow-card">
                  <Award className="h-6 w-6 text-primary-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">Kafolat</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Element */}
          <div className="hidden md:block relative">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-forest/20 to-moss/20 rounded-3xl transform rotate-6"></div>
              <div className="relative bg-card/90 backdrop-blur-sm p-8 rounded-3xl shadow-nature border border-border">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-4">Bu Hafta Mashhur</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-sage/50 rounded-xl">
                      <span className="font-medium">Olma daraxti ko'chati</span>
                      <span className="text-forest font-bold">45,000 so'm</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-sage/50 rounded-xl">
                      <span className="font-medium">Qarag'ay ko'chati</span>
                      <span className="text-forest font-bold">35,000 so'm</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-sage/50 rounded-xl">
                      <span className="font-medium">Tut daraxti ko'chati</span>
                      <span className="text-forest font-bold">25,000 so'm</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;