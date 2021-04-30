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

  <Card title="Which courses do you want to find learning partners for?" description='Choose up to 4 courses (please choose only courses that you take for sure)' :required="true" :error="validationErrors.courses">
    <CourseSelect v-model="userInput.courses" />
  </Card>

  <Card title="What is your faculty?" :required="true" :error="validationErrors.faculty">
    <RadioGroup :items="faculties" v-model="userInput.faculty" />
  </Card>

  <Card title="What is your year of study?" :required="true" :error="validationErrors.studyStatus">
    <RadioMatrix :rows="degrees" :cols="years" v-model="userInput.studyStatus" />
  </Card>

  <Card title="How did you perceive the previous semester?" :required="true" :error="validationErrors.prevSemesterExperience">
    <RadioGroup :items="experiences" v-model="userInput.prevSemesterExperience" />
  </Card>

  <Card title="What is your general attitude towards the coursework at the university?" :required="true" :error="validationErrors.attitude">
    <RadioGroup :items="attitudes" v-model="userInput.attitude" />
  </Card>

  <Card title="What is your preferred language in a group?" :required="true" :error="validationErrors.language">
    <RadioGroup :items="languages" v-model="userInput.language" />
  </Card>

  <Card title="What is your preferred group size?" description="Science shows groups of two or three are most effective for discussion-based learning" :error="validationErrors.groupSize" :required="true">
    <RadioGroup :items="groupSizes" v-model="userInput.groupSize" />
  </Card>

  <Card title="What are your preferences regarding your learning groups?" description="tick all that applies" :required="false">
    <CheckGroup :items="preferences" v-model="userInput.preferences" />
  </Card>

  <Card title="Would you like to get matched with people from other study programs that study the same course?" :error="validationErrors.programScope" :required="true">
    <RadioGroup :items="programScopes" v-model="userInput.programScope" />
  </Card>

  <Card title="Phone number (WA)" description="Please provide your Whatsapp number, so once there is a match, we can put you in a group" :error="validationErrors.phoneNumber" :required="true">
    <BField :type="validationErrors.phoneNumber ? 'is-danger' : ''">
      <BInput name="phone" v-model="userInput.phoneNumber" placeholder="+49 1511 1111111" rounded></BInput>
    </BField>
  </Card>

  <Card title="Any other comments you'd like to add?" :required="false">
    <BInput v-model="userInput.comment" placeholder="" rounded></BInput>
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
import RadioGroup from './components/RadioGroup.vue';
import CourseSelect from './components/CourseSelect.vue';
import RadioMatrix from './components/RadioMatrix.vue';
import CheckGroup from './components/CheckGroup.vue';
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
      faculty: false,
      language: false,
      programScope: false,
      courses: false,
      studyStatus: false,
      prevSemesterExperience: false,
      attitude: false,
      groupSize: false,
      confirm: false,
    },
    userInput: {
      name: "",
      phoneNumber: "",
      faculty: null,
      language: null,
      programScope: null,
      preferences: [],
      courses: [],
      studyStatus: [],
      prevSemesterExperience: null,
      attitude: null,
      groupSize: null,
      comment: "",
    },
    preferences: [
      { title: "Study sessions should be fun", value: "fun" },
      { title: "Productivity is paramount", value: "productivity" },
      { title: "I am in Munich and I'd like to meet with my peers physically", value: "munich" }
    ],
    programScopes: [
      { title: "Sure, I don't mind", value: "all" },
      { title: "No, I only want to get to know people from my program", value: "only_my_program" }
    ],
    languages: [
      { title: "German", value: "german" },
      { title: "English", value: "english" },
      { title: "Both are fine", value: "both" },
    ],
    groupSizes: [
      { title: "2", value: "2" },
      { title: "3", value: "3" },
      { title: "More than three", value: "3+" },
      { title: "Dont care", value: "dont_care" },
    ],
    attitudes: [
      { title: "I absolutely love what I am learning, thus I often go beyond course requirement 🤟", value: "learning_lover" },
      { title: "I want to score the highest grade possible, and am willing to do whatever it takes ✊", value: "score_chaser" },
      { title: "I wanna do well in an efficient manner 👌", value: "efficient" },
      { title: "I wanna pass 🙏", value: "pass_prayer" },
    ],
    experiences: [
      { title: "Easy peasy 😁", value: "easy" },
      { title: "Alright 😐", value: "alright" },
      { title: "Difficult 😥", value: "difficult" },
      { title: "I was struggling a lot 😵", value: "struggeling" },
      { title: "This is my first semester in my current studies", value: "first_semester" },
    ],
    degrees: [
      { title: "Bachelors", value: "ba" },
      { title: "Masters", value: "ma" },
    ],
    years: [
      { title: "1st Year", value: "1" },
      { title: "2nd Year", value: "2" },
      { title: "3rd Year", value: "3" },
      { title: "4th Year or above", value: "4+" },
    ],
    faculties: [
      { title: "Informatics (IN)", value: "in" },
      { title: "School of Management (WI)", value: "wi" },
      { title: "Mechanical Engineering (MW)", value: "mw" },
      { title: "Electrical Engineering (EI)", value: "ei" },
      { title: "Other", value: "other" },
    ]
  }),
  computed: {
    errorDescription() {
      if (this.validationFailed) return "Failed: Please make sure to fill all fields in the right manner!";
      return null;
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
          studyStatus: { degree: this.userInput.studyStatus[0], year: this.userInput.studyStatus[1] }
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
      validationErrors.studyStatus = this.userInput.studyStatus.length > 0  ? false : errors.emptyRequired;
      validationErrors.prevSemesterExperience = this.userInput.prevSemesterExperience !== null ? false : errors.emptyRequired;
      validationErrors.attitude = this.userInput.attitude !== null ? false : errors.emptyRequired;
      validationErrors.groupSize = this.userInput.groupSize !== null ? false : errors.emptyRequired;
      validationErrors.language = this.userInput.language !== null ? false : errors.emptyRequired;
      validationErrors.programScope = this.userInput.programScope !== null ? false : errors.emptyRequired;
      validationErrors.confirm = !this.confirm ? errors.emptyRequired : false;
      this.validationErrors = validationErrors;
      console.log(this.validationErrors)
    }
  },
  components: {
    Card,
    RadioGroup,
    CourseSelect,
    RadioMatrix,
    Summary,
    CheckGroup,
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
