<template>
<div v-if="done" class="wrap">
  <Card :primary="true">
    <Summary>
      Your data have been collected. You should receive a <b>confirmation message on whatsapp</b> shortly.<br><br>
      If you don't receive it within the next hour, you might have written the wrong number and please fill out the form again with a phone number that is connected to your Whatsapp account. 
      <br><br>
      <b>As the next step</b>, we will match you with people in our pool based on your preferences.
      Most people get matched within 7 days of the registration, however, this can take longer if you take a rare course.
      Share this with your friends, so we can match more people and more courses!
      Once we find you a match, we will send you a link that invites you to a WA group with your learning partner(s).
      <br><br>
      Please inform us if you no longer wish to be matched ...
    </Summary>
  </Card>
  
</div>
<div v-else class="wrap">
  <Card title="Sign me up right now!" :primary="true">
    We timed it, it only takes 1.5 minute to fill out!
    <div class="required-info">
      * Required
    </div>
  </Card>

  <Card title="What shall we call you?" :required="true" :error="validationErrors.name">
    <BField :type="validationErrors.name ? 'is-danger' : ''">
      <BInput name="name" v-model="userInput.name" placeholder="Max Mustermann" rounded></BInput>
    </BField>
  </Card>

  <Card title="Out of the exams your are preparing for, which of them would you like to find learning partners for?" description='Choose up to 4 courses. Please select one option for each subject you take (if both lecture and exercise exist for a course, please only select the lecture))' :required="true" :error="validationErrors.courses">
    <CourseSelect v-model="userInput.courses" />
  </Card>

  <Card title="What are your target grades?" :required="true" :error="validationErrors.grades">
    <p class="big-notice" v-if="courses.length == 0">Please select some courses first</p>
    <RadioMatrixMulti v-else :rows="courses" :cols="grades" v-model="userInput.grades" />
  </Card>

  <Card title="How far are you in terms of the preperation?"
    :required="true"
    :error="validationErrors.preparation"
  >
    <p class="description">
      <b>A</b>: I am through with the content, and am now working through old exams<br>
      <b>B</b>: I watched all the lectures, and completed most of the homework<br>
      <b>C</b>: I am up-to-date with watching the lectures, but did no exercises so far<br>
      <b>D</b>: I did some work<br>
      <b>E</b>: I did nothing so far
    </p>
    <p class="big-notice" v-if="courses.length == 0">Please select some courses first</p>
    <RadioMatrixMulti v-else :rows="courses" :cols="preparation" v-model="userInput.preparation" />
  </Card>

  <Card title="Phone number (WA)" description="Please provide your Whatsapp number, so once there is a match, we can put you in a group" :error="validationErrors.phoneNumber" :required="true">
    <BField :type="validationErrors.phoneNumber ? 'is-danger' : ''">
      <BInput name="phone" v-model="userInput.phoneNumber" placeholder="+49 1511 1111111" rounded></BInput>
    </BField>
  </Card>

  <Card :error="validationErrors.confirm" :required="true">
    <ConfirmBox v-model="confirm">
      I confirm that I would like to find study partners for the following courses: ({{ this.userInput.courses.map(c => c.title).join(", ") }}).<br>
      If I no longer wish to be matched or changed my courses, I will inform MatchNLearn team via a quick whatsapp message.
    </ConfirmBox>
  </Card>

  <div class="actions">
    <div v-if="errorDescription" class="form-error-description">{{ errorDescription }}</div>
    <div v-if="submitError != null" class="form-error-description">{{ submitError.message }}</div>
    <BButton :loading="isSending" type="is-primary" @click="send">Sign up</BButton>
  </div>
</div>
</template>

<script setup>
import { string, util, isValid } from 'valid.js'
import constants from './constants';
import Card from './components/Card.vue';
import CourseSelect from './components/CourseSelect.vue';
import RadioMatrixMulti from './components/RadioMatrixMulti.vue';
import ConfirmBox from './components/ConfirmBox.vue';
import Summary from './components/Summary.vue';
import ApiService from './services/api';

const { errors } = constants;

export default {
  name: 'App',
  data: () =>  ({
    done: false,
    isSending: false,
    validationFailed: false,
    submitError: null,
    confirm: false,
    validationErrors: {
      name: false,
      phoneNumber: false,
      courses: false,
      grades: false,
      preparation: false,
      confirm: false,
    },
    userInput: {
      name: "",
      phoneNumber: "",
      courses: [],
      grades: {},
      preparation: {}
    },
    grades: [
      { value: 1, title: "1" },
      { value: 2, title: "2" },
      { value: 3, title: "3" },
      { value: 4, title: "4" },
    ],
    preparation: [
      { value: "A", title: "A" },
      { value: "B", title: "B" },
      { value: "C", title: "C" },
      { value: "D", title: "D" },
      { value: "E", title: "E" },
    ]
  }),
  computed: {
    errorDescription() {
      if (this.validationFailed) return "Failed: Please make sure to fill all fields in the right manner!";
      return null;
    },
    courses() {
      return this.userInput.courses.map(c => {
        return {
          value: c._id,
          title: c.title,
        };
      })
    }
  },
  methods: {
    async send() {
      this.submitError = null;
      this.validationFailed = false;
      this.isSending = true;

      // Validation
      this.validate();
      if (Object.values(this.validationErrors).some(e => !!e)) {
        this.validationFailed = true;
        this.isSending = false;
        return;
      }

      // Sending Request
      try {
        let payload = {
          ...this.userInput,
          courses: this.userInput.courses.map(c => c._id),
          phoneNumber: this.userInput.phoneNumber.replace(/\\s/, ""),
        };
        
        for (const key in payload) {
          if (Object.hasOwnProperty.call(payload, key) && payload[key] === "") {
            delete payload[key];
          }
        }

        await ApiService.createStudent(payload);
        this.done = true;
      } catch (error) {
        this.submitError = error;
      }
      this.isSending = false;
    },
    validate() {
      let validationErrors = { ...this.validationErrors };
      validationErrors.name = this.userInput.name.length > 1 ? false : errors.badFormat;
      validationErrors.phoneNumber = 
        isValid(this.userInput.phoneNumber, [string.regex(new RegExp("^\\+[0-9\\s]+")), util.isRequired]) 
        ? false 
        : errors.badFormat;
      validationErrors.faculty = this.userInput.faculty !== null  ? false : errors.emptyRequired;
      validationErrors.courses = this.userInput.courses.length > 0  ? ((this.userInput.courses.length > 4) ? errors.tooMany : false) : errors.emptyRequired;
      validationErrors.grades = Object.values(this.userInput.grades).filter(x => x).length != this.userInput.courses.length ? errors.emptyRequired : null;
      validationErrors.preparation = Object.values(this.userInput.preparation).filter(x => x).length != this.userInput.courses.length ? errors.emptyRequired : null;
      validationErrors.confirm = !this.confirm ? errors.emptyRequired : false;
      this.validationErrors = validationErrors;
      console.log(this.validationErrors);
    }
  },
  components: {
    Card,
    CourseSelect,
    RadioMatrixMulti,
    Summary,
    ConfirmBox,
  }
}
</script>

<style>
body {
  background: #f9f9f9;
  color: #2c3e50;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.wrap {
  margin: 0 auto;
  padding: 60px 0;
  width: 95%;
  max-width: 650px;
}

.required-info {
  font-size: 14px;
  margin-top: 32px;
  color: red;
}

.big-notice {
  text-align: center;
  color: gray;
  font-style: italic;
}

.form-error-description {
  margin: 14px 10px;
  font-size: 14px;
  background: #fb6262;
  font-weight: bold;
  color: white;
  border-radius: 18px;
  padding: 5px 20px;
}
</style>
