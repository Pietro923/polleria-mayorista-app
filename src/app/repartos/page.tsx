"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import dynamic from "next/dynamic";
import L, { LatLngExpression } from "leaflet";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"; // Importación de pdf-lib
import "leaflet/dist/leaflet.css"; // Importa los estilos de Leaflet

// Importación dinámica de react-leaflet para evitar errores en SSR
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
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [ubicaciones, setUbicaciones] = useState<
    Array<{ repartidor: string; direccion: string; fechaEntrega: string; lat: number; lon: number }>
  >([]);
  const [position, setPosition] = useState<LatLngExpression>([-26.8241, -65.2226]);

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

        setUbicaciones([...ubicaciones, { repartidor, direccion, fechaEntrega, lat: parseFloat(lat), lon: parseFloat(lon) }]);
        setPosition(newPosition);
      } else {
        alert("Dirección no encontrada");
      }
    } catch (error) {
      console.error("Error al buscar la dirección:", error);
    }
  };
const handleDownloadPDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    let yOffset = 350;

    page.drawText("Hoja de Ruta", {
      x: 50,
      y: yOffset,
      size: 18,
      font,
      color: rgb(0, 0, 0),
    });

    yOffset -= 30;
    ubicaciones.forEach((ubicacion, index) => {
      page.drawText(
        `${index + 1}. Repartidor: ${ubicacion.repartidor}, Dirección: ${ubicacion.direccion}, Fecha: ${ubicacion.fechaEntrega}`,
        {
          x: 50,
          y: yOffset,
          size: fontSize,
          font,
        }
      );
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
            <Label htmlFor="repartidor">Repartidor</Label>
            <Input
              id="repartidor"
              value={repartidor}
              onChange={(e) => setRepartidor(e.target.value)}
              placeholder="Nombre del repartidor"
              className="mb-4"
              required
            />
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Dirección de entrega"
              className="mb-4"
              required
            />
            <Label htmlFor="fechaEntrega">Fecha de Entrega</Label>
            <Input
              id="fechaEntrega"
              type="date"
              value={fechaEntrega}
              onChange={(e) => setFechaEntrega(e.target.value)}
              className="mb-4"
              required
            />
            <Button type="submit">Agregar Entrega</Button>
          </form>
        </CardContent>
      </Card>
      <h2 className="text-xl font-semibold mb-4">Mapa de Entregas</h2>
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

      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">Ubicaciones Registradas</h2>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Listado de repartos registrados</TableCaption>
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
          <Button onClick={handleDownloadPDF} className="mt-4">
            Descargar Hoja de Ruta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}