import React, { useState, useRef } from "react";
import {
  ChevronLeft,
  Printer,
  Trash2,
  Plus,
  X,
  Paperclip,
  Check,
  Eraser,
} from "lucide-react";

const formatDateDDMMYYYY = (dateObj) => {
  if (!dateObj) return "";
  const d = new Date(dateObj);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const SignatureCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const getCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    if (e.cancelable) e.preventDefault();
    setIsDrawing(true);
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getCoords(e);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1e3a8a";
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (e.cancelable) e.preventDefault();
    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="w-full">
      <div className="border-b-2 border-gray-400 bg-gray-50/50 relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={150}
          className="w-full h-32 touch-none cursor-crosshair block"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <div className="absolute top-1 right-1 pointer-events-none text-xs text-gray-400 select-none">
          X
        </div>
      </div>
      <div className="flex justify-end mt-1">
        <button
          onClick={clearCanvas}
          className="text-xs text-red-500 hover:text-red-700 underline flex items-center gap-1"
        >
          <Eraser size={12} /> Borrar firma
        </button>
      </div>
    </div>
  );
};

export default function ModuleBuzon({ onBack }) {
  const [rows, setRows] = useState([
    {
      id: 1,
      date: "",
      time: "",
      location: "",
      description: "",
      witnesses: "",
      images: [],
    },
    {
      id: 2,
      date: "",
      time: "",
      location: "",
      description: "",
      witnesses: "",
      images: [],
    },
  ]);
  const [modal, setModal] = useState({ isOpen: false, rowId: null, text: "" });
  const [imageModal, setImageModal] = useState({ isOpen: false, rowId: null });
  const [headerInfo] = useState({
    refId: "RH-" + Math.floor(100000 + Math.random() * 900000),
    currentDate: formatDateDDMMYYYY(new Date()),
  });

  const addRow = () => {
    const newId = rows.length > 0 ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
    setRows([
      ...rows,
      {
        id: newId,
        date: "",
        time: "",
        location: "",
        description: "",
        witnesses: "",
        images: [],
      },
    ]);
  };

  const removeRow = (id) => {
    if (rows.length > 1) {
      setRows(rows.filter((r) => r.id !== id));
    } else {
      setRows([
        {
          id: 1,
          date: "",
          time: "",
          location: "",
          description: "",
          witnesses: "",
          images: [],
        },
      ]);
    }
  };

  const updateRow = (id, field, value) =>
    setRows(
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );

  const openEditor = (id, currentText) =>
    setModal({ isOpen: true, rowId: id, text: currentText });

  const saveModal = () => {
    updateRow(modal.rowId, "description", modal.text);
    setModal({ ...modal, isOpen: false });
  };

  const clearForm = () => {
    if (
      window.confirm("¿Está seguro de que desea borrar todo el formulario?")
    ) {
      setRows([
        {
          id: 1,
          date: "",
          time: "",
          location: "",
          description: "",
          witnesses: "",
          images: [],
        },
      ]);
      const inputs = document.querySelectorAll(".cell-input");
      inputs.forEach((input) => (input.value = ""));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const newImages = files.map((file) => URL.createObjectURL(file));
    setRows(
      rows.map((row) =>
        row.id === imageModal.rowId
          ? { ...row, images: [...row.images, ...newImages] }
          : row
      )
    );
  };

  const removeImage = (rowId, imgIndex) => {
    setRows(
      rows.map((row) => {
        if (row.id === rowId) {
          const newImages = [...row.images];
          newImages.splice(imgIndex, 1);
          return { ...row, images: newImages };
        }
        return row;
      })
    );
  };

  const handleSubmitReport = () => {
    if (
      window.confirm("¿Está seguro de que desea enviar este reporte?")
    ) {
      alert("Reporte enviado exitosamente.");
      if (onBack) onBack();
    }
  };

  const allEvidence = rows.flatMap((r) =>
    r.images.map((img) => ({ img, rowId: r.id }))
  );

  return (
    <div className="module-page bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto p-4 flex justify-between items-center no-print">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Bitácora Confidencial de Incidentes
          </h1>
          <p className="text-sm text-gray-500">
            Documento Interno Seguro • Formulario RH-902
          </p>
        </div>
        <div className="flex gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 text-sm bg-white border rounded hover:bg-gray-50 flex items-center gap-2"
            >
              <ChevronLeft size={16} /> Volver
            </button>
          )}
          <button
            onClick={clearForm}
            className="px-4 py-2 text-sm text-red-600 bg-white border border-red-200 rounded hover:bg-red-50"
          >
            Borrar Formulario
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded flex items-center gap-2"
          >
            <Printer size={16} /> Imprimir / PDF
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-white sheet-container border border-gray-300 mb-8">
        <div className="p-6 border-b border-gray-300 bg-gray-50">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-800 text-white flex items-center justify-center font-bold text-xl rounded">
                RH
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 uppercase">
                  Reporte de Mala Conducta
                </h2>
                <p className="text-xs text-gray-500">
                  ESTRICTAMENTE CONFIDENCIAL
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 font-mono">
                ID REF:{" "}
                <span className="font-bold text-gray-900">
                  {headerInfo.refId}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Fecha: <span>{headerInfo.currentDate}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded text-sm text-blue-800">
            <strong>Instrucciones:</strong> Complete todas las secciones.
          </div>
        </div>

        {/* Secciones y tabla principal */}
        <div className="grid grid-cols-4 border-b border-gray-300">
          <div className="cell-header col-span-4 bg-gray-100 text-center border-b border-gray-300">
            Sección A: Información del Reportante
          </div>
          <div className="cell-header">Nombre Completo</div>
          <div className="cell-data">
            <input className="cell-input" placeholder="Nombre" />
          </div>
          <div className="cell-header">Puesto / Cargo</div>
          <div className="cell-data">
            <input className="cell-input" placeholder="Puesto" />
          </div>
          <div className="cell-header">No. de Empleado</div>
          <div className="cell-data">
            <input className="cell-input" placeholder="ID" />
          </div>
          <div className="cell-header">Departamento</div>
          <div className="cell-data">
            <input className="cell-input" placeholder="Depto" />
          </div>
        </div>

        <div className="grid grid-cols-4 border-b border-gray-300">
          <div className="cell-header col-span-4 bg-gray-100 text-center border-b border-gray-300">
            Sección B: Contexto del Incidente
          </div>
          <div className="cell-header col-span-1">Naturaleza</div>
          <div className="cell-data col-span-3">
            <select
              className="cell-input cursor-pointer bg-white"
              defaultValue=""
            >
              <option value="" disabled>
                Seleccione...
              </option>
              <option>Acoso</option>
              <option>Robo</option>
              <option>Seguridad</option>
              <option>Otro</option>
            </select>
          </div>
          <div className="cell-header col-span-1">Involucrados</div>
          <div className="cell-data col-span-3">
            <input className="cell-input" placeholder="Nombres..." />
          </div>
        </div>

        <div>
          <div className="cell-header bg-gray-100 text-center border-b border-gray-300">
            Sección C: Bitácora Cronológica
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="cell-header">Fecha</th>
                <th className="cell-header">Hora</th>
                <th className="cell-header">Ubicación</th>
                <th className="cell-header">Descripción</th>
                <th className="cell-header">Testigos</th>
                <th className="cell-header no-print">Acción</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="cell-data">
                    <input
                      type="date"
                      className="cell-input"
                      value={row.date}
                      onChange={(e) =>
                        updateRow(row.id, "date", e.target.value)
                      }
                    />
                  </td>
                  <td className="cell-data">
                    <input
                      type="time"
                      className="cell-input"
                      value={row.time}
                      onChange={(e) =>
                        updateRow(row.id, "time", e.target.value)
                      }
                    />
                  </td>
                  <td className="cell-data">
                    <input
                      className="cell-input"
                      value={row.location}
                      onChange={(e) =>
                        updateRow(row.id, "location", e.target.value)
                      }
                    />
                  </td>
                  <td className="cell-data relative group">
                    <div
                      className="cell-desc-preview"
                      onClick={() => openEditor(row.id, row.description)}
                    >
                      {row.description || "Clic para editar..."}
                    </div>
                  </td>
                  <td className="cell-data">
                    <input
                      className="cell-input"
                      value={row.witnesses}
                      onChange={(e) =>
                        updateRow(row.id, "witnesses", e.target.value)
                      }
                    />
                  </td>
                  <td className="cell-data text-center no-print flex justify-center gap-1 p-2">
                    <button
                      onClick={() =>
                        setImageModal({ isOpen: true, rowId: row.id })
                      }
                      className={`font-bold p-1 rounded ${
                        row.images.length > 0
                          ? "text-blue-600 bg-blue-100"
                          : "text-gray-400"
                      }`}
                    >
                      <Paperclip size={16} />
                    </button>
                    <button
                      onClick={() => removeRow(row.id)}
                      className="text-red-400 font-bold p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-2 bg-gray-50 border-b border-gray-300 no-print">
            <button
              onClick={addRow}
              className="text-sm text-blue-600 font-medium flex items-center gap-1"
            >
              <Plus size={16} /> Añadir Fila
            </button>
          </div>
        </div>

        {allEvidence.length > 0 && (
          <div className="p-6 border-b border-gray-300">
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 border-b pb-2">
              Anexos: Evidencia
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {allEvidence.map((item, idx) => (
                <div key={idx} className="border p-2 rounded bg-gray-50">
                  <img
                    src={item.img}
                    className="w-full h-48 object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-6 bg-white">
          <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">
            Declaración de Veracidad
          </h3>
          <div className="flex flex-col md:flex-row gap-8 mt-8">
            <div className="flex-1">
              <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">
                Firma
              </label>
              <SignatureCanvas />
            </div>
            <div className="w-48">
              <div className="border-b-2 border-gray-300 mb-2 h-24 flex items-end pb-1">
                <span className="text-gray-900 w-full text-center">
                  {headerInfo.currentDate}
                </span>
              </div>
              <label className="text-xs text-gray-500 uppercase font-bold">
                Fecha
              </label>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end no-print">
            <button
              onClick={handleSubmitReport}
              className="bg-blue-800 text-white px-8 py-3 rounded shadow hover:bg-blue-900 font-bold flex items-center gap-2"
            >
              <Check size={20} /> Enviar Reporte
            </button>
          </div>
        </div>
      </div>

      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-4">
            <textarea
              value={modal.text}
              onChange={(e) =>
                setModal({ ...modal, text: e.target.value })
              }
              className="w-full h-64 border p-2 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModal({ ...modal, isOpen: false })}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveModal}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {imageModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg w-full max-w-md p-4">
            <label className="block w-full cursor-pointer bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
              <span className="text-blue-700">Subir imágenes</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
            <div className="grid grid-cols-3 gap-2 mt-4 max-h-60 overflow-y-auto">
              {rows
                .find((r) => r.id === imageModal.rowId)
                ?.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img}
                      className="w-full h-full object-cover rounded"
                    />
                    <button
                      onClick={() => removeImage(imageModal.rowId, idx)}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
            </div>
            <button
              onClick={() => setImageModal({ isOpen: false, rowId: null })}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded w-full"
            >
              Listo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

