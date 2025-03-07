export type ImageFile = {
    url: string;
    name: string;
    size: number;
    caption?: string;
  };
  
  export type PromptCategory = {
    name: string;
    description: string;
    prompts: string[];
    hasOptions?: boolean;
    dateInput?: boolean;
  };