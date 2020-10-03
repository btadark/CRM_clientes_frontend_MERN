import React, { useContext, useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import clienteAxios from '../../config/axios';
import Spinner from '../layout/Spinner';
import Cliente from './Cliente';

// importar el context
import { CRMContext } from '../../context/CRMContext';

const Clientes = ({history}) => {

  // state
  const [clientes, guardarClientes] = useState([]);

  // Utilizar valores del context
  const [auth, guardarAuth] = useContext(CRMContext);

  // Query a la API
  const consultarApi = async () => {

    try {
      const clientesConsulta = await clienteAxios.get('/clientes',{
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      guardarClientes(clientesConsulta.data); 
    } catch (error) {
      // Error con autorizacion
      if(error.response.status === 500) {
        history.push('/iniciar-sesion');
      }
    }
  }

  useEffect(() => {

    if(auth.token !== '') {
      consultarApi();
    } else {
      history.push('/iniciar-sesion');
    }
  }, [clientes]);

  // si el state esta como false
  if (!auth.auth) {
    history.push('/iniciar-sesion');
  }

  // if(!clientes.length) {
  //   return <Spinner />
  // }

  return (
    <>
      <h2>Clientes</h2>
      <Link to={"/clientes/nuevo"} className="btn btn-verde nvo-cliente">
        <i className="fas fa-plus-circle"></i>
        Nuevo Cliente
      </Link>

      <ul className="listado-clientes">
      { clientes.map( cliente => (
          <Cliente 
            key={cliente._id}
            cliente = {cliente}
            consultarApi = {consultarApi}
          />
          ))
      }
      </ul>
    </>
  )
}

export default withRouter(Clientes);
