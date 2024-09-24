export interface User {
  authentication_code:string
  email:string 
  full_name: string,
  first_name: string,
  last_name: string,
  id: number
  img: string
  mobile: string
  points: number,
  found_us_by:string,
  user_level:string,
  calculation?:number
}
