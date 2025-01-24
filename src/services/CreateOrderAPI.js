// src/services/createOrderAPI.js

export class CreateOrderAPI {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  async createOrder(
    customerMobile,
    userToken,
    amount,
    orderId,
    redirectUrl,
    remark1,
    remark2
  ) {
    const payload = new URLSearchParams();
    payload.append("customer_mobile", customerMobile);
    payload.append("user_token", userToken);
    payload.append("amount", amount);
    payload.append("order_id", orderId);
    payload.append("redirect_url", redirectUrl);
    payload.append("remark1", remark1);
    payload.append("remark2", remark2);

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        mode: "cors",
        credentials: "include",
        body: payload,
      });

      const data = await response.json();

      if (response.ok && data.status === true) {
        return data;
      } else {
        throw new Error(data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }
}
