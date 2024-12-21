import React, { useState, useEffect } from 'react';
import { Table, TimePicker, Tag, message, Button } from 'antd';
import { Row, Col } from 'react-bootstrap';
import dayjs from 'dayjs';
import API_URL from '../config.js';
const CrearHorariosSemanales = ({ onHorarioCreate, detalles }) => {
    const [lunesData, setLunesData] = useState([{ time: null }]);
    const [martesData, setMartesData] = useState([{ time: null }]);
    const [miercolesData, setMiercolesData] = useState([{ time: null }]);
    const [juevesData, setJuevesData] = useState([{ time: null }]);
    const [viernesData, setViernesData] = useState([{ time: null }]);
    const [sabadoData, setSabadoData] = useState([{ time: null }]);
    const [domingoData, setDomingoData] = useState([{ time: null }]);
    const [jsonHorario, setJsonHorario] = useState(null);

    useEffect(() => {
        if (detalles) {
            var domingo = 0;
            var lunes = 0;
            var martes = 0;
            var miercoles = 0;
            var jueves = 0;
            var viernes = 0;
            var sabado = 0;
            detalles.forEach((detalle) => {
                switch (detalle.dia) {
                    case 'Domingo':
                        handleTimeChange(domingo, dayjs(detalle.hora_inicio, 'HH:mm:ss'), setDomingoData);
                        handleTimeChange(domingo + 1, null, setDomingoData);
                        domingo++;
                        break;
                    case 'Lunes':
                        handleTimeChange(lunes, dayjs(detalle.hora_inicio, 'HH:mm:ss'), setLunesData);
                        handleTimeChange(lunes + 1, null, setLunesData);
                        lunes++;
                        break;
                    case 'Martes':
                        handleTimeChange(martes, dayjs(detalle.hora_inicio, 'HH:mm:ss'), setMartesData);
                        handleTimeChange(martes + 1, null, setMartesData);
                        martes++;
                        break;
                    case 'Miercoles':
                        handleTimeChange(miercoles, dayjs(detalle.hora_inicio, 'HH:mm:ss'), setMiercolesData);
                        handleTimeChange(miercoles + 1, null, setMiercolesData);
                        miercoles++;
                        break;
                    case 'Jueves':
                        handleTimeChange(jueves, dayjs(detalle.hora_inicio, 'HH:mm:ss'), setJuevesData);
                        handleTimeChange(jueves + 1, null, setJuevesData);
                        jueves++;
                        break;
                    case 'Viernes':
                        handleTimeChange(viernes, dayjs(detalle.hora_inicio, 'HH:mm:ss'), setViernesData);
                        handleTimeChange(viernes + 1, null, setViernesData);
                        viernes++;
                        break;
                    case 'Sabado':
                        handleTimeChange(sabado, dayjs(detalle.hora_inicio, 'HH:mm:ss'), setSabadoData);
                        handleTimeChange(sabado + 1, null, setSabadoData);
                        sabado++;
                        break;
                    default:
                    // Manejar casos desconocidos
                }
                switch (detalle.dia) {
                    case 'Domingo':
                        handleTimeChange(domingo, dayjs(detalle.hora_fin, 'HH:mm:ss'), setDomingoData);
                        handleTimeChange(domingo + 1, null, setDomingoData);
                        domingo++;
                        break;
                    case 'Lunes':
                        handleTimeChange(lunes, dayjs(detalle.hora_fin, 'HH:mm:ss'), setLunesData);
                        handleTimeChange(lunes + 1, null, setLunesData);
                        lunes++;
                        break;
                    case 'Martes':
                        handleTimeChange(martes, dayjs(detalle.hora_fin, 'HH:mm:ss'), setMartesData);
                        handleTimeChange(martes + 1, null, setMartesData);
                        martes++;
                        break;
                    case 'Miercoles':
                        handleTimeChange(miercoles, dayjs(detalle.hora_fin, 'HH:mm:ss'), setMiercolesData);
                        handleTimeChange(miercoles + 1, null, setMiercolesData);
                        miercoles++;
                        break;
                    case 'Jueves':
                        handleTimeChange(jueves, dayjs(detalle.hora_fin, 'HH:mm:ss'), setJuevesData);
                        handleTimeChange(jueves + 1, null, setJuevesData);
                        jueves++;
                        break;
                    case 'Viernes': 
                        handleTimeChange(viernes, dayjs(detalle.hora_fin, 'HH:mm:ss'), setViernesData);
                        handleTimeChange(viernes + 1, null, setViernesData);
                        viernes++;
                        break;
                    case 'Sabado':
                        handleTimeChange(sabadoData.length, dayjs(detalle.hora_fin, 'HH:mm:ss'), setSabadoData);
                        handleTimeChange(sabado + 1, null, setSabadoData);
                        sabado++;
                        break;
                    default:
                    // Manejar casos desconocidos

                }

            });
        }
    }, []);

    const handleCreateHorario = () => {
        const horarioData = {
            L: lunesData,
            M: martesData,
            X: miercolesData,
            J: juevesData,
            V: viernesData,
            S: sabadoData,
            D: domingoData,
        };

        const formattedData = [];
        Object.keys(horarioData).forEach((day) => {
            const dayData = horarioData[day];
            for (let i = 0; i < dayData.length; i += 2) {
                const horaInicio = dayData[i]?.time?.format('HH:mm');
                const horaFin = dayData[i + 1]?.time?.format('HH:mm');

                if (horaInicio && horaFin) {
                    formattedData.push({
                        dia: day,
                        hora_inicio: horaInicio,
                        hora_fin: horaFin,
                    });
                }
            }
        });
        console.log('JSON de Horario:', formattedData);
        onHorarioCreate({ Detalles: formattedData });
        message.success('Horario creado exitosamente');
    };

    const handleTimeChange = (index, value, setDayData) => {
        console.log("El index es " + index + " el value es " + value + "xd")
        setDayData((prevData) => {
            const updatedData = [...prevData.slice(0, index), { time: value }];

            if (value !== null && index === prevData.length - 1) {
                updatedData.push({ time: null });
            }

            if (index > 0) {
                const prevTime = prevData[index - 1]?.time;
                if (prevTime && value && value.isBefore(prevTime)) {
                    message.error('La nueva hora debe ser mayor que la anterior');
                    return prevData;
                }

                const prevTag = prevData[index - 1]?.tag;
                const currentTag = prevTag === 'Abrir' ? 'Cerrar' : 'Abrir';
                updatedData[index] = { time: value, tag: currentTag };
            } else {
                updatedData[index] = { time: value, tag: value ? 'Abrir' : 'Sin especificar' };
            }
            console.log("Aqui hay: " + updatedData);
            return updatedData;
        });
    };

    const renderDayTable = (dayName, dayData, setDayData) => {
        return (
            <>
                <table className="table " headers="false"  >
                    <thead>
                        <tr>
                            <th>{dayName}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                {dayData.map((record, index) => (
                                    <div key={index} style={{ marginBottom: '10px' }}>
                                        {record.time ? (
                                            <>
                                                <Tag color={record.tag === 'Abrir' ? '#52c41a' : '#f5222d'}>{record.tag}</Tag>
                                                <TimePicker
                                                    format="HH:mm"
                                                    value={record.time}
                                                    onChange={(value) => handleTimeChange(index, value, setDayData)}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <Tag color="#858585">Sin especificar</Tag>
                                                <TimePicker
                                                    format="HH:mm"
                                                    onChange={(value) => handleTimeChange(index, value, setDayData)}
                                                />
                                            </>
                                        )}
                                    </div>
                                ))}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </>
        );
    };

    return (
        <>
            <div className="table-responsive">
                <table className="table table-bordered" headers="false" style={{ border: '1px solid #A4A4A4' }}>

                    <tbody>
                        <tr>
                            <td>
                                <table className="table" headers="false" style={{ border: '1px solid #A4A4A4' }}>
                                    <tbody>
                                        <tr>
                                            <td>
                                                {renderDayTable('Domingo', domingoData, setDomingoData)}
                                            </td>
                                            <td>
                                                {renderDayTable('Lunes', lunesData, setLunesData)}
                                            </td>
                                            <td>
                                                {renderDayTable('Martes', martesData, setMartesData)}
                                            </td>
                                            <td>
                                                {renderDayTable('Miércoles', miercolesData, setMiercolesData)}
                                            </td>
                                            <td>
                                                {renderDayTable('Jueves', juevesData, setJuevesData)}
                                            </td>
                                            <td>
                                                {renderDayTable('Viernes', viernesData, setViernesData)}
                                            </td>
                                            <td>
                                                {renderDayTable('Sábado', sabadoData, setSabadoData)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <br />
            <Button type="primary" onClick={handleCreateHorario}>
                Guardar horario
            </Button>
        </>
    );
};
export default CrearHorariosSemanales;
