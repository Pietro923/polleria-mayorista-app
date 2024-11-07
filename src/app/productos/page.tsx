"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

interface Producto {
  nombreProducto: string;
  precio: string;
  cantidad: string;
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nombreProducto, setNombreProducto] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const agregarProducto = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevoProducto = { nombreProducto, precio, cantidad };

    if (editIndex !== null) {
      const productosActualizados = productos.map((producto, index) =>
        index === editIndex ? nuevoProducto : producto
      );
      setProductos(productosActualizados);
      setEditIndex(null);
    } else {
      setProductos([...productos, nuevoProducto]);
    }

    setNombreProducto('');
    setPrecio('');
    setCantidad('');
  };

  const editarProducto = (index: number) => {
    const producto = productos[index];
    setNombreProducto(producto.nombreProducto);
    setPrecio(producto.precio);
    setCantidad(producto.cantidad);
    setEditIndex(index);
  };

  const eliminarProducto = (index: number) => {
    const productosActualizados = productos.filter((_, i) => i !== index);
    setProductos(productosActualizados);
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{editIndex !== null ? "Editar Producto" : "Agregar Producto"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={agregarProducto} className="space-y-4">
            <div>
              <Label htmlFor="nombreProducto">Producto:</Label>
              <Input 
                id="nombreProducto"
                type="text"
                value={nombreProducto}
                onChange={(e) => setNombreProducto(e.target.value)}
                required 
                placeholder="Ingrese el nombre del producto"
              />
            </div>
            <div>
              <Label htmlFor="precio">Precio:</Label>
              <Input 
                id="precio"
                type="text"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                required 
                placeholder="Ingrese el precio"
              />
            </div>
            <div>
              <Label htmlFor="cantidad">Cantidad:</Label>
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
            <Button type="submit">
              {editIndex !== null ? "Actualizar Producto" : "Agregar Producto"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Productos</CardTitle>
        </CardHeader>
        <CardContent>
          {productos.length === 0 ? (
            <p className="text-center text-gray-500">No hay productos agregados</p>
          ) : (
            <ul className="space-y-2">
              {productos.map((producto, index) => (
                <li key={index} className="flex justify-between items-center p-2 border rounded-md shadow-sm">
                  <div>
                    <span className="font-semibold">{producto.nombreProducto}</span> - 
                    <span className="text-gray-600"> ${producto.precio}</span> - 
                    <span className="text-gray-600"> {producto.cantidad} unidades</span>
                  </div>
                  <div className="space-x-2">
                    <Button onClick={() => editarProducto(index)} size="sm" variant="outline">
                      Editar
                    </Button>
                    <Button onClick={() => eliminarProducto(index)} size="sm" variant="destructive">
                      Eliminar
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
