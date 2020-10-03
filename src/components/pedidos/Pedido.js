import React, { useContext } from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';

// importar el context
import { CRMContext } from '../../context/CRMContext';

const Pedido = ({detallePedido}) => {

  // Utilizar valores del context
  const [auth, guardarAuth] = useContext(CRMContext);

  const { _id, cliente:{nombre, apellido}, pedido, total} = detallePedido;

  const eliminarPedido = id => {
    Swal.fire({
      title: 'Estas seguro?',
      text: "Un pedido eliminado no se puede recuperar",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then( async (result) => {
      if (result.isConfirmed) {

        const resultado = await clienteAxios.delete(`/pedidos/${id}`,{
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        console.log(resultado);

        if(resultado.status === 200) {
          Swal.fire(
            'Eliminado',
            resultado.data.msg,
            'success'
          );
        } 
      }
    });
  }

  return (
    <li className="pedido">
        <div className="info-pedido">
            <p className="id">ID: {_id}</p>
            <p className="nombre">Cliente: {nombre} {apellido}</p>

            <div className="articulos-pedido">
                <p className="productos">Artículos Pedido: </p>
                <ul>
                  { pedido.map( articulo => (
                  <li key={pedido.i_id+articulo.producto._id}>
                    <p>{articulo.producto.nombre}</p>
                    <p>Precio: {articulo.producto.precio}</p>
                    <p>Cantidad: {articulo.cantidad}</p>
                  </li>
                        ))}
                </ul>
            </div>
            <p className="total">Total: ${total} </p>
        </div>
        <div className="acciones">
            
            <button
            onClick={() => eliminarPedido(_id)}
              type="button" 
              className="btn btn-rojo btn-eliminar">
                <i className="fas fa-times"></i>
                Eliminar Pedido
            </button>
        </div>
    </li>
  )
}

export default Pedido
