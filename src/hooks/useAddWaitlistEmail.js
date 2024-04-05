import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '../config/firebase-config';

export const useAddWaitlistEmail = () => {
	const waitlistEmailCollectionRef = collection(firestore, 'waitlistEmails');

	const addWaitlistEmail = async email => {
		await addDoc(waitlistEmailCollectionRef, { email });
	};

	return { addWaitlistEmail };
};
