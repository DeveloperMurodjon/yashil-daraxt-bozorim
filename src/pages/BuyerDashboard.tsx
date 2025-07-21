import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Heart, 
  ShoppingCart, 
  Star, 
  MessageSquare, 
  Phone,
  MapPin,
  Package,
  Clock,
  ArrowLeft,
  Eye
} from "lucide-react";
import { Link } from "react-router-dom";

const BuyerDashboard = () => {
  const [activeTab, setActiveTab] = useState("browse");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);

  // Mock data
  const products = [
    {
      id: 1,
      name: "Olma daraxti ko'chati",
      seller: "Tursunov Ko'chatlar Pitomniki",
      sellerPhone: "+998 90 123 45 67",
      sellerLocation: "Toshkent viloyati",
      price: 45000,
      category: "Mevali daraxtlar",
      rating: 4.8,
      reviews: 24,
      inStock: true,
      stock: 25,
      description: "Yuqori navli olma daraxti ko'chati. 2 yillik, sog'lom va kuchli ko'chatlar.",
      image: "/placeholder-tree.jpg"
    },
    {
      id: 2,
      name: "Qarag'ay ko'chati",
      seller: "Yashil Bog' Nursery",
      sellerPhone: "+998 91 234 56 78",
      sellerLocation: "Samarqand viloyati",
      price: 35000,
      category: "Ignabargli daraxtlar",
      rating: 4.6,
      reviews: 18,
      inStock: true,
      stock: 40,
      description: "Sovuqqa chidamli qarag'ay ko'chatlari. Tez o'sadigan nav.",
      image: "/placeholder-tree.jpg"
    },
    {
      id: 3,
      name: "Tut daraxti ko'chati",
      seller: "Oila Bog'i",
      sellerPhone: "+998 93 345 67 89",
      sellerLocation: "Farg'ona viloyati",
      price: 25000,
      category: "Bargli daraxtlar",
      rating: 4.9,
      reviews: 31,
      inStock: false,
      stock: 0,
      description: "Shirin tut daraxti ko'chatlari. Yuqori hosildor nav.",
      image: "/placeholder-tree.jpg"
    }
  ];

  const myOrders = [
    {
      id: 1,
      product: "Olma daraxti ko'chati",
      seller: "Tursunov Ko'chatlar Pitomniki",
      quantity: 3,
      total: 135000,
      date: "2024-01-15",
      status: "pending",
      orderNumber: "ORD-001"
    },
    {
      id: 2,
      product: "Qarag'ay ko'chati",
      seller: "Yashil Bog' Nursery",
      quantity: 2,
      total: 70000,
      date: "2024-01-10",
      status: "completed",
      orderNumber: "ORD-002"
    }
  ];

  const favorites = products.slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage via-accent to-background">
      {/* Header */}
      <div className="bg-card/90 backdrop-blur-sm border-b shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="inline-flex items-center text-forest hover:text-forest-light transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Asosiy sahifa
              </Link>
              <div className="h-6 w-px bg-border"></div>
              <h1 className="text-2xl font-bold text-forest">Xaridor Paneli</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground">Salom, Ahmadjon Karimov</span>
              <Button variant="outline" size="sm">
                Chiqish
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse">Ko'chatlar</TabsTrigger>
            <TabsTrigger value="orders">Buyurtmalarim</TabsTrigger>
            <TabsTrigger value="favorites">Sevimlilar</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
          </TabsList>

          {/* Browse Products Tab */}
          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filter */}
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      placeholder="Ko'chatlar qidirish..." 
                      className="pl-10"
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Kategoriya" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Barcha kategoriyalar</SelectItem>
                      <SelectItem value="fruit-trees">Mevali daraxtlar</SelectItem>
                      <SelectItem value="deciduous-trees">Bargli daraxtlar</SelectItem>
                      <SelectItem value="evergreen-trees">Ignabargli daraxtlar</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Viloyat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Barcha viloyatlar</SelectItem>
                      <SelectItem value="tashkent">Toshkent</SelectItem>
                      <SelectItem value="samarkand">Samarqand</SelectItem>
                      <SelectItem value="fergana">Farg'ona</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="shadow-card hover:shadow-nature transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-sage/30 rounded-t-lg flex items-center justify-center">
                      <Package className="w-16 h-16 text-muted-foreground" />
                    </div>
                    
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-forest">{product.name}</h3>
                        <Button size="sm" variant="ghost" className="p-1">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 fill-gold text-gold" />
                          <span className="text-sm font-medium">{product.rating}</span>
                          <span className="text-sm text-muted-foreground">({product.reviews} baho)</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{product.sellerLocation}</span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{product.seller}</p>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xl font-bold text-forest">{product.price.toLocaleString()} so'm</p>
                          <Badge variant={product.inStock ? "default" : "secondary"}>
                            {product.inStock ? `${product.stock} dona` : "Tugagan"}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="flex-1">
                              <Eye className="w-4 h-4 mr-1" />
                              Ko'rish
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-forest">{product.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="aspect-video bg-sage/30 rounded-lg flex items-center justify-center">
                                <Package className="w-24 h-24 text-muted-foreground" />
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold text-forest mb-2">Mahsulot haqida</h4>
                                    <p className="text-muted-foreground">{product.description}</p>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-semibold text-forest mb-2">Kategoriya</h4>
                                    <Badge>{product.category}</Badge>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <Star className="w-5 h-5 fill-gold text-gold" />
                                    <span className="font-medium">{product.rating}</span>
                                    <span className="text-muted-foreground">({product.reviews} baho)</span>
                                  </div>
                                </div>
                                
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold text-forest mb-2">Sotuvchi</h4>
                                    <div className="space-y-2">
                                      <p className="font-medium">{product.seller}</p>
                                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                        <MapPin className="w-4 h-4" />
                                        <span>{product.sellerLocation}</span>
                                      </div>
                                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                        <Phone className="w-4 h-4" />
                                        <span>{product.sellerPhone}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                      <span className="text-2xl font-bold text-forest">{product.price.toLocaleString()} so'm</span>
                                      <Badge variant={product.inStock ? "default" : "secondary"}>
                                        {product.inStock ? `${product.stock} dona mavjud` : "Tugagan"}
                                      </Badge>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Button 
                                        className="w-full bg-gradient-to-r from-forest to-moss hover:from-primary-hover hover:to-forest"
                                        disabled={!product.inStock}
                                        onClick={() => {
                                          setSelectedProduct(product);
                                          setShowOrderDialog(true);
                                        }}
                                      >
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        Buyurtma berish
                                      </Button>
                                      <Button variant="outline" className="w-full">
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Sotuvchi bilan bog'lanish
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          size="sm" 
                          className="flex-1 bg-gradient-to-r from-forest to-moss hover:from-primary-hover hover:to-forest"
                          disabled={!product.inStock}
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowOrderDialog(true);
                          }}
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Buyurtma
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-bold text-forest">Buyurtmalarim</h2>

            <div className="space-y-4">
              {myOrders.map((order) => (
                <Card key={order.id} className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-4">
                          <h3 className="font-semibold text-forest">{order.product}</h3>
                          <Badge variant={order.status === "pending" ? "secondary" : "default"}>
                            {order.status === "pending" ? "Kutilmoqda" : "Bajarildi"}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{order.seller}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Buyurtma: {order.orderNumber}</span>
                          <span>Sana: {order.date}</span>
                          <span>Miqdor: {order.quantity} dona</span>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-2">
                        <p className="text-xl font-bold text-forest">{order.total.toLocaleString()} so'm</p>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Xabar
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            Ko'rish
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            <h2 className="text-2xl font-bold text-forest">Sevimli Ko'chatlar</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((product) => (
                <Card key={product.id} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-sage/30 rounded-lg mb-4 flex items-center justify-center">
                      <Package className="w-12 h-12 text-muted-foreground" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium text-forest">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.seller}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-forest">{product.price.toLocaleString()} so'm</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-gold text-gold" />
                          <span className="text-sm">{product.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-forest to-moss hover:from-primary-hover hover:to-forest">
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Buyurtma
                      </Button>
                      <Button size="sm" variant="outline">
                        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <h2 className="text-2xl font-bold text-forest">Profil</h2>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-forest">Shaxsiy Ma'lumotlar</CardTitle>
                <CardDescription>O'zingiz haqingizda ma'lumotlarni yangilang</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile-first-name">Ism</Label>
                    <Input id="profile-first-name" defaultValue="Ahmadjon" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-last-name">Familiya</Label>
                    <Input id="profile-last-name" defaultValue="Karimov" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile-email">Email</Label>
                    <Input id="profile-email" type="email" defaultValue="ahmadjon@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-phone">Telefon</Label>
                    <Input id="profile-phone" defaultValue="+998 90 123 45 67" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-address">Manzil</Label>
                  <Textarea id="profile-address" defaultValue="Toshkent shahar, Chilonzor tumani" />
                </div>

                <Button className="bg-gradient-to-r from-forest to-moss hover:from-primary-hover hover:to-forest">
                  Ma'lumotlarni Saqlash
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Dialog */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-forest">Buyurtma berish</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="p-4 bg-sage/30 rounded-lg">
                <h4 className="font-medium text-forest">{selectedProduct.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedProduct.seller}</p>
                <p className="font-bold text-forest">{selectedProduct.price.toLocaleString()} so'm</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Miqdori</Label>
                  <Input id="quantity" type="number" defaultValue="1" min="1" max={selectedProduct.stock} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="note">Izoh (ixtiyoriy)</Label>
                  <Textarea id="note" placeholder="Qo'shimcha talablar yoki izohlar..." />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="delivery-address">Yetkazib berish manzili</Label>
                  <Textarea id="delivery-address" placeholder="To'liq manzil..." />
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button className="flex-1 bg-gradient-to-r from-forest to-moss hover:from-primary-hover hover:to-forest">
                  Buyurtma berish
                </Button>
                <Button variant="outline" onClick={() => setShowOrderDialog(false)}>
                  Bekor qilish
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuyerDashboard;