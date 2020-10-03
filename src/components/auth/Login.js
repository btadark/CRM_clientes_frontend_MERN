import React, { useContext, useState } from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import {withRouter} from 'react-router-dom';

// Context
import { CRMContext } from '../../context/CRMContext';

const Login = ({history}) => {

  // Auth y token
  const [ auth, guardarAuth ] = useContext(CRMContext);
  

  const [credenciales, guardarCredenciales] = useState({});

  const leerDatos = e => {
    guardarCredenciales({
      ...credenciales,
      [e.target.name]: e.target.value
    })
  }

  const iniciarSesion = async e => {
    e.preventDefault();

    // Autenticar al usuario
    try {
      const respuesta = await clienteAxios.post('/iniciar-sesion',credenciales);

      // extraer el token y colocarlo en localstorage
      const { token } = respuesta.data;
      localStorage.setItem('token',token);

      // colocalo en el state
      guardarAuth({
        token,
        auth: true
      })

      // Alerta
      Swal.fire(
        'Correcto',
        'Has iniciado Sesión',
        'success'
      );
      history.push('/');
      
    } catch (error) {
      // console.log(error);

      if(error.response) {
        Swal.fire({
          icon: 'error',
          title: 'Hubo un error',
          text: error.response.data.msg
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error'
        })
      }

    }
  }

  return (
    <div className="login">
      <h2>Iniciar Sesion</h2>

      <div className="contenedor">
        <form
          onSubmit={iniciarSesion}
        >
          <div className="campo">
            <label>Email</label>
            <input 
              type="text"
              name="email"
              placeholder="Email para Iniciar Sesion"
              required
              onChange={leerDatos}
            />
          </div>

          <div className="campo">
            <label>Password</label>
            <input 
              type="password"
              name="password"
              placeholder="Password para Iniciar Sesion"
              required
              onChange={leerDatos}
            />
          </div>

          <input type="submit" value="Iniciar Sesion" className="btn btn-verde btn-block"/>
        </form>
      </div>
    </div>
  )
}

export default withRouter(Login);
