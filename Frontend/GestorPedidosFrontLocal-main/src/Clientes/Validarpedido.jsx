import React, { useEffect, useState } from 'react';
import { Button, Space, Radio, Table, Tag, Tooltip, Modal, Select, Image } from 'antd';
import {
  Row,
  Col
} from 'react-bootstrap';
import API_URL from '../config';
const { Column, ColumnGroup } = Table;
const { Option } = Select;



const ValidarPedido = () => {
  const [pedidos, setPedidos] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [idcuenta, setidcuenta] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        devolverid();
        const response = await fetch(API_URL +`/cliente/obtener_pedido2/`);

        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const data = await response.json();
        setPedidos(data.Pedidos);
      } catch (error) {
        console.error('Error al obtener pedidos:', error.message);
      }
    };

    obtenerPedidos();
  }, []);



  const handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const clearFilters = () => {
    setFilteredInfo({});
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };





  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);

  const handleTagClick = (estado, record) => {
    setModalVisible(true);
    setSelectedPedido(record);
  };
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedPaymentState, setSelectedPaymentState] = useState(null);

  const handleTagClick2 = (estadoPago, recordPago) => {
    setSelectedRecord(recordPago);
    setSelectedPaymentState(estadoPago);
    setModalVisible(true);
  };

  const devolverid = async () => {
    try {
      const response = await fetch(API_URL +'/Login/id/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: localStorage.getItem('token'),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const cuenta = data.id_cuenta;
        setidcuenta(cuenta);
      } else {
        // Manejar errores de la solicitud a la API
        window.location.href = '/';
      }
    } catch (error) {
      // Manejar errores de la solicitud
      console.error('Error en la solicitud:', error);
    }
  }


  const handleValidarPago = async (recordPago) => {
    try {

      const formData = new FormData();
      formData.append('estado_pago', 'Pagado');  // Cambia al estado deseado al validar
      formData.append('id_cuenta', idcuenta);
      // Realiza la solicitud POST a la API
      const response = await fetch(API_URL +`/cliente/actualizar_pago/${recordPago.id_pedido}/`, {
        method: 'POST',
        body: formData,
      });

      // Verifica si la solicitud fue exitosa
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      // Obtiene la respuesta JSON
      const responseData = await response.json();

      // Verifica si la respuesta indica éxito
      if (responseData.success) {
        // Actualiza el estado local de los pedidos si es necesario
        const updatedPedidos = pedidos.map((pedido) => {
          if (pedido.id_pedido === recordPago.id_pedido) {
            return {
              ...pedido,
              Pago: 'Pagado',  // Cambia al estado deseado al validar
            };
          }
          return pedido;
        });

        setPedidos(updatedPedidos);

        console.log('Pago validado con éxito.');
      } else {
        // Si la respuesta indica un error, imprime el mensaje de error
        throw new Error(responseData.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const handleDenegarPago = async (recordPago) => {
    try {
      const formData = new FormData();
      formData.append('estado_pago', 'Denegado');  // Cambia al estado deseado al denegar
      formData.append('id_cuenta', idcuenta);
      // Realiza la solicitud POST a la API
      const response = await fetch(API_URL +`/cliente/actualizar_pago/${recordPago.id_pedido}/`, {
        method: 'POST',
        body: formData,
      });

      // Verifica si la solicitud fue exitosa
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      // Obtiene la respuesta JSON
      const responseData = await response.json();

      // Verifica si la respuesta indica éxito
      if (responseData.success) {
        // Actualiza el estado local de los pedidos si es necesario
        const updatedPedidos = pedidos.map((pedido) => {
          if (pedido.id_pedido === recordPago.id_pedido) {
            return {
              ...pedido,
              Pago: 'Denegado',  // Cambia al estado deseado al denegar
            };
          }
          return pedido;
        });

        setPedidos(updatedPedidos);

        console.log('Pago denegado con éxito.');
      } else {
        // Si la respuesta indica un error, imprime el mensaje de error
        throw new Error(responseData.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const handleModalOk2 = async () => {
    try {
      if (!selectedRecord || selectedPaymentState === null || selectedPaymentState === undefined) {
        throw new Error('Error al cambiar estado del pago: Datos incompletos.');
      }

      const formData = new FormData();
      formData.append('estado_pago', selectedPaymentState);
      // Realiza la solicitud POST
      const response = await fetch(API_URL +`/cliente/actualizar_pago/${selectedRecord.id_pedido}/`, {
        method: 'POST',
        body: formData,
      });

      // Verifica si la solicitud fue exitosa
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      // Obtiene la respuesta JSON
      const responseData = await response.json();

      // Verifica si la respuesta indica éxito
      if (responseData.success) {
        // Actualiza el estado local de los pedidos si es necesario
        const updatedPedidos = pedidos.map((pedido) => {
          if (pedido.id_pedido === selectedRecord.id_pedido) {
            return {
              ...pedido,
              Pago: selectedPaymentState,
            };
          }
          return pedido;
        });

        setPedidos(updatedPedidos);

        // Cierra el modal y restablece los estados seleccionados
        setModalVisible(false);
        setSelectedRecord(null);
        setSelectedPaymentState(null);

        console.log('Pago actualizado con éxito.');
      } else {
        // Si la respuesta indica un error, imprime el mensaje de error
        throw new Error(responseData.message);
      }
    } catch (error) {
      console.error(error.message);
    }

  };
  const handleModalCancel2 = () => {
    // Cierra el modal y restablece los estados seleccionados
    setModalVisible(false);
    setSelectedRecord(null);
    setSelectedPaymentState(null);
  };

  const handleSelectChange = (value) => {
    setSelectedPedido((prevPedido) => ({
      ...prevPedido,
      estado_del_pedido: value,
    }));
  };

  const handleModalOk = async () => {
    try {
      if (selectedPedido.estado_del_pedido === null || selectedPedido.estado_del_pedido === undefined) {
        // Manejar el caso donde el estado_del_pedido es null o undefined
        throw new Error('El estado del pedido no está definido.');
      }

      const formData = new FormData();
      formData.append('estado_del_pedido', selectedPedido.estado_del_pedido);


      const response = await fetch(API_URL +`/cliente/actualizar_pedido/${selectedPedido.id_pedido}/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      // Actualiza el estado local de los pedidos si es necesario
      const updatedPedidos = [...pedidos];
      const index = updatedPedidos.findIndex((pedido) => pedido.id_pedido === selectedPedido.id_pedido);
      updatedPedidos[index].estado_del_pedido = selectedPedido.estado_del_pedido;
      setPedidos(updatedPedidos);

      setModalVisible(false);
      setSelectedPedido(null);
    } catch (error) {
      console.error('Error al cambiar estado del pedido:', error.message);
    }
  };



  const handleModalCancel = () => {
    setModalVisible(false);
  };



  const handleSelectChangePago = (value, recordPago) => {
    console.log('Cambiando estado del pago:', value);
    console.log('Registro asociado:', recordPago);

    recordPago.tagTextP = TextoTagPago(value);
    recordPago.tagColorP = ColorTagPago(value);
    setPedidos([...pedidos]);


  };

  const ColorTag = (estado) => {
    switch (estado) {
      case 'O':
        return 'blue';
      case 'P':
        return 'purple';
      case 'C':
        return 'orange';
      case 'R':
      return 'black';

      default:
        return 'default';
    }
  };



  const TextoTag = (estado) => {
    switch (estado) {
      case 'O':
        return 'Ordenado';
      case 'P':
        return 'En proceso';
      case 'C':
        return 'En camino';
      case 'R':
        return 'Reversion';
      default:
        return estado;
    }
  };

  const ColorTagPago = (estadoPago) => {
    switch (estadoPago) {
      case 'Pagado':
        return 'rgb(17, 54, 11)';
      case 'En revisión':
        return 'rgb(255, 119, 7)';
      case 'Denegado':
        return 'rgb(151, 2, 2)';
      default:
        return 'default';
    }
  };
  const TextoTagPago = (estadoPago) => {
    switch (estadoPago) {
      case 'Pagado':
        return 'Pagado';
      case 'En revisión':
        return 'En revisión';
      case 'Denegado':
        return 'Denegado';
      default:
        return estadoPago;
    }
  };

  const ColorTagMetodo = (metodoPago) => {
    switch (metodoPago) {
      case 'E':
        return 'green';
      case 'T':
        return 'cyan';
      case 'F':
        return 'geekblue';
      default:
        return 'default';
    }
  };
  const TextoTagMetodo = (metodoPago) => {
    switch (metodoPago) {
      case 'E':
        return 'Efectivo';
      case 'T':
        return 'Transferencia';
      case 'F':
        return 'Fraccionado';
      default:
        return metodoPago;
    }
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre_usuario',
      key: 'nombre_usuario',
      sorter: (a, b) => {
        const aName = a.nombre_usuario || '';
        const bName = b.nombre_usuario || '';
        return aName.localeCompare(bName);
      },
      sortOrder: sortedInfo.columnKey === 'nombre_usuario' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Estado del pedido',
      dataIndex: 'estado_del_pedido',
      key: 'estado_del_pedido',
      render: (estado, record) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title={`Cambiar estado del pedido`}>
            <Tag
              color={record.tagColor || ColorTag(estado)}
              onClick={() => handleTagClick(estado, record)}
              style={{ cursor: 'pointer' }}
            >
              {record.tagText || TextoTag(estado)}

            </Tag>
          </Tooltip>
        </div>
      ),
      filters: [
        {
          text: 'Ordenado',
          value: 'O',
        },
        {
          text: 'En camino',
          value: 'E',
        },
        {
          text: 'Entregado',
          value: 'D',
        },
      ],
      filteredValue: filteredInfo.estado_del_pedido || null,
      onFilter: (value, record) => record.estado_del_pedido.includes(value),
      sorter: (a, b) => a.estado_del_pedido.localeCompare(b.estado_del_pedido),
      sortOrder: sortedInfo.columnKey === 'estado_del_pedido' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'metodo de pago',
      dataIndex: 'metodo_de_pago',
      key: 'metodo_de_pago',
      render: (metodoPago, recordMetodo) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>

          <Tag
            color={recordMetodo.tagColorM || ColorTagMetodo(metodoPago)}
          >
            {recordMetodo.tagTextM || TextoTagMetodo(metodoPago)}
          </Tag>
        </div>
      ),
      filters: [
        {
          text: 'Efectivo',
          value: 'E',
        },
        {
          text: 'Transferencia',
          value: 'T',
        },
        {
          text: 'Fraccionado',
          value: 'F',
        },
      ],
      filteredValue: filteredInfo.metodo_de_pago || null,
      onFilter: (value, record) => record.metodo_de_pago.includes(value),
      sorter: (a, b) => a.metodo_de_pago.localeCompare(b.Pago),
      sortOrder: sortedInfo.columnKey === 'Pago' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Imagen',
      dataIndex: 'imagen',
      key: 'imagen',
      render: (imagen) => (
        imagen ? (
          <Image
            src={`data:image/png;base64,${imagen}`}
            alt="Imagen del pedido"
            style={{ maxWidth: '50px', maxHeight: '50px' }}
          />
        ) : <span>N/A</span>
      ),
      ellipsis: true,
    },
    {
      title: 'Estado del pago',
      dataIndex: 'Pago',
      key: 'Pago',
      render: (estadoPago, recordPago) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title={`Cambiar estado del pago`}>
            <Tag
              color={recordPago.tagColorP || ColorTagPago(estadoPago)}
              onClick={() => handleTagClick2(estadoPago, recordPago)}
              style={{ cursor: 'pointer' }}
            >
              {recordPago.tagTextP || TextoTagPago(estadoPago)}
            </Tag>
          </Tooltip>
        </div>
      ),
      filters: [
        {
          text: 'Pagado',
          value: 'Pagado',
        },
        {
          text: 'En revisión',
          value: 'En revisión',
        },
        {
          text: 'Denegado',
          value: 'Denegado',
        },
      ],
      filteredValue: filteredInfo.Pago || null,
      onFilter: (value, record) => record.Pago.includes(value),
      sorter: (a, b) => a.Pago.localeCompare(b.Pago),
      sortOrder: sortedInfo.columnKey === 'Pago' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Cambiar estado del pago',
      dataIndex: 'Pago',
      key: 'Pago',
      render: (estadoPago, recordPago) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title={`Validar pago`}>
            <Tag
              color="rgb(3, 34, 4)"  // Puedes cambiar el color según tus necesidades
              onClick={() => handleValidarPago(recordPago)}
              style={{ cursor: 'pointer' }}
            >
              Validar
            </Tag>
          </Tooltip>
          <Tooltip title={`Denegar pago`}>
            <Tag
              color="rgb(151, 2, 2)"
              onClick={() => handleDenegarPago(recordPago)}
              style={{ cursor: 'pointer', marginLeft: '8px' }}
            >
              Denegar
            </Tag>
          </Tooltip>
        </div>
      ),
      ellipsis: true,
    },
    {
      title: 'Precio Total',
      dataIndex: 'Total',
      key: 'Total',
      sorter: (a, b) => a.precio_unitario - b.precio_unitario,
      sortOrder: sortedInfo.columnKey === 'Total' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Fecha de Pedido',
      dataIndex: 'fecha_pedido',
      key: 'fecha_pedido',
      sorter: (a, b) => new Date(a.fecha_pedido) - new Date(b.fecha_pedido),
      sortOrder: sortedInfo.columnKey === 'fecha_pedido' ? sortedInfo.order : null,
      ellipsis: true,
    },
  ];

  return (
    <>
      <Space
        style={{
          marginBottom: 16,
        }}
      >
        <Button onClick={clearFilters}>Limpiar filtros</Button>
      </Space>
      <Table columns={columns} dataSource={pedidos} onChange={handleChange} pagination={{ pageSize: 5 }} />

    </>
  )

}

export default ValidarPedido;