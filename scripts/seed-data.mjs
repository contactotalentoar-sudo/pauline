// Datos compartidos: menú, modificadores, salones y mesas de Pauline.

const BLENDS = [
  "Blend Pauline",
  "Royal Fruit",
  "Vanilla's Secret",
  "English Breakfast",
  "Green Berry",
  "Calm",
];

// ---------- GRUPOS DE MODIFICADORES ----------
export const GRUPOS = {
  acompanamiento: {
    nombre: "Acompañamiento",
    obligatorio: true,
    seleccion_multiple: false,
    opciones: ["Papas", "Batata", "Mix de verdes", "Ensalada"],
  },
  infusion_x2: {
    nombre: "Infusión",
    obligatorio: true,
    seleccion_multiple: true,
    max_selecciones: 2,
    opciones: BLENDS,
  },
  infusion_brunch: {
    nombre: "Infusión",
    obligatorio: true,
    seleccion_multiple: false,
    opciones: BLENDS,
  },
  bebida_naranja_limonada: {
    nombre: "Bebida",
    obligatorio: true,
    seleccion_multiple: false,
    opciones: ["Jugo de naranja", "Limonada"],
  },
  blend_te: {
    nombre: "Blend",
    obligatorio: true,
    seleccion_multiple: false,
    opciones: BLENDS,
  },
  relleno_croissant_dulce: {
    nombre: "Relleno",
    obligatorio: true,
    seleccion_multiple: false,
    opciones: ["Crema pastelera", "Nutella", "Almendras"],
  },
  relleno_flat_croissant: {
    nombre: "Relleno",
    obligatorio: true,
    seleccion_multiple: false,
    opciones: ["Nutella", "Pistacho"],
  },
  sabor_ny_roll: {
    nombre: "Sabor",
    obligatorio: true,
    seleccion_multiple: false,
    opciones: ["Manzana y canela", "Pistachos", "Nutella"],
  },
  relleno_eclair: {
    nombre: "Relleno",
    obligatorio: true,
    seleccion_multiple: false,
    opciones: ["Crema pastelera", "Mousse de chocolate"],
  },
  sabor_macaron: {
    nombre: "Sabor",
    obligatorio: true,
    seleccion_multiple: false,
    opciones: [
      "Arándanos",
      "Maracuyá",
      "Chocolate",
      "Frutilla",
      "Pistacho",
      "Frambuesa",
      "Salted Caramel",
      "Chocolate blanco",
      "Menta y chocolate",
      "Chocolate con Nutella",
    ],
  },
  bebida_ejecutivo: {
    nombre: "Bebida",
    obligatorio: true,
    seleccion_multiple: false,
    opciones: ["Gaseosa", "Agua", "Jugo de naranja", "Limonada"],
  },
  cafe_o_postre: {
    nombre: "Café o Postre",
    obligatorio: true,
    seleccion_multiple: false,
    opciones: [
      "Café cortado",
      "Café con leche",
      "Café lágrima",
      "Café restreto",
      "Cheesecake de frutos rojos",
      "Chocotorta",
      "Manzana con crumble",
      "Key lime pie",
    ],
  },
  plato_dia: {
    nombre: "Plato del día",
    obligatorio: true,
    seleccion_multiple: false,
    opciones: [
      "Lunes: Milanesa con papas o ensalada",
      "Lunes: Ensalada Caesar con pollo",
      "Martes: Pechuguita grillada con guarnición",
      "Martes: Veggie sandwich con acompañamiento",
      "Miércoles: Croque Monsieur con papas",
      "Miércoles: Ensalada Blue Cheese",
      "Jueves: Tarta de zapallitos con acompañamiento",
      "Jueves: Ensalada Crispy Bacon",
      "Viernes: Milanesa napolitana con papas",
      "Viernes: Le Brie sandwich con acompañamiento",
    ],
  },
  bebida_infantil: {
    nombre: "Bebida",
    obligatorio: true,
    seleccion_multiple: false,
    opciones: ["Gaseosa", "Jugo de naranja", "Agua"],
  },
  postre_infantil: {
    nombre: "Postre",
    obligatorio: true,
    seleccion_multiple: false,
    opciones: ["Helado", "Flan", "Gelatina"],
  },
  plato_infantil: {
    nombre: "Plato",
    obligatorio: true,
    seleccion_multiple: false,
    opciones: ["Milanesa con papas fritas", "Nuggets con papas fritas"],
  },
  relleno_che_chipa: {
    nombre: "Relleno",
    obligatorio: true,
    seleccion_multiple: false,
    opciones: ["Jamón y queso", "Caprese", "Lomito y cheddar"],
  },
  relleno_tostado: {
    nombre: "Relleno",
    obligatorio: true,
    seleccion_multiple: false,
    opciones: ["Jamón y queso", "Caprese", "Lomito ahumado y cheddar"],
  },
  viennoiserie_brunch: {
    nombre: "Viennoiserie",
    obligatorio: true,
    seleccion_multiple: false,
    opciones: ["Croissant", "Pain au chocolat"],
  },
  sabor_milkshake: {
    nombre: "Sabor",
    obligatorio: true,
    seleccion_multiple: false,
    opciones: ["Dulce de leche", "Chocolate", "Frutilla", "Oreo"],
  },
};

// ---------- CATEGORÍAS Y PRODUCTOS ----------
export const CATEGORIAS = [
  {
    nombre: "Alfajores",
    productos: [
      { nombre: "Alfajor maicena", precio: 5300 },
      { nombre: "Alfajor almendras", precio: 6900 },
      { nombre: "Alfajor pistacho y frambuesa", precio: 6900 },
      { nombre: "Alfajor Mar del Plata", precio: 6900 },
      { nombre: "Alfajor chocolatoso", precio: 6900 },
      { nombre: "Alfajor vegano", precio: 6900 },
      { nombre: "Alfajor macaron pistacho", precio: 10000 },
      { nombre: "Alfajor macaron frambuesa", precio: 10000 },
    ],
  },
  {
    nombre: "Porciones de torta",
    productos: [
      { nombre: "Rogel", precio: 13000 },
      { nombre: "Carrot cake", precio: 15000 },
      { nombre: "Red velvet", precio: 16000 },
      { nombre: "Cheesecake de pistachos", precio: 16000 },
      { nombre: "Pistacho velvet", precio: 16000 },
      { nombre: "Tiramisu de pistacho", precio: 16000 },
      { nombre: "Chocolate y naranja (vegana)", precio: 14000 },
      { nombre: "Oreo y pistacho", precio: 18000 },
      { nombre: "Matilda", precio: 18000 },
      { nombre: "Kinder Bueno", precio: 18000 },
      { nombre: "Tartaleta de frutillas", precio: 13000 },
      { nombre: "Tartaleta de lemon pie", precio: 12000 },
    ],
  },
  {
    nombre: "Cuadrados dulces",
    productos: [
      { nombre: "Brownie", precio: 7500 },
      { nombre: "Budin de limón", precio: 7500 },
      { nombre: "Ricota y glasé de limón", precio: 11000 },
      { nombre: "Manzana con crumble", precio: 11000 },
      { nombre: "Key lime pie", precio: 12000 },
      { nombre: "Tiramisú", precio: 12000 },
      { nombre: "Chocotorta", precio: 13000 },
      { nombre: "Cheesecake frutos rojos", precio: 14000 },
      {
        nombre: "Degustación de pastelería",
        descripcion: "4 mini cuadrados",
        precio: 13000,
      },
    ],
  },
  {
    nombre: "Pequeños platos",
    productos: [
      { nombre: "Bowl de frutas", precio: 6500 },
      { nombre: "Granola Parfait", precio: 10500 },
      { nombre: "Huevos revueltos", precio: 8500 },
      { nombre: "Tostadas con dips", precio: 8700 },
      { nombre: "Tostadas Keto", precio: 5800 },
    ],
  },
  {
    nombre: "Hora del té",
    productos: [
      {
        nombre: "Hora del té",
        descripcion:
          "Para compartir. Dulce: degustación de pastelería, eclair, macarons, ny cookie. Salado: scon de queso, sándwich de miga, fosforito de jamón y queso, croissant de jamón y queso.",
        precio: 62000,
        grupos: ["infusion_x2", "bebida_naranja_limonada"],
      },
    ],
  },
  {
    nombre: "Boulangerie",
    productos: [
      { nombre: "Facturas surtidas", precio: 1900 },
      { nombre: "Muffin chips de chocolate", precio: 5100 },
      { nombre: "Canelé", precio: 3800 },
      { nombre: "Pain au chocolat", precio: 4000 },
      { nombre: "Croissant", precio: 3900 },
      {
        nombre: "Croissant relleno dulce",
        precio: 8300,
        grupos: ["relleno_croissant_dulce"],
      },
      { nombre: "Super scon de queso", precio: 6700 },
      { nombre: "FLAT croissant", precio: 8300, grupos: ["relleno_flat_croissant"] },
      { nombre: "Roll con chips, vegano", precio: 5100 },
      { nombre: "Cornetto de crema pastelera", precio: 5500 },
      { nombre: "Dona con dulce de leche", precio: 4600 },
      { nombre: "Pan de queso / Chipá", precio: 2500 },
      { nombre: "NY Roll", precio: 7500, grupos: ["sabor_ny_roll"] },
      { nombre: "Eclair", precio: 7900, grupos: ["relleno_eclair"] },
    ],
  },
  {
    nombre: "Macarons",
    productos: [
      { nombre: "Macaron (unidad)", precio: 4700, grupos: ["sabor_macaron"] },
    ],
  },
  {
    nombre: "NY Cookies",
    productos: [
      { nombre: "NY Cookie Mega chocolate", precio: 6400 },
      { nombre: "NY Cookie Choco Oreo", precio: 6400 },
      { nombre: "NY Cookie Red velvet", precio: 6400 },
      { nombre: "NY Cookie Pistacho", precio: 6400 },
      { nombre: "NY Cookie DDL crunch", precio: 6400 },
      { nombre: "NY Cookie Choco nube", precio: 6900 },
      { nombre: "NY Cookie Kinder Bueno", precio: 6900 },
      { nombre: "NY Cookie Ferrero y Nutella", precio: 6900 },
    ],
  },
  {
    nombre: "Menú ejecutivo",
    productos: [
      {
        nombre: "Menú ejecutivo",
        descripcion:
          "Disponible de lunes a viernes, 12 a 15:30 hs, excepto feriados.",
        precio: 17800,
        grupos: ["bebida_ejecutivo", "cafe_o_postre", "plato_dia"],
      },
    ],
  },
  {
    nombre: "Entrepanes",
    productos: [
      {
        nombre: "Argento",
        descripcion:
          "Pan de ciabatta, lomito a la plancha, morrón grillado, panceta, tomate cherry y queso brie.",
        precio: 18900,
        grupos: ["acompanamiento"],
      },
      {
        nombre: "Le brie",
        descripcion:
          "Pan de focaccia, jamón crudo, queso brie, tomates secos y rúcula fresca.",
        precio: 17900,
        grupos: ["acompanamiento"],
      },
      {
        nombre: "Bagel de salmón",
        descripcion:
          "Bagel casero, salmón ahumado, queso crema, alcaparras, rúcula, eneldo y ralladura de limón.",
        precio: 18900,
        grupos: ["acompanamiento"],
      },
      {
        nombre: "Milou",
        descripcion:
          "Pan de focaccia, milanesa, rúcula fresca, tomates secos y mostaza.",
        precio: 17900,
        grupos: ["acompanamiento"],
      },
      {
        nombre: "Atún y alcaparras",
        descripcion:
          "Pan árabe, atún, huevo, aceitunas negras, alcaparras y mayo de limón.",
        precio: 17900,
        grupos: ["acompanamiento"],
      },
      {
        nombre: "La bondio",
        descripcion:
          "Pan de focaccia, bondiola braseada y deshilachada, chutney de tomates y cole slaw.",
        precio: 17900,
        grupos: ["acompanamiento"],
      },
      {
        nombre: "Veggie sandwich",
        descripcion:
          "Pan integral, berenjenas grilladas, queso crema, ciboulette, tomates secos, rúcula y queso brie.",
        precio: 17900,
        grupos: ["acompanamiento"],
      },
    ],
  },
  {
    nombre: "Ensaladas",
    productos: [
      {
        nombre: "Caesar con pollo",
        descripcion:
          "Mix de verdes, pollo, croutones, queso parmesano y aderezo casero.",
        precio: 16500,
      },
      {
        nombre: "Crispy bacon",
        descripcion:
          "Mix de verdes, pollo grillado, panceta crocante, huevo, palta, tomates cherry y honey mustard.",
        precio: 16500,
      },
      {
        nombre: "El salmón",
        descripcion:
          "Salmón ahumado, hojas verdes, palta, alcaparras, parmesano, vinagreta de naranja y limón, almendras y semillas.",
        precio: 18000,
      },
      {
        nombre: "Blue cheese",
        descripcion:
          "Mix de verdes, peras caramelizadas, almendras tostadas, queso azul y semillas, dip de reducción de aceto.",
        precio: 16500,
      },
    ],
  },
  {
    nombre: "Tartas saladas",
    productos: [
      { nombre: "Zapallitos", precio: 13000, grupos: ["acompanamiento"] },
      { nombre: "Quiche Loraine", precio: 13000, grupos: ["acompanamiento"] },
    ],
  },
  {
    nombre: "Menú infantil",
    productos: [
      {
        nombre: "Menú infantil (-12 años)",
        precio: 15000,
        grupos: ["bebida_infantil", "postre_infantil", "plato_infantil"],
      },
    ],
  },
  {
    nombre: "Cafetería",
    productos: [
      { nombre: "Espresso", precio: 3600 },
      { nombre: "Cortado", precio: 3900 },
      { nombre: "Double Espresso", precio: 5300 },
      { nombre: "Latte (café con leche)", precio: 5100 },
      { nombre: "Capuccino", precio: 5500 },
      { nombre: "Capuccino a la italiana", precio: 6100 },
      {
        nombre: "Capuccino Pauline",
        descripcion: "Con dulce de leche y crema.",
        precio: 6500,
      },
      { nombre: "Super Tazón Latte", precio: 6600 },
      { nombre: "Submarino", precio: 5700 },
      { nombre: "Leche chocolatada", precio: 5300 },
    ],
  },
  {
    nombre: "Especiales (café)",
    productos: [
      { nombre: "Mocha Latte", precio: 8600 },
      { nombre: "Caramel Latte", precio: 8600 },
      { nombre: "Vainilla Latte", precio: 8600 },
      { nombre: "Pistacho Latte", precio: 8600 },
      {
        nombre: "Café Bombón",
        descripcion: "Con leche condensada.",
        precio: 8600,
      },
      { nombre: "Café Baileys", precio: 9200 },
    ],
  },
  {
    nombre: "Infusiones",
    productos: [
      { nombre: "Té / Mate cocido", precio: 6400 },
      {
        nombre: "Té en hebras by Tealosophy",
        precio: 3900,
        grupos: ["blend_te"],
      },
    ],
  },
  {
    nombre: "Desayunos y meriendas",
    productos: [
      {
        nombre: "Porteño con medialunas",
        descripcion: "2 medialunas o facturas surtidas.",
        precio: 9500,
        grupos: ["infusion_x2", "bebida_naranja_limonada"],
      },
      {
        nombre: "Porteño con tostadas",
        descripcion: "Queso crema y mermelada.",
        precio: 13500,
        grupos: ["infusion_x2", "bebida_naranja_limonada"],
      },
      {
        nombre: "New Yorker",
        descripcion:
          "Huevos revueltos con panceta + 2 tostadas con queso crema y mermelada.",
        precio: 17500,
        grupos: ["infusion_x2", "bebida_naranja_limonada"],
      },
      {
        nombre: "Destino KETO",
        descripcion: "Pan nube con palta y tomatitos cherry.",
        precio: 18500,
        grupos: ["infusion_x2", "bebida_naranja_limonada"],
      },
      {
        nombre: "Moment Sucré Clásico",
        precio: 18900,
        grupos: ["infusion_x2", "bebida_naranja_limonada"],
      },
      {
        nombre: "Moment Sucré Premium",
        precio: 21900,
        grupos: ["infusion_x2", "bebida_naranja_limonada"],
      },
      {
        nombre: "Che Chipá",
        descripcion: "Tostado de chipá.",
        precio: 18900,
        grupos: ["infusion_x2", "bebida_naranja_limonada", "relleno_che_chipa"],
      },
      {
        nombre: "Aguacatero",
        descripcion: "Tostada integral con palta y huevo poché.",
        precio: 16800,
        grupos: ["infusion_x2", "bebida_naranja_limonada"],
      },
      {
        nombre: "Saludable",
        descripcion:
          "Granola parfait: yogurt, frutas frescas, granola y miel.",
        precio: 16500,
        grupos: ["infusion_x2", "bebida_naranja_limonada"],
      },
    ],
  },
  {
    nombre: "Tostados salados",
    productos: [
      { nombre: "Miga jamón y queso (4u)", precio: 12000 },
      { nombre: "Árabe tostado", precio: 10500, grupos: ["relleno_tostado"] },
      { nombre: "Medialuna jamón y queso", precio: 7000 },
      { nombre: "Croissant jamón y queso", precio: 9800 },
      { nombre: "Fosforito XL", precio: 13500, grupos: ["relleno_tostado"] },
      { nombre: "Tostado de chipá", precio: 13500 },
      { nombre: "Croque monsieur", precio: 18000 },
      {
        nombre: "Tostado neoyorquino",
        descripcion: "Lomito ahumado, cheddar fundido y huevo a la plancha.",
        precio: 14000,
      },
      {
        nombre: "Flat croissant",
        descripcion: "Con palta y huevo.",
        precio: 14000,
      },
      { nombre: "Tostado KETO", descripcion: "Pan nube.", precio: 14000 },
      {
        nombre: "Tostada con palta",
        descripcion: "Semillas, tomates cherry y huevo.",
        precio: 9000,
      },
      {
        nombre: "Avocado KETO",
        descripcion: "Pan nube, queso crema, palta y cherry.",
        precio: 14000,
      },
    ],
  },
  {
    nombre: "Sandwichs de miga",
    productos: [
      { nombre: "Sandwich de miga clásico", precio: 3900 },
      { nombre: "Sandwich de miga especial", precio: 4200 },
      { nombre: "Sandwich de miga gourmet", precio: 4400 },
    ],
  },
  {
    nombre: "Picada Pauline",
    productos: [
      {
        nombre: "Picada Pauline",
        descripcion:
          "Para compartir. Selección de quesos y fiambres premium, aceitunas, tomates cherry y dip casero, acompañado con focaccia.",
        precio: 39800,
      },
    ],
  },
  {
    nombre: "Brunch",
    productos: [
      {
        nombre: "Brunch",
        descripcion:
          "Incluye jugo de naranja exprimido. Salado: huevos revueltos, bruschetta de salmón y queso crema, tostada con palta, sándwich de miga de jamón crudo con rúcula y tomate seco. Dulce: bowl de yogurt con frutas frescas y granola.",
        precio: 30000,
        grupos: ["infusion_brunch", "viennoiserie_brunch"],
      },
    ],
  },
  {
    nombre: "Bebidas frías",
    productos: [
      { nombre: "Gaseosas", precio: 3500 },
      { nombre: "Agua con/sin gas", precio: 3500 },
      { nombre: "Aguas saborizadas", precio: 3500 },
      { nombre: "Licuados", precio: 7500 },
      { nombre: "Jugo de naranja exprimido", precio: 7000 },
      { nombre: "Limonada menta y jengibre", precio: 5600 },
      { nombre: "Limonada 1 litro", precio: 9100 },
      { nombre: "Milkshakes", precio: 8500, grupos: ["sabor_milkshake"] },
    ],
  },
  {
    nombre: "Frappés",
    productos: [
      { nombre: "Frappé Mango y maracuyá", precio: 7500 },
      { nombre: "Frappé Arándano y naranja", precio: 7500 },
      { nombre: "Frappé Ananá y menta", precio: 7500 },
      { nombre: "Frappé Mocca", precio: 7500 },
      { nombre: "Frappé Caramel", precio: 7500 },
      { nombre: "Frappé Dulce de leche", precio: 7500 },
    ],
  },
  {
    nombre: "Sin TACC",
    productos: [
      { nombre: "Cuadrado de brownie (Sin TACC)", precio: 7000 },
      { nombre: "Cuadrado de carrot cake (Sin TACC)", precio: 6000 },
      { nombre: "Lemonie (Sin TACC)", precio: 7000 },
      { nombre: "Alfajor chocolate (Sin TACC)", precio: 7000 },
      { nombre: "Postre chocotorta (Sin TACC)", precio: 15000 },
      { nombre: "Tostadas con dips (Sin TACC)", precio: 11000 },
      { nombre: "Árabe jamón y queso (Sin TACC)", precio: 14000 },
      {
        nombre: "Tarta salada (Sin TACC)",
        descripcion: "Zapallito y champignon.",
        precio: 14000,
      },
      { nombre: "Empanadas de verdura (x2) (Sin TACC)", precio: 10000 },
    ],
  },
  {
    nombre: "Promos Sin TACC",
    productos: [
      {
        nombre: "Porteño sin TACC",
        descripcion: "3 tostadas de pan blanco, queso crema y mermelada.",
        precio: 15000,
        grupos: ["infusion_x2", "bebida_naranja_limonada"],
      },
      {
        nombre: "Arábico",
        descripcion: "Tostado árabe de jamón y queso.",
        precio: 19000,
        grupos: ["infusion_x2", "bebida_naranja_limonada"],
      },
    ],
  },
];

// ---------- SALONES Y MESAS ----------
export const SALONES = [
  {
    nombre: "Salón 1",
    mesas: [
      { nombre: "CA1", forma: "cuadrado", x: 0, y: 0 },
      { nombre: "CA4", forma: "cuadrado", x: 1, y: 0 },
      { nombre: "CA2", forma: "cuadrado", x: 0, y: 1 },
      { nombre: "CA5", forma: "cuadrado", x: 1, y: 1 },
      { nombre: "CA3", forma: "cuadrado", x: 0, y: 2 },
      { nombre: "CA6", forma: "cuadrado", x: 1, y: 2 },
    ],
  },
  {
    nombre: "Salón 2",
    mesas: [
      { nombre: "PA3", forma: "circulo", x: 1, y: 0 },
      { nombre: "PA1", forma: "rectangulo", x: 2, y: 0 },
      { nombre: "PA2", forma: "cuadrado", x: 1, y: 1 },
      { nombre: "PA4", forma: "rectangulo", x: 0, y: 0 },
    ],
  },
];
