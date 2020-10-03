import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios'
import { withRouter } from 'react-router-dom'
import Spinner from '../layout/Spinner';

// importar el context
import { CRMContext } from '../../context/CRMContext';

const EditarProducto = (props) => {

  // Obtener el id del producto
  const { id } = props.match.params;

  // Utilizar valores del context
  const [auth, guardarAuth] = useContext(CRMContext);

  // producto = state
  const [producto, guardarProducto] = useState({
    nombre: '',
    precio: '',
    imagen: ''
  });

  // Extraer los valores del state
  const { nombre, precio, imagen } = producto; 
  
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
  
  // cuando el componente carga
  useEffect(() => {
    // consultar la api
    const consultarAPI = async () => {
      const productoConsulta = await clienteAxios.get(`/productos/${id}`,{
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      guardarProducto(productoConsulta.data);
    }
    consultarAPI();
  }, []);

  // Edita un producto en la bd
  const editarProducto = async e => {
    e.preventDefault();

    // Crear un formdata
    const formData = new FormData();
    formData.append('nombre',producto.nombre);
    formData.append('precio',producto.precio);
    formData.append('imagen',archivo);

    // Almacenarlo en la base de datos
    try {
      const res = await clienteAxios.put(`/productos/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type' : 'multipart/form-data'
        }
      });

      if(res.status === 200) {
        Swal.fire(
          'Editado Correctamente',
          'Producto Editado',
          'success'
        )
      }
      props.history.push('/productos');

    } catch (error) {
        Swal.fire({
          type:'error',
          title: 'Hubo un error',
          text: 'Vuelva a intentarlo'
        })
    }
  }
  
  

  // si el state esta como false
  if (!auth.auth) {
    props.history.push('/iniciar-sesion');
  }
  
  
  
  return (
    <>
      <h2>Editar Producto</h2>
      <form
        onSubmit={editarProducto}
      >
          <legend>Llena todos los campos</legend>

          <div className="campo">
              <label>Nombre:</label>
              <input
                type="text"
                placeholder="Nombre Producto"
                name="nombre"
                defaultValue={nombre}
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
                defaultValue={precio}
                onChange={leerInformacionProducto}
              />
          </div>
      
          <div className="campo">
              <label>Imagen:</label>
              { imagen ? 
                <img 
                  src={`${process.env.REACT_APP_BACKEND_URL}/${imagen}`} 
                  alt={nombre}
                  width="200"
                />: null}
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
                value="Editar Producto"
              />
          </div>
      </form>
    </>
  )
}

export default withRouter(EditarProducto)
