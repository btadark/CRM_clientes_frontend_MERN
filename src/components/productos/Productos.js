import React, { useContext, useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Producto from './Producto';
import clienteAxios from '../../config/axios';
import Spinner from '../layout/Spinner';

// importar el context
import { CRMContext } from '../../context/CRMContext';

const Productos = ({history}) => {

  const [productos, guardarProductos] = useState([]);

  // Utilizar valores del context
  const [auth, guardarAuth] = useContext(CRMContext);
  
  
  const consultarAPI = async () => {

    try {
      const productosConsulta = await clienteAxios.get('/productos',{
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
  
      guardarProductos(productosConsulta.data); 
      
    } catch (error) {
      // Error con autorizacion
      if(error.response.status === 500) {
        history.push('/iniciar-sesion');
      }
    }
  }
  useEffect(() => { 
    if(auth.token !== '') {
      consultarAPI();
    } else {
      history.push('/iniciar-sesion');
    }
  }, [productos]);

  // si el state esta como false
  if (!auth.auth) {
    history.push('/iniciar-sesion');
  }

  // Spinner de carga
  // if(!productos.length) {
  //   return <Spinner />
  // }

  return (
    <>
      <h2>Productos</h2>
      <Link to={'/productos/nuevo'} className="btn btn-verde nvo-cliente">
        <i className="fas fa-plus-circle"></i>
        Nuevo Producto
      </Link>

      <ul className="listado-productos">
        { productos.map( producto => (
            <Producto 
              key={producto._id}
              producto= {producto}
              consultarAPI= {consultarAPI}
            />
        ))}
      </ul>
    </>
  )
}

export default withRouter(Productos);
