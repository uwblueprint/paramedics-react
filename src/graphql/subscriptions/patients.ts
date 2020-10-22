import gql from 'graphql-tag';
import { useSubscription } from '@apollo/react-hooks';


export const PATIENTS_SUBSCRIPTION = gql`
  subscription OnPatientAdded {
    patientAdded {
      id
      barcode
      status
      triage
    }
  }
`;

export default () => useSubscription(PATIENTS_SUBSCRIPTION);

// const getUpdates = () => {
//   const { data: { patientAdded } } = useSubscription(PATIENTS_SUBSCRIPTION);
//   return <h4>New updates</h4>;
// }