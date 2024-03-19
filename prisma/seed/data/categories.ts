import { $Enums, Prisma, PrismaClient } from "@prisma/client";

const CATEGORIES = [
  {
    type: $Enums.TransactionType.INCOME,
    categories: [
      {
        name: "Beneficios Gubernamentales",
        subcategories: [
          "Asistencia social",
          "Beneficios por incapacidad",
          "Compensacion por desempleo",
        ],
      },
      {
        name: "Empleo Primario",
        subcategories: [
          "Bonos y Comisiones",
          "Propinas y gratificaciones",
          "Salario",
        ],
      },
      {
        name: "Ingresos de alquiler",
        subcategories: [
          "Alquiler de inmuebles",
          "Arrendamiento de equipo o vehiculo",
        ],
      },
      {
        name: "Ingresos de Inversion",
        subcategories: ["Dividendos", "Ganancias de capital", "Intereses"],
      },
      {
        name: "Ingreso de jubilacion",
        subcategories: ["Pensiones", "Seguro social"],
      },
      {
        name: "Ingresos Diversos",
        subcategories: [
          "Ganancias de loteria o apuestas",
          "Ventas de articulos personales",
        ],
      },
      {
        name: "Otros ingresos",
        subcategories: [
          "Becas y subvenciones",
          "Herencia",
          "Obsequios",
          "Pension alimenticia o manutencion infantil",
        ],
      },
      {
        name: "Reembolsos",
        subcategories: ["Reembolsos de gastos", "Reembolsos de seguro"],
      },
      {
        name: "Trabajo Independiente",
        subcategories: ["Ingresos comerciales", "Trabajo por contrato"],
      },
    ],
  },
  {
    type: $Enums.TransactionType.EXPENSE,
    categories: [
      {
        name: "Ahorros e inversiones",
        subcategories: [
          "Acciones y bonos",
          "Ahorros para educacion",
          "Depositos de cuentas de ahorro",
          "Dispositivos y Articulos Crypto",
          "Divisas Crypto",
          "Fondo de emergencia",
          "Fondo de Jubilacion",
        ],
      },
      {
        name: "Alimentos",
        subcategories: [
          "Alcohol y bebidas",
          "Comida para llevar y domicilios",
          "Mercado de alimentos",
          "Otros Alimentos",
          "Salidas a Comer",
        ],
      },
      {
        name: "Alojamiento",
        subcategories: [
          "Alquiler de inmueble",
          "Hipoteca",
          "Impuestos de Hogar o Renta",
          "Mantenimiento y Reparaciones",
          "Mejoras para el hogar",
          "Muebles y Electrodomesticos",
        ],
      },
      {
        name: "Articulos de uso domestico",
        subcategories: [
          "Articulos de cocina",
          "Articulos de papel",
          "Herramientas de mantenimiento del hogar",
          "Productos de limpieza",
        ],
      },
      {
        name: "Cuidado de la salud",
        subcategories: [
          "Articulos de uso intimo",
          "Contribuciones a cuenta de ahorros para salud",
          "Cuidado de la vision",
          "Cuidado dental",
          "Cuidado de la piel",
          "Medicina sin receta",
          "Primas de seguros medicos",
          "Recetas y Medicamentos",
          "Visitas al medico",
        ],
      },
      {
        name: "Cuidado de niños",
        subcategories: ["Guarderia y niñera", "Manutencion de los hijos"],
      },
      {
        name: "Cuidado de mascotas",
        subcategories: [
          "Aseo de mascotas",
          "Atencion veterinaria",
          "Comida y suministros",
          "Entrenamiento",
          "Guarderia y Hospedaje",
          "Juguetes y Entretenimiento",
          "Licencias para mascotas",
          "Otros Gastos de mascotas",
          "Seguro para mascotas",
        ],
      },
      {
        name: "Deportes y Fitness",
        subcategories: [
          "Clases de fitness",
          "Entrenamiento personal (costos asociados a la contratacion de un entrenador personal)",
          "Equipamiento del hogar",
          "Equipamiento deportivo",
          "Membresia de Gimnasio",
          "Ropa y Calzado",
          "Suplementos nutricionales",
          "Tarifas de equipos deportivos",
          "Tarifas de inscripcion a eventos",
        ],
      },
      {
        name: "Educacion",
        subcategories: [
          "Cuotas de organizacion estudiantil",
          "Diplomados y Cursos",
          "Educacion continua",
          "Fotocopias y Articulos Impresos",
          "Libros y materiales",
          "Matricula y cuotas",
          "Suministros escolares",
        ],
      },
      {
        name: "Entretenimiento",
        subcategories: [
          "Cine y Teatro",
          "Conciertos y Eventos en vivo",
          "Eventos sociales",
          "Juegos y juguetes",
          "Pasatiempos y manualidades",
          "Subscripciones (servicios de streaming, revistas)",
        ],
      },
      {
        name: "Gastos de Trabajo",
        subcategories: [
          "Contribuciones a Salud y Pension",
          "Educacion y Entrenamiento",
          "Equipos de salud y seguridad",
          "Gastos de comunicacion",
          "Gastos de viaje",
          "Gastos vehiculares",
          "Herramientas profesionales y equipos",
          "Impuesto sobre la renta",
          "Licencias y permisos",
          "Mantenimiento y reparaciones de equipo de trabajo",
          "Muebleria relacionada al trabajo",
          "Publicidad y Mercadeo",
          "Renta de oficina y gastos relacionados",
          "Seguro de negocio",
          "Servicios Legales y Profesionales",
          "Subscripciones y membresias",
          "Suministros y equipos",
          "Technologia y Electronicos",
          "Utilidades para el trabajo",
        ],
      },
      {
        name: "Gastos Financieros",
        subcategories: [
          "Cambio de divisas",
          "Comisiones bancarias",
          "Cuotas de Manejo",
          "Franqueo y envio (remesas)",
          "Transferencias Internas",
        ],
      },
      {
        name: "Miscelaneos",
        subcategories: [
          "Compras Unicas",
          "Gastos imprevistos",
          "Gastos Impulsivos",
          "Otros Gastos",
          "Retiros en Efectivo",
        ],
      },
      {
        name: "Pagos de deuda",
        subcategories: [
          "Otros Prestamos",
          "Pagos de tarjeta de credito",
          "Prestamos estudiantiles",
          "Prestamos personales",
        ],
      },
      {
        name: "Regalos y Donaciones",
        subcategories: [
          "Bodas y ocaciones especiales",
          "Donaciones de caridad",
          "Regalos de cumpleaños y dias festivos",
          "Soporte Financiero",
        ],
      },
      {
        name: "Ropa y cuidado personal",
        subcategories: [
          "Articulos de aseo personal",
          "Cortes de pelo y aseo",
          "Cosmeticos y articulos de belleza",
          "Cuidado de la piel",
          "Lavanderia y tintoreria",
          "Ropas y zapatos",
        ],
      },
      {
        name: "Seguros",
        subcategories: [
          "Otros seguros",
          "Seguro de auto",
          "Seguro de hogar",
          "Seguro de incapacidad",
          "Seguro de salud",
          "Seguro de vida",
        ],
      },
      {
        name: "Servicios Profesionales",
        subcategories: [
          "Honorarios Legales",
          "Preparacion de contabilidad y impuestos",
          "Servicios de consultoria",
        ],
      },
      {
        name: "Tecnologia y Servicios Digitales",
        subcategories: [
          "Alojamiento web y dominios",
          "Compras de aplicaciones",
          "Hardware y dispositivos (telefonos, computadoras)",
          "Suscripcion de software (almacenamiento en la nuve, administrador de contraseñas)",
        ],
      },
      {
        name: "Transporte",
        subcategories: [
          "Cumbustible",
          "Mantenimiento y reparacion de vehiculo",
          "Pago de coche",
          "Registro y licencia",
          "Tarifas de estacionamiento",
          "Taxis y viajes compartidos",
          "Transporte publico",
        ],
      },
      {
        name: "Utilidades",
        subcategories: [
          "Agua y Alcantarillado",
          "Electricidad",
          "Eliminacion de Residuos",
          "Gas",
          "Internet",
          "Telefonia Fija",
          "Telefonia Movil",
          "Television",
        ],
      },
      {
        name: "Viajes",
        subcategories: [
          "Alojamientos",
          "Alquiler de coches",
          "Excursiones y Actividades",
          "Gastos de vacaciones",
          "Pasaje aereo",
          "Pasaje flota",
          "Seguro de viaje",
          "Souvenires",
        ],
      },
    ],
  },
  {
    type: $Enums.TransactionType.ADJUSTMENT,
    categories: [
      {
        name: "Ajustes",
        subcategories: ["Ajuste de Billetera", "Balance Inicial"],
      },
    ],
  },
];

const categories: Prisma.CategoriesUpsertArgs[] = [];
for (const transactionType of CATEGORIES) {
  for (const category of transactionType.categories) {
    const subcategories = [];
    for (const subcategory of category.subcategories) {
      subcategories.push({ name: subcategory });
    }

    categories.push({
      where: { name: category.name },
      create: {
        type: transactionType.type,
        name: category.name,
        subcategories: {
          createMany: {
            data: subcategories,
          },
        },
      },
      update: {
        name: category.name,
        subcategories: {},
      },
    });
  }
}

export const seedCategories = async (prismaClient: PrismaClient) => {
  const { categoriesCount, subcategoriesCount } =
    await prismaClient.$transaction(
      async (tx) => {
        for (const transactionType of CATEGORIES) {
          for (const category of transactionType.categories) {
            const subcategories = [];
            for (const subcategory of category.subcategories) {
              subcategories.push({ name: subcategory });
            }
            const categoryResult = await tx.categories.upsert({
              where: { name: category.name },
              create: {
                type: transactionType.type,
                name: category.name,
              },
              update: {
                name: category.name,
              },
            });

            console.log(
              categoryResult.id,
              transactionType.type,
              categoryResult.name
            );

            for (const subcategory of subcategories) {
              const subcategoryResult = await tx.subcategories.upsert({
                where: {
                  categoryId_name: {
                    categoryId: categoryResult.id,
                    name: subcategory.name,
                  },
                },
                create: {
                  name: subcategory.name,
                  category: {
                    connect: {
                      id: categoryResult.id,
                    },
                  },
                },
                update: {
                  name: subcategory.name,
                },
              });

              console.log(
                subcategoryResult.id,
                transactionType.type,
                categoryResult.name,
                subcategoryResult.name
              );
            }
          }
        }

        const categoriesCount = await tx.categories.count();
        const subcategoriesCount = await tx.subcategories.count();

        return {
          categoriesCount,
          subcategoriesCount,
        };
      },
      {
        maxWait: 5000, // default: 2000
        timeout: 120000, // default: 5000
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
      }
    );

  console.log(
    `${categoriesCount} Categories and ${subcategoriesCount} Subcategories have been created.`
  );

  return;
};
