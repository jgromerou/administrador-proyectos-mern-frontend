import { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProyectosContext = createContext();

const ProyectosProvider = ({ children }) => {
  const [proyectos, setProyectos] = useState([]);
  const [alerta, setAlerta] = useState({});
  const [proyecto, setProyecto] = useState({});
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const obtenerProyectos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios(
          `${import.meta.env.VITE_BACKEND_URL}/proyectos`,
          config
        );
        setProyectos(data);
      } catch (error) {
        console.log(error);
      }
    };
    obtenerProyectos();
  }, []);

  const mostrarAlerta = (alerta) => {
    setAlerta(alerta);

    setTimeout(() => {
      setAlerta({});
    }, 3000);
  };

  const submitProyecto = async (proyecto) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/proyectos`,
        proyecto,
        config
      );

      setProyectos([...proyectos, data]);

      setAlerta({
        msg: 'Proyecto creado correctamente',
        error: false,
      });

      setTimeout(() => {
        setAlerta({});
        navigate('/proyectos');
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerProyecto = async (id) => {
    setCargando(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios(
        `${import.meta.env.VITE_BACKEND_URL}/proyectos/${id}`,
        config
      );
      setProyecto(data);
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <ProyectosContext.Provider
      value={{
        proyectos,
        alerta,
        mostrarAlerta,
        submitProyecto,
        obtenerProyecto,
        proyecto,
        cargando,
      }}
    >
      {children}
    </ProyectosContext.Provider>
  );
};

export { ProyectosProvider };

export default ProyectosContext;
