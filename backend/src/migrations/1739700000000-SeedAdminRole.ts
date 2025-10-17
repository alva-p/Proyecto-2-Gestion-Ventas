import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRoles1739700000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO roles (nombre, descripcion)
      VALUES ('admin', 'Administrador')
      ON CONFLICT (nombre) DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM roles WHERE nombre = 'admin';`);
  }
}
