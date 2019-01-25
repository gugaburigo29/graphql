import * as path from 'path'
import * as fs from 'fs'
import * as Sequelize from "sequelize";
import {DBConnection} from "../interfaces/DBConnectionInterface";

const basename: string = path.basename(module.filename);
const env: string = process.env.NODE_ENV || 'development';
let config = require(path.resolve(`${__dirname}./../config/config.json`))[env];
let db = null;

if (!db) {

    db = {};

    const sequelize: Sequelize.Sequelize = new Sequelize(
        config.database,
        config.ussername,
        config.password,
        config
    );

    fs
        .readdirSync(__dirname)
        .filter((file: string) => {
            return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
        })
        .forEach((file: string) => {
            const model = sequelize.import(path.join(__dirname, file));
            db[model['name']] = model;
        });

    Object.keys(db).forEach((modelName: string) => {
        if (db[modelName].associate) {
            db[modelName].associate(db)
        }
    });

    db['sequelize'] = sequelize;

}

export default <DBConnection>db;
