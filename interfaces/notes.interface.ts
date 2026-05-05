export interface ICreateNote {
    title: string,
    description: string,
    assignature: string,
    limitDate: string,
    color: string
}

export interface INote extends ICreateNote {
  id: number;
  createdAt: string
  textColor: string;
}
