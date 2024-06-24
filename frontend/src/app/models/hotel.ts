export class Hotel {
  constructor(
    public id: number,
    public owner_id: number,
    public balance: number,
    public name: string,
    public address: string,
    public country: string,
    public city: string,
    public status: 'active' | 'inactive' | 'suspend',
    public star_rating: number,
    public description: string,
  ){}
}
