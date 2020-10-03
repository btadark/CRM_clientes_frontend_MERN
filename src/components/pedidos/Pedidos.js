import React, { useContext, useEffect, useState } from 'react';
import clienteAxios from '../../config/axios';
import Pedido from './Pedido';
import { withRouter } from 'react-router-dom';

// importar el context
import { CRMContext } from '../../context/CRMContext';

const Pedidos = ({history}) => {

  // Utilizar valores del context
  const [auth, guardarAuth] = useContext(CRMContext);

  const [pedidos, guardarPedidos] = useState([]);


  useEffect(() => {
    
    const consultarAPI = async() => {

      if(auth.token !== '') {
        try {
          // obtener los pedidos
          const resultado = await clienteAxios.get('/pedidos',{
            headers: {
              Authorization: `Bearer ${auth.token}`
            }
          });
          guardarPedidos(resultado.data);
        } catch (error) {
          // Error con autorizacion
          if(error.response.status === 500) {
            history.push('/iniciar-sesion');
          }
        }
      } else {
        history.push('/iniciar-sesion');
      }
    };
    consultarAPI();

  }, [pedidos]);
  return (
    <div>
      <h2>Pedidos</h2>
      <ul className="listado-pedidos">
        { pedidos.map( detallePedido => (
            <Pedido 
              key={detallePedido._id}
              detallePedido= {detallePedido}
            />
        ))}
      </ul>
    </div>
  )
}

export default withRouter(Pedidos);
