import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Table, Select, DatePicker, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import GenerarReportePDF from "./generarReporte";
import moment from 'moment';
import { notification } from 'antd';
import API_URL from '../config.js';
const { Column } = Table;
const { Option } = Select;

const ReportManagement = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedSucursal, setSelectedSucursal] = useState(null);
  const [selectedTipoEmpleado, setSelectedTipoEmpleado] = useState(null);
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [empleadosData, setEmpleadosData] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriasc, setCategoriasCombos] = useState([]);
  const [empresaInfo, setEmpresaInfo] = useState(null);
  const [logoEmpresa, setLogoEmpresa] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [facturasEmitidas, setFacturasEmitidas] = useState([]);
  const [selectedSucursalName, setSelectedSucursalName] = useState("")
  const [selectedTipoEmpleadoName, setSelectedTipoEmpleadoName] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedCombos, setSelectedCombos] = useState(null);
  const [modalVisibleProductos, setModalVisibleProductos] = useState(false);
  const [modalVisibleCombos, setModalVisibleCombos] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfViewerVisible, setPdfViewerVisible] = useState(null);
  const [modalVisibleVentas, setModalVisibleVentas] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [selectedVentasName, setSelectedVentasName] = useState("");
  const [showSucursalOptions, setShowSucursalOptions] = useState(false);
  const [showMeseroOptions, setShowMeseroOptions] = useState(false);
  const [showProductoOptions, setShowProductoOptions] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [dateRanges, setDateRanges] = useState(null);
  const [meseros, setMeseros] = useState([]);
  const [selectedMesero, setSelectedMesero] = useState(null);
  const [selectedMeseroName, setSelectedMeseroName] = useState("")
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [selectedProductoName, setSelectedProductoName] = useState("")
  const [tipoproductos, setTipoProductos] = useState([]);
  const [selectedTipoProducto, setSelectedTipoProducto] = useState(null);
  const [selectedTipoProductoName, setSelectedTipoProductoName] = useState("")
  const [showTipoProductoOptions, setShowTipoProductoOptions] = useState(false);

  const [modalVisibleReverso, setModalVisibleReverso] = useState(false);
  const [selectedReverso, setSelectedReverso] = useState(null);
  const [fechaMinima, setFechaMinima] = useState(null);
  const [fechaMaxima, setFechaMaxima] = useState(null);
  const [fechaMinimaV, setFechaMinimaV] = useState(null);
  const [fechaMaximaV, setFechaMaximaV] = useState(null);
  const [fechaMinimaI, setFechaMinimaI] = useState(null);
  const [fechaMaximaI, setFechaMaximaI] = useState(null);

  const [startMonthYear, setStartMonthYear] = useState(null);
  const [endMonthYear, setEndMonthYear] = useState(null);
  const [selectedMesName, setSelectedMesName] = useState("")
  const [showMesOptions, setShowMesOptions] = useState(false);

  const [modalVisibleTop, setModalVisibleTop] = useState(false);
  const [selectedTop, setSelectedTop] = useState(null);
  const [fechaMinimaVentas, setFechaMinVentas] = useState(null);
  const [fechaMaximaVentas, setFechaMaxVentas] = useState(null);
  const [fechaMinimaSu, setFechaMinSu] = useState(null);
  const [fechaMaximaSu, setFechaMaxSu] = useState(null);
  const [fechaMinimaMe, setFechaMinMe] = useState(null);
  const [fechaMaximaMe, setFechaMaxMe] = useState(null);
  const [fechaMinimaPro, setFechaMinPro] = useState(null);
  const [fechaMaximaPro, setFechaMaxPro] = useState(null);
  const [fechaMinimaTip, setFechaMinTip] = useState(null);
  const [fechaMaximaTip, setFechaMaxTip] = useState(null);
  const [fechaMinimas, setFechaMinMesFac] = useState(null);
  const [fechaMaximas, setFechaMaxMesFac] = useState(null);
  const [fechaMinimax, setFechaMinSucFac] = useState(null);
  const [fechaMaximax, setFechaMaxSucFac] = useState(null);
  const [fechaMinimat, setFechaMinTodFac] = useState(null);
  const [fechaMaximat, setFechaMaxTodFac] = useState(null);
  const [fechaMinCli, setFechaMinClie] = useState(null);
  const [fechaMaxCli, setFechaMaxClie] = useState(null);
  const [fechaMinPag, setFechaMinPag] = useState(null);
  const [fechaMaxPag, setFechaMaxPag] = useState(null);

  const [modalVisibleFacturas, setModalVisibleFacturas] = useState(false);
  const [selectedFacturas, setSelectedFacturas] = useState(null);
  const [showTodosOptions, setShowTodosOptions] = useState(null);
  const [modalVisibleClientes, setModalVisibleClientes] = useState(false);
  const [selectedClientes, setSelectedClientes] = useState(null);
  const [showCliOptions, setShowCliOptions] = useState(null);
  const [showCliDMOptions, setShowCliDMOptions] = useState(null);
  const [modalVisiblePagos, setModalVisiblePagos] = useState(false);
  const [selectedPagos, setSelectedPagos] = useState(null);
  const [showPagOptions, setShowPagOptions] = useState(false);
  const [showPagDMOptions, setShowPagDMOptions] = useState(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Buscar
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reiniciar
        </Button>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => document.getElementById("searchInput").select(), 100);
      }
    },
    render: (text) => {
      if (searchText) {
        return searchedColumn === dataIndex ? (
          <span style={{ fontWeight: "bold" }}>{text}</span>
        ) : (
          text
        );
      } else {
        return text;
      }
    },
  });

  useEffect(() => {
    fetchSucursales();
    fetchCategorias();
    fetchEmpresaInfo();
    fetchCategoriasCombos();
    fetchMeseros();
    fetchProductos();
    fetchTipoProductos();
    obtenerFechasReverso();
    obtenerFechasReversoI();
    obtenerFechasReversoV();
    obtenerFechasVentas();
    obtenerFechasSucursal();
    obtenerFechasMesero();
    obtenerFechasProducto();
    obtenerFechasTipoProducto();
    obtenerFechasMeseroFact();
    obtenerFechasSucFact();
    obtenerFechasToFact();
    obtenerFechasClientes();
    obtenerFechasPagos();
  }, []);


  const obtenerFechasReverso = async () => {
    try {
      const response = await fetch(API_URL + "/Mesero/lista_reverso_factura/");
      const data = await response.json();

      if (response.ok) {
        setFechaMinima(data.fecha_minima ? moment(data.fecha_minima) : null);
        setFechaMaxima(data.fecha_maxima ? moment(data.fecha_maxima) : null);
      } else {
        console.error('Error al obtener las fechas de reverso:', data.error);
      }
    } catch (error) {
      console.error('Error al obtener las fechas de reverso:', error);
    }
  };

  const obtenerFechasReversoI = async () => {
    try {
      const response = await fetch(API_URL + "/Mesero/factura_n_report/");
      const data = await response.json();

      if (response.ok) {
        setFechaMinimaI(data.fecha_minima ? moment(data.fecha_minima) : null);
        setFechaMaximaI(data.fecha_maxima ? moment(data.fecha_maxima) : null);
      } else {
        console.error('Error al obtener las fechas de reverso:', data.error);
      }
    } catch (error) {
      console.error('Error al obtener las fechas de reverso:', error);
    }
  };

  const obtenerFechasReversoV = async () => {
    try {
      const response = await fetch(API_URL + "/Mesero/factura_v_report/");
      const data = await response.json();

      if (response.ok) {
        setFechaMinimaV(data.fecha_minima ? moment(data.fecha_minima) : null);
        setFechaMaximaV(data.fecha_maxima ? moment(data.fecha_maxima) : null);
      } else {
        console.error('Error al obtener las fechas de reverso:', data.error);
      }
    } catch (error) {
      console.error('Error al obtener las fechas de reverso:', error);
    }
  };

  const obtenerFechasVentas = async () => {
    try {
      const response = await fetch(API_URL + "/Mesero/fechatop/");
      const data = await response.json();

      if (response.ok) {
        setFechaMinVentas(data.fecha_minima ? moment(data.fecha_minima) : null);
        setFechaMaxVentas(data.fecha_maxima ? moment(data.fecha_maxima) : null);
        /*const nuevaFechaMaxima = fechaMaxima ? fechaMaxima.add(1, 'month') : null;
        setFechaMaxVentas(nuevaFechaMaxima);*/
      } else {
        console.error('Error al obtener las fechas de reverso:', data.error);
      }
    } catch (error) {
      console.error('Error al obtener las fechas de reverso:', error);
    }
  };

  const obtenerFechasSucursal = async (selectedSucursal) => {
    if (selectedSucursal !== undefined) {
      console.log("ID de la sucursal:", selectedSucursal);
      try {
        const response = await fetch(API_URL + `/Mesero/fechasucursal/${selectedSucursal}/`);
        const data = await response.json();

        if (response.ok) {
          setFechaMinSu(data.fecha_minima ? moment(data.fecha_minima) : null);
          setFechaMaxSu(data.fecha_maxima ? moment(data.fecha_maxima) : null);
        } else {
          console.error('Error al obtener las fechas de la sucursal:', data.error);
        }
      } catch (error) {
        console.error('Error al obtener las fechas de la sucursal:', error);
      }
    }
  };

  const obtenerFechasMesero = async (selectedMesero) => {
    if (selectedMesero !== undefined) {
      console.log("ID de la mesero:", selectedMesero);
      try {
        const response = await fetch(API_URL + `/Mesero/fechamesero/${selectedMesero}/`);
        const data = await response.json();

        if (response.ok) {
          setFechaMinMe(data.fecha_minima ? moment(data.fecha_minima) : null);
          setFechaMaxMe(data.fecha_maxima ? moment(data.fecha_maxima) : null);
        } else {
          console.error('Error al obtener las fechas de la mesero:', data.error);
        }
      } catch (error) {
        console.error('Error al obtener las fechas de la mesero:', error);
      }
    }
  };

  const obtenerFechasProducto = async (selectedProducto) => {
    if (selectedProducto !== undefined) {
      console.log("ID de la producto:", selectedProducto);
      try {
        const response = await fetch(API_URL + `/Mesero/fechaproducto/${selectedProducto}/`);
        const data = await response.json();

        if (response.ok) {
          setFechaMinPro(data.fecha_minima ? moment(data.fecha_minima) : null);
          setFechaMaxPro(data.fecha_maxima ? moment(data.fecha_maxima) : null);
        } else {
          console.error('Error al obtener las fechas del producto:', data.error);
        }
      } catch (error) {
        console.error('Error al obtener las fechas del producto:', error);
      }
    }
  };

  const obtenerFechasTipoProducto = async (selectedTipoProducto) => {
    if (selectedTipoProducto !== undefined) {
      console.log("ID de la producto:", selectedTipoProducto);
      try {
        const response = await fetch(API_URL + `/Mesero/fechatipoproducto/${selectedTipoProducto}/`);
        const data = await response.json();

        if (response.ok) {
          setFechaMinTip(data.fecha_minima ? moment(data.fecha_minima) : null);
          setFechaMaxTip(data.fecha_maxima ? moment(data.fecha_maxima) : null);
        } else {
          console.error('Error al obtener las fechas del producto:', data.error);
        }
      } catch (error) {
        console.error('Error al obtener las fechas del producto:', error);
      }
    }
  };

  const obtenerFechasMeseroFact = async (selectedMesero) => {
    if (selectedMesero !== undefined) {
      console.log("ID mesero:", selectedMesero);
      try {
        const response = await fetch(API_URL + `/Mesero/lista_facturas_m/${selectedMesero}/`);
        const data = await response.json();

        if (response.ok) {
          setFechaMinMesFac(data.fecha_minima ? moment(data.fecha_minima) : null);
          setFechaMaxMesFac(data.fecha_maxima ? moment(data.fecha_maxima) : null);
        } else {
          console.error('Error al obtener las fechas del mesero:', data.error);
        }
      } catch (error) {
        console.error('Error al obtener las fechas del mesero:', error);
      }
    }
  };

  const obtenerFechasSucFact = async (selectedSucursal) => {
    if (selectedSucursal !== undefined) {
      console.log("ID sucursal:", selectedSucursal);
      try {
        const response = await fetch(API_URL + `/Mesero/lista_facturas_s/${selectedSucursal}/`);
        const data = await response.json();

        if (response.ok) {
          setFechaMinSucFac(data.fecha_minima ? moment(data.fecha_minima) : null);
          setFechaMaxSucFac(data.fecha_maxima ? moment(data.fecha_maxima) : null);
        } else {
          console.error('Error al obtener las fechas del mesero:', data.error);
        }
      } catch (error) {
        console.error('Error al obtener las fechas del mesero:', error);
      }
    }
  };

  const obtenerFechasToFact = async () => {
    try {
      const response = await fetch(API_URL + `/Mesero/validar_facturas/`);
      const data = await response.json();

      if (response.ok) {
        setFechaMinTodFac(data.fecha_minima ? moment(data.fecha_minima) : null);
        setFechaMaxTodFac(data.fecha_maxima ? moment(data.fecha_maxima) : null);
      } else {
        console.error('Error al obtener las fechas del mesero:', data.error);
      }
    } catch (error) {
      console.error('Error al obtener las fechas del mesero:', error);
    }
  };

  const obtenerFechasClientes = async () => {
    try {
      const response = await fetch(API_URL + `/cliente/ver_clientes/`);
      const data = await response.json();

      if (response.ok) {
        setFechaMinClie(data.fecha_minima ? moment(data.fecha_minima) : null);
        setFechaMaxClie(data.fecha_maxima ? moment(data.fecha_maxima) : null);
        /*const nuevaFechaMaxima = fechaMaxima ? fechaMaxima.add(1, 'month') : null;
        setFechaMaxClie(nuevaFechaMaxima);*/
      } else {
        console.error('Error al obtener las fechas del cliente:', data.error);
      }
    } catch (error) {
      console.error('Error al obtener las fechas del v:', error);
    }
  };

  const obtenerFechasPagos = async () => {
    try {
      const response = await fetch(API_URL + `/pagos/ConsultarPagos/`);
      const data = await response.json();

      if (response.ok) {
        setFechaMinPag(data.fecha_minima ? moment(data.fecha_minima) : null);
        setFechaMaxPag(data.fecha_maxima ? moment(data.fecha_maxima) : null);
        /*const nuevaFechaMaxima = fechaMaxima ? fechaMaxima.add(1, 'month') : null;
        setFechaMaxPag(nuevaFechaMaxima);*/
      } else {
        console.error('Error al obtener las fechas de pagos:', data.error);
      }
    } catch (error) {
      console.error('Error al obtener las fechas de pagos:', error);
    }
  };

  const fetchTipoProductos = () => {
    setLoading(true);
    fetch(API_URL + "/producto/listarproductos/")
      .then((response) => response.json())
      .then((data) => {
        setTipoProductos(data.tipos_productos);
      })
      .catch((error) => console.error("Error fetching tipo productos:", error))
      .finally(() => setLoading(false));
  };

  const fetchProductos = () => {
    setLoading(true);
    fetch(API_URL + "/producto/listar/")
      .then((response) => response.json())
      .then((data) => {
        setProductos(data.productos);
      })
      .catch((error) => console.error("Error fetching productos:", error))
      .finally(() => setLoading(false));
  };

  const fetchCategorias = () => {
    setLoading(true);
    fetch(API_URL + "/producto/listar_categorias/")
      .then((response) => response.json())
      .then((data) => {
        setCategorias(data.categorias);
      })
      .catch((error) => console.error("Error fetching categorias:", error))
      .finally(() => setLoading(false));
  };

  const fetchCategoriasCombos = () => {
    setLoading(true);
    fetch(API_URL + "/combos/listcategoria/")
      .then((response) => response.json())
      .then((data) => {
        setCategoriasCombos(data.categorias_combos);
      })
      .catch((error) => console.error("Error fetching categorias de combos:", error))
      .finally(() => setLoading(false));
  };


  const fetchSucursales = () => {
    setLoading(true);
    fetch(API_URL + "/sucursal/sucusarleslist/")
      .then((response) => response.json())
      .then((data) => {
        setSucursales(data.sucursales);
      })
      .catch((error) => console.error("Error fetching sucursales:", error))
      .finally(() => setLoading(false));
  };

  const fetchMeseros = () => {
    setLoading(true);
    fetch(API_URL + "/Mesero/listar_meseros/")
      .then((response) => response.json())
      .then((data) => {
        setMeseros(data.meseros);
      })
      .catch((error) => console.error("Error fetching meseros:", error))
      .finally(() => setLoading(false));
  };

  const fetchEmpresaInfo = () => {
    setLoading(true);
    fetch(API_URL + "/empresa/infoEmpresa/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((data) => {
        // Almacenamos la información de la empresa en el estado
        if (data.empresa_info && data.empresa_info.elogo) {
          setLogoEmpresa(`data:image/png;base64,${data.empresa_info.elogo}`);
        }
        setEmpresaInfo(data.empresa_info);
      })
      .catch((error) => console.error("Error fetching empresa info:", error))
      .finally(() => setLoading(false));
  };

  const data = [
    { key: 1, reporte: "Reporte de empleados" },
    { key: 2, reporte: "Reporte de facturas emitidas" },
    { key: 3, reporte: "Reporte de clientes" },
    { key: 4, reporte: "Reporte de productos" },
    { key: 5, reporte: "Reporte de combos" },
    { key: 6, reporte: "Reporte de sucursales" },
    { key: 7, reporte: "Reporte de pagos" },
    { key: 8, reporte: "Reporte de ventas" },
    { key: 9, reporte: "Reporte de reverso" },
    { key: 10, reporte: "Reporte de top ventas" },
  ];

  const handleSucursal = () => {
    setSelectedReport("sucursal");
    GenerarReportePDF({
      empresaInfo: empresaInfo,
      logoEmpresa: logoEmpresa,
      sucursal: sucursales,
      selectedReport: "sucursal",
      handleShowViewer: handleShowViewer,
      setPdfBlob: setPdfBlob
    });
  };

  const validateFormEmpleados = () => {
    let isFormValid = true;
    let missingFields = [];

    // Verificar si se ha seleccionado una opción de reverso
    if (!selectedSucursal) {
      isFormValid = false;
      missingFields.push('Sucursal');
    }

    // Verificar si se ha seleccionado un rango de fechas
    if (!selectedTipoEmpleado) {
      isFormValid = false;
      missingFields.push('Tipo empleado');
    }

    if (!isFormValid) {
      const missingFieldsMessage = `Por favor, seleccione los siguientes campos: ${missingFields.join(', ')}`;
      message.error(missingFieldsMessage);
      return false;
    }

    return true;
  };

  const handleEmpleados = () => {
    if (!validateFormEmpleados()) {
      return;
    }
    console.log("Sucursal seleccionada:", selectedSucursal);
    let url;

    if (selectedTipoEmpleado === "todas" && selectedSucursal === "todas") {
      url = API_URL + "/empleado/listar-empleados-tipo/";
    } else if (selectedTipoEmpleado === "todas") {
      url = API_URL + `/empleado/listar-empleados-tipo/${selectedSucursal}/`;
    } else if (selectedSucursal === "todas") {
      url = API_URL + `/empleado/listar-empleados-tipo/todas/${selectedTipoEmpleado}/`;
    } else {
      url = API_URL + `/empleado/listar-empleados-tipo/${selectedSucursal}/${selectedTipoEmpleado}/`;
    }
    // Verificar si selectedTipoEmpleado es null antes de hacer la solicitud GET
    if (selectedTipoEmpleado !== null) {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log("Empleados obtenidos:", data.empleados);
          setEmpleadosData(data.empleados); // Almacenamos los datos de empleados
          setModalVisible(false); // Cerrar el modal después de obtener los datos
          GenerarReportePDF({
            empresaInfo: empresaInfo,
            fechaReporte: new Date().toLocaleDateString(),
            logoEmpresa: logoEmpresa,
            empleadosData: data.empleados,
            selectedSucursal: selectedSucursalName,
            selectedTipoEmpleado: selectedTipoEmpleadoName,
            selectedReport: "empleados",
            handleShowViewer: handleShowViewer,
            setPdfBlob: setPdfBlob
          });
          cerrarModal();
        })
        .catch((error) =>
          console.error("Error al obtener los empleados:", error)
        );
    } else {
      // Aquí podrías mostrar un mensaje o realizar alguna acción en caso de que selectedTipoEmpleado sea null
      console.log("No se ha seleccionado un tipo de empleado");
    }
  };

  const validateFormPagos = () => {
    let isFormValid = true;
    let missingFields = [];

    // Verificar si se ha seleccionado un filtro
    if (!selectedPagos) {
      isFormValid = false;
      missingFields.push('Tipo de filtro');
    }

    // Verificar si se ha seleccionado un tipo de opción
    if (showPagOptions === 'rango' && !showPagDMOptions) {
      isFormValid = false;
      missingFields.push('Tipo de rango');
    }

    // Verificar si se ha seleccionado un tipo de día o mes (si es necesario)
    if (showPagOptions === 'rango' && showPagDMOptions && !dateRange) {
      isFormValid = false;
      missingFields.push('Rango de fechas');
    }

    if (!isFormValid) {
      const missingFieldsMessage = `Por favor, seleccione los siguientes campos: ${missingFields.join(', ')}`;
      message.error(missingFieldsMessage);
      return false;
    }

    return true;
  };

  const handlePagos = () => {
    if (!validateFormPagos()) {
      return;
    }

    let url;
    if (selectedPagos === "todas") {
      url = `${API_URL}/pagos/ConsultarPagos/`;
    } else {
      url = `${API_URL}/pagos/ConsultarPagos/`;
    }
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos de pagos:", data.pagos);
        let filteredData = data.pagos;
        if (showPagDMOptions) {
          if (showPagDMOptions === 'mes') {
            const fechaSeleccionada = new Date(dateRange[0]);
            const mesSeleccionado = fechaSeleccionada.getMonth();
            const añoSeleccionado = fechaSeleccionada.getFullYear();
            filteredData = data.pagos.filter(pago => {
              const fechaPago = new Date(pago.horadepago);
              return fechaPago.getMonth() === mesSeleccionado && fechaPago.getFullYear() === añoSeleccionado;
            });
          } else if (showPagDMOptions === 'dia') {
            const fechaDesde = new Date(dateRange[0]);
            const fechaHasta = new Date(dateRange[1]);
            fechaHasta.setDate(fechaHasta.getDate() + 1); 
            filteredData = data.pagos.filter(pago => {
              const fechaPago = new Date(pago.horadepago);
              return fechaPago >= fechaDesde && fechaPago < fechaHasta;
            });
          }
        }

        if (filteredData.length === 0) {
          message.error("No hay pagos disponibles en el rango de fechas seleccionado.");
          return;
        }
        GenerarReportePDF({
          empresaInfo: empresaInfo,
          logoEmpresa: logoEmpresa,
          selectedReport: "pagos",
          pagos: data.pagos,
          dateRange: dateRange,
          handleShowViewer: handleShowViewer,
          setPdfBlob: setPdfBlob
        });
        cerrarModal();
      })
      .catch((error) =>
        console.error("Error al obtener las pagos", error)
      );
  };

  const validateFormFacturas = () => {
    let isFormValid = true;
    let missingFields = [];

    // Verificar si se ha seleccionado un tipo de opción
    if (!showTodosOptions) {
      isFormValid = false;
      missingFields.push('Tipo de filtro');
    }

    // Verificar si se ha seleccionado una opción de facturas
    if (!selectedFacturas) {
      isFormValid = false;
      missingFields.push('Tipo de facturas');
    }

    // Verificar si se ha seleccionado un mesero (si es necesario)
    if (showMeseroOptions === 'mesero' && !selectedMesero) {
      isFormValid = false;
      missingFields.push('Mesero');
    }

    // Verificar si se ha seleccionado una sucursal (si es necesario)
    if (showSucursalOptions === 'sucursal' && !selectedSucursal) {
      isFormValid = false;
      missingFields.push('Sucursal');
    }

    // Verificar si se ha seleccionado un rango de fechas (si es necesario)
    if (showTodosOptions === 'rango' && !dateRange) {
      isFormValid = false;
      missingFields.push('Rango de fechas');
    }

    if (!isFormValid) {
      const missingFieldsMessage = `Por favor, seleccione los siguientes campos: ${missingFields.join(', ')}`;
      message.error(missingFieldsMessage);
      return false;
    }

    return true;
  };

  const handleGenerateFacturas = () => {
    if (!validateFormFacturas()) {
      return;
    }
    let url;
    if (selectedFacturas === "mesero") {
      url = `${API_URL}/Mesero/lista_facturas_m/${selectedMesero}/`;
    } else if (selectedFacturas === "sucursal") {
      url = `${API_URL}/Mesero/lista_facturas_s/${selectedSucursal}/`;
    } else {
      url = `${API_URL}/Mesero/validar_facturas/`;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos de facturas emitidas:", data.facturas_validadas);
        console.log("Rango fecha:", dateRange);
        let filteredData = data.facturas_validadas;
        if (showTodosOptions!='todas') {
          filteredData = data.facturas_validadas.filter(factura => {
            const fechaPedido = new Date(factura.fecha_emision);
            const fechaDesde = new Date(dateRange[0]);
            const fechaHasta = new Date(dateRange[1]);
            return fechaPedido >= fechaDesde && fechaPedido <= fechaHasta.setDate(fechaHasta.getDate() + 1);
          });
        }
        if (filteredData.length === 0) {
          message.error("No hay facturas disponibles en el rango de fechas seleccionado.");
          return;
        }
        setFacturasEmitidas(data.facturas_validadas);
        setSelectedReport("facturas");
        GenerarReportePDF({
          empresaInfo: empresaInfo,
          logoEmpresa: logoEmpresa,
          dateRange: dateRange,
          facturasEmitidas: data.facturas_validadas,
          selectedReport: "facturas",
          handleShowViewer: handleShowViewer,
          setPdfBlob: setPdfBlob
        });
        cerrarModal();
      })
      .catch((error) =>
        console.error("Error al obtener las facturas emitidas:", error)
      );
  };

  const validateFormClientes = () => {
    let isFormValid = true;
    let missingFields = [];

    // Verificar si se ha seleccionado un filtro
    if (!selectedClientes) {
      isFormValid = false;
      missingFields.push('Tipo de filtro');
    }

    // Verificar si se ha seleccionado un tipo de opción
    if (showCliOptions === 'rango' && !showCliDMOptions) {
      isFormValid = false;
      missingFields.push('Tipo de rango');
    }

    // Verificar si se ha seleccionado un tipo de día o mes (si es necesario)
    if (showCliOptions === 'rango' && showCliDMOptions && !dateRange) {
      isFormValid = false;
      missingFields.push('Rango de fechas');
    }

    if (!isFormValid) {
      const missingFieldsMessage = `Por favor, seleccione los siguientes campos: ${missingFields.join(', ')}`;
      message.error(missingFieldsMessage);
      return false;
    }

    return true;
  };

  const generateClientesReport = () => {
    if (!validateFormClientes()) {
      return;
    }

    let url;
    if (selectedClientes === "todas") {
      url = `${API_URL}/cliente/ver_clientes/`;
    } else {
      url = `${API_URL}/cliente/ver_clientes/`;
    }
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("Rango fecha:", dateRange);

        let filteredData = data.clientes;
        if (showCliDMOptions) {
          if (showCliDMOptions === 'mes') {
            const fechaSeleccionada = new Date(dateRange[0]);
            const mesSeleccionado = fechaSeleccionada.getMonth();
            const añoSeleccionado = fechaSeleccionada.getFullYear();
            filteredData = data.clientes.filter(cliente => {
              const fechaRegistro = new Date(cliente.cregistro);
              return fechaRegistro.getMonth() === mesSeleccionado && fechaRegistro.getFullYear() === añoSeleccionado;
            });
          } else if (showCliDMOptions === 'dia') {
            const fechaDesde = new Date(dateRange[0]);
            const fechaHasta = new Date(dateRange[1]);
            fechaHasta.setDate(fechaHasta.getDate() + 1); // Incluir el último día del rango
            filteredData = data.clientes.filter(cliente => {
              const fechaRegistro = new Date(cliente.cregistro);
              return fechaRegistro >= fechaDesde && fechaRegistro < fechaHasta;
            });
          }
        }

        if (filteredData.length === 0) {
          message.error("No hay clientes disponibles en el rango de fechas seleccionado.");
          return;
        }

        GenerarReportePDF({
          empresaInfo: empresaInfo,
          logoEmpresa: logoEmpresa,
          dateRange: dateRange,
          selectedReport: "clientes",
          clientes: data.clientes,
          handleShowViewer: handleShowViewer,
          setPdfBlob: setPdfBlob
        });
        cerrarModal();
      })
      .catch((error) => {
        console.error("Error fetching clientes:", error);
      });
  };

  const validateFormProd = () => {
    let isFormValid = true;
    let missingFields = [];

    // Verificar si se ha seleccionado una opción de reverso
    if (!selectedOption) {
      isFormValid = false;
      missingFields.push('Producto');
    }

    if (!isFormValid) {
      const missingFieldsMessage = `Por favor, seleccione los siguientes campos: ${missingFields.join(', ')}`;
      message.error(missingFieldsMessage);
      return false;
    }

    return true;
  };

  const HandleProductos = () => {
    if (!validateFormProd()) {
      return;
    }

    console.log("Categoría seleccionada:", selectedOption);

    if (selectedOption != null) {
      let url;

      if (selectedOption === "todas") {
        url = API_URL + "/producto/listar-productos/";
      } else {
        url = API_URL + `/producto/listar-productos/categoria/${selectedOption}/`;
      }

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log("Productos obtenidos:", data.productos);
          GenerarReportePDF({
            empresaInfo: empresaInfo,
            logoEmpresa: logoEmpresa,
            selectedReport: "productos",
            productos: data.productos,
            handleShowViewer: handleShowViewer,
            setPdfBlob: setPdfBlob
          });
          cerrarModal();
        })
        .catch((error) =>
          console.error("Error al obtener los productos:", error)
        );
    } else {
      console.log("No se ha seleccionado ninguna categoría");
    }
  };

  const validateFormCom = () => {
    let isFormValid = true;
    let missingFields = [];

    // Verificar si se ha seleccionado una opción de reverso
    if (!selectedCombos) {
      isFormValid = false;
      missingFields.push('Combo');
    }

    if (!isFormValid) {
      const missingFieldsMessage = `Por favor, seleccione los siguientes campos: ${missingFields.join(', ')}`;
      message.error(missingFieldsMessage);
      return false;
    }

    return true;
  };

  const HandleCombos = () => {
    if (!validateFormCom()) {
      return;
    }

    console.log("Combo seleccionada:", selectedCombos);

    if (selectedCombos != null) {
      let url;

      if (selectedCombos === "todas") {
        url = API_URL + "/combos/ver_combost/";
      } else {
        url = API_URL + `/combos/ver_combosc/${selectedCombos}/`;
      }

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log("Combos obtenidos:", data.combos);
          GenerarReportePDF({
            empresaInfo: empresaInfo,
            logoEmpresa: logoEmpresa,
            selectedReport: "combos",
            combos: data.combos,
            handleShowViewer: handleShowViewer,
            setPdfBlob: setPdfBlob
          });
          cerrarModal();
        })
        .catch((error) =>
          console.error("Error al obtener los combos:", error)
        );
    } else {
      console.log("No se ha seleccionado ninguna categoría");
    }
  }

  //Const para los meses en los reportes 
  const formatDate = (date) => {
    if (date instanceof Date) {
      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return `${month}/${year}`;
    } else {
      return '';
    }
  };

  const validateForm = () => {
    let isFormValid = true;
    let missingFields = [];

    // Verificar si se ha seleccionado un tipo de reporte
    if (!selectedVenta) {
      isFormValid = false;
      missingFields.push('Tipo de reporte');
    }

    // Verificar si se ha seleccionado un rango de fechas (excepto para el caso "mes")
    if (selectedVenta !== 'mes' && !dateRange) {
      isFormValid = false;
      missingFields.push('Rango de fechas');
    }

    // Verificar campos adicionales según el tipo de reporte seleccionado
    switch (selectedVenta) {
      case 'mesero':
        if (!selectedMesero) {
          isFormValid = false;
          missingFields.push('Mesero');
        }
        break;
      case 'sucursal':
        if (!selectedSucursal) {
          isFormValid = false;
          missingFields.push('Sucursal');
        }
        break;
      case 'productos':
        if (!selectedProducto) {
          isFormValid = false;
          missingFields.push('Producto');
        }
        break;
      case 'tipoproducto':
        if (!selectedTipoProducto) {
          isFormValid = false;
          missingFields.push('Tipo de producto');
        }
        break;
      case 'mes':
        if (!startMonthYear || !endMonthYear) {
          isFormValid = false;
          missingFields.push('Mes y Año');
        }
        break;
      default:
        break;
    }

    if (!isFormValid) {
      const missingFieldsMessage = `Por favor, seleccione los siguientes campos: ${missingFields.join(', ')}`;
      message.error(missingFieldsMessage);
      return false;
    }
    return true;
  };

  const handleVentas = () => {
    if (!validateForm()) {
      return;
    }
    console.log("Tipo de Reporte Seleccionado:", selectedVenta);
    console.log("Mesero seleccionado:", selectedMesero);
    console.log("Sucursal seleccionada:", selectedSucursal);
    console.log("Tipo seleccionado:", selectedTipoProducto);

    let url;
    if (selectedVenta === "mesero") {
      if (selectedMesero === "todas") {
        url = API_URL + "/Mesero/listapedidospagados/";
      } else {
        url = API_URL + `/Mesero/listapedidospagado/${selectedMesero}/`;
      }
    } else if (selectedVenta === "sucursal") {
      if (selectedSucursal === "todas") {
        url = API_URL + "/Mesero/listapedidossucursal/";
      } else {
        url = API_URL + `/Mesero/listapedidossucursalid/${selectedSucursal}/`;
      }
    } else if (selectedVenta === "productos") {
      if (selectedProducto === "todas") {
        url = API_URL + "/Mesero/listapedidosproducto/";
      } else {
        url = API_URL + `/Mesero/listapedidosproductos/${selectedProducto}/`;
      }
    } else if (selectedVenta === "tipoproducto") {
      if (selectedTipoProducto === "todas") {
        url = API_URL + "/Mesero/listapedidostipoproducto/";
      } else {
        url = API_URL + `/Mesero/listapedidostipoproductos/${selectedTipoProducto}/`;
      }
    } else if (selectedVenta === "mes") {
      if (startMonthYear && endMonthYear) {
        const startMonthDate = new Date(startMonthYear);
        const endMonthDate = new Date(endMonthYear);
        const startMonth = startMonthDate.getMonth() + 1; // Los meses en JavaScript comienzan desde 0
        const startYear = startMonthDate.getFullYear();
        const endMonth = endMonthDate.getMonth() + 1;
        const endYear = endMonthDate.getFullYear();
        url = `${API_URL}/Mesero/listapedidosmes/?start_month=${startMonth}&end_month=${endMonth}&start_year=${startYear}&end_year=${endYear}`;
      }
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos de pedidos obtenidos:", data.pedidos);
        console.log("Rango fecha:", dateRange);

        let filteredData = data.pedidos;
        if (selectedVenta !== "mes") {
          filteredData = data.pedidos.filter(venta => {
            const fechaPedido = new Date(venta.fecha_pedido);
            const fechaDesde = new Date(dateRange[0]);
            const fechaHasta = new Date(dateRange[1]);
            return fechaPedido >= fechaDesde && fechaPedido <= fechaHasta.setDate(fechaHasta.getDate() + 1);
          });
        }
        if (filteredData.length === 0) {
          message.error("No hay ventas disponibles en el rango de fechas seleccionado.");
          return;
        }

        const selectedMesName = selectedVenta === 'mes' ? `${formatDate(new Date(startMonthYear))} - ${formatDate(new Date(endMonthYear))}` : '';
        GenerarReportePDF({
          empresaInfo: empresaInfo,
          logoEmpresa: logoEmpresa,
          selectedReport: "venta",
          selectedSucursal: selectedSucursalName,
          selectedMesero: selectedMeseroName,
          selectedProducto: selectedProductoName,
          selectedTipoProducto: selectedTipoProductoName,
          selectedMesName: selectedMesName,
          selectedVenta: selectedVenta,
          ventasmesero: data.pedidos,
          dateRange: dateRange,
          handleShowViewer: handleShowViewer,
          setPdfBlob: setPdfBlob
        });
        cerrarModal();
      })
      .catch((error) => console.error("Error al obtener los datos de pedidos:", error));
  };

  const validateFormReverso = () => {
    let isFormValid = true;
    let missingFields = [];

    // Verificar si se ha seleccionado una opción de reverso
    if (!selectedReverso) {
      isFormValid = false;
      missingFields.push('Tipo de reverso');
    }

    // Verificar si se ha seleccionado un rango de fechas
    if (!dateRanges) {
      isFormValid = false;
      missingFields.push('Rango de fechas');
    }

    if (!isFormValid) {
      const missingFieldsMessage = `Por favor, seleccione los siguientes campos: ${missingFields.join(', ')}`;
      message.error(missingFieldsMessage);
      return false;
    }

    return true;
  };

  const handleReverso = () => {
    if (!validateFormReverso()) {
      return;
    }
    console.log("Reverso seleccionada:", selectedReverso);
    if (selectedReverso != null) {
      let url;
      if (selectedReverso === "todas") {
        url = API_URL + "/Mesero/lista_reverso_factura/";
      } else if (selectedReverso === "validas") {
        url = API_URL + `/Mesero/factura_v_report/`;
      } else {
        url = API_URL + `/Mesero/factura_n_report/`;
      }

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log("Factura reverso obtenidos:", data.reverso);
          //Filtro para verificar si hay datos disponibles
          const filteredData = data.reverso.filter(factura => {
            const fechaEmisionNotaCredito = new Date(factura.fecha_emision_nota_credito);
            const fechaDesde = new Date(dateRanges[0]);
            const fechaHasta = new Date(dateRanges[1]);
            return fechaEmisionNotaCredito >= fechaDesde && fechaEmisionNotaCredito <= new Date(fechaHasta.setDate(fechaHasta.getDate() + 1));
          });

          if (filteredData.length === 0) {
            message.error("No hay reversos disponibles en el rango de fechas seleccionado.");
            return;
          }
          GenerarReportePDF({
            empresaInfo: empresaInfo,
            logoEmpresa: logoEmpresa,
            selectedReport: "reverso",
            reverso: data.reverso,
            dateRange: dateRanges,
            handleShowViewer: handleShowViewer,
            setPdfBlob: setPdfBlob
          });
          cerrarModal();
        })
        .catch((error) =>
          console.error("Error al obtener los reversos:", error)
        );
    } else {
      console.log("No se ha seleccionado ningún reverso");
    }
  }

  const validateFormTop = () => {
    let isFormValid = true;
    let missingFields = [];

    // Verificar si se ha seleccionado una opción de reverso
    if (!selectedTop) {
      isFormValid = false;
      missingFields.push('Top ventas');
    }

    // Verificar si se ha seleccionado un rango de fechas
    if (!startMonthYear || !endMonthYear) {
      isFormValid = false;
      missingFields.push('Rango de fechas');
    }

    if (!isFormValid) {
      const missingFieldsMessage = `Por favor, seleccione los siguientes campos: ${missingFields.join(', ')}`;
      message.error(missingFieldsMessage);
      return false;
    }

    return true;
  };

  const handleTop = () => {
    if (!validateFormTop()) {
      return;
    }
    // Generar informe para el top de ventas por mesero
    let url;
    if (selectedTop === 'top_mesero') {
      if (startMonthYear && endMonthYear) {
        const startMonthDate = new Date(startMonthYear);
        const endMonthDate = new Date(endMonthYear);
        const startMonth = startMonthDate.getMonth() + 1; // Los meses en JavaScript comienzan desde 0
        const startYear = startMonthDate.getFullYear();
        const endMonth = endMonthDate.getMonth() + 1;
        const endYear = endMonthDate.getFullYear();
        url = `${API_URL}/Mesero/listaventasmesero/?start_month=${startMonth}&end_month=${endMonth}&start_year=${startYear}&end_year=${endYear}`;
      }
    } else if (selectedTop === 'top_sucursal') {
      if (startMonthYear && endMonthYear) {
        const startMonthDate = new Date(startMonthYear);
        const endMonthDate = new Date(endMonthYear);
        const startMonth = startMonthDate.getMonth() + 1;
        const startYear = startMonthDate.getFullYear();
        const endMonth = endMonthDate.getMonth() + 1;
        const endYear = endMonthDate.getFullYear();
        url = `${API_URL}/Mesero/listaventassucursal/?start_month=${startMonth}&end_month=${endMonth}&start_year=${startYear}&end_year=${endYear}`;
      }
    }
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos del mesero con mayores ventas:", data);
        const selectedMesName = selectedReport === 'top' ? `${formatDate(new Date(startMonthYear))} - ${formatDate(new Date(endMonthYear))}` : '';
        if (data.mesero_mayor_ventas) {
          const meseroData = data.mesero_mayor_ventas;
          GenerarReportePDF({
            empresaInfo: empresaInfo,
            logoEmpresa: logoEmpresa,
            meseroData: meseroData,
            selectedMesName: selectedMesName,
            selectedReport: "top",
            handleShowViewer: handleShowViewer,
            setPdfBlob: setPdfBlob
          });
          cerrarModal();
        } else {
          console.log("No se encontraron meseros con pedidos pagados");
        }
      })
      .catch((error) => console.error("Error al obtener los datos del mesero con mayores ventas:", error));
  };

  const handleShowViewer = () => {
    setPdfViewerVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setModalVisibleProductos(false);
    setModalVisibleCombos(false);
    setModalVisibleTop(false);
    setModalVisibleVentas(false);
    setModalVisibleReverso(false);
    setModalVisibleFacturas(false);
    setModalVisibleClientes(false);
    setModalVisiblePagos(false);
    setSelectedSucursal(null);
    setSelectedTipoEmpleado(null);
    setSelectedOption(null);
    setSelectedCombos(null);
    setSelectedTop(null);
    setStartMonthYear(null);
    setEndMonthYear(null);
    setSelectedVenta(null);
    setSelectedMesero(null);
    setDateRange(null);
    setSelectedProducto(null);
    setSelectedTipoProducto(null);
    setSelectedReverso(null);
    setDateRanges(null);
    setShowTodosOptions(null);
    setSelectedFacturas(null);
    setSelectedClientes(null);
    setShowCliOptions(null);
    setShowCliDMOptions(null);
    setSelectedPagos(null);
    setShowPagOptions(null);
    setShowPagDMOptions(null);
    setShowMeseroOptions(null);
    setShowSucursalOptions(null);
    setShowMesOptions(null);
    setShowProductoOptions(null);
    setShowTipoProductoOptions(null);
  };

  return (
    <>
      <div style={{ maxHeight: '430px', overflow: 'auto' }}>
        <Table dataSource={data}>
          <Column
            title="Nombre del Reporte"
            dataIndex="reporte"
            key="reporte"
            {...getColumnSearchProps("reporte")}
          />
          <Column
            title="Acción"
            key="action"
            render={(text, record) => (
              <Button type="primary" onClick={() => {
                if (record.reporte === "Reporte de empleados") {
                  setSelectedReport("empleados");
                  setModalVisible(true);
                } else if (record.reporte === "Reporte de facturas emitidas") {
                  setSelectedReport("facturas");
                  setModalVisibleFacturas(true);
                } else if (record.reporte === "Reporte de clientes") {
                  setSelectedReport("clientes");
                  setModalVisibleClientes(true);
                } else if (record.reporte === "Reporte de productos") {
                  setSelectedReport("productos");
                  setModalVisibleProductos(true);
                } else if (record.reporte === "Reporte de combos") {
                  setSelectedReport("combos");
                  setModalVisibleCombos(true);
                } else if (record.reporte === "Reporte de sucursales") {
                  setSelectedReport("sucursal");
                  handleSucursal(true);
                } else if (record.reporte === "Reporte de ventas") {
                  setSelectedReport("venta");
                  setModalVisibleVentas(true);
                } else if (record.reporte === "Reporte de pagos") {
                  setSelectedReport("pagos");
                  setModalVisiblePagos(true);
                } else if (record.reporte === "Reporte de reverso") {
                  setSelectedReport("reverso");
                  setModalVisibleReverso(true);
                } else if (record.reporte === "Reporte de top ventas") {
                  setSelectedReport("top");
                  setModalVisibleTop(true);
                }
              }}>
                GENERAR
              </Button>
            )}
          />
        </Table>
      </div>
      <Modal
        title="Reporte de Empleados"
        open={modalVisible}
        onCancel={() => cerrarModal()}
        footer={null}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: "10px" }}>
            <p>Seleccione una sucursal:</p>
            <Select
              style={{ width: "100%" }}
              placeholder="Seleccione una sucursal"
              onChange={(value, option) => {
                setSelectedSucursal(value);
                setSelectedSucursalName(option.children);
              }}
              value={selectedSucursal}
              loading={loading}
            >
              <Option key="todas" value="todas">
                Todas las sucursales
              </Option>
              {sucursales.map((sucursal) => (
                <Option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                  {sucursal.snombre}
                </Option>
              ))}
            </Select>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <p>Seleccione un tipo de empleado:</p>
            <Select
              style={{ width: "100%" }}
              placeholder="Seleccione un tipo de empleado"
              onChange={(value, option) => {
                setSelectedTipoEmpleado(value);
                setSelectedTipoEmpleadoName(option.children);
              }}
              value={selectedTipoEmpleado}
            >
              <Option value="todas">Todos los tipos de empleados</Option>
              <Option value="jefe_cocina">Jefes de cocina</Option>
              <Option value="motorizado">Motorizados</Option>
              <Option value="mesero">Meseros</Option>
            </Select>
          </div>

          <div style={{ alignSelf: "flex-end" }}>
            <Button type="primary" onClick={handleEmpleados}>
              Generar Reporte
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        title="Reporte de Productos"
        open={modalVisibleProductos}
        onCancel={() => cerrarModal()}
        footer={null}
      >
        <div style={{ marginBottom: "20px" }}>
          <p>Seleccione una opción:</p>
          <Select
            style={{ width: "100%" }}
            placeholder="Seleccione una opción"
            onChange={(value) => setSelectedOption(value)}
            value={selectedOption}
          >
            <Option key="todas" value="todas">
              Todas los productos
            </Option>
            {categorias.map((categoria) => (
              <Option key={categoria.id_categoria} value={categoria.id_categoria}>
                {categoria.catnombre}
              </Option>
            ))}
          </Select>
        </div>

        <div style={{ alignSelf: "flex-end" }}>
          <Button type="primary" onClick={HandleProductos}>
            Generar Reporte
          </Button>
        </div>
      </Modal>

      <Modal
        title="Reporte de Combos"
        open={modalVisibleCombos}
        onCancel={() => cerrarModal()}
        footer={null}
      >
        <div style={{ marginBottom: "20px" }}>
          <p>Seleccione una opción:</p>
          <Select
            style={{ width: "100%" }}
            placeholder="Seleccione una opción"
            onChange={(value) => setSelectedCombos(value)}
            value={selectedCombos}
          >
            <Option key="todas" value="todas">
              Todas los combos
            </Option>
            {categoriasc.map((categorias_combos) => (
              <Option key={categorias_combos.id_catcombo} value={categorias_combos.id_catcombo}>
                {categorias_combos.catnombre}
              </Option>
            ))}
          </Select>
        </div>

        <div style={{ alignSelf: "flex-end" }}>
          <Button type="primary" onClick={HandleCombos}>
            Generar Reporte
          </Button>
        </div>
      </Modal>

      <Modal
        title="Reporte de Top ventas"
        open={modalVisibleTop}
        onCancel={() => {
          cerrarModal();
        }}
        footer={null}
      >
        <div style={{ marginBottom: "20px" }}>
          <p>Seleccione una opción:</p>
          <Select
            style={{ width: "100%" }}
            placeholder="Seleccione una opción"
            onChange={(value) => setSelectedTop(value)}
            value={selectedTop}
          >
            <Option value="top_mesero">Top ventas mesero</Option>
            <Option value="top_sucursal">Top ventas sucursal</Option>
          </Select>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <p>Seleccione el mes y año de inicio:</p>
          <DatePicker.MonthPicker
            style={{ width: "100%" }}
            format="MM/YYYY"
            onChange={(dateString, option) => {
              setStartMonthYear(dateString);
              setSelectedMesName(option?.children);
            }}
            value={startMonthYear}
            disabledDate={(current) => {
              const minFecha = moment(fechaMinimaVentas);
              const maxFecha = moment(fechaMaximaVentas);
              const estaFueraDeRango =
                current.isBefore(minFecha, 'month') || current.isAfter(maxFecha, 'month');

              return estaFueraDeRango;
            }}
          />

          <p style={{ marginTop: "20px" }}>Seleccione el mes y año de fin:</p>
          <DatePicker.MonthPicker
            style={{ width: "100%" }}
            format="MM/YYYY"
            onChange={(dateString, option) => {
              setEndMonthYear(dateString);
              setSelectedMesName(option?.children);
            }}
            value={endMonthYear}
            disabledDate={(current) => {
              const minFecha = moment(fechaMinimaVentas);
              const maxFecha = moment(fechaMaximaVentas);
              const estaFueraDeRango =
                current.isBefore(minFecha, 'month') || current.isAfter(maxFecha, 'month');

              return estaFueraDeRango;
            }}
          />
        </div>

        <div style={{ alignSelf: "flex-end" }}>
          <Button type="primary" onClick={handleTop}>
            Generar Reporte
          </Button>
        </div>
      </Modal>

      <Modal
        title="Reporte de Ventas"
        open={modalVisibleVentas}
        onCancel={() => {
          cerrarModal();
          setShowMeseroOptions(null);
          setShowSucursalOptions(null);
          setShowProductoOptions(null);
          setShowTipoProductoOptions(null);
          setShowMesOptions(null);
          setSelectedMesero(null);
          setSelectedSucursal(null);
          setSelectedProducto(null);
          setSelectedTipoProducto(null);
        }}
        footer={null}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: "20px" }}>
            <p>Seleccione un tipo de reporte:</p>
            <Select
              style={{ width: "100%" }}
              placeholder="Seleccione un tipo de reporte"
              onChange={(value, option) => {
                setSelectedVenta(value);
                setSelectedVentasName(option.children);
                setShowSucursalOptions(value === "sucursal");
                setShowMeseroOptions(value === "mesero");
                setShowProductoOptions(value === "productos");
                setShowTipoProductoOptions(value === "tipoproducto");
                setShowMesOptions(value === "mes");
              }}
              value={selectedVenta}
            >
              <Select.Option value="sucursal">Sucursal</Select.Option>
              <Select.Option value="mesero">Mesero</Select.Option>
              <Select.Option value="productos">Producto</Select.Option>
              <Select.Option value="tipoproducto">Tipo de producto</Select.Option>
              <Select.Option value="mes">Mes y Año</Select.Option>
            </Select>
          </div>

          {/* Opciones adicionales para "Mes y Año" */}
          {showMesOptions && (
            <div style={{ marginBottom: "20px" }}>
              <p>Seleccione el mes y año de inicio:</p>
              <DatePicker.MonthPicker
                style={{ width: "100%" }}
                format="MM/YYYY"
                onChange={(dateString, option) => {
                  setStartMonthYear(dateString);
                  setSelectedMesName(option.children);
                }}
                value={startMonthYear}
                disabledDate={(current) => {
                  const minFecha = moment(fechaMinimaVentas);
                  const maxFecha = moment(fechaMaximaVentas);
                  const estaFueraDeRango =
                    current.isBefore(minFecha, 'month') || current.isAfter(maxFecha, 'month');

                  return estaFueraDeRango;
                }}
              />

              <p style={{ marginTop: "20px" }}>Seleccione el mes y año de fin:</p>
              <DatePicker.MonthPicker
                style={{ width: "100%" }}
                format="MM/YYYY"
                onChange={(dateString, option) => {
                  setEndMonthYear(dateString);
                  setSelectedMesName(option.children);
                }}
                value={endMonthYear}
                disabledDate={(current) => {
                  const minFecha = moment(fechaMinimaVentas);
                  const maxFecha = moment(fechaMaximaVentas);
                  const estaFueraDeRango =
                    current.isBefore(minFecha, 'month') || current.isAfter(maxFecha, 'month');

                  return estaFueraDeRango;
                }}
              />
            </div>
          )}

          {/* Opciones adicionales para "Mesero" */}
          {showMeseroOptions && (
            <div style={{ marginBottom: "20px" }}>
              <p>Seleccione un mesero:</p>
              <Select
                style={{ width: "100%" }}
                placeholder="Seleccione un mesero"
                onChange={(value, option) => {
                  setSelectedMesero(value);
                  setSelectedMeseroName(option.children);
                  if (value === "todas") {
                    obtenerFechasVentas();
                  } else {
                    obtenerFechasMesero(value);
                  }
                }}
                value={selectedMesero}
              >
                <Option key="todas" value="todas">
                  Todas los meseros
                </Option>
                {meseros.map((mesero) => (
                  <Option key={mesero.id_mesero} value={mesero.id_mesero}>
                    {mesero.nombre + ' ' + mesero.apellido}
                  </Option>
                ))}
              </Select>
            </div>
          )}

          {showMeseroOptions && (
            <div style={{ marginBottom: "20px" }}>
              <p>Seleccione el rango de fechas:</p>
              <DatePicker.RangePicker
                style={{ width: "100%" }}
                onChange={(dates) => setDateRange(dates)}
                value={dateRange}
                disabledDate={(current) => {
                  if (selectedMesero === "todas") {
                    const minFecha = moment(fechaMinimaVentas);
                    const maxFecha = moment(fechaMaximaVentas);
                    const estaFueraDeRango =
                      current.isBefore(minFecha, 'day') || current.isAfter(maxFecha, 'day');
                    return estaFueraDeRango;
                  } else {
                    const minFecha = moment(fechaMinimaMe);
                    const maxFecha = moment(fechaMaximaMe);
                    const estaFueraDeRango =
                      current.isBefore(minFecha, 'day') || current.isAfter(maxFecha, 'day');
                    return estaFueraDeRango;
                  }
                }}
              />
            </div>
          )}

          {/* Opciones adicionales para "Sucursal" */}
          {showSucursalOptions && (
            <div style={{ marginBottom: "20px" }}>
              <p>Seleccione una sucursal:</p>
              <Select
                style={{ width: "100%" }}
                placeholder="Seleccione una sucursal"
                onChange={(value, option) => {
                  setSelectedSucursal(value);
                  setSelectedSucursalName(option.children);
                  if (value === "todas") {
                    obtenerFechasVentas();
                  } else {
                    obtenerFechasSucursal(value);
                  }
                }}
                value={selectedSucursal}
              >
                <Option key="todas" value="todas">
                  Todas las sucursales
                </Option>
                {sucursales.map((sucursal) => (
                  <Option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                    {sucursal.snombre}
                  </Option>
                ))}
              </Select>
            </div>
          )}

          {showSucursalOptions && (
            <div style={{ marginBottom: "20px" }}>
              <p>Seleccione el rango de fechas:</p>
              <DatePicker.RangePicker
                style={{ width: "100%" }}
                onChange={(dates) => setDateRange(dates)}
                value={dateRange}
                disabledDate={(current) => {
                  if (selectedSucursal === "todas") {
                    const minFecha = moment(fechaMinimaVentas);
                    const maxFecha = moment(fechaMaximaVentas);
                    const estaFueraDeRango =
                      current.isBefore(minFecha, 'day') || current.isAfter(maxFecha, 'day');
                    return estaFueraDeRango;
                  } else {
                    const minFecha = moment(fechaMinimaSu);
                    const maxFecha = moment(fechaMaximaSu);
                    const estaFueraDeRango =
                      current.isBefore(minFecha, 'day') || current.isAfter(maxFecha, 'day');
                    return estaFueraDeRango;
                  }
                }}
              />
            </div>
          )}

          {/* Opciones adicionales para "Producto" */}
          {showProductoOptions && (
            <div style={{ marginBottom: "20px" }}>
              <p>Seleccione un producto:</p>
              <Select
                style={{ width: "100%" }}
                placeholder="Seleccione un producto"
                onChange={(value, option) => {
                  setSelectedProducto(value);
                  setSelectedProductoName(option.children);
                  if (value === "todas") {
                    obtenerFechasVentas();
                  } else {
                    obtenerFechasProducto(value);
                  }
                }}
                value={selectedProducto}
              >
                <Option key="todas" value="todas">
                  Todas los productos
                </Option>
                {productos.map((producto) => (
                  <Option key={producto.id_producto} value={producto.id_producto}>
                    {producto.nombreproducto}
                  </Option>
                ))}
              </Select>
            </div>
          )}

          {showProductoOptions && (
            <div style={{ marginBottom: "20px" }}>
              <p>Seleccione el rango de fechas:</p>
              <DatePicker.RangePicker
                style={{ width: "100%" }}
                onChange={(dates) => setDateRange(dates)}
                value={dateRange}
                disabledDate={(current) => {
                  if (selectedProducto === "todas") {
                    const minFecha = moment(fechaMinimaVentas);
                    const maxFecha = moment(fechaMaximaVentas);
                    const estaFueraDeRango =
                      current.isBefore(minFecha, 'day') || current.isAfter(maxFecha, 'day');
                    return estaFueraDeRango;
                  } else {
                    const minFecha = moment(fechaMinimaPro);
                    const maxFecha = moment(fechaMaximaPro);
                    const estaFueraDeRango =
                      current.isBefore(minFecha, 'day') || current.isAfter(maxFecha, 'day');
                    return estaFueraDeRango;
                  }
                }}
              />
            </div>
          )}

          {/* Opciones adicionales para "Tipo producto" */}
          {showTipoProductoOptions && (
            <div style={{ marginBottom: "20px" }}>
              <p>Seleccione un tipo de producto:</p>
              <Select
                style={{ width: "100%" }}
                placeholder="Seleccione un tipo de producto"
                onChange={(value, option) => {
                  setSelectedTipoProducto(value);
                  setSelectedTipoProductoName(option.children);
                  if (value === "todas") {
                    obtenerFechasVentas();
                  } else {
                    obtenerFechasTipoProducto(value);
                  }
                }}
                value={selectedTipoProducto}
              >
                <Option key="todas" value="todas">
                  Todos los tipos de producto
                </Option>
                {tipoproductos.map((tipoproducto) => (
                  <Option key={tipoproducto.id_tipoproducto} value={tipoproducto.id_tipoproducto}>
                    {tipoproducto.tpnombre}
                  </Option>
                ))}
              </Select>
            </div>
          )}

          {showTipoProductoOptions && (
            <div style={{ marginBottom: "20px" }}>
              <p>Seleccione el rango de fechas:</p>
              <DatePicker.RangePicker
                style={{ width: "100%" }}
                onChange={(dates) => setDateRange(dates)}
                value={dateRange}
                disabledDate={(current) => {
                  if (selectedTipoProducto === "todas") {
                    const minFecha = moment(fechaMinimaVentas);
                    const maxFecha = moment(fechaMaximaVentas);
                    const estaFueraDeRango =
                      current.isBefore(minFecha, 'day') || current.isAfter(maxFecha, 'day');
                    return estaFueraDeRango;
                  } else {
                    const minFecha = moment(fechaMinimaTip);
                    const maxFecha = moment(fechaMaximaTip);
                    const estaFueraDeRango =
                      current.isBefore(minFecha, 'day') || current.isAfter(maxFecha, 'day');
                    return estaFueraDeRango;
                  }
                }}
              />
            </div>
          )}

          <div style={{ alignSelf: "flex-end" }}>
            <Button type="primary" onClick={handleVentas}>
              Generar Reporte
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        title="Reporte de reverso"
        open={modalVisibleReverso}
        onCancel={() => cerrarModal()}
        footer={null}
      >
        <div style={{ marginBottom: "20px" }}>
          <p>Seleccione una opción:</p>
          <Select
            style={{ width: "100%" }}
            placeholder="Seleccione una opción"
            onChange={(value) => setSelectedReverso(value)}
            value={selectedReverso}
          >
            <Option value="todas">Todos los reversos de factura</Option>
            <Option value="validas">Facturas válidas</Option>
            <Option value="invalidas">Facturas no válidas</Option>
          </Select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <p>Seleccione el rango de fechas:</p>
          <DatePicker.RangePicker
            style={{ width: "100%" }}
            onChange={(dates) => setDateRanges(dates)}
            value={dateRanges}
            disabledDate={(current) => {
              if (selectedReverso == "validas") {
                const minFecha = moment(fechaMinimaV);
                const maxFecha = moment(fechaMaximaV);
                const estaFueraDeRango =
                  current.isBefore(minFecha, 'day') || current.isAfter(maxFecha, 'day');
                return estaFueraDeRango;

              } else if (selectedReverso == "invalidas") {
                const minFecha = moment(fechaMinimaI);
                const maxFecha = moment(fechaMaximaI);
                const estaFueraDeRango =
                  current.isBefore(minFecha, 'day') || current.isAfter(maxFecha, 'day');
                return estaFueraDeRango;

              } else if (selectedReverso == "todas") {
                const minFecha = moment(fechaMinima);
                const maxFecha = moment(fechaMaxima);
                const estaFueraDeRango =
                  current.isBefore(minFecha, 'day') || current.isAfter(maxFecha, 'day');
                return estaFueraDeRango;
              }
            }}
          />
        </div>
        <div style={{ alignSelf: "flex-end" }}>
          <Button type="primary" onClick={handleReverso}>
            Generar Reporte
          </Button>
        </div>
      </Modal>

      <Modal
        title="Reporte de facturas emitidas"
        open={modalVisibleFacturas}
        onCancel={() => {
          cerrarModal();
          setShowMeseroOptions(null);
          setShowSucursalOptions(null);
          setSelectedMesero(null);
        }}
        footer={null}
      >
        <div style={{ marginBottom: "20px" }}>
          <p>Seleccione un tipo:</p>
          <Select
            style={{ width: "100%" }}
            placeholder="Seleccione una opción"
            onChange={(value) => {
              setShowTodosOptions(value);
            }}
            value={showTodosOptions}
          >
            <Option value="rango">Por rango de fechas</Option>
            <Option value="todas">Historial empresarial</Option>
          </Select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <p>Seleccione una opción:</p>
          <Select
            style={{ width: "100%" }}
            placeholder="Seleccione una opción"
            onChange={(value, option) => {
              setSelectedFacturas(value);
              setShowSucursalOptions(value);
              setShowMeseroOptions(value);
            }}
            value={selectedFacturas}
          >
            <Option value="todas">Todas las facturas</Option>
            <Option value="mesero">Mesero</Option>
            <Option value="sucursal">Sucursal</Option>
          </Select>
        </div>

        {showMeseroOptions === 'mesero' && (
          <div style={{ marginBottom: "20px" }}>
            <p>Seleccione un mesero:</p>
            <Select
              style={{ width: "100%" }}
              placeholder="Seleccione un mesero"
              onChange={(value, option) => {
                setSelectedMesero(value);
                setSelectedMeseroName(option.children);
                obtenerFechasMeseroFact(value);
              }}
              value={selectedMesero}
            >
              {meseros.map((mesero) => (
                <Option key={mesero.id_mesero} value={mesero.id_mesero}>
                  {mesero.nombre + ' ' + mesero.apellido}
                </Option>
              ))}
            </Select>
          </div>
        )}

        {showSucursalOptions === 'sucursal' && (
          <div style={{ marginBottom: "20px" }}>
            <p>Seleccione una sucursal:</p>
            <Select
              style={{ width: "100%" }}
              placeholder="Seleccione una sucursal"
              onChange={(value, option) => {
                setSelectedSucursal(value);
                setSelectedSucursalName(option.children);
                obtenerFechasSucFact(value);
              }}
              value={selectedSucursal}
            >
              {sucursales.map((sucursal) => (
                <Option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
                  {sucursal.snombre}
                </Option>
              ))}
            </Select>
          </div>
        )}

        {showTodosOptions === 'rango' && (
          <div style={{ marginBottom: "20px" }}>
            <p>Seleccione el rango de fechas:</p>
            <DatePicker.RangePicker
              style={{ width: "100%" }}
              onChange={(dates) => setDateRange(dates)}
              value={dateRange}
              disabledDate={(current) => {
                if (selectedFacturas === 'todas') {
                  const minFecha = moment(fechaMinimat);
                  const maxFecha = moment(fechaMaximat);
                  const estaFueraDeRango =
                    current.isBefore(minFecha, 'day') || current.isAfter(maxFecha, 'day');
                  return estaFueraDeRango;
                }
                if (showSucursalOptions === 'sucursal') {
                  const minFecha = moment(fechaMinimax);
                  const maxFecha = moment(fechaMaximax);
                  const estaFueraDeRango =
                    current.isBefore(minFecha, 'day') || current.isAfter(maxFecha, 'day');
                  return estaFueraDeRango;

                }
                if (showMeseroOptions === 'mesero') {
                  const minFecha = moment(fechaMinimas);
                  const maxFecha = moment(fechaMaximas);
                  const estaFueraDeRango =
                    current.isBefore(minFecha, 'day') || current.isAfter(maxFecha, 'day');
                  return estaFueraDeRango;
                }
              }}
            />
          </div>
        )}

        <div style={{ alignSelf: "flex-end" }}>
          <Button type="primary" onClick={handleGenerateFacturas}>
            Generar Reporte
          </Button>
        </div>
      </Modal>

      <Modal
        title="Reporte de clientes"
        open={modalVisibleClientes}
        onCancel={() => cerrarModal()}
        footer={null}
      >
        <div style={{ marginBottom: "20px" }}>
          <p>Seleccione un filtro:</p>
          <Select
            style={{ width: "100%" }}
            placeholder="Seleccione una opción"
            onChange={(value) => {
              setSelectedClientes(value);
              setShowCliOptions(value);
              if (value !== 'rango') {
                setShowCliDMOptions(null);
              }
            }}
            value={selectedClientes}
          >
            <Option value="rango">Por rango de fechas</Option>
            <Option value="todas">Historial empresarial</Option>
          </Select>
        </div>

        {showCliOptions === 'rango' && (
          <div style={{ marginBottom: "20px" }}>
            <p>Seleccione un tipo:</p>
            <Select
              style={{ width: "100%" }}
              placeholder="Seleccione un tipo"
              onChange={(value) => {
                setShowCliDMOptions(value);
              }}
              value={showCliDMOptions}
            >
              <Option value="dia">Por día</Option>
              <Option value="mes">Por mes</Option>
            </Select>
          </div>
        )}

        {showCliDMOptions === 'dia' && (
          <div style={{ marginBottom: "20px" }}>
            <p>Seleccione el rango de fechas:</p>
            <DatePicker.RangePicker
              style={{ width: "100%" }}
              onChange={(dates) => setDateRange(dates)}
              value={dateRange}
              disabledDate={(current) => {
                const minFecha = moment(fechaMinCli);
                const maxFecha = moment(fechaMaxCli);
                const estaFueraDeRango =
                  current.isBefore(minFecha, 'day') || current.isAfter(maxFecha, 'day');
                return estaFueraDeRango;
              }}
            />
          </div>
        )}

        {showCliDMOptions === 'mes' && (
          <div style={{ marginBottom: "20px" }}>
            <p>Seleccione el rango de fechas:</p>
            <DatePicker.MonthPicker
              style={{ width: "100%" }}
              onChange={(date, dateString) => setDateRange([date])}
              value={dateRange?.[0]}
              disabledDate={(current) => {
                const minFecha = moment(fechaMinCli);
                const maxFecha = moment(fechaMaxCli);
                const estaFueraDeRango =
                  current.isBefore(minFecha, 'month') || current.isAfter(maxFecha, 'month');
                return estaFueraDeRango;
              }}
            />
          </div>
        )}

        <div style={{ alignSelf: "flex-end" }}>
          <Button type="primary" onClick={generateClientesReport}>
            Generar Reporte
          </Button>
        </div>
      </Modal>

      <Modal
        title="Reporte de pagos"
        open={modalVisiblePagos}
        onCancel={() => cerrarModal()}
        footer={null}
      >
        <div style={{ marginBottom: "20px" }}>
          <p>Seleccione un filtro:</p>
          <Select
            style={{ width: "100%" }}
            placeholder="Seleccione una opción"
            onChange={(value) => {
              setSelectedPagos(value);
              setShowPagOptions(value);
              if (value !== 'rango') {
                setShowPagDMOptions(null);
              }
            }}
            value={selectedPagos}
          >
            <Option value="rango">Por rango de fechas</Option>
            <Option value="todas">Historial empresarial</Option>
          </Select>
        </div>

        {showPagOptions === 'rango' && (
          <div style={{ marginBottom: "20px" }}>
            <p>Seleccione un tipo:</p>
            <Select
              style={{ width: "100%" }}
              placeholder="Seleccione un tipo"
              onChange={(value) => {
                setShowPagDMOptions(value);
              }}
              value={showPagDMOptions}
            >
              <Option value="dia">Por día</Option>
              <Option value="mes">Por mes</Option>
            </Select>
          </div>
        )}

        {showPagDMOptions === 'dia' && (
          <div style={{ marginBottom: "20px" }}>
            <p>Seleccione el rango de fechas:</p>
            <DatePicker.RangePicker
              style={{ width: "100%" }}
              onChange={(dates) => setDateRange(dates)}
              value={dateRange}
              disabledDate={(current) => {
                const minFecha = moment(fechaMinPag);
                const maxFecha = moment(fechaMaxPag);
                const estaFueraDeRango =
                  current.isBefore(minFecha, 'day') || current.isAfter(maxFecha, 'day');
                return estaFueraDeRango;
              }}
            />
          </div>
        )}

        {showPagDMOptions === 'mes' && (
          <div style={{ marginBottom: "20px" }}>
            <p>Seleccione el rango de fechas:</p>
            <DatePicker.MonthPicker
              style={{ width: "100%" }}
              onChange={(date, dateString) => setDateRange([date])}
              value={dateRange?.[0]}
              disabledDate={(current) => {
                const minFecha = moment(fechaMinPag);
                const maxFecha = moment(fechaMaxPag);
                const estaFueraDeRango =
                  current.isBefore(minFecha, 'month') || current.isAfter(maxFecha, 'month');
                return estaFueraDeRango;
              }}
            />
          </div>
        )}

        <div style={{ alignSelf: "flex-end" }}>
          <Button type="primary" onClick={handlePagos}>
            Generar Reporte
          </Button>
        </div>
      </Modal>

      {pdfViewerVisible && (
        <Modal
          title="Visor de PDF"
          open={pdfViewerVisible}
          onCancel={() => setPdfViewerVisible(false)}
          footer={null}
          style={{ minWidth: "800px", minHeight: "700px" }} // Personaliza el ancho y la altura del modal
        >
          {pdfBlob && (
            <iframe
              src={URL.createObjectURL(pdfBlob)}
              style={{ width: "100%", height: "600px" }}
              title="PDF Viewer"
            ></iframe>
          )}
        </Modal>
      )
      }
    </>
  );
};
export default ReportManagement;