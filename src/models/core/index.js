export {default as UserDistributor} from './UserDistributor';

import { sequelize } from '../../connections';

for (let m in sequelize.models) {
    sequelize.models[m].sync();
}

// Init association
for (let m in sequelize.models) {
    sequelize.models[m].association();
}