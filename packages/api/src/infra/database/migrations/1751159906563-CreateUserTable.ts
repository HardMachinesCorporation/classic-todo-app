import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateUsersAndTodos1671159906563 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 🔧 (Postgres) activer l’extension pour UUID
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // 1️⃣ Création de la table Users
    await queryRunner.createTable(
      new Table({
        name: 'Users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'firstName',
            type: 'varchar',
          },
          {
            name: 'lastName',
            type: 'varchar',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true
    );

    // 2️⃣ Création de la table Todos
    await queryRunner.createTable(
      new Table({
        name: 'Todos',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'completed',
            type: 'boolean',
            default: false,
          },
          {
            name: 'userId',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
      true
    );

    // 3️⃣ Ajout de la clé étrangère Todos.userId → Users.id
    await queryRunner.createForeignKey(
      'Todos',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'Users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1️⃣ Supprimer la FK avant de drop la table
    const table = await queryRunner.getTable('Todos');
    const fk = table!.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('userId') !== -1
    );
    if (fk) {
      await queryRunner.dropForeignKey('Todos', fk);
    }

    // 2️⃣ Supprimer les tables dans l’ordre inverse
    await queryRunner.dropTable('Todos', true);
    await queryRunner.dropTable('Users', true);
  }
}
