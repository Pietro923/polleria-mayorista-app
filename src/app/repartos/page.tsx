"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import dynamic from "next/dynamic";
import L, { LatLngExpression } from "leaflet";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import "leaflet/dist/leaflet.css"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Firebase
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig"; 

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });

const customMarker = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function RepartoForm() {
  const [repartidor, setRepartidor] = useState("");
  const [direccion, setDireccion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState<string>(new Date().toISOString().split('T')[0]); // Preestablecer la fecha actual
  const [ubicaciones, setUbicaciones] = useState<
    Array<{ repartidor: string; direccion: string; fechaEntrega: string; lat: number; lon: number }>
  >([]);
  const [repartidores, setRepartidores] = useState<string[]>([]); // Nuevo estado para los repartidores
  const [position, setPosition] = useState<LatLngExpression>([-26.8241, -65.2226]);
  

  useEffect(() => {
    // Obtener los repartidores de la colección "Repartidores"
    const fetchRepartidores = async () => {
      const querySnapshot = await getDocs(collection(db, "Repartidores"));
      const repartidoresData: string[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        repartidoresData.push(data.Nombre); // Suponiendo que el campo "Nombre" existe en cada documento
      });

      setRepartidores(repartidoresData);
    };

    fetchRepartidores();

    // Función para obtener los Repartos desde Firebase
    const fetchReparto = async () => {
      const querySnapshot = await getDocs(collection(db, "Reparto"));
      const RepartoData: Array<{ repartidor: string; direccion: string; fechaEntrega: string; lat: number; lon: number }> = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        RepartoData.push({
          repartidor: data.repartidor,
          direccion: data.direccion,
          fechaEntrega: data.fechaEntrega,
          lat: data.lat,
          lon: data.lon,
        });
      });

      setUbicaciones(RepartoData);
    };

    fetchReparto();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullAddress = `${direccion}, San Miguel de Tucumán, Argentina`;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        const newPosition: LatLngExpression = [parseFloat(lat), parseFloat(lon)];

        setUbicaciones([
          ...ubicaciones,
          { repartidor, direccion, fechaEntrega, lat: parseFloat(lat), lon: parseFloat(lon) },
        ]);
        setPosition(newPosition);

        await addDoc(collection(db, "Reparto"), {
          repartidor,
          direccion,
          fechaEntrega,
          lat: parseFloat(lat),
          lon: parseFloat(lon),
        });

        alert("Entrega registrada con éxito");
      } else {
        alert("Dirección no encontrada");
      }
    } catch (error) {
      console.error("Error al buscar la dirección:", error);
    }
  };

  const handleDownloadPDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const headerFontSize = 16;
    let yOffset = 750;

    // Título del PDF
    page.drawText("Hoja de Ruta", {
      x: 50,
      y: yOffset,
      size: headerFontSize,
      font,
      color: rgb(0, 0, 0),
    });

    yOffset -= 30;

    // Información del encabezado (más detallada)
    page.drawText("Fecha de Generación: " + new Date().toLocaleDateString(), {
      x: 50,
      y: yOffset,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    yOffset -= 30;

    // Tablón con la información de las entregas
    page.drawText("Entregas Registradas", {
      x: 50,
      y: yOffset,
      size: headerFontSize,
      font,
      color: rgb(0, 0, 0),
    });

    yOffset -= 20;

    // Columnas de la tabla
    page.drawText("Repartidor", {
      x: 50,
      y: yOffset,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    page.drawText("Dirección", {
      x: 150,
      y: yOffset,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    page.drawText("Fecha de Entrega", {
      x: 300,
      y: yOffset,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    yOffset -= 20;

    // Listado de entregas
    ubicaciones.forEach((ubicacion, index) => {
      page.drawText(`${index + 1}.`, {
        x: 50,
        y: yOffset,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(ubicacion.repartidor, {
        x: 70,
        y: yOffset,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(ubicacion.direccion, {
        x: 150,
        y: yOffset,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(ubicacion.fechaEntrega, {
        x: 300,
        y: yOffset,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });

      yOffset -= 20;
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hoja_de_ruta.pdf";
    a.click();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Formulario de Reparto</h1>
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-semibold">Agregar Entrega</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="repartidor">Repartidor</Label>
              <Select value={repartidor} onValueChange={setRepartidor} required>
                <SelectTrigger className="w-full p-2 border rounded">
                  <SelectValue placeholder="Seleccione un repartidor" />
                </SelectTrigger>
                <SelectContent>
                  {repartidores.map((repartidor, index) => (
                    <SelectItem key={index} value={repartidor}>
                      {repartidor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="mb-4">
            <Label htmlFor="fechaEntrega">Fecha de Entrega</Label>
            <Input
              id="fechaEntrega"
              type="date"
              value={fechaEntrega}
              onChange={(e) => setFechaEntrega(e.target.value)}
              className="mb-4"
              required
            />
            </div>

            <Button type="submit">Registrar</Button>
          </form>
        </CardContent>
      </Card>

      <MapContainer center={position} zoom={13} style={{ height: "400px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {ubicaciones.map((ubicacion, index) => (
          <Marker
            key={index}
            position={[ubicacion.lat, ubicacion.lon]}
            icon={customMarker}
          />
        ))}
      </MapContainer>

      <Card className="mt-8 ">
        <CardHeader>
          <h2 className="text-xl font-semibold">Repartos Registrados</h2>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Repartidor</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Fecha de Entrega</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ubicaciones.map((ubicacion, index) => (
                <TableRow key={index}>
                  <TableCell>{ubicacion.repartidor}</TableCell>
                  <TableCell>{ubicacion.direccion}</TableCell>
                  <TableCell>{ubicacion.fechaEntrega}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
        </CardContent>
        
      </Card>

      <CardFooter className="mt-3">
        <Button onClick={handleDownloadPDF}>Generar PDF</Button>
      </CardFooter>

    </div>
  );
}
