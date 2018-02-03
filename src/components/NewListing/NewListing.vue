<template>
  <v-layout>
    <v-flex xs12 md4 offset-md4>
      <h2 class="pt-4 pb-3">Post New Listing</h2>
      <v-form ref="form">
        <v-text-field 
        v-for="item in inputsArr" 
        :type="item.type"
        :key="item.label" 
        :label="item.label"
        v-model="formData[item.modelProp]"
        required
        maxlength="20"
        :rules="[(value)=>!!value || 'This field is required']"
        ></v-text-field>
        <v-text-field
        label="Additional Info such as meeting point & time"
        v-model="formData.additionalNote"
        textarea
        maxlength="100"
        :counter="100"
        ></v-text-field>
        <v-btn block class="orange" @click="submitForm" :loading="loadingIcon" :disabled="!showSubmitBtn">Submit</v-btn>
        <v-snackbar
        top
        multi-line
        v-model="snackbar"
        >{{snackbarText}}
         <v-btn flat color="orange" @click.native="snackbar = false">Close</v-btn>
       </v-snackbar>
      </v-form>
    </v-flex>
  </v-layout>
</template>


<script>
import axios from "axios";
import gql from "graphql-tag";
import moment from "moment";
export default {
  data() {
    return {
      snackbarText: "",
      snackbar: false,
      loadingIcon: false,
      formData: {
        to: "",
        from: "",
        vehicle: "",
        passengers: "",
        additionalNote: "",
        travelDate: ""
      },
      inputsArr: [
        { label: "Travel Date", modelProp: "travelDate", type: "date" },
        { label: "Starting Place", modelProp: "from", type: "text" },
        { label: "Destination Place", modelProp: "to", type: "text" },
        { label: "Vehicle Type", modelProp: "vehicle", type: "text" },
        {
          label: "Number of passengers allowed",
          modelProp: "passengers",
          type: "number"
        }
      ]
    };
  },

  methods: {
    submitForm() {
      this.loadingIcon = true;
      let newFormData = Object.assign({}, this.formData);
      newFormData.owner = this.$store.state.loggedInUser;
      newFormData.datePosted = moment(Date.now()).format("DD/MM/YYYY");
      this.submitFormPartTwo(newFormData);
    },
    submitFormPartTwo(formData) {
      let vm = this;
      const myMutation = gql`
        mutation($input: formData!) {
          createNewAd(input: $input) {
            _id
            to
            from
            travelDate
          }
        }
      `;
      this.$apollo
        .mutate({
          mutation: myMutation,
          fetchPolicy: "network-only",
          variables: {
            input: formData
          }
        })
        .then(res => vm.submitFormSuccess())
        .catch(err => vm.submitFormFail());
    },
    submitFormSuccess() {
      this.loadingIcon = false;
      this.snackbar = true;
      this.snackbarText = "Your Ad is up and running successfully!";
      this.$refs.form.reset();
    },
    submitFormFail() {
      this.loadingIcon = false;
      this.snackbar = true;
      this.snackbarText = "Couldn't post your ad, try again later";
    }
  },

  computed: {
    authHeader() {
      return this.$store.state.myPool
        .getCurrentUser()
        .getSession((err, session) => {
          if (err) {
            return err;
          }
          return session.isValid() ? session.getIdToken().getJwtToken() : null;
        });
    },
    showSubmitBtn() {
      let fd = this.formData;
      return fd.to && fd.from && fd.vehicle && fd.passengers && fd.travelDate
        ? true
        : false;
    }
  }
};
</script>
