export function formater(price:number){
    return  new Intl.NumberFormat('en-US').format(price)
    
}