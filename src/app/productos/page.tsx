"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { db } from "@/lib/firebaseConfig"; // Importa la configuración de Firebase
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, increment } from "firebase/firestore";

// Definir la interfaz Producto
interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nombreProducto, setNombreProducto] = useState("");
  const [descripcionProducto, setDescripcionProducto] = useState("");
  const [precioProducto, setPrecioProducto] = useState(0);
  const [imagenUrlProducto, setImagenUrlProducto] = useState("");
  const [productoEditado, setProductoEditado] = useState<Producto | null>(null);

  // Obtener la colección de productos desde la base de datos
  useEffect(() => {
    const obtenerProductos = async () => {
      const querySnapshot = await getDocs(collection(db, "Productos"));
      const productosObtenidos: Producto[] = [];
      querySnapshot.forEach((doc) => {
        productosObtenidos.push(doc.data() as Producto);
      });
      setProductos(productosObtenidos);
    };

    obtenerProductos();
  }, []);

  // Función para obtener y actualizar el LastId en la colección counters
  const obtenerNuevoId = async () => {
    const docRef = doc(db, "counters", "productosCounters");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const lastId = docSnap.data().LastId;

      // Actualizar el LastId para el siguiente uso
      await updateDoc(docRef, {
        LastId: increment(1),
      });

      return lastId + 1; // Devuelve el nuevo ID incrementado
    } else {
      throw new Error("El documento productosCounters no existe.");
    }
  };

  // Función para agregar un nuevo producto
  const agregarProducto = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const nuevoId = await obtenerNuevoId(); // Obtener el ID autoincremental

      const nuevoProducto: Producto = {
        id: nuevoId,
        nombre: nombreProducto,
        descripcion: descripcionProducto,
        precio: precioProducto,
        imagenUrl: imagenUrlProducto,
      };

      await setDoc(doc(db, "Productos", nuevoId.toString()), nuevoProducto);
      setProductos([...productos, nuevoProducto]);
      
      // Resetear los campos del formulario
      setNombreProducto("");
      setDescripcionProducto("");
      setPrecioProducto(0);
      setImagenUrlProducto("");
    } catch (error) {
      console.error("Error al agregar producto con ID autoincremental: ", error);
    }
  };

  // Función para editar un producto
  const editarProducto = (index: number) => {
    const producto = productos[index];
    setProductoEditado(producto);
    setNombreProducto(producto.nombre);
    setDescripcionProducto(producto.descripcion);
    setPrecioProducto(producto.precio);
    setImagenUrlProducto(producto.imagenUrl);
  };

  // Función para guardar los cambios al editar un producto
  const guardarCambios = async (e: React.FormEvent) => {
    e.preventDefault();

    if (productoEditado) {
      const productoActualizado: Producto = {
        ...productoEditado,
        nombre: nombreProducto,
        descripcion: descripcionProducto,
        precio: precioProducto,
        imagenUrl: imagenUrlProducto,
      };

      try {
        await updateDoc(doc(db, "Productos", productoEditado.id.toString()), {
          nombre: productoActualizado.nombre,
          descripcion: productoActualizado.descripcion,
          precio: productoActualizado.precio,
          imagenUrl: productoActualizado.imagenUrl,
        });

        setProductos(
          productos.map((producto) =>
            producto.id === productoEditado.id ? productoActualizado : producto
          )
        );

        // Resetear campos y estado de edición
        setProductoEditado(null);
        setNombreProducto("");
        setDescripcionProducto("");
        setPrecioProducto(0);
        setImagenUrlProducto("");
      } catch (error) {
        console.error("Error al actualizar producto: ", error);
      }
    }
  };

  // Función para eliminar un producto
  const eliminarProducto = async (index: number) => {
    const producto = productos[index];
    try {
      // Eliminar el producto de la base de datos
      await deleteDoc(doc(db, "Productos", producto.id.toString()));
      
      // Filtrar el producto de la lista local (productos) para actualizar la UI
      setProductos(productos.filter((p) => p.id !== producto.id));
    } catch (error) {
      console.error("Error al eliminar producto: ", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Productos</h1>

      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-semibold">{productoEditado ? "Editar Producto" : "Agregar Producto"}</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={productoEditado ? guardarCambios : agregarProducto}>
            <div className="mb-4">
              <Label htmlFor="nombreProducto">Nombre del Producto</Label>
              <Input
                id="nombreProducto"
                value={nombreProducto}
                onChange={(e) => setNombreProducto(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="descripcionProducto">Descripción del Producto</Label>
              <Input
                id="descripcionProducto"
                value={descripcionProducto}
                onChange={(e) => setDescripcionProducto(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="precioProducto">Precio del Producto</Label>
              <Input
                id="precioProducto"
                type="number"
                value={precioProducto}
                onChange={(e) => setPrecioProducto(Number(e.target.value))}
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="imagenUrlProducto">URL de Imagen del Producto</Label>
              <Input
                id="imagenUrlProducto"
                value={imagenUrlProducto}
                onChange={(e) => setImagenUrlProducto(e.target.value)}
                required
              />
            </div>
            <Button type="submit">{productoEditado ? "Guardar Cambios" : "Agregar Producto"}</Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Lista de Productos</h2>
        {productos.length > 0 ? (
          <div className="space-y-4">
            {productos.map((producto, index) => (
              <div
                key={producto.id}
                className="flex items-center justify-between p-4 bg-white shadow-md rounded-md border border-gray-200"
              >
                <div className="flex-1">
                  <p className="text-lg font-medium">{producto.nombre}</p>
                  <p className="text-sm text-gray-600">Descripción: {producto.descripcion}</p>
                  <p className="text-sm text-gray-600">Precio: ${producto.precio}</p>
                  <p className="text-sm text-gray-600">Imagen: {producto.imagenUrl}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    className="text-sm"
                    onClick={() => editarProducto(index)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    className="text-sm"
                    onClick={() => eliminarProducto(index)}
                  >
                    Borrar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No hay productos disponibles.</p>
        )}
      </div>
    </div>
  );
}
