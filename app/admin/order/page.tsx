import {getAllOrders} from "@/lib/actions/orden/orden.action";
import OrdersTable from "@/components/admin/tables/orders-table";

const OrdenPage = async () => {

    const orders = await getAllOrders()
    if (!orders.success) return null;


    return (
        <div className="wrapper">
            <div className="py-6 flex flex-col gap-6">

                <h1 className="text-3xl font-bold">Gestión de productos</h1>
            <OrdersTable data={orders.data || []}/>
        </div>
        </div>
    )
}
export default OrdenPage;