import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { isRegExp } from 'util/types';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';


describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async() => {
        //create fake copy of the users service
        const users: User[] = [];
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                const user = {
                    id: Math.floor(Math.random() * 999999), 
                    email, 
                    password 
                } as User;
                users.push(user);
                return Promise.resolve(user);
            }
        };

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile();

        service = module.get(AuthService);
    });


    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    it('creates a new user with a salted and hashed password', async() => {
        const user = await service.signup('email@mail.com', 'asdf');
        
        expect(user.password).not.toEqual('asdf');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throw an error if signup with email that is in use', async () => {
        //fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'a', password: '1'} as User]);
        await service.signup('dup@asdf.com', 'asdf');
        const user2 = service.signup('dup@asdf.com', 'asdf');
        await expect(user2).rejects.toThrow(BadRequestException);
    });

    it('throws if signin is calledn with an unused email', async () => {
        const user = service.signin('invalid@email.here', 'whatever');
        await expect(user).rejects.toThrow(NotFoundException);
    });

    it('throws if invalid password provided', async () => {
        //make the email exist
        //fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'whatever@email.here', password: 'whatever'} as User]);
        await service.signup('valid@email.here', 'validpassword');
        const user = service.signin('valid@email.here', 'wrongpass');
        await expect(user).rejects.toThrow(BadRequestException);
    })

    it('returns a user if correct password provided', async() => {
        //fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'whatever@email.here', password: 'whatever'} as User]);
        await service.signup('valid@email.here', 'validpassword');
        const user = await service.signin('valid@email.here', 'validpassword');
        expect(user).toBeDefined();
    })
});