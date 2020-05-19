export interface IProfile {
    display:string,
    userName:string,
    bio:string,
    image:string,
    following:boolean,
    followersCount:number,
    followingCount:number,
    photos:IPhoto[]
}
export interface IPhoto {
    id:string,
    url:string,
    isMain:boolean
}