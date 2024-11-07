"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
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
        alert('Dirección no encontrada');
      }
    } catch (error) {
      console.error('Error al buscar la dirección:', error);
      alert('No se pudo buscar la dirección');
    }

    setRepartidor("");
    setDireccion("");
    setFechaEntrega("");
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
      <h1 className="text-2xl font-bold mb-6">Registrar Reparto</h1>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Nuevo Reparto</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="repartidor">Repartidor:</Label>
              <Input
                id="repartidor"
                value={repartidor}
                onChange={(e) => setRepartidor(e.target.value)}
                placeholder="Nombre del repartidor"
                required
              />
            </div>

            <div>
              <Label htmlFor="direccion">Dirección de Entrega:</Label>
              <Input
                id="direccion"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Dirección de entrega"
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

            <Button type="submit">Registrar Reparto</Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="w-full h-64 mt-4">
            <MapContainer
              center={position}
              zoom={13}
              scrollWheelZoom={false}
              className="h-full w-full rounded-md"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {ubicaciones.map((ubicacion, index) => (
                <Marker key={index} position={[ubicacion.lat, ubicacion.lon]} icon={customMarker} />
              ))}
            </MapContainer>
          </div>
        </CardFooter>
      </Card>

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
