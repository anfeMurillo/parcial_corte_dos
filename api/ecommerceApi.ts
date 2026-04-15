import axios from "axios";

export const ecommerceApi = axios.create({
  baseURL: 'https://ecommerce-api.wittysky-ae597b7e.westus2.azurecontainerapps.io',
});
