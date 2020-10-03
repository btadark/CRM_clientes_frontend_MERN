import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { withRouter } from 'react-router-dom';

// importar el context
import { CRMContext } from '../../context/CRMContext';

const EditarCliente = (props) => {

  // Obtener un id
  const { id } = props.match.params;

  // Utilizar valores del context
  const [auth, guardarAuth] = useContext(CRMContext);

  // state de cliente
  const [cliente, datosCliente] = useState({
    nombre: '',
    apellido: '',
    empresa: '',
    email: '',
    telefono: ''
  });

  
  useEffect(() => {

    if(auth.token !== '') {
      // Query a la API
      const consultarAPI = async() => {

        try {
          const clienteConsulta = await clienteAxios.get(`/clientes/${id}`,{
            headers: {
              Authorization: `Bearer ${auth.token}`
            }
          });
          datosCliente(clienteConsulta.data);
        } catch (error) {
          // Error con autorizacion
          if(error.response.status == 500) {
            props.history.push('/iniciar-sesion');
          }
        }

      }
      consultarAPI();
    } else {
      props.history.push('/iniciar-sesion');
    }
  },[]);
  
  const actualizarState = e => {
    datosCliente({
      ...cliente,
      [e.target.name] : e.target.value
    })
  }

  // Envia una peticion por axios
  const actualizarCliente = e => {
    e.preventDefault();

    // enviar por axios
    clienteAxios.put(`/clientes/${cliente._id}`, cliente, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
    .then( res => {
      // Validar si hay errores de Mongo
      if(res.data.code === 11000) {
        Swal.fire({
          icon: 'error',
          title: 'Hubo un error',
          text: 'Ese correo ya esta registrado',
        })
      }else {
        Swal.fire(
          'Correcto',
          'Se actualizó Correctamente',
          'success'
        );
        props.history.push('/');
      }
    });
  }

  // Validar el formulario
  const validarCliente = () => {
   
    const {nombre,apellido, email, empresa, telefono} = cliente;
    
    // Revisar
    let valido = !nombre.length || !apellido.length || !empresa.length || !email.length || !telefono.length ;
    return valido;
  }

  // si el state esta como false
  if (!auth.auth) {
    props.history.push('/iniciar-sesion');
  }

  

  return (
    <>
      <h2>Editar Cliente</h2>
      <form
        onSubmit={actualizarCliente}
      >
        <legend>Llena todos los campos</legend>

        <div className="campo">
            <label>Nombre:</label>
            <input 
              type="text"
              placeholder="Nombre Cliente" 
              name="nombre"
              onChange={actualizarState}
              defaultValue={cliente.nombre}
            />
        </div>

        <div className="campo">
            <label>Apellido:</label>
            <input 
              type="text"
              placeholder="Apellido Cliente"
              name="apellido"
              onChange={actualizarState}
              defaultValue={cliente.apellido}
            />
        </div>
    
        <div className="campo">
            <label>Empresa:</label>
            <input 
              type="text"
              placeholder="Empresa Cliente"
              name="empresa"
              onChange={actualizarState}
              defaultValue={cliente.empresa}
            />
        </div>

        <div className="campo">
            <label>Email:</label>
            <input
              type="email"
              placeholder="Email Cliente"
              name="email"
              onChange={actualizarState}
              defaultValue={cliente.email}
            />
        </div>

        <div className="campo">
            <label>Teléfono:</label>
            <input
              type="tel"
              placeholder="Teléfono Cliente"
              name="telefono"
              onChange={actualizarState}
              defaultValue={cliente.telefono}
            />
        </div>

        <div className="enviar">
            <input
              type="submit"
              className="btn btn-azul"
              value="Guardar Cambios"
              disabled={validarCliente()}
            />
        </div>
      </form>

    </>
  )
}

export default withRouter(EditarCliente)
