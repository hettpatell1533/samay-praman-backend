const config = {
  type: "mysql",
  host: 'mysql',
  port: 3306,
  username: "root",
  password: "Rlogical@2025",
  database: "corporate_management",
  entities: [__dirname + "../../../**/*.entity{.ts,.js}"],
  migrations: [__dirname + "../../../../migrations/*.{ts,js}"],
  synchronize: true,
  logging: ["error"],
};
export default config;
