import { IUser } from "../interfaces/user";

export type Conversation = {
    _id: string;
    creator: IUser;
    recipient: IUser;
    createdAt: string;
    latestMessage: MessageType;
};

export type ConversationType = 'group' | 'private';

export type ConversationTypeData = {
    type: ConversationType;
    label: string;
};

export type Group = {
    _id: string;
    title?: string;
    users: IUser[];
    creator: IUser;
    owner: IUser;
    messages: GroupMessageType[];
    createdAt: number;
    latestMessage: MessageType;
};

export type MessageAttachment = {
    _id: string;
    url: string;
    cloudId: string;
};

export type MessageType = {
    _id: string;
    content?: string;
    createdAt: string;
    sender: IUser;
    conversation: Conversation;
    attachments?: MessageAttachment[];
};

export type GroupMessageType = {
    _id: string;
    content?: string;
    createdAt: string;
    sender: IUser;
    group: Group;
    attachments?: MessageAttachment[];
};