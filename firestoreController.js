import { doc, getDocFromServer } from "firebase/firestore";
import { db } from "./firebase";

const getToday = () =>
  new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();

export const fetchMenu = async (restaurantName, day, language) => {
  const collectionName =
    language === "fi"
      ? restaurantName.toLowerCase() + "Fi"
      : restaurantName.toLowerCase();

  const docRef = doc(
    db,
    collectionName,
    day || getToday()
  );

  const docSnap = await getDocFromServer(docRef);
  const data = docSnap.data();

  const grouped = {};

  Object.entries(data).forEach(([key, value]) => {
    const base = key.replace(/\d+/g, "");
    grouped[base] = grouped[base] || [];
    grouped[base].push(value);
  });

  return Object.entries(grouped)
    .map(([category, items]) => ({
      category: { en: category, fi: category },
      items: items.map((item) => ({
        name: { en: item, fi: item },
      })),
    }))
    .sort((a, b) => a.category.en.localeCompare(b.category.en));
};