import { config } from './config';
import express from 'express';
import cluster from 'cluster';
import { logger } from './utils/logger';
import { cpus } from 'os';
import bodyParser from 'body-parser';
import apicache from 'apicache';
//import controllers
import { healthcheck } from './controllers/controller-healthcheck';
import { allProducts, detailProduct } from './controllers/controller-product';
import { purchaseProductsTransaction } from './controllers/controller-purchase';
// Util
import redisCache from './utils/cache';

const numCPUs = cpus().length;
const cacheWithRedis = apicache.options({ redisClient: redisCache }).middleware;

const TIME_CACHE = '1 hour';

if (cluster.isPrimary) {
    // create a worker for each CPU
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('online', (worker) => {
        logger.info(`worker online, worker id: ${worker.id}`);
    });
    //if worker dies, create another one
    cluster.on('exit', (worker, code, signal) => {
        logger.error(
            `worker died, worker id: ${worker.id} | signal: ${signal} | code: ${code}`
        );
        cluster.fork();
    });
} else {
    //create express app
    const app: express.Express = express();
    const router: express.Router = express.Router();

    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(router); // tell the app this is the router we are using

    //healthcheck routes
    router.get('/', cacheWithRedis(TIME_CACHE), healthcheck);
    router.get('/healthcheck', cacheWithRedis(TIME_CACHE), healthcheck);

    // Product
    router.get('/api/products', cacheWithRedis(TIME_CACHE), allProducts);
    router.get('/api/products/:idProduct', cacheWithRedis(TIME_CACHE), detailProduct);

    // Purchase
    router.post('/api/purchase', purchaseProductsTransaction);
    app.listen(config.port, function () {
        const workerId = cluster.worker && cluster.worker.id ? cluster.worker.id : undefined;
        logger.info(
            `worker started: ${workerId} | server listening on port: ${config.port}`
        );
    });
}
