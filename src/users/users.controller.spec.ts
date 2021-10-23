import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({id, email: 'test@email.com', password: 'lero-lero'} as User);
      },
      find: (email: string) => {
        return Promise.resolve([{id: 1, email, password: 'lero-lero'} as User]);
      }
      //remove: () => {}
      //update: () => {}
    };
    fakeAuthService = {
      signin: (email: string, password: string) => {
        return Promise.resolve({id: 1, email, password} as User);
      }
      //signup: () => {}
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUSers('asdf@asdf.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf@asdf.com');
  });

  it('findUser returns a single user with a given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    const user = controller.findUser('1');
    await expect(user).rejects.toThrow(NotFoundException);
  });

  it ('signIn updates session object and returns user', async () => {
    const session = { userId: -10};
    const user = await controller.signin(
      {email: 'asd@asdd.com', password: 'asdads'}, session);
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  })
});
