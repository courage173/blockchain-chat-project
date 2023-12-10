import { ChatFeatures } from '../types/obj-types';
import SecurityIcon from '../icons/security-svg-icon';
import UsersIcon from '../icons/users-svg-icon';
import CostReductionIcon from '../icons/cost-reduction-icon';

export const chat_features: ChatFeatures[] = [
  {
    id: 1,
    header: 'Increased Security and Users Trust',
    paragraph:
      'With Web3, businesses can bid farewell to the vulnerability of centralized systems. Blockchain’s transparent nature ensures data integrity, while enhanced cybersecurity measures shield sensitive information eliminating the need for intermediaries, and minimizing the risk of fraud and manipulation.',
    icon: <SecurityIcon />,
  },
  {
    id: 2,
    header: 'Empowering Users and Customers',
    paragraph:
      'Web3 empowers people by giving them control over their personal data. With enhanced privacy options, users can feel more confident sharing personal information. Furthermore, the monetization of personal data becomes a possibility, allowing individuals to reclaim their digital worth.',
    icon: <UsersIcon />,
  },
  {
    id: 3,
    header: 'Disintermediation and Cost Reduction',
    paragraph:
      'Web3 disrupts traditional business models by removing intermediaries.This decentralized system streamlines processes, reduces overhead costs, and facilitates peer-to-peer transactions. Automation drives efficiency, creating significant cost savings for businesses.',
    icon: <CostReductionIcon />,
  },
];
