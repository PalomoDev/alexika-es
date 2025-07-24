import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
    Users,
    Package,
    ShoppingCart,
    TrendingUp,
    TrendingDown,
    Eye,
    Plus,
    ArrowRight,
    Calendar,
    Star,
    AlertTriangle
} from "lucide-react";

// Моковые данные
const stats = [
    {
        title: "Total Usuarios",
        value: "2,543",
        change: "+12.5%",
        trend: "up",
        icon: Users,
        color: "text-blue-600",
        bgColor: "bg-blue-100"
    },
    {
        title: "Total Productos",
        value: "1,247",
        change: "+8.2%",
        trend: "up",
        icon: Package,
        color: "text-green-600",
        bgColor: "bg-green-100"
    },
    {
        title: "Pedidos Hoy",
        value: "89",
        change: "-3.1%",
        trend: "down",
        icon: ShoppingCart,
        color: "text-orange-600",
        bgColor: "bg-orange-100"
    },
    {
        title: "Ingresos del Mes",
        value: "€24,580",
        change: "+15.3%",
        trend: "up",
        icon: TrendingUp,
        color: "text-purple-600",
        bgColor: "bg-purple-100"
    }
];

const recentOrders = [
    { id: "#3301", customer: "Ana García", amount: "€127.50", status: "completed", time: "Hace 5 min" },
    { id: "#3302", customer: "Carlos López", amount: "€89.90", status: "processing", time: "Hace 12 min" },
    { id: "#3303", customer: "María Rodríguez", amount: "€245.00", status: "completed", time: "Hace 1h" },
    { id: "#3304", customer: "José Martín", amount: "€67.25", status: "pending", time: "Hace 2h" }
];

const topProducts = [
    { name: "Tienda 4 Estaciones", category: "Tiendas", sales: 156, revenue: "€12,450", progress: 85 },
    { name: "Saco Dormir Pro", category: "Sacos", sales: 143, revenue: "€8,950", progress: 78 },
    { name: "Mochila Trekking 65L", category: "Mochilas", sales: 128, revenue: "€15,680", progress: 70 },
    { name: "Chaqueta Impermeable", category: "Ropa", sales: 98, revenue: "€6,850", progress: 55 }
];

const quickActions = [
    { title: "Nuevo Producto", icon: Package, href: "/admin/products/create" },
    { title: "Nueva Marca", icon: Plus, href: "/admin/catalog/create/marca" },
    { title: "Ver Pedidos", icon: ShoppingCart, href: "/admin/orders" },
    { title: "Gestionar Usuarios", icon: Users, href: "/admin/users" }
];

const getStatusColor = (status: string) => {
    switch (status) {
        case 'completed': return 'bg-green-100 text-green-800';
        case 'processing': return 'bg-blue-100 text-blue-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case 'completed': return 'Completado';
        case 'processing': return 'Procesando';
        case 'pending': return 'Pendiente';
        default: return status;
    }
};

const AdminDashboard = () => {
    return (
        <div className="wrapper">
            <div className="py-6 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600 mt-1">
                            Resumen de tu tienda de equipamiento outdoor
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        Última actualización: Hoy, 14:30
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <Card key={index} className="relative overflow-hidden">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        {stat.title}
                                    </CardTitle>
                                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </span>
                                    <span className={`text-sm font-medium flex items-center gap-1 ${
                                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                    {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        {stat.change}
                  </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Orders */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Pedidos Recientes</CardTitle>
                                    <Button variant="ghost" size="sm">
                                        Ver todos
                                        <ArrowRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {recentOrders.map((order, index) => (
                                        <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-medium text-gray-900">{order.id}</span>
                                                        <Badge className={getStatusColor(order.status)}>
                                                            {getStatusText(order.status)}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">{order.customer}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-900">{order.amount}</p>
                                                    <p className="text-xs text-gray-500">{order.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Acciones Rápidas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {quickActions.map((action, index) => (
                                    <Button
                                        key={index}
                                        variant="ghost"
                                        className="w-full justify-start h-auto p-4"
                                        asChild
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                <action.icon className="w-4 h-4 text-gray-600" />
                                            </div>
                                            <span className="text-sm font-medium">{action.title}</span>
                                        </div>
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Top Products */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500" />
                            Productos Más Vendidos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {topProducts.map((product, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium text-gray-900">{product.name}</h4>
                                            <p className="text-sm text-gray-500">{product.category} • {product.sales} ventas</p>
                                        </div>
                                        <span className="font-semibold text-green-600">{product.revenue}</span>
                                    </div>
                                    <Progress value={product.progress} className="h-2" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Alerts */}
                <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-orange-900">Atención requerida</h4>
                                <p className="text-sm text-orange-700 mt-1">
                                    Hay 3 productos con stock bajo y 2 pedidos pendientes de revisión.
                                </p>
                                <div className="flex gap-2 mt-2">
                                    <Button size="sm" variant="outline" className="h-7 text-xs">
                                        Ver stock bajo
                                    </Button>
                                    <Button size="sm" variant="outline" className="h-7 text-xs">
                                        Revisar pedidos
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;