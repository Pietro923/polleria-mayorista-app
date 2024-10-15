"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"; // Asegúrate de ajustar la importación según tu estructura

export default function InventarioPage() {
  const [inventario, setInventario] = useState<{ producto: string; cantidad: string; }[]>([]);
  const [producto, setProducto] = useState('');
  const [cantidad, setCantidad] = useState('');

  const agregarInventario = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevoItem = { producto, cantidad };
    setInventario([...inventario, nuevoItem]);
    setProducto('');
    setCantidad('');
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Agregar al Inventario</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={agregarInventario} className="space-y-4">
            <div>
              <Label htmlFor="producto">Producto:</Label>
              <Input
                id="producto"
                type="text"
                value={producto}
                onChange={(e) => setProducto(e.target.value)}
                required
                placeholder="Ingrese el nombre del producto"
              />
            </div>
            <div>
              <Label htmlFor="cantidad">Cantidad en stock:</Label>
              <Input
                id="cantidad"
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                required
                placeholder="Ingrese la cantidad"
                min="1"
              />
            </div>
            <Button type="submit">Agregar al Inventario</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Inventario</CardTitle>
        </CardHeader>
        <CardContent>
          {inventario.length === 0 ? (
            <p className="text-center text-gray-500">No hay productos en el inventario</p>
          ) : (
            <ul className="space-y-2">
              {inventario.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-2 border rounded-md shadow-sm bg-white"
                >
                  <span>{item.producto}</span>
                  <span>{item.cantidad} unidades</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
