import axios from 'axios';

export default {
    client: axios.create({
        baseURL: process.env.VUE_APP_API_URL,
        timeout: 10000, // 10 secs timeout if we have longer processing times (e.g. wa-number checking)
    }),

    createStudent(payload) {
        return this.client.post("student", payload);
    },

    getCourses() {
        return this.client.get("courses");
    }
};
