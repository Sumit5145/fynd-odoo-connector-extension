import * as React from "react";

const PaymentIcon = (props) => (
    React.createElement("svg", {
        width: 20,
        height: 17,
        viewBox: "0 0 20 17",
        fill: "currentcolor",
        xmlns: "http://www.w3.org/2000/svg",
        ...props
    },
        React.createElement("path", {
            d: "M18.75 8.1875C19.0625 8.5 19.0833 8.85417 18.8125 9.25C18.5 9.5625 18.1562 9.58333 17.7812 9.3125L17 8.6875V14.5C16.9792 15.2083 16.7396 15.8021 16.2812 16.2812C15.8021 16.7396 15.2083 16.9792 14.5 17H5.5C4.79167 16.9792 4.19792 16.7396 3.71875 16.2812C3.26042 15.8021 3.02083 15.2083 3 14.5V8.6875L2.25 9.3125C1.85417 9.58333 1.5 9.5625 1.1875 9.25C0.916667 8.85417 0.9375 8.5 1.25 8.1875L9.53125 1.1875C9.84375 0.9375 10.1667 0.9375 10.5 1.1875L18.75 8.1875ZM5.5 15.5H7V10.75C7 10.3958 7.125 10.1042 7.375 9.875C7.60417 9.625 7.89583 9.5 8.25 9.5H11.75C12.1042 9.5 12.3958 9.625 12.625 9.875C12.875 10.1042 13 10.3958 13 10.75V15.5H14.5C14.7917 15.5 15.0312 15.4062 15.2188 15.2188C15.4062 15.0312 15.5 14.7917 15.5 14.5V7.40625L10 2.71875L4.5 7.40625V14.5C4.5 14.7917 4.59375 15.0312 4.78125 15.2188C4.96875 15.4062 5.20833 15.5 5.5 15.5ZM8.5 15.5H11.5V11H8.5V15.5Z",
            fill: "currentcolor",
            // fillOpacity: 0.88
        })
    )
);

export default PaymentIcon;
