import ReviewSection from '@/components/freelance/ReviewSection';
import { reviews } from '@/data/Structure';

const Page = () => {
  const RecentClients = [
    { id: '1', name: 'Charlie Durand' },
    { id: '2', name: 'Diana Lefort' },
    { id: '3', name: 'Éric Petit' }
  ];
  return(
    <div>
      <ReviewSection initialReviews={reviews} recentClients={RecentClients}/>
    </div>
  )
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   // Ici, vous devriez récupérer les vraies données depuis votre API
//   const reviews: Review[] = [
//     {
//         review_id: "REV001",
//         user_id: "USR001",
//         rated_entity_id: "ENT001",
//         rated_entity_type: "driving_school",
//         rating: 5,
//         comment: "Excellente école de conduite, les instructeurs sont très professionnels !",
//         note: 9,
//         icon: "star",
//         like_count: 25,
//         dislike_count: 2,
//         created_at: "2023-10-01T10:00:00Z",
//         update_at: "2023-10-01T12:00:00Z",
//         is_hidden: false,
//     },
//     {
//         review_id: "REV002",
//         user_id: "USR002",
//         rated_entity_id: "ENT002",
//         rated_entity_type: "syndicate",
//         rating: 4,
//         comment: "Bonne expérience, mais il y a quelques améliorations à apporter.",
//         note: 8,
//         icon: "thumbs-up",
//         like_count: 15,
//         dislike_count: 1,
//         created_at: "2023-10-02T11:30:00Z",
//         update_at: "2023-10-02T11:30:00Z",
//         is_hidden: false,
//     },
//     {
//         review_id: "REV003",
//         user_id: "USR003",
//         rated_entity_id: "ENT003",
//         rated_entity_type: "driving_school",
//         rating: 3,
//         comment: "L'école est correcte, mais les horaires sont parfois compliqués.",
//         note: 6,
//         icon: "meh",
//         like_count: 5,
//         dislike_count: 3,
//         created_at: "2023-10-03T14:45:00Z",
//         update_at: "2023-10-03T14:45:00Z",
//         is_hidden: false,
//     },
//     {
//         review_id: "REV004",
//         user_id: "USR004",
//         rated_entity_id: "ENT004",
//         rated_entity_type: "other",
//         rating: 2,
//         comment: "Pas satisfait de l'accueil, je ne recommande pas.",
//         note: 4,
//         icon: "thumbs-down",
//         like_count: 2,
//         dislike_count: 20,
//         created_at: "2023-10-04T09:15:00Z",
//         update_at: "2023-10-04T09:15:00Z",
//         is_hidden: false,
//     },
//     {
//         review_id: "REV005",
//         user_id: "USR005",
//         rated_entity_id: "ENT005",
//         rated_entity_type: "syndicate",
//         rating: 5,
//         comment: "Une très bonne organisation, je me sens soutenu !",
//         note: 10,
//         icon: "heart",
//         like_count: 30,
//         dislike_count: 0,
//         created_at: "2023-10-05T16:30:00Z",
//         update_at: "2023-10-05T16:30:00Z",
//         is_hidden: false,
//     }
// ];

//   const dummyRecentClients: Client[] = [
//     { id: '1', name: 'Charlie Durand' },
//     { id: '2', name: 'Diana Lefort' },
//     { id: '3', name: 'Éric Petit' }
//   ];

//   return {
//     props: {
//       initialReviews: reviews,
//       recentClients: dummyRecentClients,
//     },
//   };
// };

export default Page;
