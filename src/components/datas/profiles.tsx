import { FaCar } from 'react-icons/fa';
interface Profile {
    id: number,
    description: string,
    url : string
    icon?: React.ReactNode;
}
const profiles: Profile[] = [
    {
        id: 1,
        description: 'description of a driver with a vehicle',
        url : 'Driver-with-Vehicle',
        icon:<FaCar />
    },
    {
        id: 2,
        description: 'description of a driver without a vehicle',
        url : 'Driver-Only',
        icon:<FaCar />
    }
]

export default profiles