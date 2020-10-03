import React, { useContext, useState } from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { withRouter } from 'react-router-dom';

// importar el context
import { CRMContext } from '../../context/CRMContext';

const NuevoProducto = ({history}) => {

   // Utilizar valores del context
   const [auth, guardarAuth] = useContext(CRMContext);

  // Producto State
  const [producto, guardarProducto] = useState({
    nombre: '',
    precio: ''
  });

  // Archivo imagen
  const [archivo, guardarAchivo] = useState('');

  // Leer datos del formulario
  const leerInformacionProducto = e => {
    guardarProducto({
      ...producto,
      [e.target.name] : e.target.value
    })
  }

  // Coloca la imagen del state
  const leerArchivo = e => {
    guardarAchivo(e.target.files[0]);
  }

  // Almacena nuevo producto en la base de datos
  const agregarProducto = async e => {
    e.preventDefault();

    // Crear un formdata
    const formData = new FormData();
    formData.append('nombre',producto.nombre);
    formData.append('precio',producto.precio);
    formData.append('imagen',archivo);

    // Almacenarlo en la base de datos
    try {
      const res = await clienteAxios.post('/productos', formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type' : 'multipart/form-data'
        }
      });

      if(res.status === 200) {
        Swal.fire(
          'Agregado Correctamente',
          res.data.msg,
          'success'
        )
      }
      history.push('/productos');

    } catch (error) {
        Swal.fire({
          type:'error',
          title: 'Hubo un error',
          text: 'Vuelva a intentarlo'
        })
    }
  }

  // Validar el formulario
  const validarCliente = () => {
   
    const {nombre,precio} = producto;
    
    // Revisar
    let valido = !nombre.length || !precio.length;
    return valido;
  };

  // Verificar si no esta autenticado o no

  if(!auth.auth && (localStorage.getItem('token') === auth.token)) {
    history.push('/iniciar-sesion');
  }

  return (
    <>
      <h2>Nuevo Producto</h2>

      <form
        onSubmit={agregarProducto}
      >
          <legend>Llena todos los campos</legend>

          <div className="campo">
              <label>Nombre:</label>
              <input
                type="text"
                placeholder="Nombre Producto"
                name="nombre"
                onChange={leerInformacionProducto}
              />
          </div>

          <div className="campo">
              <label>Precio:</label>
              <input 
                type="number"
                name="precio"
                min="0.00"
                step="0.01"
                placeholder="Precio"
                onChange={leerInformacionProducto}
              />
          </div>
      
          <div className="campo">
              <label>Imagen:</label>
              <input
                type="file"
                name="imagen"
                onChange={leerArchivo}
              />
          </div>

          <div className="enviar">
              <input
                type="submit"
                className="btn btn-azul"
                value="Agregar Producto"
                disabled={validarCliente()}
              />
          </div>
      </form>
    </>
  )
}

export default withRouter(NuevoProducto)
