"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseConfig"; // Asegúrate de que la configuración de Firebase esté exportada desde este archivo
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function InventarioPage() {
  const [inventario, setInventario] = useState<{ id: string; producto: string; cantidad: string; }[]>([]);
  const [producto, setProducto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [ID, setID] = useState('');

  // Función para obtener los datos de la base de datos
  useEffect(() => {
    const obtenerInventario = async () => {
      const querySnapshot = await getDocs(collection(db, "Inventario"));
      const inventarioObtenido = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as { id: string; producto: string; cantidad: string; }[];
      setInventario(inventarioObtenido);
    };

    obtenerInventario();
  }, []);

  // Función para agregar un nuevo producto a la base de datos con un ID manual
  const agregarInventario = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!ID) {
        alert("Por favor, ingrese un ID válido.");
        return;
      }
      const nuevoItem = { producto, cantidad };
      await setDoc(doc(db, "Inventario", ID), nuevoItem);
      setInventario([...inventario, { id: ID, ...nuevoItem }]); // Actualiza el estado local
      setID('');
      setProducto('');
      setCantidad('');
    } catch (error) {
      console.error("Error al agregar al inventario: ", error);
    }
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
              <Label htmlFor="ID">ID para reconocerlo:</Label>
              <Input
                id="ID"
                type="text"
                value={ID}
                onChange={(e) => setID(e.target.value)}
                required
                placeholder="Ingrese el ID"
              />
            </div>
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
                  <span>ID: {item.id} - {item.producto}</span>
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
