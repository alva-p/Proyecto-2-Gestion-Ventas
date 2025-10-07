import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Marca } from 'src/marcas/entities/marca.entity'; 

@Entity()
export class Linea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @ManyToOne(() => Marca, (marca) => marca.lineas)
  marca: Marca;
}
