// src/services/checkOrderStatusSDK.js

export function checkOrderStatus(userToken, orderId, callback) {
    const apiUrl = 'https://pay0.shop/api/check-order-status';

    const formData = new FormData();
    formData.append('user_token', userToken);
    formData.append('order_id', orderId);

    fetch(apiUrl, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'COMPLETED') {
            callback(null, data.result);
        } else {
            callback(data.message, null);
        }
    })
    .catch(error => {
        callback(error.message, null);
    });
}
