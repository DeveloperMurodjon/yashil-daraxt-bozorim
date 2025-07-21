import { Button } from "@/components/ui/button";
import { Leaf, Phone, Mail, MapPin, Facebook, Instagram, Send } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-sage/30 to-forest text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary-foreground/20 rounded-xl">
                <Leaf className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Ko'chatlar Bozori</h3>
                <p className="text-sm opacity-80">Tabiat bilan birga</p>
              </div>
            </div>
            <p className="text-sm opacity-90 leading-relaxed">
              Sifatli daraxt ko'chatlari va bog'dorchilik mahsulotlari bilan tabiatni go'zallashtiring. 
              Biz sizga eng yaxshi xizmatni taklif qilamiz.
            </p>
            <div className="flex space-x-3">
              <Button size="icon" variant="ghost" className="hover:bg-primary-foreground/20">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-primary-foreground/20">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-primary-foreground/20">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Tezkor Havolalar</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm opacity-90 hover:opacity-100 hover:underline transition-all">Kategoriyalar</a></li>
              <li><a href="#" className="text-sm opacity-90 hover:opacity-100 hover:underline transition-all">Mashhur Ko'chatlar</a></li>
              <li><a href="#" className="text-sm opacity-90 hover:opacity-100 hover:underline transition-all">Yangi Mahsulotlar</a></li>
              <li><a href="#" className="text-sm opacity-90 hover:opacity-100 hover:underline transition-all">Chegirmalar</a></li>
              <li><a href="#" className="text-sm opacity-90 hover:opacity-100 hover:underline transition-all">Bog'dorchilik Maslahatlari</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Mijozlar Xizmati</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm opacity-90 hover:opacity-100 hover:underline transition-all">Yetkazib Berish</a></li>
              <li><a href="#" className="text-sm opacity-90 hover:opacity-100 hover:underline transition-all">Qaytarish Siyosati</a></li>
              <li><a href="#" className="text-sm opacity-90 hover:opacity-100 hover:underline transition-all">Savol-Javoblar</a></li>
              <li><a href="#" className="text-sm opacity-90 hover:opacity-100 hover:underline transition-all">Bog'lanish</a></li>
              <li><a href="#" className="text-sm opacity-90 hover:opacity-100 hover:underline transition-all">Yordam</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Aloqa Ma'lumotlari</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 opacity-80" />
                <span className="text-sm opacity-90">+998 (90) 123-45-67</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 opacity-80" />
                <span className="text-sm opacity-90">info@kochatlar.uz</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 opacity-80 mt-0.5" />
                <span className="text-sm opacity-90">Toshkent shahri, Chilonzor tumani, Bog'ishamol ko'chasi 123-uy</span>
              </div>
            </div>
            <div className="p-4 bg-primary-foreground/10 rounded-xl">
              <p className="text-sm font-medium mb-2">Ish vaqti:</p>
              <p className="text-sm opacity-90">Dushanba - Yakshanba: 9:00 - 18:00</p>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h4 className="text-xl font-semibold">Yangiliklar va Maslahatlar</h4>
            <p className="text-sm opacity-90">
              Yangi ko'chatlar, chegirmalar va bog'dorchilik maslahatlari haqida birinchilardan bo'lib bilib oling
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Email manzilingizni kiriting..."
                className="flex-1 px-4 py-2 rounded-lg bg-primary-foreground/20 border border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
              />
              <Button className="bg-primary-foreground text-forest hover:bg-primary-foreground/90 transition-all duration-300">
                Obuna Bo'lish
              </Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center">
          <p className="text-sm opacity-80">
            © 2024 Ko'chatlar Bozori. Barcha huquqlar himoyalangan. | 
            <a href="#" className="hover:underline ml-1">Maxfiylik Siyosati</a> | 
            <a href="#" className="hover:underline ml-1">Foydalanish Shartlari</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;