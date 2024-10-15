"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

// Definimos un tipo para la venta
interface Venta {
  cliente: string;
  producto: string;
  cantidad: number; // Cambiamos a número para manejar cantidades
}

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([]); // Definimos el tipo del estado
  const [cliente, setCliente] = useState<string>(""); // Definimos el tipo del estado
  const [producto, setProducto] = useState<string>(""); // Definimos el tipo del estado
  const [cantidad, setCantidad] = useState<number>(0); // Definimos el tipo del estado

  // Lista de clientes registrados
  const clientesRegistrados = ["Cliente A", "Cliente B", "Cliente C"];

  // Lista de productos disponibles
  const productosDisponibles = ["Pollo entero", "Alas de pollo", "Pechugas de pollo"];

  const registrarVenta = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nuevaVenta: Venta = { cliente, producto, cantidad }; // Usamos el tipo Venta
    setVentas([...ventas, nuevaVenta]);
    setCliente("");
    setProducto("");
    setCantidad(0); // Reseteamos a 0
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
              <Label htmlFor="cliente">Cliente (opcional):</Label>
              <Select
                onValueChange={(value) => setCliente(value)}
                value={cliente}
              >
                <SelectTrigger id="cliente">
                  <SelectValue placeholder="Seleccione un cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sin_cliente">No asignar cliente</SelectItem>
                  {clientesRegistrados.map((cliente, index) => (
                    <SelectItem key={index} value={cliente}>
                      {cliente}
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
                  <SelectValue placeholder="Seleccione un producto" />
                </SelectTrigger>
                <SelectContent>
                  {productosDisponibles.map((producto, index) => (
                    <SelectItem key={index} value={producto}>
                      {producto}
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
                value={cantidad > 0 ? cantidad : ''} // Aseguramos que el valor sea una cadena vacía si es cero
                onChange={(e) => setCantidad(Number(e.target.value))} // Convertimos el valor a número
                required
                placeholder="Ingrese la cantidad"
                min="1"
              />
            </div>

            <Button type="submit">Registrar Venta</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ventas Realizadas</CardTitle>
        </CardHeader>
        <CardContent>
          {ventas.length === 0 ? (
            <p className="text-center text-gray-500">No hay ventas registradas</p>
          ) : (
            <ul className="space-y-2">
              {ventas.map((venta, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-2 border rounded-md shadow-sm bg-white"
                >
                  <span>
                    {venta.cliente !== "sin_cliente" ? `${venta.cliente} - ` : ""}
                    {venta.producto} - {venta.cantidad} unidades
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
