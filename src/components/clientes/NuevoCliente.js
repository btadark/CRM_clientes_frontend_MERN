import React, { useContext, useState } from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { withRouter } from 'react-router-dom';

// importar el context
import { CRMContext } from '../../context/CRMContext';

const NuevoCliente = ({history}) => {

  // Utilizar valores del context
  const [auth, guardarAuth] = useContext(CRMContext);

  // state de cliente
  const [cliente, guardarCliente] = useState({
    nombre: '',
    apellido: '',
    empresa: '',
    email: '',
    telefono: ''
  });
  
  const actualizarState = e => {
    guardarCliente({
      ...cliente,
      [e.target.name] : e.target.value
    })
  }

  // Validar el formulario
  const validarCliente = () => {
   
    const {nombre,apellido, email, empresa, telefono} = cliente;
    
    // Revisar
    let valido = !nombre.length || !apellido.length || !empresa.length || !email.length || !telefono.length ;
    return valido;
  }

  const agregarCliente = e => {
    e.preventDefault();

    // Enviar peticion
    clienteAxios.post('/clientes', cliente,{
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
            'Se agrego el cliente',
            res.data.msg,
            'success'
          );
          history.push('/');
        }
      });
  }

  // Verificar si no esta autenticado o no
  if(!auth.auth && (localStorage.getItem('token') === auth.token)) {
    history.push('/iniciar-sesion');
  }
  
  
  return (
    <>
      <h2>Nuevo Cliente</h2>
      <form
        onSubmit={agregarCliente}
      >
        <legend>Llena todos los campos</legend>

        <div className="campo">
            <label>Nombre:</label>
            <input 
              type="text"
              placeholder="Nombre Cliente" 
              name="nombre"
              onChange={actualizarState}
            />
        </div>

        <div className="campo">
            <label>Apellido:</label>
            <input 
              type="text"
              placeholder="Apellido Cliente"
              name="apellido"
              onChange={actualizarState}
            />
        </div>
    
        <div className="campo">
            <label>Empresa:</label>
            <input 
              type="text"
              placeholder="Empresa Cliente"
              name="empresa"
              onChange={actualizarState}
            />
        </div>

        <div className="campo">
            <label>Email:</label>
            <input
              type="email"
              placeholder="Email Cliente"
              name="email"
              onChange={actualizarState}
            />
        </div>

        <div className="campo">
            <label>Teléfono:</label>
            <input
              type="tel"
              placeholder="Teléfono Cliente"
              name="telefono"
              onChange={actualizarState}
            />
        </div>

        <div className="enviar">
            <input
              type="submit"
              className="btn btn-azul"
              value="Agregar Cliente"
              disabled={validarCliente()}
            />
        </div>
      </form>

    </>
  )
}

export default withRouter(NuevoCliente)
