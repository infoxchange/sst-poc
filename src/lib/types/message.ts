import {User} from './';

export default interface Message {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    user: User | null;
}