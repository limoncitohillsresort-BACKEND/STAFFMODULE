import React, { useState, useEffect } from 'react';

export default function App() {
    // Generación de ID y Fecha
    const [refId, setRefId] = useState('PENDIENTE');
    const [currentDate, setCurrentDate] = useState('');
    const [signDate, setSignDate] = useState('');

    useEffect(() => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date().toLocaleDateString('es-MX', options);
        setCurrentDate(today);
        setSignDate(today);
        setRefId('RH-' + Math.floor(100000 + Math.random() * 900000));
    }, []);

    // Estado del Formulario Principal
    const initialFormData = {
        name: '', title: '', empId: '', dept: '', phone: '', email: '',
        nature: '', parties: '', signature: ''
    };
    const [formData, setFormData] = useState(initialFormData);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Estado de la Bitácora (Filas)
    const createEmptyRow = (id) => ({
        id, date: '', time: '', location: '', description: '', witnesses: ''
    });

    const [rows, setRows] = useState([
        createEmptyRow(Date.now()),
        createEmptyRow(Date.now() + 1),
        createEmptyRow(Date.now() + 2)
    ]);

    const handleRowChange = (id, field, value) => {
        setRows(prevRows => prevRows.map(row => 
            row.id === id ? { ...row, [field]: value } : row
        ));
    };

    const addRow = () => {
        setRows(prev => [...prev, createEmptyRow(Date.now())]);
    };

    const removeRow = (idToRemove) => {
        if (rows.length > 1) {
            setRows(prev => prev.filter(row => row.id !== idToRemove));
        } else {
            // Si es la última fila, solo la vaciamos
            setRows([createEmptyRow(Date.now())]);
        }
    };

    // Estado del Modal
    const [modal, setModal] = useState({
        isOpen: false,
        activeRowId: null,
        text: ''
    });

    const openEditor = (id, currentText) => {
        setModal({
            isOpen: true,
            activeRowId: id,
            text: currentText || ''
        });
    };

    const closeModal = () => {
        setModal({ isOpen: false, activeRowId: null, text: '' });
    };

    const saveModal = () => {
        if (modal.activeRowId) {
            handleRowChange(modal.activeRowId, 'description', modal.text);
        }
        closeModal();
    };

    const clearForm = () => {
        if (window.confirm('¿Está seguro de que desea borrar todo el formulario?')) {
            setFormData(initialFormData);
            setRows([createEmptyRow(Date.now())]);
            
            const today = new Date().toLocaleDateString('es-MX', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
            setSignDate(today);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                
                body {
                    -webkit-print-color-adjust: exact;
                }
                
                .sheet-container {
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                }

                .cell-input {
                    width: 100%;
                    height: 100%;
                    background: transparent;
                    border: none;
                    outline: none;
                    padding: 8px 12px;
                    font-size: 14px;
                    color: #1f2937;
                    font-family: 'Inter', sans-serif;
                }

                .cell-input:focus {
                    background-color: #e0f2fe;
                    box-shadow: inset 0 0 0 2px #3b82f6;
                }

                .cell-desc-preview {
                    width: 100%;
                    height: 100%;
                    padding: 8px 12px;
                    font-size: 14px;
                    color: #1f2937;
                    background: transparent;
                    cursor: pointer;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: pre-wrap;
                    min-height: 40px;
                }

                .cell-desc-preview:hover {
                    background-color: #f1f5f9;
                }

                .cell-desc-preview:empty::before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                }

                .cell-header {
                    background-color: #f8fafc;
                    color: #475569;
                    font-weight: 600;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    padding: 8px 12px;
                    border-right: 1px solid #e2e8f0;
                    border-bottom: 1px solid #e2e8f0;
                    user-select: none;
                }

                .cell-data {
                    background-color: #ffffff;
                    border-right: 1px solid #e2e8f0;
                    border-bottom: 1px solid #e2e8f0;
                    padding: 0;
                    margin: 0;
                    vertical-align: top;
                }

                @media print {
                    body { background-color: white; }
                    .no-print { display: none !important; }
                    .sheet-container {
                        box-shadow: none;
                        border: 1px solid #000;
                    }
                    .cell-input { padding: 4px; }
                    .cell-desc-preview {
                        -webkit-line-clamp: unset !important;
                        overflow: visible !important;
                        height: auto !important;
                        display: block !important;
                    }
                }
            `}</style>

            {/* Barra de Acción Superior */}
            <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center no-print">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Bitácora Confidencial de Incidentes</h1>
                    <p className="text-sm text-gray-500">Documento Interno Seguro • Formulario RH-902</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={clearForm} className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded hover:bg-red-50 transition-colors">
                        Borrar Formulario
                    </button>
                    <button onClick={() => window.print()} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                        Imprimir / Guardar PDF
                    </button>
                </div>
            </div>

            {/* El Documento "Hoja de Cálculo" */}
            <div className="max-w-5xl mx-auto bg-white sheet-container border border-gray-300">
                
                {/* Encabezado del Documento */}
                <div className="p-6 border-b border-gray-300 bg-gray-50">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-800 text-white flex items-center justify-center font-bold text-xl rounded">RH</div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">Reporte de Mala Conducta</h2>
                                <p className="text-xs text-gray-500">ESTRICTAMENTE CONFIDENCIAL</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500 font-mono">ID REF: <span className="font-bold text-gray-900">{refId}</span></div>
                            <div className="text-xs text-gray-500">Fecha: <span>{currentDate}</span></div>
                        </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded text-sm text-blue-800">
                        <strong>Instrucciones:</strong> Por favor complete todas las secciones con hechos concretos. Limítese a comportamientos observables y citas específicas. No especule sobre los motivos. Este documento es un registro legal.
                    </div>
                </div>

                {/* Sección 1: Detalles del Empleado (Grid) */}
                <div className="grid grid-cols-4 border-b border-gray-300">
                    <div className="cell-header col-span-4 bg-gray-100 text-center border-b border-gray-300">Sección A: Información del Reportante</div>
                    
                    <div className="cell-header">Nombre Completo</div>
                    <div className="cell-data"><input type="text" name="name" value={formData.name} onChange={handleFormChange} className="cell-input" placeholder="Ingrese su nombre" /></div>
                    <div className="cell-header">Puesto / Cargo</div>
                    <div className="cell-data"><input type="text" name="title" value={formData.title} onChange={handleFormChange} className="cell-input" placeholder="Ingrese su puesto" /></div>

                    <div className="cell-header">No. de Empleado</div>
                    <div className="cell-data"><input type="text" name="empId" value={formData.empId} onChange={handleFormChange} className="cell-input" placeholder="Ej. 88203" /></div>
                    <div className="cell-header">Departamento / Área</div>
                    <div className="cell-data"><input type="text" name="dept" value={formData.dept} onChange={handleFormChange} className="cell-input" placeholder="Ej. Ventas" /></div>

                    <div className="cell-header">Teléfono / Ext</div>
                    <div className="cell-data"><input type="text" name="phone" value={formData.phone} onChange={handleFormChange} className="cell-input" placeholder="Extensión" /></div>
                    <div className="cell-header">Correo Electrónico</div>
                    <div className="cell-data"><input type="email" name="email" value={formData.email} onChange={handleFormChange} className="cell-input" placeholder="correo@empresa.com" /></div>
                </div>

                {/* Sección 2: Sujeto del Reporte */}
                <div className="grid grid-cols-4 border-b border-gray-300">
                    <div className="cell-header col-span-4 bg-gray-100 text-center border-b border-gray-300">Sección B: Contexto del Incidente</div>

                    <div className="cell-header col-span-1">Naturaleza del Incidente</div>
                    <div className="cell-data col-span-3">
                        <select name="nature" value={formData.nature} onChange={handleFormChange} className="cell-input cursor-pointer">
                            <option value="" disabled>Seleccione categoría...</option>
                            <option value="Acoso / Hostigamiento Laboral">Acoso / Hostigamiento Laboral</option>
                            <option value="Discriminación">Discriminación</option>
                            <option value="Robo / Daño a Propiedad">Robo / Daño a Propiedad</option>
                            <option value="Violación de Seguridad">Violación de Seguridad</option>
                            <option value="Insubordinación">Insubordinación</option>
                            <option value="Abuso de Sustancias">Abuso de Sustancias</option>
                            <option value="Otro">Otro (Especifique en notas)</option>
                        </select>
                    </div>

                    <div className="cell-header col-span-1">Partes Involucradas</div>
                    <div className="cell-data col-span-3"><input type="text" name="parties" value={formData.parties} onChange={handleFormChange} className="cell-input" placeholder="Nombre(s) de la(s) persona(s) reportada(s)" /></div>
                </div>

                {/* Sección 3: La Bitácora Detallada */}
                <div>
                    <div className="cell-header bg-gray-100 text-center border-b border-gray-300">Sección C: Bitácora Cronológica de Eventos</div>
                    
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="cell-header w-24">Fecha</th>
                                <th className="cell-header w-24">Hora</th>
                                <th className="cell-header w-48">Ubicación</th>
                                <th className="cell-header">Descripción del Evento / Comportamiento / Cita</th>
                                <th className="cell-header w-48">Testigos Presentes</th>
                                <th className="cell-header w-12 text-center no-print">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <tr key={row.id}>
                                    <td className="cell-data">
                                        <input type="date" value={row.date} onChange={(e) => handleRowChange(row.id, 'date', e.target.value)} className="cell-input" />
                                    </td>
                                    <td className="cell-data">
                                        <input type="time" value={row.time} onChange={(e) => handleRowChange(row.id, 'time', e.target.value)} className="cell-input" />
                                    </td>
                                    <td className="cell-data">
                                        <input type="text" value={row.location} onChange={(e) => handleRowChange(row.id, 'location', e.target.value)} className="cell-input" placeholder="Ej. Comedor" />
                                    </td>
                                    <td className="cell-data relative group">
                                        <div 
                                            className="cell-desc-preview" 
                                            onClick={() => openEditor(row.id, row.description)} 
                                            data-placeholder="Clic para redactar detalles..."
                                        >
                                            {row.description}
                                        </div>
                                        <div className="absolute top-2 right-2 text-gray-300 pointer-events-none no-print group-hover:text-blue-400 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                        </div>
                                    </td>
                                    <td className="cell-data">
                                        <input type="text" value={row.witnesses} onChange={(e) => handleRowChange(row.id, 'witnesses', e.target.value)} className="cell-input" placeholder="Nombres" />
                                    </td>
                                    <td className="cell-data text-center no-print">
                                        <button onClick={() => removeRow(row.id)} className="text-red-400 hover:text-red-600 font-bold p-2" title="Eliminar Fila">×</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {/* Botón Añadir Fila */}
                    <div className="p-2 bg-gray-50 border-b border-gray-300 no-print">
                        <button onClick={addRow} className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                            <span className="text-lg leading-none">+</span> Añadir Fila de Entrada
                        </button>
                    </div>
                </div>

                {/* Sección 4: Declaración */}
                <div className="p-6 bg-white">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Declaración de Veracidad</h3>
                    <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                        Al firmar a continuación, certifico que la información proporcionada en este reporte es verdadera y precisa según mi leal saber y entender. Entiendo que presentar un reporte de mala conducta a sabiendas de que es falso puede resultar en medidas disciplinarias.
                    </p>

                    <div className="flex flex-col md:flex-row gap-8 mt-8">
                        <div className="flex-1">
                            <div className="border-b-2 border-gray-300 mb-2">
                                <input 
                                    type="text" 
                                    name="signature"
                                    value={formData.signature}
                                    onChange={handleFormChange}
                                    className="w-full py-1 bg-transparent outline-none font-serif italic text-xl text-blue-900" 
                                    placeholder="(Escriba su nombre como firma)" 
                                />
                            </div>
                            <label className="text-xs text-gray-500 uppercase font-bold">Firma del Empleado</label>
                        </div>
                        <div className="w-48">
                            <div className="border-b-2 border-gray-300 mb-2 h-9 flex items-end pb-1">
                                <span className="text-gray-900">{signDate}</span>
                            </div>
                            <label className="text-xs text-gray-500 uppercase font-bold">Fecha de Firma</label>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-100 p-4 border-t border-gray-300 text-center text-xs text-gray-400">
                    <p>Depto. de RH • Uso Interno Exclusivo • No Distribuir</p>
                </div>
            </div>

            {/* Modal de Edición */}
            {modal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm no-print" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800">Editor de Descripción</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <div className="p-4 flex-1">
                            <p className="text-sm text-gray-500 mb-2">Detalle el evento. Use saltos de línea para mayor claridad.</p>
                            <textarea 
                                autoFocus
                                value={modal.text}
                                onChange={(e) => setModal(prev => ({ ...prev, text: e.target.value }))}
                                className="w-full h-64 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700 leading-relaxed resize-none"
                                placeholder="Describa los detalles aquí..."
                            />
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end gap-3">
                            <button onClick={closeModal} className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100 font-medium transition-colors">Cancelar</button>
                            <button onClick={saveModal} className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 font-medium shadow-sm transition-colors">Insertar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}