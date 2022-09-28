import type { NextPage } from "next";
import Head from "next/head";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrorsImpl, useForm } from "react-hook-form";
import React from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const formValidator = z.object({
  nombreEmpresa: z.string().min(1, { message: "Nombre de empresa requerido" }),
  tipoEmpresa: z.string().min(1, { message: "Tipo de empresa requerido" }),
  flujo: z.string().min(1, { message: "Flujo de empresa requerido" }),
  autoRespuesta: z
    .string()
    .optional()
    .refine(s => {
      if (s === undefined) return true;
      return s.length > 1;
    }, "Auto respuesta requerida"),
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

const formInputClassName =
  "w-full border text-base rounded-lg outline-none p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500";

type FormInputType = {
  errors: FieldErrorsImpl<FormType>;
  input: keyof FormType;
  children: React.ReactElement;
  label: string;
};
const FormInput: React.FC<FormInputType> = ({
  errors,
  input,
  children,
  label,
}) => {
  return (
    <div className={`w-full`}>
      <p className="text-sm font-medium pb-2">{label}</p>
      <Tippy
        content={
          <div className="min-w-[1rem] min-h-[1rem]">
            {errors[input]?.message}
          </div>
        }
        visible={errors[input] ? true : false}
        placement="top"
        theme="error"
      >
        {children}
      </Tippy>
    </div>
  );
};

const FormContent = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(formValidator),
    defaultValues: {
      autoRespuesta: undefined,
      flujo: "",
    },
  });

  const flujo = watch("flujo");

  React.useEffect(() => {
    if (
      (flujo && flujo === "Completo") ||
      flujo === "Clasifica y responde" ||
      flujo === "Atiende"
    ) {
      setValue("autoRespuesta", undefined);
    }
  }, [flujo]);

  return (
    <form
      onSubmit={handleSubmit(data => {
        alert(
          "nombre: " +
            data.nombreEmpresa +
            "\n" +
            "tipo: " +
            data.tipoEmpresa +
            "\n" +
            "flujo: " +
            data.flujo +
            "\n" +
            "autoRespuesta: " +
            data.autoRespuesta
        );
        console.log(data);
      })}
      className="flex justify-center items-start p-4 flex-col bg-gray-800 rounded-lg gap-4 text-lg w-full md:w-1/2"
    >
      <FormInput errors={errors} input="nombreEmpresa" label="Nombre Empresa">
        <input
          {...register("nombreEmpresa")}
          type="text"
          placeholder="Nombre Empresa"
          className={formInputClassName}
        />
      </FormInput>
      <FormInput errors={errors} input="tipoEmpresa" label="Tipo de empresa">
        <select {...register("tipoEmpresa")} className={formInputClassName}>
          <option value="" />
          <option>Delivery</option>
          <option>Social Listening</option>
          <option>Mensajeria</option>
        </select>
      </FormInput>
      <FormInput errors={errors} input="flujo" label="Flujo de empresa">
        <select {...register("flujo")} className={formInputClassName}>
          <option value="" />
          <FlujoOptions tipoEmpresa={watch("tipoEmpresa")} />
        </select>
      </FormInput>
      {flujo &&
        flujo !== "Completo" &&
        flujo !== "Clasifica y responde" &&
        flujo !== "Atiende" && (
          <FormInput
            errors={errors}
            input="autoRespuesta"
            label="Auto Respuesta"
          >
            <select
              {...register("autoRespuesta")}
              className={formInputClassName}
            >
              <option value="" />
              <AutoRespuestaOptions flujo={watch("flujo")} />
            </select>
          </FormInput>
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
        <meta name="description" content="Formulario" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        <FormContent />
      </main>
    </>
  );
};

export default Home;
