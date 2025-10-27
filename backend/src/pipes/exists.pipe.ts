//validador genérico y reutilizable
//Verifica si un registro realmente existe en la base de datos antes de procesar el endpoint.
//Si no existe, lanza un error automático (404 Not Found).
//Se configura una sola vez en main.ts y luego puede usarse en todas tus entidades (Marca, Linea, Producto, etc.) sin código repetido.

import { PipeTransform, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

export class ExistsPipe implements PipeTransform { 
  private static dataSource: DataSource; //Almacenará una referencia global al AppDataSource (tu conexión TypeORM).

  static setDataSource(dataSource: DataSource) { //Método estático para asignar el DataSource global. Lo llamamos desde main.ts
    this.dataSource = dataSource;
  }

  static for(entity: string) { // Es una factory estática
    return new ExistsPipe(entity);
  }

  private constructor(private readonly entityName: string) {} //Recibe el nombre de la entidad que queremos validar ('Marca', 'Linea', etc.).

  async transform(value: any) { //Se ejecuta automáticamente por NestJS cada vez que el pipe se aplica a un valor (por ejemplo, un parámetro @Body('marcaId') o @Param('id')).
    if (!ExistsPipe.dataSource) {
      throw new Error('El DataSource no está inicializado. Llama a ExistsPipe.setDataSource() en main.ts');
    }
    const repo = ExistsPipe.dataSource.getRepository(this.entityName); //Usa el DataSource global para obtener el repositorio correspondiente a la entidad.
    const entity = await repo.findOne({ where: { id: value } }); //Busca dentro de la tabla si existe un registro con el id recibido.

    if (!entity) {
      throw new NotFoundException(`${this.entityName} con ID ${value} no existe.`);
    }

    return value;
  }
}
