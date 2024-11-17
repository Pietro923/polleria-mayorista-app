"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseConfig"; // Asegúrate de que la configuración de Firebase esté exportada desde este archivo
import { collection, getDocs, addDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Venta {
  cliente: string;
  producto: string;
  cantidad: number;
  vendedor: string;
  fecha: string;
  precio: number;
  total: number;
}

interface Cliente {
  nombreCliente: string;
}

interface Vendedor {
  Nombre: string;
}

interface Producto {
  nombre: string;
  precio: number;
}

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [cliente, setCliente] = useState<string>("");
  const [producto, setProducto] = useState<string>("");
  const [cantidad, setCantidad] = useState<number>(0);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productosDisponibles, setProductosDisponibles] = useState<Producto[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [vendedor, setVendedor] = useState<string>("");
  const [fecha, setFecha] = useState<string>(new Date().toLocaleDateString());
  const [precioProducto, setPrecioProducto] = useState<number>(0);

  // Obtener ventas desde la base de datos
  useEffect(() => {
    const obtenerVentas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Ventas"));
        const ventasObtenidas: Venta[] = querySnapshot.docs.map((doc) => doc.data() as Venta);
        setVentas(ventasObtenidas);
      } catch (error) {
        console.error("Error al obtener las ventas: ", error);
      }
    };

    obtenerVentas();
  }, []); // Solo se ejecuta una vez al cargar el componente

  // Obtener clientes desde la base de datos
  useEffect(() => {
    const obtenerClientes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Clientes"));
        const clientesObtenidos: Cliente[] = querySnapshot.docs.map((doc) => doc.data() as Cliente);
        setClientes(clientesObtenidos);
      } catch (error) {
        console.error("Error al obtener los clientes: ", error);
      }
    };

    obtenerClientes();
  }, []);

  // Obtener productos y precios de la base de datos
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Productos"));
        const productos: Producto[] = querySnapshot.docs.map((doc) => ({
          nombre: doc.data().nombre,
          precio: doc.data().precio,
        }));
        setProductosDisponibles(productos);
      } catch (error) {
        console.error("Error al obtener los productos: ", error);
      }
    };

    obtenerProductos();
  }, []);

  // Obtener vendedores desde la base de datos
  useEffect(() => {
    const obtenerVendedores = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Vendedores"));
        const vendedoresObtenidos: Vendedor[] = querySnapshot.docs.map((doc) => doc.data() as Vendedor);
        setVendedores(vendedoresObtenidos);
      } catch (error) {
        console.error("Error al obtener los vendedores: ", error);
      }
    };

    obtenerVendedores();
  }, []);

  // Actualizar el precio del producto al seleccionar uno
  const actualizarPrecioProducto = (productoSeleccionado: string) => {
    const productoEncontrado = productosDisponibles.find(
      (producto) => producto.nombre === productoSeleccionado
    );
    if (productoEncontrado) {
      setPrecioProducto(productoEncontrado.precio);
    }
  };

  const registrarVenta = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const totalVenta = precioProducto * cantidad;
      const nuevaVenta: Venta = {
        cliente,
        producto,
        cantidad,
        vendedor,
        fecha,
        precio: precioProducto,
        total: totalVenta,
      };
      await addDoc(collection(db, "Ventas"), nuevaVenta);
      setVentas([...ventas, nuevaVenta]); // Actualizar la tabla de ventas en el cliente
      setCliente("");
      setProducto("");
      setCantidad(0);
      setVendedor("");
      setPrecioProducto(0);
    } catch (error) {
      console.error("Error al registrar la venta: ", error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Registrar Venta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={registrarVenta} className="space-y-4">
            <div>
              <Label htmlFor="cliente">Cliente:</Label>
              <Select onValueChange={(value) => setCliente(value)} value={cliente} required>
                <SelectTrigger id="cliente">
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente, index) => (
                    <SelectItem key={index} value={cliente.nombreCliente}>
                      {cliente.nombreCliente}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="producto">Producto:</Label>
              <Select
                onValueChange={(value) => {
                  setProducto(value);
                  actualizarPrecioProducto(value);
                }}
                value={producto}
                required
              >
                <SelectTrigger id="producto">
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent>
                  {productosDisponibles.map((producto, index) => (
                    <SelectItem key={index} value={producto.nombre}>
                      {producto.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cantidad">Cantidad:</Label>
              <Input
                id="cantidad"
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                required
                min={1}
              />
            </div>
            <div>
              <Label htmlFor="vendedor">Vendedor:</Label>
              <Select onValueChange={(value) => setVendedor(value)} value={vendedor} required>
                <SelectTrigger id="vendedor">
                  <SelectValue placeholder="Seleccionar vendedor" />
                </SelectTrigger>
                <SelectContent>
                  {vendedores.map((vendedor, index) => (
                    <SelectItem key={index} value={vendedor.Nombre}>
                      {vendedor.Nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Registrar Venta</Button>
          </form>
        </CardContent>
      </Card>

      {/* Tabla de Ventas con shadcn/ui Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registro de Ventas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ventas.map((venta, index) => (
                <TableRow key={index}>
                  <TableCell>{venta.cliente}</TableCell>
                  <TableCell>{venta.producto}</TableCell>
                  <TableCell>{venta.cantidad}</TableCell>
                  <TableCell>{venta.vendedor}</TableCell>
                  <TableCell>{venta.fecha}</TableCell>
                  <TableCell>{venta.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>Total Ventas: {ventas.length}</TableCaption>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
