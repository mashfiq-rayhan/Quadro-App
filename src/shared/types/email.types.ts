export type ISendMailOptions = ISendMailParent & ISendMailTemplate;

export interface ISendMailParent {
	to: string;
	subject: string;
}

export type ISendMailTemplate =
	| {
			template: EmailTemplateEnum.SAMPLE;
			context: IContextSample;
	  }
	| {
			template: EmailTemplateEnum.USER_REGISTERED;
			context: IContextUserRegistered;
	  };

export interface IContextSample {
	name: string;
	company: string;
}

export interface IContextUserRegistered {
	name: string;
	username: string;
	activationLink: string;
}

export enum EmailTemplateEnum {
	SAMPLE = "sample",
	USER_REGISTERED = "user_registered",
}
