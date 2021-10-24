import { Expose, Transform } from 'class-transformer';

export class ReportDto {
    @Expose()
    id: number;
    @Expose()
    price: number;
    @Expose()
    year: number;
    @Expose()
    lng: number;
    @Expose()
    lat: number;
    @Expose()
    make: string;
    @Expose()
    model: string;
    @Expose()
    mileage: number;

    //with this tranform the user details will not be returned when POSTing a report 
    @Transform(({ obj }) => obj.user.id) //from the original ReportDto data (obj) get the user.id and store it in this userId property
    @Expose()
    userId: number;
}