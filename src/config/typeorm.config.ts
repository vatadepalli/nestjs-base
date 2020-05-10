import { TypeOrmModuleOptions } from "@nestjs/typeorm";


export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    entities: [__dirname + '/../**/*.entity.js', __dirname + '/../**/*.entity.ts'],
    synchronize: true,
    database: 'taskmanagement'
};