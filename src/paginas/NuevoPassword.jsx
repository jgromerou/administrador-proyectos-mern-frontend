import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Alerta from '../components/Alerta';

const NuevoPassword = () => {
  const [tokenValido, setTokenValido] = useState(false);
  const [alerta, setAlerta] = useState({});
  const [password, setPassword] = useState('');
  const [passwordModificado, setPasswordModificado] = useState(false);

  const params = useParams();
  const { token } = params;

  useEffect(() => {
    const comprobarToken = async () => {
      try {
        await axios(
          `${
            //TODO: Mover hacia un cliente axios
            import.meta.env.VITE_BACKEND_URL
          }/usuarios/olvide-password/${token}`
        );
        setTokenValido(true);
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true,
        });
      }
    };
    comprobarToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 4) {
      setAlerta({
        msg: 'El Password debe ser mínimo de 4 caracteres',
        error: true,
      });
      return;
    }

    try {
      const url = `${
        import.meta.env.VITE_BACKEND_URL
      }/usuarios/olvide-password/${token}`;
      const { data } = await axios.post(url, { password });
      setAlerta({
        msg: data.msg,
        error: false,
      });
      setPasswordModificado(true);
    } catch (error) {
      setAlerta({
        msg: error.message.data.msg,
        error: true,
      });
    }
  };

  const { msg } = alerta;

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Reestablece tu Password y no pierdas acceso a tus{''}
        <span className="text-slate-700">proyectos</span>
      </h1>

      {msg && <Alerta alerta={alerta} />}

      {tokenValido && (
        <form
          className="my-10 bg-white shadow rounded-lg p-10"
          onSubmit={handleSubmit}
        >
          <div className="my-5">
            <label
              className="uppercase text-gray-600 block text-xl font-bold"
              htmlFor="password"
            >
              Nuevo Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Escribe tu nuevo Password"
              className="w-full my-3 p-3 border rounded-xl bg-gray-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/*  <div className="my-5">
      <label
        className="uppercase text-gray-600 block text-xl font-bold"
        htmlFor="password2"
      >
        Repetir Password
      </label>
      <input
        id="password2"
        type="password"
        placeholder="Repetir tu Password"
        className="w-full my-3 p-3 border rounded-xl bg-gray-50"
      />
    </div> */}
          <input
            type="submit"
            value="Guardar Nuevo Password"
            className="bg-sky-700 w-full mb-5 py-3 text-white uppercase font-bold rounded-xl hover:cursor-pointer hover:bg-sky-800 transition-colors"
          />
        </form>
      )}

      {passwordModificado && (
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/"
        >
          Inicia Sesión
        </Link>
      )}
    </>
  );
};

export default NuevoPassword;
