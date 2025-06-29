import { DataSource, DataSourceOptions } from 'typeorm';
import { getDatabaseConfig } from './get-database.config';

const options: DataSourceOptions = getDatabaseConfig();
const dataSource = new DataSource(options);
export default dataSource;
