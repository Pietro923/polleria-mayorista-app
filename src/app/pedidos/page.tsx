"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from "@/lib/firebaseConfig"; // Importar la configuración de Firebase
import { collection, getDocs, getDoc, doc, setDoc, updateDoc, increment } from "firebase/firestore";

export default function NewOrderForm() {
  const [cliente, setCliente] = useState("");
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [clientes, setClientes] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);

  // Obtener clientes desde la base de datos
  useEffect(() => {
    const obtenerClientes = async () => {
      const querySnapshot = await getDocs(collection(db, "Clientes"));
      const clientesObtenidos: any[] = [];
      querySnapshot.forEach((doc) => {
        clientesObtenidos.push(doc.data());
      });
      setClientes(clientesObtenidos);
    };

    obtenerClientes();
  }, []);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        // Obtiene los documentos de la colección "Productos"
        const querySnapshot = await getDocs(collection(db, "Productos"));
        
        // Extrae los datos de los documentos y agrega el ID para cada producto
        const productosObtenidos = querySnapshot.docs.map((doc) => ({
          id: doc.id,  // Incluye el ID del documento
          ...doc.data()  // Obtiene los datos del documento
        }));
  
        // Actualiza el estado con los productos obtenidos
        setProductos(productosObtenidos);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };
  
    obtenerProductos();
  }, []);

  // Función para obtener y actualizar el LastId en la colección pedidosCounters
  const obtenerNuevoId = async () => {
    const docRef = doc(db, "counters", "pedidosCounters");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const lastId = docSnap.data().LastId;

      // Actualizar el LastId para el siguiente uso
      await updateDoc(docRef, {
        LastId: increment(1),
      });

      return lastId + 1; // Devuelve el nuevo ID incrementado
    } else {
      throw new Error("El documento PedidosCounters no existe.");
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const nuevoId = await obtenerNuevoId(); // Obtener el ID autoincremental

      const nuevoPedido = {
        id: nuevoId,
        cliente: cliente,
        producto: producto,
        cantidad: cantidad,
        fechaEntrega: fechaEntrega,
      };

      // Guardar el pedido en la colección Pedidos
      await setDoc(doc(db, "Pedidos", nuevoId.toString()), nuevoPedido);

      console.log("Pedido registrado:", nuevoPedido);
      
      // Resetear los campos del formulario
      setCliente("");
      setProducto("");
      setCantidad(1);
      setFechaEntrega("");
    } catch (error) {
      console.error("Error al registrar el pedido:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Registrar Pedido</h1>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Nuevo Pedido</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="cliente">Cliente:</Label>
              <Select
                onValueChange={(value) => setCliente(value)}
                value={cliente}
                required
              >
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
                onValueChange={(value) => setProducto(value)}
                value={producto}
                required
              >
                <SelectTrigger id="producto">
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent>
                  {productos.map((producto, index) => (
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
                min="1"
                required
              />
            </div>

            <div>
              <Label htmlFor="fechaEntrega">Fecha de Entrega:</Label>
              <Input
                id="fechaEntrega"
                type="date"
                value={fechaEntrega}
                onChange={(e) => setFechaEntrega(e.target.value)}
                required
              />
            </div>

            <Button type="submit">Registrar Pedido</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
