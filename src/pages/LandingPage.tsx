import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Leaf, 
  Users, 
  Shield, 
  Truck, 
  Star, 
  CheckCircle, 
  ArrowRight,
  MessageSquare,
  Award,
  Globe,
  Clock,
  Heart
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const LandingPage = () => {
  const features = [
    {
      icon: Users,
      title: "Ishonchli Sotuvchilar",
      description: "Barcha sotuvchilar admin tomonidan tasdiqlangan va tekshirilgan"
    },
    {
      icon: Shield,
      title: "Xavfsiz Savdo",
      description: "To'g'ridan-to'g'ri sotuvchi bilan bog'lanish va xavfsiz to'lov"
    },
    {
      icon: Award,
      title: "Sifat Kafolati",
      description: "Yuqori sifatli ko'chatlar va sotuvchilardan kafolat"
    },
    {
      icon: Clock,
      title: "24/7 Qo'llab-quvvatlash",
      description: "Har qanday savol yoki muammo uchun doimiy yordam"
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Ro'yxatdan o'ting",
      description: "Xaridor yoki sotuvchi sifatida ro'yxatdan o'ting",
      icon: Users
    },
    {
      step: "02", 
      title: "Ko'chatlarni toping",
      description: "Minglab ko'chatlar orasidan o'zingizga mosini tanlang",
      icon: Leaf
    },
    {
      step: "03",
      title: "Sotuvchi bilan bog'laning", 
      description: "To'g'ridan-to'g'ri sotuvchi bilan aloqa qiling",
      icon: MessageSquare
    },
    {
      step: "04",
      title: "Xarid qiling",
      description: "Oson va xavfsiz tarzda xarid amalga oshiring",
      icon: CheckCircle
    }
  ];

  const stats = [
    { number: "1000+", label: "Faol Ko'chatlar" },
    { number: "200+", label: "Ishonchli Sotuvchilar" },
    { number: "5000+", label: "Mamnun Xaridorlar" },
    { number: "98%", label: "Muvaffaqiyat Darajasi" }
  ];

  const testimonials = [
    {
      name: "Ahmadjon Karimov",
      role: "Bog'bon",
      content: "Bu platforma orqali eng sifatli ko'chatlarni topib oldim. Sotuvchilar juda professional va ishonchli.",
      rating: 5
    },
    {
      name: "Fotima Usmonova", 
      role: "Fermer",
      content: "Ko'chatlar bozori men uchun eng yaxshi tanlov bo'ldi. Oson, qulay va ishonchli.",
      rating: 5
    },
    {
      name: "Oybek Tursunov",
      role: "Sotuvchi",
      content: "O'z mahsulotlarimni osongina sotishga imkon berdi. Admin tizimi juda yaxshi ishlaydi.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-sage via-accent to-background overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-forest/20 via-forest/10 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <Badge className="bg-forest/10 text-forest border-forest/20 px-4 py-2">
              O'zbekistonning Eng Yirik Ko'chatlar Bozori
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              Daraxt Ko'chatlari
              <span className="block text-forest bg-gradient-to-r from-forest to-moss bg-clip-text text-transparent">
                Bozori
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Minglab sifatli ko'chatlar, yuzlab ishonchli sotuvchilar. 
              Tabiatni o'zingiz bilan birga o'stirishni boshlang.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Link to="/buyer-dashboard" className="flex-1">
                <Button size="lg" className="w-full bg-gradient-to-r from-forest to-moss hover:from-primary-hover hover:to-forest shadow-nature transition-all duration-300 transform hover:scale-105">
                  Ko'chatlar Ko'rish
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth" className="flex-1">
                <Button size="lg" variant="outline" className="w-full border-forest/20 text-forest hover:bg-forest hover:text-primary-foreground">
                  Sotuvchi Bo'lish
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-forest">{stat.number}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-forest mb-4">
              Nima Uchun Bizni Tanlaysiz?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ko'chatlar bozori - bu ishonchli, xavfsiz va qulay ko'chatlar savdo platformasi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover:shadow-nature transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-forest to-moss rounded-full flex items-center justify-center mb-4 shadow-card">
                    <feature.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-forest mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-sage via-accent to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-forest mb-4">
              Qanday Ishlaydi?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              4 ta oddiy qadam bilan ko'chatlar sotib oling yoki soting
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-forest to-moss rounded-full flex items-center justify-center shadow-nature">
                    <step.icon className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-earth">{step.step}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-forest mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-forest mb-4">
              Mijozlar Fikri
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Bizning xizmatimizdan foydalanganlar nima deyishadi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-forest">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-forest to-moss text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bugun Boshlaymizmi?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Ko'chatlar bozorida o'z o'rningizni toping. Xaridor bo'ling yoki sotuvchi sifatida ro'yxatdan o'ting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link to="/auth" className="flex-1">
              <Button size="lg" variant="secondary" className="w-full bg-primary-foreground text-forest hover:bg-primary-foreground/90">
                Hozir Ro'yxatdan O'tish
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/buyer-dashboard" className="flex-1">
              <Button size="lg" variant="outline" className="w-full border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-forest">
                Ko'chatlarni Ko'rish
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;