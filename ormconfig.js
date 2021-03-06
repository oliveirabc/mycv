var dbConfig = {
    synchronize: false,
    migrations: ['migrations/*.js'],
    cli: {
        migrationsDir: 'migrations'
    }
};

console.log('Env: ' + process.env.NODE_ENV)
switch (process.env.NODE_ENV) {
    case 'development':
        Object.assign(dbConfig, {
            type: 'sqlite',
            database: 'db.sqlite',
            entities: ['**/*.entity.js'],
        });
        break;
    case 'test':
        Object.assign(dbConfig, {
            type: 'sqlite',
            database: 'db.sqlite',
            entities: ['**/*.entity.ts'],
            migrationsRun: true //force migrations to run whenever tests run
        });
        break;
    case 'production':
        Object.assign(dbConfig, {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            migrationsRun: true,
            entities: ['**/*.entity.js'],
            ssl: {
                rejectUnauthorized: false
            }
        })
    default:
        throw new Error('unknown environment');
}

module.exports = dbConfig;