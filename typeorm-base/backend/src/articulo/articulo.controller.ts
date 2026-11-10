import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ArticuloService } from "./articulo.service";

@Controller("articulos")
export class ArticuloController {
  constructor(private readonly articuloService: ArticuloService) {}

  @Get()
  findAll() {
    return this.articuloService.findAll();
  }

  @Get("tienda/:principalId")
  findByTienda(@Param("principalId") principalId: string) {
    return this.articuloService.findByTienda(Number(principalId));
  }

  @Get("buscar")
  searchByName(@Query("texto") text: string) {
    return this.articuloService.searchByName(text);
  }

  @Get("tienda/:principalId/minimo/:minimum")
  findByTiendaAndMinimum(
    @Param("principalId") principalId: string,
    @Param("minimum") minimum: string,
  ) {
    return this.articuloService.findByTiendaAndMinimum(Number(principalId), Number(minimum));
  }

  @Get("resumen/tienda")
  countByTienda() {
    return this.articuloService.countByTienda();
  }

  // Bloque 5 
  @Get("stock/:stock")
  seleccionarsegunStock(@Param("stock") stock: string) {
    return this.articuloService.findByStock(Number(stock));
  }

  //Bloque 1
  @Get(":id")
  getArticuloById(@Param("id") id: string) {
    return this.articuloService.getArticuloById(Number(id));
  }

  //Bloque 1
  @Post()
  addArticulo(@Body() body: any) {
    return this.articuloService.createArticulo(body);
  }

  //Bloque 2
  @Delete(":id")
  deleteArticulo(@Param("id") id: string) {
    return this.articuloService.deleteArticulo(Number(id));
  }

  //Bloque 3 -modificar un campo del articulo (stock en este caso)
  @Patch(":id/stock")
  modificarStockArticulo(
    @Param("id") id: string,
    @Body("nuevoStock") nuevoStock: number,
  ) {
    return this.articuloService.modificarStockArticulo(Number(id), nuevoStock);
  }

  //Bloque 4 - modificar la tienda (fk) de un articulo
  @Patch(":id/tienda")
  modificarTiendaArticulo(
    @Param("id") id: string,
    @Body("nuevaTiendaId") nuevaTiendaId: number,
  ) {
    return this.articuloService.modificarTiendaArticulo(Number(id), nuevaTiendaId);
  }
}