import * as express from 'express'
import * as compression from 'compression'
import * as helmet from 'helmet'
import * as graphqlHTTP from 'express-graphql'
import * as cors from 'cors'

import db from './models'
import schema from './graphql/schema'
import {extractJwtMiddleware} from "./middleware/extract.jwt.middleware";
import {DataLoaderFactory} from "./graphql/dataloaders/DataLoaderFactory";
import {RequestedFields} from "./graphql/ast/RequestedFields";

class App {

    public express: express.Application;
    private dataLoaderFactory: DataLoaderFactory;
    private requestedFields: RequestedFields;

    constructor() {
        this.express = express();
        this.requestedFields = new RequestedFields();
        this.init();
    }

    private init() {
        this.dataLoaderFactory = new DataLoaderFactory(db, this.requestedFields);
        this.middleware();
    }

    private middleware(): void {

        this.express.use(cors({
            origin: '*',
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-type', 'Authorization', 'Accept-Encoding'],
            preflightContinue: false,
            optionsSuccessStatus: 204
        }));

        this.express.use(compression());
        this.express.use(helmet());

        this.express.use('/graphql',

            extractJwtMiddleware(),

            (req, res, next) => {
                req['context']['db'] = db;
                req['context']['dataloaders'] = this.dataLoaderFactory.getLoaders();
                req['context']['requestedFields'] = this.requestedFields;
                next();
            },

            graphqlHTTP((req) => ({
                schema: schema,
                graphiql: process.env.NODE_ENV === 'development',
                context: req['context']
            }))
        )

    }
}

export default new App().express;
