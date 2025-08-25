
const globalKey = "__HEARING_AID_MGMT_STORE__";
const nowIso = () => new Date().toISOString();

function seedStore() {
  return {
    nextIds: { customer: 2, hearingAid: 4, order: 1, appointment: 1 },
    customers: [
      {
        id: 1,
        first_name: "John",
        last_name: "Smith",
        email: "john.smith@email.com",
        phone: "555-0123",
        address: "123 Main St, Springfield",
        hearing_loss_level: "moderate",
        budget_range: 70000,
        has_insurance: true,
        created_at: nowIso(),
      },
    ],
    hearing_aids: [
      {
        id: 1,
        brand: "Signia",
        model: "IX",
        type: "ITE",
        price: 30000,
        features: ["basic_amplification", "noise_reduction"],
        suitable_for_loss_levels: ["mild", "moderate"],
        in_stock: 25,
        rating: 3.8,
        created_at: nowIso(),
      },
      {
        id: 2,
        brand: "Signia",
        model: "Styletto",
        type: "BTE",
        price: 64000,
        features: ["bluetooth", "rechargeable", "advanced_noise_reduction"],
        suitable_for_loss_levels: ["moderate", "severe"],
        in_stock: 12,
        rating: 4.6,
        created_at: nowIso(),
      },
      {
        id: 3,
        brand: "Phonak",
        model: "Audeo",
        type: "CIC",
        price: 45000,
        features: ["noise_reduction"],
        suitable_for_loss_levels: ["mild", "moderate"],
        in_stock: 8,
        rating: 4.2,
        created_at: nowIso(),
      },
    ],
    orders: [],
    appointments: [],
  };
}

const store = globalThis[globalKey] || (globalThis[globalKey] = seedStore());

export const customers = store.customers;
export const hearing_aids = store.hearing_aids;
export const orders = store.orders;
export const appointments = store.appointments;

export function generateId(kind) {
  const id = store.nextIds[kind];
  store.nextIds[kind] += 1;
  return id;
}

export function findCustomer(id) {
  return store.customers.find((c) => c.id === Number(id));
}

export function findOrder(id) {
  return store.orders.find((o) => o.id === Number(id));
}
