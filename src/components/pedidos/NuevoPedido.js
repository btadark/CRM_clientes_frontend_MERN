import React, { useContext, useEffect, useState } from 'react';
import clienteAxios from '../../config/axios';
import FormBuscarProducto from './FormBuscarProducto';
import Swal from 'sweetalert2';
import FormCantidadProducto from './FormCantidadProducto';
import {withRouter} from 'react-router-dom';

// importar el context
import { CRMContext } from '../../context/CRMContext';

const NuevoPedido = (props) => {

  // Utilizar valores del context
  const [auth, guardarAuth] = useContext(CRMContext);

   // Extraer id de cliente
  const { id } = props.match.params;

  // state
  const [cliente, guardarCliente ] = useState({});
  const [busqueda, guardarBusqueda] = useState('');
  const [productos, guardarProductos] = useState([]);
  const [total, guardarTotal] = useState(0);

  useEffect(() => {
    // obtener el cliente
    const consultarAPI = async() => {
      // consultar el cliente actual
      const resultado = await clienteAxios.get(`/clientes/${id}`,{
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      guardarCliente(resultado.data);
    }

    consultarAPI();
    // actualizar el total a pagar
    actualizarTotal();
    
  }, [productos]);

  const buscarProducto = async e => {
    e.preventDefault();

    //Obtener los productos de la busqueda
    const resultadoBusqueda = await clienteAxios.post(`/productos/busqueda/${busqueda}`);

    // Si no hay resultados una alerta
    if(resultadoBusqueda.data[0]) {
      
      let productoResultado = resultadoBusqueda.data[0];
      // agregar la llave "producto"
      productoResultado.producto = resultadoBusqueda.data[0]._id;
      productoResultado.cantidad = 0;


      // ponerlo en el state
      guardarProductos([...productos, productoResultado]);

    } else {
      Swal.fire({
        icon: 'error',
        title: 'No hay resultados'
      })
    }
  }
  
  // almacenar una busqueda en el state
  const leerDatosBusqueda = e => {
    guardarBusqueda(e.target.value);
  }

  // actualizar cantidad de productos
  const restarProductos = i => {
    // copiar el arreglo original
    const todosProductos = [...productos];

    // validar si esta en 0 no puede ir mas alla
    if(todosProductos[i].cantidad === 0 ) return;

    // decremento
    todosProductos[i].cantidad--;

    // almacenarlo en el state
    guardarProductos(todosProductos);
  }

  const aumentarProductos = i => {
    // copiar el arreglo original
    const todosProductos = [...productos];

    // incremento
    todosProductos[i].cantidad++;

    // almacenarlo en el state
    guardarProductos(todosProductos);
  };

  // Elimina un producto delstate
  const eliminarProductoPedido = id => {
    const todosProductos = productos.filter(producto => producto.producto !== id);

    guardarProductos(todosProductos);
  }

  // Actualizar el total a pagar
  const actualizarTotal = () => {
    // Si el arreglo de productos es igual a 0: el total es 0
    if(productos.length === 0) {
      guardarTotal(0);
      return;
    }

    // calcular el nuevo total
    let nuevoTotal = 0;

    // Recorrer todos los productos, sus cantidades y precios
    productos.map(producto => nuevoTotal += (producto.cantidad * producto.precio));

    // Almacenar total
    guardarTotal(nuevoTotal);

  }

  //Alamacena el pedido a la BD
  const realizarPedido = async e=> {
    e.preventDefault();

    // Extraer el id
    const { id } = props.match.params;

    // Construir el objeto
    const pedido = {
      cliente: id,
      pedido: productos,
      total
    }

    // Almacenarlo en la BD
    const resultado = await clienteAxios.post(`/pedidos/nuevo/${id}`, pedido,{
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    });

    if(resultado.status === 200) {

      Swal.fire(
        'Correcto',
        resultado.data.msg,
        'success'
      )
  
    } else {
        Swal.fire({
          icon: 'error',
          title: 'No hay resultados',
          text: 'Vuelva a intentarlo'
        })
    }

    // redireccionar
    props.history.push('/pedidos');

  }

  // Verificar si no esta autenticado o no
  if(!auth.auth && (localStorage.getItem('token') === auth.token)) {
    props.history.push('/iniciar-sesion');
  }

  return (
    <>
      <h2>Nuevo Pedido</h2>
      <div className="ficha-cliente">
          <h3>Datos de Cliente</h3>
          <p>Nombre: {cliente.nombre} {cliente.apellido}</p>
          <p>Telefono: {cliente.telefono}</p>
      </div>


      <FormBuscarProducto
        buscarProducto={buscarProducto}
        leerDatosBusqueda={leerDatosBusqueda}
      />

      <ul className="resumen">
        { productos.map( (producto,index) => (
          <FormCantidadProducto 
            key={producto.producto}
            producto={producto}
            restarProductos={restarProductos}
            aumentarProductos={aumentarProductos}
            eliminarProductoPedido={eliminarProductoPedido}
            index={index}
          />
        ))}
      </ul>
      
      <p className="total">Total a Pagar <span>$ {total}</span></p>

      { total > 0
        ? 
        <form
          onSubmit={realizarPedido}
        >
          <input
            type="submit"
            className="btn btn-verde btn-block"
            value="Realizar Pedido" 
          />
        </form>
        : null
      }
    </>
  )

}

export default withRouter(NuevoPedido)
