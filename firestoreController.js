// firestoreController.js
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

// Get today's day in firestore format
const getToday = () => {
  return new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
};

export const fetchMenu = async (restaurantName) => {
  const today = getToday();

  const docRef = doc(db, restaurantName.toLowerCase(), today);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  const data = docSnap.data();

  // Convert firestore data → UI format
  const formattedMenu = Object.entries(data).map(([key, value]) => ({
    category: {
      en: key,
      fi: key,
    },
    items: [
      {
        name: {
          en: value,
          fi: value,
        },
      },
    ],
  }));

  return formattedMenu;
};