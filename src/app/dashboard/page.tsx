"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig"; // O la ruta de tu archivo de configuración
import { collection, query, getDocs } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Asume que tienes estos componentes
import { Users, Calendar, DollarSign, Package } from "lucide-react";

// Funciones para obtener los datos de Firebase
const getTotalVentas = async () => {
  const ventasRef = collection(db, "Ventas");
  const q = query(ventasRef);
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.reduce((total, doc) => total + doc.data().total, 0);
};

const getCantidadProductosRegistrados = async () => {
  const productosRef = collection(db, "Productos");
  const q = query(productosRef);
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.size; // Total de productos registrados
};

const getClientesAtendidos = async () => {
  const clientesRef = collection(db, "Clientes");
  const q = query(clientesRef);
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.size; // Total de clientes atendidos
};

const getPedidosRealizados = async () => {
  const pedidosRef = collection(db, "Pedidos");
  const q = query(pedidosRef);
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.size; // Total de pedidos realizados
};

export default function Dashboard() {
  const [totalVentas, setTotalVentas] = useState(0);
  const [cantidadProductos, setCantidadProductos] = useState(0);
  const [clientesAtendidos, setClientesAtendidos] = useState(0);
  const [pedidosRealizados, setPedidosRealizados] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setTotalVentas(await getTotalVentas());
        setCantidadProductos(await getCantidadProductosRegistrados());
        setClientesAtendidos(await getClientesAtendidos());
        setPedidosRealizados(await getPedidosRealizados());
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {loading ? (
        <div className="text-center">Cargando...</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {/* Card Total Ventas */}
          <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl rounded-lg transform transition-transform duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Ventas</CardTitle>
              <DollarSign className="h-6 w-6 text-white" />
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-white">${totalVentas}</div>
            </CardContent>
          </Card>

          {/* Card Productos Registrados */}
          <Card className="bg-gradient-to-r from-green-500 to-teal-500 shadow-xl rounded-lg transform transition-transform duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Productos Registrados</CardTitle>
              <Package className="h-6 w-6 text-white" />
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-white">{cantidadProductos}</div>
            </CardContent>
          </Card>

          {/* Card Clientes Atendidos */}
          <Card className="bg-gradient-to-r from-blue-500 to-sky-500 shadow-xl rounded-lg transform transition-transform duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Clientes Atendidos</CardTitle>
              <Users className="h-6 w-6 text-white" />
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-white">{clientesAtendidos}</div>
            </CardContent>
          </Card>

          {/* Card Pedidos Realizados */}
          <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 shadow-xl rounded-lg transform transition-transform duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Pedidos Realizados</CardTitle>
              <Calendar className="h-6 w-6 text-white" />
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-white">{pedidosRealizados}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
