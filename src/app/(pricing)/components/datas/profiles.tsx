interface Profile {
    id: number,
    description: string,
    url : string

}
const profiles: Profile[] = [
    {
        id: 1,
        description: 'You own your vehicle and use it to transport passengers. Access all plans and unlock higher earning potential.',
        url : 'driver-with-vehicle'

    },
    {
        id: 2,
        description: 'You are a licensed driver without a personal vehicle. Get matched with available fleet vehicles on the platform.',
        url : 'driver-only'

    }
    // {
    //     id: 4,
    //     description: 'description of a transport-agency type subscriber',
    //     url : 'transport-agency'
    
    // },
    // {
    //     id: 5,
    //     description: 'description of a vehicle-company type subscriber',
    //     url : 'driver-with-vehicle'
    
    // }
]

export default profiles