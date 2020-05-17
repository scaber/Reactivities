export interface IActivity {
    id: string;
    title: string;
    description: string;
    category: string;
    date: Date;
    city: string;
    venue: string;
    isGoing:boolean;
    isHost:boolean;
    attendees:IAttendee[];
    comments: IComment[];
}

export interface IActivityFormValues extends Partial<IActivity> {
    time?: Date;
}
export interface IComment  {
    id?: string ;
    createAt:Date;
    username:string;
    body:string;
    image:string;
    display:string;
}

export class ActivityFormValues implements IActivityFormValues {
    id?: string = undefined;
    title: string = '';
    category: string = '';
    description: string = '';
    date?: Date = undefined;
    time?: Date = undefined;
    city: string = '';
    venue: string = '';

    constructor(init?: IActivityFormValues) {
        if (init && init.date) {
            init.time = init.date;
        }  
        Object.assign(this, init);
    }
}
export interface IAttendee{
    userName:string;
    display:string;
    image:string;
    isHost:boolean;
}