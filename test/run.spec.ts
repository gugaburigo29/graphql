import {db} from './text-utils'

db.sequelize.sync({force: true})
    .then(() => run());
