"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { db } from "@/lib/firebaseConfig"; // Importa la configuración de Firebase
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, increment } from "firebase/firestore";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";

// Definir la interfaz Producto
interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number; // Nuevo campo cantidad
  imagenUrl: string;
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nombreProducto, setNombreProducto] = useState("");
  const [descripcionProducto, setDescripcionProducto] = useState("");
  const [precioProducto, setPrecioProducto] = useState(0);
  const [cantidadProducto, setCantidadProducto] = useState(1); // Estado para cantidad
  const [imagenUrlProducto, setImagenUrlProducto] = useState("");
  const [productoEditado, setProductoEditado] = useState<Producto | null>(null);
  const [showAlert, setShowAlert] = useState(false); // Estado para controlar el AlertDialog

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
        cantidad: cantidadProducto, // Guardar la cantidad
        imagenUrl: imagenUrlProducto,
      };

      await setDoc(doc(db, "Productos", nuevoId.toString()), nuevoProducto);
      setProductos([...productos, nuevoProducto]);
      
      // Mostrar el AlertDialog
      setShowAlert(true);

      // Resetear los campos del formulario
      setNombreProducto("");
      setDescripcionProducto("");
      setPrecioProducto(0);
      setCantidadProducto(1); // Resetear la cantidad
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
    setCantidadProducto(producto.cantidad); // Cargar la cantidad
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
        cantidad: cantidadProducto, // Guardar la cantidad actualizada
        imagenUrl: imagenUrlProducto,
      };

      try {
        await updateDoc(doc(db, "Productos", productoEditado.id.toString()), {
          nombre: productoActualizado.nombre,
          descripcion: productoActualizado.descripcion,
          precio: productoActualizado.precio,
          cantidad: productoActualizado.cantidad, // Actualizar cantidad
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
        setCantidadProducto(1); // Resetear cantidad
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
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Gestión de Productos</h1>

      <Card className="shadow-lg rounded-lg p-6 mb-8 bg-gray-50">
        <CardHeader>
          <h2 className="text-2xl font-medium text-gray-800">{productoEditado ? "Editar Producto" : "Agregar Producto"}</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={productoEditado ? guardarCambios : agregarProducto} className="space-y-6">
            <div className="mb-4">
              <Label htmlFor="nombreProducto" className="text-sm font-medium">Nombre del Producto</Label>
              <Input
                id="nombreProducto"
                value={nombreProducto}
                onChange={(e) => setNombreProducto(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="descripcionProducto" className="text-sm font-medium">Descripción del Producto</Label>
              <Input
                id="descripcionProducto"
                value={descripcionProducto}
                onChange={(e) => setDescripcionProducto(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="precioProducto" className="text-sm font-medium">Precio del Producto</Label>
              <Input
                id="precioProducto"
                type="number"
                value={precioProducto}
                onChange={(e) => setPrecioProducto(Number(e.target.value))}
                required
                className="mt-1"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="cantidadProducto" className="text-sm font-medium">Cantidad del Producto</Label>
              <Input
                id="cantidadProducto"
                type="number"
                value={cantidadProducto}
                onChange={(e) => setCantidadProducto(Number(e.target.value))}
                required
                className="mt-1"
                min={1}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="imagenUrlProducto" className="text-sm font-medium">URL de Imagen del Producto</Label>
              <Input
                id="imagenUrlProducto"
                value={imagenUrlProducto}
                onChange={(e) => setImagenUrlProducto(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full py-2">{productoEditado ? "Guardar Cambios" : "Agregar Producto"}</Button>
          </form>
        </CardContent>
      </Card>

      <div>
  <h2 className="text-3xl font-bold text-gray-900 mb-8">Lista de Productos</h2>
  {productos.length > 0 ? (
    <div className="space-y-8">
      {productos.map((producto) => (
        <div
          key={producto.id}
          className="flex items-center justify-between p-8 bg-white shadow-xl rounded-3xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
        >
          <div className="flex-1 pr-8">
            <p className="text-2xl font-semibold text-gray-800">{producto.nombre}</p>
            <p className="text-lg text-gray-600 mt-2">Descripción: {producto.descripcion}</p>
            <p className="text-lg text-gray-600 mt-2">Precio: <span className="font-bold text-gray-800">${producto.precio}</span></p>
            <p className="text-lg text-gray-600 mt-2">Cantidad <span className="font-bold text-gray-800">{producto.cantidad}</span></p>
          </div>
          <div className="flex-shrink-0">
            {producto.imagenUrl && (
              <img
                src={producto.imagenUrl}
                alt={producto.nombre}
                className="w-48 h-48 object-cover rounded-2xl shadow-lg border-4 border-gray-100"
              />
            )}
          </div>
          <div className="flex space-x-4 ml-6">
            <Button
              variant="secondary"
              className="text-lg px-8 py-4 bg-gray-200 hover:bg-gray-300 rounded-xl transition-colors"
              onClick={() => editarProducto(productos.indexOf(producto))}
            >
              Editar
            </Button>
            <Button
              variant="destructive"
              className="text-lg px-8 py-4 bg-red-500 hover:bg-red-600 rounded-xl text-white transition-colors"
              onClick={() => eliminarProducto(productos.indexOf(producto))}
            >
              Eliminar
            </Button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500 text-xl">No hay productos disponibles.</p>
  )}
</div>

      {/* AlertDialog cuando el producto ha sido agregado correctamente */}
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Producto Agregado</AlertDialogTitle>
            <AlertDialogDescription>
              El producto ha sido agregado correctamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <AlertDialogCancel
              onClick={() => setShowAlert(false)}
              className="bg-red-600 text-black hover:bg-red-400"
            >
              Cerrar
            </AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
