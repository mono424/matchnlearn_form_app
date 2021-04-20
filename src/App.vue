<template>
<div class="wrap">
  <Card title="Sign me up right now!" :primary="true">
    We timed it, it only takes 1.5 minute to fill out!
  </Card>

  <Card title="Email" :required="true">
    <BInput  placeholder="max.mustermann@gmail.com" rounded></BInput>
  </Card>

  <Card title="What is the main goal you want to achieve with MatchNLearn?" :required="true">
    <RadioGroup :items="goals" v-model="userInput.goal" />
  </Card>

  <Card title="What is your faculty?" :required="true">
    <RadioGroup :items="faculties" v-model="userInput.faculty" />
  </Card>

  <Card title="Which courses do you want to find learning partners for?" description='Please specify the names of the lecture(s) in the "Other" option and separate them with "/" if they are not listed below' :required="true">
    <CourseSelect v-model="userInput.courses" />
  </Card>

  <Card title="Which year are you into your studies?" :required="true">
    <RadioMatrix :rows="degrees" :cols="years" v-model="userInput.studyStatus" />
  </Card>

  <Card title="How did you perceive the previous semester?" :required="true">
    <RadioGroup :items="experiences" v-model="userInput.prevSemesterExperience" />
  </Card>

  <Card title="What is your general attitude towards the coursework at the university?" :required="true">
    <RadioGroup :items="attitudes" v-model="userInput.attitude" />
  </Card>

  <Card title="What shall we call you?" :required="true">
    <BInput  placeholder="Max Mustermann" rounded></BInput>
  </Card>

  <Card title="Phone Number" description="Please provide your Whatsapp number, so once there is a match, we can put you in a group" :required="true">
    <BInput  placeholder="+49 44 444444444" rounded></BInput>
  </Card>

  <Card title="What are your hobbies?" :required="false">
    <BInput  placeholder="Swimming, Ping Pong, ..." rounded></BInput>
  </Card>

  <Card title="What is your favorite way of learning in groups?" :required="false">
    <BInput  placeholder="I really enjoy ..." rounded></BInput>
  </Card>

  <Card title="Can you briefly describe the type of people you would like to get matched with?" :required="false">
    <BInput  placeholder="They should be ..." rounded></BInput>
  </Card>

  <Card title="What group size do you prefer for your learning group?" description="Science shows groups of two or three are most effective for discussion-based learning" :required="false">
    <RadioGroup :items="groupSizes" v-model="userInput.groupSize" />
  </Card>

  <Card title="Any other comments you'd like to add?" :required="false">
    <BInput  placeholder="" rounded></BInput>
  </Card>
</div>
</template>

<script setup>
import Card from './components/Card.vue';
import RadioGroup from './components/RadioGroup.vue';
import CourseSelect from './components/CourseSelect.vue';
import RadioMatrix from './components/RadioMatrix.vue';

export default {
  name: 'App',
  data: () =>  ({
    userInput: {
      goal: null,
      faculty: null,
      courses: [],
      studyStatus: [],
      prevSemesterExperience: null,
      attitude: null,
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
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  margin-top: 60px;
}

.wrap {
  margin: 0 auto;
  width: 95%;
  max-width: 650px;
}
</style>
