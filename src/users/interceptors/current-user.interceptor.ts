import { NestInterceptor,
ExecutionContext,
CallHandler,
Injectable } from "@nestjs/common";
import { UsersService } from "../users.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private usersService: UsersService) {}

    async intercept(context: ExecutionContext, handler: CallHandler) {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.session || {};

        //console.log('CurrentUSerInterceptor - userId: ' + userId);
        if (userId) {
            const user = await this.usersService.findOne(userId);
            request.currentUser = user;
            //console.log('CurrentUSerInterceptor - request.currentUser: ' +  request.currentUser);
        } 

        return handler.handle();
    }
}