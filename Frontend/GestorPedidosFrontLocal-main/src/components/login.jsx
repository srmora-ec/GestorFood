import React, { useState, useEffect } from "react";
import { Form, Input, Button, Alert, message } from "antd";
import { useNavigate } from "react-router-dom";
import API_URL from '../config.js';
const LoginForm = ({ onLogin }) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL +"/Login/rol/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: localStorage.getItem("token"), // Obtener el token almacenado
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const rol = data.rol;

          // Puedes realizar acciones con el rol recibido si es necesario

          // Ejemplo de redirección basada en el rol
          if (rol === "A") {
            console.log("Aqui se llego");
            window.location.href = "/home";
          }
        } else {
          // Manejar errores de la solicitud a la API
          console.log("error");
        }
      } catch (error) {
        // Manejar errores de la solicitud
        console.error("Error en la solicitud:", error);
      }
    };

    // Llamar a la función fetchData al cargar el componente
    fetchData();
  }, []);
  const onFinish = async (values) => {
    try {
      // Primera solicitud: obtener el token
      const tokenResponse = await fetch(API_URL + '/Login/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });
  
      if (!tokenResponse.ok) {
        console.error('Error al obtener el token');
        return;
      }
  
      const tokenData = await tokenResponse.json();
      const token = tokenData.access;
  
      // Almacenar el token en localStorage
      localStorage.setItem('token', token);
      console.log('Token actual:', token);
  
      // Segunda solicitud: obtener el rol
      const roleResponse = await fetch(API_URL + '/Login/rol/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token, // Usar el token directamente
        }),
      });
  
      if (roleResponse.ok) {
        const roleData = await roleResponse.json();
        const rol = roleData.rol;
  
        // Redirigir según el rol
        if (rol === 'A') {
          navigate('/home');
        } else if (rol === 'M') {
          navigate('/homemesero');
        } else if (rol === 'X') {
          navigate('/cocina');
        }
      } else {
        console.error('Error al obtener el rol');
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
      // const response = await fetch(
      //   API_URL +"/Login/iniciar_sesion/",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       nombreusuario: values.username,
      //       contrasenia: values.password,
      //     }),
      //   }
      // );

      // const data = await response.json();
      // console.log(data); // Verifica si el token está presente en la respuesta

      // if (response.ok) {
      //   const { token, nombreusuario, id_cuenta, rol } = data;
      //   console.log("Token almacenado:", token);
      //   console.log("Nombre de usuario almacenado:", nombreusuario);
      //   console.log("ID de cuenta almacenado:", id_cuenta);


      //   localStorage.setItem("username", nombreusuario);
      //   localStorage.setItem("id_cuenta", id_cuenta);
        
      //   // Después de que el usuario ha iniciado sesión, realiza la redirección
      //   onLogin(data);
      //   // Después de que el usuario ha iniciado sesión, realiza la redirección
        
      //   if (rol === "A") {
      //       //console.log("Aqui aun no intentá imprimir");
            
      //       window.location.href = "/home";
            
      //   } else if (rol === "M") {
      //     navigate("/homemesero"); // Utiliza navigate para redirigir a la ruta deseada
      //   } else if (rol === "X") {
      //     navigate("/cocina"); // Utiliza navigate para redirigir a la ruta deseada
      //   }
      // } else {        // Manejar errores de inicio de sesión
      //   console.error("Error en inicio de sesión:", data.mensaje);
      //   message.error(data.mensaje);
  //     // }
  //   } catch (error) {
  //     console.error("Error en la solicitud de inicio de sesión:", error);
  //   }
    
  // };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const navigate = useNavigate();

  const RedirigirRegistro = () => {
    navigate("/Registro");
  };
  return (
    <Form
      name="loginForm"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      className="max-w-md mx-auto bg-white rounded-lg"
    >
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          textAlign: "center",
          color: "#333",
        }}
      >
        Inicio de Sesión
      </h2>

      <Form.Item
        label="Usuario"
        name="username"
        rules={[{ required: true, message: "Por favor, ingresa tu usuario" }]}
      >
        <Input style={{ width: "100%", height: "40px" }} />
      </Form.Item>

      <Form.Item
        label="Contraseña"
        name="password"
        rules={[
          { required: true, message: "Por favor, ingresa tu contraseña" },
        ]}
      >
        <Input.Password style={{ width: "100%", height: "40px" }} />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ width: "100%", background: "#1890ff" }}
        >
          Iniciar sesión
        </Button>
      </Form.Item>

      <Form.Item>
        <Button
          type="default"
          htmlType="button"
          style={{ width: "100%", background: "#f0f0f0" }}
          onClick={RedirigirRegistro}
        >
          Registrarse
        </Button>
      </Form.Item>

      <Alert
        message="¿No tienes cuenta? Regístrate para disfrutar de más funcioness."
        type="info"
        showIcon
        style={{ marginTop: "1rem" }}
      />
    </Form>
  );
};

export default LoginForm;
