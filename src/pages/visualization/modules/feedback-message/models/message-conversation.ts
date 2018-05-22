export interface MessageConversation {
  id: string;
  name: string;
  body: string;
  read: boolean;
  followUp: boolean;
  conversationNames: string;
  user: {id: string, name: string};
  lastSender: {id: string, name: string},
  status: string;
  priority: string;
  subject: string;
  href: string;
  messageType: string;
  messages: any[];
}
