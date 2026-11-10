import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Tienda } from "../tienda/entities/tienda.entity";
import { Articulo } from "./entities/articulo.entity";

@Injectable()
export class ArticuloService {
  constructor(
    @InjectRepository(Articulo)
    private readonly articuloRepository: Repository<Articulo>,
    @InjectRepository(Tienda)
    private readonly tiendaRepository: Repository<Tienda>,
  ) {}

  findAll() {
    return this.articuloRepository
      .createQueryBuilder("registro")
      .innerJoinAndSelect("registro.tienda", "principal")
      .orderBy("registro.id", "ASC")
      .getMany();
  }

  findByTienda(principalId: number) {
    return this.articuloRepository
      .createQueryBuilder("registro")
      .innerJoinAndSelect("registro.tienda", "principal")
      .where("principal.id = :principalId", { principalId })
      .orderBy("registro.id", "ASC")
      .getMany();
  }

  searchByName(text: string) {
    return this.articuloRepository
      .createQueryBuilder("registro")
      .innerJoinAndSelect("registro.tienda", "principal")
      .where("registro.nombre ILIKE :pattern", { pattern: `%${text}%` })
      .orderBy("registro.id", "ASC")
      .getMany();
  }

  findByTiendaAndMinimum(principalId: number, minimum: number) {
    return this.articuloRepository
      .createQueryBuilder("registro")
      .innerJoinAndSelect("registro.tienda", "principal")
      .where("principal.id = :principalId", { principalId })
      .andWhere("registro.stock >= :minimum", { minimum })
      .orderBy("registro.stock", "DESC")
      .getMany();
  }

  countByTienda() {
    return this.tiendaRepository
      .createQueryBuilder("principal")
      .leftJoin("principal.articulos", "registro")
      .select("principal.id", "id")
      .addSelect("principal.nombre", "nombre")
      .addSelect("COUNT(registro.id)", "total")
      .groupBy("principal.id")
      .addGroupBy("principal.nombre")
      .orderBy("principal.id", "ASC")
      .getRawMany();
  }


  //BLOQUE 1. Quiero q service permita añadar registro y despues lo listamos
  async createArticulo(data: any) {
    const idTienda = data.tiendaId ?? data.tienda?.id ?? data.id_tienda;
    if (!idTienda) {
      throw new Error("Falta el ID de la tienda!!");
    }

    const tienda = await this.tiendaRepository.findOneBy({ id: Number(idTienda) });
    if (!tienda) {
      throw new Error(`La tienda no existe!!`);
    }

    const nuevoArticulo = this.articuloRepository.create({
      nombre: String(data.nombre),
      stock: Number(data.stock),
      tienda: tienda,
    });

    return await this.articuloRepository.save(nuevoArticulo);
  }

  //Bloque 1 - conseguir el articulo por id
  getArticuloById(id: number) {
    return this.articuloRepository.findOne({ where: { id } });
  }

  //Bloque 2 - Borrar articulo 
  deleteArticulo(id: number) {
    return this.articuloRepository.delete(id);
  }

  //Bloque 3 modificar un campo del articulo (stock en este caso)
  modificarStockArticulo(id: number, nuevoStock: number) {
    return this.articuloRepository.update(id, { stock: nuevoStock });
  }

  //Bloque 4 modificar la tienda (fk) de un articulo
  async modificarTiendaArticulo(id: number, nuevaTiendaId: number) {
    const nuevaTienda = await this.tiendaRepository.findOneBy({ id: Number(nuevaTiendaId) });
    if (!nuevaTienda) {
      throw new Error(`La tienda no existe`);
    }
    return await this.articuloRepository.update(id, { tienda: nuevaTienda });
  }

  //Bloque 5 (?) - usar el join, con un where del caso (en el mio he puesto stock)
  findByStock(stock: number) {
    return this.articuloRepository
      .createQueryBuilder("registro")
      .innerJoinAndSelect("registro.tienda", "principal")
      .where("registro.stock >= :stock", { stock })
      .orderBy("registro.id", "ASC")
      .getMany();
  }
}

