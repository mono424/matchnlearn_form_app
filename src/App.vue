<template>
<div class="wrap">
  <Card title="Sign me up right now!" :primary="true">
    We timed it, it only takes 1.5 minute to fill out!
    <div class="required-info">
      * Required
    </div>
  </Card>

  <Card title="Email" :required="true" :error="validationErrors.email">
    <BField :type="validationErrors.email ? 'is-danger' : ''">
      <BInput v-model="userInput.email" placeholder="max.mustermann@gmail.com" rounded></BInput>
    </BField>
  </Card>

  <Card title="What is the main goal you want to achieve with MatchNLearn?" :required="true" :error="validationErrors.goal">
    <RadioGroup :items="goals" v-model="userInput.goal" />
  </Card>

  <Card title="What is your faculty?" :required="true" :error="validationErrors.faculty">
    <RadioGroup :items="faculties" v-model="userInput.faculty" />
  </Card>

  <Card title="Which courses do you want to find learning partners for?" description='Please specify the names of the lecture(s) in the "Other" option and separate them with "/" if they are not listed below' :required="true" :error="validationErrors.courses">
    <CourseSelect v-model="userInput.courses" />
  </Card>

  <Card title="Which year are you into your studies?" :required="true" :error="validationErrors.studyStatus">
    <RadioMatrix :rows="degrees" :cols="years" v-model="userInput.studyStatus" />
  </Card>

  <Card title="How did you perceive the previous semester?" :required="true" :error="validationErrors.prevSemesterExperience">
    <RadioGroup :items="experiences" v-model="userInput.prevSemesterExperience" />
  </Card>

  <Card title="What is your general attitude towards the coursework at the university?" :required="true" :error="validationErrors.attitude">
    <RadioGroup :items="attitudes" v-model="userInput.attitude" />
  </Card>

  <Card title="What shall we call you?" :required="true" :error="validationErrors.name">
    <BField :type="validationErrors.name ? 'is-danger' : ''">
      <BInput v-model="userInput.name" placeholder="Max Mustermann" rounded></BInput>
    </BField>
  </Card>

  <Card title="Phone Number" description="Please provide your Whatsapp number, so once there is a match, we can put you in a group" :error="validationErrors.phoneNumber" :required="true">
    <BField :type="validationErrors.phoneNumber ? 'is-danger' : ''">
      <BInput v-model="userInput.phoneNumber" placeholder="+49 44 444444444" rounded></BInput>
    </BField>
  </Card>

  <Card title="What are your hobbies?" :required="false">
    <BInput v-model="userInput.hobbies" placeholder="Swimming, Ping Pong, ..." rounded></BInput>
  </Card>

  <Card title="What is your favorite way of learning in groups?" :required="false">
    <BInput v-model="userInput.favWayOfLeanrning" placeholder="I really enjoy ..." rounded></BInput>
  </Card>

  <Card title="Can you briefly describe the type of people you would like to get matched with?" :required="false">
    <BInput v-model="userInput.peoplePreference" placeholder="They should be ..." rounded></BInput>
  </Card>

  <Card title="What group size do you prefer for your learning group?" description="Science shows groups of two or three are most effective for discussion-based learning" :error="validationErrors.groupSize" :required="true">
    <RadioGroup :items="groupSizes" v-model="userInput.groupSize" />
  </Card>

  <Card title="Any other comments you'd like to add?" :required="false">
    <BInput v-model="userInput.comment" placeholder="" rounded></BInput>
  </Card>

  <div class="actions">
    <div v-if="errorDescription" class="form-error-description">{{ errorDescription }}</div>
    <BButton type="is-primary" @click="send">Sign up</BButton>
  </div>
</div>
</template>

<script setup>
import { string, util, isValid } from 'valid.js'
import constants from './constants.js';
import Card from './components/Card.vue';
import RadioGroup from './components/RadioGroup.vue';
import CourseSelect from './components/CourseSelect.vue';
import RadioMatrix from './components/RadioMatrix.vue';

const { errors } = constants;

export default {
  name: 'App',
  data: () =>  ({
    validationFailed: false,
    validationErrors: {
      email: false,
      name: false,
      phoneNumber: false,
      goal: false,
      faculty: false,
      courses: false,
      studyStatus: false,
      prevSemesterExperience: false,
      attitude: false,
      groupSize: false,
    },
    userInput: {
      email: "",
      name: "",
      phoneNumber: "",
      goal: null,
      faculty: null,
      courses: [],
      studyStatus: [],
      prevSemesterExperience: null,
      attitude: null,
      hobbies: "",
      favWayOfLeanrning: "",
      peoplePreference: "",
      groupSize: null,
    },
    groupSizes: [
      { title: "2", value: "2" },
      { title: "3", value: "3" },
      { title: "Both sounds good!", value: "both" },
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
    goals: [
      { title: "Make new friends", value: "new_friends" },
      { title: "Find new study partners to learn more effectively", value: "study_partners" },
      { title: "Not sure, just trying it out", value: "not_sure" },
    ],
    faculties: [
      { title: "Informatics (IN)", value: "in" },
      { title: "School of Management (WI)", value: "wi" },
      { title: "Mechanical Engineering (MW)", value: "mw" },
      { title: "Electrical Engineering (EI)", value: "ei" },
    ]
  }),
  computed: {
    errorDescription() {
      if (this.validationFailed) return "Failed: Please make sure to fill all fields in the right manner!";
      return null;
    }
  },
  methods: {
    send() {
      this.validationFailed = false;
      this.validate();
      if (Object.values(this.validationErrors).some(e => !!e)) {
        this.validationFailed = true;
        return;
      }
    },
    validate() {
      let validationErrors = { ...this.validationErrors };
      validationErrors.email = isValid(this.userInput.email, [util.isEmail, util.isRequired]) ? false : errors.badFormat;
      validationErrors.name = this.userInput.name.length > 1 ? false : errors.badFormat;
      validationErrors.phoneNumber = 
        isValid(this.userInput.phoneNumber, [string.regex(new RegExp("^\\+[0-9\\s]+")), util.isRequired]) 
        ? false 
        : errors.badFormat;
      validationErrors.goal = this.userInput.goal !== null ? false : errors.emptyRequired;
      validationErrors.faculty = this.userInput.faculty !== null  ? false : errors.emptyRequired;
      validationErrors.courses = this.userInput.courses.length > 0  ? false : errors.emptyRequired;
      validationErrors.studyStatus = this.userInput.studyStatus.length > 0  ? false : errors.emptyRequired;
      validationErrors.prevSemesterExperience = this.userInput.prevSemesterExperience !== null ? false : errors.emptyRequired;
      validationErrors.attitude = this.userInput.attitude !== null ? false : errors.emptyRequired;
      validationErrors.groupSize = this.userInput.groupSize !== null ? false : errors.emptyRequired;
      this.validationErrors = validationErrors;
    }
  },
  components: {
    Card,
    RadioGroup,
    CourseSelect,
    RadioMatrix,
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
