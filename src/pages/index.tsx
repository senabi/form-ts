import type { NextPage } from "next";
import Head from "next/head";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const formValidator = z.object({
  nombreEmpresa: z.string().min(1, { message: "Nombre de empresa requerido" }),
  tipoEmpresa: z.string().min(1, { message: "Tipo de empresa requerido" }),
  flujo: z.string().min(1, { message: "Flujo de empresa requerido" }),
  autoRespuesta: z.string().optional(),
});

type FormType = z.infer<typeof formValidator>;

const FlujoOptions: React.FC<{ tipoEmpresa: string }> = ({ tipoEmpresa }) => {
  switch (tipoEmpresa) {
    case "Delivery":
      return (
        <>
          <option>Completo</option>
          <option>Responde y Atiende</option>
          <option>Atiende</option>
        </>
      );
    case "Social Listening":
    case "Mensajeria":
      return (
        <>
          <option>Clasifica y responde</option>
          <option>Responde</option>
        </>
      );
    default:
      return <></>;
  }
};

const AutoRespuestaOptions: React.FC<{ flujo: string }> = ({ flujo }) => {
  switch (flujo) {
    case "Responde y Atiende":
      return (
        <>
          <option>Deshabilitado</option>
          <option>Pedir datos y derivar</option>
          <option>Manejo automático</option>
        </>
      );
    case "Responde":
      return (
        <>
          <option>Deshabilitado</option>
          <option>Clasificación automática</option>
        </>
      );
    default:
      return <></>;
  }
};

const CreateForm = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(formValidator),
  });

  return (
    <form
      onSubmit={handleSubmit(data => {
        console.log(data);
      })}
      className="flex justify-center items-start p-4 flex-col bg-gray-800 rounded-lg gap-4 text-lg w-full md:w-1/2"
    >
      <div className="w-full">
        <p className="text-sm font-medium pb-2">Nombre Empresa</p>
        <Tippy
          content={
            <div className="min-w-[1rem] min-h-[1rem]">
              {errors.nombreEmpresa?.message}
            </div>
          }
          visible={errors.nombreEmpresa ? true : false}
          placement="top"
          theme="error"
        >
          <input
            {...register("nombreEmpresa")}
            type="text"
            placeholder="Nombre Empresa"
            className="border text-base rounded-lg outline-none block w-full p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
          />
        </Tippy>
      </div>
      <div className="w-full">
        <p className="text-sm font-medium pb-2">Tipo de empresa</p>
        <Tippy
          content={
            <div className="min-w-[1rem] min-h-[1rem]">
              {errors.tipoEmpresa?.message}
            </div>
          }
          visible={errors.tipoEmpresa ? true : false}
          placement="top"
          theme="error"
        >
          <select
            {...register("tipoEmpresa")}
            className="w-full border text-base rounded-lg outline-none p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" />
            <option>Delivery</option>
            <option>Social Listening</option>
            <option>Mensajeria</option>
          </select>
        </Tippy>
      </div>
      <div className="w-full">
        <p className="text-sm font-medium pb-2">Flujo de empresa</p>
        <Tippy
          content={
            <div className="min-w-[1rem] min-h-[1rem]">
              {errors.flujo?.message}
            </div>
          }
          visible={errors.flujo ? true : false}
          placement="top"
          theme="error"
        >
          <select
            {...register("flujo")}
            className="w-full border text-base rounded-lg outline-none p-1.5 bg-gray-700 focus:bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" />
            <FlujoOptions tipoEmpresa={watch("tipoEmpresa")} />
          </select>
        </Tippy>
      </div>
      {watch("flujo") !== "Completo" &&
        watch("flujo") !== "Clasifica y responde" && (
          <div className="w-full">
            <p className="text-sm font-medium pb-2">
              Seleccione Auto Respuesta
            </p>
            <select
              {...register("autoRespuesta")}
              className="w-full border text-base rounded-lg outline-none p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" />
              <AutoRespuestaOptions flujo={watch("flujo")} />
            </select>
          </div>
        )}
      <button
        type="submit"
        className="focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
      >
        Enviar
      </button>
    </form>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Formulario</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        <CreateForm />
      </main>
    </>
  );
};

export default Home;
