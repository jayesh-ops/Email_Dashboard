import axios from "axios";

export const getOrders = () => {
  return fetch("#").then((res) => res.json());
};


export const getComments = () => {
  return fetch("#").then((res) => res.json());
};

// Fetch Draft Order list from the API
export const getdraftOrders = () => {
  return fetch("http://localhost:5027/api/orders").then((res) => res.json());
};//http://localhost:5007/api/draft_orders


// Fetch Total Draft Order list from the API 
export const totaldraftOrders = () => {
  return fetch("http://localhost:5027/api/total-Draft-orders").then((res) => res.json());
};

// Fetch scheduled emails list from the API when the component mounts
export const scheduledEmaillist = () => {
  return fetch("http://localhost:5027/api/draft_orders").then((res) => res.json());
};


export const scheduleEmail = (
  recipientEmail,
  emailSubject,
  emailText,
  selectedProduct,
  customerName,
  selectedDate,
  selectedTime
) => {
  return axios.post("http://localhost:5027/api/schedule-email", {
    selectedDate,
    selectedTime,
    recipientEmail,
    emailSubject,
    emailText,
    selectedProduct,
    customerName,
  })
  .then((res) => res.data)
  .catch((error) => {
    console.error('Error scheduling email', error);
  });
};




