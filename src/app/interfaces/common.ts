export interface BreadcrumbLink {
  label: string;
  route: string;
  queryParams?: string;
}


export interface Gym {
  id: number;
  lat: number;
  lng: number;
  label?: string;
  name: string;
  description: string;
  img?: string;
  logo?: string;
  distance: number;
  date_added:any
  property:any
}


export interface SubscriptionDetails {
  id: number;
  plan_id: number;
  gym_id: number;
  user_id: number;
  start_date: string;
  end_date: string;
  ammount: number;
  rate?:number
  points_gained: number;
  points_ammount: number;
  sort: number;
  date_added: string;
  gymId: number;
  gymStatus: number;
  gymSort: number;
  gymName: string;
  gymDescription: string;
  subscriptionPlanId: number;
  subscriptionPlanStatus: number;
  planTitle: string;
  planDescription: string;
  cityLangId: number;
  cityName: string;
  countryLangId: number;
  countryName: string;
  price:number;
  rateCount:number;
  duration:number;
}




export interface Points {
  date_added: string;
  id: number;
  points: number;
  subscription_id: number;
  type: string;
  user_id: number;
  subscription_title:string;
  gym_name:string;
}


export interface ContactInfo{
  site_name: string
  start_time: string
  site_url: string
  site_desc: string
  PointsForEachPound: string
  PointsPerPound: string
  site_keywords: string
  site_email: string
  thumbnail_size_w: string
  thumbnail_size_h: string
  medium_size_w: string
  medium_size_h: string
  large_size_w: string
  large_size_h: string
  date_type: string
  format_date: string
  phone: string
  twitter: string
  facebook: string
  address: string
  pointsPerPound: string
  instagram: string
  linkedin: string
  tiktok: string
  site_desc_en: string
  youtube: string
  address_en: string
  other_phone: string
  longitude: string
  latitude: string
}

export interface option{
  id?:number
  name? :string 
  code?:string
}

export interface PaymentData
{
  signture?: string
  callbBackURL?: string
  email?: string
  mobile?: string
  orderId?: string
  txnAmount?: number
  website?: string
  merchantId?: string
  txnDate?: string
  order_id_Production?: any
  order_amount_Production?: number
  order_quantity_Production?: string
}