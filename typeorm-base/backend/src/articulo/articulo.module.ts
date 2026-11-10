import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tienda } from "../tienda/entities/tienda.entity";
import { Articulo } from "./entities/articulo.entity";
import { ArticuloController } from "./articulo.controller";
import { ArticuloService } from "./articulo.service";

@Module({
  imports: [TypeOrmModule.forFeature([Tienda, Articulo])],
  controllers: [ArticuloController],
  providers: [ArticuloService],
})
export class ArticuloModule {}