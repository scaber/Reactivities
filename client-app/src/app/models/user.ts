export interface IUser {
    username:string;
    display:string;
    token:string;
    image?: string;
}

export interface IUserFormValues {
    email: string;
    password: string;
    display?:string;
    username?:string;

}