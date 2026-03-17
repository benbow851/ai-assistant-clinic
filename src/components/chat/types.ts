
export type Webhook = {
  id: string;
  name: string;
  webhook_url: string;
};

export type Message = {
  text: string;
  isUser: boolean;
  id: string;
};
