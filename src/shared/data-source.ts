import { DataSource, DataSourceOptions } from "typeorm";
import config from "./config/db.config";

const dataSourceOptions = config as DataSourceOptions;

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;