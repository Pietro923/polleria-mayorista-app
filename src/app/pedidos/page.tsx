"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NewOrderForm() {
  const [cliente, setCliente] = useState("");
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [fechaEntrega, setFechaEntrega] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para manejar el pedido
    console.log({ cliente, producto, cantidad, fechaEntrega });
    setCliente("");
    setProducto("");
    setCantidad(1);
    setFechaEntrega("");
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
              <Input
                id="cliente"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                placeholder="Nombre del cliente"
                required
              />
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
                  <SelectItem value="pollo entero">Pollo entero</SelectItem>
                  <SelectItem value="alas de pollo">Alas de pollo</SelectItem>
                  <SelectItem value="pechugas de pollo">Pechugas de pollo</SelectItem>
                  <SelectItem value="piernas de pollo">Piernas de pollo</SelectItem>
                  {/* Más opciones de productos */}
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
