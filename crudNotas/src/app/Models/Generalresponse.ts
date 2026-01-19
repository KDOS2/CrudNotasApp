export interface GeneralResponse{
    status:number,
    data:any
    success:boolean,
    error:string | null
}

export interface GetModelError{
    message:string,
    status:number,
    method:string,
    code:number | null
}