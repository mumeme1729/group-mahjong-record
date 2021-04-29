export interface File extends Blob {
    readonly lastModified: number;
    readonly name: string;
}

export interface PROPS_AUTHEN {
    email: string;
    password: string;
}

export interface PROPS_PROFILE{
    nickName:string;
}
export interface PROPS_UPDATE_PROFILE{
    id:number;
    nickName:string;
    text:string;
}
export interface PROPS_UPDATE_PROFILE_IMAGE{
    id:number;
    nickName: string;
    text:string;
    img:File | null;
    name:string;
}
export interface PROPS_PARTICIPATION{
    id:number;
    userGroup:number[];
}
export interface PROPS_CREATE_RATE{
    group_id:number;
    user_id:number;
    is_active:boolean;
}
export interface PROPS_BELONG_TO_GROUP{
    id: number;
    title:string;
    img:string;
    profile:{
        id: number;
        nickName: string;
        text:string;
        userProfile: number;
        created_on: string;
        img: string;
        is_active:boolean;
    }[]        
}

export interface PROPS_CREATE_GROUP{
    title:string;
    text:string;
    password:string;
    img:File|null;
}

export interface PROPS_GAME_RESULTS{
        id:number,
        group_id:number,
        created_at:string,
        results:
          {
            id:number,
            game_id:number,
            user_id:number,
            rank:number,
            score:number,
            profile:
              {
                id: number,
                nickName: string,
                text:string,
                userProfile: number,
                created_on: string,
                img: string,
              }
          }[],
}
export interface PROPS_GAME_RESULTS_SCORE{
    id: number;
    group_id: number;
    created_at: string;
    results: {
        id: number;
        game_id: number;
        user_id: number;
        rank: number;
        score: number;
        profile: {
            id: number;
            nickName: string;
            text: string;
            userProfile: number;
            created_on: string;
            img: string;
        };
    }[];
}

export interface PROPS_CREATE_GAME{
    group_id:string
}

export interface PROFILE{
    id: number;
    nickName: string;
    text:string;
    userProfile: number;
    created_on: string;
    img: string;   
}[]

export interface PROPS_RATE{
    rate_id:number;
    group_id:number;
    user_id:number;
    rate:number;
}
export interface PROPS_RATE_IS_ACTIVE{
    rate_id:number;
    group_id:string;
    user_id:number;
    is_active:boolean;
}
export interface PROPS_CREATE_GAME_RESLTS{
    game_id:number;
    user_id:number;
    rank:number;
    score:number;
}
export interface PROPS_EDIT_GAME_RESULTS{
    id:number;
    rank:number;
    score:number;
}
export interface PROPS_UPDATE_GROUP{
    id:number;
    title:string;
    text:string;
    password:string;
}
export interface PROPS_UPDATE_GROUP_IMAGE{
    id:number;
    title:string;
    text:string;
    password:string;
    img:File | null;
    name:string;
}
export interface PROPS_CONTACT{
    title:string;
    sender:string;
    message:string;
}
export interface PROPS_PASSWORD_CONFIRM{
    new_password1:string;
    new_password2:string;
    uid:string;
    token:string;
}