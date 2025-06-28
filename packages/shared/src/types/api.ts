export interface IApiResponse<T=any> {
    success:boolean;
    data:T;
    error?:string;
    message:string;
}

export interface IPaginationMeta {
    page:number;
    limit:number;
    totalPages:number;
    total:number;

}

export interface IPaginatedResponse<T> extends IApiResponse<T[]>{
    pagination:IPaginationMeta;
}