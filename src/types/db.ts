export type CategoriaMenu = {
  id: string;
  nombre: string;
  orden: number;
};

export type Producto = {
  id: string;
  categoria_id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  disponible: boolean;
  orden: number;
};

export type GrupoModificador = {
  id: string;
  nombre: string;
  obligatorio: boolean;
  seleccion_multiple: boolean;
  max_selecciones: number | null;
};

export type OpcionModificador = {
  id: string;
  grupo_id: string;
  nombre: string;
  precio_adicional: number;
  orden: number;
};

export type Salon = {
  id: string;
  nombre: string;
};

export type Mesa = {
  id: string;
  salon_id: string;
  nombre: string;
  forma: "cuadrado" | "rectangulo" | "circulo";
  posicion_x: number;
  posicion_y: number;
};

export type Pedido = {
  id: string;
  mesa_id: string;
  estado: "abierto" | "cerrado";
  total: number;
  created_at: string;
  closed_at: string | null;
};

export type PedidoItem = {
  id: string;
  pedido_id: string;
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  nota: string | null;
};

export type PedidoItemModificador = {
  id: string;
  pedido_item_id: string;
  opcion_modificador_id: string;
};

export type MesaConEstado = Mesa & {
  pedido_abierto: Pedido | null;
};

export type ProductoConGrupos = Producto & {
  grupos: (GrupoModificador & { opciones: OpcionModificador[] })[];
};

export type PedidoItemDetallado = PedidoItem & {
  producto: Producto;
  modificadores: (OpcionModificador & { grupo_nombre: string })[];
};
