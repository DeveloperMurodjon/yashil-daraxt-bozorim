import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MessageSquare, 
  Package, 
  TrendingUp,
  Users,
  ArrowLeft,
  Upload,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddProduct, setShowAddProduct] = useState(false);

  // Mock data
  const stats = {
    totalProducts: 45,
    totalOrders: 128,
    pendingOrders: 7,
    totalRevenue: "12,450,000"
  };

  const products = [
    {
      id: 1,
      name: "Olma daraxti ko'chati",
      category: "Mevali daraxtlar",
      price: 45000,
      stock: 25,
      status: "active",
      orders: 15,
      image: "/placeholder-tree.jpg"
    },
    {
      id: 2,
      name: "Qarag'ay ko'chati",
      category: "Ignabargli daraxtlar",
      price: 35000,
      stock: 40,
      status: "active",
      orders: 8,
      image: "/placeholder-tree.jpg"
    },
    {
      id: 3,
      name: "Tut daraxti ko'chati",
      category: "Bargli daraxtlar",
      price: 25000,
      stock: 0,
      status: "out_of_stock",
      orders: 12,
      image: "/placeholder-tree.jpg"
    }
  ];

  const orders = [
    {
      id: 1,
      product: "Olma daraxti ko'chati",
      buyer: "Ahmadjon Karimov",
      quantity: 3,
      total: 135000,
      date: "2024-01-15",
      status: "pending",
      phone: "+998 90 123 45 67"
    },
    {
      id: 2,
      product: "Qarag'ay ko'chati",
      buyer: "Fotima Usmonova",
      quantity: 2,
      total: 70000,
      date: "2024-01-14",
      status: "completed",
      phone: "+998 91 234 56 78"
    }
  ];

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
              <h1 className="text-2xl font-bold text-forest">Sotuvchi Paneli</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground">Salom, Oybek Tursunov</span>
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
            <TabsTrigger value="dashboard">Bosh sahifa</TabsTrigger>
            <TabsTrigger value="products">Mahsulotlar</TabsTrigger>
            <TabsTrigger value="orders">Buyurtmalar</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Jami Mahsulotlar</p>
                      <p className="text-2xl font-bold text-forest">{stats.totalProducts}</p>
                    </div>
                    <Package className="w-8 h-8 text-forest" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Jami Buyurtmalar</p>
                      <p className="text-2xl font-bold text-forest">{stats.totalOrders}</p>
                    </div>
                    <Users className="w-8 h-8 text-forest" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Kutilayotgan</p>
                      <p className="text-2xl font-bold text-gold">{stats.pendingOrders}</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-gold" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Jami Daromad</p>
                      <p className="text-2xl font-bold text-forest">{stats.totalRevenue} so'm</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-forest" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-forest">So'nggi Buyurtmalar</CardTitle>
                <CardDescription>Yangi kelgan buyurtmalar ro'yxati</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-sage/30 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{order.product}</p>
                        <p className="text-sm text-muted-foreground">{order.buyer} • {order.quantity} dona</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-forest">{order.total.toLocaleString()} so'm</p>
                        <Badge variant={order.status === "pending" ? "secondary" : "default"}>
                          {order.status === "pending" ? "Kutilmoqda" : "Bajarildi"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-forest">Mahsulotlar</h2>
              <Button 
                onClick={() => setShowAddProduct(true)}
                className="bg-gradient-to-r from-forest to-moss hover:from-primary-hover hover:to-forest"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yangi Mahsulot
              </Button>
            </div>

            {showAddProduct && (
              <Card className="shadow-nature">
                <CardHeader>
                  <CardTitle className="text-forest">Yangi Mahsulot Qo'shish</CardTitle>
                  <CardDescription>Mahsulot ma'lumotlarini to'ldiring</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-name">Mahsulot nomi</Label>
                      <Input id="product-name" placeholder="Masalan: Olma daraxti ko'chati" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-category">Kategoriya</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Kategoriyani tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fruit-trees">Mevali daraxtlar</SelectItem>
                          <SelectItem value="deciduous-trees">Bargli daraxtlar</SelectItem>
                          <SelectItem value="evergreen-trees">Ignabargli daraxtlar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-price">Narxi (so'm)</Label>
                      <Input id="product-price" type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-stock">Miqdori</Label>
                      <Input id="product-stock" type="number" placeholder="0" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-description">Tavsifi</Label>
                    <Textarea 
                      id="product-description" 
                      placeholder="Mahsulot haqida batafsil ma'lumot..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Rasm yuklash</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Rasm yuklash uchun bosing yoki sudrab tashlang</p>
                      <Button variant="outline" className="mt-2">
                        Fayl tanlash
                      </Button>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button className="bg-gradient-to-r from-forest to-moss hover:from-primary-hover hover:to-forest">
                      Saqlash
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddProduct(false)}>
                      Bekor qilish
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Products List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-sage/30 rounded-lg mb-4 flex items-center justify-center">
                      <Package className="w-12 h-12 text-muted-foreground" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium text-forest">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-forest">{product.price.toLocaleString()} so'm</span>
                        <Badge variant={product.status === "active" ? "default" : "secondary"}>
                          {product.status === "active" ? "Faol" : "Tugagan"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Omborda: {product.stock} dona • {product.orders} buyurtma
                      </p>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Tahrirlash
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        Ko'rish
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-bold text-forest">Buyurtmalar</h2>

            <Card className="shadow-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-sage/30">
                      <tr>
                        <th className="text-left p-4 font-medium">Buyurtma</th>
                        <th className="text-left p-4 font-medium">Xaridor</th>
                        <th className="text-left p-4 font-medium">Miqdor</th>
                        <th className="text-left p-4 font-medium">Summa</th>
                        <th className="text-left p-4 font-medium">Sana</th>
                        <th className="text-left p-4 font-medium">Holat</th>
                        <th className="text-left p-4 font-medium">Amallar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{order.product}</p>
                              <p className="text-sm text-muted-foreground">#{order.id}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{order.buyer}</p>
                              <p className="text-sm text-muted-foreground">{order.phone}</p>
                            </div>
                          </td>
                          <td className="p-4">{order.quantity} dona</td>
                          <td className="p-4 font-bold text-forest">{order.total.toLocaleString()} so'm</td>
                          <td className="p-4">{order.date}</td>
                          <td className="p-4">
                            <Badge variant={order.status === "pending" ? "secondary" : "default"}>
                              {order.status === "pending" ? "Kutilmoqda" : "Bajarildi"}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
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
                    <Input id="profile-first-name" defaultValue="Oybek" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-last-name">Familiya</Label>
                    <Input id="profile-last-name" defaultValue="Tursunov" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile-email">Email</Label>
                    <Input id="profile-email" type="email" defaultValue="oybek@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-phone">Telefon</Label>
                    <Input id="profile-phone" defaultValue="+998 90 123 45 67" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-business">Biznes nomi</Label>
                  <Input id="profile-business" defaultValue="Tursunov Ko'chatlar Pitomniki" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-address">Manzil</Label>
                  <Textarea id="profile-address" defaultValue="Toshkent viloyati, Chirchiq shahar, Navbahor ko'chasi 15-uy" />
                </div>

                <Button className="bg-gradient-to-r from-forest to-moss hover:from-primary-hover hover:to-forest">
                  Ma'lumotlarni Saqlash
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SellerDashboard;