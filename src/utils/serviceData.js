import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.init";

const normalizeTimestamp = (value) => {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (value instanceof Date) return value.getTime();
  return 0;
};

export const normalizeService = (service) => {
  const data = service ?? {};

  return {
    id: data.id ?? "",
    name: data.name ?? "Unnamed service",
    description: data.description ?? "",
    category: data.category ?? "general",
    price: data.price ?? 0,
    duration: data.duration ?? null,
    image: data.image || data.img || "",
    icon: data.icon || "bi-heart-pulse",
    isActive: data.isActive !== false,
    timeSlots: Array.isArray(data.timeSlots)
      ? data.timeSlots
      : Array.isArray(data.availability?.timeSlots)
        ? data.availability.timeSlots
        : [],
    unavailableDates: Array.isArray(data.unavailableDates)
      ? data.unavailableDates
      : [],
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
  };
};

export const fetchServicesFromFirestore = async ({ activeOnly = false } = {}) => {
  const servicesSnapshot = await getDocs(collection(db, "services"));

  return servicesSnapshot.docs
    .map((serviceDoc) =>
      normalizeService({
        id: serviceDoc.id,
        ...serviceDoc.data(),
      }),
    )
    .filter((service) => (activeOnly ? service.isActive : true))
    .sort(
      (first, second) =>
        normalizeTimestamp(second.createdAt) - normalizeTimestamp(first.createdAt),
    );
};
