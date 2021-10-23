import { rm } from 'fs/promises';
import { join } from 'path';
import { getConnection } from 'typeorm';

//before each test is executed the database will be deleted
global.beforeEach(async () => {
    try {
        await rm(join(__dirname, '..', 'test.sqlite'));
    } catch (err) {
        //do nothing
    }
});

//but to be able to delete it, will have to get a connection to sqlite and close it
global.afterEach(async () => {
    const conn = getConnection();
    await conn.close();
})