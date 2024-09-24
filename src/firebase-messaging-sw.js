importScripts("https://www.gstatic.com/firebasejs/10.11.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging-compat.js");
firebase.initializeApp({
    apiKey: "AIzaSyAN9i1L2-p2XnQ2YZC3WbYQCe3EeKi4_PI",
    authDomain: "el-sooq.firebaseapp.com",
    projectId: "el-sooq",
    storageBucket: "el-sooq.appspot.com",
    messagingSenderId: "781801376515",
    appId: "1:781801376515:web:f14938460587d300f83736",
    measurementId: "G-C6NG9CPFWP"
})
const messaging = firebase.messaging();